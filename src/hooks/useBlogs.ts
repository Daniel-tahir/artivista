import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchBlogs, publishDueBlogs } from "@/services/blogs/blog.service";

export const useBlogs = () =>
  useQuery({
    queryKey: ["blogs"],
    queryFn: fetchBlogs,
    staleTime: 1000 * 60 * 5,
  });

export const useBlogPublisher = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const syncScheduledPosts = async () => {
      try {
        const published = await publishDueBlogs();
        if (published > 0) {
          await queryClient.invalidateQueries({ queryKey: ["blogs"] });
          await queryClient.invalidateQueries({ queryKey: ["admin-blogs"] });
        }
      } catch (error) {
        console.error("[blogs] scheduled publish sync failed", error);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void syncScheduledPosts();
      }
    };

    void syncScheduledPosts();

    document.addEventListener("visibilitychange", handleVisibility);

    const intervalId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void syncScheduledPosts();
      }
    }, 60_000);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [queryClient]);
};
