import { ReactNode, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const frameRef = useRef<number | null>(null);
  const { prefersReducedMotion, canHover } = usePerformanceProfile();

  useEffect(() => {
    if (prefersReducedMotion || !canHover) return;

    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lenis.start();
        frameRef.current = window.requestAnimationFrame(raf);
      } else {
        if (frameRef.current !== null) {
          window.cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }
        lenis.stop();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    frameRef.current = window.requestAnimationFrame(raf);

    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [canHover, prefersReducedMotion]);

  return children;
};

export default SmoothScrollProvider;
