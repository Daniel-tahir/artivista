import { useBlogs } from "@/hooks/useBlogs";
import { blogPosts as localPosts } from "@/content/blog/posts";
import BlogCard from "@/components/blog/BlogCard";
import SeoHead from "@/components/SeoHead";
import type { Blog } from "@/types/content";

function mapLocalToBlog(local: typeof localPosts[number], index: number): Blog {
  return {
    id: `local-${index}`,
    title: local.title,
    slug: local.slug,
    excerpt: local.excerpt,
    content: local.content,
    coverImage: local.coverImage,
    authorId: local.author,
    published: true,
    featured: false,
    metaTitle: local.metaTitle,
    metaDescription: local.metaDescription,
    ogTitle: local.metaTitle,
    ogDescription: local.metaDescription,
    ogImage: "",
    focusKeyword: "",
    canonicalUrl: "",
    categoryId: "",
    scheduledAt: "",
    views: 0,
    createdAt: local.publishedAt,
    updatedAt: local.publishedAt,
    publishedAt: local.publishedAt,
    tags: local.tags,
  };
}

const BlogIndex = () => {
  const { data: remotePosts, isLoading } = useBlogs();

  let displayPosts: Blog[] = [];

  if (remotePosts && remotePosts.length > 0) {
    displayPosts = remotePosts;
  } else if (!isLoading) {
    displayPosts = localPosts.map(mapLocalToBlog);
  }

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
            {displayPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>

          {displayPosts.length === 0 && !isLoading && (
            <div className="mt-20 text-center text-muted-foreground">
              <p className="text-lg">No posts yet. Check back soon!</p>
            </div>
          )}

          {isLoading && (
            <div className="mt-20 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default BlogIndex;
