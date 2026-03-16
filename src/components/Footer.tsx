import { Bus, MapPin, Phone, Mail } from "lucide-react";
import { RichContent } from "@/components/RichContent";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ContactContent, FooterContent, NavigationPage } from "@/lib/cms";
import { buildLocalizedPath } from "@/lib/routing";
import { primaryPagePaths } from "@/lib/site-routes";

type FooterProps = {
  content: FooterContent;
  contact: ContactContent;
  pages?: NavigationPage[];
};

const fallbackBlogLabel = {
  en: "Blog",
  ka: "ბლოგი",
  ru: "Блог",
};

export const Footer = ({ content, contact, pages = [] }: FooterProps) => {
  const currentYear = new Date().getFullYear();
  const { language, t } = useLanguage();

  const fallbackQuickLinks = [
    { label: t.nav.aboutUs, href: buildLocalizedPath(language, primaryPagePaths.about) },
    { label: t.nav.destinations, href: buildLocalizedPath(language, primaryPagePaths.destinations) },
    { label: t.nav.schedule, href: buildLocalizedPath(language, primaryPagePaths.schedule) },
    { label: t.nav.partners, href: buildLocalizedPath(language, primaryPagePaths.partners) },
    { label: t.nav.contact, href: buildLocalizedPath(language, primaryPagePaths.contact) },
    { label: fallbackBlogLabel[language], href: buildLocalizedPath(language, primaryPagePaths.blog) },
  ];
  const quickLinks = pages.length
    ? pages.slice(0, 8).map((page) => ({
        label: page.label,
        href: buildLocalizedPath(language, page.path),
      }))
    : fallbackQuickLinks;

  return (
    <footer className="bg-secondary text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-lg font-heading font-bold">{content.brandTitle}</span>
                <span className="block text-xs font-heading font-semibold text-primary uppercase tracking-wider">
                  {content.brandSubtitle}
                </span>
              </div>
            </div>
            <RichContent
              html={content.description}
              className="text-sm leading-relaxed text-white/70"
            />
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold mb-5">{t.footer.quickLinks}</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Routes */}
          <div>
            <h4 className="font-heading font-bold mb-5">{t.footer.popularRoutes}</h4>
            <ul className="space-y-3">
              {content.popularRoutes.map((route) => (
                <li key={route}>
                  <a
                    href={buildLocalizedPath(language, primaryPagePaths.destinations)}
                    className="text-white/70 hover:text-primary transition-colors text-sm"
                  >
                    {route}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-bold mb-5">{t.footer.contactInfo}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-white/70 text-sm">
                  {contact.addressValue}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="text-white/70 text-sm hover:text-primary transition-colors">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a href={`mailto:${contact.email}`} className="text-white/70 text-sm hover:text-primary transition-colors">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/60 text-sm">
            © {currentYear} Tbilisi Central Bus Terminal. {t.footer.rights}
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-white/60 hover:text-primary text-sm transition-colors">
              {content.privacyLabel}
            </a>
            <a href="#" className="text-white/60 hover:text-primary text-sm transition-colors">
              {content.termsLabel}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
