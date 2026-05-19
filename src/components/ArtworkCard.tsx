import { memo, MouseEvent, useRef } from "react";
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
  const isInteractive = Boolean(onClick);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(1000px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-8px)`;
  };

  const handleLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
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
