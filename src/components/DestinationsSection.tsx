import { MapPin, Clock, ExternalLink } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import type { DestinationRoute } from "@/lib/cms";

type DestinationsSectionProps = {
  routes: DestinationRoute[];
};

export const DestinationsSection = ({ routes }: DestinationsSectionProps) => {
  const { language, t } = useLanguage();
  const domesticRoutes = routes.filter((route) => route.routeType === "domestic");
  const internationalDestinations = routes.filter((route) => route.routeType === "international");

  return (
    <section id="destinations" className="py-12 md:py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t.destinations.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {t.destinations.title1}
            <span className="text-primary">{t.destinations.title2}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.destinations.description}
          </p>
        </div>

        {/* Domestic Routes - Horizontal Rows */}
        <div className="mb-12">
          <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t.destinations.domestic}
          </h3>
          <div className="space-y-3">
            {domesticRoutes.map((route) => (
              <div
                key={route.city}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-card rounded-xl border border-border px-5 py-4 hover:border-primary/40 shadow-card hover:shadow-elevated transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <h4 className="text-lg font-heading font-bold text-foreground group-hover:text-primary transition-colors min-w-[140px]">
                    {route.city}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {route.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {route.duration}
                      </span>
                    )}
                    {route.priceFrom && (
                      <span className="font-semibold text-foreground">
                        {language === "ka" ? `${route.priceFrom}-დან` : `${t.destinations.from} ${route.priceFrom}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {route.providers.map((provider) => (
                    <a
                      key={provider.name}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-muted hover:bg-primary hover:text-primary-foreground rounded-full transition-colors"
                    >
                      {provider.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* International Destinations */}
        <div>
          <h3 className="text-xl font-heading font-bold text-foreground mb-6 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            {t.destinations.international}
          </h3>
          <div className="space-y-3">
            {internationalDestinations.map((dest) => (
              <div
                key={dest.city}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-secondary rounded-xl px-5 py-4 hover:bg-secondary/90 transition-all duration-300"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                  <div className="min-w-[160px]">
                    {dest.country && (
                      <span className="text-xs font-medium text-secondary-foreground/70 uppercase tracking-wider">
                        {dest.country}
                      </span>
                    )}
                    <h4 className="text-lg font-heading font-bold text-secondary-foreground group-hover:text-primary transition-colors">
                      {dest.city}
                    </h4>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-secondary-foreground/80">
                    {dest.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {dest.duration}
                      </span>
                    )}
                    {dest.priceFrom && (
                      <span className="font-semibold text-primary">
                        {language === "ka" ? `${dest.priceFrom}-დან` : `${t.destinations.from} ${dest.priceFrom}`}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dest.providers.map((provider) => (
                    <a
                      key={provider.name}
                      href={provider.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-secondary-foreground/10 hover:bg-primary hover:text-primary-foreground text-secondary-foreground rounded-full transition-colors"
                    >
                      {provider.name}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
