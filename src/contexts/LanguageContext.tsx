import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Language,
  SUPPORTED_LANGUAGES,
  LanguageInfo,
  translations,
  getTranslation,
} from '../lib/i18n';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
  supportedLanguages: LanguageInfo[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('edugen_lang');
    if (
      saved &&
      ['English', 'Malayalam', 'Tamil', 'Tanglish', 'Hindi', 'Spanish', 'French'].includes(saved)
    ) {
      return saved as Language;
    }
    return 'English';
  });

  const setLanguage = useCallback((newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem('edugen_lang', newLang);
    // Dispatch custom event for any listeners
    window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: newLang } }));
  }, []);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'edugen_lang' && e.newValue) {
        if (['English', 'Malayalam', 'Tamil', 'Tanglish', 'Hindi', 'Spanish', 'French'].includes(e.newValue)) {
          setLanguageState(e.newValue as Language);
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      const dict = translations[language] || translations['English'];
      if (dict && dict[key]) {
        return dict[key];
      }
      const englishDict = translations['English'];
      if (englishDict && englishDict[key]) {
        return englishDict[key];
      }
      return fallback !== undefined ? fallback : key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        supportedLanguages: SUPPORTED_LANGUAGES,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside Provider
    return {
      language: (localStorage.getItem('edugen_lang') as Language) || 'English',
      setLanguage: () => {},
      t: (key: string, fallback?: string) => getTranslation(key, 'English') || fallback || key,
      supportedLanguages: SUPPORTED_LANGUAGES,
    };
  }
  return context;
};
