import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import StarField from "@/components/StarField";
import { Link } from "react-router-dom";

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAdminAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/admin", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated === true) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Please enter both username and password.");
      return;
    }

    setLoading(true);

    const success = login(username, password);
    setLoading(false);

    if (success) {
      navigate("/admin", { replace: true });
    } else {
      setError("Invalid username or password.");
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden cosmic-bg">
      <StarField />
      <Link
        to="/"
        className="absolute left-4 top-4 z-20 inline-flex items-center rounded-full border border-white/10 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground"
      >
        Back to Site
      </Link>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.15),transparent_50%),radial-gradient(circle_at_80%_80%,rgba(236,72,153,0.12),transparent_40%),radial-gradient(circle_at_20%_80%,rgba(34,211,238,0.08),transparent_40%)]" />

      <div
        className={`relative z-10 w-full max-w-md px-4 transition-all duration-700 ${
          mounted ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <div className="relative">
          <div className="pointer-events-none absolute -inset-1 rounded-3xl bg-gradient-to-br from-primary/40 via-neon-cyan/20 to-neon-magenta/30 opacity-60 blur-xl" />

          <div className="relative rounded-3xl border border-white/10 bg-[hsl(262_42%_12%/0.7)] backdrop-blur-2xl p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] sm:p-10">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-neon-cyan/20">
                <LogIn className="h-7 w-7 text-primary" />
              </div>

              <h1 className="font-display text-2xl font-bold text-glow">
                Admin Access
              </h1>

              <p className="mt-1.5 text-sm text-muted-foreground">
                Sign in to manage ARTIVISTAA
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="username"
                  autoFocus
                  className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                />
              </div>

              <div>
                <label htmlFor="password" className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 pr-11 text-sm text-foreground placeholder:text-muted-foreground/40 transition-all focus:border-primary/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
                    tabIndex={-1}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-2.5 text-center text-sm text-red-400">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-neon-magenta px-5 py-3 text-sm font-medium text-white shadow-lg shadow-primary/30 transition-all hover:shadow-xl hover:shadow-primary/40 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="mt-6 text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground/40">
          &copy; {new Date().getFullYear()} ARTIVISTAA &mdash; All Rights Reserved
        </p>
      </div>
    </main>
  );
};

export default AdminLoginPage;
