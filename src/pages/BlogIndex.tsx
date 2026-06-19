import { useBlogs } from "@/hooks/useBlogs";
import BlogCard from "@/components/blog/BlogCard";
import SeoHead from "@/components/SeoHead";
import { Skeleton } from "@/components/ui/skeleton";
import SiteLayout from "@/components/layout/SiteLayout";

const BlogIndex = () => {
  const { data: remotePosts, isLoading, isError } = useBlogs();

  console.log("Fetched Blogs:", remotePosts);
  console.log("Blog Fetch Error:", isError);

  return (
    <SiteLayout>
      <SeoHead
        title="Blog | ARTIVISTAA"
        description="Explore our blog for character design tips, D&D inspiration, commission guides, and behind-the-scenes looks at professional fantasy and anime art."
        ogType="website"
        canonical={`${window.location.origin}/blog`}
      />
      <div className="min-h-screen pt-32 pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.25em] text-primary">
              Resources
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-tight text-glow sm:text-5xl">
              Blog &{" "}
              <span className="bg-gradient-to-r from-primary via-neon-cyan to-neon-magenta bg-clip-text text-transparent">
                Guides
              </span>
            </h1>
            <p className="section-copy mt-4 text-base text-muted-foreground sm:text-lg">
              Character design insights, commission tips, and creative inspiration
              for fantasy and anime art enthusiasts.
            </p>
          </div>

          {isLoading ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04]">
                  <Skeleton className="aspect-[16/9] w-full rounded-none bg-white/5" />
                  <div className="space-y-3 p-5">
                    <div className="flex gap-4">
                      <Skeleton className="h-3 w-20 bg-white/5" />
                      <Skeleton className="h-3 w-16 bg-white/5" />
                    </div>
                    <Skeleton className="h-5 w-3/4 bg-white/5" />
                    <Skeleton className="h-4 w-full bg-white/5" />
                    <Skeleton className="h-4 w-1/2 bg-white/5" />
                    <Skeleton className="h-4 w-24 bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : isError ? (
            <div className="mt-20 text-center text-muted-foreground">
              <p className="text-lg">Unable to load blogs. Please try again later.</p>
              <button
                onClick={() => window.location.reload()}
                className="interactive-surface mt-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm text-foreground hover:bg-white/[0.08]"
              >
                Retry
              </button>
            </div>
          ) : remotePosts && remotePosts.length > 0 ? (
            <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {remotePosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="mt-20 text-center text-muted-foreground">
              <p className="text-lg">No blogs available. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </SiteLayout>
  );
};

export default BlogIndex;
