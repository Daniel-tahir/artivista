import { MessageCircle, Sparkles, Palette, Gift } from "lucide-react";

const steps = [
  { icon: MessageCircle, title: "Share Your Idea", desc: "Tell us your character concept via WhatsApp.", color: "primary" },
  { icon: Sparkles, title: "We Discuss & Refine", desc: "We refine your idea into a perfect vision.", color: "neon-magenta" },
  { icon: Palette, title: "We Create Your Character", desc: "Our artists bring it to life with cinematic detail.", color: "neon-blue" },
  { icon: Gift, title: "We Deliver Character", desc: "Receive your final high resolution artwork.", color: "primary-glow" },
];

const HowItWorks = () => (
  <section id="how-it-works" className="section-shell-lg relative">
    <div className="container relative z-10">
      <div className="mb-16 text-center">
        <p className="eyebrow mb-4 text-primary">Process</p>
        <h2 className="section-title mb-4 font-display text-4xl font-bold text-glow md:text-6xl">How It Works</h2>
        <div className="divider-glow w-64 mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
        {steps.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[calc(50%+3rem)] right-[-1rem] h-px bg-gradient-to-r from-primary/60 to-transparent" />
              )}

              <div className="interactive-surface relative h-full rounded-2xl p-6 glass glow-border hover:-translate-y-1.5">
                {/* Number badge */}
                <div
                  className="absolute -top-5 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg text-background"
                  style={{
                    background: `radial-gradient(circle, hsl(var(--${s.color})), hsl(var(--primary)))`,
                    boxShadow: `0 0 25px hsl(var(--${s.color}) / 0.7)`,
                  }}
                >
                  {i + 1}
                </div>

                <div className="pt-6 text-center">
                  <Icon className="mx-auto mb-4 h-10 w-10 text-primary-glow" style={{ filter: `drop-shadow(0 0 10px hsl(var(--${s.color}) / 0.45))` }} />
                  <h3 className="mb-2 font-display text-xl font-semibold tracking-[-0.03em] text-foreground">{s.title}</h3>
                  <p className="text-sm leading-7 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </section>
);

export default HowItWorks;
