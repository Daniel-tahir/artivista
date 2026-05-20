import { useEffect, useRef, useState } from "react";

type InViewOptions = {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
};

export const useInViewState = (options: InViewOptions = {}) => {
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(true);

  const { root = null, rootMargin = "0px", threshold = 0 } = options;

  useEffect(() => {
    const node = ref.current;

    if (!node || typeof IntersectionObserver === "undefined") {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { root, rootMargin, threshold },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [root, rootMargin, threshold]);

  return { ref, isInView };
};
