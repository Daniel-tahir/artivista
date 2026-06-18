import { NavLink, Link } from "react-router-dom";
import { FileText, PlusCircle, ArrowLeft } from "lucide-react";

interface AdminBlogLayoutProps {
  children: React.ReactNode;
}

const navLinks = [
  { to: "/admin/blogs", label: "All Blogs", icon: FileText },
  { to: "/admin/blogs/new", label: "Add Blog", icon: PlusCircle },
];

const AdminBlogLayout = ({ children }: AdminBlogLayoutProps) => {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          to="/admin"
          className="interactive-surface group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-sm text-muted-foreground hover:-translate-x-0.5 hover:border-primary/30 hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-glow">
          Blog <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">Manager</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create, edit, and manage blog posts for SEO and content marketing.
        </p>
      </div>

      <div className="mb-6 flex gap-1 border-b border-white/10">
        {navLinks.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/admin/blogs"}
            className={({ isActive }) =>
              `inline-flex items-center gap-2 rounded-t-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "border-b-2 border-primary bg-primary/5 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </div>

      {children}
    </div>
  );
};

export default AdminBlogLayout;
