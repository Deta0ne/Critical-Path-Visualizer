import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from '@/locales/en/translation.json';
import tr from '@/locales/tr/translation.json';

const resources = {
  en: {
    translation: en
  },
  tr: {
    translation: tr
  }
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false, 
    interpolation: {
      escapeValue: false,
    }
  });

export default i18n;