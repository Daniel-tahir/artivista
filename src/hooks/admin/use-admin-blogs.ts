import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchAllBlogs,
  fetchBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  duplicateBlog,
} from "@/services/blogs/blog.service";
import type { Blog } from "@/types/content";

export function useAdminBlogs() {
  const queryClient = useQueryClient();

  const blogsQuery = useQuery({
    queryKey: ["admin-blogs"],
    queryFn: fetchAllBlogs,
    staleTime: 1000 * 30,
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

  return {
    blogs: blogsQuery.data ?? [],
    isLoading: blogsQuery.isLoading,
    isError: blogsQuery.isError,
    createBlog: createMutation.mutateAsync,
    updateBlog: updateMutation.mutateAsync,
    deleteBlog: deleteMutation.mutateAsync,
    duplicateBlog: duplicateMutation.mutateAsync,
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
