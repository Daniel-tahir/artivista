import { memo } from "react";
import { cn } from "@/lib/utils";

interface ArtworkGalleryGridItem {
  image: string;
  title: string;
}

interface ArtworkGalleryGridProps {
  items: ArtworkGalleryGridItem[];
  onSelect: (index: number) => void;
  isGroupArt?: boolean;
}

const ArtworkGalleryGrid = ({
  items,
  onSelect,
  isGroupArt = false,
}: ArtworkGalleryGridProps) => {
  return (
    <div
      className={cn(
        "grid gap-2 sm:gap-3 md:gap-4",
        isGroupArt
          ? "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
          : "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5",
      )}
    >
      {items.map((item, index) => (
        <button
          key={`${item.image}-${index}`}
          type="button"
          onClick={() => onSelect(index)}
          aria-label={`Open artwork ${index + 1}`}
          className={cn(
            "group relative block overflow-hidden rounded-[1.1rem] bg-white/[0.03] text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
            isGroupArt ? "aspect-[1.55/1] sm:aspect-[1.65/1]" : "aspect-square",
          )}
        >
          <img
            src={item.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </button>
      ))}
    </div>
  );
};

export default memo(ArtworkGalleryGrid);
