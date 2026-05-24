import { useQuery } from "@tanstack/react-query";
import { fetchBlogs } from "@/services/blogs/blog.service";

export const useBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5,
  });
