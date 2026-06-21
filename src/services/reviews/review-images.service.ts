import { supabase } from "@/integrations/supabase/client";
import { validateUploadFile, inferSafeExtension, devlog } from "@/utils/security";

const TABLE = "testimonials_images";
const BUCKET = "testimonials";

export type TestimonialImageRow = {
  id: string;
  image_url: string;
  storage_path: string;
  created_at: string | null;
  updated_at: string | null;
};

function validateFile(file: File) {
  validateUploadFile(file, {
    allowedMimeTypes: new Set(["image/png", "image/jpeg", "image/webp"]),
    allowedExtensions: new Set(["png", "jpg", "jpeg", "webp"]),
    maxSizeBytes: 10 * 1024 * 1024,
  });
  const ext = inferSafeExtension(file);
  if (!ext) throw new Error("Could not determine file extension.");
  return ext;
}

function generateStoragePath(file: File): string {
  const ts = Date.now();
  const safe = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${ts}-${safe}`;
}

export async function listTestimonialImages(): Promise<TestimonialImageRow[]> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("id, image_url, storage_path, created_at, updated_at")
    .order("created_at", { ascending: false });

  if (error) {
    devlog("error", "[testimonials] LIST ERROR — full object:", error);
    throw new Error(error.message || "Failed to list testimonial images.");
  }

  devlog("log", `[testimonials] Fetched ${data?.length ?? 0} images.`);
  return (data ?? []) as TestimonialImageRow[];
}

export async function uploadTestimonialImage(file: File): Promise<TestimonialImageRow> {
  validateFile(file);
  const storagePath = generateStoragePath(file);

  devlog("log", "[testimonials] Upload started");

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    devlog("error", "[testimonials] STORAGE UPLOAD ERROR — full object:", uploadError);
    throw new Error(uploadError.message || "Upload failed.");
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
  const imageUrl = urlData.publicUrl;

  devlog("log", "[testimonials] Storage upload success");

  try {
    const { data, error: insertError } = await supabase
      .from(TABLE)
      .insert({ image_url: imageUrl, storage_path: storagePath })
      .select("id, image_url, storage_path, created_at, updated_at")
      .single();

    if (insertError) {
      throw insertError;
    }

    devlog("log", "[testimonials] DB insert success");
    return data as TestimonialImageRow;
  } catch (error) {
    devlog("error", "[testimonials] DB insert failed", error);
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([storagePath]);
    if (removeError) {
      devlog("warn", "[testimonials] Storage cleanup failed", removeError);
    }
    throw new Error(error instanceof Error ? error.message : "Failed to save image record.");
  }
}

export async function replaceTestimonialImage(id: string, file: File): Promise<TestimonialImageRow> {
  validateFile(file);

  const { data: existing, error: fetchError } = await supabase
    .from(TABLE)
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    devlog("error", "[testimonials] FETCH ERROR for replace — full object:", fetchError);
    throw new Error(fetchError.message || "Image not found.");
  }

  const newStoragePath = generateStoragePath(file);

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(newStoragePath, file, { cacheControl: "3600", upsert: false });

  if (uploadError) {
    devlog("error", "[testimonials] STORAGE UPLOAD ERROR (replace) — full object:", uploadError);
    throw new Error(uploadError.message || "Upload failed.");
  }

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(newStoragePath);
  const newImageUrl = urlData.publicUrl;

  try {
    const { data, error: updateError } = await supabase
      .from(TABLE)
      .update({ image_url: newImageUrl, storage_path: newStoragePath, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("id, image_url, storage_path, created_at, updated_at")
      .single();

    if (updateError) {
      throw updateError;
    }

    if (existing?.storage_path) {
      const { error: removeError } = await supabase.storage
        .from(BUCKET)
        .remove([existing.storage_path]);
      if (removeError) {
        devlog("warn", "[testimonials] Old storage cleanup failed", removeError);
      }
    }

    devlog("log", "[testimonials] Replace success");
    return data as TestimonialImageRow;
  } catch (error) {
    devlog("error", "[testimonials] Replace failed", error);
    const { error: removeError } = await supabase.storage.from(BUCKET).remove([newStoragePath]);
    if (removeError) {
      devlog("warn", "[testimonials] Replacement cleanup failed", removeError);
    }
    throw new Error(error instanceof Error ? error.message : "Failed to update image record.");
  }
}

export async function deleteTestimonialImage(id: string): Promise<void> {
  const { data: row, error: fetchError } = await supabase
    .from(TABLE)
    .select("storage_path")
    .eq("id", id)
    .single();

  if (fetchError) {
    devlog("error", "[testimonials] FETCH ERROR before delete — full object:", fetchError);
    throw new Error(fetchError.message || "Image not found.");
  }

  const { error: deleteError } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (deleteError) {
    devlog("error", "[testimonials] DELETE ERROR — full object:", deleteError);
    throw new Error(deleteError.message || "Failed to delete image record.");
  }

  if (row?.storage_path) {
    devlog("log", "[testimonials] Removing storage file:", row.storage_path);
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove([row.storage_path]);
    if (storageError) {
      devlog("warn", "[testimonials] Storage delete warning", storageError);
    }
  }

  devlog("log", "[testimonials] Delete success");
}
