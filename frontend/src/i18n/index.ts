import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en'
import ar from './locales/ar'

const savedLanguage = localStorage.getItem('i18n_language') || 'en'

// Set document direction on init
document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr'
document.documentElement.lang = savedLanguage

i18n.use(initReactI18next).init({
  resources: {
    en,
    ar
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false
  },
  detection: {
    order: ['localStorage'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18n_language'
  }
})

i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'
  document.documentElement.lang = lng
  localStorage.setItem('i18n_language', lng)
})

export default i18n
