import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import en from "../locales/en.json"
import zh from "../locales/zh.json"
import zhTW from "../locales/zh-TW.json"
import ja from "../locales/ja.json"
import ko from "../locales/ko.json"
import es from "../locales/es.json"
import fr from "../locales/fr.json"
import de from "../locales/de.json"

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      zh: { translation: zh },
      "zh-TW": { translation: zhTW },
      ja: { translation: ja },
      ko: { translation: ko },
      es: { translation: es },
      fr: { translation: fr },
      de: { translation: de },
    },
    supportedLngs: ["en", "zh", "zh-TW", "ja", "ko", "es", "fr", "de"],
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      caches: ["localStorage"],
      lookupLocalStorage: "mighta-lang",
    },
  })

export default i18n

export const LANGUAGES = [
  { code: "auto", label: "Auto", short: "AUTO", flag: "✦" },
  { code: "en", label: "English", short: "EN", flag: "EN" },
  { code: "zh", label: "简体中文", short: "中", flag: "中" },
  { code: "zh-TW", label: "繁體中文", short: "繁", flag: "繁" },
  { code: "ja", label: "日本語", short: "日", flag: "日" },
  { code: "ko", label: "한국어", short: "한", flag: "한" },
  { code: "es", label: "Español", short: "ES", flag: "ES" },
  { code: "fr", label: "Français", short: "FR", flag: "FR" },
  { code: "de", label: "Deutsch", short: "DE", flag: "DE" },
] as const

export type LangCode = (typeof LANGUAGES)[number]["code"]
