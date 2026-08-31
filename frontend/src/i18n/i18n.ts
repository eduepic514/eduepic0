import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Cookies from "js-cookie";

import en from "../locales/en/common.json";
import ur from "../locales/ur/common.json";
import ar from "../locales/ar/common.json";
import es from "../locales/es/common.json";
import fr from "../locales/fr/common.json";
import de from "../locales/de/common.json";
import zh from "../locales/zh/common.json";
import hi from "../locales/hi/common.json";
import tr from "../locales/tr/common.json";

import { DEFAULT_LANGUAGE, RTL_LANGUAGES } from "../constants/languages";

export const resources = {
  en: { common: en },
  ur: { common: ur },
  ar: { common: ar },
  es: { common: es },
  fr: { common: fr },
  de: { common: de },
  zh: { common: zh },
  hi: { common: hi },
  tr: { common: tr },
} as const;

export const applyDocumentDirection = (lng: string) => {
  const dir = RTL_LANGUAGES.includes(lng) ? "rtl" : "ltr";
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.setAttribute("lang", lng);
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: Object.keys(resources),
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false },
    detection: {
      // Priority: saved user choice (localStorage/cookie) -> browser language -> html tag
      order: ["localStorage", "cookie", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
      lookupLocalStorage: "eduepic_lang",
      lookupCookie: "eduepic_lang",
    },
  });

i18n.on("languageChanged", (lng) => {
  applyDocumentDirection(lng);
  Cookies.set("eduepic_lang", lng, { expires: 365 });
  localStorage.setItem("eduepic_lang", lng);
});

// Apply direction immediately on load
applyDocumentDirection(i18n.resolvedLanguage || DEFAULT_LANGUAGE);

export default i18n;
