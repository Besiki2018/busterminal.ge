import terminalInterior from "@/assets/terminal-interior.jpg";
import terminalBuilding from "@/assets/terminal-building.jpg";
import terminalExterior from "@/assets/terminal-exterior.jpg";
import terminalHistoric from "@/assets/terminal-historic.webp";
import omnibusLogo from "@/assets/partners/omnibus.png";
import citybusLogo from "@/assets/partners/citybus.png";
import metroGeorgiaLogo from "@/assets/partners/metro-georgia.jpg";
import luksKaradenizLogo from "@/assets/partners/luks-karadeniz.svg";
import longWayLogo from "@/assets/partners/long-way.png";
import tktGeLogo from "@/assets/partners/tkt-ge.png";
import { fetchJson, resolveBackendMediaUrl } from "@/lib/backend";
import { primaryPagePaths } from "@/lib/site-routes";
import { type Language, translations } from "@/lib/translations";

export type ProviderLink = {
  name: string;
  url: string;
};

export type HeroStat = {
  value: string;
  label: string;
};

export type HeroContent = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  location: string;
  stats: HeroStat[];
};

export type AboutFeatureIcon = "building2" | "users" | "shield" | "award";

export type AboutFeature = {
  icon: AboutFeatureIcon;
  title: string;
  description: string;
};

export type AboutStat = {
  value: string;
  label: string;
};

export type GalleryImage = {
  src: string;
  alt: string;
};

export type AboutContent = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  stats: AboutStat[];
  gallery: GalleryImage[];
  features: AboutFeature[];
};

export type RouteType = "domestic" | "international";

export type DestinationRoute = {
  id: string;
  routeType: RouteType;
  city: string;
  country?: string;
  duration?: string;
  priceFrom?: string;
  providers: ProviderLink[];
  showInFooter?: boolean;
};

export type Partner = {
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

export type LeadershipMember = {
  id: string;
  name: string;
  role: string;
  phone: string;
  linkedin?: string | null;
  whatsappEnabled?: boolean;
};

export type ContactContent = {
  badge: string;
  title1: string;
  title2: string;
  description: string;
  addressLabel: string;
  addressValue: string;
  addressNote: string;
  phoneLabel: string;
  phone: string;
  emailLabel: string;
  email: string;
  hoursLabel: string;
  terminalLabel: string;
  terminalHours: string;
  infoDeskLabel: string;
  infoDeskHours: string;
  followUsLabel: string;
  facebookUrl: string;
  instagramUrl: string;
};

export type FooterContent = {
  brandTitle: string;
  brandSubtitle: string;
  description: string;
  privacyLabel: string;
  termsLabel: string;
  popularRoutes: string[];
};

export type NavigationPage = {
  id: string;
  slug: string;
  path: string;
  label: string;
};

export type HomePageCms = {
  hero: HeroContent;
  about: AboutContent;
  routes: DestinationRoute[];
  partners: Partner[];
  leadershipMembers: LeadershipMember[];
  contact: ContactContent;
  footer: FooterContent;
  navigationPages: NavigationPage[];
};

type LocalizedValue = Record<Language, string>;

type BaseRoute = {
  id: string;
  routeType: RouteType;
  city: LocalizedValue;
  country?: LocalizedValue;
  duration?: string;
  priceFrom?: string;
  providers: ProviderLink[];
  showInFooter?: boolean;
};

type BasePartner = {
  id: string;
  name: string;
  description: LocalizedValue;
  routes: LocalizedValue;
  website: string;
  logoUrl?: string | null;
};

const localized = (en: string, ka: string, ru: string): LocalizedValue => ({
  en,
  ka,
  ru,
});

const heroFallbackContent: Record<Language, HeroContent> = {
  en: {
    badge: translations.en.hero.badge,
    title1: translations.en.hero.title1,
    title2: translations.en.hero.title2,
    description: translations.en.hero.description,
    location: translations.en.hero.location,
    stats: [
      { value: "50+", label: translations.en.hero.stats.years },
      { value: "100+", label: translations.en.hero.stats.departures },
      { value: "25+", label: translations.en.hero.stats.destinations },
      { value: "500K+", label: translations.en.hero.stats.passengers },
    ],
  },
  ka: {
    badge: translations.ka.hero.badge,
    title1: translations.ka.hero.title1,
    title2: translations.ka.hero.title2,
    description: translations.ka.hero.description,
    location: translations.ka.hero.location,
    stats: [
      { value: "50+", label: translations.ka.hero.stats.years },
      { value: "100+", label: translations.ka.hero.stats.departures },
      { value: "25+", label: translations.ka.hero.stats.destinations },
      { value: "500K+", label: translations.ka.hero.stats.passengers },
    ],
  },
  ru: {
    badge: translations.ru.hero.badge,
    title1: translations.ru.hero.title1,
    title2: translations.ru.hero.title2,
    description: translations.ru.hero.description,
    location: translations.ru.hero.location,
    stats: [
      { value: "50+", label: translations.ru.hero.stats.years },
      { value: "100+", label: translations.ru.hero.stats.departures },
      { value: "25+", label: translations.ru.hero.stats.destinations },
      { value: "500K+", label: translations.ru.hero.stats.passengers },
    ],
  },
};

const aboutFallbackContent: Record<Language, AboutContent> = {
  en: {
    badge: translations.en.about.badge,
    title1: translations.en.about.title1,
    title2: translations.en.about.title2,
    description: `${translations.en.about.description1} ${translations.en.about.description2}`,
    stats: [
      { value: "1973", label: translations.en.about.established },
      { value: "24/7", label: translations.en.about.operations },
      { value: "500K+", label: translations.en.about.passengers },
      { value: "3.5", label: translations.en.about.hectares },
    ],
    gallery: [
      { src: terminalInterior, alt: "Terminal Interior" },
      { src: terminalBuilding, alt: "Terminal Building" },
      { src: terminalExterior, alt: "Terminal Exterior" },
      { src: terminalHistoric, alt: "Historic Terminal View" },
    ],
    features: [
      {
        icon: "building2",
        title: translations.en.about.features.facilities.title,
        description: translations.en.about.features.facilities.description,
      },
      {
        icon: "users",
        title: translations.en.about.features.service.title,
        description: translations.en.about.features.service.description,
      },
      {
        icon: "shield",
        title: translations.en.about.features.safety.title,
        description: translations.en.about.features.safety.description,
      },
    ],
  },
  ka: {
    badge: translations.ka.about.badge,
    title1: translations.ka.about.title1,
    title2: translations.ka.about.title2,
    description: `${translations.ka.about.description1} ${translations.ka.about.description2}`,
    stats: [
      { value: "1973", label: translations.ka.about.established },
      { value: "24/7", label: translations.ka.about.operations },
      { value: "500K+", label: translations.ka.about.passengers },
      { value: "3.5", label: translations.ka.about.hectares },
    ],
    gallery: [
      { src: terminalInterior, alt: "ტერმინალის ინტერიერი" },
      { src: terminalBuilding, alt: "ტერმინალის შენობა" },
      { src: terminalExterior, alt: "ტერმინალის ექსტერიერი" },
      { src: terminalHistoric, alt: "ისტორიული ხედი" },
    ],
    features: [
      {
        icon: "building2",
        title: translations.ka.about.features.facilities.title,
        description: translations.ka.about.features.facilities.description,
      },
      {
        icon: "users",
        title: translations.ka.about.features.service.title,
        description: translations.ka.about.features.service.description,
      },
      {
        icon: "shield",
        title: translations.ka.about.features.safety.title,
        description: translations.ka.about.features.safety.description,
      },
    ],
  },
  ru: {
    badge: translations.ru.about.badge,
    title1: translations.ru.about.title1,
    title2: translations.ru.about.title2,
    description: `${translations.ru.about.description1} ${translations.ru.about.description2}`,
    stats: [
      { value: "1973", label: translations.ru.about.established },
      { value: "24/7", label: translations.ru.about.operations },
      { value: "500K+", label: translations.ru.about.passengers },
      { value: "3.5", label: translations.ru.about.hectares },
    ],
    gallery: [
      { src: terminalInterior, alt: "Интерьер терминала" },
      { src: terminalBuilding, alt: "Здание терминала" },
      { src: terminalExterior, alt: "Экстерьер терминала" },
      { src: terminalHistoric, alt: "Исторический вид" },
    ],
    features: [
      {
        icon: "building2",
        title: translations.ru.about.features.facilities.title,
        description: translations.ru.about.features.facilities.description,
      },
      {
        icon: "users",
        title: translations.ru.about.features.service.title,
        description: translations.ru.about.features.service.description,
      },
      {
        icon: "shield",
        title: translations.ru.about.features.safety.title,
        description: translations.ru.about.features.safety.description,
      },
    ],
  },
};

const baseRoutes: BaseRoute[] = [
  {
    id: "batumi",
    routeType: "domestic",
    city: localized("Batumi", "ბათუმი", "Батуми"),
    duration: "5-6h",
    priceFrom: "35 GEL",
    providers: [
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
      { name: "Omnibus", url: "https://omnibusexpress.ge" },
      { name: "CityBus", url: "https://citybus.ge" },
    ],
    showInFooter: true,
  },
  {
    id: "kutaisi",
    routeType: "domestic",
    city: localized("Kutaisi", "ქუთაისი", "Кутаиси"),
    duration: "3-4h",
    priceFrom: "18 GEL",
    providers: [
      { name: "Omnibus", url: "https://omnibusexpress.ge" },
      { name: "CityBus", url: "https://citybus.ge" },
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
    ],
    showInFooter: true,
  },
  {
    id: "zugdidi",
    routeType: "domestic",
    city: localized("Zugdidi", "ზუგდიდი", "Зугдиди"),
    duration: "5-6h",
    priceFrom: "30 GEL",
    providers: [
      { name: "Omnibus", url: "https://omnibusexpress.ge" },
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
    ],
    showInFooter: true,
  },
  {
    id: "kakheti",
    routeType: "domestic",
    city: localized("Kakheti", "კახეთი", "Кахети"),
    duration: "2h",
    priceFrom: "12 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "borjomi",
    routeType: "domestic",
    city: localized("Borjomi", "ბორჯომი", "Боржоми"),
    duration: "2.5h",
    priceFrom: "15 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "other-domestic",
    routeType: "domestic",
    city: localized("Other domestic routes", "სხვა შიდა მარშრუტები", "Другие внутренние маршруты"),
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "istanbul",
    routeType: "international",
    city: localized("Istanbul", "სტამბული", "Стамбул"),
    country: localized("Turkey", "თურქეთი", "Турция"),
    duration: "18h",
    priceFrom: "120 GEL",
    providers: [
      { name: "Luks Karadeniz", url: "https://lukskaradeniz.com" },
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
      { name: "Obilet", url: "https://obilet.com" },
    ],
    showInFooter: true,
  },
  {
    id: "ankara",
    routeType: "international",
    city: localized("Ankara", "ანკარა", "Анкара"),
    country: localized("Turkey", "თურქეთი", "Турция"),
    duration: "20h",
    priceFrom: "150 GEL",
    providers: [
      { name: "Luks Karadeniz", url: "https://lukskaradeniz.com" },
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
      { name: "Obilet", url: "https://obilet.com" },
    ],
  },
  {
    id: "antalya",
    routeType: "international",
    city: localized("Antalya", "ანტალია", "Анталья"),
    country: localized("Turkey", "თურქეთი", "Турция"),
    duration: "24h",
    priceFrom: "180 GEL",
    providers: [
      { name: "Luks Karadeniz", url: "https://lukskaradeniz.com" },
      { name: "Obilet", url: "https://obilet.com" },
    ],
  },
  {
    id: "izmir",
    routeType: "international",
    city: localized("Izmir", "იზმირი", "Измир"),
    country: localized("Turkey", "თურქეთი", "Турция"),
    duration: "22h",
    priceFrom: "160 GEL",
    providers: [
      { name: "Metro Georgia", url: "https://metrogeorgia.ge" },
      { name: "Obilet", url: "https://obilet.com" },
    ],
  },
  {
    id: "yerevan",
    routeType: "international",
    city: localized("Yerevan", "ერევანი", "Ереван"),
    country: localized("Armenia", "სომხეთი", "Армения"),
    duration: "5h",
    priceFrom: "35 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "gyumri",
    routeType: "international",
    city: localized("Gyumri", "გიუმრი", "Гюмри"),
    country: localized("Armenia", "სომხეთი", "Армения"),
    duration: "4h",
    priceFrom: "30 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "moscow",
    routeType: "international",
    city: localized("Moscow", "მოსკოვი", "Москва"),
    country: localized("Russia", "რუსეთი", "Россия"),
    duration: "36h",
    priceFrom: "200 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "vladikavkaz",
    routeType: "international",
    city: localized("Vladikavkaz", "ვლადიკავკაზი", "Владикавказ"),
    country: localized("Russia", "რუსეთი", "Россия"),
    duration: "4h",
    priceFrom: "40 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "samara",
    routeType: "international",
    city: localized("Samara", "სამარა", "Самара"),
    country: localized("Russia", "რუსეთი", "Россия"),
    duration: "30h",
    priceFrom: "180 GEL",
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
  {
    id: "other-international",
    routeType: "international",
    city: localized("Other international routes", "სხვა საერთაშორისო მარშრუტები", "Другие международные маршруты"),
    providers: [{ name: "TKT.ge", url: "https://tkt.ge/ortachala" }],
  },
];

const fallbackLeadershipMembers: LeadershipMember[] = [
  {
    id: "giorgi-suladze",
    name: "Giorgi Suladze",
    role: "chairman",
    phone: "+995 591 52 25 25",
    linkedin: "https://www.linkedin.com/in/giorgisuladze",
    whatsappEnabled: true,
  },
  {
    id: "merab-machavariani",
    name: "Merab Machavariani",
    role: "deputyChairman",
    phone: "+995 599 96 10 10",
    linkedin: "https://www.linkedin.com/in/merab-machavariani-046a46376",
    whatsappEnabled: true,
  },
  {
    id: "temur-jamrishvili",
    name: "Temur Jamrishvili",
    role: "ceo",
    phone: "+995 599 17 24 95",
    whatsappEnabled: true,
  },
  {
    id: "konstantine-rusadze",
    name: "Konstantine Rusadze",
    role: "deputyCeo",
    phone: "+995 577 58 23 23",
    whatsappEnabled: true,
  },
  {
    id: "nick-shonia",
    name: "Nick Shonia",
    role: "coo",
    phone: "+995 597 12 32 25",
    linkedin: "https://www.linkedin.com/in/nick-shonia-2209b434/",
    whatsappEnabled: true,
  },
  {
    id: "nana-sturua",
    name: "Nana Sturua",
    role: "chiefAccountant",
    phone: "+995 555 17 45 55",
    whatsappEnabled: true,
  },
];

const basePartners: BasePartner[] = [
  {
    id: "omnibus",
    name: "Omnibus",
    description: localized(
      "Reliable, comfortable, and efficient bus services to various destinations.",
      "საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.",
      "Надежные, комфортные и эффективные автобусные рейсы в различные направления.",
    ),
    routes: localized("Kutaisi, Batumi, Zugdidi", "ქუთაისი, ბათუმი, ზუგდიდი", "Кутаиси, Батуми, Зугдиди"),
    website: "https://omnibusexpress.ge/",
    logoUrl: omnibusLogo,
  },
  {
    id: "citybus",
    name: "CityBus",
    description: localized(
      "Reliable, comfortable, and efficient bus services to various destinations.",
      "საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.",
      "Надежные, комфортные и эффективные автобусные рейсы в различные направления.",
    ),
    routes: localized("Batumi, Kutaisi", "ბათუმი, ქუთაისი", "Батуми, Кутаиси"),
    website: "https://citybus.ge",
    logoUrl: citybusLogo,
  },
  {
    id: "metro-georgia",
    name: "Metro Georgia",
    description: localized(
      "Reliable, comfortable, and efficient bus services to various destinations.",
      "საიმედო, კომფორტული და ეფექტური ავტობუსის მომსახურება სხვადასხვა მიმართულებით.",
      "Надежные, комфортные и эффективные автобусные рейсы в различные направления.",
    ),
    routes: localized(
      "Batumi, Kutaisi, Zugdidi, Istanbul, Izmir",
      "ბათუმი, ქუთაისი, ზუგდიდი, სტამბული, იზმირი",
      "Батуми, Кутаиси, Зугдиди, Стамбул, Измир",
    ),
    website: "https://www.metrogeorgia.ge/",
    logoUrl: metroGeorgiaLogo,
  },
  {
    id: "luks-karadeniz",
    name: "Luks Karadeniz",
    description: localized(
      "International routes with reliable, comfortable, and efficient service.",
      "საერთაშორისო მარშრუტები საიმედო, კომფორტული და ეფექტური მომსახურებით.",
      "Международные маршруты с надежным, комфортным и эффективным обслуживанием.",
    ),
    routes: localized("Istanbul, Ankara, Trabzon", "სტამბული, ანკარა, ტრაბზონი", "Стамбул, Анкара, Трабзон"),
    website: "https://lukskaradeniz.com/",
    logoUrl: luksKaradenizLogo,
  },
  {
    id: "long-way",
    name: "Long Way",
    description: localized(
      "Comfortable travel to Armenia and beyond.",
      "კომფორტული მოგზაურობა სომხეთში და მის ფარგლებს გარეთ.",
      "Комфортные путешествия в Армению и далее.",
    ),
    routes: localized("Yerevan, Gyumri", "ერევანი, გიუმრი", "Ереван, Гюмри"),
    website: "https://longway.ge/",
    logoUrl: longWayLogo,
  },
  {
    id: "tkt-ge",
    name: "TKT.ge",
    description: localized(
      "Selected domestic and international route tickets.",
      "შერჩეული შიდა და საერთაშორისო მარშრუტების ბილეთები.",
      "Билеты на избранные внутренние и международные маршруты.",
    ),
    routes: localized(
      "Kakheti, Borjomi, Moscow, Vladikavkaz, Yerevan, Gyumri and many more",
      "კახეთი, ბორჯომი, მოსკოვი, ვლადიკავკაზი, ერევანი, გიუმრი და სხვა",
      "Кахетия, Боржоми, Москва, Владикавказ, Ереван, Гюмри и многое другое",
    ),
    website: "https://www.tkt.ge/ortachala",
    logoUrl: tktGeLogo,
  },
];

const contactFallbackContent: Record<Language, ContactContent> = {
  en: {
    badge: translations.en.contact.badge,
    title1: translations.en.contact.title1,
    title2: translations.en.contact.title2,
    description: translations.en.contact.description,
    addressLabel: translations.en.contact.address,
    addressValue: translations.en.contact.addressValue,
    addressNote: translations.en.contact.addressNote,
    phoneLabel: translations.en.contact.phone,
    phone: "+995 596 10 22 22",
    emailLabel: translations.en.contact.email,
    email: "info@busterminal.ge",
    hoursLabel: translations.en.contact.hours,
    terminalLabel: translations.en.contact.terminal,
    terminalHours: "24/7",
    infoDeskLabel: translations.en.contact.infoDesk,
    infoDeskHours: "06:00 - 22:00",
    followUsLabel: translations.en.contact.followUs,
    facebookUrl: "https://www.facebook.com/TBILISIBUSTERMINAL",
    instagramUrl: "https://www.instagram.com/tbilisibusterminal",
  },
  ka: {
    badge: translations.ka.contact.badge,
    title1: translations.ka.contact.title1,
    title2: translations.ka.contact.title2,
    description: translations.ka.contact.description,
    addressLabel: translations.ka.contact.address,
    addressValue: translations.ka.contact.addressValue,
    addressNote: translations.ka.contact.addressNote,
    phoneLabel: translations.ka.contact.phone,
    phone: "+995 596 10 22 22",
    emailLabel: translations.ka.contact.email,
    email: "info@busterminal.ge",
    hoursLabel: translations.ka.contact.hours,
    terminalLabel: translations.ka.contact.terminal,
    terminalHours: "24/7",
    infoDeskLabel: translations.ka.contact.infoDesk,
    infoDeskHours: "06:00 - 22:00",
    followUsLabel: translations.ka.contact.followUs,
    facebookUrl: "https://www.facebook.com/TBILISIBUSTERMINAL",
    instagramUrl: "https://www.instagram.com/tbilisibusterminal",
  },
  ru: {
    badge: translations.ru.contact.badge,
    title1: translations.ru.contact.title1,
    title2: translations.ru.contact.title2,
    description: translations.ru.contact.description,
    addressLabel: translations.ru.contact.address,
    addressValue: translations.ru.contact.addressValue,
    addressNote: translations.ru.contact.addressNote,
    phoneLabel: translations.ru.contact.phone,
    phone: "+995 596 10 22 22",
    emailLabel: translations.ru.contact.email,
    email: "info@busterminal.ge",
    hoursLabel: translations.ru.contact.hours,
    terminalLabel: translations.ru.contact.terminal,
    terminalHours: "24/7",
    infoDeskLabel: translations.ru.contact.infoDesk,
    infoDeskHours: "06:00 - 22:00",
    followUsLabel: translations.ru.contact.followUs,
    facebookUrl: "https://www.facebook.com/TBILISIBUSTERMINAL",
    instagramUrl: "https://www.instagram.com/tbilisibusterminal",
  },
};

const defaultFooterPopularRoutes: Record<Language, string[]> = {
  en: [
    "Tbilisi - Batumi",
    "Tbilisi - Kutaisi",
    "Tbilisi - Zugdidi",
    "Tbilisi - Mestia",
    "Tbilisi - Istanbul",
  ],
  ka: [
    "თბილისი - ბათუმი",
    "თბილისი - ქუთაისი",
    "თბილისი - ზუგდიდი",
    "თბილისი - მესტია",
    "თბილისი - სტამბული",
  ],
  ru: [
    "Тбилиси - Батуми",
    "Тбилиси - Кутаиси",
    "Тбилиси - Зугдиди",
    "Тбилиси - Местия",
    "Тбилиси - Стамбул",
  ],
};

const footerFallbackContent = (language: Language): FooterContent => ({
  brandTitle: "TBILISI",
  brandSubtitle: "Central Bus Terminal",
  description: translations[language].footer.description,
  privacyLabel: translations[language].footer.privacy,
  termsLabel: translations[language].footer.terms,
  popularRoutes: defaultFooterPopularRoutes[language],
});

const fallbackBlogLabel: Record<Language, string> = {
  en: "Blog",
  ka: "ბლოგი",
  ru: "Блог",
};

const fallbackNavigationPages = (language: Language): NavigationPage[] => [
  {
    id: "system-about",
    slug: "about",
    path: primaryPagePaths.about,
    label: translations[language].nav.aboutUs,
  },
  {
    id: "system-destinations",
    slug: "destinations",
    path: primaryPagePaths.destinations,
    label: translations[language].nav.destinations,
  },
  {
    id: "system-schedule",
    slug: "schedule",
    path: primaryPagePaths.schedule,
    label: translations[language].nav.schedule,
  },
  {
    id: "system-partners",
    slug: "partners",
    path: primaryPagePaths.partners,
    label: translations[language].nav.partners,
  },
  {
    id: "system-leadership",
    slug: "leadership",
    path: primaryPagePaths.leadership,
    label: translations[language].nav.leadership,
  },
  {
    id: "system-contact",
    slug: "contact",
    path: primaryPagePaths.contact,
    label: translations[language].nav.contact,
  },
  {
    id: "system-blog",
    slug: "blog",
    path: primaryPagePaths.blog,
    label: fallbackBlogLabel[language],
  },
];

export const getFallbackHomepageCms = (language: Language): HomePageCms => ({
  hero: heroFallbackContent[language],
  about: aboutFallbackContent[language],
  routes: localizeRoutes(language),
  partners: localizePartners(language),
  leadershipMembers: fallbackLeadershipMembers,
  contact: contactFallbackContent[language],
  footer: footerFallbackContent(language),
  navigationPages: fallbackNavigationPages(language),
});

const resolveLocalizedValue = (value: LocalizedValue, language: Language) => value[language];

const localizeRoutes = (language: Language): DestinationRoute[] =>
  baseRoutes.map((route) => ({
    id: route.id,
    routeType: route.routeType,
    city: resolveLocalizedValue(route.city, language),
    country: route.country ? resolveLocalizedValue(route.country, language) : undefined,
    duration: route.duration,
    priceFrom: route.priceFrom,
    providers: route.providers,
    showInFooter: route.showInFooter,
  }));

const localizePartners = (language: Language): Partner[] =>
  basePartners.map((partner) => ({
    id: partner.id,
    name: partner.name,
    description: resolveLocalizedValue(partner.description, language),
    routes: resolveLocalizedValue(partner.routes, language),
    website: partner.website,
    logoUrl: partner.logoUrl,
  }));

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const deepMerge = <T>(fallback: T, override: unknown): T => {
  if (override === null || override === undefined) {
    return fallback;
  }

  if (Array.isArray(fallback)) {
    return (Array.isArray(override) ? override : fallback) as T;
  }

  if (!isRecord(fallback) || !isRecord(override)) {
    return override as T;
  }

  const merged: Record<string, unknown> = { ...fallback };

  for (const [key, value] of Object.entries(override)) {
    const fallbackValue = merged[key];
    if (isRecord(fallbackValue) && isRecord(value)) {
      merged[key] = deepMerge(fallbackValue, value);
      continue;
    }

    merged[key] = value;
  }

  return merged as T;
};

const resolveMediaUrl = (value?: string | null) => resolveBackendMediaUrl(value);

const normalizeGallery = (gallery: GalleryImage[]) =>
  gallery.map((image) => ({
    ...image,
    src: resolveMediaUrl(image.src) ?? image.src,
  }));

const normalizeAboutContent = (content: AboutContent): AboutContent => ({
  ...content,
  gallery: normalizeGallery(content.gallery),
});

const buildFooterRoutes = (routes: DestinationRoute[], language: Language) => {
  const origin = language === "ka" ? "თბილისი" : language === "ru" ? "Тбилиси" : "Tbilisi";
  const selectedRoutes = routes.filter((route) => route.showInFooter).slice(0, 5);

  if (!selectedRoutes.length) {
    return defaultFooterPopularRoutes[language];
  }

  return selectedRoutes.map((route) => `${origin} - ${route.city}`);
};

export async function fetchHomepageCms(language: Language): Promise<HomePageCms> {
  const fallback = getFallbackHomepageCms(language);

  try {
    const data = await fetchJson<Partial<HomePageCms>>(`/api/cms/homepage?lang=${language}`);
    const merged = deepMerge(fallback, data) as HomePageCms;

    const routes = merged.routes?.length ? merged.routes : fallback.routes;
    const footerFallback = {
      ...merged.footer,
      popularRoutes: merged.footer?.popularRoutes?.length
        ? merged.footer.popularRoutes
        : buildFooterRoutes(routes, language),
    };

    return {
      hero: deepMerge(fallback.hero, merged.hero),
      about: normalizeAboutContent(deepMerge(fallback.about, merged.about)),
      routes,
      partners: (merged.partners?.length ? merged.partners : fallback.partners).map((partner) => ({
        ...partner,
        logoUrl: resolveMediaUrl(partner.logoUrl) ?? partner.logoUrl,
        seoImageUrl: resolveMediaUrl(partner.seoImageUrl) ?? partner.seoImageUrl,
      })),
      leadershipMembers: merged.leadershipMembers?.length ? merged.leadershipMembers : fallback.leadershipMembers,
      contact: deepMerge(fallback.contact, merged.contact),
      footer: deepMerge(footerFallbackContent(language), footerFallback),
      navigationPages: merged.navigationPages?.length ? merged.navigationPages : fallback.navigationPages,
    };
  } catch (error) {
    console.error("Failed to load homepage CMS content:", error);
    return fallback;
  }
}
