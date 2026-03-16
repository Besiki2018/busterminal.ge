import { ContactSection } from "@/components/ContactSection";
import { SectionPageShell } from "@/components/SectionPageShell";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import {
  buildBreadcrumbStructuredData,
  buildOrganizationStructuredData,
  buildWebPageStructuredData,
  siteNameByLanguage,
  truncateSeoText,
} from "@/lib/seo";
import { primaryPagePaths } from "@/lib/site-routes";
import { translations } from "@/lib/translations";

const ContactPage = () => {
  const { cms, language } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("contact");
  const t = translations[language];
  const fallbackTitle = `${t.nav.contact} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(cms.contact.description || cms.contact.addressValue);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.contact;

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
            type: "ContactPage",
          }),
          buildOrganizationStructuredData(language, cms.contact),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: t.nav.contact, path: pathname },
          ]),
        ],
      }}
    >
      <ContactSection content={cms.contact} />
    </SectionPageShell>
  );
};

export default ContactPage;
