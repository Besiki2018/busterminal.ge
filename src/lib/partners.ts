import type { Partner } from "@/lib/cms";
import { truncateSeoText } from "@/lib/seo";
import type { Language } from "@/lib/translations";

type LocalizedLabel = Record<Language, string>;

type PartnerPageCopy = {
  eyebrow: string;
  backToPartners: string;
  officialWebsite: string;
  routeListTitle: string;
  routeListDescription: string;
  aboutTitle: string;
  aboutDescription: (partnerName: string, partnerDescription: string, category: string, routes: string[]) => string;
  highlightsTitle: string;
  highlights: (partnerName: string) => string[];
  routeCountLabel: (count: number) => string;
  categoryLabel: string;
  websiteLabel: string;
  infoTitle: string;
  infoDescription: (partnerName: string) => string;
  keywords: string[];
};

const genericCategory: LocalizedLabel = {
  en: "Transport partner",
  ka: "სატრანსპორტო პარტნიორი",
  ru: "Транспортный партнёр",
};

const partnerCategories: Record<string, LocalizedLabel> = {
  omnibus: {
    en: "Intercity bus operator",
    ka: "საქალაქთაშორისო ავტობუსის ოპერატორი",
    ru: "Междугородний автобусный оператор",
  },
  citybus: {
    en: "Regional bus operator",
    ka: "რეგიონული ავტობუსის ოპერატორი",
    ru: "Региональный автобусный оператор",
  },
  "metro-georgia": {
    en: "Domestic and international route operator",
    ka: "შიდა და საერთაშორისო მარშრუტების ოპერატორი",
    ru: "Оператор внутренних и международных маршрутов",
  },
  "luks-karadeniz": {
    en: "International route operator",
    ka: "საერთაშორისო მარშრუტების ოპერატორი",
    ru: "Оператор международных маршрутов",
  },
  "long-way": {
    en: "International travel operator",
    ka: "საერთაშორისო მგზავრობის ოპერატორი",
    ru: "Оператор международных поездок",
  },
  "tkt-ge": {
    en: "Ticket booking platform",
    ka: "ბილეთების დაჯავშნის პლატფორმა",
    ru: "Платформа бронирования билетов",
  },
};

const pageCopyByLanguage: Record<Language, PartnerPageCopy> = {
  en: {
    eyebrow: "Partner profile",
    backToPartners: "All partners",
    officialWebsite: "Official website",
    routeListTitle: "Key destinations",
    routeListDescription: "These destinations are currently associated with this partner in the terminal content.",
    aboutTitle: "About this partner",
    aboutDescription: (partnerName, partnerDescription, category, routes) =>
      truncateSeoText(
        `${partnerName} is featured on Tbilisi Central Bus Terminal as a ${category.toLowerCase()}. ${partnerDescription} Key destinations include ${routes.join(", ")}. This page helps passengers quickly find the partner profile, route coverage, and official website.`,
        320,
      ),
    highlightsTitle: "What this page gives you",
    highlights: (partnerName) => [
      `${partnerName} route coverage listed in the terminal content.`,
      `A direct link to the official website for tickets or additional travel information.`,
      `A focused, SEO-friendly partner page connected to the main terminal website.`,
    ],
    routeCountLabel: (count) => `${count} route${count === 1 ? "" : "s"}`,
    categoryLabel: "Category",
    websiteLabel: "Website",
    infoTitle: "Need more details?",
    infoDescription: (partnerName) =>
      `Use the official ${partnerName} website for ticketing, schedules, route updates, and customer support.`,
    keywords: ["Tbilisi Central Bus Terminal", "transport partner", "bus routes", "tickets"],
  },
  ka: {
    eyebrow: "პარტნიორის გვერდი",
    backToPartners: "ყველა პარტნიორი",
    officialWebsite: "ოფიციალური ვებსაიტი",
    routeListTitle: "ძირითადი მიმართულებები",
    routeListDescription: "ქვემოთ მოცემულია მიმართულებები, რომლებიც ამ პარტნიორთან არის დაკავშირებული ავტოსადგურის მიმდინარე კონტენტში.",
    aboutTitle: "პარტნიორის შესახებ",
    aboutDescription: (partnerName, partnerDescription, category, routes) =>
      truncateSeoText(
        `${partnerName} წარმოდგენილია თბილისის ცენტრალური ავტოსადგურის პარტნიორების კატალოგში, როგორც ${category.toLowerCase()}. ${partnerDescription} ამ პარტნიორთან დაკავშირებული ძირითადი მიმართულებებია: ${routes.join(", ")}. გვერდი გაძლევს ერთ წერტილში პარტნიორის მოკლე აღწერას, მიმართულებებს და ოფიციალურ ვებსაიტზე სწრაფ გადასვლას.`,
        320,
      ),
    highlightsTitle: "რას ნახავ ამ გვერდზე",
    highlights: (partnerName) => [
      `${partnerName}-თან დაკავშირებული ძირითადი მიმართულებების ჩამონათვალს.`,
      `ოფიციალურ ვებსაიტზე პირდაპირ გადასასვლელ ბმულს ბილეთებისა და დამატებითი ინფორმაციისთვის.`,
      `პარტნიორის ცალკე SEO-ოპტიმიზებულ გვერდს, რომელიც მიბმულია ავტოსადგურის მთავარ საიტზე.`,
    ],
    routeCountLabel: (count) => `${count} მიმართულება`,
    categoryLabel: "კატეგორია",
    websiteLabel: "ვებსაიტი",
    infoTitle: "გჭირდება მეტი ინფორმაცია?",
    infoDescription: (partnerName) =>
      `${partnerName}-ის ოფიციალურ ვებსაიტზე შეგიძლია ნახო ბილეთები, განრიგი, მიმართულებების განახლებები და დამატებითი ინფორმაცია მომსახურებაზე.`,
    keywords: ["თბილისის ცენტრალური ავტოსადგური", "სატრანსპორტო პარტნიორი", "მარშრუტები", "ბილეთები"],
  },
  ru: {
    eyebrow: "Страница партнёра",
    backToPartners: "Все партнёры",
    officialWebsite: "Официальный сайт",
    routeListTitle: "Основные направления",
    routeListDescription: "Ниже перечислены направления, которые сейчас связаны с этим партнёром в контенте терминала.",
    aboutTitle: "О партнёре",
    aboutDescription: (partnerName, partnerDescription, category, routes) =>
      truncateSeoText(
        `${partnerName} представлен на сайте Тбилисского центрального автовокзала как ${category.toLowerCase()}. ${partnerDescription} Основные направления: ${routes.join(", ")}. Эта страница помогает быстро найти профиль партнёра, список направлений и официальный сайт.`,
        320,
      ),
    highlightsTitle: "Что есть на этой странице",
    highlights: (partnerName) => [
      `Список ключевых направлений, связанных с ${partnerName}.`,
      `Прямая ссылка на официальный сайт для покупки билетов и дополнительной информации.`,
      `Отдельная SEO-оптимизированная страница партнёра, связанная с основным сайтом терминала.`,
    ],
    routeCountLabel: (count) => `${count} ${count === 1 ? "маршрут" : "маршрутов"}`,
    categoryLabel: "Категория",
    websiteLabel: "Сайт",
    infoTitle: "Нужны детали?",
    infoDescription: (partnerName) =>
      `Перейдите на официальный сайт ${partnerName}, чтобы посмотреть билеты, расписание, обновления направлений и другую важную информацию.`,
    keywords: ["Тбилисский центральный автовокзал", "транспортный партнёр", "маршруты", "билеты"],
  },
};

export const normalizePartnerSlug = (value: string) =>
  value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, " ")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-");

export const getPartnerSlug = (partner: Pick<Partner, "id" | "name">) => {
  const normalizedId = normalizePartnerSlug(partner.id);

  if (normalizedId && !/^\d+$/.test(normalizedId)) {
    return normalizedId;
  }

  return normalizePartnerSlug(partner.name);
};

export const getPartnerPagePath = (partnerSlug: string) => `/partners/${partnerSlug}`;

export const parsePartnerRoutes = (routes: string) =>
  routes
    .split(",")
    .map((route) => route.trim())
    .filter(Boolean);

export const findPartnerBySlug = (partners: Partner[], slug: string) =>
  partners.find((partner) => getPartnerSlug(partner) === normalizePartnerSlug(slug));

export const getPartnerCategory = (partner: Pick<Partner, "id" | "name">, language: Language) =>
  partnerCategories[getPartnerSlug(partner)]?.[language] ?? genericCategory[language];

export const getPartnerPageMeta = (partner: Partner, language: Language) => {
  const slug = getPartnerSlug(partner);
  const routes = parsePartnerRoutes(partner.routes);
  const copy = pageCopyByLanguage[language];
  const category = getPartnerCategory(partner, language);
  const description = copy.aboutDescription(partner.name, partner.description, category, routes);
  const title =
    language === "ka"
      ? `${partner.name} | ${category} | თბილისის ცენტრალური ავტოსადგური`
      : language === "ru"
        ? `${partner.name} | ${category} | Тбилисский центральный автовокзал`
        : `${partner.name} | ${category} | Tbilisi Central Bus Terminal`;

  const seoTitle = partner.seoTitle?.trim();
  const seoDescription = partner.seoDescription?.trim();
  const seoKeywords = partner.seoKeywords?.filter(Boolean) ?? [];

  return {
    slug,
    routes,
    copy,
    category,
    title: seoTitle || title,
    description: seoDescription || truncateSeoText(description, 165),
    overview: description,
    highlights: copy.highlights(partner.name),
    keywords: seoKeywords.length
      ? seoKeywords
      : Array.from(new Set([partner.name, category, ...routes.slice(0, 5), ...copy.keywords])),
    image: partner.seoImageUrl || partner.logoUrl,
    noIndex: partner.noIndex ?? false,
  };
};

export const partnerSitemapSlugs = [
  "omnibus",
  "citybus",
  "metro-georgia",
  "luks-karadeniz",
  "long-way",
  "tkt-ge",
] as const;
