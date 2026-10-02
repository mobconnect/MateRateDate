import React, { createContext, useContext, useState, useEffect } from "react";
import {
  SupportedLanguage,
  SUPPORTED_LANGUAGES,
  DEFAULT_LANGUAGE,
  getLanguageInfo,
} from "./languages";
import { TRANSLATIONS, TranslationSchema } from "./translations";

interface I18nContextType {
  currentLanguage: SupportedLanguage;
  locale: string;
  setLanguage: (code: string) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  supportedLanguages: SupportedLanguage[];
  translations: TranslationSchema;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<string>(() => {
    if (typeof window !== "undefined" && window.localStorage) {
      const saved = localStorage.getItem("mrd_selected_language");
      if (saved && TRANSLATIONS[saved]) {
        return saved;
      }
      if (navigator.language) {
        const browserCode = navigator.language.toLowerCase().split("-")[0];
        if (TRANSLATIONS[browserCode]) {
          return browserCode;
        }
      }
    }
    return DEFAULT_LANGUAGE;
  });

  const currentLanguage = getLanguageInfo(locale);
  const isRTL = currentLanguage.direction === "rtl";
  const translations = TRANSLATIONS[locale] || TRANSLATIONS[DEFAULT_LANGUAGE];

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("mrd_selected_language", locale);
      } catch (e) {
        // ignore
      }
      if (document.documentElement) {
        document.documentElement.lang = locale;
        document.documentElement.dir = currentLanguage.direction;
      }
    }
  }, [locale, currentLanguage.direction]);

  const setLanguage = (code: string) => {
    const targetCode = code.toLowerCase().split("-")[0];
    if (TRANSLATIONS[targetCode]) {
      setLocale(targetCode);
    }
  };

  /**
   * Type-safe key resolver with fallback to English and parameter replacement
   */
  const t = (path: string, params?: Record<string, string | number>): string => {
    const parts = path.split(".");
    let current: any = translations;
    let fallback: any = TRANSLATIONS[DEFAULT_LANGUAGE];

    let found = true;
    for (const part of parts) {
      if (current && typeof current === "object" && part in current) {
        current = current[part];
      } else {
        found = false;
        break;
      }
    }

    let result = found && typeof current === "string" ? current : "";

    if (!result) {
      // Fallback to English
      for (const part of parts) {
        if (fallback && typeof fallback === "object" && part in fallback) {
          fallback = fallback[part];
        } else {
          return path;
        }
      }
      result = typeof fallback === "string" ? fallback : path;
    }

    if (params) {
      for (const [key, val] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${key}}`, "g"), String(val));
      }
    }

    return result;
  };

  return (
    <I18nContext.Provider
      value={{
        currentLanguage,
        locale,
        setLanguage,
        t,
        isRTL,
        supportedLanguages: SUPPORTED_LANGUAGES,
        translations,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
};

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    const fallbackLang = getLanguageInfo(DEFAULT_LANGUAGE);
    return {
      currentLanguage: fallbackLang,
      locale: DEFAULT_LANGUAGE,
      setLanguage: () => {},
      t: (path: string) => path,
      isRTL: false,
      supportedLanguages: SUPPORTED_LANGUAGES,
      translations: TRANSLATIONS[DEFAULT_LANGUAGE],
    };
  }
  return context;
}
