import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { buildLocalizedPath, stripLanguagePrefix } from "@/lib/routing";
import {
  DEFAULT_SEO_IMAGE,
  SITE_URL,
  htmlLangByLanguage,
  ogLocaleByLanguage,
  siteNameByLanguage,
  toAbsoluteUrl,
} from "@/lib/seo";
import type { Language } from "@/lib/translations";

type StructuredData = Record<string, unknown>;

type SeoProps = {
  title: string;
  description: string;
  image?: string | null;
  type?: "website" | "article";
  noIndex?: boolean;
  keywords?: string[];
  pathname?: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string | null;
  structuredData?: StructuredData | StructuredData[];
};

const managedSelector = "[data-seo-managed='true']";

const localeAlternates: Array<{ language: Language; hreflang: string }> = [
  { language: "ka", hreflang: "ka-GE" },
  { language: "en", hreflang: "en" },
  { language: "ru", hreflang: "ru" },
];

const ensureNamedMeta = (name: string, content: string) => {
  let element = document.head.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute("name", name);
    document.head.appendChild(element);
  }

  element.setAttribute("content", content);
};

const appendManagedMeta = (attribute: "name" | "property", key: string, content: string) => {
  const element = document.createElement("meta");
  element.setAttribute(attribute, key);
  element.setAttribute("content", content);
  element.setAttribute("data-seo-managed", "true");
  document.head.appendChild(element);
};

const appendManagedLink = (rel: string, href: string, extraAttributes: Record<string, string> = {}) => {
  const element = document.createElement("link");
  element.setAttribute("rel", rel);
  element.setAttribute("href", href);
  element.setAttribute("data-seo-managed", "true");

  Object.entries(extraAttributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });

  document.head.appendChild(element);
};

const appendManagedScript = (payload: StructuredData) => {
  const element = document.createElement("script");
  element.setAttribute("type", "application/ld+json");
  element.setAttribute("data-seo-managed", "true");
  element.textContent = JSON.stringify(payload);
  document.head.appendChild(element);
};

export const Seo = ({
  title,
  description,
  image,
  type = "website",
  noIndex = false,
  keywords = [],
  pathname,
  publishedTime,
  modifiedTime,
  author,
  structuredData,
}: SeoProps) => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    const relativePath = pathname ?? stripLanguagePrefix(location.pathname);
    const canonicalPath = buildLocalizedPath(language, relativePath);
    const canonicalUrl = `${SITE_URL}${canonicalPath}`;
    const imageUrl = toAbsoluteUrl(image) ?? DEFAULT_SEO_IMAGE;
    const siteName = siteNameByLanguage[language];

    document.documentElement.lang = htmlLangByLanguage[language];
    document.title = title;

    ensureNamedMeta("description", description);
    ensureNamedMeta("author", author ?? siteName);
    ensureNamedMeta("application-name", siteName);
    ensureNamedMeta("apple-mobile-web-app-title", siteName);
    ensureNamedMeta("robots", noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large");
    ensureNamedMeta("referrer", "strict-origin-when-cross-origin");

    if (keywords.length > 0) {
      ensureNamedMeta("keywords", keywords.join(", "));
    } else {
      document.head.querySelector("meta[name='keywords']")?.remove();
    }

    document.head.querySelectorAll(managedSelector).forEach((element) => element.remove());

    appendManagedLink("canonical", canonicalUrl);
    appendManagedLink("alternate", `${SITE_URL}${buildLocalizedPath("ka", relativePath)}`, { hreflang: "x-default" });

    localeAlternates.forEach((locale) => {
      appendManagedLink("alternate", `${SITE_URL}${buildLocalizedPath(locale.language, relativePath)}`, {
        hreflang: locale.hreflang,
      });
    });

    appendManagedMeta("property", "og:title", title);
    appendManagedMeta("property", "og:description", description);
    appendManagedMeta("property", "og:type", type);
    appendManagedMeta("property", "og:url", canonicalUrl);
    appendManagedMeta("property", "og:image", imageUrl);
    appendManagedMeta("property", "og:image:secure_url", imageUrl);
    appendManagedMeta("property", "og:site_name", siteName);
    appendManagedMeta("property", "og:locale", ogLocaleByLanguage[language]);

    localeAlternates
      .filter((locale) => locale.language !== language)
      .forEach((locale) => {
        appendManagedMeta("property", "og:locale:alternate", ogLocaleByLanguage[locale.language]);
      });

    appendManagedMeta("name", "twitter:card", "summary_large_image");
    appendManagedMeta("name", "twitter:title", title);
    appendManagedMeta("name", "twitter:description", description);
    appendManagedMeta("name", "twitter:url", canonicalUrl);
    appendManagedMeta("name", "twitter:image", imageUrl);
    appendManagedMeta("name", "twitter:image:alt", title);

    if (type === "article" && publishedTime) {
      appendManagedMeta("property", "article:published_time", publishedTime);
      appendManagedMeta("property", "article:modified_time", modifiedTime ?? publishedTime);
    }

    const payloads = Array.isArray(structuredData)
      ? structuredData
      : structuredData
        ? [structuredData]
        : [];

    payloads.forEach((payload) => appendManagedScript(payload));
  }, [
    author,
    description,
    image,
    keywords,
    language,
    location.pathname,
    modifiedTime,
    noIndex,
    pathname,
    publishedTime,
    structuredData,
    title,
    type,
  ]);

  return null;
};
