import { DestinationsSection } from "@/components/DestinationsSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { translations } from "@/lib/translations";

const DestinationsPage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("destinations");
  const t = translations[language];
  const fallbackTitle = `${t.nav.destinations} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(t.destinations.description);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.destinations;
  const keywords =
    managedPage?.seoKeywords?.length
      ? managedPage.seoKeywords
      : [
          t.nav.destinations,
          language === "ka" ? "ავტობუსის ბილეთები" : language === "ru" ? "автобусные билеты" : "bus tickets",
          language === "ka" ? "ავტობუსის მარშრუტები" : language === "ru" ? "автобусные маршруты" : "bus routes",
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
            { name: t.nav.destinations, path: pathname },
          ]),
        ],
        keywords,
      }}
    >
      <DestinationsSection routes={cms.routes} />
    </SectionPageShell>
  );
};

export default DestinationsPage;
