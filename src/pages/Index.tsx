import Hero from "@/components/sections/Hero";
import FeaturedArtwork from "@/components/sections/FeaturedArtwork";
import MidCTA from "@/components/sections/MidCTA";
import HowItWorks from "@/components/sections/HowItWorks";
import Testimonials from "@/components/sections/Testimonials";
import FinalCTA from "@/components/sections/FinalCTA";
import SiteLayout from "@/components/layout/SiteLayout";

const Index = () => {
  return (
    <SiteLayout>
      <div>
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
    </SiteLayout>
  );
};

export default Index;
