import type {
  AdminArtwork,
  ArtworkFilters,
  ArtworkFormData,
  ArtworkFormErrors,
  AdminStats,
} from "@/types/admin/artwork";
import { normalizeArtwork } from "@/utils/admin/normalize-artwork";

export const createEmptyArtworkForm = (): ArtworkFormData => ({
  title: "",
  description: "",
  category: "",
  imageUrl: "",
  imageFilename: "",
  imageFile: null,
  tags: "",
  featured: false,
  price: "",
  animeSeries: "",
});

export const createArtworkFormDataFromArtwork = (artwork: AdminArtwork): ArtworkFormData => ({
  title: artwork.title,
  description: artwork.description,
  category: artwork.category,
  imageUrl: artwork.imageUrl,
  imageFilename: artwork.filename,
  imageFile: null,
  tags: artwork.tags.join(", "),
  featured: artwork.featured,
  price: artwork.price ?? "",
  animeSeries: artwork.animeSeries ?? "",
});

export const parseTags = (value: string) =>
  value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

const isValidImageUrl = (value: string) =>
  /^(https?:\/\/|\/assets\/).+\.(png|jpe?g|webp|gif|avif|svg)(\?.*)?$/i.test(value.trim()) ||
  /^data:image\/(png|jpeg|jpg|webp|gif);base64,/i.test(value.trim());

export const validateArtworkForm = (form: ArtworkFormData): ArtworkFormErrors => {
  const errors: ArtworkFormErrors = {};

  if (!form.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!form.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!form.category) {
    errors.category = "Category is required.";
  }

  if (!form.imageFile && !form.imageUrl.trim()) {
    errors.imageUrl = "Artwork image is required.";
  } else if (!form.imageFile && !isValidImageUrl(form.imageUrl)) {
    errors.imageUrl = "Use a supported uploaded image, `https://` image, or local `/assets/...` path.";
  }

  if (parseTags(form.tags).length === 0) {
    errors.tags = "Add at least one tag.";
  }

  return errors;
};

export const buildArtworkFromForm = (form: ArtworkFormData, existing?: AdminArtwork): AdminArtwork => {
  const now = new Date().toISOString();
  const normalizedTitle = form.title.trim();
  const imageUrl = form.imageUrl.trim();
  const fallbackSlug = normalizedTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const filename =
    form.imageFilename.trim() || existing?.filename || imageUrl.split("/").pop() || `${fallbackSlug || "artwork"}.png`;

  return normalizeArtwork({
    id: existing?.id ?? crypto.randomUUID(),
    slug: existing?.slug,
    title: normalizedTitle,
    description: form.description.trim(),
    category: form.category,
    imageUrl,
    filename,
    tags: parseTags(form.tags),
    featured: form.featured,
    price: form.price.trim(),
    animeSeries: form.animeSeries.trim(),
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  });
};

export const filterArtworks = (artworks: AdminArtwork[], filters: ArtworkFilters) => {
  const query = filters.query.trim().toLowerCase();

  return artworks.filter((artwork) => {
    const matchesQuery =
      query.length === 0 ||
      artwork.title.toLowerCase().includes(query) ||
      artwork.description.toLowerCase().includes(query) ||
      artwork.tags.some((tag) => tag.toLowerCase().includes(query)) ||
      (artwork.animeSeries ?? "").toLowerCase().includes(query);

    const matchesCategory = filters.category === "all" || artwork.category === filters.category;
    const matchesFeatured = !filters.featuredOnly || artwork.featured;

    return matchesQuery && matchesCategory && matchesFeatured;
  });
};

export const calculateAdminStats = (artworks: AdminArtwork[]): AdminStats => {
  return {
    totalArtworks: artworks.length,
    featuredArtworks: artworks.filter((artwork) => artwork.featured).length,
    uniqueCategories: new Set(artworks.map((artwork) => artwork.category)).size,
    taggedEntries: artworks.filter((artwork) => artwork.tags.length > 0).length,
  };
};
