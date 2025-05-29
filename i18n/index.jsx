import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

import en from './en.json';
import ru from './ru.json';

const locale = Localization?.locale || 'en';
const lng = locale.startsWith('ru') ? 'ru' : 'en';

i18n
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    lng,
    compatibilityJSON: 'v3',
    resources: {
      en: { translation: en },
      ru: { translation: ru },
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
