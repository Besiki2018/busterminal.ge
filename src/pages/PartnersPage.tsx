import { PartnersSection } from "@/components/PartnersSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { translations } from "@/lib/translations";

const PartnersPage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("partners");
  const t = translations[language];
  const fallbackTitle = `${t.nav.partners} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(
    language === "ka"
      ? `${t.partners.description} თითოეულ პარტნიორს ახლა საკუთარი SEO-ოპტიმიზებული გვერდი აქვს მიმართულებებით და ოფიციალური ბმულით.`
      : language === "ru"
        ? `${t.partners.description} У каждого партнёра теперь есть отдельная SEO-оптимизированная страница с направлениями и официальной ссылкой.`
        : `${t.partners.description} Each partner now has a dedicated SEO-optimized page with route coverage and an official website link.`,
  );
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.partners;

  return (
    <SectionPageShell
      cms={cms}
      seo={{
        title,
        description,
        image: managedPage?.seoImageUrl,
        noIndex: managedPage?.noIndex ?? false,
        keywords: managedPage?.seoKeywords ?? [],
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
            { name: t.nav.partners, path: pathname },
          ]),
        ],
      }}
    >
      <PartnersSection partners={cms.partners} />
    </SectionPageShell>
  );
};

export default PartnersPage;
