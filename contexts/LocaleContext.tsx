import React, { createContext, useContext, useState } from 'react';
import en from '@constants/locales/en';
import ru from '@constants/locales/ru';

type Locale = 'en' | 'ru';
type Translations = typeof en;
type TranslationParams = Record<string, string | number>;

interface LocaleContextType {
  t: Translations; // Объект с переводами (t.settings.title)
  tfunc: (key: string, params?: TranslationParams) => string; // Функция для интерполяции
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  t: en,
  tfunc: (key) => key,
  locale: 'en',
  setLocale: () => {},
});

export const LocaleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('en');
  const translations = locale === 'ru' ? ru : en;

  const tfunc = (key: string, params?: TranslationParams): string => {
    const keys = key.split('.');
    let value: any = translations;
    
    keys.forEach(k => {
      value = value?.[k];
    });

    if (typeof value !== 'string') return key;

    return params
      ? Object.entries(params).reduce(
          (str, [param, val]) => str.replace(`{${param}}`, val.toString()),
          value
        )
      : value;
  };

  return (
    <LocaleContext.Provider value={{ t: translations, tfunc, locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);