import anime from "@/assets/card-anime.jpg";
import dnd from "@/assets/card-dnd.jpg";
import fantasy from "@/assets/card-dragon.jpg";
import furry from "@/assets/card-furry.jpg";
import sorceress from "@/assets/hero-sorceress.jpg";
import heroPortrait from "@/assets/WhatsApp Image 2026-04-22 at 11.53.34 pm.jpeg";

export interface ArtworkCategoryPageData {
  slug: "dnd" | "furry" | "anime" | "fantasy" | "robotic" | "warhammer" | "group-art";
  name: string;
  subtitle: string;
  eyebrow: string;
  heroImage: string;
  items: Array<{
    title: string;
    image: string;
  }>;
}

export const artworkDropdownItems = [
  { label: "DND", slug: "dnd" },
  { label: "Furry", slug: "furry" },
  { label: "Anime", slug: "anime" },
  { label: "Fantasy", slug: "fantasy" },
  { label: "Robotic", slug: "robotic" },
  { label: "Warhammer", slug: "warhammer" },
  { label: "Group Art", slug: "group-art" },
] as const;

export const artworkCategoryPages: ArtworkCategoryPageData[] = [
  {
    slug: "dnd",
    name: "DND",
    eyebrow: "Adventure Party Collection",
    subtitle: "A dedicated DND gallery presented with the site’s current fantasy atmosphere, layout rhythm, and responsive behavior.",
    heroImage: dnd,
    items: [
      { title: "Arcane Duelist", image: dnd },
      { title: "Celestial Ranger", image: heroPortrait },
      { title: "Dungeon Oracle", image: sorceress },
      { title: "Stormblade Tank", image: fantasy },
    ],
  },
  {
    slug: "furry",
    name: "Furry",
    eyebrow: "Character Personality Collection",
    subtitle: "A furry artwork gallery that inherits the current website theme, colors, spacing, and interaction language.",
    heroImage: furry,
    items: [
      { title: "Neon Pathfinder", image: furry },
      { title: "Royal Beastkin", image: heroPortrait },
      { title: "Moonlit Scout", image: anime },
      { title: "Velvet Guardian", image: fantasy },
    ],
  },
  {
    slug: "anime",
    name: "Anime",
    eyebrow: "Stylized Character Collection",
    subtitle: "A focused anime category page using the same visual system and responsive structure already established on the site.",
    heroImage: anime,
    items: [
      { title: "Skyline Prodigy", image: anime },
      { title: "Blade Bloom", image: heroPortrait },
      { title: "Nova Academy Lead", image: sorceress },
      { title: "Crimson Rival", image: furry },
    ],
  },
  {
    slug: "fantasy",
    name: "Fantasy",
    eyebrow: "Mythic Worldbuilding Collection",
    subtitle: "A fantasy artwork gallery for creatures and characters, kept within the current website’s theme and responsive system.",
    heroImage: fantasy,
    items: [
      { title: "Ember Drake", image: fantasy },
      { title: "Thorn Crown Beast", image: sorceress },
      { title: "Astral Wyrm", image: dnd },
      { title: "Forest Relic Keeper", image: heroPortrait },
    ],
  },
  {
    slug: "robotic",
    name: "Robotic",
    eyebrow: "Synthetic Character Collection",
    subtitle: "A curated robotic-themed artwork page that preserves the site’s existing aesthetic, structure, and responsiveness.",
    heroImage: sorceress,
    items: [
      { title: "Chrome Sentinel", image: sorceress },
      { title: "Aether Machine", image: heroPortrait },
      { title: "Neon Gearframe", image: anime },
      { title: "Titan Relay", image: fantasy },
    ],
  },
  {
    slug: "warhammer",
    name: "Warhammer",
    eyebrow: "Battle-Ready Character Collection",
    subtitle: "A Warhammer category page designed to stay visually consistent with the current website without altering the existing design.",
    heroImage: heroPortrait,
    items: [
      { title: "Iron Vanguard", image: heroPortrait },
      { title: "Siege Champion", image: fantasy },
      { title: "Void Marshal", image: dnd },
      { title: "Ashen Crusader", image: sorceress },
    ],
  },
  {
    slug: "group-art",
    name: "Group Art",
    eyebrow: "Ensemble Artwork Collection",
    subtitle: "A group-art gallery for multi-character scenes, built to match the current UI system and responsive grid behavior.",
    heroImage: dnd,
    items: [
      { title: "Guild Assembly", image: dnd },
      { title: "Hero Lineup", image: furry },
      { title: "Festival Party", image: anime },
      { title: "Legends Together", image: heroPortrait },
    ],
  },
];

export const artworkCategoryPageMap = new Map(
  artworkCategoryPages.map((category) => [category.slug, category]),
);
