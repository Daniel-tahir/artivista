import { useState } from "react";
import {
  Edit3, Trash2, Copy, Eye, Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import type { Blog, BlogCategory } from "@/types/content";

interface BlogPostTableProps {
  blogs: Blog[];
  categories: BlogCategory[];
  onEdit: (blog: Blog) => void;
  onDelete: (blog: Blog) => void;
  onDuplicate: (blog: Blog) => void;
}

const statusConfig = {
  published: { label: "Published", class: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400" },
  draft: { label: "Draft", class: "border-amber-500/30 bg-amber-500/10 text-amber-400" },
  scheduled: { label: "Scheduled", class: "border-blue-500/30 bg-blue-500/10 text-blue-400" },
} as const;

function getStatus(blog: Blog): keyof typeof statusConfig {
  if (blog.scheduledAt && new Date(blog.scheduledAt) > new Date()) return "scheduled";
  return blog.published ? "published" : "draft";
}

const BlogPostTable = ({ blogs, categories, onEdit, onDelete, onDuplicate }: BlogPostTableProps) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const filtered = blogs.filter((blog) => {
    if (search && !blog.title.toLowerCase().includes(search.toLowerCase()) && !blog.slug.includes(search.toLowerCase())) return false;
    if (statusFilter !== "all") {
      const status = getStatus(blog);
      if (status !== statusFilter) return false;
    }
    if (categoryFilter !== "all" && blog.categoryId !== categoryFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.05] py-2.5 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-foreground focus:border-primary/40 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-hidden rounded-2xl border border-white/10 md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.03]">
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Cover</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">Created</th>
              <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.map((blog) => {
              const status = getStatus(blog);
              return (
                <tr key={blog.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    {blog.coverImage ? (
                      <img
                        src={blog.coverImage}
                        alt=""
                        className="h-12 w-20 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-20 rounded-lg bg-white/[0.05]" />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="max-w-xs">
                      <div className="truncate text-sm font-medium text-foreground">
                        {blog.title}
                      </div>
                      <div className="truncate text-xs text-muted-foreground">
                        /blog/{blog.slug}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {blog.categoryId ? categoryMap.get(blog.categoryId) ?? "—" : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider ${statusConfig[status].class}`}>
                      {statusConfig[status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        to={`/blog/${blog.slug}`}
                        target="_blank"
                        className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => onEdit(blog)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicate(blog)}
                        className="rounded-lg p-2 text-muted-foreground hover:bg-white/[0.06] hover:text-foreground"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(blog)}
                        className="rounded-lg p-2 text-red-400/70 hover:bg-red-500/10 hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-muted-foreground">
            {search || statusFilter !== "all" || categoryFilter !== "all"
              ? "No blogs match your filters."
              : "No blogs yet. Create your first blog post!"}
          </div>
        )}
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 md:hidden">
        {filtered.map((blog) => {
          const status = getStatus(blog);
          return (
            <div key={blog.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-start gap-3">
                {blog.coverImage ? (
                  <img src={blog.coverImage} alt="" className="h-16 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <div className="h-16 w-24 shrink-0 rounded-xl bg-white/[0.05]" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-foreground">{blog.title}</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">/blog/{blog.slug}</div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${statusConfig[status].class}`}>
                      {statusConfig[status].label}
                    </span>
                    {blog.categoryId && (
                      <span className="text-xs text-muted-foreground">
                        {categoryMap.get(blog.categoryId)}
                      </span>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1">
                    <Link to={`/blog/${blog.slug}`} target="_blank" className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                      <Eye className="h-3.5 w-3.5" />
                    </Link>
                    <button type="button" onClick={() => onEdit(blog)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onDuplicate(blog)} className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => onDelete(blog)} className="rounded-lg p-1.5 text-red-400/70 hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-8 text-center text-sm text-muted-foreground">No blogs found.</div>
        )}
      </div>
    </div>
  );
};

export default BlogPostTable;
