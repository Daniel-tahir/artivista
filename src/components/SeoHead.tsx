import { useEffect, useRef } from "react";

interface SeoConfig {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: "website" | "article";
  canonical?: string;
  articlePublishedTime?: string;
  articleTags?: string[];
  jsonLd?: Record<string, unknown>;
}

const SITE_NAME = "ARTIVISTAA";
const DEFAULT_OG_IMAGE = "";

function upsertMeta(
  key: string,
  value: string,
  attribute: "name" | "property",
) {
  const selector =
    attribute === "name"
      ? `meta[name="${key}"]`
      : `meta[property="${key}"]`;
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (el) {
    el.content = value;
  } else {
    el = document.createElement("meta");
    el[attribute] = key;
    el.content = value;
    document.head.appendChild(el);
  }
}

function removeMeta(key: string, attribute: "name" | "property") {
  const selector =
    attribute === "name"
      ? `meta[name="${key}"]`
      : `meta[property="${key}"]`;
  document.querySelector(selector)?.remove();
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
  if (el) {
    el.href = href;
  } else {
    el = document.createElement("link");
    el.rel = rel;
    el.href = href;
    document.head.appendChild(el);
  }
}

function removeLink(rel: string) {
  document.querySelector(`link[rel="${rel}"]`)?.remove();
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (el) {
    el.textContent = JSON.stringify(data);
  } else {
    el = document.createElement("script");
    el.id = id;
    el.type = "application/ld+json";
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
  }
}

function removeJsonLd(id: string) {
  document.getElementById(id)?.remove();
}

const SeoHead = (config: SeoConfig) => {
  const previousRef = useRef<{
    title: string;
    description: string;
  } | null>(null);

  const {
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    canonical,
    articlePublishedTime,
    articleTags,
    jsonLd,
  } = config;

  useEffect(() => {
    const prev = {
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    };
    previousRef.current = prev;

    const fullTitle = title.includes(SITE_NAME)
      ? title
      : `${title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta("description", description, "name");
    upsertMeta("og:title", ogTitle ?? fullTitle, "property");
    upsertMeta("og:description", ogDescription ?? description, "property");
    upsertMeta("og:type", ogType ?? "article", "property");
    upsertMeta("og:site_name", SITE_NAME, "property");

    const url = canonical ?? window.location.href;
    upsertMeta("og:url", url, "property");
    upsertLink("canonical", url);

    const resolvedOgImage = ogImage ?? DEFAULT_OG_IMAGE;
    if (resolvedOgImage) {
      upsertMeta("og:image", resolvedOgImage, "property");
      upsertMeta("twitter:image", resolvedOgImage, "name");
    }

    upsertMeta("twitter:card", "summary_large_image", "name");
    upsertMeta("twitter:title", ogTitle ?? fullTitle, "name");
    upsertMeta("twitter:description", ogDescription ?? description, "name");

    if (articlePublishedTime) {
      upsertMeta("article:published_time", articlePublishedTime, "property");
    }
    if (articleTags?.length) {
      for (const tag of articleTags) {
        upsertMeta("article:tag", tag, "property");
      }
    }

    if (jsonLd) {
      upsertJsonLd("seo-structured-data", jsonLd);
    }

    return () => {
      document.title = prev.title;
      upsertMeta("description", prev.description, "name");
      removeMeta("og:title", "property");
      removeMeta("og:description", "property");
      removeMeta("og:image", "property");
      removeMeta("og:url", "property");
      removeMeta("og:type", "property");
      removeMeta("og:site_name", "property");
      removeMeta("twitter:card", "name");
      removeMeta("twitter:title", "name");
      removeMeta("twitter:description", "name");
      removeMeta("twitter:image", "name");
      removeMeta("article:published_time", "property");
      if (articleTags?.length) {
        for (const tag of articleTags) {
          removeMeta("article:tag", "property");
        }
      }
      removeLink("canonical");
      if (jsonLd) {
        removeJsonLd("seo-structured-data");
      }
    };
  }, [
    title,
    description,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    canonical,
    articlePublishedTime,
    articleTags,
    jsonLd,
  ]);

  return null;
};

export default SeoHead;
