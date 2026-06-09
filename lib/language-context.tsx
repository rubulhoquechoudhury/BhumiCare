"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { SupportedLanguage } from "@/lib/agri-glossary";
import { t } from "@/lib/agri-glossary";

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
  translateText: (text: string) => Promise<string>;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
  translateText: async (text) => text,
  isTranslating: false,
});

// Translation cache to avoid re-calling API for same text+lang combo
const translationCache = new Map<string, string>();

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>("en");
  const [isTranslating, setIsTranslating] = useState(false);

  // Load language from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("bhumicare_lang") as SupportedLanguage | null;
    if (stored && ["en", "hi", "as"].includes(stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem("bhumicare_lang", lang);
  }, []);

  // Translate dynamic AI text (not static UI)
  const translateText = useCallback(
    async (text: string): Promise<string> => {
      if (language === "en" || !text.trim()) return text;

      const cacheKey = `${language}::${text.slice(0, 100)}`;
      if (translationCache.has(cacheKey)) {
        return translationCache.get(cacheKey)!;
      }

      setIsTranslating(true);
      try {
        const res = await fetch("/api/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, targetLang: language }),
        });

        if (!res.ok) throw new Error("Translation failed");
        const data = await res.json();
        const translated = data.translated || text;
        translationCache.set(cacheKey, translated);
        return translated;
      } catch {
        return text; // Fallback to original on error
      } finally {
        setIsTranslating(false);
      }
    },
    [language]
  );

  const tWithLang = useCallback((key: string) => t(key, language), [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage, t: tWithLang, translateText, isTranslating }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
