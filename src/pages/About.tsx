import MagicButton from "@/components/MagicButton";
import SiteLayout from "@/components/layout/SiteLayout";
import { useDocumentMetadata } from "@/hooks/use-document-metadata";
import { siteAssets } from "@/lib/site-assets";

const services = [
  "Custom character design",
  "Fantasy and sci-fi illustration",
  "Group compositions and key art",
  "Launch-ready promotional artwork",
];

const processSteps = [
  {
    title: "Discover",
    description:
      "We start with your world, references, and visual goals so the final piece stays true to the identity you already have in mind.",
  },
  {
    title: "Develop",
    description:
      "Concept direction, silhouette work, and detail refinement shape the composition before the final rendering stage begins.",
  },
  {
    title: "Deliver",
    description:
      "The finished artwork arrives polished for presentation, sharing, and rollout across the places your audience will see it.",
  },
];

const reasons = [
  "Consistent cinematic quality",
  "Clear collaboration from brief to final delivery",
  "Artwork shaped for both storytelling and presentation",
  "A process that protects the client’s existing vision",
];

const About = () => {
  useDocumentMetadata({
    title: "About | ARTIVISTAA",
    description:
      "Learn about ARTIVISTAA, our mission, creative process, services, and the story behind our custom character studio.",
  });

  return (
    <SiteLayout>
      <section className="section-shell-lg relative overflow-hidden pt-36 md:pt-40">
        <div className="absolute inset-0">
          <img
            src={siteAssets.about.story}
            alt="ARTIVISTAA studio artwork collage"
            width={4230}
            height={4000}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/82 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,83,255,0.18),transparent_42%),radial-gradient(circle_at_78%_20%,rgba(34,211,238,0.12),transparent_28%)]" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-4 animate-fade-in-up text-primary">About ARTIVISTAA</p>
            <h1 className="section-title mb-6 animate-fade-in-up font-display text-4xl font-bold text-glow sm:text-5xl md:text-6xl">
              Crafted Character Art
              <br />
              Built Around Your Vision
            </h1>
            <p
              className="section-copy mx-auto max-w-2xl animate-fade-in-up text-base md:text-lg"
              style={{ animationDelay: "140ms" }}
            >
              ARTIVISTAA is a custom art and design studio focused on cinematic character work, polished fantasy visuals,
              and presentation-ready artwork created for creators, brands, and imaginative worlds.
            </p>
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell relative">
        <div className="container relative z-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="glass glow-border rounded-[1.75rem] p-6 md:p-8">
              <p className="eyebrow mb-4 text-primary">What We Do</p>
              <h2 className="section-title mb-4 font-display text-3xl font-bold text-glow md:text-4xl">
                Visual Worlds With Character At The Center
              </h2>
              <p className="section-copy text-sm md:text-base">
                We create custom illustrations and design-led artwork that help clients express story, mood, and identity with clarity.
                From single-character commissions to multi-character scenes, the work stays rooted in atmosphere, polish, and visual impact.
              </p>
            </article>

            <article className="glass glow-border rounded-[1.75rem] p-6 md:p-8">
              <p className="eyebrow mb-4 text-primary">Services</p>
              <h2 className="section-title mb-4 font-display text-3xl font-bold text-glow md:text-4xl">
                Built For Creative Launches And Personal Worlds
              </h2>
              <ul className="grid gap-3 text-sm text-muted-foreground md:grid-cols-2 md:text-base">
                {services.map((service) => (
                  <li key={service} className="interactive-surface rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    {service}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell relative">
        <div className="container relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
            <article className="glass glow-border rounded-[1.75rem] p-6 md:p-8">
              <p className="eyebrow mb-4 text-primary">Mission & Vision</p>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h2 className="mb-3 font-display text-2xl text-foreground">Mission</h2>
                  <p className="section-copy text-sm md:text-base">
                    To turn ideas into premium visual work that feels personal, immersive, and ready to represent the people behind it.
                  </p>
                </div>
                <div>
                  <h2 className="mb-3 font-display text-2xl text-foreground">Vision</h2>
                  <p className="section-copy text-sm md:text-base">
                    To be a trusted creative partner for clients who want artwork that carries emotion, identity, and a memorable sense of craft.
                  </p>
                </div>
              </div>
            </article>

            <article className="glass glow-border rounded-[1.75rem] p-4 md:p-5">
              <img
                src={siteAssets.about.processCollagePrimary}
                alt="ARTIVISTAA process artwork collage"
                width={5421}
                height={4000}
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-[1.25rem] object-cover"
              />
            </article>
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell-lg relative">
        <div className="container relative z-10">
          <div className="mb-14 text-center">
            <p className="eyebrow mb-4 text-primary">Creative Process</p>
            <h2 className="section-title mb-4 font-display text-4xl font-bold text-glow md:text-5xl">
              A Refined Workflow Without Unnecessary Complexity
            </h2>
            <p className="section-copy mx-auto max-w-2xl">
              Every project follows a structured path so the collaboration feels smooth while the final aesthetic stays expressive.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {processSteps.map((step, index) => (
              <article
                key={step.title}
                className="interactive-surface glass glow-border animate-fade-in-up rounded-[1.75rem] p-6 hover:-translate-y-1"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] font-display text-lg text-foreground">
                  0{index + 1}
                </div>
                <h3 className="mb-3 font-display text-2xl text-foreground">{step.title}</h3>
                <p className="section-copy text-sm md:text-base">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell relative">
        <div className="container relative z-10">
          <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
            <article className="glass glow-border rounded-[1.75rem] p-4 md:p-5">
              <img
                src={siteAssets.about.processCollageSecondary}
                alt="Group character composition by ARTIVISTAA"
                width={5421}
                height={4000}
                loading="lazy"
                decoding="async"
                className="h-full w-full rounded-[1.25rem] object-cover"
              />
            </article>

            <article className="glass glow-border rounded-[1.75rem] p-6 md:p-8">
              <p className="eyebrow mb-4 text-primary">Why Clients Choose Us</p>
              <h2 className="section-title mb-4 font-display text-3xl font-bold text-glow md:text-4xl">
                A Studio Experience That Stays Focused On Fit And Finish
              </h2>
              <ul className="space-y-3 text-sm text-muted-foreground md:text-base">
                {reasons.map((reason) => (
                  <li key={reason} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    {reason}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell relative">
        <div className="container relative z-10">
          <article className="glass glow-border rounded-[1.75rem] p-6 md:p-8">
            <p className="eyebrow mb-4 text-primary">Our Story</p>
            <h2 className="section-title mb-4 font-display text-3xl font-bold text-glow md:text-4xl">
              Growing From Passion Projects Into A Dedicated Creative Studio
            </h2>
            <p className="section-copy max-w-4xl text-sm md:text-base">
              ARTIVISTAA grew from a drive to create character art with more atmosphere, more identity, and more care in the final presentation.
              What began as a personal pursuit of stronger visual storytelling evolved into a studio practice centered on helping clients transform rough ideas
              into artwork that feels complete, expressive, and distinctly theirs.
            </p>
          </article>
        </div>
      </section>

      <section className="section-shell-lg relative">
        <div className="container relative z-10 max-w-3xl text-center">
          <div className="glass glow-border relative overflow-hidden rounded-3xl p-10 md:p-16">
            <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/22 blur-[88px]" />
            <div className="absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-neon-magenta/22 blur-[88px]" />

            <div className="relative">
              <p className="eyebrow mb-4 text-primary">Let&apos;s Connect</p>
              <h2 className="section-title mb-6 font-display text-3xl font-bold text-glow md:text-5xl">
                Ready To Work Together?
              </h2>
              <p className="section-copy mx-auto mb-8 max-w-2xl text-lg md:mb-10">
                If you&apos;re looking for custom artwork with a polished finish and a collaborative process, we&apos;d love to hear about your project.
              </p>
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
        </div>
      </section>
    </SiteLayout>
  );
};

export default About;
