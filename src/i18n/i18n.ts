import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/translation.json';
import tr from '@/locales/tr/translation.json';

const LANGUAGE_KEY = 'i18nextLng';
const savedLanguage = localStorage.getItem(LANGUAGE_KEY) || 'tr';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
      tr: {
        translation: tr
      }
    },
    lng: savedLanguage,
    fallbackLng: 'tr',
    defaultNS: 'translation',
    ns: ['translation'],
    debug: false,
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

i18n.on('languageChanged', (lng) => {
  localStorage.setItem(LANGUAGE_KEY, lng);
});

export default i18n;