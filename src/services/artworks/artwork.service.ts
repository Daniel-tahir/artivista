import { supabase } from "@/integrations/supabase/client";
import type { Artwork, Category } from "@/types/content";
import type { Database } from "@/types/database";
import { sanitizeText, clampLength, escapeLikePattern, MAX_INPUT_LENGTHS } from "@/utils/security";

type ArtworkRow = Database["public"]["Tables"]["artworks"]["Row"];
type ArtworkInsert = Database["public"]["Tables"]["artworks"]["Insert"];
type ArtworkUpdate = Database["public"]["Tables"]["artworks"]["Update"];
type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

type ArtworkWithCategoryRow = ArtworkRow & {
  categories: CategoryRow | null;
};

export interface FetchArtworksOptions {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  page?: number;
}

export interface UpsertArtworkInput {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  thumbnailUrl?: string;
  categoryId: string;
  featured: boolean;
  tags: string[];
  animeSeries: string;
  price?: number | null;
  status?: string;
  publishedAt?: string | null;
}

const mapCategoryRow = (row: CategoryRow | null): Category | null => {
  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    label: row.name,
    description: row.description ?? "",
    coverImage: row.cover_image ?? "",
    isFeatured: Boolean(row.is_featured),
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? row.created_at ?? "",
  };
};

const filenameFromUrl = (value: string) => {
  try {
    const pathname = value.startsWith("http") ? new URL(value).pathname : value;
    return pathname.split("/").pop() ?? value;
  } catch {
    return value.split("/").pop() ?? value;
  }
};

const mapArtworkRowToArtwork = (row: ArtworkWithCategoryRow): Artwork => {
  const category = mapCategoryRow(row.categories);

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    description: row.description ?? "",
    image: row.image_url,
    imageUrl: row.image_url,
    thumbnailUrl: row.thumbnail_url ?? row.image_url,
    categoryId: row.category_id ?? "",
    category: category?.slug ?? "",
    categorySlug: category?.slug ?? "",
    categoryName: category?.name ?? "",
    categoryLabel: category?.label ?? "",
    featured: Boolean(row.featured),
    tags: row.tags ?? [],
    animeSeries: row.anime_series ?? "",
    price: row.price !== null && row.price !== undefined ? String(row.price) : "",
    status: row.status ?? "",
    views: row.views ?? 0,
    likesCount: row.likes_count ?? 0,
    createdBy: row.created_by ?? "",
    createdAt: row.created_at ?? "",
    updatedAt: row.updated_at ?? row.created_at ?? "",
    publishedAt: row.published_at ?? "",
    filename: filenameFromUrl(row.image_url),
  };
};

const baseArtworkSelect = `
  *,
  categories:categories!artworks_category_id_fkey (
    id,
    name,
    slug,
    description,
    cover_image,
    is_featured,
    created_at,
    updated_at
  )
`;

export const fetchArtworks = async (options: FetchArtworksOptions = {}) => {
  let query = supabase
    .from("artworks")
    .select(baseArtworkSelect)
    .order("featured", { ascending: false })
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (options.categorySlug) {
    query = query.eq("categories.slug", options.categorySlug);
  }

  if (typeof options.featured === "boolean") {
    query = query.eq("featured", options.featured);
  }

  if (options.search) {
    const safe = escapeLikePattern(options.search);
    query = query.or(`title.ilike.%${safe}%,anime_series.ilike.%${safe}%`);
  }

  if (options.limit) {
    const page = options.page ?? 0;
    const from = page * options.limit;
    const to = from + options.limit - 1;
    query = query.range(from, to);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return ((data ?? []) as ArtworkWithCategoryRow[]).map(mapArtworkRowToArtwork);
};

export const fetchFeaturedArtworks = async (limit?: number) =>
  fetchArtworks({ featured: true, limit });

export const fetchArtworkBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("artworks")
    .select(baseArtworkSelect)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapArtworkRowToArtwork(data as ArtworkWithCategoryRow) : null;
};

export const createArtwork = async (input: UpsertArtworkInput) => {
  const payload: ArtworkInsert = {
    title: clampLength(sanitizeText(input.title), MAX_INPUT_LENGTHS.TITLE),
    slug: input.slug,
    description: input.description ? clampLength(sanitizeText(input.description), MAX_INPUT_LENGTHS.DESCRIPTION) : null,
    image_url: input.imageUrl,
    thumbnail_url: input.thumbnailUrl || input.imageUrl,
    category_id: input.categoryId,
    featured: input.featured,
    tags: input.tags.map((tag) => sanitizeText(tag)),
    anime_series: input.animeSeries ? clampLength(sanitizeText(input.animeSeries), MAX_INPUT_LENGTHS.ANIME_SERIES) : null,
    price: input.price ?? null,
    status: input.status ?? "published",
    published_at: input.publishedAt ?? new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("artworks")
    .insert(payload)
    .select(baseArtworkSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapArtworkRowToArtwork(data as ArtworkWithCategoryRow);
};

export const updateArtwork = async (id: string, input: UpsertArtworkInput) => {
  const payload: ArtworkUpdate = {
    title: clampLength(sanitizeText(input.title), MAX_INPUT_LENGTHS.TITLE),
    slug: input.slug,
    description: input.description ? clampLength(sanitizeText(input.description), MAX_INPUT_LENGTHS.DESCRIPTION) : null,
    image_url: input.imageUrl,
    thumbnail_url: input.thumbnailUrl || input.imageUrl,
    category_id: input.categoryId,
    featured: input.featured,
    tags: input.tags.map((tag) => sanitizeText(tag)),
    anime_series: input.animeSeries ? clampLength(sanitizeText(input.animeSeries), MAX_INPUT_LENGTHS.ANIME_SERIES) : null,
    price: input.price ?? null,
    status: input.status ?? "published",
    published_at: input.publishedAt ?? new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("artworks")
    .update(payload)
    .eq("id", id)
    .select(baseArtworkSelect)
    .single();

  if (error) {
    throw error;
  }

  return mapArtworkRowToArtwork(data as ArtworkWithCategoryRow);
};

export const deleteArtwork = async (id: string) => {
  const { error } = await supabase.from("artworks").delete().eq("id", id);

  if (error) {
    throw error;
  }
};
