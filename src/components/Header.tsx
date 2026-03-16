import { useState } from "react";
import { Menu, X, Phone, Globe, MessageCircle, Facebook, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Language } from "@/lib/translations";
import type { ContactContent, NavigationPage } from "@/lib/cms";
import { buildLocalizedPath, getHomePath } from "@/lib/routing";

const languages: {
  code: Language;
  label: string;
  flag: string;
}[] = [{
  code: "en",
  label: "English",
  flag: "🇬🇧"
}, {
  code: "ka",
  label: "ქართული",
  flag: "🇬🇪"
}, {
  code: "ru",
  label: "Русский",
  flag: "🇷🇺"
}];

type HeaderProps = {
  contact: ContactContent;
  pages?: NavigationPage[];
};

const blogLabels: Record<Language, string> = {
  en: "Blog",
  ka: "ბლოგი",
  ru: "Блог",
};

export const Header = ({ contact, pages = [] }: HeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const {
    language,
    setLanguage,
    t
  } = useLanguage();
  const homePath = getHomePath(language);
  const fallbackNavItems = [{
    label: t.nav.aboutUs,
    href: buildLocalizedPath(language, "/about")
  }, {
    label: t.nav.destinations,
    href: buildLocalizedPath(language, "/destinations")
  }, {
    label: t.nav.schedule,
    href: buildLocalizedPath(language, "/schedule")
  }, {
    label: t.nav.partners,
    href: buildLocalizedPath(language, "/partners")
  }, {
    label: t.nav.leadership,
    href: buildLocalizedPath(language, "/leadership")
  }, {
    label: t.nav.contact,
    href: buildLocalizedPath(language, "/contact")
  }, {
    label: blogLabels[language],
    href: buildLocalizedPath(language, "/blog")
  }];
  const navItems = pages.length
    ? pages.map((page) => ({
        label: page.label,
        href: buildLocalizedPath(language, page.path),
      }))
    : fallbackNavItems;
  const currentLang = languages.find(l => l.code === language);
  return <header className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href={homePath} className="flex items-center group">
            <img alt="Tbilisi Central Bus Terminal" className="h-[4.25rem] w-auto group-hover:scale-105 transition-transform" src="/brand/busterminal-logo.png" />
          </a>

          {/* Desktop Navigation - hidden, using menu only */}

          {/* Language Selector & Phone & Mobile Menu */}
          <div className="flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative">
              <Button variant="ghost" size="sm" className="gap-2 font-heading text-[0.78rem] tracking-[0.12em]" onClick={() => setIsLangOpen(!isLangOpen)}>
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{currentLang?.flag} {currentLang?.label}</span>
                <span className="sm:hidden">{currentLang?.flag}</span>
              </Button>
              
              {isLangOpen && <div className="absolute top-full right-0 mt-2 bg-card border border-border rounded-lg shadow-elevated overflow-hidden animate-fade-in z-50">
              {languages.map(lang => <button key={lang.code} onClick={() => {
                setLanguage(lang.code);
                setIsLangOpen(false);
              }} className={`w-full px-4 py-2 text-left flex items-center gap-2 font-heading text-[0.78rem] tracking-[0.12em] hover:bg-muted transition-colors ${language === lang.code ? "bg-primary/10 text-primary" : ""}`}>
                      <span>{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.label}</span>
                    </button>)}
                </div>}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                <Phone className="w-4 h-4" />
                <span>{contact.phone}</span>
              </a>
              <a href={`https://wa.me/${contact.phone.replace(/[\s+]/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-green-600 transition-colors">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href={contact.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-pink-600 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
            
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Dropdown Navigation */}
        {isMenuOpen && <nav className="py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-2">
              {navItems.map(item => <a key={item.label} href={item.href} className="inline-flex min-h-10 items-center rounded-md px-4 py-2 text-left text-sm font-heading tracking-[0.14em] hover:bg-muted transition-colors" onClick={() => setIsMenuOpen(false)}>
                  {item.label}
                </a>)}
            </div>
          </nav>}
      </div>
    </header>;
};
