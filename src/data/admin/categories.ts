import { getDetectedArtworkCategories } from "@/data/admin/artwork-library";

export const adminArtworkCategories = getDetectedArtworkCategories();

export const adminCategoryLabelMap = Object.fromEntries(
  adminArtworkCategories.map((category) => [category.value, category.label]),
) as Record<string, string>;
