import { supabase } from "@/integrations/supabase/client";
import type { Category } from "@/types/content";
import type { Database } from "@/types/database";

type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];

const mapCategoryRowToCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  label: row.name,
  description: row.description ?? "",
  coverImage: row.cover_image ?? "",
  isFeatured: Boolean(row.is_featured),
  createdAt: row.created_at ?? "",
  updatedAt: row.updated_at ?? row.created_at ?? "",
});

export const fetchCategories = async () => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapCategoryRowToCategory);
};

export const fetchCategoryBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data ? mapCategoryRowToCategory(data) : null;
};
