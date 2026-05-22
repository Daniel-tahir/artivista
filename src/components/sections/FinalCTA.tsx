import MagicButton from "../MagicButton";

const FinalCTA = () => (
  <section className="section-shell-lg relative">
    <div className="container relative z-10 max-w-3xl text-center">
      <div className="glass glow-border relative overflow-hidden rounded-3xl p-10 md:p-16">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/22 blur-[88px]" />
        <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-neon-magenta/22 blur-[88px]" />

        <div className="relative">
          <h2 className="section-title mb-6 font-display text-3xl font-bold text-glow md:text-5xl">
            Let's Create Something<br />Unique Together
          </h2>
          <p className="section-copy mx-auto mb-8 max-w-2xl text-lg md:mb-10">
            Your vision deserves to be brought to life. Let's begin your journey.
          </p>
          <MagicButton
            size="lg"
            variant="primary"
            className="animate-pulse-glow"
            onClick={() => window.open("https://wa.me/15708078735", "_blank")}
          >
            ORDER NOW
          </MagicButton>
        </div>
      </div>
    </div>
  </section>
);

export default FinalCTA;
