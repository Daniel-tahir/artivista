import { ReactNode, useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";

interface SmoothScrollProviderProps {
  children: ReactNode;
}

const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
  const lenisRef = useRef<Lenis | null>(null);
  const frameRef = useRef<number | null>(null);
  const idleTimeoutRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);
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
    const raf = (time: number) => {
      if (!isRunningRef.current) return;
      lenis.raf(time);
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const start = () => {
      if (frameRef.current !== null) return;
      isRunningRef.current = true;
      lenis.start();
      frameRef.current = window.requestAnimationFrame(raf);
    };

    const stop = () => {
      isRunningRef.current = false;
      lenis.stop();
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
    };

    const markActive = () => {
      if (document.visibilityState !== "visible") {
        return;
      }

      start();

      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
      }

      idleTimeoutRef.current = window.setTimeout(() => {
        stop();
      }, 140);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        markActive();
      } else {
        stop();
      }
    };

    const handleWheel = () => markActive();
    const handleTouch = () => markActive();

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("touchstart", handleTouch, { passive: true });
    window.addEventListener("touchmove", handleTouch, { passive: true });

    lenis.on("scroll", markActive);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouch);
      window.removeEventListener("touchmove", handleTouch);
      lenis.off("scroll", markActive);

      if (idleTimeoutRef.current !== null) {
        window.clearTimeout(idleTimeoutRef.current);
        idleTimeoutRef.current = null;
      }

      lenis.destroy();
      lenisRef.current = null;
      frameRef.current = null;
    };
  }, [canHover, prefersReducedMotion]);

  return children;
};

export default SmoothScrollProvider;
