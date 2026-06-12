import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import type { Blog } from "@/types/content";

interface BlogCardProps {
  post: Blog;
  index?: number;
}

const gradientColors = [
  "from-violet-600/40 via-fuchsia-600/30 to-blue-600/40",
  "from-cyan-600/40 via-blue-600/30 to-indigo-600/40",
  "from-rose-600/40 via-purple-600/30 to-pink-600/40",
  "from-amber-600/40 via-orange-600/30 to-red-600/40",
  "from-emerald-600/40 via-teal-600/30 to-cyan-600/40",
];

function getGradient(index: number) {
  return gradientColors[index % gradientColors.length];
}

function estimateReadingTime(content: string): number {
  const text = content.replace(/<[^>]*>/g, "");
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const BlogCard = ({ post, index = 0 }: BlogCardProps) => {
  const gradient = getGradient(index);
  const readingTime = estimateReadingTime(post.content);

  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_0_40px_hsl(var(--primary)/0.15)]"
    >
      {post.coverImage ? (
        <div className="aspect-[16/9] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      ) : (
        <div
          className={`flex aspect-[16/9] items-end bg-gradient-to-br ${gradient} p-5`}
        >
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white/90 backdrop-blur-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(post.publishedAt || post.createdAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {readingTime} min read
          </span>
        </div>

        <h3 className="font-display text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>

        <div className="inline-flex items-center gap-2 text-sm font-medium text-primary">
          Read More
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
