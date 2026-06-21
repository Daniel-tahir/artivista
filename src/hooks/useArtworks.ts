import { useQuery } from "@tanstack/react-query";
import { fetchArtworks, type FetchArtworksOptions } from "@/services/artworks/artwork.service";

export const useArtworks = (options: FetchArtworksOptions = {}) =>
  useQuery({
    queryKey: ["artworks", options],
    queryFn: () => fetchArtworks(options),
    staleTime: 1000 * 60 * 5,
  });
