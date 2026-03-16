import { useQuery } from "@tanstack/react-query";
import { RichContent } from "@/components/RichContent";
import { useParams } from "react-router-dom";
import { Seo } from "@/components/Seo";
import { SiteLayout } from "@/components/SiteLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useHomepageCms } from "@/hooks/useHomepageCms";
import {
  buildArticleStructuredData,
  buildBreadcrumbStructuredData,
  buildWebPageStructuredData,
  siteNameByLanguage,
  truncateSeoText,
} from "@/lib/seo";
import { fetchBlogPostBySlug } from "@/lib/site-content";
import NotFound from "@/pages/NotFound";

const BlogPostPage = () => {
  const { slug } = useParams();
  const { language } = useLanguage();
  const { cms } = useHomepageCms();

  const { data: post, isLoading } = useQuery({
    queryKey: ["blog-post", slug, language],
    queryFn: () => fetchBlogPostBySlug(slug ?? "", language),
    enabled: Boolean(slug),
  });

  if (!isLoading && !post) {
    return <NotFound />;
  }

  const fallbackTitle = post ? `${post.title} | ${siteNameByLanguage[language]}` : siteNameByLanguage[language];
  const fallbackDescription = truncateSeoText(post?.excerpt || post?.content);
  const title = post?.seoTitle || fallbackTitle;
  const description = post?.seoDescription || fallbackDescription;

  return (
    <SiteLayout cms={cms}>
      <Seo
        title={title}
        description={description}
        image={post?.seoImageUrl || post?.coverImageUrl}
        type="article"
        publishedTime={post?.publishedAt}
        author={post?.authorName}
        noIndex={post?.noIndex ?? false}
        keywords={post?.seoKeywords ?? []}
        structuredData={
          post
            ? [
                buildWebPageStructuredData({
                  language,
                  path: `/blog/${post.slug}`,
                  title,
                  description,
                  image: post.seoImageUrl || post.coverImageUrl,
                  type: "BlogPosting",
                }),
                buildArticleStructuredData({
                  language,
                  path: `/blog/${post.slug}`,
                  title: post.title,
                  description,
                  image: post.seoImageUrl || post.coverImageUrl,
                  publishedTime: post.publishedAt,
                  authorName: post.authorName,
                }),
                buildBreadcrumbStructuredData(language, [
                  { name: siteNameByLanguage[language], path: "/" },
                  { name: language === "ka" ? "ბლოგი" : language === "ru" ? "Блог" : "Blog", path: "/blog" },
                  { name: post.title, path: `/blog/${post.slug}` },
                ]),
              ]
            : undefined
        }
      />
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            {post?.coverImageUrl && (
              <img src={post.coverImageUrl} alt={post.title} className="h-[280px] w-full object-cover md:h-[420px]" />
            )}
            <div className="p-8 md:p-10">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-primary">
                {post
                  ? new Date(post.publishedAt).toLocaleDateString(language === "ka" ? "ka-GE" : language === "ru" ? "ru-RU" : "en-US")
                  : ""}
              </p>
              <h1 className="mb-4 text-3xl font-heading font-bold text-foreground md:text-5xl">{post?.title}</h1>
              <p className="mb-8 text-sm uppercase tracking-[0.2em] text-muted-foreground">{post?.authorName}</p>
              {post?.excerpt && <p className="mb-8 text-lg text-muted-foreground">{post.excerpt}</p>}
              <RichContent
                html={post?.content}
                className="prose prose-stone max-w-none text-foreground/90"
              />
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
};

export default BlogPostPage;
