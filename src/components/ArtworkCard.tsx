import { memo, PointerEvent, useRef } from "react";
import { cn } from "@/lib/utils";

interface Props {
  image: string;
  title: string;
  delay?: number;
  imageClassName?: string;
  mediaClassName?: string;
  onClick?: () => void;
}

const ArtworkCard = ({
  image,
  title,
  delay = 0,
  imageClassName = "",
  mediaClassName = "",
  onClick,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);
  const latestEventRef = useRef<PointerEvent<HTMLDivElement> | null>(null);
  const isInteractive = Boolean(onClick);

  const handlePointerEnter = () => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!rectRef.current) return;

    latestEventRef.current = event;

    if (frameRef.current !== null) {
      return;
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const el = ref.current;
      const rect = rectRef.current;
      const latestEvent = latestEventRef.current;

      if (!el || !rect || !latestEvent) {
        frameRef.current = null;
        return;
      }

      const x = (latestEvent.clientX - rect.left) / rect.width - 0.5;
      const y = (latestEvent.clientY - rect.top) / rect.height - 0.5;
      el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
      frameRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    rectRef.current = null;
    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        "group relative rounded-2xl glass glow-border overflow-hidden transition-transform duration-500 ease-out shadow-card-cosmic animate-fade-in-up",
        isInteractive && "cursor-pointer",
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left"
        aria-label={isInteractive ? `View ${title} artwork` : title}
      >
        <div className={`relative aspect-[3/4] overflow-hidden ${mediaClassName}`}>
          <img
            src={image}
            alt={title}
            loading="lazy"
            width={768}
            height={1024}
            className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 ${imageClassName}`}
          />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-t from-primary/20 via-transparent to-transparent" />
        </div>
      </button>
    </div>
  );
};

export default memo(ArtworkCard);
