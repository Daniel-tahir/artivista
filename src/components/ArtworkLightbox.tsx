import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

interface ArtworkLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  image: string;
}

const ArtworkLightbox = ({
  open,
  onOpenChange,
  title,
  image,
}: ArtworkLightboxProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass glow-border max-h-[90vh] max-w-[min(92vw,1100px)] overflow-hidden border-white/10 bg-background/88 p-3 text-foreground shadow-[0_30px_120px_-48px_rgba(5,8,20,0.95)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-4">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Enlarged view of the selected artwork.
        </DialogDescription>
        <div className="overflow-hidden rounded-[1.15rem] border border-white/10 bg-black/20">
          <img
            src={image}
            alt={title}
            className="max-h-[80vh] w-full object-contain"
            decoding="async"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArtworkLightbox;
