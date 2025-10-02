import enTranslations from '@/locales/en.json';
import mrTranslations from '@/locales/mr.json';

export type Language = 'en' | 'mr';
export type TranslationKey = string;

const translations = {
  en: enTranslations,
  mr: mrTranslations,
};

export const getTranslation = (
  lang: Language,
  key: string
): string => {
  const keys = key.split('.');
  let value: any = translations[lang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation key not found: ${key} for language: ${lang}`);
      return key;
    }
  }
  
  return typeof value === 'string' ? value : key;
};

export const languages: { code: Language; name: string; nativeName: string }[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
];
