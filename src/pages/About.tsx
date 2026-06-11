import MagicButton from "@/components/MagicButton";
import SiteLayout from "@/components/layout/SiteLayout";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";
import { siteAssets } from "@/lib/site-assets";

const aboutParagraphs = [
  "Art has never been just a skill for me; it’s something personal. I enjoy taking ideas, emotions, and imagination and turning them into visuals that people can actually connect with.",
  "Every piece I create has time, effort, and meaning behind it. I don’t believe in making artwork that only looks good; I want it to feel memorable and leave an impression.",
  "Whether it’s a bold concept, a custom character, or a simple idea, I focus on creating work that feels unique to the person it’s made for. Because good art isn’t only about details; it’s about emotion.",
  "I put passion and originality into every project with one goal: creating something clients genuinely love, feel proud of, and want to keep.",
  "If you’re looking for creative work made with real dedication and attention, you’re in the right place.",
  "Let’s create something unforgettable together.",
] as const;

const About = () => {
  useDocumentMetadata({
    title: "About | ARTIVISTAA",
    description:
      "Learn about the artist behind ARTIVISTAA and the personal approach that shapes every custom artwork project.",
  });

  return (
    <SiteLayout>
      <section className="section-shell-lg relative overflow-hidden pt-36 md:pt-40">
        <div className="absolute inset-0">
          <img
            src={siteAssets.about.story}
            alt="ARTIVISTAA artwork collage"
            width={4230}
            height={4000}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/72 via-background/86 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,83,255,0.18),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(34,211,238,0.12),transparent_28%)]" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-5xl">
            <div className="glass glow-border overflow-hidden rounded-[2rem]">
              <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative min-h-[320px] border-b border-white/10 lg:min-h-full lg:border-b-0 lg:border-r">
                  <img
                    src={siteAssets.about.story}
                    alt="Featured ARTIVISTAA artwork"
                    width={4230}
                    height={4000}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,11,25,0.12),rgba(5,8,20,0.82))]" />
                  <div className="absolute inset-x-6 bottom-6 md:inset-x-8 md:bottom-8">
                    <p className="eyebrow mb-3 text-primary">About ARTIVISTAA</p>
                    <h1 className="font-display text-4xl font-bold leading-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.35)] md:text-5xl">
                      Personal Art,
                      <br />
                      Made To Last
                    </h1>
                  </div>
                </div>

                <article className="relative p-7 md:p-10 lg:p-12">
                  <div className="absolute -right-20 top-10 h-40 w-40 rounded-full bg-primary/12 blur-[88px]" />
                  <div className="absolute -bottom-16 left-8 h-32 w-32 rounded-full bg-neon-cyan/10 blur-[72px]" />

                  <div className="relative">
                    <div className="space-y-5 text-[15px] leading-8 text-muted-foreground md:text-[1.02rem]">
                      {aboutParagraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                      ))}
                    </div>

                    <div className="mt-10">
                      <MagicButton
                        size="lg"
                        variant="primary"
                        className="animate-pulse-glow"
                        onClick={() => window.open("https://wa.me/15708078735", "_blank")}
                      >
                        Start a Project
                      </MagicButton>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
