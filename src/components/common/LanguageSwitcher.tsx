import React from 'react'
import { FaGlobe } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation()

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en'
    i18n.changeLanguage(newLang)
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
      aria-label="Switch language"
    >
      <FaGlobe className="text-blue-600" />
      <span className="font-medium">
        {i18n.language === 'en' ? 'English' : 'العربية'}
      </span>
    </button>
  )
}