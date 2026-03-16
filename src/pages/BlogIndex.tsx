import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import { useManagedPageSeo } from "@/hooks/useManagedPageSeo";
import {
  buildBreadcrumbStructuredData,
  buildWebPageStructuredData,
  siteNameByLanguage,
  truncateSeoText,
} from "@/lib/seo";
import { buildLocalizedPath } from "@/lib/routing";
import { primaryPagePaths } from "@/lib/site-routes";
import { fetchPublishedBlogPosts } from "@/lib/site-content";
import { useLanguage } from "@/contexts/LanguageContext";

const blogTitle: Record<string, string> = {
  en: "Blog",
  ka: "ბლოგი",
  ru: "Блог",
};

const blogDescription: Record<string, string> = {
  en: "News, updates, and stories from Tbilisi Central Bus Terminal.",
  ka: "სიახლეები, განახლებები და ისტორიები თბილისის ცენტრალური ავტოსადგურიდან.",
  ru: "Новости, обновления и истории Тбилисского центрального автовокзала.",
};

const BlogIndex = () => {
  const { language } = useLanguage();
  const { cms } = useHomepageCms();
  const { data: managedPage } = useManagedPageSeo("blog");

  const { data: posts = [] } = useQuery({
    queryKey: ["blog-posts", language],
    queryFn: () => fetchPublishedBlogPosts(language),
  });

  const fallbackTitle = `${blogTitle[language]} | ${siteNameByLanguage[language]}`;
  const fallbackDescription = truncateSeoText(blogDescription[language]);
  const title = managedPage?.seoTitle || fallbackTitle;
  const description = managedPage?.seoDescription || fallbackDescription;
  const pathname = managedPage?.routePath || primaryPagePaths.blog;

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
            type: "Blog",
          }),
          buildBreadcrumbStructuredData(language, [
            { name: siteNameByLanguage[language], path: "/" },
            { name: blogTitle[language], path: pathname },
          ]),
        ]}
      />
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              {blogTitle[language]}
            </span>
            <h1 className="mt-4 text-3xl font-heading font-bold text-foreground md:text-5xl">{blogTitle[language]}</h1>
            <p className="mt-4 text-lg text-muted-foreground">{blogDescription[language]}</p>
          </div>

          {posts.length === 0 ? (
            <div className="mx-auto max-w-2xl rounded-3xl border border-dashed border-border bg-card p-10 text-center shadow-card">
              <p className="text-muted-foreground">
                {language === "ka"
                  ? "ბლოგ პოსტები ჯერ არ დამატებულა."
                  : language === "ru"
                    ? "Посты в блоге пока не добавлены."
                    : "No blog posts have been published yet."}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <article key={post.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  {post.coverImageUrl && (
                    <img src={post.coverImageUrl} alt={post.title} className="h-52 w-full object-cover" />
                  )}
                  <div className="p-6">
                    <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">
                      {new Date(post.publishedAt).toLocaleDateString(language === "ka" ? "ka-GE" : language === "ru" ? "ru-RU" : "en-US")}
                    </p>
                    <h2 className="mb-3 text-2xl font-heading font-bold text-foreground">{post.title}</h2>
                    {post.excerpt && <p className="mb-5 text-sm leading-7 text-muted-foreground">{post.excerpt}</p>}
                    <Link
                      to={buildLocalizedPath(language, `/blog/${post.slug}`)}
                      className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                    >
                      {language === "ka" ? "წაკითხვა" : language === "ru" ? "Читать" : "Read More"}
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteLayout>
  );
};

export default BlogIndex;
