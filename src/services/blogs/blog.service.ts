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
  tags: [],
});

const BLOG_SELECT = `
  id, title, slug, excerpt, content, cover_image, author_id,
  published, featured, meta_title, meta_description,
  views, created_at, updated_at, published_at
`;

export const fetchBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("published", true)
    .order("published_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) throw error;

  return await enrichWithTags((data ?? []).map(mapBlogRowToBlog));
};

export const fetchAllBlogs = async () => {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return await enrichWithTags((data ?? []).map(mapBlogRowToBlog));
};

export const fetchBlogBySlug = async (slug: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  const blog = mapBlogRowToBlog(data);
  const tags = await fetchBlogTags(blog.id);
  blog.tags = tags;
  return blog;
};

export const fetchBlogById = async (id: string) => {
  const { data, error } = await supabase
    .from("blogs")
    .select(BLOG_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;

  if (!data) return null;

  const blog = mapBlogRowToBlog(data);
  const tags = await fetchBlogTags(blog.id);
  blog.tags = tags;
  return blog;
};

export const fetchBlogTags = async (blogId: string): Promise<string[]> => {
  const { data, error } = await supabase
    .from("blog_tags")
    .select("tag")
    .eq("blog_id", blogId);

  if (error) throw error;

  return (data ?? []).map((r) => r.tag);
};

export const fetchAllTags = async (): Promise<string[]> => {
  const { data, error } = await supabase
    .from("blog_tags")
    .select("tag", { count: "exact", head: false })
    .order("tag");

  if (error) throw error;

  return [...new Set((data ?? []).map((r) => r.tag))].sort();
};

async function enrichWithTags(blogs: Blog[]): Promise<Blog[]> {
  if (blogs.length === 0) return blogs;

  const blogIds = blogs.map((b) => b.id);
  const { data: tagRows, error: tagError } = await supabase
    .from("blog_tags")
    .select("blog_id, tag")
    .in("blog_id", blogIds);

  if (tagError) throw tagError;

  const tagMap: Record<string, string[]> = {};
  for (const row of tagRows ?? []) {
    if (!tagMap[row.blog_id]) tagMap[row.blog_id] = [];
    tagMap[row.blog_id].push(row.tag);
  }

  return blogs.map((blog) => ({
    ...blog,
    tags: tagMap[blog.id] ?? [],
  }));
}

export const createBlog = async (
  blog: Omit<Blog, "id" | "createdAt" | "updatedAt" | "views">,
): Promise<Blog> => {
  const { tags, ...rowData } = blog;

  const insertData: Database["public"]["Tables"]["blogs"]["Insert"] = {
    title: rowData.title,
    slug: rowData.slug,
    excerpt: rowData.excerpt || null,
    content: rowData.content || null,
    cover_image: rowData.coverImage || null,
    author_id: rowData.authorId || null,
    published: rowData.published,
    featured: rowData.featured ?? false,
    meta_title: rowData.metaTitle || rowData.title,
    meta_description: rowData.metaDescription || rowData.excerpt?.slice(0, 160) || null,
    published_at: rowData.published ? (new Date()).toISOString() : null,
  };

  const { data, error } = await supabase
    .from("blogs")
    .insert(insertData)
    .select()
    .single();

  if (error) throw error;

  const created = mapBlogRowToBlog(data);

  if (tags && tags.length > 0) {
    const tagRows = tags.map((tag) => ({
      blog_id: created.id,
      tag: tag.toLowerCase().trim(),
    }));
    const { error: tagError } = await supabase
      .from("blog_tags")
      .insert(tagRows);

    if (tagError) throw tagError;
    created.tags = tags;
  }

  return created;
};

export const updateBlog = async (
  id: string,
  blog: Partial<Blog>,
): Promise<Blog> => {
  const { tags, ...rowData } = blog;

  const updateData: Database["public"]["Tables"]["blogs"]["Update"] = {};
  if (rowData.title !== undefined) updateData.title = rowData.title;
  if (rowData.slug !== undefined) updateData.slug = rowData.slug;
  if (rowData.excerpt !== undefined) updateData.excerpt = rowData.excerpt || null;
  if (rowData.content !== undefined) updateData.content = rowData.content || null;
  if (rowData.coverImage !== undefined) updateData.cover_image = rowData.coverImage || null;
  if (rowData.authorId !== undefined) updateData.author_id = rowData.authorId || null;
  if (rowData.published !== undefined) updateData.published = rowData.published;
  if (rowData.featured !== undefined) updateData.featured = rowData.featured;
  if (rowData.metaTitle !== undefined) updateData.meta_title = rowData.metaTitle || null;
  if (rowData.metaDescription !== undefined) updateData.meta_description = rowData.metaDescription || null;
  if (rowData.publishedAt !== undefined) updateData.published_at = rowData.publishedAt || null;

  if (rowData.published && !rowData.publishedAt) {
    updateData.published_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("blogs")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  const updated = mapBlogRowToBlog(data);

  if (tags !== undefined) {
    const { error: deleteTagError } = await supabase
      .from("blog_tags")
      .delete()
      .eq("blog_id", id);

    if (deleteTagError) throw deleteTagError;

    if (tags.length > 0) {
      const tagRows = tags.map((tag) => ({
        blog_id: id,
        tag: tag.toLowerCase().trim(),
      }));
      const { error: insertTagError } = await supabase
        .from("blog_tags")
        .insert(tagRows);

      if (insertTagError) throw insertTagError;
    }

    updated.tags = tags;
  }

  return updated;
};

export const deleteBlog = async (id: string): Promise<void> => {
  const { error: tagError } = await supabase
    .from("blog_tags")
    .delete()
    .eq("blog_id", id);

  if (tagError) throw tagError;

  const { error } = await supabase.from("blogs").delete().eq("id", id);
  if (error) throw error;
};

export const duplicateBlog = async (id: string): Promise<Blog> => {
  const original = await fetchBlogById(id);
  if (!original) throw new Error("Blog not found");

  const { tags, ...rest } = original;
  const copy = {
    ...rest,
    tags,
    slug: `${original.slug}-copy-${Date.now()}`,
    title: `${original.title} (Copy)`,
    published: false,
    publishedAt: "",
  };

  return createBlog(copy);
};

export const incrementBlogViews = async (id: string): Promise<void> => {
  const { data, error } = await supabase
    .from("blogs")
    .select("views")
    .eq("id", id)
    .single();

  if (error) throw error;

  const currentViews = data?.views ?? 0;
  const { error: updateError } = await supabase
    .from("blogs")
    .update({ views: currentViews + 1 })
    .eq("id", id);

  if (updateError) throw updateError;
};
