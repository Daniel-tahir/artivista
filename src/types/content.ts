export interface UserProfile {
  id: string;
  email: string;
  username: string;
  avatarUrl: string;
  role: string;
  bio: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  label: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Artwork {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string;
  imageUrl: string;
  thumbnailUrl: string;
  categoryId: string;
  category: string;
  categorySlug: string;
  categoryName: string;
  categoryLabel: string;
  featured: boolean;
  tags: string[];
  animeSeries: string;
  price: string;
  status: string;
  views: number;
  likesCount: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  filename: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorId: string;
  published: boolean;
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  views: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  tags: string[];
}

export interface FeedbackEntry {
  id: string;
  userId: string;
  artworkId: string;
  content: string;
  createdAt: string;
}
