import { Instagram, X } from "lucide-react";
import { Link } from "react-router-dom";
import WhatsAppIcon from "./WhatsAppIcon";
import { siteAssets } from "@/lib/site-assets";

const ArtStationIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
    <path
      d="M13.46 3.5h6.99L24 10.06H17.4L13.46 3.5Z"
      fill="currentColor"
    />
    <path
      d="M0 20.5 8.32 6.18l4.08 6.82H7.15L0 20.5Z"
      fill="currentColor"
    />
    <path
      d="M7.99 14.36h10.21L24 20.5H4.44l3.55-6.14Z"
      fill="currentColor"
    />
  </svg>
);

const socialLinks = [
  {
    label: "Instagram",
    handle: "@artivistaa.__",
    href: "https://www.instagram.com/artivistaa.__/",
    Icon: Instagram,
    iconWrapClass: "bg-[linear-gradient(135deg,#f58529,#feda77,#dd2a7b,#8134af,#515bd4)] text-white shadow-[0_0_24px_rgba(221,42,123,0.35)]",
  },
  {
    label: "Twitter / X",
    handle: "@Artivistaa",
    href: "https://x.com/Artivistaa",
    Icon: X,
    iconWrapClass: "overflow-hidden bg-black shadow-[0_0_22px_rgba(255,255,255,0.16)]",
    imageSrc: siteAssets.icons.xLogo,
  },
  {
    label: "WhatsApp",
    handle: "Chat on WhatsApp",
    href: "https://wa.me/15708078735",
    Icon: WhatsAppIcon,
    iconWrapClass: "bg-[#25D366] text-white shadow-[0_0_24px_rgba(37,211,102,0.32)]",
  },
  {
    label: "ArtStation",
    handle: "artstation.com/artivity",
    href: "https://www.artstation.com/artivity",
    Icon: ArtStationIcon,
    iconWrapClass: "bg-[#13AFF0] text-white shadow-[0_0_24px_rgba(19,175,240,0.32)]",
  },
];

const SiteFooter = () => {
  return (
    <footer className="relative border-t border-white/10 bg-black/20">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="font-display text-3xl font-bold tracking-[-0.04em] text-glow">
              <span className="text-foreground">ARTI</span>
              <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">VISTAA</span>
            </div>
            <p className="section-copy mt-4 max-w-xl text-sm md:text-base">
              Custom fantasy characters, cinematic artwork, and a smooth contact flow for turning ideas into polished visual concepts.
            </p>
          </div>

          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-4">
              Social Handles
            </div>
            <div className="space-y-3">
              {socialLinks.map(({ label, handle, href, Icon, iconWrapClass, imageSrc }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="interactive-surface flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 hover:border-primary/24 hover:bg-white/[0.08] hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconWrapClass}`}>
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={`${label} logo`}
                          loading="lazy"
                          width={2048}
                          height={2048}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Icon className="h-5 w-5" />
                      )}
                    </span>
                    <div>
                      <div className="text-sm font-semibold text-foreground">{label}</div>
                      <div className="text-xs text-muted-foreground">{handle}</div>
                    </div>
                  </div>
                  <span className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Follow
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-muted-foreground md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col items-start gap-2 text-left">
            <p>© 2026 ARTIVISTAA. All rights reserved.</p>
            <Link
              to="/admin"
              className="cursor-pointer text-[11px] uppercase tracking-[0.28em] text-muted-foreground/50 transition-all duration-300 hover:text-primary hover:drop-shadow-[0_0_12px_rgba(168,85,247,0.45)]"
            >
              Admin
            </Link>
          </div>
          <p>Instagram, Twitter, WhatsApp, and ArtStation handles are shown for quick contact.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
