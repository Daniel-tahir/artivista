import { useState } from "react";
import { Plus, Edit3, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import type { BlogCategory } from "@/types/content";

interface BlogCategoryManagerProps {
  categories: BlogCategory[];
  onCreate: (cat: { name: string; slug: string; description: string }) => Promise<void>;
  onUpdate: (id: string, cat: { name: string; slug: string; description: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function slugify(text: string): string {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_]+/g, "-").replace(/-+/g, "-").replace(/^-+|-+$/g, "");
}

const BlogCategoryManager = ({ categories, onCreate, onUpdate, onDelete }: BlogCategoryManagerProps) => {
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await onCreate({ name: newName.trim(), slug: slugify(newName), description: newDesc.trim() });
      setNewName("");
      setNewDesc("");
      toast.success("Category created");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    try {
      await onUpdate(id, { name: editName.trim(), slug: slugify(editName), description: editDesc.trim() });
      setEditingId(null);
      toast.success("Category updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category? Blogs in it will become uncategorized.")) return;
    try {
      await onDelete(id);
      toast.success("Category deleted");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Add New Category
        </h3>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="mb-1 block text-xs text-muted-foreground">Name</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Category name"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="mb-1 block text-xs text-muted-foreground">Description</label>
            <input
              type="text"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Brief description"
              className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={handleCreate}
            disabled={!newName.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {categories.map((cat) => {
          const isEditing = editingId === cat.id;
          return (
            <div key={cat.id} className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    placeholder="Description"
                    className="flex-[2] rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
                  />
                  <button type="button" onClick={() => handleUpdate(cat.id)} className="rounded-lg p-1.5 text-emerald-400 hover:bg-emerald-500/10">
                    <Check className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setEditingId(null)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-foreground">{cat.name}</div>
                    <div className="text-xs text-muted-foreground">/{cat.slug}</div>
                  </div>
                  <div className="hidden flex-[2] text-sm text-muted-foreground sm:block">
                    {cat.description || "—"}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(cat.id);
                        setEditName(cat.name);
                        setEditDesc(cat.description);
                      }}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="rounded-lg p-1.5 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {categories.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No categories yet. Create your first category above.
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCategoryManager;
