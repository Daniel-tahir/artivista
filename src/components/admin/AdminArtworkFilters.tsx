import { Search, SlidersHorizontal, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import type { ArtworkFilters } from "@/types/admin/artwork";

import type { AdminArtworkCategory } from "@/types/admin/artwork";

interface AdminArtworkFiltersProps {
  filters: ArtworkFilters;
  categories: AdminArtworkCategory[];
  onChange: (filters: ArtworkFilters) => void;
  onCreate: () => void;
}

const AdminArtworkFilters = ({ filters, categories, onChange, onCreate }: AdminArtworkFiltersProps) => {
  return (
    <div className="glass glow-border rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-5">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <div className="eyebrow text-[0.62rem] text-primary/80">Command Deck</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-foreground">Artwork management stream</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Search the collection, isolate content lanes, and launch new artwork entries without leaving the dashboard flow.
          </p>
        </div>
        <Button
          onClick={onCreate}
          className="h-12 rounded-full bg-[linear-gradient(135deg,rgba(192,132,252,0.95),rgba(34,211,238,0.95))] px-6 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.28)] transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_44px_rgba(192,132,252,0.35)]"
        >
          Add Artwork
        </Button>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_220px_180px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={filters.query}
            onChange={(event) => onChange({ ...filters, query: event.target.value })}
            placeholder="Search title, series, description, or tags..."
            className="h-12 rounded-2xl border-white/10 bg-black/20 pl-11 text-foreground placeholder:text-muted-foreground/70"
          />
        </div>

        <Select
          value={filters.category}
          onValueChange={(value: ArtworkFilters["category"]) => onChange({ ...filters, category: value })}
        >
          <SelectTrigger className="h-12 rounded-2xl border-white/10 bg-black/20 text-foreground">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <SelectValue placeholder="Filter by category" />
            </div>
          </SelectTrigger>
          <SelectContent className="border-white/10 bg-[#12071f]/95 text-foreground backdrop-blur-xl">
            <SelectItem value="all">All categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex h-12 items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4">
          <Label htmlFor="featured-only" className="flex items-center gap-2 text-sm text-foreground">
            <Star className="h-4 w-4 text-amber-300" />
            Featured only
          </Label>
          <Switch
            id="featured-only"
            checked={filters.featuredOnly}
            onCheckedChange={(checked) => onChange({ ...filters, featuredOnly: checked })}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>
    </div>
  );
};

export default AdminArtworkFilters;
