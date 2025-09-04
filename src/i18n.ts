import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Load JSON translations
import enTranslation from './locales/en-US.json';
import ptTranslation from './locales/pt-BR.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      'en-US': { translation: enTranslation },
      'pt-BR': { translation: ptTranslation }
    },
    lng: 'pt-BR', // default language
    fallbackLng: 'en-US',
    interpolation: { escapeValue: false },
  });

export default i18n;