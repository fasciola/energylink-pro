import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '../../hooks/useLanguage';

interface LanguageContextType {
  currentLang: string;
  isArabic: boolean;
  isEnglish: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: 'en' | 'ar') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const language = useLanguage();

  return (
    <LanguageContext.Provider value={language}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguageContext = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguageContext must be used within a LanguageProvider');
  }
  return context;
};