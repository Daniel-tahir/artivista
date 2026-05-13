import { useMemo } from "react";

const StarField = () => {
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
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
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
          }}
        />
      ))}
    </div>
  );
};

export default StarField;
