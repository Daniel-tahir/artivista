import { useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, BarChart3, CheckCircle2, Clock3, Eye, Layers3, Loader2, Sparkles, UploadCloud, ImageOff } from "lucide-react";
import ArtworkUploader from "@/components/admin/ArtworkUploader";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import type {
  AdminArtworkCategory,
  ArtworkFormData,
  ArtworkFormErrors,
  ArtworkUploadQueueItem,
} from "@/types/admin/artwork";
import { createEmptyArtworkForm, parseTags, validateArtworkForm } from "@/utils/admin/artwork-form";
import { cn } from "@/lib/utils";

interface AdminArtworkFormDialogProps {
  open: boolean;
  mode: "create" | "edit";
  categories: AdminArtworkCategory[];
  initialData?: ArtworkFormData;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ArtworkFormData) => Promise<void>;
  onSubmitBatch?: (
    items: ArtworkUploadQueueItem[],
    onProgress: (itemId: string, progress: number, status: ArtworkUploadQueueItem["status"], error?: string) => void,
  ) => Promise<PromiseSettledResult<unknown>[]>;
}

const previewCardClass =
  "overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] shadow-[0_18px_60px_-35px_rgba(192,132,252,0.4)]";

const AdminArtworkFormDialog = ({
  open,
  mode,
  categories,
  initialData,
  onOpenChange,
  onSubmit,
  onSubmitBatch,
}: AdminArtworkFormDialogProps) => {
  const [form, setForm] = useState<ArtworkFormData>(createEmptyArtworkForm());
  const [errors, setErrors] = useState<ArtworkFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewFailed, setPreviewFailed] = useState(false);
  const [queueItems, setQueueItems] = useState<ArtworkUploadQueueItem[]>([]);
  const uploadStartedAtRef = useRef<number | null>(null);

  const selectedCategoryLabel = categories.find((category) => category.value === form.category)?.label ?? "";

  useEffect(() => {
    if (!open) {
      return;
    }

    const seedForm = initialData ?? createEmptyArtworkForm();
    setForm({
      ...seedForm,
      category: seedForm.category || categories[0]?.value || "",
      imageFile: null,
    });
    setErrors({});
    setPreviewFailed(false);
    setIsSubmitting(false);
    setQueueItems([]);
    uploadStartedAtRef.current = null;
  }, [categories, initialData, open]);

  const parsedTags = useMemo(() => parseTags(form.tags), [form.tags]);
  const queueStats = useMemo(
    () => ({
      totalCount: queueItems.length,
      totalSize: queueItems.reduce((sum, item) => sum + item.file.size, 0),
      completed: queueItems.filter((item) => item.status === "completed").length,
      failed: queueItems.filter((item) => item.status === "failed").length,
      uploading: queueItems.filter((item) => item.status === "uploading").length,
      processing: queueItems.filter((item) => item.status === "processing").length,
      queued: queueItems.filter((item) => item.status === "queued").length,
    }),
    [queueItems],
  );
  const overallProgress = useMemo(() => {
    if (queueItems.length === 0) {
      return 0;
    }

    const totalProgress = queueItems.reduce((sum, item) => sum + item.progress, 0);
    return Math.round(totalProgress / queueItems.length);
  }, [queueItems]);
  const uploadSummary = useMemo(() => {
    const activeCount = queueStats.uploading + queueStats.processing;
    const hasStarted = queueItems.some((item) => item.progress > 0 || item.status !== "queued");
    const remaining = Math.max(queueStats.totalCount - queueStats.completed - queueStats.failed, 0);
    const elapsedSeconds = uploadStartedAtRef.current ? Math.max((Date.now() - uploadStartedAtRef.current) / 1000, 1) : 0;
    const averageSecondsPerCompleted = queueStats.completed > 0 ? elapsedSeconds / queueStats.completed : 0;
    const estimatedRemainingSeconds =
      averageSecondsPerCompleted > 0 ? Math.max(Math.round(averageSecondsPerCompleted * remaining), 0) : 0;

    return {
      activeCount,
      hasStarted,
      remaining,
      estimatedRemainingSeconds,
      isComplete: hasStarted && remaining === 0,
    };
  }, [queueItems, queueStats]);

  const handleSubmit = async () => {
    const nextErrors = validateArtworkForm(form);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(form);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBatchSubmit = async () => {
    if (!form.category) {
      setErrors({ category: "Category is required." });
      return;
    }

    if (queueItems.length === 0 || !onSubmitBatch) {
      setErrors({ imageUrl: "Add at least one artwork to the upload queue." });
      return;
    }

    setIsSubmitting(true);
    uploadStartedAtRef.current = Date.now();
    setQueueItems((current) =>
      current.map((item) => ({
        ...item,
        status: item.status === "completed" ? "completed" : "queued",
        progress: item.status === "completed" ? 100 : 0,
        error: undefined,
      })),
    );

    try {
      const results = await onSubmitBatch(queueItems, (itemId, progress, status, error) => {
        setQueueItems((current) =>
          current.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  progress,
                  status,
                  error,
                }
              : item,
          ),
        );
      });
      let hasQueuedFailures = false;

      results.forEach((result, index) => {
        const item = queueItems[index];
        if (!item) {
          return;
        }

        if (result.status === "rejected") {
          hasQueuedFailures = true;
          setQueueItems((current) =>
            current.map((entry) =>
              entry.id === item.id
                ? {
                    ...entry,
                    status: "failed",
                    progress: Math.min(entry.progress, 90),
                    error: result.reason instanceof Error ? result.reason.message : "Upload failed",
                  }
                : entry,
            ),
          );
        }
      });

      if (!hasQueuedFailures) {
        onOpenChange(false);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQueueAdd = (files: File[]) => {
    if (!form.category) {
      setErrors({ category: "Select a category before adding artworks." });
      return;
    }

    const nextItems = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      const filename = file.name;
      const title = filename
        .replace(/\.[^.]+$/, "")
        .replace(/[_-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/\b\w/g, (char) => char.toUpperCase());
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        id: `${slug}-${crypto.randomUUID()}`,
        file,
        previewUrl,
        imageUrl: "",
        title,
        slug,
        filename,
        category: form.category,
        description: "",
        tags: "",
        featured: false,
        price: "",
        animeSeries: "",
        status: "queued" as const,
        progress: 0,
      };
    });

    setQueueItems((current) => [...current, ...nextItems]);
    setErrors((current) => ({ ...current, imageUrl: undefined, category: undefined }));
  };

  const updateQueueItem = (itemId: string, updates: Partial<ArtworkUploadQueueItem>) => {
    setQueueItems((current) =>
      current.map((item) => (item.id === itemId ? { ...item, ...updates } : item)),
    );
  };

  const removeQueueItem = (itemId: string) => {
    setQueueItems((current) => {
      const target = current.find((item) => item.id === itemId);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return current.filter((item) => item.id !== itemId);
    });
  };

  const reorderQueueItems = (fromIndex: number, toIndex: number) => {
    setQueueItems((current) => {
      const next = [...current];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  };

  useEffect(() => {
    return () => {
      queueItems.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
    // We only want final unmount cleanup for whatever remains in the queue.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFieldChange = <K extends keyof ArtworkFormData>(key: K, value: ArtworkFormData[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto rounded-[2rem] border-white/10 bg-[radial-gradient(circle_at_top,rgba(59,23,92,0.95),rgba(8,10,20,0.98))] p-0 text-foreground shadow-[0_40px_120px_-50px_rgba(0,0,0,0.95)]">
        {mode === "create" && uploadSummary.hasStarted ? (
          <div className="sticky top-0 z-20 border-b border-white/10 bg-[linear-gradient(180deg,rgba(12,9,26,0.96),rgba(12,9,26,0.9))] px-6 py-4 backdrop-blur-xl">
            <div className="glass rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_18px_60px_-36px_rgba(34,211,238,0.28)]">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-neon-cyan">
                    <UploadCloud className="h-4 w-4" />
                    Uploading Artworks
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">
                    {overallProgress}% complete
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {queueStats.completed} / {queueStats.totalCount} completed
                    {uploadSummary.estimatedRemainingSeconds > 0 ? `, ~${uploadSummary.estimatedRemainingSeconds} seconds remaining` : ""}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-4 xl:min-w-[460px]">
                  {[
                    { label: "Completed", value: queueStats.completed, tone: "text-emerald-300", Icon: CheckCircle2 },
                    { label: "Uploading", value: uploadSummary.activeCount, tone: "text-neon-cyan", Icon: Loader2 },
                    { label: "Queued", value: queueStats.queued, tone: "text-white/80", Icon: Layers3 },
                    { label: "Failed", value: queueStats.failed, tone: "text-red-300", Icon: AlertTriangle },
                  ].map(({ label, value, tone, Icon }) => (
                    <div key={label} className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3">
                      <div className={`flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] ${tone}`}>
                        <Icon className={cn("h-3.5 w-3.5", label === "Uploading" && uploadSummary.activeCount > 0 && "animate-spin")} />
                        {label}
                      </div>
                      <div className="mt-2 text-lg font-semibold text-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,rgba(192,132,252,0.95),rgba(34,211,238,0.95),rgba(250,204,21,0.9))] transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              {uploadSummary.isComplete ? (
                <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-semibold text-foreground">
                      {queueStats.completed} artworks uploaded successfully
                    </div>
                    <div className="mt-1 text-sm text-muted-foreground">
                      {queueStats.failed > 0 ? `${queueStats.failed} failed uploads need attention.` : "All queued uploads completed cleanly."}
                    </div>
                  </div>
                  {queueStats.failed > 0 ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-red-50"
                      onClick={() =>
                        setQueueItems((current) =>
                          current.map((item) =>
                            item.status === "failed"
                              ? { ...item, status: "queued", progress: 0, error: undefined }
                              : item,
                          ),
                        )
                      }
                    >
                      Retry Failed
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ) : null}
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="border-b border-white/10 p-6 lg:border-b-0 lg:border-r">
            <DialogHeader className="text-left">
              <div className="eyebrow text-[0.62rem] text-primary/80">{mode === "create" ? "New Entry" : "Edit Sequence"}</div>
              <DialogTitle className="mt-2 text-3xl font-semibold tracking-[-0.04em]">
                {mode === "create" ? "Bulk upload studio" : "Refine artwork metadata"}
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                {mode === "create"
                  ? "Select a category, drop multiple artworks, review the cinematic queue, and publish the entire set in one beautiful batch."
                  : "Curate title, copy, category, image source, and collector-facing metadata with a live preview before saving."}
              </DialogDescription>
            </DialogHeader>

            <div className="mt-6 grid gap-5">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(value: ArtworkFormData["category"]) => handleFieldChange("category", value)}>
                  <SelectTrigger className={cn("rounded-2xl border-white/10 bg-black/20", errors.category && "border-red-400/40")}>
                    <SelectValue placeholder="Select category first" />
                  </SelectTrigger>
                  <SelectContent className="border-white/10 bg-[#12071f]/95 text-foreground backdrop-blur-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category ? <p className="text-xs text-red-300">{errors.category}</p> : null}
              </div>

              {mode === "create" ? (
                <>
                  <ArtworkUploader
                    mode="multiple"
                    queueItems={queueItems}
                    selectedCategoryLabel={selectedCategoryLabel}
                    onQueueAdd={handleQueueAdd}
                    onQueueRemove={removeQueueItem}
                    onQueueReorder={reorderQueueItems}
                    onQueueUpdate={updateQueueItem}
                    error={errors.imageUrl}
                  />

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        <Layers3 className="h-4 w-4 text-neon-cyan" />
                        Queue Count
                      </div>
                      <div className="mt-3 text-2xl font-semibold text-foreground">{queueStats.totalCount}</div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        <BarChart3 className="h-4 w-4 text-primary" />
                        Total Size
                      </div>
                      <div className="mt-3 text-2xl font-semibold text-foreground">
                        {(queueStats.totalSize / (1024 * 1024)).toFixed(2)} MB
                      </div>
                    </div>
                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-amber-300" />
                        Completion
                      </div>
                      <div className="mt-3 text-2xl font-semibold text-foreground">
                        {queueStats.completed}/{queueStats.totalCount || 0}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="grid gap-2">
                    <Label htmlFor="artwork-title">Title</Label>
                    <Input
                      id="artwork-title"
                      value={form.title}
                      onChange={(event) => handleFieldChange("title", event.target.value)}
                      className={cn("rounded-2xl border-white/10 bg-black/20", errors.title && "border-red-400/40")}
                      placeholder="Crimson Moon Duelist"
                    />
                    {errors.title ? <p className="text-xs text-red-300">{errors.title}</p> : null}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="artwork-description">Description</Label>
                    <Textarea
                      id="artwork-description"
                      value={form.description}
                      onChange={(event) => handleFieldChange("description", event.target.value)}
                      className={cn("min-h-[120px] rounded-2xl border-white/10 bg-black/20", errors.description && "border-red-400/40")}
                      placeholder="Describe the scene, mood, and use case for this artwork."
                    />
                    {errors.description ? <p className="text-xs text-red-300">{errors.description}</p> : null}
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="artwork-tags">Tags</Label>
                      <Input
                        id="artwork-tags"
                        value={form.tags}
                        onChange={(event) => handleFieldChange("tags", event.target.value)}
                        className={cn("rounded-2xl border-white/10 bg-black/20", errors.tags && "border-red-400/40")}
                        placeholder="anime, duel, neon, premium"
                      />
                      {errors.tags ? <p className="text-xs text-red-300">{errors.tags}</p> : null}
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label>Artwork Image</Label>
                    <ArtworkUploader
                      mode="single"
                      value={{
                        imageUrl: form.imageUrl,
                        imageFilename: form.imageFilename,
                      }}
                      onChange={({ imageUrl, imageFilename, file }) => {
                        handleFieldChange("imageUrl", imageUrl);
                        handleFieldChange("imageFilename", imageFilename);
                        handleFieldChange("imageFile", file);
                        setPreviewFailed(false);
                      }}
                      error={errors.imageUrl}
                    />
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="artwork-price">Optional price</Label>
                      <Input
                        id="artwork-price"
                        value={form.price}
                        onChange={(event) => handleFieldChange("price", event.target.value)}
                        className="rounded-2xl border-white/10 bg-black/20"
                        placeholder="$240"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="artwork-series">Optional anime series</Label>
                      <Input
                        id="artwork-series"
                        value={form.animeSeries}
                        onChange={(event) => handleFieldChange("animeSeries", event.target.value)}
                        className="rounded-2xl border-white/10 bg-black/20"
                        placeholder="Original Anime Concept"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.04] px-4 py-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Featured highlight</p>
                      <p className="text-xs text-muted-foreground">Flag this artwork for premium showcase moments.</p>
                    </div>
                    <Switch checked={form.featured} onCheckedChange={(checked) => handleFieldChange("featured", checked)} />
                  </div>
                </>
              )}
            </div>

            <DialogFooter className="mt-6 flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                variant="outline"
                className="rounded-full border-white/10 bg-black/20"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={mode === "create" ? handleBatchSubmit : handleSubmit}
                disabled={isSubmitting}
                className="rounded-full bg-[linear-gradient(135deg,rgba(192,132,252,0.95),rgba(34,211,238,0.95))] px-6 text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.28)]"
              >
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                {mode === "create" ? "Save All Artworks" : "Update Artwork"}
              </Button>
            </DialogFooter>
          </div>

          <div className="p-6">
            <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="h-4 w-4 text-neon-cyan" />
              {mode === "create" ? "Queue spotlight" : "Live preview"}
            </div>

            <div className={previewCardClass}>
              <div className="relative aspect-[4/5] overflow-hidden bg-[radial-gradient(circle_at_top,rgba(59,23,92,0.9),rgba(3,7,18,0.98))]">
                {(mode === "create" ? queueItems[0]?.previewUrl : form.imageUrl) && !previewFailed ? (
                  <img
                    src={mode === "create" ? queueItems[0]?.previewUrl : form.imageUrl}
                    alt={mode === "create" ? queueItems[0]?.title || "Artwork preview" : form.title || "Artwork preview"}
                    onError={() => setPreviewFailed(true)}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(192,132,252,0.16))]">
                    <div className="text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-white/[0.08]">
                        <ImageOff className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {previewFailed ? "Preview unavailable for this source." : "Artwork preview will appear here."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/65 to-transparent p-5">
                  <div className="eyebrow text-[0.6rem] text-neon-cyan/90">
                    {selectedCategoryLabel || "Artwork"}
                  </div>
                  <h3 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                    {mode === "create" ? queueItems[0]?.title || "Queued artwork preview" : form.title || "Untitled artwork"}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm text-white/75">
                    {mode === "create"
                      ? "Your first queued artwork is spotlighted here while the grid below manages the full batch."
                      : form.description || "A cinematic preview panel for title, mood, and metadata before committing changes."}
                  </p>
                </div>
              </div>

              <div className="space-y-4 p-5">
                {mode === "create" ? (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Completed</div>
                      <div className="mt-2 text-sm text-foreground">{queueStats.completed}</div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Failed</div>
                      <div className="mt-2 text-sm text-foreground">{queueStats.failed}</div>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-2">
                      {parsedTags.length > 0 ? (
                        parsedTags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-xs uppercase tracking-[0.18em] text-muted-foreground"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-muted-foreground">Add comma-separated tags to enrich search and filtering.</span>
                      )}
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Series</div>
                        <div className="mt-2 text-sm text-foreground">{form.animeSeries || "Not assigned"}</div>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                        <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Price</div>
                        <div className="mt-2 text-sm text-foreground">{form.price || "Custom quote"}</div>
                      </div>
                    </div>
                  </>
                )}
                {mode === "create" ? (
                  <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Upload Summary</div>
                    <div className="mt-2 text-sm text-foreground">
                      {queueStats.totalCount === 0
                        ? "Drag multiple artworks to begin your cinematic upload queue."
                        : `${queueStats.totalCount} artworks queued for ${selectedCategoryLabel || "selected category"}.`}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminArtworkFormDialog;
