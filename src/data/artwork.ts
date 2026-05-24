export type ArtworkCategorySlug = string;

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
