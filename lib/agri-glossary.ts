// BhumiCare AI — Agricultural Glossary
// Context-aware bilingual terms for EN / Hindi / Assamese

export type SupportedLanguage = "en" | "hi" | "as";

export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: "English",
  hi: "हिन्दी",
  as: "অসমীয়া",
};

export const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: "EN",
  hi: "हि",
  as: "অ",
};

// Key agricultural terms with translations
// Format: term_key → { en, hi, as }
export const AGRI_GLOSSARY: Record<string, Record<SupportedLanguage, string>> = {
  soil_ph: {
    en: "Soil pH",
    hi: "मिट्टी की अम्लता (pH)",
    as: "মাটিৰ pH (অম্লতা)",
  },
  moisture: {
    en: "Soil Moisture",
    hi: "मिट्टी की नमी",
    as: "মাটিৰ আৰ্দ্ৰতা",
  },
  nitrogen: {
    en: "Nitrogen (N)",
    hi: "नाइट्रोजन (N)",
    as: "নাইট্ৰ'জেন (N)",
  },
  phosphorus: {
    en: "Phosphorus (P)",
    hi: "फॉस्फोरस (P)",
    as: "ফছফৰাছ (P)",
  },
  potassium: {
    en: "Potassium (K)",
    hi: "पोटैशियम (K)",
    as: "পটাছিয়াম (K)",
  },
  first_flush: {
    en: "First Flush (Spring harvest)",
    hi: "पहली फसल (वसंत कटाई)",
    as: "প্ৰথম ফ্লাছ (বসন্তৰ চপোৱা)",
  },
  second_flush: {
    en: "Second Flush (Summer harvest)",
    hi: "दूसरी फसल (गर्मी कटाई)",
    as: "দ্বিতীয় ফ্লাছ (গ্ৰীষ্মকালীন চপোৱা)",
  },
  rain_flush: {
    en: "Rain Flush (Monsoon harvest)",
    hi: "वर्षा फसल (मानसून कटाई)",
    as: "বৰষুণ ফ্লাছ (বাৰিষাকালীন চপোৱা)",
  },
  autumn_flush: {
    en: "Autumn Flush",
    hi: "शरद ऋतु की फसल",
    as: "শৰৎকালীন ফ্লাছ",
  },
  ctc_tea: {
    en: "CTC Tea (Crush, Tear, Curl)",
    hi: "CTC चाय (पीसना, फाड़ना, मोड़ना)",
    as: "CTC চাহ",
  },
  orthodox_tea: {
    en: "Orthodox Tea",
    hi: "ऑर्थोडॉक्स चाय",
    as: "অৰ্থ'ড'ক্স চাহ",
  },
  fertilizer: {
    en: "Fertilizer",
    hi: "उर्वरक / खाद",
    as: "সাৰ",
  },
  compost: {
    en: "Compost",
    hi: "खाद / कम्पोस्ट",
    as: "পচন সাৰ",
  },
  pruning: {
    en: "Pruning",
    hi: "छंटाई",
    as: "ছাঁটনি",
  },
  tea_garden: {
    en: "Tea Garden",
    hi: "चाय बागान",
    as: "চাহ বাগিচা",
  },
  soil_health: {
    en: "Soil Health",
    hi: "मिट्टी का स्वास्थ्य",
    as: "মাটিৰ স্বাস্থ্য",
  },
  harvest: {
    en: "Harvest",
    hi: "कटाई / फसल",
    as: "চপোৱা",
  },
  yield: {
    en: "Yield",
    hi: "उत्पादन",
    as: "উৎপাদন",
  },
};

// UI translations dictionary
export const UI_TRANSLATIONS: Record<SupportedLanguage, Record<string, string>> = {
  en: {
    // Navigation
    "nav.chat": "AI Chat",
    "nav.market": "Market",
    "nav.settings": "Settings",
    // Chat
    "chat.placeholder": "Ask about soil, tea cultivation, or market trends...",
    "chat.empty.title": "Hello",
    "chat.empty.subtitle": "I'm your AI soil advisor. Ask me anything about tea cultivation, or tap the flask to analyze your soil.",
    "chat.send": "Send",
    "chat.thinking": "Analyzing...",
    // Market
    "market.title": "Market Intelligence",
    "market.subtitle": "AI-powered tea price forecast",
    "market.signal.sell": "Sell Now",
    "market.signal.hold": "Hold Stock",
    "market.signal.wait": "Wait for Better Price",
    "market.trend.rising": "Price Rising",
    "market.trend.stable": "Price Stable",
    "market.trend.falling": "Price Falling",
    "market.confidence": "Confidence",
    "market.refresh": "Refresh Prediction",
    "market.disclaimer": "AI Forecast · Not financial advice",
    "market.history": "Price Trend (12 months)",
    "market.factors": "Key Factors",
    "market.ai_explanation": "AI Analysis",
    "market.loading": "Generating market prediction...",
    // Soil
    "soil.title": "Soil Parameters",
    "soil.analyze": "Analyze Soil",
    "soil.reanalyze": "Re-Analyze",
    "soil.demo": "Load Demo",
    "soil.reset": "Reset",
    "soil.last_updated": "Last updated",
    // Settings
    "settings.language": "Language",
    "settings.region": "Region",
    "settings.profile": "Profile",
    "settings.logout": "Logout",
  },
  hi: {
    "nav.chat": "AI चैट",
    "nav.market": "बाज़ार",
    "nav.settings": "सेटिंग्स",
    "chat.placeholder": "मिट्टी, चाय की खेती, या बाज़ार के बारे में पूछें...",
    "chat.empty.title": "नमस्ते",
    "chat.empty.subtitle": "मैं आपका AI मिट्टी सलाहकार हूं। चाय की खेती के बारे में कुछ भी पूछें।",
    "chat.send": "भेजें",
    "chat.thinking": "विश्लेषण हो रहा है...",
    "market.title": "बाज़ार विश्लेषण",
    "market.subtitle": "AI-आधारित चाय मूल्य पूर्वानुमान",
    "market.signal.sell": "अभी बेचें",
    "market.signal.hold": "स्टॉक रोकें",
    "market.signal.wait": "बेहतर कीमत का इंतज़ार करें",
    "market.trend.rising": "कीमत बढ़ रही है",
    "market.trend.stable": "कीमत स्थिर",
    "market.trend.falling": "कीमत घट रही है",
    "market.confidence": "विश्वसनीयता",
    "market.refresh": "पूर्वानुमान ताज़ा करें",
    "market.disclaimer": "AI पूर्वानुमान · वित्तीय सलाह नहीं",
    "market.history": "मूल्य प्रवृत्ति (12 महीने)",
    "market.factors": "मुख्य कारक",
    "market.ai_explanation": "AI विश्लेषण",
    "market.loading": "बाज़ार पूर्वानुमान तैयार हो रहा है...",
    "soil.title": "मिट्टी के मापदंड",
    "soil.analyze": "मिट्टी का विश्लेषण",
    "soil.reanalyze": "दोबारा विश्लेषण",
    "soil.demo": "नमूना लोड करें",
    "soil.reset": "रीसेट",
    "soil.last_updated": "अंतिम अपडेट",
    "settings.language": "भाषा",
    "settings.region": "क्षेत्र",
    "settings.profile": "प्रोफ़ाइल",
    "settings.logout": "लॉगआउट",
  },
  as: {
    "nav.chat": "AI চাট",
    "nav.market": "বজাৰ",
    "nav.settings": "ছেটিংছ",
    "chat.placeholder": "মাটি, চাহ খেতি, বা বজাৰৰ বিষয়ে সোধক...",
    "chat.empty.title": "নমস্কাৰ",
    "chat.empty.subtitle": "মই আপোনাৰ AI মাটি পৰামৰ্শদাতা। চাহ খেতিৰ বিষয়ে যিকোনো প্ৰশ্ন কৰক।",
    "chat.send": "পঠাওক",
    "chat.thinking": "বিশ্লেষণ কৰা হৈছে...",
    "market.title": "বজাৰ বিশ্লেষণ",
    "market.subtitle": "AI-ভিত্তিক চাহৰ মূল্য পূৰ্বানুমান",
    "market.signal.sell": "এতিয়াই বিক্ৰী কৰক",
    "market.signal.hold": "মজুত ৰাখক",
    "market.signal.wait": "ভাল মূল্যৰ বাবে অপেক্ষা কৰক",
    "market.trend.rising": "মূল্য বাঢ়িছে",
    "market.trend.stable": "মূল্য স্থিৰ",
    "market.trend.falling": "মূল্য কমিছে",
    "market.confidence": "আস্থা",
    "market.refresh": "পূৰ্বানুমান সতেজ কৰক",
    "market.disclaimer": "AI পূৰ্বানুমান · বিত্তীয় পৰামৰ্শ নহয়",
    "market.history": "মূল্যৰ প্ৰবণতা (১২ মাহ)",
    "market.factors": "মূল কাৰণসমূহ",
    "market.ai_explanation": "AI বিশ্লেষণ",
    "market.loading": "বজাৰ পূৰ্বানুমান প্ৰস্তুত হৈছে...",
    "soil.title": "মাটিৰ পৰামিতি",
    "soil.analyze": "মাটি বিশ্লেষণ কৰক",
    "soil.reanalyze": "পুনৰ বিশ্লেষণ",
    "soil.demo": "নমুনা লোড কৰক",
    "soil.reset": "ৰিছেট",
    "soil.last_updated": "শেষবাৰ আপডেট",
    "settings.language": "ভাষা",
    "settings.region": "অঞ্চল",
    "settings.profile": "প্ৰ'ফাইল",
    "settings.logout": "লগআউট",
  },
};

export function t(key: string, lang: SupportedLanguage): string {
  return UI_TRANSLATIONS[lang]?.[key] ?? UI_TRANSLATIONS["en"]?.[key] ?? key;
}
