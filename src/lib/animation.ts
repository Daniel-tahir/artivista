import type { CSSProperties } from "react";
import type { Transition, Variants } from "framer-motion";

export const PREMIUM_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const DURATIONS = {
  fast: 0.28,
  medium: 0.4,
  slow: 0.8,
} as const;

export const hoverTransition: Transition = {
  duration: DURATIONS.medium,
  ease: PREMIUM_EASE,
};

export const fadeInUpVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 22,
  },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.slow,
      delay,
      ease: PREMIUM_EASE,
    },
  }),
};

export const getAnimationDelayStyle = (delayMs = 0): CSSProperties => ({
  animationDelay: `${delayMs}ms`,
});
