import { fetchJson, resolveBackendMediaUrl } from "@/lib/backend";
import type { Language } from "@/lib/translations";

export type SitePage = {
  id: string;
  slug: string;
  pageType: string;
  routePath?: string | null;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoImageUrl?: string | null;
  noIndex: boolean;
  showInNavigation: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImageUrl?: string | null;
  authorName: string;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  seoImageUrl?: string | null;
  noIndex: boolean;
};

const normalizePage = (page: SitePage): SitePage => ({
  ...page,
  coverImageUrl: resolveBackendMediaUrl(page.coverImageUrl),
  seoImageUrl: resolveBackendMediaUrl(page.seoImageUrl),
});

const normalizeBlogPost = (post: BlogPost): BlogPost => ({
  ...post,
  coverImageUrl: resolveBackendMediaUrl(post.coverImageUrl),
  seoImageUrl: resolveBackendMediaUrl(post.seoImageUrl),
});

export async function fetchPageBySlug(slug: string, language: Language): Promise<SitePage | null> {
  try {
    const page = await fetchJson<SitePage>(`/api/pages/${encodeURIComponent(slug)}?lang=${language}`);
    return normalizePage(page);
  } catch (error) {
    console.error("Failed to fetch page:", error);
    return null;
  }
}

export async function fetchPublishedBlogPosts(language: Language): Promise<BlogPost[]> {
  try {
    const posts = await fetchJson<BlogPost[]>(`/api/blog-posts?lang=${language}`);
    return posts.map(normalizeBlogPost);
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
    return [];
  }
}

export async function fetchBlogPostBySlug(slug: string, language: Language): Promise<BlogPost | null> {
  try {
    const post = await fetchJson<BlogPost>(`/api/blog-posts/${encodeURIComponent(slug)}?lang=${language}`);
    return normalizeBlogPost(post);
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    return null;
  }
}
