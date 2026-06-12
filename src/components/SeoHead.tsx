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

  useEffect(() => {
    const prev = {
      title: document.title,
      description:
        document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "",
    };
    previousRef.current = prev;

    const fullTitle = config.title.includes(SITE_NAME)
      ? config.title
      : `${config.title} | ${SITE_NAME}`;

    document.title = fullTitle;
    upsertMeta("description", config.description, "name");
    upsertMeta("og:title", config.ogTitle ?? fullTitle, "property");
    upsertMeta("og:description", config.ogDescription ?? config.description, "property");
    upsertMeta("og:type", config.ogType ?? "article", "property");
    upsertMeta("og:site_name", SITE_NAME, "property");

    const url = config.canonical ?? window.location.href;
    upsertMeta("og:url", url, "property");
    upsertLink("canonical", url);

    const ogImage = config.ogImage ?? DEFAULT_OG_IMAGE;
    if (ogImage) {
      upsertMeta("og:image", ogImage, "property");
      upsertMeta("twitter:image", ogImage, "name");
    }

    upsertMeta("twitter:card", "summary_large_image", "name");
    upsertMeta("twitter:title", config.ogTitle ?? fullTitle, "name");
    upsertMeta("twitter:description", config.ogDescription ?? config.description, "name");

    if (config.articlePublishedTime) {
      upsertMeta("article:published_time", config.articlePublishedTime, "property");
    }
    if (config.articleTags?.length) {
      config.articleTags.forEach((tag) => {
        upsertMeta("article:tag", tag, "property");
      });
    }

    if (config.jsonLd) {
      upsertJsonLd("seo-structured-data", config.jsonLd);
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
      if (config.articleTags?.length) {
        config.articleTags.forEach((tag) => {
          removeMeta("article:tag", "property");
        });
      }
      removeLink("canonical");
      if (config.jsonLd) {
        removeJsonLd("seo-structured-data");
      }
    };
  }, [config]);

  return null;
};

export default SeoHead;
