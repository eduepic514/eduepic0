export interface LanguageOption {
  code: string;
  label: string;
  nativeName: string;
  flag: string;
  dir: "ltr" | "rtl";
}

export const LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeName: "English", flag: "🇬🇧", dir: "ltr" },
  { code: "ur", label: "Urdu", nativeName: "اردو", flag: "🇵🇰", dir: "rtl" },
  { code: "ar", label: "Arabic", nativeName: "العربية", flag: "🇸🇦", dir: "rtl" },
  { code: "es", label: "Spanish", nativeName: "Español", flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "French", nativeName: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", label: "German", nativeName: "Deutsch", flag: "🇩🇪", dir: "ltr" },
  { code: "zh", label: "Chinese", nativeName: "中文", flag: "🇨🇳", dir: "ltr" },
  { code: "hi", label: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳", dir: "ltr" },
  { code: "tr", label: "Turkish", nativeName: "Türkçe", flag: "🇹🇷", dir: "ltr" },
];

export const DEFAULT_LANGUAGE = "en";
export const RTL_LANGUAGES = LANGUAGES.filter((l) => l.dir === "rtl").map((l) => l.code);
export const SUPPORTED_LANGUAGE_CODES = LANGUAGES.map((l) => l.code);

export const getLanguageByCode = (code: string): LanguageOption =>
  LANGUAGES.find((l) => l.code === code) ?? LANGUAGES[0];
