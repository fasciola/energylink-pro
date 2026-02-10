/**
 * Utility functions for language management
 */

// Check if a language is RTL
export const isRTL = (lang: string): boolean => {
  return lang === 'ar' || lang.startsWith('ar-');
};

// Format currency based on language
export const formatCurrency = (amount: number, lang: string): string => {
  if (lang === 'ar') {
    return `${amount} ريال`;
  }
  return `SAR ${amount}`;
};

// Format distance based on language
export const formatDistance = (km: number, lang: string): string => {
  const distance = km.toFixed(1);
  if (lang === 'ar') {
    return `${distance} كم`;
  }
  return `${distance} km`;
};

// Get direction text
export const getDirectionText = (lang: string): string => {
  return lang === 'ar' ? 'rtl' : 'ltr';
};

// Get font family
export const getFontFamily = (lang: string): string => {
  return lang === 'ar' 
    ? "'Noto Sans Arabic', 'Inter', sans-serif"
    : "'Inter', 'Noto Sans Arabic', sans-serif";
};

// Get opposite language
export const getOppositeLanguage = (lang: string): 'en' | 'ar' => {
  return lang === 'en' ? 'ar' : 'en';
};

// Get language name
export const getLanguageName = (lang: string): string => {
  const names: Record<string, string> = {
    'en': 'English',
    'ar': 'العربية',
    'en-US': 'English (US)',
    'en-GB': 'English (UK)',
    'ar-SA': 'العربية (السعودية)',
    'ar-AE': 'العربية (الإمارات)',
  };
  return names[lang] || (lang.startsWith('ar') ? 'العربية' : 'English');
};