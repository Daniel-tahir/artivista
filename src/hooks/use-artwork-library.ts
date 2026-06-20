import { useMemo } from "react";
import type { ArtworkCategorySummary } from "@/data/artwork";
import { useArtworks } from "@/hooks/useArtworks";
import { useCategories } from "@/hooks/useCategories";
import type { Artwork } from "@/types/content";

const buildCategorySummaries = (
  categories: ReturnType<typeof useCategories>["data"] = [],
  artworks: Artwork[] = [],
): ArtworkCategorySummary[] =>
  categories.map((category) => {
    const categoryArtworks = artworks.filter((artwork) => artwork.categoryId === category.id);
    const featuredCandidate = categoryArtworks.find((artwork) => artwork.featured) ?? categoryArtworks[0];

    return {
      slug: category.slug,
      label: category.label,
      name: category.name,
      eyebrow: category.isFeatured ? "Featured Collection" : `${category.name} Collection`,
      subtitle: category.description || `${category.name} artwork curated from the live library.`,
      heroImage: category.coverImage || featuredCandidate?.image || "",
      featuredTitle: featuredCandidate?.title || category.name,
      featuredImage: featuredCandidate?.image || category.coverImage || "",
    };
  });

export const useArtworkLibrary = () => {
  const artworksQuery = useArtworks();
  const categoriesQuery = useCategories();

  const artworks = artworksQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const featuredArtworks = useMemo(
    () => artworks.filter((a) => a.featured),
    [artworks],
  );
  const categorySummaries = useMemo(
    () => buildCategorySummaries(categories, artworks),
    [artworks, categories],
  );

  return {
    artworks,
    categories,
    featuredArtworks,
    categorySummaries,
    isLoading: artworksQuery.isLoading || categoriesQuery.isLoading,
    isError: artworksQuery.isError || categoriesQuery.isError,
    error: artworksQuery.error ?? categoriesQuery.error ?? null,
    refetch: async () => {
      await Promise.all([
        artworksQuery.refetch(),
        categoriesQuery.refetch(),
      ]);
    },
    getCategoryBySlug: (slug: string) => categorySummaries.find((category) => category.slug === slug),
    getArtworksByCategory: (slug: string) => artworks.filter((artwork) => artwork.categorySlug === slug),
  };
};
