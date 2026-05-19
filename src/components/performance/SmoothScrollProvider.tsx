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
    if (prefersReducedMotion || !canHover || lenisRef.current) {
      return;
    }

    const lenis = new Lenis({
      duration: 1,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1,
      infinite: false,
    });

    lenisRef.current = lenis;
    let isRunning = document.visibilityState === "visible";

    const raf = (time: number) => {
      if (!isRunning) return;
      lenis.raf(time);
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const start = () => {
      if (frameRef.current !== null) return;
      isRunning = true;
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const stop = () => {
      isRunning = false;
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        start();
      } else {
        stop();
      }
    };

    start();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
      lenisRef.current = null;
      frameRef.current = null;
    };
  }, [canHover, prefersReducedMotion]);

  return children;
};

export default SmoothScrollProvider;
