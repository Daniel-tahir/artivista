import { blogPosts } from "@/content/blog/posts";
import BlogCard from "@/components/blog/BlogCard";
import SeoHead from "@/components/SeoHead";

const BlogIndex = () => {
  return (
    <>
      <SeoHead
        title="Blog | ARTIVISTAA"
        description="Explore our blog for character design tips, D&D inspiration, commission guides, and behind-the-scenes looks at professional fantasy and anime art."
        ogType="website"
        canonical={`${window.location.origin}/blog`}
      />

      <main className="min-h-screen pt-32 pb-20">
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

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>

          {blogPosts.length === 0 && (
            <div className="mt-20 text-center text-muted-foreground">
              <p className="text-lg">No posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BlogIndex;
