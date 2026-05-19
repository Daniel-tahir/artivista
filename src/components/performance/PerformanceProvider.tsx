import {
  ReactNode,
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PerformanceContextValue {
  isScrolled: boolean;
  prefersReducedMotion: boolean;
  isTouchDevice: boolean;
  canHover: boolean;
}

const PerformanceContext = createContext<PerformanceContextValue | null>(null);

const DESKTOP_HOVER_QUERY = "(hover: hover) and (pointer: fine)";
const TOUCH_QUERY = "(pointer: coarse)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

interface PerformanceProviderProps {
  children: ReactNode;
}

const getMediaMatches = (query: string) =>
  typeof window !== "undefined" ? window.matchMedia(query).matches : false;

const PerformanceProvider = ({ children }: PerformanceProviderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => getMediaMatches(REDUCED_MOTION_QUERY));
  const [isTouchDevice, setIsTouchDevice] = useState(() => getMediaMatches(TOUCH_QUERY));
  const [canHover, setCanHover] = useState(() => getMediaMatches(DESKTOP_HOVER_QUERY));
  const scrollFrameRef = useRef(0);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const reducedMotionMedia = window.matchMedia(REDUCED_MOTION_QUERY);
    const touchMedia = window.matchMedia(TOUCH_QUERY);
    const hoverMedia = window.matchMedia(DESKTOP_HOVER_QUERY);

    const handleReducedMotionChange = () => setPrefersReducedMotion(reducedMotionMedia.matches);
    const handleTouchChange = () => setIsTouchDevice(touchMedia.matches);
    const handleHoverChange = () => setCanHover(hoverMedia.matches);

    const syncScrollState = () => {
      scrollFrameRef.current = 0;
      const nextScrolled = window.scrollY > 24;

      if (scrolledRef.current === nextScrolled) {
        return;
      }

      scrolledRef.current = nextScrolled;
      setIsScrolled(nextScrolled);
    };

    const handleScroll = () => {
      if (scrollFrameRef.current !== 0) return;
      scrollFrameRef.current = window.requestAnimationFrame(syncScrollState);
    };

    handleReducedMotionChange();
    handleTouchChange();
    handleHoverChange();
    syncScrollState();

    reducedMotionMedia.addEventListener("change", handleReducedMotionChange);
    touchMedia.addEventListener("change", handleTouchChange);
    hoverMedia.addEventListener("change", handleHoverChange);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      if (scrollFrameRef.current !== 0) {
        window.cancelAnimationFrame(scrollFrameRef.current);
      }

      reducedMotionMedia.removeEventListener("change", handleReducedMotionChange);
      touchMedia.removeEventListener("change", handleTouchChange);
      hoverMedia.removeEventListener("change", handleHoverChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const value = useMemo(
    () => ({
      isScrolled,
      prefersReducedMotion,
      isTouchDevice,
      canHover,
    }),
    [canHover, isScrolled, isTouchDevice, prefersReducedMotion],
  );

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
};

export const usePerformanceProfile = () => {
  const context = useContext(PerformanceContext);

  if (!context) {
    throw new Error("usePerformanceProfile must be used within PerformanceProvider");
  }

  return context;
};

export default memo(PerformanceProvider);
