import type { Language } from "@/lib/translations";

const prefixes: Record<Language, string> = {
  en: "/en",
  ka: "/ge",
  ru: "/ru",
};

export const getLanguageFromPathname = (pathname: string): Language => {
  if (pathname === "/en" || pathname.startsWith("/en/")) return "en";
  if (pathname === "/ru" || pathname.startsWith("/ru/")) return "ru";
  if (pathname === "/ge" || pathname.startsWith("/ge/")) return "ka";
  return "ka";
};

export const stripLanguagePrefix = (pathname: string) => {
  if (pathname === "/en" || pathname === "/ru" || pathname === "/ge") {
    return "/";
  }

  if (pathname.startsWith("/en/") || pathname.startsWith("/ru/") || pathname.startsWith("/ge/")) {
    return pathname.slice(3) || "/";
  }

  return pathname || "/";
};

export const buildLocalizedPath = (language: Language, pathname = "/") => {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const cleanPath = normalized === "/" ? "" : normalized;
  return `${prefixes[language]}${cleanPath}` || prefixes[language];
};

export const getHomePath = (language: Language) => buildLocalizedPath(language, "/");
