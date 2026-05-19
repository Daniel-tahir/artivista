import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import ArtworkCard from "@/components/ArtworkCard";
import ArtworkLightbox from "@/components/ArtworkLightbox";
import MagicButton from "@/components/MagicButton";
import SiteLayout from "@/components/layout/SiteLayout";
import {
  artworkCategories,
  artworkManifests,
  type ArtworkCategorySlug,
} from "@/data/artwork";

const ITEMS_PER_PAGE = 10;

const ArtworkCategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const categorySlug = slug as ArtworkCategorySlug | undefined;
  const [activeArtworkIndex, setActiveArtworkIndex] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const category = categorySlug
    ? artworkCategories.find((entry) => entry.slug === categorySlug)
    : undefined;
  const isGroupArt = category?.slug === "group-art";
  const manifest = categorySlug ? artworkManifests[categorySlug] : undefined;
  const visibleItems = manifest?.items.slice(0, visibleCount) ?? [];
  const hasMoreItems = (manifest?.items.length ?? 0) > visibleCount;

  const activeArtwork = useMemo(
    () =>
      activeArtworkIndex !== null ? manifest?.items[activeArtworkIndex] : undefined,
    [activeArtworkIndex, manifest?.items],
  );

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setActiveArtworkIndex(null);
  }, [categorySlug]);

  if (!category) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <SiteLayout>
      <section className="section-shell-lg relative overflow-hidden pt-36 md:pt-40">
        <div className="absolute inset-0">
          <img
            src={category.heroImage}
            alt={category.name}
            width={768}
            height={1024}
            decoding="async"
            className="h-full w-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/82 to-background" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(184,83,255,0.16),transparent_42%)]" />
        </div>

        <div className="container relative z-10">
          <div className="mx-auto max-w-4xl text-center">
            <p className="eyebrow mb-4 animate-fade-in-up text-primary">
              {category.eyebrow}
            </p>
            <h1 className="section-title mb-6 animate-fade-in-up font-display text-4xl font-bold text-glow sm:text-5xl md:text-6xl">
              {category.name}
            </h1>
            <p
              className="section-copy mx-auto max-w-2xl animate-fade-in-up text-base md:text-lg"
              style={{ animationDelay: "140ms" }}
            >
              {category.subtitle}
            </p>
            <div
              className="mt-8 animate-fade-in-up"
              style={{ animationDelay: "220ms" }}
            >
              <Link
                to="/#artwork"
                className="interactive-surface inline-flex rounded-full border border-white/10 bg-white/[0.05] px-5 py-2.5 text-sm text-muted-foreground hover:border-white/20 hover:bg-white/[0.08] hover:text-foreground"
              >
                Back to Featured Artwork
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="divider-glow mx-auto w-3/4" />

      <section className="section-shell relative">
        <div className="container">
          <div className="mb-10 text-center md:mb-12">
            <p className="eyebrow mb-4 text-primary">Gallery</p>
            <h2 className="section-title font-display text-3xl font-bold text-glow md:text-5xl">
              {category.name} Artwork
            </h2>
          </div>

          <div
            className={`grid gap-4 ${
              isGroupArt ? "grid-cols-1 md:grid-cols-2" : "grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
            }`}
          >
            {visibleItems.map((item, index) => (
              <ArtworkCard
                key={`${item.image}-${index}`}
                image={item.image}
                title={item.title}
                delay={index * 80}
                mediaClassName={isGroupArt ? "group-art-card-media" : undefined}
                imageClassName={isGroupArt ? "group-art-card-image" : undefined}
                onClick={() => setActiveArtworkIndex(index)}
              />
            ))}
          </div>

          {hasMoreItems ? (
            <div className="mt-10 flex justify-center">
              <MagicButton
                variant="ghost"
                onClick={() =>
                  setVisibleCount((current) => current + ITEMS_PER_PAGE)
                }
              >
                Load More
              </MagicButton>
            </div>
          ) : null}
        </div>
      </section>

      {activeArtwork ? (
        <ArtworkLightbox
          open={activeArtworkIndex !== null}
          onOpenChange={(open) => {
            if (!open) {
              setActiveArtworkIndex(null);
            }
          }}
          title={activeArtwork.title}
          image={activeArtwork.image}
        />
      ) : null}
    </SiteLayout>
  );
};

export default ArtworkCategoryPage;
