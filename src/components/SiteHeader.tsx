import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import siteLogo from "@/assets/SmallSquareLogoJpg-removebg-preview.png";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Artwork", href: "#artwork" },
  { label: "Process", href: "#how-it-works" },
  { label: "Reviews", href: "#testimonials" },
];

const SiteHeader = () => {
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div className="glass glow-border rounded-2xl px-4 py-3 backdrop-blur-xl md:px-5">
          <div className="flex items-center justify-between gap-4">
            <a href="#" className="flex items-center gap-3">
              <img
                src={siteLogo}
                alt="ARTIVISTAA logo"
                className="h-10 w-10 rounded-full object-contain p-1 shadow-[0_12px_30px_hsl(var(--primary)/0.2)]"
              />
              <div>
                <div className="font-display text-lg font-bold leading-none tracking-[-0.04em] text-glow">
                  <span className="text-foreground">ARTI</span>
                  <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">VISTAA</span>
                </div>
                <div className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground sm:text-[11px]">
                  Custom Characters
                </div>
              </div>
            </a>

            <nav className="hidden md:flex items-center gap-1.5">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="interactive-surface rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button
                  type="button"
                  aria-label="Open menu"
                  className="interactive-surface inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-foreground hover:border-white/20 hover:bg-white/[0.08]"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-background/95 border-white/10 text-foreground">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl text-glow">
                    <span className="flex items-center gap-3">
                      <img
                        src={siteLogo}
                        alt="ARTIVISTAA logo"
                        className="h-10 w-10 rounded-full object-contain p-1 shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
                      />
                      <span>
                        <span className="text-foreground">ARTI</span>
                        <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">VISTAA</span>
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mt-8 flex flex-col gap-3">
                  {navItems.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                    className="interactive-surface rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground hover:border-white/20 hover:bg-white/[0.08]"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
