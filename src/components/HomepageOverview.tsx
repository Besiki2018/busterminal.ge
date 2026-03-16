import {
  ArrowRight,
  CalendarClock,
  Handshake,
  MapPinned,
  Newspaper,
  PhoneCall,
  Route,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import type { HomePageCms } from "@/lib/cms";
import { getPartnerPagePath, getPartnerSlug } from "@/lib/partners";
import { buildLocalizedPath } from "@/lib/routing";
import { primaryPagePaths } from "@/lib/site-routes";
import type { Language } from "@/lib/translations";

type HomepageOverviewProps = {
  cms: HomePageCms;
};

const overviewCopy: Record<
  Language,
  {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
    blogDescription: string;
    featuredPartners: string;
    featuredPartnersDescription: string;
  }
> = {
  en: {
    eyebrow: "Explore the terminal",
    title: "The landing page is now split into focused pages",
    description:
      "Browse dedicated sections for routes, schedules, partners, leadership, contact details, and blog updates. Each page now has its own URL and SEO metadata.",
    cta: "Open page",
    blogDescription: "Read updates, announcements, and stories from Tbilisi Central Bus Terminal.",
    featuredPartners: "Partner profiles",
    featuredPartnersDescription: "Open dedicated SEO-ready pages for each featured transport partner directly from the homepage.",
  },
  ka: {
    eyebrow: "ნავიგაცია",
    title: "მთავარი თემები გადავიდა საკუთარ გვერდებზე",
    description:
      "მიმართულებები, განრიგი, პარტნიორები, ხელმძღვანელობა, კონტაქტი და ბლოგი უკვე ცალკე URL-ებზეა გამოტანილი, რომ სტუმარმა სწრაფად იპოვოს ზუსტად ის ინფორმაცია, რაც სჭირდება.",
    cta: "გვერდზე გადასვლა",
    blogDescription: "იხილე სიახლეები, განცხადებები და ისტორიები თბილისის ცენტრალური ავტოსადგურიდან.",
    featuredPartners: "პარტნიორის გვერდები",
    featuredPartnersDescription: "მთავარი გვერდიდანვე გადადი პარტნიორების ცალკე SEO-ოპტიმიზებულ გვერდებზე.",
  },
  ru: {
    eyebrow: "Навигация",
    title: "Основные темы вынесены на отдельные страницы",
    description:
      "Маршруты, расписание, партнёры, руководство, контакты и блог теперь доступны на отдельных URL с собственными SEO-метаданными.",
    cta: "Открыть страницу",
    blogDescription: "Читайте новости, объявления и истории Тбилисского центрального автовокзала.",
    featuredPartners: "Страницы партнёров",
    featuredPartnersDescription: "Переходите на отдельные SEO-оптимизированные страницы транспортных партнёров прямо с главной страницы.",
  },
};

const countLabel = (language: Language, count: number, singular: string, plural: string) => {
  if (language === "ka") {
    return `${count} ${singular}`;
  }

  if (language === "ru") {
    return `${count} ${count === 1 ? singular : plural}`;
  }

  return `${count} ${count === 1 ? singular : plural}`;
};

export const HomepageOverview = ({ cms }: HomepageOverviewProps) => {
  const { language, t } = useLanguage();
  const copy = overviewCopy[language];

  const cards = [
    {
      label: t.nav.aboutUs,
      href: buildLocalizedPath(language, primaryPagePaths.about),
      description: cms.about.description,
      meta: countLabel(language, cms.about.gallery.length, "ფოტო", "ფოტო"),
      icon: MapPinned,
    },
    {
      label: t.nav.destinations,
      href: buildLocalizedPath(language, primaryPagePaths.destinations),
      description: t.destinations.description,
      meta: countLabel(language, cms.routes.length, language === "ka" ? "მიმართულება" : language === "ru" ? "маршрут" : "route", language === "ka" ? "მიმართულება" : language === "ru" ? "маршрутов" : "routes"),
      icon: Route,
    },
    {
      label: t.nav.schedule,
      href: buildLocalizedPath(language, primaryPagePaths.schedule),
      description: t.schedule.description || t.schedule.note,
      meta: language === "ka" ? "ცოცხალი განახლება" : language === "ru" ? "живое обновление" : "live updates",
      icon: CalendarClock,
    },
    {
      label: t.nav.partners,
      href: buildLocalizedPath(language, primaryPagePaths.partners),
      description: t.partners.description,
      meta: countLabel(language, cms.partners.length, language === "ka" ? "პარტნიორი" : language === "ru" ? "партнёр" : "partner", language === "ka" ? "პარტნიორი" : language === "ru" ? "партнёров" : "partners"),
      icon: Handshake,
    },
    {
      label: t.nav.leadership,
      href: buildLocalizedPath(language, primaryPagePaths.leadership),
      description: t.leadership.description,
      meta: countLabel(language, cms.leadershipMembers.length, language === "ka" ? "წევრი" : language === "ru" ? "участник" : "member", language === "ka" ? "წევრი" : language === "ru" ? "участников" : "members"),
      icon: Users,
    },
    {
      label: t.nav.contact,
      href: buildLocalizedPath(language, primaryPagePaths.contact),
      description: cms.contact.description,
      meta: cms.contact.phone,
      icon: PhoneCall,
    },
    {
      label: language === "ka" ? "ბლოგი" : language === "ru" ? "Блог" : "Blog",
      href: buildLocalizedPath(language, primaryPagePaths.blog),
      description: copy.blogDescription,
      meta: language === "ka" ? "სიახლეები და სტატიები" : language === "ru" ? "новости и статьи" : "news and articles",
      icon: Newspaper,
    },
  ];

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
            {copy.eyebrow}
          </span>
          <h2 className="mt-4 text-3xl font-heading font-bold text-foreground md:text-5xl">
            {copy.title}
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">{copy.description}</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <Link
                key={card.label}
                to={card.href}
                className="group flex h-full flex-col rounded-[2rem] border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-elevated"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    {card.meta}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-heading font-bold text-foreground transition-colors group-hover:text-primary">
                  {card.label}
                </h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-muted-foreground">
                  {card.description}
                </p>

                <div className="mt-auto pt-6">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    {copy.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {cms.partners.length > 0 && (
          <div className="mt-12 rounded-[2rem] border border-border bg-card p-6 shadow-card md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <h3 className="text-2xl font-heading font-bold text-foreground">{copy.featuredPartners}</h3>
                <p className="mt-2 max-w-3xl text-sm leading-7 text-muted-foreground">
                  {copy.featuredPartnersDescription}
                </p>
              </div>
              <Link
                to={buildLocalizedPath(language, primaryPagePaths.partners)}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                {t.nav.partners}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {cms.partners.map((partner) => (
                <Link
                  key={getPartnerSlug(partner)}
                  to={buildLocalizedPath(language, getPartnerPagePath(getPartnerSlug(partner)))}
                  className="group flex items-center gap-4 rounded-2xl border border-border bg-background px-4 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
                >
                  <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-sm">
                    <img src={partner.logoUrl || "/placeholder.svg"} alt={`${partner.name} logo`} className="h-full w-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-base font-heading font-bold text-foreground transition-colors group-hover:text-primary">
                      {partner.name}
                    </p>
                    <p className="mt-1 truncate text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {partner.routes}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
