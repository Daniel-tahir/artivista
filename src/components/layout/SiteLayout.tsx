import { ReactNode } from "react";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StarField from "@/components/StarField";
import { useInViewState } from "@/hooks/use-in-view";
import { usePerformanceProfile } from "@/components/performance/PerformanceProvider";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  const { prefersReducedMotion } = usePerformanceProfile();
  const { ref: layoutRef, isInView } = useInViewState({ threshold: 0 });
  const shouldAnimate = isInView && !prefersReducedMotion;

  return (
    <main
      ref={layoutRef}
      className={`relative min-h-screen overflow-x-hidden cosmic-bg ${shouldAnimate ? "" : "cosmic-bg-paused"}`}
    >
      <StarField />
      <SiteHeader />
      <div className="relative z-10">{children}</div>
      <SiteFooter />
      <FloatingWhatsApp />
    </main>
  );
};

export default SiteLayout;
