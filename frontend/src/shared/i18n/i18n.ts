import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import arTranslation from './locales/ar.json';
import enTranslation from './locales/en.json';

export const resources = {
  ar: { translation: arTranslation },
  en: { translation: enTranslation },
} as const;

export type SupportedLanguage = 'ar' | 'en';

const savedLang = (localStorage.getItem('fbsu_lang') as SupportedLanguage) || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'fbsu_lang',
      caches: ['localStorage'],
    },
  });

export function updateDocumentDirection(lang: SupportedLanguage) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.body.style.fontFamily = 'var(--font-ar)';
  } else {
    document.body.style.fontFamily = 'var(--font-en)';
  }
}

// Initial document sync
updateDocumentDirection(savedLang);

export default i18n;

