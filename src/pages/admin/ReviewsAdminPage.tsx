import { useCallback, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Trash2, Upload } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import StarField from "@/components/StarField";
import {
  listReviewImages,
  uploadReviewImage,
  deleteReviewImage,
  type ReviewImageRow,
} from "@/services/reviews/review-images.service";

const ReviewsAdminPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const {
    data: images = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["review-images"],
    queryFn: listReviewImages,
    retry: (failureCount, err) => {
      if (failureCount >= 2) return false;
      if (!navigator.onLine) return false;
      return true;
    },
    staleTime: 30_000,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploadError(null);
      return uploadReviewImage(file);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-images"] });
    },
    onError: (err: Error) => {
      setUploadError(err.message);
      console.error("[review-admin] Upload error — full object:", err);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteReviewImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["review-images"] });
    },
  });

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      uploadMutation.mutate(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
    [uploadMutation],
  );

  return (
    <main className="relative min-h-screen overflow-x-hidden cosmic-bg">
      <StarField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(192,132,252,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <section className="px-4 pb-4 pt-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-6">
              <Link
                to="/admin"
                className="interactive-surface group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground hover:-translate-x-0.5 hover:border-primary/30 hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            <div className="mb-6">
              <h1 className="font-display text-3xl font-bold text-glow">
                Testimonials{" "}
                <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">Manager</span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload, manage, and organize testimonial screenshots. Images appear in the frontend marquee after the next build.
              </p>
            </div>

            <div className="mb-8">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
                className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary transition-all hover:bg-primary/20 hover:shadow-[0_0_24px_hsl(var(--primary)/0.2)] disabled:opacity-50"
              >
                {uploadMutation.isPending ? (
                  <Upload className="h-4 w-4 animate-pulse" />
                ) : (
                  <ImagePlus className="h-4 w-4" />
                )}
                {uploadMutation.isPending ? "Uploading..." : "Upload Image"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
              {uploadError && (
                <p className="mt-2 text-sm text-red-400">{uploadError}</p>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : isError ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center">
                <p className="text-sm text-red-400">
                  {error instanceof Error ? error.message : "Failed to load images."}
                </p>
              </div>
            ) : images.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
                <ImagePlus className="mx-auto mb-4 h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm text-muted-foreground">No testimonial images yet. Upload your first image above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {images.map((img) => (
                  <ImageCard key={img.id} item={img} onDelete={() => deleteMutation.mutate(img.id)} />
                ))}
              </div>
            )}
          </div>
        </section>

        <SiteFooter />
      </div>
    </main>
  );
};

const ImageCard = ({ item, onDelete }: { item: ReviewImageRow; onDelete: () => void }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/30">
      <div className="aspect-[3/4] w-full">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary/40 border-t-transparent" />
          </div>
        )}
        <img
          src={item.image_url}
          alt={item.alt_text ?? ""}
          className={`h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
        />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-black/80 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
        <span className="truncate text-xs text-white/80">
          {item.alt_text || item.category || "Review Image"}
        </span>
        <button
          onClick={onDelete}
          className="shrink-0 rounded-lg bg-red-500/20 p-1.5 text-red-400 transition-colors hover:bg-red-500/30 hover:text-red-300"
          title="Delete image"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ReviewsAdminPage;
