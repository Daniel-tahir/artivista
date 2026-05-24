import categoriesMetadata from "../../../public/assets/artwork/categories.json";
import type { AdminArtwork, AdminArtworkCategory } from "@/types/admin/artwork";
import type { ArtworkCategorySummary } from "@/data/artwork";
import { normalizeArtwork } from "@/utils/admin/normalize-artwork";

const artworkImageModules = import.meta.glob(
  "/public/assets/artwork/*/*.{png,jpg,jpeg,webp,gif}",
  {
    eager: true,
    import: "default",
    query: "?url",
  },
) as Record<string, string>;

interface ArtworkCategoryMetadata {
  slug: string;
  label?: string;
  name?: string;
  eyebrow?: string;
  subtitle?: string;
  heroImage?: string;
  featuredTitle?: string;
  featuredImage?: string;
}

const normalizePathToPublicUrl = (path: string) => path.replace(/^\/public/, "");

const toTitleCase = (value: string) =>
  value
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const metadataBySlug = new Map(
  (categoriesMetadata as ArtworkCategoryMetadata[]).map((category) => [category.slug, category]),
);

const extractCategoryFromPath = (path: string) => {
  const match = path.match(/\/artwork\/([^/]+)\//);
  return match?.[1] ?? "uncategorized";
};

const extractFilenameFromPath = (path: string) => path.split("/").pop() ?? path;
const formatCategoryLabel = (value: string) => metadataBySlug.get(value)?.label ?? metadataBySlug.get(value)?.name ?? toTitleCase(value);

export const buildScannedArtworkLibrary = (): AdminArtwork[] => {
  return Object.entries(artworkImageModules)
    .filter(([path]) => !path.endsWith(".DS_Store"))
    .map(([path, importedUrl]) => {
      const category = extractCategoryFromPath(path);
      const filename = extractFilenameFromPath(path);
      const servedImageUrl = importedUrl || normalizePathToPublicUrl(path);
      const title = toTitleCase(filename);

      return normalizeArtwork({
        id: `library-${category}-${toSlug(filename)}`,
        title,
        category,
        imageUrl: servedImageUrl,
        filename,
        description: `${metadataBySlug.get(category)?.subtitle ?? `${toTitleCase(category)} artwork`} imported from the live artwork library.`,
        tags: [category, filename.replace(/\.[^.]+$/, "").split(/[_-\s]+/)[0]].filter(Boolean),
        featured: false,
        price: "",
        animeSeries: metadataBySlug.get(category)?.name ?? toTitleCase(category),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    })
    .sort((left, right) => left.category.localeCompare(right.category) || left.title.localeCompare(right.title));
};

export const getDetectedArtworkCategories = (): AdminArtworkCategory[] => {
  const slugs = Array.from(new Set(buildScannedArtworkLibrary().map((artwork) => artwork.category)));

  return slugs.map((slug) => {
    const metadata = metadataBySlug.get(slug);

    return {
      value: slug,
      label: formatCategoryLabel(slug),
      description: metadata?.subtitle ?? `${toTitleCase(slug)} artwork category`,
    };
  });
};

export const buildArtworkCategorySummaries = (artworks: AdminArtwork[]): ArtworkCategorySummary[] => {
  const grouped = new Map<string, AdminArtwork[]>();

  artworks.forEach((artwork) => {
    const current = grouped.get(artwork.category) ?? [];
    current.push(artwork);
    grouped.set(artwork.category, current);
  });

  return Array.from(grouped.entries())
    .map(([slug, items]) => {
      const metadata = metadataBySlug.get(slug);
      const heroCandidate = metadata?.heroImage ?? items[0]?.image ?? items[0]?.imageUrl ?? "";
      const featuredCandidate = items.find((item) => item.featured) ?? items[0];

      return {
        slug,
        label: formatCategoryLabel(slug),
        name: metadata?.name ?? formatCategoryLabel(slug),
        eyebrow: metadata?.eyebrow ?? `${formatCategoryLabel(slug)} Collection`,
        subtitle: metadata?.subtitle ?? `${formatCategoryLabel(slug)} artwork curated from the live library.`,
        heroImage: metadata?.heroImage ?? heroCandidate,
        featuredTitle: metadata?.featuredTitle ?? featuredCandidate?.title ?? formatCategoryLabel(slug),
        featuredImage: metadata?.featuredImage ?? featuredCandidate?.image ?? featuredCandidate?.imageUrl ?? heroCandidate,
      } satisfies ArtworkCategorySummary;
    })
    .sort((left, right) => left.label.localeCompare(right.label));
};
