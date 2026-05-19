import MagicButton from "../MagicButton";
import WhatsAppIcon from "../WhatsAppIcon";
import { siteAssets } from "@/lib/site-assets";

const Hero = () => {
  return (
    <section
      id="home"
      className="section-shell-lg relative flex min-h-screen items-center justify-center overflow-hidden"
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={siteAssets.hero.portrait}
          alt="Mystical sorceress with cosmic dragon"
          width={1600}
          height={1131}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover animate-float-slow"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_85%)]" />
      </div>

      {/* Glow orbs */}
      <div className="absolute left-1/4 top-1/3 h-80 w-80 rounded-full bg-primary/20 blur-[100px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-neon-magenta/16 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1.5s" }} />

      {/* Content */}
      <div className="container relative z-10 pb-16 pt-24 text-center md:pt-28">
        <div className="glass animate-fade-in-up mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 md:mb-10">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="eyebrow text-muted-foreground">ARTIVISTAA Custom Character Studio</span>
        </div>

        <h1 className="section-title balance-text animate-fade-in-up mb-6 font-display text-5xl font-bold text-glow sm:text-6xl md:mb-7 md:text-7xl lg:text-8xl" style={{ animationDelay: "150ms" }}>
          <span className="text-foreground">ARTI</span>
          <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">VISTAA</span>
          <br />
          Turns Ideas Into Reality
        </h1>

        <p className="section-copy balance-text mx-auto mb-10 max-w-2xl animate-fade-in-up text-lg md:mb-12 md:text-[1.15rem]" style={{ animationDelay: "300ms" }}>
          ARTIVISTAA creates cinematic custom characters with clean detail, premium polish, and a bold futuristic fantasy edge.
        </p>

        <div
  className="animate-fade-in-up flex flex-wrap items-center justify-center gap-4"
  style={{ animationDelay: "450ms" }}
>
  <MagicButton
    size="lg"
    variant="primary"
    className="animate-pulse-glow min-h-[58px] px-6 py-4 text-base md:min-h-[52px]"
    onClick={() => window.open("https://wa.me/15708078735", "_blank")}
  >
    <WhatsAppIcon className="h-5 w-5" />
    Start Your Idea — WhatsApp
  </MagicButton>

  <a href="#artwork">
    <MagicButton
      size="lg"
      variant="ghost"
      className="min-h-[58px] px-6 py-4 text-base md:min-h-[52px]"
    >
      Explore Artwork
    </MagicButton>
  </a>
</div>

        {/* Scroll indicator */}
        <div className="animate-float absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex h-10 w-6 items-start justify-center rounded-full border border-white/18 bg-white/[0.03] p-1.5">
            <div className="w-1 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
