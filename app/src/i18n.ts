// app/src/i18n.ts
import en from '../locales/en/translation.json';
import ja from '../locales/ja/translation.json';

type Lang = 'en' | 'ja';

const translations: Record<Lang, Record<string, string>> = { en, ja };

export function getLang(): Lang {
  if (typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/jp')) return 'ja';
    if (window.location.pathname.startsWith('/en')) return 'en';
  }
  return 'en';
}

export function t(key: string): string {
  const lang = getLang();
  return translations[lang][key] || key;
}
