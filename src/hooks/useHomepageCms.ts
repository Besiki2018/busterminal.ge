import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/contexts/LanguageContext";
import { fetchHomepageCms, getFallbackHomepageCms } from "@/lib/cms";

export const useHomepageCms = () => {
  const { language } = useLanguage();
  const fallbackCms = getFallbackHomepageCms(language);

  const query = useQuery({
    queryKey: ["homepage-cms", language],
    queryFn: () => fetchHomepageCms(language),
    initialData: fallbackCms,
    staleTime: 1000 * 60,
  });

  return {
    ...query,
    language,
    cms: query.data ?? fallbackCms,
  };
};
