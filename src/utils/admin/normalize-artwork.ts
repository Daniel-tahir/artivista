import type { AdminArtwork } from "@/types/admin/artwork";

interface NormalizeArtworkInput extends Partial<AdminArtwork> {
  category: string;
  image?: string;
  imageUrl?: string;
  title?: string;
  filename?: string;
}

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const toTitleFromFilename = (value: string) =>
  value
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

export const normalizeArtwork = (input: NormalizeArtworkInput): AdminArtwork => {
  const now = new Date().toISOString();
  const imageSource = (input.imageUrl ?? input.image ?? "").trim();
  const filename =
    input.filename?.trim() ||
    imageSource.split("/").pop() ||
    `${toSlug(input.title?.trim() || "artwork") || "artwork"}.png`;
  const title = input.title?.trim() || toTitleFromFilename(filename);
  const slug = input.slug?.trim() || toSlug(title || filename);
  const category = input.category.trim();

  return {
    id: input.id?.trim() || `artwork-${category}-${slug}`,
    title,
    slug,
    image: imageSource,
    imageUrl: imageSource,
    category,
    filename,
    featured: Boolean(input.featured),
    tags: Array.isArray(input.tags) ? input.tags.filter(Boolean) : [],
    description: input.description?.trim() ?? "",
    animeSeries: input.animeSeries?.trim() ?? "",
    price: input.price?.trim() ?? "",
    createdAt: input.createdAt?.trim() || now,
    updatedAt: input.updatedAt?.trim() || input.createdAt?.trim() || now,
  };
};
