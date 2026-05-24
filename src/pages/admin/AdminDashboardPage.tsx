import { useMemo, useState } from "react";
import { Shield, Sparkles, Database, Wand2, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import SiteFooter from "@/components/SiteFooter";
import StarField from "@/components/StarField";
import AdminArtworkEmptyState from "@/components/admin/AdminArtworkEmptyState";
import AdminArtworkFilters from "@/components/admin/AdminArtworkFilters";
import AdminArtworkFormDialog from "@/components/admin/AdminArtworkFormDialog";
import AdminArtworkTable from "@/components/admin/AdminArtworkTable";
import AdminDeleteArtworkDialog from "@/components/admin/AdminDeleteArtworkDialog";
import AdminStatsGrid from "@/components/admin/AdminStatsGrid";
import { useAdminArtworks } from "@/hooks/admin/use-admin-artworks";
import type { AdminArtwork } from "@/types/admin/artwork";
import { createEmptyArtworkForm } from "@/utils/admin/artwork-form";

const AdminDashboardPage = () => {
  const {
    visibleArtworks,
    stats,
    filters,
    setFilters,
    isBootstrapped,
    isLoading,
    isError,
    categories,
    createArtwork,
    createArtworkBatch,
    updateArtwork,
    deleteArtwork,
    createEditFormData,
  } = useAdminArtworks();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingArtwork, setEditingArtwork] = useState<AdminArtwork | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminArtwork | null>(null);

  const activeFormData = useMemo(() => {
    if (formMode === "edit" && editingArtwork) {
      return createEditFormData(editingArtwork);
    }

    return createEmptyArtworkForm();
  }, [createEditFormData, editingArtwork, formMode]);

  const hasFiltersApplied = filters.query.trim().length > 0 || filters.category !== "all" || filters.featuredOnly;

  return (
    <main className="relative min-h-screen overflow-x-hidden cosmic-bg">
      <StarField />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_top_right,rgba(192,132,252,0.18),transparent_28%),radial-gradient(circle_at_bottom,rgba(236,72,153,0.12),transparent_30%)]" />

      <div className="relative z-10">
        <section className="px-4 pb-8 pt-8 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-5">
              <Link
                to="/"
                className="interactive-surface group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-muted-foreground shadow-[0_18px_40px_-28px_rgba(0,0,0,0.9)] backdrop-blur-xl hover:-translate-x-0.5 hover:border-primary/30 hover:bg-white/[0.08] hover:text-foreground hover:shadow-[0_0_28px_rgba(34,211,238,0.14)]"
              >
                <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:text-neon-cyan" />
                <span>Back to Site</span>
              </Link>
            </div>
            <div className="glass transmission-shell relative overflow-hidden rounded-[2rem] border border-white/10 px-6 py-8 sm:px-8 lg:px-10">
              <div className="transmission-noise absolute inset-0 opacity-30" />
              <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.26em] text-primary/90">
                    <Shield className="h-4 w-4" />
                    Hidden admin route
                  </div>
                  <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-glow sm:text-5xl lg:text-6xl">
                    Premium artwork command center
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                    Manage anime showcase assets with a cinematic dashboard built to match the platform’s luxury neon language. All edits sync through the live Supabase content layer without disturbing the public galleries.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[420px]">
                  {[
                    { label: "Persistence", value: "Supabase Live", Icon: Database },
                    { label: "Experience", value: "Storage Uploads", Icon: Wand2 },
                    { label: "Studio Tone", value: "Cinematic UI", Icon: Sparkles },
                  ].map(({ label, value, Icon }) => (
                    <div key={label} className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                      <Icon className="h-4 w-4 text-neon-cyan" />
                      <div className="mt-4 text-xs uppercase tracking-[0.22em] text-muted-foreground">{label}</div>
                      <div className="mt-2 text-sm font-medium text-foreground">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-6">
            <AdminStatsGrid stats={stats} />

            <AdminArtworkFilters
              filters={filters}
              categories={categories}
              onChange={setFilters}
              onCreate={() => {
                setFormMode("create");
                setEditingArtwork(null);
                setIsFormOpen(true);
              }}
            />

            {isError ? (
              <AdminArtworkEmptyState
                hasFilters={false}
                onCreate={() => {
                  setFormMode("create");
                  setEditingArtwork(null);
                  setIsFormOpen(true);
                }}
              />
            ) : isBootstrapped && !isLoading && visibleArtworks.length > 0 ? (
              <AdminArtworkTable
                artworks={visibleArtworks}
                onEdit={(artwork) => {
                  setFormMode("edit");
                  setEditingArtwork(artwork);
                  setIsFormOpen(true);
                }}
                onDelete={(artwork) => setDeleteTarget(artwork)}
              />
            ) : (
              <AdminArtworkEmptyState
                hasFilters={hasFiltersApplied}
                onCreate={() => {
                  setFormMode("create");
                  setEditingArtwork(null);
                  setIsFormOpen(true);
                }}
              />
            )}
          </div>
        </section>

        <SiteFooter />
      </div>

      <AdminArtworkFormDialog
        open={isFormOpen}
        mode={formMode}
        categories={categories}
        initialData={activeFormData}
        onOpenChange={setIsFormOpen}
        onSubmitBatch={async (items, onProgress) => createArtworkBatch(items, onProgress)}
        onSubmit={async (formData) => {
          if (formMode === "edit" && editingArtwork) {
            await updateArtwork(editingArtwork.id, formData);
            return;
          }

          await createArtwork(formData);
        }}
      />

      <AdminDeleteArtworkDialog
        open={Boolean(deleteTarget)}
        artwork={deleteTarget}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
          }
        }}
        onConfirm={async () => {
          if (!deleteTarget) {
            return;
          }

          await deleteArtwork(deleteTarget.id);
          setDeleteTarget(null);
        }}
      />
    </main>
  );
};

export default AdminDashboardPage;
