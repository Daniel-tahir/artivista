import { Suspense, lazy } from "react";
import Hero from "@/components/sections/Hero";
import MidCTA from "@/components/sections/MidCTA";
import HowItWorks from "@/components/sections/HowItWorks";
import FinalCTA from "@/components/sections/FinalCTA";
import SiteLayout from "@/components/layout/SiteLayout";

const FeaturedArtwork = lazy(() => import("@/components/sections/FeaturedArtwork"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));

const Index = () => {
  return (
    <SiteLayout>
      <div>
        <Hero />
        <div className="divider-glow w-3/4 mx-auto" />
        <Suspense fallback={null}>
          <FeaturedArtwork />
        </Suspense>
        <MidCTA />
        <div className="divider-glow w-3/4 mx-auto" />
        <HowItWorks />
        <div className="divider-glow w-3/4 mx-auto" />
        <Suspense fallback={null}>
          <Testimonials />
        </Suspense>
        <FinalCTA />
      </div>
    </SiteLayout>
  );
};

export default Index;
