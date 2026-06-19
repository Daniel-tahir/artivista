import { supabase } from "@/integrations/supabase/client";
import type { AboutSection } from "@/types/content";
import type { Database } from "@/types/database";

type AboutRow = Database["public"]["Tables"]["about_section"]["Row"];

const TABLE = "about_section";
const BUCKET = "about-images";

function mapAboutRow(row: AboutRow): AboutSection {
  return {
    id: row.id,
    title: row.title ?? "",
    content: row.content,
    imageUrl: row.image_url ?? "",
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? "",
  };
}

function validateImage(file: File) {
  const allowed = new Set(["image/png", "image/jpeg", "image/webp"]);
  if (!(file instanceof File)) {
    throw new Error("Invalid image file.");
  }
  if (!file.name?.trim()) {
    throw new Error("Image file must have a name.");
  }
  if (!allowed.has(file.type)) {
    throw new Error("Invalid image type. Use PNG, JPEG, or WebP.");
  }
  if (file.size <= 0 || file.size > 10 * 1024 * 1024) {
    throw new Error("Invalid image. Use PNG, JPEG, or WebP up to 10 MB.");
  }
}

function generateStoragePath(file: File) {
  return `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
}

export async function fetchAboutSection(): Promise<AboutSection | null> {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .maybeSingle();

  if (error) throw error;
  return data ? mapAboutRow(data) : null;
}

export async function saveAboutSection(input: { title: string; content: string; imageFile?: File | null }): Promise<AboutSection> {
  const existing = await fetchAboutSection();
  let imageUrl = existing?.imageUrl ?? "";
  let storagePath = "";

  if (input.imageFile) {
    validateImage(input.imageFile);
    storagePath = generateStoragePath(input.imageFile);
    const { error: uploadError } = await supabase.storage.from(BUCKET).upload(storagePath, input.imageFile, {
      cacheControl: "3600",
      upsert: true,
      contentType: input.imageFile.type,
    });
    if (uploadError) throw new Error(uploadError.message || "Image upload failed.");
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
    imageUrl = data.publicUrl;
  }

  const payload = {
    title: input.title,
    content: input.content,
    image_url: imageUrl || null,
    created_at: existing?.createdAt || new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? supabase.from(TABLE).update(payload).eq("id", existing.id)
    : supabase.from(TABLE).insert(payload);

  const { data, error } = await query.select("*").single();
  if (error) {
    if (storagePath) {
      await supabase.storage.from(BUCKET).remove([storagePath]);
    }
    throw error;
  }

  if (existing?.imageUrl && storagePath) {
    const oldPath = existing.imageUrl.split(`/storage/v1/object/public/${BUCKET}/`)[1];
    if (oldPath) {
      await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => {});
    }
  }

  return mapAboutRow(data as AboutRow);
}

export async function deleteAboutSection(): Promise<void> {
  const existing = await fetchAboutSection();
  if (!existing) return;

  const { error } = await supabase.from(TABLE).delete().eq("id", existing.id);
  if (error) throw error;

  const oldPath = existing.imageUrl.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (oldPath) {
    await supabase.storage.from(BUCKET).remove([oldPath]).catch(() => {});
  }
}
