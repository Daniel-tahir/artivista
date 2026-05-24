import { Sparkles, Layers3, Star, Tags } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminStats } from "@/types/admin/artwork";

interface AdminStatsGridProps {
  stats: AdminStats;
}

const statCards = [
  {
    key: "totalArtworks",
    label: "Total Artworks",
    description: "Active pieces in the local studio vault",
    Icon: Layers3,
  },
  {
    key: "featuredArtworks",
    label: "Featured Signals",
    description: "Showcase-ready highlights with elevated priority",
    Icon: Star,
  },
  {
    key: "uniqueCategories",
    label: "Category Channels",
    description: "Distinct content lanes currently populated",
    Icon: Sparkles,
  },
  {
    key: "taggedEntries",
    label: "Tagged Entries",
    description: "Pieces enriched with searchable metadata",
    Icon: Tags,
  },
] as const;

const AdminStatsGrid = ({ stats }: AdminStatsGridProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {statCards.map(({ key, label, description, Icon }) => (
        <Card
          key={key}
          className="glass glow-border overflow-hidden rounded-[1.75rem] border-white/10 bg-white/[0.04] text-foreground"
        >
          <CardContent className="relative p-5">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon-cyan/70 to-transparent" />
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-3 shadow-[0_0_28px_rgba(34,211,238,0.15)]">
                <Icon className="h-5 w-5 text-neon-cyan" />
              </div>
              <div className="eyebrow text-[0.62rem] text-muted-foreground">Live</div>
            </div>
            <div className="text-3xl font-semibold tracking-[-0.04em] text-glow">
              {stats[key]}
            </div>
            <div className="mt-2 text-sm font-medium text-foreground">{label}</div>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsGrid;
