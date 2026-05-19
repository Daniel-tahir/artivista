import MagicButton from "../MagicButton";
import WhatsAppIcon from "../WhatsAppIcon";
import { siteAssets } from "@/lib/site-assets";

const MidCTA = () => (
  <section className="section-shell-lg relative overflow-hidden">
    <div className="absolute inset-0">
      <img src={siteAssets.misc.ctaCosmic} alt="Cosmic landscape" loading="lazy" decoding="async" width={1920} height={1080} className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/40 to-background" />
    </div>

    <div className="container relative z-10 max-w-3xl text-center">
      <h2 className="section-title mb-6 font-display text-4xl font-bold text-glow md:text-6xl">
        Your Idea, Your Character
      </h2>
      <p className="section-copy mx-auto mb-10 max-w-2xl text-lg md:mb-12 md:text-xl">
        Describe your vision, and we bring it to life — pixel by pixel, glow by glow.
      </p>
      <MagicButton
        size="lg"
        variant="primary"
        onClick={() => window.open("https://wa.me/15708078735", "_blank")}
      >
        <WhatsAppIcon className="w-5 h-5" />
        Discuss Now on WhatsApp
      </MagicButton>
    </div>
  </section>
);

export default MidCTA;
