import type { Artwork } from "@/types/content";

export type AdminArtworkCategoryValue = string;

export interface AdminArtworkCategory {
  value: AdminArtworkCategoryValue;
  label: string;
  description: string;
}

export type AdminArtwork = Artwork;

export interface ArtworkFormData {
  title: string;
  description: string;
  category: AdminArtworkCategoryValue;
  imageUrl: string;
  imageFilename: string;
  imageFile?: File | null;
  tags: string;
  featured: boolean;
  price: string;
  animeSeries: string;
}

export interface ArtworkFormErrors {
  title?: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  tags?: string;
}

export type ArtworkUploadStatus =
  | "queued"
  | "uploading"
  | "processing"
  | "completed"
  | "failed";

export interface ArtworkUploadQueueItem {
  id: string;
  file: File;
  previewUrl: string;
  imageUrl: string;
  title: string;
  slug: string;
  filename: string;
  category: AdminArtworkCategoryValue;
  description: string;
  tags: string;
  featured: boolean;
  price: string;
  animeSeries: string;
  status: ArtworkUploadStatus;
  progress: number;
  error?: string;
}

export interface AdminStats {
  totalArtworks: number;
  featuredArtworks: number;
  uniqueCategories: number;
  taggedEntries: number;
}

export interface ArtworkFilters {
  query: string;
  category: "all" | AdminArtworkCategoryValue;
  featuredOnly: boolean;
}
