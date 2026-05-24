import { ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminArtworkEmptyStateProps {
  hasFilters: boolean;
  onCreate: () => void;
}

const AdminArtworkEmptyState = ({ hasFilters, onCreate }: AdminArtworkEmptyStateProps) => {
  return (
    <div className="glass glow-border rounded-[1.75rem] border border-dashed border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] shadow-[0_0_40px_rgba(192,132,252,0.18)]">
        <ImagePlus className="h-7 w-7 text-primary" />
      </div>
      <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em] text-foreground">
        {hasFilters ? "No artworks match the current scan." : "Your admin collection is ready for its first drop."}
      </h3>
      <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
        {hasFilters
          ? "Try widening the search, switching categories, or disabling the featured-only lock."
          : "Add a new anime artwork with image preview, tags, and metadata to start shaping the internal studio catalog."}
      </p>
      <Button
        onClick={onCreate}
        className="mt-6 rounded-full bg-[linear-gradient(135deg,rgba(192,132,252,0.95),rgba(34,211,238,0.95))] px-6 text-slate-950"
      >
        Add Artwork
      </Button>
    </div>
  );
};

export default AdminArtworkEmptyState;
