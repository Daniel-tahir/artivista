import { useEffect, useRef, useState } from "react";
import { Quote, ShieldCheck, Star } from "lucide-react";
import { useArtworkLibrary } from "@/hooks/use-artwork-library";
import { siteAssets } from "@/lib/site-assets";
import { useInViewState } from "@/hooks/use-in-view";
import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";

const featuredTestimonial = {
  name: "ELENA R.",
  role: "Creative Director, Astral Forge",
  avatar: siteAssets.hero.sorceress,
  quote:
    "Working with ARTIVISTAA was the best decision we made for our launch. The artwork felt handcrafted for our world, elevated our brand instantly, and gave our audience something they could believe in.",
};

const Testimonials = () => {
  const { getArtworksByCategory } = useArtworkLibrary();
  const { prefersReducedMotion } = usePerformanceProfile();
  const { ref: visibilityRef, isInView } = useInViewState({ threshold: 0.2 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const shouldAnimate = isInView && !prefersReducedMotion;
  const artistArtwork = getArtworksByCategory("dnd")[0]?.image ?? siteAssets.hero.sorceress;
  const transmissions = [
    {
      name: "Elena R.",
      role: "Client",
      side: "left",
      avatar: siteAssets.hero.sorceress,
      message:
        "Hi! I need a cinematic portrait for our game launch. I want it to feel regal, dangerous, and unmistakably ours.",
      stamp: "20:14",
    },
    {
      name: "ARTIVISTAA",
      role: "Artist",
      side: "right",
      avatar: artistArtwork,
      message:
        "Transmission received. I can build that mood with a moonlit palette, ceremonial armor details, and a sharper focal glow around the eyes.",
      stamp: "20:16",
    },
    {
      name: "Elena R.",
      role: "Client",
      side: "left",
      avatar: siteAssets.hero.sorceress,
      message:
        "That sounds perfect. We also need it polished enough for the landing page and social teasers without losing the fantasy soul.",
      stamp: "20:18",
    },
    {
      name: "ARTIVISTAA",
      role: "Artist",
      side: "right",
      avatar: artistArtwork,
      message:
        "Understood. I'll deliver a hero-grade composition with marketing-ready framing, plus enough atmosphere to feel like a living world.",
      stamp: "20:20",
    },
    {
      name: "Elena R.",
      role: "Client",
      side: "left",
      avatar: siteAssets.hero.sorceress,
      message:
        "You absolutely nailed it. The final piece felt like it came from our own lore bible, only better.",
      stamp: "20:27",
    },
  ];

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isActive || visibleCount >= transmissions.length) return;

    const timer = window.setTimeout(() => {
      setVisibleCount((current) => current + 1);
    }, visibleCount === 0 ? 220 : 520);

    return () => window.clearTimeout(timer);
  }, [isActive, visibleCount]);

  const isTyping = isActive && visibleCount < transmissions.length;

  return (
    <section
      ref={(node) => {
        sectionRef.current = node;
        visibilityRef.current = node;
      }}
      id="testimonials"
      className="section-shell-lg relative"
    >
      <div className="container relative z-10">
        <div
          className={`mx-auto max-w-6xl transition-all duration-1000 ${
            isActive ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-14 text-center md:mb-16">
            <p className="eyebrow mb-4 text-primary">Client Transmissions</p>
            <h2 className="section-title text-glow mb-4 font-display text-4xl font-bold md:text-6xl">Client Transmissions</h2>
            <p className="section-copy mx-auto max-w-2xl text-sm md:text-base">
              Direct from the guild communications.
            </p>
            <div className="divider-glow mx-auto mt-6 w-72" />
          </div>

          <div className="transmission-shell glow-border relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,hsl(var(--card)/0.92),hsl(var(--secondary)/0.74))] shadow-[0_30px_120px_-40px_hsl(var(--primary)/0.42)] backdrop-blur-xl">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--primary)/0.2),transparent_36%),radial-gradient(circle_at_90%_20%,hsl(var(--neon-blue)/0.14),transparent_28%),radial-gradient(circle_at_bottom,hsl(var(--primary-glow)/0.18),transparent_38%)]" />
            <div className="transmission-noise absolute inset-0 opacity-20" />
            <div
              className={`transmission-scanlines absolute inset-0 opacity-20 ${shouldAnimate ? "" : "transmission-scanlines-paused"}`}
            />
            <div className="pointer-events-none absolute -left-10 top-12 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute right-6 top-1/3 h-28 w-28 rounded-full bg-blue-500/20 blur-3xl" />

            <div className="relative grid gap-0 lg:grid-cols-[1.22fr_1fr]">
              <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-cyan-200/70">Guild Relay</p>
                    <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">Client Chat Transmissions</h3>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-cyan-100">
                    <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.9)]" />
                    Encrypted Link
                  </div>
                </div>

                <div className="space-y-4">
                  {transmissions.slice(0, visibleCount).map((item, index) => {
                    const isClient = item.side === "left";
                    const isLatest = index === visibleCount - 1;

                    return (
                      <article
                        key={`${item.name}-${index}`}
                        className={`group flex items-end gap-3 transition-all duration-500 ${
                          isClient ? "justify-start" : "justify-end"
                        } ${isActive ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}`}
                      >
                        <div
                          className={`flex items-end gap-3 ${isClient ? "" : "flex-row-reverse text-right"}`}
                        >
                          <div
                            className={`h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border transition-transform duration-300 group-hover:scale-105 ${
                              isClient
                                ? "border-fuchsia-300/35 shadow-[0_0_26px_rgba(217,70,239,0.26)]"
                                : "border-cyan-300/35 shadow-[0_0_26px_rgba(34,211,238,0.24)]"
                            }`}
                          >
                            <img
                              src={item.avatar}
                              alt={item.name}
                              width={isClient ? 1920 : 768}
                              height={isClient ? 1080 : 1024}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              decoding="async"
                            />
                          </div>

                          <div
                            className={`max-w-[28rem] rounded-[1.35rem] border px-4 py-4 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.22)] ${
                              isClient
                                ? "rounded-bl-md border-fuchsia-300/20 bg-[linear-gradient(180deg,rgba(37,18,56,0.88),rgba(24,12,42,0.78))]"
                                : "rounded-br-md border-cyan-300/20 bg-[linear-gradient(180deg,rgba(7,35,45,0.88),rgba(8,24,34,0.78))]"
                            } ${isLatest ? "ring-1 ring-primary/40 shadow-[0_0_36px_rgba(168,85,247,0.25)]" : ""}`}
                          >
                            <div className={`mb-2 flex items-center gap-3 ${isClient ? "" : "justify-end"}`}>
                              <div>
                                <p className="text-sm font-semibold text-white">{item.name}</p>
                                <p className="text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                                  {item.role}
                                </p>
                              </div>
                              <span className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                                {item.stamp}
                              </span>
                            </div>
                            <p className="text-[13px] leading-6 text-slate-100/90 md:text-sm">{item.message}</p>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {isTyping ? (
                    <div className="flex items-end gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-full border border-cyan-300/35 shadow-[0_0_22px_rgba(34,211,238,0.2)]">
                        <img
                          src={artistArtwork}
                          alt="ARTIVISTAA"
                          width={768}
                          height={1024}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-slate-950/60 px-4 py-3 text-xs uppercase tracking-[0.28em] text-cyan-100/80">
                        Transmitting
                        <span className="typing-dots inline-flex items-center gap-1">
                          <span />
                          <span />
                          <span />
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <aside className="relative flex items-center p-6 md:p-8">
                <div
                  className={`group relative w-full overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(160deg,rgba(55,26,88,0.92),rgba(17,16,48,0.92))] px-6 py-8 text-center shadow-[0_20px_80px_-30px_rgba(99,102,241,0.55)] transition-all duration-700 md:px-8 ${
                    isActive ? "scale-100 opacity-100" : "scale-95 opacity-0"
                  }`}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(196,181,253,0.24),transparent_32%),radial-gradient(circle_at_50%_110%,rgba(56,189,248,0.18),transparent_36%)]" />
                  <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-200/60 to-transparent" />

                  <div className="relative">
                    <div className="mx-auto mb-5 h-24 w-24 overflow-hidden rounded-full border border-yellow-200/30 bg-[radial-gradient(circle,rgba(251,191,36,0.18),rgba(147,51,234,0.14)_58%,transparent_70%)] shadow-[0_0_50px_rgba(168,85,247,0.35)] transition-all duration-500 group-hover:scale-105 group-hover:shadow-[0_0_80px_rgba(168,85,247,0.45)]">
                      <img
                        src={featuredTestimonial.avatar}
                        alt={featuredTestimonial.name}
                        width={1920}
                        height={1080}
                        className="h-full w-full object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="mb-6 flex justify-center gap-2 text-yellow-300 [filter:drop-shadow(0_0_10px_rgba(250,204,21,0.45))]">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} className="h-5 w-5 fill-current" />
                      ))}
                    </div>

                    <p className="mb-6 text-[11px] uppercase tracking-[0.35em] text-fuchsia-100/70">
                      Featured Testimonial
                    </p>

                    <Quote className="mx-auto mb-5 h-8 w-8 text-fuchsia-100/70" />

                    <blockquote className="mx-auto max-w-md font-display text-lg italic leading-relaxed text-white md:text-[1.45rem]">
                      “{featuredTestimonial.quote}”
                    </blockquote>

                    <div className="mt-8">
                      <p className="text-sm font-bold tracking-[0.28em] text-white">
                        {featuredTestimonial.name}
                      </p>
                      <p className="mt-2 text-sm text-fuchsia-100/70">{featuredTestimonial.role}</p>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-emerald-100">
                      <ShieldCheck className="h-4 w-4" />
                      Verified Transmission
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
