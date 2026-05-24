import { useMemo, useState } from "react";
import { Pencil, Star, Trash2, ImageOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { AdminArtwork } from "@/types/admin/artwork";
import { cn } from "@/lib/utils";

interface AdminArtworkTableProps {
  artworks: AdminArtwork[];
  onEdit: (artwork: AdminArtwork) => void;
  onDelete: (artwork: AdminArtwork) => void;
}

const ArtworkThumbnail = ({ src, alt }: { src: string; alt: string }) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-white/10 bg-black/20 text-muted-foreground">
        <ImageOff className="h-5 w-5" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setHasError(true)}
      className="h-16 w-16 rounded-2xl border border-white/10 object-cover shadow-[0_0_28px_rgba(34,211,238,0.12)]"
    />
  );
};

const AdminArtworkTable = ({ artworks, onEdit, onDelete }: AdminArtworkTableProps) => {
  const mobileCards = useMemo(
    () =>
      artworks.map((artwork) => (
        <article
          key={artwork.id}
          className="glass glow-border rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="flex items-start gap-4">
            <ArtworkThumbnail src={artwork.imageUrl} alt={artwork.title} />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="line-clamp-1 text-base font-semibold text-foreground">{artwork.title}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    {artwork.categoryLabel || artwork.categoryName || artwork.category}
                  </p>
                </div>
                {artwork.featured ? (
                  <Badge className="rounded-full border-amber-300/20 bg-amber-400/10 text-amber-200">Featured</Badge>
                ) : null}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{artwork.description}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {artwork.tags.map((tag) => (
              <Badge
                key={tag}
                variant="outline"
                className="rounded-full border-white/10 bg-white/[0.04] text-[11px] text-muted-foreground"
              >
                {tag}
              </Badge>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" className="flex-1 rounded-full border-white/10 bg-black/20" onClick={() => onEdit(artwork)}>
              <Pencil className="h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="rounded-full border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-red-50"
              onClick={() => onDelete(artwork)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </article>
      )),
    [artworks, onDelete, onEdit],
  );

  return (
    <>
      <div className="grid gap-4 lg:hidden">{mobileCards}</div>

      <div className="hidden overflow-hidden rounded-[1.75rem] border border-white/10 bg-black/20 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] lg:block">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="pl-6 text-xs uppercase tracking-[0.28em] text-muted-foreground">Artwork</TableHead>
              <TableHead className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Category</TableHead>
              <TableHead className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Featured</TableHead>
              <TableHead className="text-xs uppercase tracking-[0.28em] text-muted-foreground">Tags</TableHead>
              <TableHead className="text-right text-xs uppercase tracking-[0.28em] text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {artworks.map((artwork) => (
              <TableRow
                key={artwork.id}
                className={cn(
                  "border-white/10 bg-transparent transition-all duration-300 hover:bg-white/[0.03]",
                  artwork.featured && "bg-[linear-gradient(90deg,rgba(251,191,36,0.04),transparent)]",
                )}
              >
                <TableCell className="pl-6">
                  <div className="flex items-center gap-4">
                    <ArtworkThumbnail src={artwork.imageUrl} alt={artwork.title} />
                    <div className="max-w-[320px]">
                      <div className="font-medium text-foreground">{artwork.title}</div>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{artwork.description}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="rounded-full border-white/10 bg-white/[0.04] text-foreground">
                    {artwork.categoryLabel || artwork.categoryName || artwork.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  {artwork.featured ? (
                    <Badge className="rounded-full border-amber-300/20 bg-amber-400/10 text-amber-200">
                      <Star className="mr-1 h-3.5 w-3.5" />
                      Highlighted
                    </Badge>
                  ) : (
                    <span className="text-sm text-muted-foreground">Standard</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex max-w-[320px] flex-wrap gap-2">
                    {artwork.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="rounded-full border-white/10 bg-white/[0.04] text-[11px] text-muted-foreground"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" className="rounded-full border-white/10 bg-black/20" onClick={() => onEdit(artwork)}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      className="rounded-full border-red-400/20 bg-red-500/10 text-red-100 hover:bg-red-500/20 hover:text-red-50"
                      onClick={() => onDelete(artwork)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default AdminArtworkTable;
