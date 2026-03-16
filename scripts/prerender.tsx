import fs from "node:fs/promises";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dehydrate, QueryClient } from "@tanstack/react-query";

type Language = "ka" | "en" | "ru";

type ExportPage = {
  id: string;
  slug: string;
  pageType: string;
  routePath?: string | null;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoImageUrl?: string | null;
  noIndex: boolean;
  showInNavigation: boolean;
};

type ExportBlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  authorName: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoImageUrl?: string | null;
  noIndex: boolean;
};

type ExportPartner = {
  id: string;
  name: string;
  description: string;
  routes: string;
  website: string;
  logoUrl?: string | null;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoImageUrl?: string | null;
  noIndex?: boolean;
};

type ExportHomepage = {
  hero: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    location: string;
    stats: Array<{ value: string; label: string }>;
  };
  about: {
    badge: string;
    title1: string;
    title2: string;
    description: string;
    stats: Array<{ value: string; label: string }>;
    gallery: Array<{ src: string; alt: string }>;
    features: Array<{ title: string; description: string }>;
  };
  routes: Array<{
    id: string;
    routeType: "domestic" | "international";
    city: string;
    country?: string | null;
    duration?: string | null;
    priceFrom?: string | null;
    providers: Array<{ name: string; url: string }>;
    showInFooter?: boolean;
  }>;
  partners: ExportPartner[];
  leadershipMembers: Array<{
    id: string;
    name: string;
    role: string;
    phone: string;
    linkedin?: string | null;
    whatsappEnabled?: boolean;
  }>;
  contact: {
    badge?: string;
    title1: string;
    title2: string;
    description: string;
    addressLabel?: string;
    addressValue: string;
    addressNote?: string;
    phoneLabel?: string;
    phone: string;
    emailLabel?: string;
    email: string;
    hoursLabel?: string;
    terminalLabel?: string;
    terminalHours?: string;
    infoDeskLabel?: string;
    infoDeskHours?: string;
    facebookUrl?: string;
    instagramUrl?: string;
  };
  footer: {
    description: string;
    popularRoutes?: string[];
    privacyLabel?: string;
    termsLabel?: string;
  };
  navigationPages: Array<{ id: string; slug: string; path: string; label: string }>;
};

type ExportLanguageData = {
  homepage: ExportHomepage;
  pages: ExportPage[];
  blogPosts: ExportBlogPost[];
  schedules: Array<{
    time: string;
    destination: string;
    operator: string;
    source?: string;
    buyTicketUrl: string;
  }>;
};

type ExportPayload = {
  generatedAt: string;
  languages: Record<Language, ExportLanguageData>;
};

type RenderRoute = {
  routePath: string;
  relativePath: string;
  language: Language;
  title: string;
  description: string;
  image?: string | null;
  keywords: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  author?: string | null;
  publishedTime?: string | null;
  lastModified?: string | null;
  changeFreq?: "daily" | "weekly" | "monthly";
  priority?: number;
  feedPath?: string;
  querySetup: (queryClient: QueryClient) => void;
  breadcrumbs: Array<{ name: string; path: string }>;
  structuredData?: Array<Record<string, unknown>>;
  bodyHtml: string;
  redirectSources?: string[];
};

type Copy = {
  readMore: string;
  officialWebsite: string;
  quickLinks: string;
  popularRoutes: string;
  contact: string;
  address: string;
  phone: string;
  email: string;
  terminalHours: string;
  infoDeskHours: string;
  routes: string;
  schedule: string;
  time: string;
  destination: string;
  operator: string;
  ticket: string;
  viewSchedule: string;
  viewDestinations: string;
  explorePartners: string;
  allPartners: string;
  allPosts: string;
  backToBlog: string;
  backToPartners: string;
  publishedOn: string;
  byAuthor: string;
  keyDestinations: string;
  servicePartners: string;
  managementTeam: string;
  imageGallery: string;
  relatedPosts: string;
  categoryDomestic: string;
  categoryInternational: string;
  noPosts: string;
  noCustomContent: string;
  indexingNote: string;
  homepageTitle: string;
  notFoundTitle: string;
  notFoundDescription: string;
  exploreSite: string;
  redirecting: string;
  location: string;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const backendRoot = path.join(repoRoot, "backend");
const distRoot = path.join(repoRoot, "dist");
const siteUrl = (process.env.VITE_SITE_URL ?? "https://busterminal.ge").replace(/\/$/, "");
const defaultSeoImage = `${siteUrl}/facebook-cover-banner.png`;
const languages: Language[] = ["ka", "en", "ru"];
const languagePrefix: Record<Language, string> = {
  ka: "/ge",
  en: "/en",
  ru: "/ru",
};
const localeCode: Record<Language, string> = {
  ka: "ka-GE",
  en: "en-US",
  ru: "ru-RU",
};
const htmlLangByLanguage: Record<Language, string> = {
  ka: "ka",
  en: "en",
  ru: "ru",
};
const ogLocaleByLanguage: Record<Language, string> = {
  ka: "ka_GE",
  en: "en_US",
  ru: "ru_RU",
};
const siteNameByLanguage: Record<Language, string> = {
  ka: "თბილისის ცენტრალური ავტოსადგური",
  en: "Tbilisi Central Bus Terminal",
  ru: "Тбилисский центральный автовокзал",
};

const copyByLanguage: Record<Language, Copy> = {
  ka: {
    readMore: "სრულად",
    officialWebsite: "ოფიციალური ვებსაიტი",
    quickLinks: "სწრაფი ბმულები",
    popularRoutes: "პოპულარული მიმართულებები",
    contact: "კონტაქტი",
    address: "მისამართი",
    phone: "ტელეფონი",
    email: "ელფოსტა",
    terminalHours: "ტერმინალის სამუშაო დრო",
    infoDeskHours: "საინფორმაციო ცენტრი",
    routes: "მიმართულებები",
    schedule: "განრიგი",
    time: "დრო",
    destination: "მიმართულება",
    operator: "ოპერატორი",
    ticket: "ბილეთი",
    viewSchedule: "განრიგის ნახვა",
    viewDestinations: "მიმართულებების ნახვა",
    explorePartners: "პარტნიორების ნახვა",
    allPartners: "ყველა პარტნიორი",
    allPosts: "ყველა პოსტი",
    backToBlog: "ბლოგზე დაბრუნება",
    backToPartners: "პარტნიორებზე დაბრუნება",
    publishedOn: "გამოქვეყნდა",
    byAuthor: "ავტორი",
    keyDestinations: "ძირითადი მიმართულებები",
    servicePartners: "სანდო სატრანსპორტო პარტნიორები",
    managementTeam: "ხელმძღვანელობა",
    imageGallery: "ფოტო გალერეა",
    relatedPosts: "მსგავსი პოსტები",
    categoryDomestic: "შიდა მარშრუტები",
    categoryInternational: "საერთაშორისო მარშრუტები",
    noPosts: "ბლოგ პოსტები ჯერ არ არის დამატებული.",
    noCustomContent: "ამ გვერდისთვის დამატებითი კონტენტი ჯერ არ არის შევსებული.",
    indexingNote: "ეს გვერდი ხელმისაწვდომია search engine-ებისთვის სრულად prerendered HTML-ით.",
    homepageTitle: "მთავარი გვერდი",
    notFoundTitle: "გვერდი ვერ მოიძებნა",
    notFoundDescription: "მოთხოვნილი გვერდი აღარ არსებობს ან მისამართი შეიცვალა.",
    exploreSite: "საიტის დათვალიერება",
    redirecting: "გადამისამართება",
    location: "ლოკაცია",
  },
  en: {
    readMore: "Read more",
    officialWebsite: "Official website",
    quickLinks: "Quick links",
    popularRoutes: "Popular routes",
    contact: "Contact",
    address: "Address",
    phone: "Phone",
    email: "Email",
    terminalHours: "Terminal hours",
    infoDeskHours: "Information desk",
    routes: "Routes",
    schedule: "Schedule",
    time: "Time",
    destination: "Destination",
    operator: "Operator",
    ticket: "Ticket",
    viewSchedule: "View schedule",
    viewDestinations: "View destinations",
    explorePartners: "Explore partners",
    allPartners: "All partners",
    allPosts: "All posts",
    backToBlog: "Back to blog",
    backToPartners: "Back to partners",
    publishedOn: "Published",
    byAuthor: "Author",
    keyDestinations: "Key destinations",
    servicePartners: "Trusted transport partners",
    managementTeam: "Leadership team",
    imageGallery: "Image gallery",
    relatedPosts: "Related posts",
    categoryDomestic: "Domestic routes",
    categoryInternational: "International routes",
    noPosts: "No blog posts have been published yet.",
    noCustomContent: "Additional content has not been added for this page yet.",
    indexingNote: "This page is fully prerendered for search engines.",
    homepageTitle: "Homepage",
    notFoundTitle: "Page not found",
    notFoundDescription: "The page you requested no longer exists or its URL has changed.",
    exploreSite: "Explore the site",
    redirecting: "Redirecting",
    location: "Location",
  },
  ru: {
    readMore: "Читать",
    officialWebsite: "Официальный сайт",
    quickLinks: "Быстрые ссылки",
    popularRoutes: "Популярные направления",
    contact: "Контакты",
    address: "Адрес",
    phone: "Телефон",
    email: "Email",
    terminalHours: "Часы работы терминала",
    infoDeskHours: "Справочная",
    routes: "Маршруты",
    schedule: "Расписание",
    time: "Время",
    destination: "Направление",
    operator: "Оператор",
    ticket: "Билет",
    viewSchedule: "Смотреть расписание",
    viewDestinations: "Смотреть направления",
    explorePartners: "Смотреть партнёров",
    allPartners: "Все партнёры",
    allPosts: "Все посты",
    backToBlog: "Назад к блогу",
    backToPartners: "Назад к партнёрам",
    publishedOn: "Опубликовано",
    byAuthor: "Автор",
    keyDestinations: "Основные направления",
    servicePartners: "Надёжные транспортные партнёры",
    managementTeam: "Руководство",
    imageGallery: "Галерея",
    relatedPosts: "Похожие публикации",
    categoryDomestic: "Внутренние маршруты",
    categoryInternational: "Международные маршруты",
    noPosts: "Публикаций в блоге пока нет.",
    noCustomContent: "Для этой страницы дополнительный контент пока не заполнен.",
    indexingNote: "Эта страница полностью prerendered для поисковых систем.",
    homepageTitle: "Главная страница",
    notFoundTitle: "Страница не найдена",
    notFoundDescription: "Запрошенная страница больше не существует или её адрес изменился.",
    exploreSite: "Перейти по сайту",
    redirecting: "Переадресация",
    location: "Локация",
  },
};

const leadershipRoleLabels: Record<Language, Record<string, string>> = {
  ka: {
    chairman: "თავმჯდომარე",
    deputyChairman: "თავმჯდომარის მოადგილე",
    ceo: "გენერალური დირექტორი",
    deputyCeo: "გენერალური დირექტორის მოადგილე",
    coo: "ოპერაციების დირექტორი",
    chiefAccountant: "მთავარი ბუღალტერი",
  },
  en: {
    chairman: "Chairman",
    deputyChairman: "Deputy Chairman",
    ceo: "CEO",
    deputyCeo: "Deputy CEO",
    coo: "COO",
    chiefAccountant: "Chief Accountant",
  },
  ru: {
    chairman: "Председатель",
    deputyChairman: "Заместитель председателя",
    ceo: "Генеральный директор",
    deputyCeo: "Заместитель генерального директора",
    coo: "Операционный директор",
    chiefAccountant: "Главный бухгалтер",
  },
};

const systemPageLabels: Record<Language, Record<string, string>> = {
  ka: {
    about: "ჩვენს შესახებ",
    destinations: "მიმართულებები და ბილეთები",
    schedule: "განრიგი",
    partners: "ჩვენი პარტნიორები",
    leadership: "ხელმძღვანელობა",
    contact: "კონტაქტი",
    blog: "ბლოგი",
  },
  en: {
    about: "About Us",
    destinations: "Destinations & Tickets",
    schedule: "Schedule",
    partners: "Our Partners",
    leadership: "Leadership",
    contact: "Contact",
    blog: "Blog",
  },
  ru: {
    about: "О нас",
    destinations: "Направления и билеты",
    schedule: "Расписание",
    partners: "Наши партнёры",
    leadership: "Руководство",
    contact: "Контакты",
    blog: "Блог",
  },
};

const getCopy = (language: Language) => copyByLanguage[language];

const normalizePath = (value = "/") => {
  if (!value) {
    return "/";
  }

  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  if (withLeadingSlash.length > 1 && withLeadingSlash.endsWith("/")) {
    return withLeadingSlash.replace(/\/+$/, "");
  }

  return withLeadingSlash;
};

const buildLocalizedPath = (language: Language, value = "/") => {
  const normalized = normalizePath(value);
  return normalized === "/" ? languagePrefix[language] : `${languagePrefix[language]}${normalized}`;
};

const buildAbsoluteUrl = (value: string) => `${siteUrl}${normalizePath(value)}`;
const buildLocalizedAbsoluteUrl = (language: Language, value = "/") => buildAbsoluteUrl(buildLocalizedPath(language, value));

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripHtml = (value?: string | null) =>
  (value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const truncateText = (value?: string | null, maxLength = 165) => {
  const normalized = stripHtml(value);
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

const replaceLocalHostUrls = (value: string) =>
  value.replace(/https?:\/\/(?:127\.0\.0\.1|localhost)(?::\d+)?(\/[^\s"'<>]*)/gi, (_match, pathname: string) => {
    return `${siteUrl}${pathname}`;
  });

const normalizeSeoPayload = <T,>(value: T): T => {
  if (typeof value === "string") {
    return replaceLocalHostUrls(value) as T;
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeSeoPayload(item)) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, normalizeSeoPayload(item)]),
    ) as T;
  }

  return value;
};

const rewriteHostedUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }

  if (/^https?:\/\//i.test(value)) {
    try {
      const url = new URL(value);

      if (url.hostname === "127.0.0.1" || url.hostname === "localhost") {
        return `${siteUrl}${url.pathname}${url.search}`;
      }
    } catch {
      return value;
    }

    return value;
  }

  if (value.startsWith("/")) {
    return normalizePath(value);
  }

  return value;
};

const sanitizeRichHtml = (value?: string | null) =>
  replaceLocalHostUrls(value ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?<\/object>/gi, "")
    .replace(/ on[a-z]+="[^"]*"/gi, "")
    .replace(/ on[a-z]+='[^']*'/gi, "")
    .replace(/ on[a-z]+=[^\s>]+/gi, "")
    .replace(/javascript:/gi, "");

const renderRichText = (value?: string | null, fallbackMessage?: string) => {
  const sanitized = sanitizeRichHtml(value).trim();

  if (!sanitized) {
    return fallbackMessage ? `<p>${escapeHtml(fallbackMessage)}</p>` : "";
  }

  if (/<[a-z][\s\S]*>/i.test(sanitized)) {
    return sanitized;
  }

  return sanitized
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`)
    .join("");
};

const safeUrl = (value?: string | null) => {
  if (!value) {
    return "";
  }

  const normalized = rewriteHostedUrl(value);

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return normalizePath(normalized);
};

const toAbsoluteUrl = (value?: string | null) => {
  if (!value) {
    return defaultSeoImage;
  }

  const normalized = rewriteHostedUrl(value);

  if (/^https?:\/\//i.test(normalized)) {
    return normalized;
  }

  return buildAbsoluteUrl(normalized);
};

const formatDate = (value: string, language: Language) =>
  new Intl.DateTimeFormat(localeCode[language], {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));

const dedupe = <T,>(items: T[]) => Array.from(new Set(items));

const renderList = (items: string[], className = "seo-prerender-inline-list") =>
  items.length ? `<ul class="${className}">${items.map((item) => `<li>${item}</li>`).join("")}</ul>` : "";

const renderBreadcrumbsHtml = (language: Language, items: Array<{ name: string; path: string }>) => `
  <nav class="seo-prerender-breadcrumbs" aria-label="Breadcrumb">
    <ol>
      ${items
        .map(
          (item, index) => `
            <li>
              ${
                index === items.length - 1
                  ? `<span>${escapeHtml(item.name)}</span>`
                  : `<a href="${buildLocalizedPath(language, item.path)}">${escapeHtml(item.name)}</a>`
              }
            </li>`,
        )
        .join("")}
    </ol>
  </nav>`;

const renderStats = (stats: Array<{ value: string; label: string }>) =>
  stats.length
    ? `<div class="seo-prerender-grid">${stats
        .map(
          (stat) => `
            <article class="seo-prerender-card seo-prerender-stat">
              <strong>${escapeHtml(stat.value)}</strong>
              <span>${escapeHtml(stat.label)}</span>
            </article>`,
        )
        .join("")}</div>`
    : "";

const renderHeroSection = (
  homepage: ExportHomepage,
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => {
  const copy = getCopy(language);
  const destinationsPath = pagesBySlug.get("destinations")?.routePath ?? "/destinations";
  const schedulePath = pagesBySlug.get("schedule")?.routePath ?? "/schedule";

  return `
    <section class="seo-prerender-section seo-prerender-hero">
      <p class="seo-prerender-kicker">${escapeHtml(homepage.hero.badge)}</p>
      <h1>${escapeHtml(`${homepage.hero.title1} ${homepage.hero.title2}`.trim())}</h1>
      <div class="seo-prerender-prose">
        ${renderRichText(homepage.hero.description)}
      </div>
      <p class="seo-prerender-location"><strong>${escapeHtml(copy.location)}:</strong> ${escapeHtml(homepage.hero.location)}</p>
      <div class="seo-prerender-actions">
        <a class="seo-prerender-button" href="${buildLocalizedPath(language, destinationsPath)}">${escapeHtml(copy.viewDestinations)}</a>
        <a class="seo-prerender-button seo-prerender-button-muted" href="${buildLocalizedPath(language, schedulePath)}">${escapeHtml(copy.viewSchedule)}</a>
      </div>
      ${renderStats(homepage.hero.stats)}
    </section>`;
};

const renderAboutPreview = (
  homepage: ExportHomepage,
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => {
  const aboutTitle = pagesBySlug.get("about")?.title || `${homepage.about.title1} ${homepage.about.title2}`.trim();
  const aboutPath = pagesBySlug.get("about")?.routePath ?? "/about";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <div>
          <p class="seo-prerender-kicker">${escapeHtml(homepage.about.badge)}</p>
          <h2>${escapeHtml(aboutTitle)}</h2>
        </div>
        <a href="${buildLocalizedPath(language, aboutPath)}">${escapeHtml(aboutTitle)}</a>
      </div>
      <div class="seo-prerender-prose">
        ${renderRichText(homepage.about.description)}
      </div>
      ${renderStats(homepage.about.stats)}
      ${
        homepage.about.features.length
          ? `<div class="seo-prerender-grid">${homepage.about.features
              .map(
                (feature) => `
                  <article class="seo-prerender-card">
                    <h3>${escapeHtml(feature.title)}</h3>
                    <p>${escapeHtml(feature.description)}</p>
                  </article>`,
              )
              .join("")}</div>`
          : ""
      }
    </section>`;
};

const renderRoutesPreview = (
  homepage: ExportHomepage,
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => {
  const copy = getCopy(language);
  const destinationsPage = pagesBySlug.get("destinations");
  const destinationsTitle = destinationsPage?.title || copy.routes;
  const destinationsPath = destinationsPage?.routePath ?? "/destinations";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <h2>${escapeHtml(destinationsTitle)}</h2>
        <a href="${buildLocalizedPath(language, destinationsPath)}">${escapeHtml(copy.viewDestinations)}</a>
      </div>
      <div class="seo-prerender-list">
        ${homepage.routes
          .slice(0, 12)
          .map((route) => {
            const meta = [route.country, route.duration, route.priceFrom].filter(Boolean).join(" • ");
            const providers = route.providers
              .map((provider) => `<a href="${escapeHtml(safeUrl(provider.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(provider.name)}</a>`)
              .join(" · ");

            return `
              <article class="seo-prerender-card">
                <h3>${escapeHtml(route.city)}</h3>
                ${meta ? `<p>${escapeHtml(meta)}</p>` : ""}
                ${providers ? `<p>${providers}</p>` : ""}
              </article>`;
          })
          .join("")}
      </div>
    </section>`;
};

const renderSchedulePreview = (
  schedules: ExportLanguageData["schedules"],
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => {
  const copy = getCopy(language);
  const schedulePage = pagesBySlug.get("schedule");
  const scheduleTitle = schedulePage?.title || copy.schedule;
  const schedulePath = schedulePage?.routePath ?? "/schedule";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <h2>${escapeHtml(scheduleTitle)}</h2>
        <a href="${buildLocalizedPath(language, schedulePath)}">${escapeHtml(copy.viewSchedule)}</a>
      </div>
      <div class="seo-prerender-table-wrap">
        <table class="seo-prerender-table">
          <thead>
            <tr>
              <th>${escapeHtml(copy.time)}</th>
              <th>${escapeHtml(copy.destination)}</th>
              <th>${escapeHtml(copy.operator)}</th>
              <th>${escapeHtml(copy.ticket)}</th>
            </tr>
          </thead>
          <tbody>
            ${schedules
              .slice(0, 8)
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(row.time)}</td>
                    <td>${escapeHtml(row.destination)}</td>
                    <td>${escapeHtml(row.operator)}</td>
                    <td>${
                      row.buyTicketUrl
                        ? `<a href="${escapeHtml(safeUrl(row.buyTicketUrl))}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.ticket)}</a>`
                        : ""
                    }</td>
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
    </section>`;
};

const renderPartnersPreview = (
  homepage: ExportHomepage,
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => {
  const copy = getCopy(language);
  const partnersPage = pagesBySlug.get("partners");
  const partnersTitle = partnersPage?.title || copy.servicePartners;
  const partnersPath = partnersPage?.routePath ?? "/partners";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <h2>${escapeHtml(partnersTitle)}</h2>
        <a href="${buildLocalizedPath(language, partnersPath)}">${escapeHtml(copy.explorePartners)}</a>
      </div>
      <div class="seo-prerender-list">
        ${homepage.partners
          .map((partner) => {
            const detailPath = `/partners/${normalizePartnerSlug(partner)}`;
            const routeList = parsePartnerRoutes(partner.routes);
            return `
              <article class="seo-prerender-card">
                <h3><a href="${buildLocalizedPath(language, detailPath)}">${escapeHtml(partner.name)}</a></h3>
                <p>${escapeHtml(truncateText(partner.description, 220))}</p>
                ${routeList.length ? renderList(routeList.map((route) => escapeHtml(route))) : ""}
              </article>`;
          })
          .join("")}
      </div>
    </section>`;
};

const renderLeadershipPreview = (homepage: ExportHomepage, language: Language, pagesBySlug: Map<string, ExportPage>) => {
  const copy = getCopy(language);
  const leadershipPage = pagesBySlug.get("leadership");
  const title = leadershipPage?.title || copy.managementTeam;
  const leadershipPath = leadershipPage?.routePath ?? "/leadership";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <h2>${escapeHtml(title)}</h2>
        <a href="${buildLocalizedPath(language, leadershipPath)}">${escapeHtml(title)}</a>
      </div>
      <div class="seo-prerender-list">
        ${homepage.leadershipMembers
          .map((member) => `
            <article class="seo-prerender-card">
              <h3>${escapeHtml(member.name)}</h3>
              <p>${escapeHtml(leadershipRoleLabels[language][member.role] ?? member.role)}</p>
              <p><a href="tel:${escapeHtml(member.phone.replace(/\s/g, ""))}">${escapeHtml(member.phone)}</a></p>
            </article>`)
          .join("")}
      </div>
    </section>`;
};

const renderContactPreview = (homepage: ExportHomepage, language: Language, pagesBySlug: Map<string, ExportPage>) => {
  const copy = getCopy(language);
  const contactPage = pagesBySlug.get("contact");
  const title = contactPage?.title || copy.contact;
  const contactPath = contactPage?.routePath ?? "/contact";

  return `
    <section class="seo-prerender-section">
      <div class="seo-prerender-section-head">
        <h2>${escapeHtml(title)}</h2>
        <a href="${buildLocalizedPath(language, contactPath)}">${escapeHtml(title)}</a>
      </div>
      <div class="seo-prerender-grid">
        <article class="seo-prerender-card">
          <h3>${escapeHtml(copy.address)}</h3>
          <p>${escapeHtml(homepage.contact.addressValue)}</p>
          ${homepage.contact.addressNote ? `<p>${escapeHtml(homepage.contact.addressNote)}</p>` : ""}
        </article>
        <article class="seo-prerender-card">
          <h3>${escapeHtml(copy.phone)}</h3>
          <p><a href="tel:${escapeHtml(homepage.contact.phone.replace(/\s/g, ""))}">${escapeHtml(homepage.contact.phone)}</a></p>
        </article>
        <article class="seo-prerender-card">
          <h3>${escapeHtml(copy.email)}</h3>
          <p><a href="mailto:${escapeHtml(homepage.contact.email)}">${escapeHtml(homepage.contact.email)}</a></p>
        </article>
      </div>
    </section>`;
};

const renderHomeBody = (
  homepage: ExportHomepage,
  schedules: ExportLanguageData["schedules"],
  language: Language,
  pagesBySlug: Map<string, ExportPage>,
) => `
  ${renderHeroSection(homepage, language, pagesBySlug)}
  ${renderAboutPreview(homepage, language, pagesBySlug)}
  ${renderRoutesPreview(homepage, language, pagesBySlug)}
  ${renderSchedulePreview(schedules, language, pagesBySlug)}
  ${renderPartnersPreview(homepage, language, pagesBySlug)}
  ${renderLeadershipPreview(homepage, language, pagesBySlug)}
  ${renderContactPreview(homepage, language, pagesBySlug)}
`;

const renderPageIntro = (page: ExportPage, descriptionFallback = "") => `
  <section class="seo-prerender-section seo-prerender-intro">
    <h1>${escapeHtml(page.title)}</h1>
    ${
      page.excerpt
        ? `<div class="seo-prerender-prose">${renderRichText(page.excerpt)}</div>`
        : descriptionFallback
          ? `<p>${escapeHtml(descriptionFallback)}</p>`
          : ""
    }
    ${page.content ? `<div class="seo-prerender-prose">${renderRichText(page.content)}</div>` : ""}
  </section>
`;

const renderAboutPageBody = (page: ExportPage, homepage: ExportHomepage, language: Language) => {
  const copy = getCopy(language);
  return `
    ${renderPageIntro(page)}
    <section class="seo-prerender-section">
      <h2>${escapeHtml(`${homepage.about.title1} ${homepage.about.title2}`.trim())}</h2>
      <div class="seo-prerender-prose">${renderRichText(homepage.about.description)}</div>
      ${renderStats(homepage.about.stats)}
      ${
        homepage.about.features.length
          ? `<div class="seo-prerender-grid">${homepage.about.features
              .map(
                (feature) => `
                  <article class="seo-prerender-card">
                    <h3>${escapeHtml(feature.title)}</h3>
                    <p>${escapeHtml(feature.description)}</p>
                  </article>`,
              )
              .join("")}</div>`
          : ""
      }
    </section>
    ${
      homepage.about.gallery.length
        ? `<section class="seo-prerender-section">
            <h2>${escapeHtml(copy.imageGallery)}</h2>
            <div class="seo-prerender-list">
              ${homepage.about.gallery
                .map(
                  (image) => `
                    <figure class="seo-prerender-card">
                      <img src="${escapeHtml(safeUrl(image.src))}" alt="${escapeHtml(image.alt)}" loading="lazy" />
                      <figcaption>${escapeHtml(image.alt)}</figcaption>
                    </figure>`,
                )
                .join("")}
            </div>
          </section>`
        : ""
    }
  `;
};

const renderDestinationsPageBody = (page: ExportPage, homepage: ExportHomepage, language: Language) => {
  const copy = getCopy(language);
  const domestic = homepage.routes.filter((route) => route.routeType === "domestic");
  const international = homepage.routes.filter((route) => route.routeType === "international");
  const renderRouteGroup = (title: string, routes: ExportHomepage["routes"]) =>
    routes.length
      ? `
        <section class="seo-prerender-section">
          <h2>${escapeHtml(title)}</h2>
          <div class="seo-prerender-list">
            ${routes
              .map((route) => `
                <article class="seo-prerender-card">
                  <h3>${escapeHtml(route.city)}</h3>
                  <p>${escapeHtml([route.country, route.duration, route.priceFrom].filter(Boolean).join(" • "))}</p>
                  ${
                    route.providers.length
                      ? `<p>${route.providers
                          .map((provider) => `<a href="${escapeHtml(safeUrl(provider.url))}" target="_blank" rel="noopener noreferrer">${escapeHtml(provider.name)}</a>`)
                          .join(" · ")}</p>`
                      : ""
                  }
                </article>`)
              .join("")}
          </div>
        </section>`
      : "";

  return `
    ${renderPageIntro(page)}
    ${renderRouteGroup(copy.categoryDomestic, domestic)}
    ${renderRouteGroup(copy.categoryInternational, international)}
  `;
};

const renderSchedulePageBody = (page: ExportPage, schedules: ExportLanguageData["schedules"], language: Language) => {
  const copy = getCopy(language);
  return `
    ${renderPageIntro(page)}
    <section class="seo-prerender-section">
      <div class="seo-prerender-table-wrap">
        <table class="seo-prerender-table">
          <thead>
            <tr>
              <th>${escapeHtml(copy.time)}</th>
              <th>${escapeHtml(copy.destination)}</th>
              <th>${escapeHtml(copy.operator)}</th>
              <th>${escapeHtml(copy.ticket)}</th>
            </tr>
          </thead>
          <tbody>
            ${schedules
              .map(
                (row) => `
                  <tr>
                    <td>${escapeHtml(row.time)}</td>
                    <td>${escapeHtml(row.destination)}</td>
                    <td>${escapeHtml(row.operator)}</td>
                    <td>${
                      row.buyTicketUrl
                        ? `<a href="${escapeHtml(safeUrl(row.buyTicketUrl))}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.ticket)}</a>`
                        : ""
                    }</td>
                  </tr>`,
              )
              .join("")}
          </tbody>
        </table>
      </div>
      <p class="seo-prerender-note">${escapeHtml(copy.indexingNote)}</p>
    </section>
  `;
};

const renderPartnersPageBody = (page: ExportPage, homepage: ExportHomepage, language: Language) => {
  const copy = getCopy(language);
  return `
    ${renderPageIntro(page)}
    <section class="seo-prerender-section">
      <div class="seo-prerender-list">
        ${homepage.partners
          .map((partner) => {
            const detailPath = `/partners/${normalizePartnerSlug(partner)}`;
            const routes = parsePartnerRoutes(partner.routes);
            return `
              <article class="seo-prerender-card">
                <h2><a href="${buildLocalizedPath(language, detailPath)}">${escapeHtml(partner.name)}</a></h2>
                <p>${escapeHtml(truncateText(partner.description, 220))}</p>
                ${routes.length ? renderList(routes.map((route) => escapeHtml(route))) : ""}
                <p class="seo-prerender-card-links">
                  <a href="${buildLocalizedPath(language, detailPath)}">${escapeHtml(copy.readMore)}</a>
                  ${
                    partner.website
                      ? `<a href="${escapeHtml(safeUrl(partner.website))}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.officialWebsite)}</a>`
                      : ""
                  }
                </p>
              </article>`;
          })
          .join("")}
      </div>
    </section>
  `;
};

const renderLeadershipPageBody = (page: ExportPage, homepage: ExportHomepage, language: Language) => `
  ${renderPageIntro(page)}
  <section class="seo-prerender-section">
    <div class="seo-prerender-list">
      ${homepage.leadershipMembers
        .map((member) => `
          <article class="seo-prerender-card">
            <h2>${escapeHtml(member.name)}</h2>
            <p>${escapeHtml(leadershipRoleLabels[language][member.role] ?? member.role)}</p>
            <p><a href="tel:${escapeHtml(member.phone.replace(/\s/g, ""))}">${escapeHtml(member.phone)}</a></p>
            ${
              member.linkedin
                ? `<p><a href="${escapeHtml(safeUrl(member.linkedin))}" target="_blank" rel="noopener noreferrer">LinkedIn</a></p>`
                : ""
            }
          </article>`)
        .join("")}
    </div>
  </section>
`;

const renderContactPageBody = (page: ExportPage, homepage: ExportHomepage, language: Language) => {
  const copy = getCopy(language);
  return `
    ${renderPageIntro(page)}
    <section class="seo-prerender-section">
      <div class="seo-prerender-grid">
        <article class="seo-prerender-card">
          <h2>${escapeHtml(copy.address)}</h2>
          <p>${escapeHtml(homepage.contact.addressValue)}</p>
          ${homepage.contact.addressNote ? `<p>${escapeHtml(homepage.contact.addressNote)}</p>` : ""}
        </article>
        <article class="seo-prerender-card">
          <h2>${escapeHtml(copy.phone)}</h2>
          <p><a href="tel:${escapeHtml(homepage.contact.phone.replace(/\s/g, ""))}">${escapeHtml(homepage.contact.phone)}</a></p>
        </article>
        <article class="seo-prerender-card">
          <h2>${escapeHtml(copy.email)}</h2>
          <p><a href="mailto:${escapeHtml(homepage.contact.email)}">${escapeHtml(homepage.contact.email)}</a></p>
        </article>
        ${
          homepage.contact.terminalHours
            ? `<article class="seo-prerender-card">
                <h2>${escapeHtml(copy.terminalHours)}</h2>
                <p>${escapeHtml(homepage.contact.terminalHours)}</p>
              </article>`
            : ""
        }
        ${
          homepage.contact.infoDeskHours
            ? `<article class="seo-prerender-card">
                <h2>${escapeHtml(copy.infoDeskHours)}</h2>
                <p>${escapeHtml(homepage.contact.infoDeskHours)}</p>
              </article>`
            : ""
        }
      </div>
    </section>
  `;
};

const renderBlogIndexBody = (page: ExportPage, posts: ExportBlogPost[], language: Language) => {
  const copy = getCopy(language);
  return `
    ${renderPageIntro(page)}
    <section class="seo-prerender-section">
      ${
        posts.length
          ? `<div class="seo-prerender-list">
              ${posts
                .map(
                  (post) => `
                    <article class="seo-prerender-card">
                      <p class="seo-prerender-kicker">${escapeHtml(formatDate(post.publishedAt, language))}</p>
                      <h2><a href="${buildLocalizedPath(language, `/blog/${post.slug}`)}">${escapeHtml(post.title)}</a></h2>
                      <p>${escapeHtml(truncateText(post.excerpt || post.content, 220))}</p>
                      <p><a href="${buildLocalizedPath(language, `/blog/${post.slug}`)}">${escapeHtml(copy.readMore)}</a></p>
                    </article>`,
                )
                .join("")}
            </div>`
          : `<p>${escapeHtml(copy.noPosts)}</p>`
      }
    </section>
  `;
};

const renderCustomPageBody = (page: ExportPage, language: Language) => {
  const copy = getCopy(language);
  return `
    <article class="seo-prerender-section">
      <h1>${escapeHtml(page.title)}</h1>
      ${page.coverImageUrl ? `<img class="seo-prerender-cover" src="${escapeHtml(safeUrl(page.coverImageUrl))}" alt="${escapeHtml(page.title)}" />` : ""}
      ${page.excerpt ? `<div class="seo-prerender-prose">${renderRichText(page.excerpt)}</div>` : ""}
      <div class="seo-prerender-prose">${renderRichText(page.content, copy.noCustomContent)}</div>
    </article>
  `;
};

const renderBlogPostBody = (
  post: ExportBlogPost,
  relatedPosts: ExportBlogPost[],
  language: Language,
) => {
  const copy = getCopy(language);
  return `
    <article class="seo-prerender-section seo-prerender-article">
      <p class="seo-prerender-kicker">${escapeHtml(copy.publishedOn)}: ${escapeHtml(formatDate(post.publishedAt, language))}</p>
      <h1>${escapeHtml(post.title)}</h1>
      <p class="seo-prerender-meta">${escapeHtml(copy.byAuthor)}: ${escapeHtml(post.authorName)}</p>
      ${post.coverImageUrl ? `<img class="seo-prerender-cover" src="${escapeHtml(safeUrl(post.coverImageUrl))}" alt="${escapeHtml(post.title)}" />` : ""}
      ${post.excerpt ? `<div class="seo-prerender-prose">${renderRichText(post.excerpt)}</div>` : ""}
      <div class="seo-prerender-prose">${renderRichText(post.content)}</div>
    </article>
    ${
      relatedPosts.length
        ? `<section class="seo-prerender-section">
            <h2>${escapeHtml(copy.relatedPosts)}</h2>
            <div class="seo-prerender-list">
              ${relatedPosts
                .map(
                  (related) => `
                    <article class="seo-prerender-card">
                      <h3><a href="${buildLocalizedPath(language, `/blog/${related.slug}`)}">${escapeHtml(related.title)}</a></h3>
                      <p>${escapeHtml(truncateText(related.excerpt || related.content, 180))}</p>
                    </article>`,
                )
                .join("")}
            </div>
          </section>`
        : ""
    }
  `;
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, " ")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

const normalizePartnerSlug = (partner: Pick<ExportPartner, "id" | "name">) => {
  const normalizedId = slugify(partner.id);

  if (normalizedId && !/^\d+$/.test(normalizedId)) {
    return normalizedId;
  }

  return slugify(partner.name);
};

const parsePartnerRoutes = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const buildPartnerMeta = (partner: ExportPartner, language: Language) => {
  const routes = parsePartnerRoutes(partner.routes);
  const title =
    partner.seoTitle?.trim() ||
    (language === "ka"
      ? `${partner.name} | პარტნიორი | თბილისის ცენტრალური ავტოსადგური`
      : language === "ru"
        ? `${partner.name} | Партнёр | Тбилисский центральный автовокзал`
        : `${partner.name} | Partner | Tbilisi Central Bus Terminal`);
  const description =
    partner.seoDescription?.trim() ||
    truncateText(`${partner.description} ${routes.length ? `${routes.join(", ")}.` : ""}`, 165);
  const keywords = partner.seoKeywords?.length
    ? partner.seoKeywords
    : dedupe([partner.name, ...routes.slice(0, 6), siteNameByLanguage[language], "bus terminal"]);

  return {
    slug: normalizePartnerSlug(partner),
    title,
    description,
    keywords,
    image: partner.seoImageUrl || partner.logoUrl || null,
    routes,
    noIndex: partner.noIndex ?? false,
  };
};

const renderPartnerBody = (partner: ExportPartner, language: Language) => {
  const copy = getCopy(language);
  const meta = buildPartnerMeta(partner, language);

  return `
    <section class="seo-prerender-section">
      <h1>${escapeHtml(partner.name)}</h1>
      ${partner.logoUrl ? `<img class="seo-prerender-logo" src="${escapeHtml(safeUrl(partner.logoUrl))}" alt="${escapeHtml(partner.name)} logo" />` : ""}
      <div class="seo-prerender-prose">${renderRichText(partner.description)}</div>
      ${
        meta.routes.length
          ? `<section class="seo-prerender-nested">
              <h2>${escapeHtml(copy.keyDestinations)}</h2>
              ${renderList(meta.routes.map((route) => escapeHtml(route)))}
            </section>`
          : ""
      }
      <p class="seo-prerender-card-links">
        ${
          partner.website
            ? `<a href="${escapeHtml(safeUrl(partner.website))}" target="_blank" rel="noopener noreferrer">${escapeHtml(copy.officialWebsite)}</a>`
            : ""
        }
        <a href="${buildLocalizedPath(language, "/partners")}">${escapeHtml(copy.backToPartners)}</a>
      </p>
    </section>
  `;
};

const renderShell = (
  homepage: ExportHomepage,
  language: Language,
  breadcrumbs: Array<{ name: string; path: string }>,
  bodyHtml: string,
) => {
  const copy = getCopy(language);
  const navItems = homepage.navigationPages.map((page) => ({
    href: buildLocalizedPath(language, page.path),
    label: page.label,
  }));
  const popularRoutes = homepage.footer.popularRoutes ?? [];

  return `
    <div class="seo-prerender-shell" data-prerendered="true">
      <a class="seo-prerender-skip-link" href="#main-content">Skip to content</a>
      <header class="seo-prerender-header">
        <div class="seo-prerender-wrap seo-prerender-header-wrap">
          <a class="seo-prerender-brand" href="${buildLocalizedPath(language, "/")}">${escapeHtml(siteNameByLanguage[language])}</a>
          <nav aria-label="Main navigation">
            <ul class="seo-prerender-nav">
              ${navItems.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join("")}
            </ul>
          </nav>
        </div>
      </header>
      <main id="main-content" class="seo-prerender-main seo-prerender-wrap">
        ${renderBreadcrumbsHtml(language, breadcrumbs)}
        ${bodyHtml}
      </main>
      <footer class="seo-prerender-footer">
        <div class="seo-prerender-wrap seo-prerender-footer-grid">
          <section>
            <h2>${escapeHtml(siteNameByLanguage[language])}</h2>
            <p>${escapeHtml(homepage.footer.description)}</p>
          </section>
          <section>
            <h2>${escapeHtml(copy.quickLinks)}</h2>
            <ul class="seo-prerender-footer-list">
              ${navItems.map((item) => `<li><a href="${item.href}">${escapeHtml(item.label)}</a></li>`).join("")}
            </ul>
          </section>
          ${
            popularRoutes.length
              ? `<section>
                  <h2>${escapeHtml(copy.popularRoutes)}</h2>
                  <ul class="seo-prerender-footer-list">
                    ${popularRoutes.map((route) => `<li>${escapeHtml(route)}</li>`).join("")}
                  </ul>
                </section>`
              : ""
          }
          <section>
            <h2>${escapeHtml(copy.contact)}</h2>
            <ul class="seo-prerender-footer-list">
              <li>${escapeHtml(homepage.contact.addressValue)}</li>
              <li><a href="tel:${escapeHtml(homepage.contact.phone.replace(/\s/g, ""))}">${escapeHtml(homepage.contact.phone)}</a></li>
              <li><a href="mailto:${escapeHtml(homepage.contact.email)}">${escapeHtml(homepage.contact.email)}</a></li>
            </ul>
          </section>
        </div>
      </footer>
    </div>`;
};

const renderStructuredData = (payloads: Array<Record<string, unknown>>) =>
  payloads
    .map((payload) => `<script type="application/ld+json" data-seo-managed="true">${JSON.stringify(payload).replace(/</g, "\\u003c")}</script>`)
    .join("\n");

const buildBreadcrumbStructuredData = (language: Language, items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: buildLocalizedAbsoluteUrl(language, item.path),
  })),
});

const buildWebPageStructuredData = ({
  language,
  path: pagePath,
  title,
  description,
  image,
  type = "WebPage",
}: {
  language: Language;
  path: string;
  title: string;
  description: string;
  image?: string | null;
  type?: string;
}) => ({
  "@context": "https://schema.org",
  "@type": type,
  name: title,
  description,
  inLanguage: htmlLangByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, pagePath),
  image: toAbsoluteUrl(image),
  isPartOf: {
    "@type": "WebSite",
    name: siteNameByLanguage[language],
    url: buildLocalizedAbsoluteUrl(language, "/"),
  },
});

const buildWebsiteStructuredData = (language: Language) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteNameByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, "/"),
  inLanguage: htmlLangByLanguage[language],
  image: defaultSeoImage,
});

const buildOrganizationStructuredData = (language: Language, homepage: ExportHomepage) => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteNameByLanguage[language],
  url: buildLocalizedAbsoluteUrl(language, "/"),
  logo: `${siteUrl}/brand/busterminal-logo.png`,
  image: defaultSeoImage,
  telephone: homepage.contact.phone,
  email: homepage.contact.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: homepage.contact.addressValue,
    addressLocality: "Tbilisi",
    addressCountry: "GE",
  },
  sameAs: [homepage.contact.facebookUrl, homepage.contact.instagramUrl].filter(Boolean),
});

const buildArticleStructuredData = (route: RenderRoute) => ({
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  headline: route.title,
  description: route.description,
  inLanguage: htmlLangByLanguage[route.language],
  url: buildLocalizedAbsoluteUrl(route.language, route.relativePath),
  image: toAbsoluteUrl(route.image),
  datePublished: route.publishedTime ?? undefined,
  dateModified: route.lastModified ?? route.publishedTime ?? undefined,
  author: route.author
    ? {
        "@type": "Person",
        name: route.author,
      }
    : undefined,
  publisher: {
    "@type": "Organization",
    name: siteNameByLanguage[route.language],
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/busterminal-logo.png`,
    },
  },
});

const buildTemplateHtml = (
  template: string,
  route: RenderRoute,
  bodyHtml: string,
  dehydratedState: unknown,
  structuredData: Array<Record<string, unknown>>,
) => {
  const canonicalUrl = buildLocalizedAbsoluteUrl(route.language, route.relativePath);
  const imageUrl = toAbsoluteUrl(route.image);
  const robots = route.noIndex ? "noindex, nofollow" : "index, follow, max-image-preview:large";
  const keywords = route.keywords.length ? route.keywords.join(", ") : "";
  const feedLink = route.feedPath
    ? `<link rel="alternate" type="application/rss+xml" title="${escapeHtml(siteNameByLanguage[route.language])}" href="${buildAbsoluteUrl(route.feedPath)}" data-seo-managed="true" />`
    : "";

  const managedHead = [
    `<title>${escapeHtml(route.title)}</title>`,
    `<meta name="description" content="${escapeHtml(route.description)}" />`,
    `<meta name="author" content="${escapeHtml(route.author || siteNameByLanguage[route.language])}" />`,
    `<meta name="application-name" content="${escapeHtml(siteNameByLanguage[route.language])}" />`,
    `<meta name="apple-mobile-web-app-title" content="${escapeHtml(siteNameByLanguage[route.language])}" />`,
    `<meta name="robots" content="${robots}" />`,
    `<meta name="referrer" content="strict-origin-when-cross-origin" />`,
    keywords ? `<meta name="keywords" content="${escapeHtml(keywords)}" />` : "",
    `<meta name="theme-color" content="#161240" />`,
    `<link rel="canonical" href="${canonicalUrl}" data-seo-managed="true" />`,
    `<link rel="alternate" href="${buildLocalizedAbsoluteUrl("ka", route.relativePath)}" hreflang="x-default" data-seo-managed="true" />`,
    ...languages.map((language) => {
      const hreflang = language === "ka" ? "ka-GE" : language;
      return `<link rel="alternate" href="${buildLocalizedAbsoluteUrl(language, route.relativePath)}" hreflang="${hreflang}" data-seo-managed="true" />`;
    }),
    feedLink,
    `<meta property="og:title" content="${escapeHtml(route.title)}" data-seo-managed="true" />`,
    `<meta property="og:description" content="${escapeHtml(route.description)}" data-seo-managed="true" />`,
    `<meta property="og:type" content="${route.type === "article" ? "article" : "website"}" data-seo-managed="true" />`,
    `<meta property="og:url" content="${canonicalUrl}" data-seo-managed="true" />`,
    `<meta property="og:image" content="${imageUrl}" data-seo-managed="true" />`,
    `<meta property="og:image:secure_url" content="${imageUrl}" data-seo-managed="true" />`,
    `<meta property="og:image:alt" content="${escapeHtml(route.title)}" data-seo-managed="true" />`,
    `<meta property="og:site_name" content="${escapeHtml(siteNameByLanguage[route.language])}" data-seo-managed="true" />`,
    `<meta property="og:locale" content="${ogLocaleByLanguage[route.language]}" data-seo-managed="true" />`,
    ...languages
      .filter((language) => language !== route.language)
      .map((language) => `<meta property="og:locale:alternate" content="${ogLocaleByLanguage[language]}" data-seo-managed="true" />`),
    `<meta name="twitter:card" content="summary_large_image" data-seo-managed="true" />`,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" data-seo-managed="true" />`,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" data-seo-managed="true" />`,
    `<meta name="twitter:url" content="${canonicalUrl}" data-seo-managed="true" />`,
    `<meta name="twitter:image" content="${imageUrl}" data-seo-managed="true" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(route.title)}" data-seo-managed="true" />`,
    route.type === "article" && route.publishedTime
      ? `<meta property="article:published_time" content="${route.publishedTime}" data-seo-managed="true" />`
      : "",
    route.type === "article" && route.lastModified
      ? `<meta property="article:modified_time" content="${route.lastModified}" data-seo-managed="true" />`
      : "",
    route.type === "article" && route.author
      ? `<meta property="article:author" content="${escapeHtml(route.author)}" data-seo-managed="true" />`
      : "",
    `<style data-seo-prerender="true">
      :root{color-scheme:light}
      html{scroll-behavior:smooth}
      body{margin:0;color:#101828;background:#f8fafc;font-family:TBCContractica,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}
      img{max-width:100%;height:auto;display:block}
      a{color:#161240;text-decoration:none}
      a:hover{text-decoration:underline}
      .seo-prerender-wrap{max-width:1160px;margin:0 auto;padding:0 20px}
      .seo-prerender-skip-link{position:absolute;left:-9999px}
      .seo-prerender-skip-link:focus{left:16px;top:16px;z-index:9999;background:#161240;color:#fff;padding:10px 14px;border-radius:8px}
      .seo-prerender-header{background:#fff;border-bottom:1px solid #e5e7eb}
      .seo-prerender-header-wrap{display:flex;align-items:center;justify-content:space-between;gap:20px;padding-top:18px;padding-bottom:18px}
      .seo-prerender-brand{font-family:TBCContracticaCAPS,system-ui,sans-serif;font-size:1.1rem;font-weight:700;letter-spacing:.02em}
      .seo-prerender-nav{display:flex;flex-wrap:wrap;gap:16px;list-style:none;margin:0;padding:0}
      .seo-prerender-nav a{font-family:TBCContracticaCAPS,system-ui,sans-serif;font-size:.95rem}
      .seo-prerender-main{padding-top:30px;padding-bottom:32px}
      .seo-prerender-breadcrumbs ol{display:flex;flex-wrap:wrap;gap:8px;list-style:none;margin:0 0 20px;padding:0;color:#475467;font-size:.92rem}
      .seo-prerender-breadcrumbs li+li:before{content:"/";margin-right:8px;color:#98a2b3}
      .seo-prerender-section{margin-bottom:36px;padding:28px;border:1px solid #e5e7eb;border-radius:20px;background:#fff}
      .seo-prerender-section-head{display:flex;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;gap:16px;margin-bottom:18px}
      .seo-prerender-intro h1,.seo-prerender-hero h1,.seo-prerender-article h1{margin-top:0}
      .seo-prerender-main h1,.seo-prerender-main h2,.seo-prerender-main h3{font-family:TBCContracticaCAPS,system-ui,sans-serif;color:#101828;line-height:1.12;margin:0 0 14px}
      .seo-prerender-main h1{font-size:2.9rem}
      .seo-prerender-main h2{font-size:1.8rem}
      .seo-prerender-main h3{font-size:1.2rem}
      .seo-prerender-main p,.seo-prerender-main li,.seo-prerender-main td,.seo-prerender-main th,.seo-prerender-main figcaption{color:#475467;line-height:1.8}
      .seo-prerender-prose > *:first-child{margin-top:0}
      .seo-prerender-prose > *:last-child{margin-bottom:0}
      .seo-prerender-kicker{display:inline-block;margin:0 0 14px;color:#161240;font-family:TBCContracticaCAPS,system-ui,sans-serif;font-size:.83rem;letter-spacing:.14em;text-transform:uppercase}
      .seo-prerender-location,.seo-prerender-meta,.seo-prerender-note{margin-top:14px}
      .seo-prerender-grid,.seo-prerender-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px}
      .seo-prerender-card{padding:18px;border:1px solid #e5e7eb;border-radius:16px;background:#fcfcfd}
      .seo-prerender-stat strong{display:block;margin-bottom:8px;font-family:TBCContracticaCAPS,system-ui,sans-serif;font-size:1.7rem;color:#161240}
      .seo-prerender-inline-list,.seo-prerender-footer-list{list-style:none;margin:12px 0 0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
      .seo-prerender-inline-list li{padding:6px 10px;border-radius:999px;background:#eef2ff;color:#161240;font-size:.92rem}
      .seo-prerender-actions{display:flex;flex-wrap:wrap;gap:12px;margin:20px 0}
      .seo-prerender-button{display:inline-flex;align-items:center;justify-content:center;padding:12px 18px;border-radius:999px;background:#161240;color:#fff;font-family:TBCContracticaCAPS,system-ui,sans-serif}
      .seo-prerender-button:hover{color:#fff;text-decoration:none;background:#221b63}
      .seo-prerender-button-muted{background:#eef2ff;color:#161240}
      .seo-prerender-button-muted:hover{color:#161240;background:#e0e7ff}
      .seo-prerender-table-wrap{overflow:auto}
      .seo-prerender-table{width:100%;border-collapse:collapse}
      .seo-prerender-table th,.seo-prerender-table td{padding:12px;border-bottom:1px solid #e5e7eb;text-align:left}
      .seo-prerender-table th{font-family:TBCContracticaCAPS,system-ui,sans-serif;color:#101828;background:#f8fafc}
      .seo-prerender-card-links{display:flex;flex-wrap:wrap;gap:14px}
      .seo-prerender-cover{margin:18px 0 20px;border-radius:18px;border:1px solid #e5e7eb}
      .seo-prerender-logo{max-width:140px;max-height:80px;margin:0 0 18px}
      .seo-prerender-nested{margin-top:20px}
      .seo-prerender-footer{margin-top:48px;padding:32px 0;background:#0f172a;color:#e2e8f0}
      .seo-prerender-footer h2,.seo-prerender-footer p,.seo-prerender-footer li,.seo-prerender-footer a{color:#e2e8f0}
      .seo-prerender-footer-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:20px}
      @media (max-width: 960px){
        .seo-prerender-main h1{font-size:2.2rem}
        .seo-prerender-main h2{font-size:1.5rem}
        .seo-prerender-header-wrap{align-items:flex-start;flex-direction:column}
      }
    </style>`,
    renderStructuredData(structuredData),
  ]
    .filter(Boolean)
    .join("\n");

  const payloadScript = `<script>window.__SEO_PRERENDER__=${JSON.stringify({ hydrate: false, dehydratedState }).replace(/</g, "\\u003c")};</script>`;

  return template
    .replace(/<html lang="[^"]*">/i, `<html lang="${htmlLangByLanguage[route.language]}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, "")
    .replace(/<meta name="description"[^>]*>\s*/i, "")
    .replace(/<meta name="author"[^>]*>\s*/i, "")
    .replace("</head>", `${managedHead}\n</head>`)
    .replace(/<div id="root"><\/div>/i, `<div id="root">${bodyHtml}</div>\n${payloadScript}`);
};

const ensureRouteFile = async (routePath: string, html: string) => {
  const normalized = routePath.replace(/^\/+/, "");
  const targetDir = normalized ? path.join(distRoot, normalized) : distRoot;
  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(path.join(targetDir, "index.html"), html, "utf8");
};

const buildRedirectHtml = (template: string, targetPath: string, language: Language, title: string) => {
  const canonicalUrl = buildAbsoluteUrl(targetPath);
  const copy = getCopy(language);

  return template
    .replace(/<html lang="[^"]*">/i, `<html lang="${htmlLangByLanguage[language]}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(title)}</title>`)
    .replace(/<meta name="description"[^>]*>\s*/i, `<meta name="description" content="${escapeHtml(copy.redirecting)}" />`)
    .replace(/<meta name="author"[^>]*>\s*/i, `<meta name="author" content="${escapeHtml(siteNameByLanguage[language])}" />`)
    .replace(
      "</head>",
      [
        `<meta http-equiv="refresh" content="0; url=${canonicalUrl}" />`,
        `<meta name="robots" content="noindex, follow" />`,
        `<link rel="canonical" href="${canonicalUrl}" />`,
      ].join("\n") + "\n</head>",
    )
    .replace(
      /<div id="root"><\/div>/i,
      `<div id="root"><main class="seo-prerender-wrap" style="padding:48px 20px"><h1>${escapeHtml(title)}</h1><p><a href="${canonicalUrl}">${escapeHtml(canonicalUrl)}</a></p></main></div>`,
    );
};

const buildNotFoundHtml = (template: string) => {
  const copy = getCopy("ka");
  return template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(copy.notFoundTitle)} | ${escapeHtml(siteNameByLanguage.ka)}</title>`)
    .replace(/<meta name="description"[^>]*>\s*/i, `<meta name="description" content="${escapeHtml(copy.notFoundDescription)}" />`)
    .replace(
      /<div id="root"><\/div>/i,
      `<div id="root"><main class="seo-prerender-wrap" style="padding:48px 20px"><h1>${escapeHtml(copy.notFoundTitle)}</h1><p>${escapeHtml(copy.notFoundDescription)}</p><p><a href="${buildAbsoluteUrl("/ge")}">${escapeHtml(copy.exploreSite)}</a></p></main></div>`,
    )
    .replace("</head>", `<meta name="robots" content="noindex, follow" />\n</head>`);
};

const buildSitemapXml = (routes: RenderRoute[]) => {
  const visibleRoutes = routes.filter((route) => !route.noIndex);

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n${visibleRoutes
    .map((route) => {
      const alternates = visibleRoutes.filter((candidate) => candidate.relativePath === route.relativePath);
      const imageTag = route.image
        ? `    <image:image>\n      <image:loc>${toAbsoluteUrl(route.image)}</image:loc>\n    </image:image>\n`
        : "";

      return `  <url>\n    <loc>${buildLocalizedAbsoluteUrl(route.language, route.relativePath)}</loc>\n    <lastmod>${(route.lastModified ?? route.publishedTime ?? new Date().toISOString()).slice(0, 10)}</lastmod>\n    <changefreq>${route.changeFreq ?? "weekly"}</changefreq>\n    <priority>${route.priority?.toFixed(1) ?? "0.7"}</priority>\n${alternates
        .map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.language === "ka" ? "ka-GE" : alternate.language}" href="${buildLocalizedAbsoluteUrl(alternate.language, alternate.relativePath)}" />`)
        .join("\n")}\n${imageTag}  </url>`;
    })
    .join("\n")}\n</urlset>\n`;
};

const buildRssXml = (language: Language, posts: ExportBlogPost[]) => {
  const items = posts
    .filter((post) => !post.noIndex)
    .map((post) => {
      const url = buildLocalizedAbsoluteUrl(language, `/blog/${post.slug}`);
      return `  <item>\n    <title>${escapeHtml(post.title)}</title>\n    <link>${url}</link>\n    <guid>${url}</guid>\n    <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>\n    <description>${escapeHtml(post.seoDescription || truncateText(post.excerpt || post.content, 180))}</description>\n    <content:encoded><![CDATA[${sanitizeRichHtml(post.content || post.excerpt || "")}]]></content:encoded>\n  </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">\n<channel>\n  <title>${escapeHtml(siteNameByLanguage[language])} Blog</title>\n  <link>${buildLocalizedAbsoluteUrl(language, "/blog")}</link>\n  <description>${escapeHtml(siteNameByLanguage[language])} blog feed</description>\n  <language>${htmlLangByLanguage[language]}</language>\n${items}\n</channel>\n</rss>\n`;
};

const main = async () => {
  const template = await fs.readFile(path.join(distRoot, "index.html"), "utf8");
  const exportJson = execFileSync("/opt/homebrew/opt/php@8.3/bin/php", ["artisan", "seo:export"], {
    cwd: backendRoot,
    encoding: "utf8",
    env: process.env,
    maxBuffer: 1024 * 1024 * 10,
  });

  const exported = normalizeSeoPayload(JSON.parse(exportJson) as ExportPayload);
  const routes: RenderRoute[] = [];

  for (const language of languages) {
    const languageData = exported.languages[language];
    const homepage = languageData.homepage;
    const pagesBySlug = new Map(languageData.pages.map((page) => [page.slug, page]));
    const customPages = languageData.pages.filter((page) => page.pageType === "custom");
    const schedules = languageData.schedules;
    const blogPosts = languageData.blogPosts;
    const homepagePage = pagesBySlug.get("home");
    const copy = getCopy(language);
    const addCommonQueryData = (queryClient: QueryClient) => {
      queryClient.setQueryData(["homepage-cms", language], homepage);
      queryClient.setQueryData(["display-schedules", language], schedules);
    };

    routes.push({
      routePath: buildLocalizedPath(language, "/"),
      relativePath: "/",
      language,
      title:
        homepagePage?.seoTitle ||
        (language === "ka"
          ? "თბილისის ცენტრალური ავტოსადგური | შიდა და საერთაშორისო რეისები"
          : language === "ru"
            ? "Тбилисский центральный автовокзал | внутренние и международные рейсы"
            : "Tbilisi Central Bus Terminal | Domestic and International Routes"),
      description: homepagePage?.seoDescription || truncateText(homepage.hero.description),
      image: homepagePage?.seoImageUrl || defaultSeoImage,
      keywords: homepagePage?.seoKeywords?.length
        ? homepagePage.seoKeywords
        : dedupe([siteNameByLanguage[language], copy.routes, copy.schedule, copy.servicePartners]),
      noIndex: homepagePage?.noIndex ?? false,
      changeFreq: "daily",
      priority: 1,
      querySetup: (queryClient) => {
        addCommonQueryData(queryClient);
        if (homepagePage) {
          queryClient.setQueryData(["managed-page-seo", "home", language], homepagePage);
        }
      },
      breadcrumbs: [{ name: copy.homepageTitle, path: "/" }],
      bodyHtml: renderShell(
        homepage,
        language,
        [{ name: copy.homepageTitle, path: "/" }],
        renderHomeBody(homepage, schedules, language, pagesBySlug),
      ),
      redirectSources: [language === "ka" ? "/" : ""].filter(Boolean),
      feedPath: `/${languagePrefix[language].replace(/^\//, "")}/rss.xml`,
      lastModified: exported.generatedAt,
    });

    for (const slug of ["about", "destinations", "schedule", "partners", "leadership", "contact"] as const) {
      const page = pagesBySlug.get(slug);
      if (!page?.routePath) {
        continue;
      }

      const relativePath = page.routePath;
      const breadcrumbs = [
        { name: copy.homepageTitle, path: "/" },
        { name: page.title || systemPageLabels[language][slug], path: relativePath },
      ];

      const bodyBySlug = {
        about: renderAboutPageBody(page, homepage, language),
        destinations: renderDestinationsPageBody(page, homepage, language),
        schedule: renderSchedulePageBody(page, schedules, language),
        partners: renderPartnersPageBody(page, homepage, language),
        leadership: renderLeadershipPageBody(page, homepage, language),
        contact: renderContactPageBody(page, homepage, language),
      };

      routes.push({
        routePath: buildLocalizedPath(language, relativePath),
        relativePath,
        language,
        title: page.seoTitle || `${page.title} | ${siteNameByLanguage[language]}`,
        description: page.seoDescription || truncateText(page.excerpt || page.content, 165),
        image: page.seoImageUrl || page.coverImageUrl || defaultSeoImage,
        keywords: page.seoKeywords ?? [],
        noIndex: page.noIndex,
        changeFreq: slug === "schedule" ? "daily" : "weekly",
        priority: slug === "about" ? 0.9 : 0.8,
        querySetup: (queryClient) => {
          addCommonQueryData(queryClient);
          queryClient.setQueryData(["managed-page-seo", slug, language], page);
        },
        breadcrumbs,
        bodyHtml: renderShell(homepage, language, breadcrumbs, bodyBySlug[slug]),
        lastModified: exported.generatedAt,
      });
    }

    const blogPage = pagesBySlug.get("blog");
    if (blogPage?.routePath) {
      const breadcrumbs = [
        { name: copy.homepageTitle, path: "/" },
        { name: blogPage.title || systemPageLabels[language].blog, path: blogPage.routePath },
      ];

      routes.push({
        routePath: buildLocalizedPath(language, blogPage.routePath),
        relativePath: blogPage.routePath,
        language,
        title: blogPage.seoTitle || `${blogPage.title} | ${siteNameByLanguage[language]}`,
        description: blogPage.seoDescription || truncateText(blogPage.excerpt || blogPage.content, 165),
        image: blogPage.seoImageUrl || blogPage.coverImageUrl || defaultSeoImage,
        keywords: blogPage.seoKeywords ?? [],
        noIndex: blogPage.noIndex,
        changeFreq: "weekly",
        priority: 0.8,
        feedPath: `/${languagePrefix[language].replace(/^\//, "")}/rss.xml`,
        querySetup: (queryClient) => {
          addCommonQueryData(queryClient);
          queryClient.setQueryData(["managed-page-seo", "blog", language], blogPage);
          queryClient.setQueryData(["blog-posts", language], blogPosts);
        },
        breadcrumbs,
        bodyHtml: renderShell(homepage, language, breadcrumbs, renderBlogIndexBody(blogPage, blogPosts, language)),
        lastModified: exported.generatedAt,
      });
    }

    for (const page of customPages) {
      const relativePath = page.routePath || `/page/${page.slug}`;
      const breadcrumbs = [
        { name: copy.homepageTitle, path: "/" },
        { name: page.title, path: relativePath },
      ];

      routes.push({
        routePath: buildLocalizedPath(language, relativePath),
        relativePath,
        language,
        title: page.seoTitle || `${page.title} | ${siteNameByLanguage[language]}`,
        description: page.seoDescription || truncateText(page.excerpt || page.content, 165),
        image: page.seoImageUrl || page.coverImageUrl || defaultSeoImage,
        keywords: page.seoKeywords ?? [],
        noIndex: page.noIndex,
        changeFreq: "monthly",
        priority: 0.7,
        querySetup: (queryClient) => {
          addCommonQueryData(queryClient);
          queryClient.setQueryData(["site-page", page.slug, language], page);
        },
        breadcrumbs,
        bodyHtml: renderShell(homepage, language, breadcrumbs, renderCustomPageBody(page, language)),
        lastModified: exported.generatedAt,
        redirectSources: [relativePath],
      });
    }

    for (const post of blogPosts) {
      const relativePath = `/blog/${post.slug}`;
      const breadcrumbs = [
        { name: copy.homepageTitle, path: "/" },
        { name: blogPage?.title || systemPageLabels[language].blog, path: blogPage?.routePath || "/blog" },
        { name: post.title, path: relativePath },
      ];
      const relatedPosts = blogPosts.filter((candidate) => candidate.slug !== post.slug).slice(0, 3);

      routes.push({
        routePath: buildLocalizedPath(language, relativePath),
        relativePath,
        language,
        title: post.seoTitle || `${post.title} | ${siteNameByLanguage[language]}`,
        description: post.seoDescription || truncateText(post.excerpt || post.content, 165),
        image: post.seoImageUrl || post.coverImageUrl || defaultSeoImage,
        keywords: post.seoKeywords ?? [],
        noIndex: post.noIndex,
        type: "article",
        author: post.authorName,
        publishedTime: post.publishedAt,
        lastModified: post.publishedAt,
        changeFreq: "monthly",
        priority: 0.7,
        feedPath: `/${languagePrefix[language].replace(/^\//, "")}/rss.xml`,
        querySetup: (queryClient) => {
          addCommonQueryData(queryClient);
          queryClient.setQueryData(["blog-post", post.slug, language], post);
        },
        breadcrumbs,
        bodyHtml: renderShell(homepage, language, breadcrumbs, renderBlogPostBody(post, relatedPosts, language)),
        redirectSources: [relativePath],
      });
    }

    for (const partner of homepage.partners) {
      const partnerMeta = buildPartnerMeta(partner, language);
      const relativePath = `/partners/${partnerMeta.slug}`;
      const breadcrumbs = [
        { name: copy.homepageTitle, path: "/" },
        { name: pagesBySlug.get("partners")?.title || systemPageLabels[language].partners, path: "/partners" },
        { name: partner.name, path: relativePath },
      ];

      routes.push({
        routePath: buildLocalizedPath(language, relativePath),
        relativePath,
        language,
        title: partnerMeta.title,
        description: partnerMeta.description,
        image: partnerMeta.image || defaultSeoImage,
        keywords: partnerMeta.keywords,
        noIndex: partnerMeta.noIndex,
        changeFreq: "monthly",
        priority: 0.6,
        querySetup: (queryClient) => {
          addCommonQueryData(queryClient);
        },
        breadcrumbs,
        bodyHtml: renderShell(homepage, language, breadcrumbs, renderPartnerBody(partner, language)),
        lastModified: exported.generatedAt,
        redirectSources: [relativePath],
        structuredData: [
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: partner.name,
            description: partnerMeta.description,
            url: partner.website,
            logo: toAbsoluteUrl(partnerMeta.image),
            sameAs: partner.website ? [partner.website] : undefined,
            memberOf: {
              "@type": "Organization",
              name: siteNameByLanguage[language],
              url: buildLocalizedAbsoluteUrl(language, "/"),
            },
          },
        ],
      });
    }
  }

  for (const route of routes) {
    const queryClient = new QueryClient();
    route.querySetup(queryClient);
    const dehydratedState = dehydrate(queryClient);
    const structuredData = [
      buildWebPageStructuredData({
        language: route.language,
        path: route.relativePath,
        title: route.title,
        description: route.description,
        image: route.image,
        type: route.type === "article" ? "BlogPosting" : "WebPage",
      }),
      buildBreadcrumbStructuredData(route.language, route.breadcrumbs),
      buildWebsiteStructuredData(route.language),
      buildOrganizationStructuredData(route.language, exported.languages[route.language].homepage),
      ...(route.structuredData ?? []),
    ];

    if (route.type === "article") {
      structuredData.push(buildArticleStructuredData(route));
    }

    const html = buildTemplateHtml(template, route, route.bodyHtml, dehydratedState, structuredData);
    await ensureRouteFile(route.routePath, html);
  }

  const rootRedirect = buildRedirectHtml(template, "/ge", "ka", "გადამისამართება");
  await fs.writeFile(path.join(distRoot, "index.html"), rootRedirect, "utf8");

  for (const redirectPath of ["/about", "/destinations", "/schedule", "/partners", "/leadership", "/contact", "/blog"]) {
    await ensureRouteFile(redirectPath, buildRedirectHtml(template, `/ge${redirectPath}`, "ka", `Redirect: ${redirectPath}`));
  }

  for (const route of routes) {
    for (const redirectSource of route.redirectSources ?? []) {
      if (redirectSource === "/" || route.language !== "ka") {
        continue;
      }

      await ensureRouteFile(
        redirectSource,
        buildRedirectHtml(template, route.routePath, "ka", `${copyByLanguage.ka.redirecting}: ${redirectSource}`),
      );
    }
  }

  await fs.writeFile(path.join(distRoot, "sitemap.xml"), buildSitemapXml(routes), "utf8");
  await fs.writeFile(
    path.join(distRoot, "robots.txt"),
    `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
    "utf8",
  );

  for (const language of languages) {
    const feedPath = path.join(distRoot, languagePrefix[language].replace(/^\/+/, ""), "rss.xml");
    await fs.mkdir(path.dirname(feedPath), { recursive: true });
    await fs.writeFile(feedPath, buildRssXml(language, exported.languages[language].blogPosts), "utf8");
  }

  await fs.writeFile(path.join(distRoot, "rss.xml"), buildRssXml("ka", exported.languages.ka.blogPosts), "utf8");
  await fs.writeFile(path.join(distRoot, "404.html"), buildNotFoundHtml(template), "utf8");
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
