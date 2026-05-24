import { useEffect, useId, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Clock3, Cog, GripVertical, ImagePlus, Loader2, RefreshCw, Sparkles, Trash2, UploadCloud, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ArtworkUploadQueueItem } from "@/types/admin/artwork";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

interface ArtworkUploaderValue {
  imageUrl: string;
  imageFilename: string;
}

interface ArtworkUploaderProps {
  mode?: "single" | "multiple";
  value?: ArtworkUploaderValue;
  queueItems?: ArtworkUploadQueueItem[];
  selectedCategoryLabel?: string;
  onChange?: (value: ArtworkUploaderValue & { file: File | null }) => void;
  onQueueAdd?: (files: File[]) => void;
  onQueueRemove?: (itemId: string) => void;
  onQueueReorder?: (fromIndex: number, toIndex: number) => void;
  onQueueUpdate?: (itemId: string, updates: Partial<ArtworkUploadQueueItem>) => void;
  error?: string;
}

const formatBytes = (bytes: number) => {
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const uploadStatusConfig: Record<
  ArtworkUploadQueueItem["status"],
  {
    label: string;
    icon: typeof Clock3;
    pillClassName: string;
    barClassName: string;
    cardClassName: string;
  }
> = {
  queued: {
    label: "Queued",
    icon: Clock3,
    pillClassName: "border-white/10 bg-black/30 text-white/70",
    barClassName: "bg-white/25",
    cardClassName: "border-white/10 shadow-[0_0_18px_rgba(255,255,255,0.06)]",
  },
  uploading: {
    label: "Uploading",
    icon: Loader2,
    pillClassName: "border-neon-cyan/20 bg-neon-cyan/10 text-neon-cyan",
    barClassName: "bg-[linear-gradient(90deg,rgba(34,211,238,0.95),rgba(192,132,252,0.9))]",
    cardClassName: "border-neon-cyan/30 shadow-[0_0_32px_rgba(34,211,238,0.18)]",
  },
  processing: {
    label: "Processing",
    icon: Cog,
    pillClassName: "border-amber-300/20 bg-amber-400/10 text-amber-200",
    barClassName: "bg-[linear-gradient(90deg,rgba(250,204,21,0.92),rgba(34,211,238,0.92))]",
    cardClassName: "border-amber-300/25 shadow-[0_0_30px_rgba(250,204,21,0.15)]",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    pillClassName: "border-emerald-400/20 bg-emerald-500/10 text-emerald-200",
    barClassName: "bg-emerald-400",
    cardClassName: "border-emerald-400/30 shadow-[0_0_28px_rgba(16,185,129,0.22)]",
  },
  failed: {
    label: "Failed",
    icon: AlertTriangle,
    pillClassName: "border-red-400/20 bg-red-500/10 text-red-200",
    barClassName: "bg-red-400",
    cardClassName: "border-red-400/30 shadow-[0_0_28px_rgba(248,113,113,0.18)] animate-[pulse_2.2s_ease-in-out_infinite]",
  },
};

const ArtworkUploader = ({
  mode = "single",
  value,
  queueItems = [],
  selectedCategoryLabel,
  onChange,
  onQueueAdd,
  onQueueRemove,
  onQueueReorder,
  onQueueUpdate,
  error,
}: ArtworkUploaderProps) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);
  const queuePreviewUrlsRef = useRef<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(value?.imageUrl ?? "");
  const dragIndexRef = useRef<number | null>(null);

  useEffect(() => {
    if (!value) {
      return;
    }

    if (value.imageUrl.startsWith("data:image/")) {
      return;
    }

    setPreviewUrl(value.imageUrl);
  }, [value]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      queuePreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const clearObjectUrl = () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  };

  const validateFile = (file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Unsupported file type",
        description: "Upload PNG, JPG, JPEG, WEBP, or GIF artwork only.",
        variant: "destructive",
      });
      return false;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast({
        title: "File exceeds studio limit",
        description: "Artwork uploads must be 10MB or smaller.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const processFile = async (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    setIsLoading(true);
    clearObjectUrl();

    const localPreviewUrl = URL.createObjectURL(file);
    objectUrlRef.current = localPreviewUrl;
    setPreviewUrl(localPreviewUrl);

    try {
      onChange?.({
        imageUrl: localPreviewUrl,
        imageFilename: file.name,
        file,
      });
    } catch (uploadError) {
      clearObjectUrl();
      toast({
        title: "Upload interrupted",
        description: uploadError instanceof Error ? uploadError.message : "The artwork could not be prepared.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (mode === "multiple") {
      const validFiles = files.filter(validateFile);
      if (validFiles.length > 0) {
        onQueueAdd?.(validFiles);
      }
      event.target.value = "";
      return;
    }

    await processFile(files[0]);
    event.target.value = "";
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = Array.from(event.dataTransfer.files ?? []);

    if (files.length === 0) {
      return;
    }

    if (mode === "multiple") {
      const validFiles = files.filter(validateFile);
      if (validFiles.length > 0) {
        onQueueAdd?.(validFiles);
      }
      return;
    }

    await processFile(files[0]);
  };

  const handleRemove = () => {
    clearObjectUrl();
    setPreviewUrl("");
    onChange?.({
      imageUrl: "",
      imageFilename: "",
      file: null,
    });
  };

  const activePreview = previewUrl || value?.imageUrl || "";

  return (
    <div className="grid gap-3">
      <input
        ref={inputRef}
        id={inputId}
        type="file"
        multiple={mode === "multiple"}
        accept=".png,.jpg,.jpeg,.webp,.gif,image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("[data-uploader-action='true']")) {
            return;
          }

          openFilePicker();
        }}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker();
          }
        }}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDrop={handleDrop}
        aria-label="Upload artwork"
        className={cn(
          "group relative overflow-hidden rounded-[1.75rem] border border-dashed bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.03))] p-4 text-left transition-all duration-300",
          "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_0_42px_rgba(34,211,238,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          isDragging
            ? "border-neon-cyan/60 bg-[linear-gradient(135deg,rgba(34,211,238,0.12),rgba(192,132,252,0.12))] shadow-[0_0_54px_rgba(34,211,238,0.22)]"
            : "border-white/12",
          error && "border-red-400/40",
        )}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_bottom_right,rgba(192,132,252,0.1),transparent_38%)] opacity-90" />
        <div className="relative grid gap-4 md:grid-cols-[minmax(0,1fr)_220px] md:items-center">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_0_28px_rgba(192,132,252,0.18)]">
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-neon-cyan" />
                ) : isDragging ? (
                  <Sparkles className="h-5 w-5 text-neon-cyan" />
                ) : (
                  <UploadCloud className="h-5 w-5 text-primary" />
                )}
              </div>
              <div>
                <div className="text-base font-semibold text-foreground">Upload Artwork</div>
                <div className="text-sm text-muted-foreground">Drag & drop artwork here</div>
                <div className="text-sm text-muted-foreground">or click to browse</div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-muted-foreground/80">
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">PNG</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">JPG</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">JPEG</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">WEBP</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">GIF</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1">10MB Max</span>
            </div>

            {mode === "single" && value?.imageFilename ? (
              <div className="mt-4 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-xs text-foreground">
                <ImagePlus className="h-3.5 w-3.5 text-neon-cyan" />
                <span className="truncate">{value.imageFilename}</span>
              </div>
            ) : null}
            {mode === "multiple" ? (
              <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
                  {queueItems.length} in queue
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1">
                  {formatBytes(queueItems.reduce((sum, item) => sum + item.file.size, 0))}
                </span>
                {selectedCategoryLabel ? (
                  <span className="rounded-full border border-neon-cyan/20 bg-neon-cyan/10 px-3 py-1 text-neon-cyan">
                    {selectedCategoryLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="relative">
            <div className="aspect-[4/5] overflow-hidden rounded-[1.4rem] border border-white/10 bg-black/30">
              {mode === "single" && activePreview ? (
                <img src={activePreview} alt="Artwork upload preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(192,132,252,0.12))]">
                  <div className="text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                      <ImagePlus className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="mt-3 px-4 text-sm text-muted-foreground">Live preview locks in here instantly.</p>
                  </div>
                </div>
              )}
            </div>

            {mode === "single" && activePreview ? (
              <div className="mt-3 flex gap-2">
                <Button
                  type="button"
                  data-uploader-action="true"
                  variant="outline"
                  className="flex-1 rounded-full border-white/10 bg-black/20"
                  onClick={openFilePicker}
                >
                  <RefreshCw className="h-4 w-4" />
                  Change
                </Button>
                <Button
                  type="button"
                  data-uploader-action="true"
                  variant="outline"
                  className="rounded-full border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-red-50"
                  onClick={handleRemove}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {mode === "multiple" && queueItems.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {queueItems.map((item, index) => {
            const queuePreview = item.previewUrl || item.imageUrl || "";
            const statusConfig = uploadStatusConfig[item.status];
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={item.id}
                draggable
                onDragStart={() => {
                  dragIndexRef.current = index;
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (dragIndexRef.current === null || dragIndexRef.current === index) {
                    return;
                  }

                  onQueueReorder?.(dragIndexRef.current, index);
                  dragIndexRef.current = null;
                }}
                className={cn(
                  "glass group overflow-hidden rounded-[1.5rem] border bg-white/[0.04] transition-all duration-300 hover:-translate-y-1",
                  statusConfig.cardClassName,
                  item.status === "failed" && "animate-[shake_0.4s_ease-in-out_1]",
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {queuePreview ? (
                    <img src={queuePreview} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,rgba(34,211,238,0.08),rgba(192,132,252,0.12))]">
                      <div className="text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.06]">
                          <ImagePlus className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <p className="mt-3 px-4 text-sm text-muted-foreground">Preview pending</p>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent,rgba(4,6,18,0.85))]" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <span className="rounded-full border border-white/10 bg-black/30 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-white/80">
                      {selectedCategoryLabel || item.category}
                    </span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.22em]", statusConfig.pillClassName)}>
                      <StatusIcon className={cn("h-3 w-3", item.status === "uploading" && "animate-spin", item.status === "processing" && "animate-spin")} />
                      {statusConfig.label}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onQueueRemove?.(item.id)}
                    className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/40 p-2 text-white/80 transition hover:bg-black/60 hover:text-white"
                    aria-label={`Remove ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div
                      className={cn(
                        "h-full transition-all duration-500",
                        statusConfig.barClassName,
                      )}
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-3 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <input
                        value={item.title}
                        onChange={(event) =>
                          onQueueUpdate?.(item.id, {
                            title: event.target.value,
                            slug: event.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9]+/g, "-")
                              .replace(/^-+|-+$/g, ""),
                          })
                        }
                        className="w-full bg-transparent text-sm font-semibold text-foreground outline-none placeholder:text-muted-foreground"
                      />
                      <p className="mt-1 truncate text-xs text-muted-foreground">{item.filename}</p>
                    </div>
                    <GripVertical className="mt-1 h-4 w-4 shrink-0 text-muted-foreground/70" />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
                    <span className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Featured</span>
                    <button
                      type="button"
                      onClick={() => onQueueUpdate?.(item.id, { featured: !item.featured })}
                      className={cn(
                        "rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] transition",
                        item.featured
                          ? "bg-amber-400/15 text-amber-200 shadow-[0_0_18px_rgba(251,191,36,0.18)]"
                          : "bg-white/[0.05] text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {item.featured ? "On" : "Off"}
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">{formatBytes(item.file.size)}</span>
                    <div className="flex items-center gap-2">
                      {item.status === "failed" ? (
                        <button
                          type="button"
                          onClick={() => onQueueUpdate?.(item.id, { status: "queued", progress: 0, error: undefined })}
                          className="rounded-full border border-red-400/20 bg-red-500/10 px-2 py-1 text-[10px] uppercase tracking-[0.18em] text-red-100 transition hover:bg-red-500/20"
                        >
                          Retry
                        </button>
                      ) : null}
                      <span className="flex items-center gap-1 text-muted-foreground">
                        {item.status === "completed" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : null}
                        {item.status === "failed" ? <XCircle className="h-3.5 w-3.5 text-red-300" /> : null}
                        {(item.status === "uploading" || item.status === "processing") ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin text-neon-cyan" />
                        ) : null}
                        {item.error ? item.error : `${item.progress}%`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-300">{error}</p> : null}
    </div>
  );
};

export default ArtworkUploader;
