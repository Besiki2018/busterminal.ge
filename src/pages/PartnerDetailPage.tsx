import { ArrowLeft, ArrowUpRight, BadgeCheck, Globe, MapPinned } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { RichContent } from "@/components/RichContent";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { findPartnerBySlug, getPartnerPageMeta, getPartnerPagePath } from "@/lib/partners";
import { buildLocalizedPath } from "@/lib/routing";
import {
  buildBreadcrumbStructuredData,
  buildLocalizedAbsoluteUrl,
  buildWebPageStructuredData,
  siteNameByLanguage,
  toAbsoluteUrl,
} from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { useLanguage } from "@/contexts/LanguageContext";
import NotFound from "@/pages/NotFound";

const PartnerDetailPage = () => {
  const { slug = "" } = useParams();
  const { language, t } = useLanguage();
  const { cms, isFetching } = useHomepageCms();

  const partner = findPartnerBySlug(cms.partners, slug);

  if (!partner) {
    if (isFetching) {
      return null;
    }

    return <NotFound />;
  }

  const meta = getPartnerPageMeta(partner, language);
  const detailPath = getPartnerPagePath(meta.slug);

  return (
    <SiteLayout cms={cms}>
      <Seo
        title={meta.title}
        description={meta.description}
        image={meta.image}
        pathname={detailPath}
        keywords={meta.keywords}
        noIndex={meta.noIndex}
        structuredData={[
          buildWebPageStructuredData({
            language,
            path: detailPath,
            title: meta.title,
            description: meta.description,
            image: meta.image,
          }),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: t.nav.partners, path: primaryPagePaths.partners },
            { name: partner.name, path: detailPath },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: partner.name,
            description: meta.description,
            url: partner.website,
            logo: toAbsoluteUrl(meta.image),
            sameAs: partner.website ? [partner.website] : undefined,
            memberOf: {
              "@type": "Organization",
              name: siteNameByLanguage[language],
              url: buildLocalizedAbsoluteUrl(language, "/"),
            },
          },
        ]}
      />

      <section className="bg-muted/30 pb-10 pt-32 md:pb-14">
        <div className="container mx-auto px-4">
          <Link
            to={buildLocalizedPath(language, primaryPagePaths.partners)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <ArrowLeft className="h-4 w-4" />
            {meta.copy.backToPartners}
          </Link>

          <div className="grid gap-6 xl:grid-cols-[1.5fr,0.8fr]">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card md:p-10">
              <span className="inline-flex rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
                {meta.copy.eyebrow}
              </span>
              <h1 className="mt-5 text-4xl font-heading font-bold text-foreground md:text-6xl">{partner.name}</h1>
              <p className="mt-4 max-w-3xl text-lg leading-8 text-muted-foreground">{meta.overview}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {meta.routes.map((route) => (
                  <span
                    key={`${partner.name}-${route}`}
                    className="rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
                  >
                    {route}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    {meta.copy.officialWebsite}
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                )}
                <Link
                  to={buildLocalizedPath(language, primaryPagePaths.partners)}
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                >
                  {meta.copy.backToPartners}
                </Link>
              </div>
            </div>

            <aside className="rounded-[2rem] border border-border bg-card p-8 shadow-card">
              <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white p-4 shadow-sm">
                <img src={partner.logoUrl || "/placeholder.svg"} alt={`${partner.name} logo`} className="h-full w-full object-contain" />
              </div>

              <div className="mt-8 space-y-6">
                <div className="rounded-2xl bg-muted/60 p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <BadgeCheck className="h-4 w-4" />
                    {meta.copy.categoryLabel}
                  </div>
                  <p className="text-base font-semibold text-foreground">{meta.category}</p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <MapPinned className="h-4 w-4" />
                    {meta.copy.routeListTitle}
                  </div>
                  <p className="text-base font-semibold text-foreground">{meta.copy.routeCountLabel(meta.routes.length)}</p>
                </div>

                <div className="rounded-2xl bg-muted/60 p-5">
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                    <Globe className="h-4 w-4" />
                    {meta.copy.websiteLabel}
                  </div>
                  <p className="break-all text-base text-foreground/80">{partner.website}</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <section className="pb-16 md:pb-20">
        <div className="container mx-auto grid gap-6 px-4 xl:grid-cols-[1.15fr,0.85fr]">
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card md:p-10">
            <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">{meta.copy.aboutTitle}</h2>
            <RichContent
              html={partner.description}
              className="mt-5 text-base leading-8 text-muted-foreground"
            />

            <div className="mt-8 rounded-3xl border border-dashed border-border bg-muted/40 p-6">
              <h3 className="text-lg font-heading font-bold text-foreground">{meta.copy.routeListTitle}</h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{meta.copy.routeListDescription}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                {meta.routes.map((route) => (
                  <span key={`route-pill-${route}`} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                    {route}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] border border-border bg-card p-8 shadow-card md:p-10">
              <h2 className="text-2xl font-heading font-bold text-foreground md:text-3xl">{meta.copy.highlightsTitle}</h2>
              <ul className="mt-6 space-y-4">
                {meta.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm leading-7 text-muted-foreground">
                    <BadgeCheck className="mt-1 h-4 w-4 shrink-0 text-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[2rem] border border-border bg-primary p-8 text-white shadow-card md:p-10">
              <h2 className="text-2xl font-heading font-bold md:text-3xl">{meta.copy.infoTitle}</h2>
              <p className="mt-4 text-sm leading-7 text-white/85">{meta.copy.infoDescription(partner.name)}</p>
              {partner.website && (
                <a
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-primary transition-colors hover:bg-white/90"
                >
                  {meta.copy.officialWebsite}
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default PartnerDetailPage;
