const PLACEHOLDER_URL = "https://via.placeholder.com/250x350/1a1a2e/eaeaea";

const IMAGES = Array.from(
  { length: 8 },
  (_, i) => `${PLACEHOLDER_URL}?text=Review+${i + 1}`,
);

const col: string[] = [...IMAGES, ...IMAGES];

const ReviewScroller = () => {
  return (
    <section className="section-shell-lg relative">
      <div className="container relative z-10">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="space-y-8">
            <div>
              <p className="eyebrow mb-4 text-primary">Testimonials</p>
              <h2 className="section-title text-glow font-display text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
                What Our Clients Say
              </h2>
              <p className="section-copy mt-4 max-w-md text-sm md:text-base">
                Real feedback from real creators who trusted us with their
                vision.
              </p>
            </div>

            <div className="divider-glow w-48" />

            <div className="grid grid-cols-3 gap-10 md:gap-8">
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  2,000+
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Reviews
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  500+
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Customers
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-white md:text-4xl">
                  120+
                </p>
                <p className="mt-1.5 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Cities
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="scroll-col relative h-[440px] overflow-hidden md:h-[520px] lg:h-[600px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[hsl(var(--background))] to-transparent md:h-20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[hsl(var(--background))] to-transparent md:h-20" />
              <div className="scroll-col-inner">
                {col.map((src, i) => (
                  <div
                    key={`a-${i}`}
                    className="mb-4 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10),0_1px_4px_-2px_rgba(0,0,0,0.06)] last:mb-0"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="scroll-col relative h-[440px] overflow-hidden md:h-[520px] lg:h-[600px]">
              <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-[hsl(var(--background))] to-transparent md:h-20" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-[hsl(var(--background))] to-transparent md:h-20" />
              <div className="scroll-col-inner scroll-col-inner--slower">
                {col.map((src, i) => (
                  <div
                    key={`b-${i}`}
                    className="mb-4 overflow-hidden rounded-[1.25rem] bg-white shadow-[0_4px_24px_-8px_rgba(0,0,0,0.10),0_1px_4px_-2px_rgba(0,0,0,0.06)] last:mb-0"
                  >
                    <img
                      src={src}
                      alt=""
                      className="w-full h-auto"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewScroller;
