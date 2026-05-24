import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";
import { Menu, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useArtworkLibrary } from "@/hooks/use-artwork-library";
import { siteAssets } from "@/lib/site-assets";

const navItems = [
  { label: "Home", href: "/#home" },
  { label: "About", href: "/about" },
  { label: "Artwork", href: "/#artwork" },
  { label: "Process", href: "/#how-it-works" },
  { label: "Reviews", href: "/#testimonials" },
];

const SiteHeader = () => {
  const location = useLocation();
  const homeHref = location.pathname === "/" ? "#home" : "/#home";
  const { isScrolled } = usePerformanceProfile();
  const { categorySummaries } = useArtworkLibrary();

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6 lg:px-8">
        <div
          className={`site-header-shell glow-border rounded-2xl px-4 py-3 transition-[background-color,border-color,box-shadow,backdrop-filter,transform,border-radius,padding] duration-400 ease-out md:px-5 ${
            isScrolled ? "site-header-shell-scrolled" : "site-header-shell-top"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Link to={homeHref} className="flex items-center gap-3">
              <img
                src={siteAssets.navbar.logo}
                alt="ARTIVISTAA logo"
                width={200}
                height={200}
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
            </Link>

            <nav className="hidden md:flex items-center gap-1.5">
              {navItems
                .filter((item) => item.label !== "Artwork")
                .map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="interactive-surface rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                ))}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="interactive-surface inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground hover:bg-white/[0.06] hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                    aria-label="Open artwork categories"
                  >
                    Artwork
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="center"
                  sideOffset={10}
                  className="glass glow-border w-56 rounded-2xl border-white/10 bg-background/90 p-2 text-foreground backdrop-blur-xl"
                >
                  {categorySummaries.map((category) => (
                    <DropdownMenuItem key={category.slug} asChild>
                      <Link
                        to={`/artwork/${category.slug}`}
                        className="interactive-surface rounded-xl border border-transparent px-3 py-3 text-sm text-muted-foreground hover:border-white/10 hover:bg-white/[0.06] hover:text-foreground focus:bg-white/[0.06] focus:text-foreground"
                      >
                        {category.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
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
              <SheetContent side="right" className="mobile-menu-sheet border-white/10 text-foreground">
                <SheetHeader>
                  <SheetTitle className="font-display text-2xl text-glow">
                    <span className="flex items-center gap-3">
                      <img
                        src={siteAssets.navbar.logo}
                        alt="ARTIVISTAA logo"
                        width={200}
                        height={200}
                        className="h-10 w-10 rounded-full object-contain p-1 shadow-[0_0_24px_hsl(var(--primary)/0.45)]"
                      />
                      <span>
                        <span className="text-foreground">ARTI</span>
                        <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">VISTAA</span>
                      </span>
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="mobile-nav-scroll mt-8 flex max-h-[calc(100vh-7.5rem)] flex-col gap-4 overflow-y-auto overscroll-contain pr-1">
                  <div className="flex flex-col gap-3 md:hidden">
                      {navItems
                        .filter((item) => item.label !== "Artwork")
                        .map((item) => (
                          <SheetClose asChild key={item.label}>
                            <Link
                              to={item.href}
                              className="interactive-surface rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground hover:border-white/20 hover:bg-white/[0.08]"
                            >
                              {item.label}
                            </Link>
                          </SheetClose>
                        ))}
                  </div>

                  <div className="hidden md:flex md:flex-col md:gap-3">
                    {navItems
                      .filter((item) => item.label !== "Artwork")
                      .map((item) => (
                        <SheetClose asChild key={item.label}>
                          <Link
                            to={item.href}
                            className="interactive-surface rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground hover:border-white/20 hover:bg-white/[0.08]"
                          >
                            {item.label}
                          </Link>
                        </SheetClose>
                      ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                    <div className="mb-3 px-1 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                      Artwork
                    </div>
                    <div className="flex flex-col gap-2">
                        {categorySummaries.map((category) => (
                          <SheetClose asChild key={category.slug}>
                            <Link
                              to={`/artwork/${category.slug}`}
                              className="interactive-surface rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-foreground hover:border-white/20 hover:bg-white/[0.08]"
                            >
                              {category.label}
                            </Link>
                          </SheetClose>
                        ))}
                    </div>
                  </div>
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
