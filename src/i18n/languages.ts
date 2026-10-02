/**
 * World Languages Registry for MateRateDate
 * Supports 20 primary global languages across all continents, including RTL direction.
 */

export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  direction: "ltr" | "rtl";
  region: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇦🇺", direction: "ltr", region: "Global / Australia" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸", direction: "ltr", region: "Spain & Latin America" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷", direction: "ltr", region: "France & Francophonie" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪", direction: "ltr", region: "Germany, Austria, Switzerland" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷", direction: "ltr", region: "Brazil & Portugal" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹", direction: "ltr", region: "Italy" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵", direction: "ltr", region: "Japan" },
  { code: "zh", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳", direction: "ltr", region: "China & Singapore" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷", direction: "ltr", region: "South Korea" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇦🇪", direction: "rtl", region: "Middle East & North Africa" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", direction: "ltr", region: "India" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩", direction: "ltr", region: "Indonesia" },
  { code: "tl", name: "Filipino", nativeName: "Filipino / Tagalog", flag: "🇵🇭", direction: "ltr", region: "Philippines" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳", direction: "ltr", region: "Vietnam" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺", direction: "ltr", region: "Eastern Europe & Central Asia" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱", direction: "ltr", region: "Netherlands & Belgium" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷", direction: "ltr", region: "Greece & Cyprus" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", direction: "ltr", region: "Turkey" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪", direction: "ltr", region: "Sweden & Scandinavia" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱", direction: "ltr", region: "Poland" },
];

export const DEFAULT_LANGUAGE = "en";

export function getLanguageInfo(code: string): SupportedLanguage {
  const found = SUPPORTED_LANGUAGES.find((l) => l.code === code.toLowerCase().split("-")[0]);
  return found || SUPPORTED_LANGUAGES[0];
}
