"use client";

import { LANGUAGE_FLAGS, LANGUAGE_NAMES, SupportedLanguage } from "@/lib/agri-glossary";
import { useLanguage } from "@/lib/language-context";
import { Globe } from "lucide-react";

const LANGUAGES: SupportedLanguage[] = ["en", "hi", "as"];

export default function LanguageSwitch() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 sm:gap-1.5 bg-white/80 backdrop-blur border border-border-light rounded-2xl px-1.5 sm:px-2 py-1 sm:py-1.5 shadow-sm">
      <Globe size={14} className="text-text-muted shrink-0 hidden sm:block" />
      <div className="flex gap-0.5 sm:gap-1">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            title={LANGUAGE_NAMES[lang]}
            className={`
              px-2 sm:px-2.5 py-1 rounded-xl text-[11px] sm:text-xs font-bold transition-all duration-200
              ${language === lang
                ? "bg-accent text-white shadow-sm"
                : "text-text-secondary hover:bg-surface hover:text-text-primary"
              }
            `}
          >
            {LANGUAGE_FLAGS[lang]}
          </button>
        ))}
      </div>
    </div>
  );
}
