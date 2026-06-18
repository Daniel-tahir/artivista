import { supabase } from "@/integrations/supabase/client";

const TABLE = "review_images";
const BUCKET = "testimonials";

const SAFE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

export type ReviewImageRow = {
  id: string;
  image_url: string;
  alt_text: string | null;
  category: string | null;
  position: number | null;
  is_active: boolean | null;
  created_at: string | null;
  category_id: string | null;
  column_side: string | null;
  review_categories: {
    id: string;
    name: string;
    slug: string;
  } | null;
};

function inferExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName && ["png", "jpg", "jpeg", "webp"].includes(fromName)) {
    return fromName === "jpg" ? "jpeg" : fromName;
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/webp") return "webp";
  return "";
}

function validateFile(file: File) {
  if (!(file instanceof File) || !file.name.trim() || file.size <= 0) {
    throw new Error("Invalid file.");
  }
  if (!SAFE_TYPES.has(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, or WebP.");
  }
  const ext = inferExtension(file);
  if (!ext) throw new Error("Could not determine file extension.");
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File too large. Maximum size is 10 MB.");
  }
  return ext;
}

function extractStoragePath(imageUrl: string): string {
  const prefix = `/${BUCKET}/`;
  const idx = imageUrl.indexOf(prefix);
  if (idx === -1) return "";
  return imageUrl.slice(idx + prefix.length);
}

export async function listReviewImages(): Promise<ReviewImageRow[]> {
  console.log("[review-images] Fetching list...");

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      id,
      image_url,
      alt_text,
      category,
      position,
      is_active,
      created_at,
      category_id,
      column_side,
      review_categories (
        id,
        name,
        slug
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[review-images] LIST ERROR — full object:", error);
    throw new Error(error.message || "Failed to list review images.");
  }

  console.log(`[review-images] Fetched ${data?.length ?? 0} images.`);
  return (data ?? []) as ReviewImageRow[];
}

export async function uploadReviewImage(file: File): Promise<ReviewImageRow> {
  const ext = validateFile(file);
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${timestamp}-${safeName}`;

  console.log("[review-images] Uploading to storage:", storagePath);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    console.error("[review-images] STORAGE UPLOAD ERROR — full object:", uploadError);
    throw new Error(uploadError.message || "Upload failed.");
  }

  console.log("[review-images] Storage upload OK. Getting public URL...");

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  console.log("[review-images] Public URL:", imageUrl);
  console.log("[review-images] Inserting DB row...");

  const { data, error: insertError } = await supabase
    .from(TABLE)
    .insert({ image_url: imageUrl })
    .select(`
      id,
      image_url,
      alt_text,
      category,
      position,
      is_active,
      created_at,
      category_id,
      column_side,
      review_categories (
        id,
        name,
        slug
      )
    `)
    .single();

  if (insertError) {
    console.error("[review-images] DB INSERT ERROR — full object:", insertError);
    console.log("[review-images] Cleaning up storage file...");
    await supabase.storage.from(BUCKET).remove([storagePath]);
    throw new Error(insertError.message || "Failed to save image record.");
  }

  console.log("[review-images] DB insert OK, id:", data.id);
  return data as ReviewImageRow;
}

export async function deleteReviewImage(id: string): Promise<void> {
  console.log("[review-images] Deleting image id:", id);

  const { data: row, error: fetchError } = await supabase
    .from(TABLE)
    .select("image_url")
    .eq("id", id)
    .single();

  if (fetchError) {
    console.error("[review-images] FETCH ERROR before delete — full object:", fetchError);
    throw new Error(fetchError.message || "Image not found.");
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (deleteError) {
    console.error("[review-images] DELETE ERROR — full object:", deleteError);
    throw new Error(deleteError.message || "Failed to delete image record.");
  }

  if (row?.image_url) {
    const storagePath = extractStoragePath(row.image_url);
    if (storagePath) {
      console.log("[review-images] Removing storage file:", storagePath);
      const { error: storageError } = await supabase.storage
        .from(BUCKET)
        .remove([storagePath]);
      if (storageError) {
        console.error("[review-images] STORAGE REMOVE ERROR — full object:", storageError);
      }
    }
  }

  console.log("[review-images] Delete complete for id:", id);
}
