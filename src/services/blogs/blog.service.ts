import { supabase } from "@/integrations/supabase/client";
import type { Blog } from "@/types/content";
import type { Database } from "@/types/database";

type BlogRow = Database["public"]["Tables"]["blogs"]["Row"];

const mapBlogRowToBlog = (row: BlogRow): Blog => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  excerpt: row.excerpt ?? "",
  content: row.content ?? "",
  coverImage: row.cover_image ?? "",
  authorId: row.author_id ?? "",
  published: Boolean(row.published),
  featured: Boolean(row.featured),
  metaTitle: row.meta_title ?? "",
  metaDescription: row.meta_description ?? "",
  views: row.views ?? 0,
  createdAt: row.created_at ?? "",
  updatedAt: row.updated_at ?? row.created_at ?? "",
  publishedAt: row.published_at ?? "",
});

export const fetchBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapBlogRowToBlog);
};

export const fetchFeaturedBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("published", true)
    .eq("featured", true)
    .order("published_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapBlogRowToBlog);
};

export const fetchBlogBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapBlogRowToBlog(data) : null;
};
