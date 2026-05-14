import { ReactNode } from "react";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import StarField from "@/components/StarField";

interface SiteLayoutProps {
  children: ReactNode;
}

const SiteLayout = ({ children }: SiteLayoutProps) => {
  return (
    <main className="relative min-h-screen overflow-x-hidden cosmic-bg">
      <StarField />
      <SiteHeader />
      <div className="relative z-10">{children}</div>
      <SiteFooter />
      <FloatingWhatsApp />
    </main>
  );
};

export default SiteLayout;
