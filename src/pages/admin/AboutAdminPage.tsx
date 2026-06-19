import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ImagePlus, Save, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import SiteFooter from "@/components/SiteFooter";
import StarField from "@/components/StarField";
import { deleteAboutSection, fetchAboutSection, saveAboutSection } from "@/services/about/about-section.service";
import { siteAssets } from "@/lib/site-assets";

const AboutAdminPage = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("About ARTIVISTAA");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { data } = useQuery({
    queryKey: ["about-section"],
    queryFn: fetchAboutSection,
  });

  useEffect(() => {
    setContent(data?.content ?? "");
    setTitle(data?.title ?? "About ARTIVISTAA");
  }, [data?.content, data?.title]);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [selectedFile]);

  const saveMutation = useMutation({
    mutationFn: () => saveAboutSection({ title, content, imageFile: selectedFile }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-section"] });
      toast.success("About section saved");
      setSelectedFile(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAboutSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-section"] });
      setContent("");
      setSelectedFile(null);
      toast.success("About section reset");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const previewImage = previewUrl || data?.imageUrl || siteAssets.about.story;

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
                About{" "}
                <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                  Manager
                </span>
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Edit the public about section text and image without changing the site layout.
              </p>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                  <label className="mb-2 block text-sm font-medium text-foreground">About Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mb-4 w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
                    placeholder="About ARTIVISTAA"
                  />
                  <label className="mb-2 block text-sm font-medium text-foreground">About Text</label>
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={12}
                    className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
                    placeholder="Write the about text here..."
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-2.5 text-sm font-medium text-primary hover:bg-primary/20"
                  >
                    <ImagePlus className="h-4 w-4" />
                    {selectedFile ? "Change Image" : "Upload Image"}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                  />
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 className="h-4 w-4" />
                    Reset
                  </button>
                  <button
                    type="button"
                    onClick={() => saveMutation.mutate()}
                    disabled={saveMutation.isPending}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                  >
                    <Save className="h-4 w-4" />
                    {saveMutation.isPending ? "Saving..." : "Save"}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
                  <img src={previewImage} alt="About preview" className="aspect-[4/5] w-full object-cover" />
                </div>
                {selectedFile && (
                  <p className="text-xs text-muted-foreground">Selected file: {selectedFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </section>
        <SiteFooter />
      </div>
    </main>
  );
};

export default AboutAdminPage;
