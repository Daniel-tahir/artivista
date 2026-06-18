import { supabase } from "@/integrations/supabase/client";

const BLOG_BUCKET = "blogs-images";

const SAFE_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"]);

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[^\u0000-\u007F]/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[/\\]+/g, "-")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function inferExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName && ["png", "jpg", "jpeg", "webp", "gif"].includes(fromName)) {
    return fromName === "jpg" ? "jpeg" : fromName;
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "";
}

function validateFile(file: File) {
  if (!(file instanceof File) || !file.name.trim() || file.size <= 0) {
    throw new Error("Invalid file.");
  }
  if (!SAFE_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, WebP, or GIF.");
  }
  const ext = inferExtension(file);
  if (!ext) throw new Error("Could not determine file extension.");
  return ext;
}

export async function uploadBlogImage(
  file: File,
  blogSlug: string,
  prefix = "cover",
): Promise<string> {
  const ext = validateFile(file);
  const timestamp = Date.now();
  const safeSlug = slugify(blogSlug) || "untitled";
  const filename = `${prefix}-${safeSlug}-${timestamp}.${ext}`;
  const path = `${safeSlug}/${filename}`;

  const { error } = await supabase.storage
    .from(BLOG_BUCKET)
    .upload(path, file, { cacheControl: "3600", upsert: true });

  if (error) throw new Error(error.message || "Upload failed.");

  const { data } = supabase.storage.from(BLOG_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function deleteBlogImage(fileUrl: string): Promise<void> {
  try {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    const bucketIndex = pathParts.findIndex((p) => p === BLOG_BUCKET);
    if (bucketIndex === -1 || bucketIndex >= pathParts.length - 1) return;

    const storagePath = pathParts.slice(bucketIndex + 1).join("/");
    await supabase.storage.from(BLOG_BUCKET).remove([storagePath]);
  } catch {
    // silently fail — file may not exist
  }
}
