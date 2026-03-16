import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { buildLocalizedPath, stripLanguagePrefix } from "@/lib/routing";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import DynamicPage from "@/pages/DynamicPage";
import BlogIndex from "@/pages/BlogIndex";
import BlogPostPage from "@/pages/BlogPostPage";
import Admin from "@/pages/Admin";
import AboutPage from "@/pages/AboutPage";
import DestinationsPage from "@/pages/DestinationsPage";
import SchedulePage from "@/pages/SchedulePage";
import PartnersPage from "@/pages/PartnersPage";
import PartnerDetailPage from "@/pages/PartnerDetailPage";
import LeadershipPage from "@/pages/LeadershipPage";
import ContactPage from "@/pages/ContactPage";

const DefaultLocaleRedirect = () => {
  const location = useLocation();
  const targetPath = buildLocalizedPath("ka", stripLanguagePrefix(location.pathname));

  return <Navigate to={`${targetPath}${location.search}${location.hash}`} replace />;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/admin" element={<Admin />} />
    <Route path="/" element={<DefaultLocaleRedirect />} />
    <Route path="/about" element={<DefaultLocaleRedirect />} />
    <Route path="/destinations" element={<DefaultLocaleRedirect />} />
    <Route path="/schedule" element={<DefaultLocaleRedirect />} />
    <Route path="/partners" element={<DefaultLocaleRedirect />} />
    <Route path="/partners/:slug" element={<DefaultLocaleRedirect />} />
    <Route path="/leadership" element={<DefaultLocaleRedirect />} />
    <Route path="/contact" element={<DefaultLocaleRedirect />} />
    <Route path="/page/:slug" element={<DefaultLocaleRedirect />} />
    <Route path="/blog" element={<DefaultLocaleRedirect />} />
    <Route path="/blog/:slug" element={<DefaultLocaleRedirect />} />
    <Route path="/en" element={<Index />} />
    <Route path="/ge" element={<Index />} />
    <Route path="/ru" element={<Index />} />
    <Route path="/en/about" element={<AboutPage />} />
    <Route path="/ge/about" element={<AboutPage />} />
    <Route path="/ru/about" element={<AboutPage />} />
    <Route path="/en/destinations" element={<DestinationsPage />} />
    <Route path="/ge/destinations" element={<DestinationsPage />} />
    <Route path="/ru/destinations" element={<DestinationsPage />} />
    <Route path="/en/schedule" element={<SchedulePage />} />
    <Route path="/ge/schedule" element={<SchedulePage />} />
    <Route path="/ru/schedule" element={<SchedulePage />} />
    <Route path="/en/partners" element={<PartnersPage />} />
    <Route path="/ge/partners" element={<PartnersPage />} />
    <Route path="/ru/partners" element={<PartnersPage />} />
    <Route path="/en/partners/:slug" element={<PartnerDetailPage />} />
    <Route path="/ge/partners/:slug" element={<PartnerDetailPage />} />
    <Route path="/ru/partners/:slug" element={<PartnerDetailPage />} />
    <Route path="/en/leadership" element={<LeadershipPage />} />
    <Route path="/ge/leadership" element={<LeadershipPage />} />
    <Route path="/ru/leadership" element={<LeadershipPage />} />
    <Route path="/en/contact" element={<ContactPage />} />
    <Route path="/ge/contact" element={<ContactPage />} />
    <Route path="/ru/contact" element={<ContactPage />} />
    <Route path="/en/page/:slug" element={<DynamicPage />} />
    <Route path="/ge/page/:slug" element={<DynamicPage />} />
    <Route path="/ru/page/:slug" element={<DynamicPage />} />
    <Route path="/en/blog" element={<BlogIndex />} />
    <Route path="/ge/blog" element={<BlogIndex />} />
    <Route path="/ru/blog" element={<BlogIndex />} />
    <Route path="/en/blog/:slug" element={<BlogPostPage />} />
    <Route path="/ge/blog/:slug" element={<BlogPostPage />} />
    <Route path="/ru/blog/:slug" element={<BlogPostPage />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
);
