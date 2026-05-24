import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { AdminArtwork } from "@/types/admin/artwork";

interface AdminDeleteArtworkDialogProps {
  artwork?: AdminArtwork | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
}

const AdminDeleteArtworkDialog = ({
  artwork,
  open,
  onOpenChange,
  onConfirm,
}: AdminDeleteArtworkDialogProps) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="rounded-[1.75rem] border-white/10 bg-[radial-gradient(circle_at_top,rgba(67,16,32,0.95),rgba(8,10,20,0.98))] text-foreground">
        <AlertDialogHeader>
          <div className="eyebrow text-[0.62rem] text-red-300/80">Critical action</div>
          <AlertDialogTitle className="text-2xl tracking-[-0.04em]">Delete artwork transmission?</AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-muted-foreground">
            {artwork
              ? `This removes ${artwork.title} from the live artwork library and Supabase-backed admin collection.`
              : "This removes the selected artwork from the live artwork library."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-full border-white/10 bg-black/20 text-foreground hover:bg-white/10">
            Keep artwork
          </AlertDialogCancel>
          <AlertDialogAction
            className="rounded-full bg-red-500 text-white hover:bg-red-500/90"
            onClick={(event) => {
              event.preventDefault();
              void onConfirm().then(() => onOpenChange(false));
            }}
          >
            Delete permanently
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminDeleteArtworkDialog;
