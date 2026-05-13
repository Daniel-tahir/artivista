import StarField from "@/components/StarField";
import Hero from "@/components/sections/Hero";
import FeaturedArtwork from "@/components/sections/FeaturedArtwork";

import MidCTA from "@/components/sections/MidCTA";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const Index = () => {
  return (
    <main className="relative cosmic-bg min-h-screen overflow-x-hidden">
      <StarField />
      <SiteHeader />
      <div className="relative z-10">
        <Hero />
        <div className="divider-glow w-3/4 mx-auto" />
        <FeaturedArtwork />
        
        
        <MidCTA />
        <div className="divider-glow w-3/4 mx-auto" />
        <HowItWorks />
        <div className="divider-glow w-3/4 mx-auto" />
        <Testimonials />
        <FinalCTA />
      </div>
      <SiteFooter />
      <FloatingWhatsApp />
    </main>
  );
};

export default Index;
