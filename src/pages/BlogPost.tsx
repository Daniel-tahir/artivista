import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Calendar, Clock, ArrowLeft, ChevronRight, User,
} from "lucide-react";
import { blogPosts, getBlogPost, getRelatedPosts } from "@/content/blog/posts";
import { fetchBlogBySlug } from "@/services/blogs/blog.service";
import BlogCard from "@/components/blog/BlogCard";
import SeoHead from "@/components/SeoHead";
import type { Blog } from "@/types/content";
import type { BlogPost as LocalPost } from "@/content/blog/posts";

const gradientColors = [
  "from-violet-600/40 via-fuchsia-600/30 to-blue-600/40",
  "from-cyan-600/40 via-blue-600/30 to-indigo-600/40",
  "from-rose-600/40 via-purple-600/30 to-pink-600/40",
  "from-amber-600/40 via-orange-600/30 to-red-600/40",
  "from-emerald-600/40 via-teal-600/30 to-cyan-600/40",
];

function getGradient(slug: string) {
  const idx = blogPosts.findIndex((p) => p.slug === slug);
  return gradientColors[Math.max(0, idx % gradientColors.length)];
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function extractToc(content: string) {
  const headings = content.match(/<h2[^>]*id="([^"]*)"[^>]*>([^<]+)<\/h2>/g);
  return (headings ?? []).map((h) => {
    const id = h.match(/id="([^"]*)"/)?.[1] ?? "";
    const text = h.match(/<h2[^>]*>([^<]+)<\/h2>/)?.[1] ?? "";
    return { id, text };
  });
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

interface ResolvedPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  tags: string[];
  publishedAt: string;
  author: string;
  authorRole?: string;
  faqs?: { question: string; answer: string }[];
  metaTitle: string;
  metaDescription: string;
  authorInitial?: string;
}

function localToResolved(local: LocalPost): ResolvedPost {
  return {
    title: local.title,
    slug: local.slug,
    excerpt: local.excerpt,
    content: local.content,
    coverImage: local.coverImage,
    tags: local.tags,
    publishedAt: local.publishedAt,
    author: local.author,
    authorRole: local.authorRole,
    faqs: local.faqs,
    metaTitle: local.metaTitle,
    metaDescription: local.metaDescription,
    authorInitial: "A",
  };
}

function remoteToResolved(remote: Blog): ResolvedPost {
  return {
    title: remote.title,
    slug: remote.slug,
    excerpt: remote.excerpt,
    content: remote.content,
    coverImage: remote.coverImage,
    tags: remote.tags ?? [],
    publishedAt: remote.publishedAt || remote.createdAt,
    author: "ARTIVISTAA",
    metaTitle: remote.metaTitle || remote.title,
    metaDescription: remote.metaDescription || remote.excerpt.slice(0, 160),
    authorInitial: "A",
  };
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<ResolvedPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      return;
    }

    const local = getBlogPost(slug);
    if (local) {
      setPost(localToResolved(local));
      setLoading(false);
      return;
    }

    fetchBlogBySlug(slug)
      .then((remote) => {
        if (remote) {
          setPost(remoteToResolved(remote));
        } else {
          setPost(null);
        }
      })
      .catch(() => {
        setPost(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const relatedPosts = post
    ? getRelatedPosts(post.slug).map(localToResolved)
    : [];

  const toc = post ? extractToc(post.content) : [];
  const baseUrl = window.location.origin;

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center pt-32">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
      </main>
    );
  }

  if (!post) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center pt-32">
        <div className="mx-auto max-w-md text-center">
          <h1 className="font-display text-4xl font-bold text-glow">
            Post Not Found
          </h1>
          <p className="mt-4 text-muted-foreground">
            The blog post you're looking for doesn't exist or may have been moved.
          </p>
          <Link
            to="/blog"
            className="interactive-surface mt-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-6 py-3 text-sm text-foreground hover:bg-white/[0.08]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>
        </div>
      </main>
    );
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${baseUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: window.location.href },
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    publisher: { "@type": "Organization", name: "ARTIVISTAA" },
    mainEntityOfPage: { "@type": "WebPage", "@id": window.location.href },
  };

  const faqJsonLd = post.faqs?.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: post.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const graphItems = faqJsonLd
    ? [breadcrumbJsonLd, articleJsonLd, faqJsonLd]
    : [breadcrumbJsonLd, articleJsonLd];

  return (
    <>
      <SeoHead
        title={post.metaTitle}
        description={post.metaDescription}
        ogTitle={post.metaTitle}
        ogDescription={post.metaDescription}
        ogType="article"
        canonical={`${baseUrl}/blog/${post.slug}`}
        articlePublishedTime={post.publishedAt}
        articleTags={post.tags}
        jsonLd={{ "@context": "https://schema.org", "@graph": graphItems }}
      />

      <main className="min-h-screen pt-28 pb-20">
        <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="mb-8 flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to="/blog" className="hover:text-foreground transition-colors">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{post.title}</span>
          </nav>

          <Link
            to="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>

          {post.coverImage ? (
            <div className="mb-10 overflow-hidden rounded-2xl">
              <img src={post.coverImage} alt={post.title} className="w-full object-cover" />
            </div>
          ) : (
            <div className={`mb-10 flex aspect-[21/9] items-end rounded-2xl bg-gradient-to-br ${getGradient(post.slug)} p-8 md:p-12`}>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-black/40 px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
            <div>
              <header className="mb-10">
                <h1 className="font-display text-3xl font-bold leading-tight text-glow sm:text-4xl lg:text-5xl">
                  {post.title}
                </h1>
                <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    {post.author}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {formatDate(post.publishedAt)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {estimateReadingTime(post.content)} min read
                  </span>
                </div>
              </header>

              <div
                className="prose prose-invert prose-headings:font-display prose-headings:text-glow prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-strong:text-foreground max-w-none"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              <div className="mt-12 rounded-2xl border border-white/10 bg-white/[0.04] p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-neon-cyan/20">
                    <span className="font-display text-xl font-bold text-primary">
                      {post.authorInitial || "A"}
                    </span>
                  </div>
                  <div>
                    <div className="font-display text-lg font-bold text-foreground">{post.author}</div>
                    {post.authorRole && (
                      <div className="text-sm text-muted-foreground">{post.authorRole}</div>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      ARTIVISTAA specializes in custom fantasy, anime, and D&D character art.
                      Every design is crafted with attention to detail, storytelling, and artistic excellence.
                    </p>
                  </div>
                </div>
              </div>

              {post.faqs && post.faqs.length > 0 && (
                <div className="mt-10">
                  <h2 className="font-display text-2xl font-bold text-glow mb-6">Frequently Asked Questions</h2>
                  <div className="space-y-4">
                    {post.faqs.map((faq, i) => (
                      <details key={i} className="group rounded-2xl border border-white/10 bg-white/[0.04] transition-colors hover:border-white/20">
                        <summary className="flex cursor-pointer items-center justify-between p-5 text-sm font-semibold text-foreground">
                          {faq.question}
                          <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-90" />
                        </summary>
                        <div className="border-t border-white/10 px-5 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-32 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">On this page</h3>
                {toc.length > 0 ? (
                  <nav className="flex flex-col gap-2">
                    {toc.map((heading) => (
                      <a key={heading.id} href={`#${heading.id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {heading.text}
                      </a>
                    ))}
                  </nav>
                ) : (
                  <p className="text-sm text-muted-foreground">No sections</p>
                )}
              </div>
            </aside>
          </div>

          {toc.length > 0 && (
            <div className="mt-10 lg:hidden">
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h3 className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">On this page</h3>
                <nav className="flex flex-wrap gap-x-4 gap-y-2">
                  {toc.map((heading) => (
                    <a key={heading.id} href={`#${heading.id}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          )}

          {relatedPosts.length > 0 && (
            <section className="mt-20">
              <h2 className="font-display text-2xl font-bold text-glow mb-8">Related Posts</h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedPosts.map((related, i) => (
                  <div key={related.slug}>
                    <BlogCard
                      post={{
                        id: related.slug,
                        title: related.title,
                        slug: related.slug,
                        excerpt: related.excerpt,
                        content: related.content,
                        coverImage: related.coverImage,
                        tags: related.tags,
                        publishedAt: related.publishedAt,
                        createdAt: related.publishedAt,
                        updatedAt: related.publishedAt,
                        authorId: related.author,
                        published: true,
                        featured: false,
                        metaTitle: related.metaTitle,
                        metaDescription: related.metaDescription,
                        categoryId: "",
                        ogTitle: "",
                        ogDescription: "",
                        ogImage: "",
                        focusKeyword: "",
                        canonicalUrl: "",
                        scheduledAt: "",
                        views: 0,
                      }}
                      index={i + 3}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-20 rounded-3xl border border-white/10 bg-gradient-to-br from-primary/5 via-neon-cyan/[0.03] to-neon-magenta/[0.05] p-8 text-center md:p-16">
            <h2 className="font-display text-3xl font-bold text-glow sm:text-4xl">Ready to Bring Your Character to Life?</h2>
            <p className="section-copy mx-auto mt-4 max-w-xl text-muted-foreground">
              Whether you have a detailed concept or just a spark of an idea, we'll craft custom artwork that exceeds your expectations.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/#artwork" className="interactive-surface inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-8 py-3 text-sm font-medium text-foreground hover:bg-white/[0.08]">
                View Portfolio
              </Link>
              <a href="https://wa.me/15708078735" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-medium text-primary-foreground shadow-lg shadow-primary/30 transition-all duration-300 hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/40">
                Start a Commission
              </a>
            </div>
          </section>
        </article>
      </main>
    </>
  );
};

export default BlogPost;
