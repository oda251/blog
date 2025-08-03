import ja from './ja';
import en from './en';

const languages = {
  ja: ja,
  en: en,
};
typeof ja;
const defaultLang = 'ja';

// `T` は翻訳データの型、`K` はキーの型
type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

// 再帰的にネストされたキーをすべて取得する型
type Leaves<T> = T extends object
  ? {
      [K in keyof T]: Join<K, Leaves<T[K]>>;
    }[keyof T]
  : '';

type TranslationData = typeof ja;
type TranslationKeys = Leaves<TranslationData>;

export function getLangFromUrl(url: URL) {
  const lang = url.pathname.split('/').at(1);
  if (lang in languages) return lang as keyof typeof languages;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof languages) {
  return function t<T extends TranslationKeys>(key: T) {
    // ドット区切りのキーを分割して、オブジェクトを辿るロジック
    const keys = key.split('.');
    let value = languages[lang];
    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        return null; // キーが見つからない場合
      }
    }
    return typeof value === 'string' ? value : null;
  };
}
