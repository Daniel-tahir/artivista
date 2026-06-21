import DOMPurify from "dompurify";

const SUPABASE_STORAGE_DOMAIN = "supabase.co";

const ALLOWED_URI_REGEXP = /^(?:(?:https?):)/i;

export const MAX_INPUT_LENGTHS = {
  TITLE: 200,
  EXCERPT: 500,
  DESCRIPTION: 2000,
  META_TITLE: 120,
  META_DESCRIPTION: 320,
  ANIME_SERIES: 100,
} as const;

const SAFE_UPLOAD_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
]);

const SAFE_UPLOAD_EXTENSIONS = new Set([
  "png", "jpg", "jpeg", "webp", "gif",
]);

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

export function sanitizeHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      "p", "br", "strong", "em", "u", "s",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "pre", "code", "hr",
      "a", "img",
    ],
    ALLOWED_ATTR: [
      "href", "target", "rel", "src", "alt",
      "width", "height",
    ],
    ALLOW_DATA_ATTR: false,
    ALLOWED_URI_REGEXP,
  });
}

export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    ALLOW_DATA_ATTR: false,
  }).trim();
}

export function clampLength(value: string, max: number): string {
  return value.slice(0, max);
}

export function validateImageUrl(url: string | null | undefined): string {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return "";
    if (!parsed.hostname.includes(SUPABASE_STORAGE_DOMAIN)) return "";
    return url;
  } catch {
    return "";
  }
}

export function validateUploadFile(
  file: File,
  options?: {
    maxSizeBytes?: number;
    allowedMimeTypes?: Set<string>;
    allowedExtensions?: Set<string>;
  },
): void {
  const maxSize = options?.maxSizeBytes ?? MAX_UPLOAD_SIZE_BYTES;
  const allowedMime = options?.allowedMimeTypes ?? SAFE_UPLOAD_MIME_TYPES;
  const allowedExt = options?.allowedExtensions ?? SAFE_UPLOAD_EXTENSIONS;

  if (!(file instanceof File) || !file.name.trim() || file.size <= 0) {
    throw new Error("Invalid file.");
  }

  if (!allowedMime.has(file.type)) {
    throw new Error("Unsupported file type. Use PNG, JPEG, WebP, or GIF.");
  }

  const ext = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (!ext || !allowedExt.has(ext)) {
    throw new Error("Invalid file extension.");
  }

  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size is ${Math.round(maxSize / (1024 * 1024))} MB.`);
  }
}

export function inferSafeExtension(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName && ["png", "jpg", "jpeg", "webp", "gif"].includes(fromName)) {
    return fromName === "jpg" ? "jpeg" : fromName;
  }
  if (file.type === "image/png") return "png";
  if (file.type === "image/jpeg") return "jpeg";
  if (file.type === "image/webp") return "webp";
  if (file.type === "image/gif") return "gif";
  return "";
}

export function escapeLikePattern(value: string): string {
  return value.replace(/[%_\\]/g, "\\$&");
}

export function devlog(method: "log" | "warn" | "error", ...args: unknown[]): void {
  if (import.meta.env.DEV) {
    console[method](...args);
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
