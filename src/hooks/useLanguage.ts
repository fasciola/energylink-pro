import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export const useLanguage = () => {
  const { i18n, t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);
  const [isInitialized, setIsInitialized] = useState(false);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on('languageChanged', handleLanguageChanged);
    
    // Set initialized flag
    if (i18n.isInitialized) {
      setIsInitialized(true);
    } else {
      i18n.on('initialized', () => {
        setIsInitialized(true);
      });
    }

    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n]);

  const toggleLanguage = useCallback(() => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang)
      .then(() => {
        console.log(`Language changed to: ${newLang}`);
      })
      .catch((err) => {
        console.error('Language change error:', err);
      });
  }, [i18n, currentLang]);

  const setLanguage = useCallback((lang: 'en' | 'ar') => {
    i18n.changeLanguage(lang);
  }, [i18n]);

  return {
    currentLang,
    isArabic: currentLang === 'ar',
    isEnglish: currentLang === 'en',
    isInitialized,
    toggleLanguage,
    setLanguage,
    languageText: currentLang === 'en' ? t('common.english') : t('common.arabic'),
    oppositeLanguage: currentLang === 'en' ? t('common.arabic') : t('common.english')
  };
};