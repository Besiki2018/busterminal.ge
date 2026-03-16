import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { type Language, translations } from "@/lib/translations";
import { buildLocalizedPath, getLanguageFromPathname, stripLanguagePrefix } from "@/lib/routing";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [language, setLanguageState] = useState<Language>(getLanguageFromPathname(location.pathname));

  // Sync language with URL on path change
  useEffect(() => {
    const pathLang = getLanguageFromPathname(location.pathname);
    if (pathLang !== language) {
      setLanguageState(pathLang);
    }
  }, [language, location.pathname]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    const targetPath = stripLanguagePrefix(location.pathname);
    navigate(`${buildLocalizedPath(lang, targetPath)}${location.search}${location.hash}`);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
