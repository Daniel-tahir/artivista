import {
  generatedArtworkCategories,
  generatedArtworkManifests,
} from "@/generated/artwork-manifests";

export type ArtworkCategorySlug =
  | "anime"
  | "dnd"
  | "furry"
  | "group-art"
  | "warhammer";

export interface ArtworkItem {
  title: string;
  image: string;
}

export interface ArtworkCategorySummary {
  slug: ArtworkCategorySlug;
  label: string;
  name: string;
  eyebrow: string;
  subtitle: string;
  heroImage: string;
  featuredTitle: string;
  featuredImage: string;
}

export interface ArtworkCategoryManifest {
  slug: ArtworkCategorySlug;
  items: ArtworkItem[];
}

export const artworkDropdownItems = [
  { label: "DND", slug: "dnd" },
  { label: "Furry", slug: "furry" },
  { label: "Anime", slug: "anime" },
  { label: "Warhammer", slug: "warhammer" },
  { label: "Group Art", slug: "group-art" },
] as const satisfies ReadonlyArray<{
  label: string;
  slug: ArtworkCategorySlug;
}>;

export const artworkCategories =
  generatedArtworkCategories as readonly ArtworkCategorySummary[];

export const artworkManifests =
  generatedArtworkManifests as Record<
    ArtworkCategorySlug,
    ArtworkCategoryManifest
  >;
