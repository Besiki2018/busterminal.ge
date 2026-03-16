import { ScheduleSection } from "@/components/ScheduleSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { translations } from "@/lib/translations";

const SchedulePage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("schedule");
  const t = translations[language];
  const fallbackTitle = `${t.nav.schedule} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(t.schedule.description || t.schedule.note);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.schedule;
  const keywords =
    managedPage?.seoKeywords?.length
      ? managedPage.seoKeywords
      : [
          t.nav.schedule,
          language === "ka" ? "ავტობუსის განრიგი" : language === "ru" ? "расписание автобусов" : "bus schedule",
          language === "ka" ? "გამგზავრება" : language === "ru" ? "отправления" : "departures",
        ];

  return (
    <SectionPageShell
      cms={cms}
      seo={{
        title,
        description,
        image: managedPage?.seoImageUrl,
        noIndex: managedPage?.noIndex ?? false,
        pathname,
        structuredData: [
          buildWebPageStructuredData({
            language,
            path: pathname,
            title,
            description,
            image: managedPage?.seoImageUrl,
            type: "CollectionPage",
          }),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: t.nav.schedule, path: pathname },
          ]),
        ],
        keywords,
      }}
    >
      <ScheduleSection />
    </SectionPageShell>
  );
};

export default SchedulePage;
