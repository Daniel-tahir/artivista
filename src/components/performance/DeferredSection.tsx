import { ReactNode, memo, useEffect, useRef, useState } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  minHeightClassName?: string;
  rootMargin?: string;
}

const DeferredSection = ({
  children,
  minHeightClassName = "min-h-[32rem]",
  rootMargin = "320px 0px",
}: DeferredSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const placeholderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVisible) return;

    const node = placeholderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  if (isVisible) {
    return <>{children}</>;
  }

  return <div ref={placeholderRef} aria-hidden="true" className={minHeightClassName} />;
};

export default memo(DeferredSection);
