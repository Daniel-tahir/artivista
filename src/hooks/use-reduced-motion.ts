import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const getMatches = () =>
  typeof window !== "undefined" ? window.matchMedia(QUERY).matches : false;

export const useReducedMotionPreference = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(getMatches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);
    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReducedMotion;
};
