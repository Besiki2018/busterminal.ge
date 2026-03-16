import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchPageBySlug } from "@/lib/site-content";

export const useManagedPageSeo = (slug: string) => {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ["managed-page-seo", slug, language],
    queryFn: () => fetchPageBySlug(slug, language),
    staleTime: 1000 * 60,
  });
};
