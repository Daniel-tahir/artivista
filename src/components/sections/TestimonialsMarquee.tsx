import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue } from "framer-motion";
import { reviewImages } from "@/generated/review-images";

type ReviewImage = string;

const allImages: ReviewImage[] = [...reviewImages];

function balanceArrays<T>(a: readonly T[], b: readonly T[]): [T[], T[]] {
  if (a.length === b.length) return [[...a], [...b]];
  const [shorter, longer] =
    a.length < b.length ? [a, b] : [b, a];
  const padded: T[] = [];
  for (let i = 0; i < longer.length; i++) {
    padded.push(shorter[i % shorter.length]);
  }
  return a.length < b.length ? [padded, [...b]] : [[...a], padded];
}

const [columnA, columnB] = balanceArrays(
  [...allImages],
  [...allImages].reverse(),
);

const ImageCard = ({ src }: { src: string }) => (
  <div className="mb-4 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10),0_1px_4px_-2px_rgba(0,0,0,0.06)] last:mb-0">
    <img
      src={src}
      alt=""
      className="w-full h-auto"
      loading="lazy"
      decoding="async"
    />
  </div>
);

function useCountUp(target: number, suffix: string, shouldStart: boolean) {
  const [display, setDisplay] = useState(`0${suffix}`);

  useEffect(() => {
    if (!shouldStart) return;

    const duration = 2000;
    let start: number | null = null;
    let raf: number;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

    const tick = (now: number) => {
      if (start === null) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const val = Math.round(target * eased);
      setDisplay(`${val.toLocaleString()}${suffix}`);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [shouldStart, target, suffix]);

  return display;
}

function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return prefersReduced;
}

function useMarquee(initialDirection: 1 | -1, isVisible: boolean) {
  const y = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [singleSetHeight, setSingleSetHeight] = useState(0);
  const singleSetHeightRef = useRef(0);
  const dirRef = useRef(initialDirection);
  const positionRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;

    const measure = () => {
      const h = el.scrollHeight / 2;
      if (h > 0 && h !== singleSetHeightRef.current) {
        singleSetHeightRef.current = h;
        setSingleSetHeight(h);
      }
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    return () => ro.disconnect();
  }, []);

  // Left column (dir=1, scrolls down): start at -h, move toward 0, wrap at 0
  // Right column (dir=-1, scrolls up): start at 0, move toward -h, wrap at -h
  useEffect(() => {
    if (singleSetHeightRef.current === 0) return;
    if (dirRef.current === 1) {
      positionRef.current = -singleSetHeightRef.current;
      y.set(positionRef.current);
    }
  }, [singleSetHeight, initialDirection, y]);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return;

    const tick = (now: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      const delta = now - lastTimeRef.current;
      lastTimeRef.current = now;

      if (!isHoveredRef.current && singleSetHeightRef.current > 0) {
        const h = singleSetHeightRef.current;

        if (dirRef.current === 1) {
          // Scroll down: position increases, wraps at 0 → -h
          positionRef.current += delta * 0.038;
          if (positionRef.current >= 0) {
            positionRef.current = -h;
          }
        } else {
          // Scroll up: position decreases, wraps at -h → 0
          positionRef.current -= delta * 0.038;
          if (positionRef.current <= -h) {
            positionRef.current = 0;
          }
        }

        y.set(positionRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      lastTimeRef.current = null;
    };
  }, [isVisible, singleSetHeight, prefersReducedMotion, y]);

  return { y, contentRef, setIsHovered };
}

const MarqueeColumn = ({
  images,
  initialDirection,
  isVisible,
}: {
  images: ReviewImage[];
  initialDirection: 1 | -1;
  isVisible: boolean;
}) => {
  const { y, contentRef, setIsHovered } = useMarquee(initialDirection, isVisible);

  if (images.length === 0) return null;

  return (
    <div
      className="relative h-[440px] overflow-hidden md:h-[520px] lg:h-[600px]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[hsl(var(--background))] to-transparent md:h-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[hsl(var(--background))] to-transparent md:h-20" />

      <div ref={contentRef}>
        <motion.div style={{ y }} className="will-change-transform">
          {[...images, ...images].map((src, i) => (
            <ImageCard key={`${src}-${i}`} src={src} />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const TestimonialsMarquee = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isSectionVisible, setIsSectionVisible] = useState(false);
  const [countersStarted, setCountersStarted] = useState(false);
  const countersStartedRef = useRef(false);

  const hasImages = allImages.length > 0;

  const reviewsCount = useCountUp(300, "+", countersStarted);
  const customersCount = useCountUp(500, "+", countersStarted);
  const citiesCount = useCountUp(80, "+", countersStarted);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsSectionVisible(entry.isIntersecting);
        if (entry.isIntersecting && !countersStartedRef.current) {
          countersStartedRef.current = true;
          setCountersStarted(true);
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="section-shell-lg relative"
    >
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-4 text-primary">Testimonials</p>
              <h2 className="section-title text-glow font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                Trusted by Creators Worldwide
              </h2>
              <p className="section-copy mt-4 max-w-md text-sm md:text-base">
                Join hundreds of satisfied clients who trust us to bring their
                creative visions to life with exceptional artistry and
                professionalism.
              </p>
            </div>

            <div className="divider-glow w-48" />

            <div className="grid grid-cols-3 gap-10 md:gap-8">
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  {reviewsCount}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Reviews
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  {customersCount}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Customers
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  {citiesCount}
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Cities
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {hasImages ? (
              <>
                <MarqueeColumn
                  images={columnA}
                  initialDirection={1}
                  isVisible={isSectionVisible}
                />
                <MarqueeColumn
                  images={columnB}
                  initialDirection={-1}
                  isVisible={isSectionVisible}
                />
              </>
            ) : (
              <p className="col-span-2 text-center text-sm text-muted-foreground">
                Add screenshots to <code>public/review-section/</code> and run
                the dev server to see them here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsMarquee;
