import { useParams } from "react-router-dom";
import { RichContent } from "@/components/RichContent";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { buildBreadcrumbStructuredData, buildWebPageStructuredData, siteNameByLanguage, truncateSeoText } from "@/lib/seo";
import { fetchPageBySlug } from "@/lib/site-content";
import NotFound from "@/pages/NotFound";
import { useQuery } from "@tanstack/react-query";

const DynamicPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { cms } = useHomepageCms();

  const { data: page, isLoading } = useQuery({
    queryKey: ["site-page", slug, language],
    queryFn: () => fetchPageBySlug(slug ?? "", language),
    enabled: Boolean(slug),
  });

  if (!isLoading && !page) {
    return <NotFound />;
  }

  const fallbackTitle = page ? `${page.title} | ${siteNameByLanguage[language]}` : siteNameByLanguage[language];
  const fallbackDescription = truncateSeoText(page?.excerpt || page?.content);
  const title = page?.seoTitle || fallbackTitle;
  const description = page?.seoDescription || fallbackDescription;
  const pathname = page?.routePath || `/page/${page?.slug ?? slug ?? ""}`;

  return (
    <SiteLayout cms={cms}>
      <Seo
        title={title}
        description={description}
        image={page?.seoImageUrl || page?.coverImageUrl}
        noIndex={page?.noIndex ?? false}
        keywords={page?.seoKeywords ?? []}
        pathname={pathname}
        structuredData={
          page
            ? [
                buildWebPageStructuredData({
                  language,
                  path: pathname,
                  title,
                  description,
                  image: page.seoImageUrl || page.coverImageUrl,
                }),
                buildBreadcrumbStructuredData(language, [
                  { name: siteNameByLanguage[language], path: "/" },
                  { name: page.title, path: pathname },
                ]),
              ]
            : undefined
        }
      />
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          {page?.coverImageUrl && (
            <div className="mb-8 overflow-hidden rounded-3xl border border-border shadow-card">
              <img src={page.coverImageUrl} alt={page.title} className="h-[280px] w-full object-cover md:h-[360px]" />
            </div>
          )}
          <div className="mx-auto max-w-4xl rounded-3xl bg-card p-8 shadow-card border border-border">
            <h1 className="mb-4 text-3xl font-heading font-bold text-foreground md:text-5xl">{page?.title}</h1>
            {page?.excerpt && <p className="mb-8 text-lg text-muted-foreground">{page.excerpt}</p>}
            <RichContent
              html={page?.content}
              className="prose prose-stone max-w-none text-foreground/90"
            />
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default DynamicPage;
