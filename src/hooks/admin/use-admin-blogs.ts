import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBlogs,
  fetchBlogById,
  fetchBlogCategories,
  createBlog,
  updateBlog,
  deleteBlog,
  duplicateBlog,
  createBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
} from "@/services/blogs/blog.service";
import type { Blog, BlogCategory } from "@/types/content";

export function useAdminBlogs() {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: fetchAllBlogs,
    staleTime: 1000 * 30,
  });

  const categoriesQuery = useQuery({
    queryKey: ["blog-categories"],
    queryFn: fetchBlogCategories,
    staleTime: 1000 * 60 * 5,
  });

  const createMutation = useMutation({
    mutationFn: (blog: Parameters<typeof createBlog>[0]) => createBlog(blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, blog }: { id: string; blog: Partial<Blog> }) => updateBlog(id, blog),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (id: string) => duplicateBlog(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
      queryClient.invalidateQueries({ queryKey: ["blogs"] });
    },
  });

  const createCategoryMutation = useMutation({
    mutationFn: (cat: Parameters<typeof createBlogCategory>[0]) => createBlogCategory(cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ id, cat }: { id: string; cat: Partial<BlogCategory> }) => updateBlogCategory(id, cat),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (id: string) => deleteBlogCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blog-categories"] });
    },
  });

  return {
    blogs: blogsQuery.data ?? [],
    categories: categoriesQuery.data ?? [],
    isLoading: blogsQuery.isLoading,
    isError: blogsQuery.isError,
    createBlog: createMutation.mutateAsync,
    updateBlog: updateMutation.mutateAsync,
    deleteBlog: deleteMutation.mutateAsync,
    duplicateBlog: duplicateMutation.mutateAsync,
    createCategory: createCategoryMutation.mutateAsync,
    updateCategory: updateCategoryMutation.mutateAsync,
    deleteCategory: deleteCategoryMutation.mutateAsync,
  };
}

export function useAdminBlog(id: string | undefined) {
  return useQuery({
    queryKey: ["admin-blog", id],
    queryFn: () => (id ? fetchBlogById(id) : null),
    enabled: !!id,
    staleTime: 1000 * 30,
  });
}
