import { Clock, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { fallbackDepartures, fetchDisplaySchedules } from "@/lib/api/schedules";

export const ScheduleSection = () => {
  const { language, t } = useLanguage();
  const { data: departures = fallbackDepartures } = useQuery({
    queryKey: ["display-schedules", language],
    queryFn: () => fetchDisplaySchedules(language),
    initialData: fallbackDepartures,
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60 * 5,
  });

  return (
    <section id="schedule" className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-4">
            {t.schedule.badge}
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4">
            {t.schedule.title1}
            <span className="text-primary">{t.schedule.title2}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t.schedule.description}
          </p>
        </div>

        {/* Schedule Table */}
        <div className="bg-card rounded-2xl border border-border shadow-elevated overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-secondary text-white">
                  <th className="px-6 py-4 text-left font-heading font-semibold">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {t.schedule.time}
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left font-heading font-semibold">
                    {t.schedule.destination}
                  </th>
                  <th className="px-6 py-4 text-left font-heading font-semibold hidden sm:table-cell">
                    {t.schedule.operator}
                  </th>
                  <th className="px-6 py-4 text-right font-heading font-semibold">
                    {t.schedule.buyTicket}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {departures.map((item, index) => (
                  <tr
                    key={index}
                    className="hover:bg-muted/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="text-lg font-heading font-bold text-foreground">
                        {item.time}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-foreground">
                        {item.destination}
                      </span>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell text-muted-foreground">
                      {item.operator}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={item.buyTicketUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold hover:bg-primary hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-3 h-3" />
                        {t.schedule.buyTicket}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          {t.schedule.note}
        </p>
      </div>
    </section>
  );
};
