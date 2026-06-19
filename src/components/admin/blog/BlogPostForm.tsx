import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Save, Eye, ArrowLeft, Upload, X,
} from "lucide-react";
import { toast } from "sonner";
import RichTextEditor from "@/components/admin/blog/RichTextEditor";
import { uploadBlogImage, deleteBlogImage } from "@/services/blogs/blog-upload.service";
import type { Blog } from "@/types/content";

interface BlogPostFormProps {
  blog?: Blog | null;
  onSave: (data: Partial<Blog> & { tags: string[] }) => Promise<void>;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toLocalInputValue(value: string): string {
  if (!value) return "";
  const date = new Date(value);
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60_000);
  return local.toISOString().slice(0, 16);
}

const BlogPostForm = ({ blog, onSave }: BlogPostFormProps) => {
  const navigate = useNavigate();
  const isEdit = !!blog;

  const [title, setTitle] = useState(blog?.title ?? "");
  const [slug, setSlug] = useState(blog?.slug ?? "");
  const [excerpt, setExcerpt] = useState(blog?.excerpt ?? "");
  const [content, setContent] = useState(blog?.content ?? "");
  const [coverImage, setCoverImage] = useState(blog?.coverImage ?? "");
  const [tagsInput, setTagsInput] = useState(blog?.tags?.join(", ") ?? "");
  const [published, setPublished] = useState(blog?.published ?? false);
  const [scheduledAt, setScheduledAt] = useState(blog?.scheduledAt ?? "");
  const [featured, setFeatured] = useState(blog?.featured ?? false);
  const [metaTitle, setMetaTitle] = useState(blog?.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(blog?.metaDescription ?? "");
  const [saving, setSaving] = useState(false);
  const [slugEdited, setSlugEdited] = useState(false);

  const handleTitleChange = useCallback(
    (val: string) => {
      setTitle(val);
      if (!slugEdited && !isEdit) {
        setSlug(slugify(val));
      }
    },
    [slugEdited, isEdit],
  );

  const handleCoverUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadBlogImage(file, slug || "untitled", "cover");
      if (blog?.coverImage) await deleteBlogImage(blog.coverImage);
      setCoverImage(url);
      toast.success("Cover image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    }
  }, [slug, blog?.coverImage]);

  const handleRemoveCover = useCallback(async () => {
    if (coverImage) await deleteBlogImage(coverImage);
    setCoverImage("");
  }, [coverImage]);

  const tags = tagsInput
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!slug.trim()) {
      toast.error("Slug is required");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim(),
        content,
        coverImage,
        published,
        scheduledAt,
        featured,
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt.slice(0, 160),
        tags,
      });
      toast.success(isEdit ? "Blog updated" : "Blog created");
      navigate("/admin/blogs");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/admin/blogs")}
            className="interactive-surface rounded-full border border-white/10 bg-white/[0.05] p-2.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-display text-2xl font-bold text-glow">
              {isEdit ? "Edit Blog Post" : "New Blog Post"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isEdit ? `Editing: ${blog?.title}` : "Create a new blog post"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.open(`/blog/${slug}`, "_blank")}
            disabled={!slug}
            className="interactive-surface inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground hover:text-foreground disabled:opacity-40"
          >
            <Eye className="h-4 w-4" />
            Preview
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        {/* Main content */}
        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Blog Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Enter blog title"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-lg text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Slug
            </label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  setSlug(slugify(e.target.value));
                  setSlugEdited(true);
                }}
                placeholder="your-blog-slug"
                className="flex-1 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief summary of the blog post..."
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          {/* Content */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Content
            </label>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Start writing your blog post..."
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publishing */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Publishing
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Published</span>
                <input
                  type="checkbox"
                  checked={published}
                  onChange={(e) => setPublished(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-primary focus:ring-primary/30"
                />
              </label>
              <div className="space-y-2">
                <label className="block text-sm text-foreground">Publish Mode</label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="publish-mode"
                    checked={!scheduledAt}
                    onChange={() => {
                      setScheduledAt("");
                      setPublished(true);
                    }}
                  />
                  Publish Now
                </label>
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="radio"
                    name="publish-mode"
                    checked={!!scheduledAt}
                    onChange={() => {
                      setPublished(false);
                      if (!scheduledAt) {
                        setScheduledAt(new Date().toISOString());
                      }
                    }}
                  />
                  Schedule for later
                </label>
              </div>
              <div>
                <label className="mb-1 block text-sm text-foreground">Schedule Publish</label>
                <input
                  type="datetime-local"
                  value={toLocalInputValue(scheduledAt)}
                  onChange={(e) => {
                    setScheduledAt(e.target.value ? new Date(e.target.value).toISOString() : "");
                    if (e.target.value) setPublished(false);
                  }}
                  disabled={!scheduledAt && published}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-foreground focus:border-primary/40 focus:outline-none"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  Set a future time to auto-publish this post.
                </p>
              </div>
              <label className="flex items-center justify-between">
                <span className="text-sm text-foreground">Featured</span>
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/[0.05] text-primary focus:ring-primary/30"
                />
              </label>
            </div>
          </div>

          {/* Cover Image */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Cover Image
            </h3>
            {coverImage ? (
              <div className="relative overflow-hidden rounded-xl">
                <img
                  src={coverImage}
                  alt="Cover"
                  className="aspect-[16/9] w-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveCover}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/10 p-6 text-center hover:border-primary/30">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Click to upload cover image
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  onChange={handleCoverUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Tags */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Tags
            </h3>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="anime, fantasy, design"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
            {tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SEO Section */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <h2 className="mb-6 font-display text-lg font-bold text-glow">
          SEO Settings
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={title || "Auto from title"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-foreground">
              Meta Description
            </label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder={excerpt.slice(0, 160) || "Auto from excerpt"}
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogPostForm;
