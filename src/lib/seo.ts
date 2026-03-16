import { buildLocalizedPath } from "@/lib/routing";
import type { Language } from "@/lib/translations";

type BreadcrumbItem = {
  name: string;
  path: string;
};

type WebPageStructuredDataInput = {
  language: Language;
  path: string;
  title: string;
  description: string;
  type?: string;
  image?: string | null;
};

type ArticleStructuredDataInput = {
  language: Language;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  authorName?: string | null;
};

type OrganizationContact = {
  phone: string;
  email: string;
  addressValue: string;
  facebookUrl?: string;
  instagramUrl?: string;
};

const siteUrlFromEnv = (typeof import.meta !== "undefined" ? import.meta.env?.VITE_SITE_URL : undefined) as
  | string
  | undefined;

export const SITE_URL = (siteUrlFromEnv ?? "https://busterminal.ge").replace(/\/$/, "");

export const DEFAULT_SEO_IMAGE = `${SITE_URL}/facebook-cover-banner.png`;

export const siteNameByLanguage: Record<Language, string> = {
  en: "Tbilisi Central Bus Terminal",
  ka: "თბილისის ცენტრალური ავტოსადგური",
  ru: "Тбилисский центральный автовокзал",
};

export const ogLocaleByLanguage: Record<Language, string> = {
  en: "en_US",
  ka: "ka_GE",
  ru: "ru_RU",
};

export const htmlLangByLanguage: Record<Language, string> = {
  en: "en",
  ka: "ka",
  ru: "ru",
};

export const normalizeSeoText = (value?: string | null) =>
  (value ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const truncateSeoText = (value?: string | null, maxLength = 165) => {
  const normalized = normalizeSeoText(value);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

export const toAbsoluteUrl = (value?: string | null) => {
  if (!value) {
    return undefined;
  }

  if (/^https?:\/\//.test(value)) {
    return value;
  }

  const normalized = value.startsWith("/") ? value : `/${value}`;

  return `${SITE_URL}${normalized}`;
};

export const buildLocalizedAbsoluteUrl = (language: Language, path: string) =>
  toAbsoluteUrl(buildLocalizedPath(language, path)) ?? SITE_URL;

export const buildBreadcrumbStructuredData = (language: Language, items: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildLocalizedAbsoluteUrl(language, item.path),
  })),
});

export const buildWebPageStructuredData = ({
  language,
  path,
  title,
  description,
  type = "WebPage",
  image,
}: WebPageStructuredDataInput) => ({
  "@context": "https://schema.org",
  "@type": type,
  name: title,
  description,
  inLanguage: htmlLangByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, path),
  image: toAbsoluteUrl(image) ?? DEFAULT_SEO_IMAGE,
  isPartOf: {
    "@type": "WebSite",
    name: siteNameByLanguage[language],
    url: buildLocalizedAbsoluteUrl(language, "/"),
  },
});

export const buildWebsiteStructuredData = (language: Language) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteNameByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, "/"),
  inLanguage: htmlLangByLanguage[language],
  image: DEFAULT_SEO_IMAGE,
});

export const buildOrganizationStructuredData = (language: Language, contact: OrganizationContact) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteNameByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, "/"),
  logo: `${SITE_URL}/brand/busterminal-logo.png`,
  image: DEFAULT_SEO_IMAGE,
  telephone: contact.phone,
  email: contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: contact.addressValue,
    addressLocality: "Tbilisi",
    addressCountry: "GE",
  },
  sameAs: [contact.facebookUrl, contact.instagramUrl].filter(Boolean),
});

export const buildArticleStructuredData = ({
  language,
  path,
  title,
  description,
  image,
  publishedTime,
  modifiedTime,
  authorName,
}: ArticleStructuredDataInput) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: title,
  description,
  inLanguage: htmlLangByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, path),
  image: toAbsoluteUrl(image) ?? DEFAULT_SEO_IMAGE,
  datePublished: publishedTime ?? undefined,
  dateModified: modifiedTime ?? publishedTime ?? undefined,
  author: authorName
    ? {
        "@type": "Person",
        name: authorName,
      }
    : undefined,
  publisher: {
    "@type": "Organization",
    name: siteNameByLanguage[language],
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/brand/busterminal-logo.png`,
    },
  },
});
