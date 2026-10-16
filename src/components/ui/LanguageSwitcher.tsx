'use client';

import React from 'react';
import { useTranslation, LOCALES, Locale } from '@/lib/i18n';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'header' | 'sidebar' | 'minimal';
}

export function LanguageSwitcher({ className = '', variant = 'header' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useTranslation();

  return (
    <div
      className={`inline-flex items-center p-1 rounded-lg bg-gray-100 border border-gray-200 text-xs font-semibold ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {LOCALES.map(({ code, label }) => {
        const isActive = locale === code;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code as Locale)}
            className={`px-2.5 py-1 rounded-md transition-all text-xs font-bold ${
              isActive
                ? 'bg-white text-green-700 shadow-sm border border-gray-200/80 font-extrabold'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/60'
            }`}
            aria-pressed={isActive}
            title={code === 'ru' ? 'Русский' : code === 'en' ? 'English' : 'Қазақша'}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
