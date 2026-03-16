import { ArrowRight, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { RichContent } from "@/components/RichContent";
import { useLanguage } from "@/contexts/LanguageContext";
import type { Partner } from "@/lib/cms";
import { getPartnerPagePath, getPartnerSlug } from "@/lib/partners";
import { buildLocalizedPath } from "@/lib/routing";

type PartnersSectionProps = {
  partners: Partner[];
};

const detailLabel = {
  en: "Open profile",
  ka: "გვერდის ნახვა",
  ru: "Открыть страницу",
} as const;

const websiteLabel = {
  en: "Website",
  ka: "ვებსაიტი",
  ru: "Сайт",
} as const;

export const PartnersSection = ({ partners }: PartnersSectionProps) => {
  const { t, language } = useLanguage();

  return (
    <section id="partners" className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t.partners.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {t.partners.title1}
            <span className="text-primary">{t.partners.title2}</span>
          </h2>
        </div>

        {/* Partner Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {partners.map((partner) => (
            <article
              key={getPartnerSlug(partner)}
              className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-elevated"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-20 h-16 rounded-lg bg-white flex items-center justify-center p-2 overflow-hidden">
                  <img 
                    src={partner.logoUrl || "/placeholder.svg"} 
                    alt={`${partner.name} logo`}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  {partner.name}
                </span>
              </div>
              <Link
                to={buildLocalizedPath(language, getPartnerPagePath(getPartnerSlug(partner)))}
                className="text-lg font-heading font-bold text-foreground transition-colors hover:text-primary"
              >
                {partner.name}
              </Link>
              <RichContent
                html={partner.description}
                className="mb-3 text-sm text-muted-foreground"
              />
              <p className="text-xs text-primary font-medium">{partner.routes}</p>

              <div className="mt-auto flex flex-wrap gap-3 pt-5">
                <Link
                  to={buildLocalizedPath(language, getPartnerPagePath(getPartnerSlug(partner)))}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                >
                  {detailLabel[language]}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/30 hover:text-primary"
                  >
                    {websiteLabel[language]}
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
