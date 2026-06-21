import { supabase } from "@/integrations/supabase/client";
import { validateUploadFile, inferSafeExtension } from "@/utils/security";

const BLOG_BUCKET = "blogs-images";

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

function validateFile(file: File) {
  validateUploadFile(file);
  const ext = inferSafeExtension(file);
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
    .upload(path, file, { cacheControl: "3600", upsert: false });

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
