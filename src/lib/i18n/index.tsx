'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import ruMessages from '@/messages/ru.json';
import enMessages from '@/messages/en.json';
import kkMessages from '@/messages/kk.json';

export type Locale = 'ru' | 'en' | 'kk';

export const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: 'ru', label: 'RU', flag: '🇷🇺' },
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'kk', label: 'KK', flag: '🇰🇿' },
];

export const DEFAULT_LOCALE: Locale = 'ru';

type MessagesType = typeof ruMessages;

const dictionaries: Record<Locale, MessagesType> = {
  ru: ruMessages,
  en: enMessages,
  kk: kkMessages,
};

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^|;\\s*)' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days = 365) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
}

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    // Check cookie first, then localStorage
    const cookieLocale = getCookie('fa_locale') as Locale | null;
    const localLocale = (typeof window !== 'undefined' ? localStorage.getItem('fa_locale') : null) as Locale | null;
    const preferred = cookieLocale || localLocale;

    if (preferred && (preferred === 'ru' || preferred === 'en' || preferred === 'kk')) {
      setLocaleState(preferred);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie('fa_locale', newLocale);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('fa_locale', newLocale);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    
    // Helper to traverse dictionary
    const resolve = (dict: any): string | null => {
      let current = dict;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return null;
        }
      }
      return typeof current === 'string' ? current : null;
    };

    // Try current locale
    let text = resolve(dictionaries[locale]);

    // Fallback to Russian if missing
    if (!text && locale !== 'ru') {
      text = resolve(dictionaries.ru);
    }

    // Fallback to key itself if still missing
    if (!text) {
      return key;
    }

    // Interpolate params: e.g. {current} of {total}
    if (params) {
      return Object.entries(params).reduce((acc, [paramKey, paramVal]) => {
        return acc.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
      }, text);
    }

    return text;
  }, [locale]);

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useTranslation() {
  const context = useContext(I18nContext);
  if (!context) {
    // Graceful fallback outside provider
    return {
      locale: DEFAULT_LOCALE,
      setLocale: () => {},
      t: (key: string, params?: Record<string, string | number>) => {
        const keys = key.split('.');
        let current: any = ruMessages;
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k];
          } else {
            return key;
          }
        }
        let text = typeof current === 'string' ? current : key;
        if (params) {
          for (const [pk, pv] of Object.entries(params)) {
            text = text.replace(new RegExp(`\\{${pk}\\}`, 'g'), String(pv));
          }
        }
        return text;
      },
    };
  }
  return context;
}

export const useI18n = useTranslation;
