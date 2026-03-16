import { AboutSection } from "@/components/AboutSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";

const AboutPage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("about");
  const fallbackTitle = `${cms.about.title1} ${cms.about.title2} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(cms.about.description);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.about;

  return (
    <SectionPageShell
      cms={cms}
      seo={{
        title,
        description,
        image: managedPage?.seoImageUrl || cms.about.gallery[0]?.src,
        noIndex: managedPage?.noIndex ?? false,
        keywords: managedPage?.seoKeywords ?? [],
        pathname,
        structuredData: [
          buildWebPageStructuredData({
            language,
            path: pathname,
            title,
            description,
            image: managedPage?.seoImageUrl || cms.about.gallery[0]?.src,
            type: "AboutPage",
          }),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: cms.about.badge, path: pathname },
          ]),
        ],
      }}
    >
      <AboutSection content={cms.about} />
    </SectionPageShell>
  );
};

export default AboutPage;
