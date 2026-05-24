const SAFE_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const slugifySegment = (value: string) =>
  value
    .normalize("NFKD")
    .replace(/[^\x00-\x7F]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[\/\\]+/g, "-")
    .replace(/[^a-z0-9.-]+/g, "-")
    .replace(/\.{2,}/g, ".")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

const inferSafeExtension = (file: File) => {
  const fromName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");

  if (fromName && ["png", "jpg", "jpeg", "webp", "gif"].includes(fromName)) {
    return fromName === "jpg" ? "jpeg" : fromName;
  }

  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";

  return "";
};

export const validateArtworkUploadFile = (file: unknown) => {
  if (!(file instanceof File)) {
    throw new Error("Invalid upload payload: expected a browser File object.");
  }

  if (!file.name.trim()) {
    throw new Error("Invalid filename: uploaded artwork is missing a file name.");
  }

  if (file.size <= 0) {
    throw new Error("Invalid file: uploaded artwork is empty.");
  }

  if (!SAFE_MIME_TYPES.has(file.type)) {
    throw new Error("Invalid mime type: only PNG, JPG, JPEG, WEBP, and GIF are supported.");
  }

  const extension = inferSafeExtension(file);

  if (!extension) {
    throw new Error("Invalid filename: file extension could not be resolved safely.");
  }

  return {
    file,
    extension,
  };
};

export const buildArtworkStoragePath = ({
  categorySlug,
  artworkSlug,
  file,
  timestamp = Date.now(),
}: {
  categorySlug: string;
  artworkSlug: string;
  file: File;
  timestamp?: number;
}) => {
  const normalizedCategorySlug = slugifySegment(categorySlug);

  if (!normalizedCategorySlug) {
    throw new Error("Invalid category: artwork category slug could not be normalized.");
  }

  const { extension } = validateArtworkUploadFile(file);
  const normalizedArtworkSlug = slugifySegment(artworkSlug || file.name.replace(/\.[^.]+$/, ""));

  if (!normalizedArtworkSlug) {
    throw new Error("Invalid filename: artwork slug could not be normalized.");
  }

  const fileName = `${normalizedArtworkSlug}-${timestamp}.${extension}`;
  const path = `${normalizedCategorySlug}/${fileName}`;

  return {
    path,
    categorySlug: normalizedCategorySlug,
    filename: fileName,
    mimeType: file.type,
    size: file.size,
  };
};
