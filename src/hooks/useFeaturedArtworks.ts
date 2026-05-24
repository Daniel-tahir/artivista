import { useQuery } from "@tanstack/react-query";
import { fetchFeaturedArtworks } from "@/services/artworks/artwork.service";

export const useFeaturedArtworks = () =>
  useQuery({
    queryKey: ["artworks", "featured"],
    queryFn: () => fetchFeaturedArtworks(),
    staleTime: 1000 * 60,
  });
