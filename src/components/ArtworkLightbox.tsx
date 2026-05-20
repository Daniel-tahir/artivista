import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArtworkLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  items: Array<{
    title: string;
    image: string;
  }>;
  activeIndex: number;
  onPrevious: () => void;
  onNext: () => void;
}

const ArtworkLightbox = ({
  open,
  onOpenChange,
  items,
  activeIndex,
  onPrevious,
  onNext,
}: ArtworkLightboxProps) => {
  const activeItem = items[activeIndex];
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }

      if (event.key === "ArrowLeft") {
        onPrevious();
      }

      if (event.key === "ArrowRight") {
        onNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onOpenChange, onPrevious, open]);

  const counterText = useMemo(
    () => `${activeIndex + 1} / ${items.length}`,
    [activeIndex, items.length],
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <AnimatePresence>
      {open && activeItem ? (
        <motion.div
          key="artwork-lightbox"
          className="fixed inset-0 z-[80] flex items-center justify-center overflow-hidden bg-black/70 px-3 py-6 backdrop-blur-xl sm:px-5 md:px-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onOpenChange(false)}
        >
          <motion.div
            className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_28%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <div className="absolute inset-x-3 top-3 z-[82] flex items-center justify-between sm:inset-x-5 sm:top-5 md:inset-x-8">
            <div className="rounded-full border border-white/10 bg-black/35 px-4 py-2 text-sm text-white/88 backdrop-blur-md">
              {counterText}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={(event) => {
                event.stopPropagation();
                onOpenChange(false);
              }}
              className="h-11 w-11 rounded-full border border-white/10 bg-black/35 text-white hover:bg-black/50 hover:text-white"
              aria-label="Close fullscreen viewer"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation();
              onPrevious();
            }}
            className="absolute left-3 top-1/2 z-[82] hidden h-12 w-12 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 text-white hover:bg-black/50 hover:text-white md:flex"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={(event) => {
              event.stopPropagation();
              onNext();
            }}
            className="absolute right-3 top-1/2 z-[82] hidden h-12 w-12 -translate-y-1/2 rounded-full border border-white/10 bg-black/35 text-white hover:bg-black/50 hover:text-white md:flex"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <motion.div
            key={activeItem.image}
            className="relative z-[81] flex h-full w-full items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.06}
            onDragEnd={(_, info) => {
              const offsetX = info.offset.x;
              const velocityX = info.velocity.x;

              if (offsetX < -70 || velocityX < -500) {
                onNext();
                return;
              }

              if (offsetX > 70 || velocityX > 500) {
                onPrevious();
              }
            }}
            style={{ touchAction: "pan-y" }}
          >
            <img
              src={activeItem.image}
              alt={activeItem.title}
              className="max-h-[84vh] max-w-full select-none object-contain shadow-[0_24px_90px_-36px_rgba(0,0,0,0.95)]"
              decoding="async"
              draggable={false}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
};

export default ArtworkLightbox;
