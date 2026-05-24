import { supabase } from "@/integrations/supabase/client";
import { buildArtworkStoragePath, validateArtworkUploadFile } from "@/utils/uploads/storage-path";

const humanizeUploadError = (errorMessage: string) => {
  const normalized = errorMessage.toLowerCase();

  if (normalized.includes("mime")) {
    return "Upload blocked: unsupported image type.";
  }

  if (normalized.includes("filename")) {
    return "Upload blocked: invalid filename after sanitization.";
  }

  if (normalized.includes("category")) {
    return "Upload blocked: invalid category path.";
  }

  if (normalized.includes("400")) {
    return "Storage rejected the upload path or file metadata.";
  }

  return errorMessage;
};

export const uploadArtworkFile = async ({
  file,
  categorySlug,
  artworkSlug,
  onProgress,
}: {
  file: File;
  categorySlug: string;
  artworkSlug: string;
  onProgress?: (progress: number) => void;
}) => {
  validateArtworkUploadFile(file);
  const { path, categorySlug: normalizedCategorySlug, filename, mimeType, size } = buildArtworkStoragePath({
    file,
    categorySlug,
    artworkSlug,
  });

  console.log({
    bucket: "artworks",
    path,
    categorySlug: normalizedCategorySlug,
    filename,
    mimeType,
    size,
  });

  onProgress?.(20);

  const { error } = await supabase.storage.from("artworks").upload(path, file, {
    cacheControl: "3600",
    upsert: true,
    contentType: mimeType,
  });

  if (error) {
    throw new Error(humanizeUploadError(error.message || "Storage rejected upload."));
  }
  onProgress?.(85);

  const { data } = supabase.storage.from("artworks").getPublicUrl(path);
  onProgress?.(100);

  return {
    filePath: path,
    publicUrl: data.publicUrl,
  };
};
