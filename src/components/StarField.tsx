import { useEffect, useMemo, useState } from "react";
import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";
import { useInViewState } from "@/hooks/use-in-view";

const StarField = () => {
  const { prefersReducedMotion } = usePerformanceProfile();
  const { ref: starfieldRef, isInView } = useInViewState({ threshold: 0 });
  const [isPageVisible, setIsPageVisible] = useState(true);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const handleVisibilityChange = () => {
      setIsPageVisible(document.visibilityState === "visible");
    };

    handleVisibilityChange();
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const shouldAnimate = isInView && isPageVisible && !prefersReducedMotion;

  const particles = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 20,
        duration: 15 + Math.random() * 20,
        size: 1 + Math.random() * 3,
        color: ["primary", "neon-magenta", "neon-blue"][Math.floor(Math.random() * 3)],
      })),
    []
  );

  return (
    <div ref={starfieldRef} className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-full bg-primary"
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: `hsl(var(--${p.color}))`,
            boxShadow: `0 0 ${p.size * 4}px hsl(var(--${p.color}) / 0.8)`,
            animation: `particle-rise ${p.duration}s linear infinite`,
            animationDelay: `${p.delay}s`,
            animationPlayState: shouldAnimate ? "running" : "paused",
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
