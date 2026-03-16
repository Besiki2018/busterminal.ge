import { LeadershipSection } from "@/components/LeadershipSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { translations } from "@/lib/translations";

const LeadershipPage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("leadership");
  const t = translations[language];
  const fallbackTitle = `${t.nav.leadership} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(t.leadership.description);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.leadership;

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
            type: "AboutPage",
          }),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: t.nav.leadership, path: pathname },
          ]),
        ],
      }}
    >
      <LeadershipSection members={cms.leadershipMembers} />
    </SectionPageShell>
  );
};

export default LeadershipPage;
