import { AboutSection } from "@/components/AboutSection";
import { ContactSection } from "@/components/ContactSection";
import { DestinationsSection } from "@/components/DestinationsSection";
import { HeroSection } from "@/components/HeroSection";
import { LeadershipSection } from "@/components/LeadershipSection";
import { PartnersSection } from "@/components/PartnersSection";
import { ScheduleSection } from "@/components/ScheduleSection";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import {
  buildOrganizationStructuredData,
  buildWebPageStructuredData,
  buildWebsiteStructuredData,
  truncateSeoText,
} from "@/lib/seo";

const Index = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("home");
  const fallbackTitle =
    language === "ka"
      ? "თბილისის ცენტრალური ავტოსადგური | შიდა და საერთაშორისო რეისები"
      : language === "ru"
        ? "Тбилисский центральный автовокзал | внутренние и международные рейсы"
        : "Tbilisi Central Bus Terminal | Domestic and International Routes";
  const fallbackDescription = truncateSeoText(cms.hero.description);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || "/";

  return (
    <SiteLayout cms={cms}>
      <Seo
        title={title}
        description={description}
        image={managedPage?.seoImageUrl}
        noIndex={managedPage?.noIndex ?? false}
        keywords={managedPage?.seoKeywords ?? []}
        pathname={pathname}
        structuredData={[
          buildWebPageStructuredData({
            language,
            path: pathname,
            title,
            description,
            image: managedPage?.seoImageUrl,
            type: "WebPage",
          }),
          buildWebsiteStructuredData(language),
          buildOrganizationStructuredData(language, cms.contact),
        ]}
      />
      <HeroSection content={cms.hero} />
      <AboutSection content={cms.about} />
      <DestinationsSection routes={cms.routes} />
      <ScheduleSection />
      <PartnersSection partners={cms.partners} />
      <LeadershipSection members={cms.leadershipMembers} />
      <ContactSection content={cms.contact} />
    </SiteLayout>
  );
};

export default Index;
