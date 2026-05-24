import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/hooks/use-toast";
import { useArtworks } from "@/hooks/useArtworks";
import { useCategories } from "@/hooks/useCategories";
import { createArtwork, deleteArtwork, updateArtwork } from "@/services/artworks/artwork.service";
import { uploadArtworkFile } from "@/services/uploads/upload.service";
import type { ArtworkFilters, ArtworkFormData, ArtworkUploadQueueItem } from "@/types/admin/artwork";
import { filterArtworks, parseTags } from "@/utils/admin/artwork-form";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const defaultFilters: ArtworkFilters = {
  query: "",
  category: "all",
  featuredOnly: false,
};

export const useAdminArtworks = () => {
  const queryClient = useQueryClient();
  const artworksQuery = useArtworks();
  const categoriesQuery = useCategories();
  const artworks = artworksQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const [filters, setFilters] = useState<ArtworkFilters>(defaultFilters);

  const invalidateArtworkQueries = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["artworks"] }),
      queryClient.invalidateQueries({ queryKey: ["categories"] }),
    ]);
  };

  const saveArtwork = async (formData: ArtworkFormData, artworkId?: string) => {
    const selectedCategory = categories.find((category) => category.slug === formData.category);

    if (!selectedCategory) {
      throw new Error("Select a valid category before saving.");
    }

    const slug = slugify(formData.title);
    const uploadedImage = formData.imageFile
      ? await uploadArtworkFile({
          file: formData.imageFile,
          categorySlug: selectedCategory.slug,
          artworkSlug: slug,
        })
      : null;

    const payload = {
      title: formData.title.trim(),
      slug,
      description: formData.description.trim(),
      imageUrl: uploadedImage?.publicUrl ?? formData.imageUrl,
      thumbnailUrl: uploadedImage?.publicUrl ?? formData.imageUrl,
      categoryId: selectedCategory.id,
      featured: formData.featured,
      tags: parseTags(formData.tags),
      animeSeries: formData.animeSeries.trim(),
      price: formData.price.trim() ? Number(formData.price.trim().replace(/[^0-9.]+/g, "")) : null,
      status: "published",
      publishedAt: new Date().toISOString(),
    };

    return artworkId ? updateArtwork(artworkId, payload) : createArtwork(payload);
  };

  const saveArtworkQueueItem = async (
    item: ArtworkUploadQueueItem,
    onProgress?: (itemId: string, progress: number, status: ArtworkUploadQueueItem["status"]) => void,
  ) => {
    const selectedCategory = categories.find((category) => category.slug === item.category);

    if (!selectedCategory) {
      throw new Error("Select a valid category before saving.");
    }

    onProgress?.(item.id, 10, "uploading");
    const uploadedImage = await uploadArtworkFile({
      file: item.file,
      categorySlug: selectedCategory.slug,
      artworkSlug: item.slug,
      onProgress: (progress) => onProgress?.(item.id, progress, progress >= 85 ? "processing" : "uploading"),
    });

    onProgress?.(item.id, 92, "processing");
    const artwork = await createArtwork({
      title: item.title.trim(),
      slug: item.slug,
      description: item.description.trim(),
      imageUrl: uploadedImage.publicUrl,
      thumbnailUrl: uploadedImage.publicUrl,
      categoryId: selectedCategory.id,
      featured: item.featured,
      tags: parseTags(item.tags),
      animeSeries: item.animeSeries.trim(),
      price: item.price.trim() ? Number(item.price.trim().replace(/[^0-9.]+/g, "")) : null,
      status: "published",
      publishedAt: new Date().toISOString(),
    });
    onProgress?.(item.id, 100, "completed");
    return artwork;
  };

  const createMutation = useMutation({
    mutationFn: (formData: ArtworkFormData) => saveArtwork(formData),
    onSuccess: async (artwork) => {
      await invalidateArtworkQueries();
      toast({
        title: "Artwork published",
        description: `${artwork.title} is now live across the platform.`,
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ artworkId, formData }: { artworkId: string; formData: ArtworkFormData }) =>
      saveArtwork(formData, artworkId),
    onSuccess: async (artwork) => {
      await invalidateArtworkQueries();
      toast({
        title: "Artwork updated",
        description: `${artwork.title} has been synced across the platform.`,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (artworkId: string) => deleteArtwork(artworkId),
    onSuccess: async () => {
      await invalidateArtworkQueries();
      toast({
        title: "Artwork removed",
        description: "The artwork has been deleted from the live library.",
        variant: "destructive",
      });
    },
  });

  const createBatchMutation = useMutation({
    mutationFn: async ({
      items,
      onProgress,
    }: {
      items: ArtworkUploadQueueItem[];
      onProgress?: (itemId: string, progress: number, status: ArtworkUploadQueueItem["status"], error?: string) => void;
    }) => {
      return Promise.allSettled(
        items.map((item) =>
          saveArtworkQueueItem(item, (itemId, progress, status) => onProgress?.(itemId, progress, status)).catch((error) => {
            onProgress?.(
              item.id,
              item.progress > 0 ? item.progress : 0,
              "failed",
              error instanceof Error ? error.message : "Upload failed",
            );
            throw error;
          }),
        ),
      );
    },
    onSuccess: async (results) => {
      await invalidateArtworkQueries();
      const completed = results.filter((result) => result.status === "fulfilled").length;
      const failed = results.length - completed;

      toast({
        title: failed === 0 ? "Bulk upload complete" : "Bulk upload finished with retries needed",
        description:
          failed === 0
            ? `${completed} artwork${completed === 1 ? "" : "s"} published successfully.`
            : `${completed} completed, ${failed} failed. Review the queue and retry failed items.`,
        variant: failed === 0 ? "default" : "destructive",
      });
    },
  });

  return {
    artworks,
    visibleArtworks: filterArtworks(artworks, filters),
    stats: {
      totalArtworks: artworks.length,
      featuredArtworks: artworks.filter((artwork) => artwork.featured).length,
      uniqueCategories: new Set(artworks.map((artwork) => artwork.categorySlug)).size,
      taggedEntries: artworks.filter((artwork) => artwork.tags.length > 0).length,
    },
    filters,
    setFilters,
    isBootstrapped: !artworksQuery.isLoading && !categoriesQuery.isLoading,
    isLoading: artworksQuery.isLoading || categoriesQuery.isLoading,
    isError: artworksQuery.isError || categoriesQuery.isError,
    categories: categories.map((category) => ({
      value: category.slug,
      label: category.name,
      description: category.description,
    })),
    createArtwork: async (formData: ArtworkFormData) => createMutation.mutateAsync(formData),
    createArtworkBatch: async (
      items: ArtworkUploadQueueItem[],
      onProgress?: (itemId: string, progress: number, status: ArtworkUploadQueueItem["status"], error?: string) => void,
    ) => {
      const results = await createBatchMutation.mutateAsync({ items, onProgress });
      return results;
    },
    updateArtwork: async (artworkId: string, formData: ArtworkFormData) =>
      updateMutation.mutateAsync({ artworkId, formData }),
    deleteArtwork: async (artworkId: string) => deleteMutation.mutateAsync(artworkId),
    createEditFormData: (artwork: (typeof artworks)[number]) => ({
      title: artwork.title,
      description: artwork.description,
      category: artwork.categorySlug,
      imageUrl: artwork.imageUrl,
      imageFilename: artwork.filename,
      imageFile: null,
      tags: artwork.tags.join(", "),
      featured: artwork.featured,
      price: artwork.price,
      animeSeries: artwork.animeSeries,
    }),
  };
};
