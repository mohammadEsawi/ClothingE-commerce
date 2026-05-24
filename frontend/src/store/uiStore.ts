import { create } from 'zustand'
import i18n from '@/i18n'

type Language = 'en' | 'ar'
type Direction = 'ltr' | 'rtl'

interface UIState {
  language: Language
  direction: Direction
  isDarkMode: boolean
  isMobileSidebarOpen: boolean
  toggleLanguage: () => void
  setLanguage: (lang: Language) => void
  toggleDarkMode: () => void
  toggleMobileSidebar: () => void
  closeMobileSidebar: () => void
}

export const useUIStore = create<UIState>((set, get) => ({
  language: (localStorage.getItem('i18n_language') as Language) || 'en',
  direction: localStorage.getItem('i18n_language') === 'ar' ? 'rtl' : 'ltr',
  isDarkMode: false,
  isMobileSidebarOpen: false,

  toggleLanguage: () => {
    const { language } = get()
    const newLang: Language = language === 'en' ? 'ar' : 'en'
    const newDir: Direction = newLang === 'ar' ? 'rtl' : 'ltr'

    i18n.changeLanguage(newLang)
    document.documentElement.dir = newDir
    document.documentElement.lang = newLang

    set({ language: newLang, direction: newDir })
  },

  setLanguage: (lang: Language) => {
    const newDir: Direction = lang === 'ar' ? 'rtl' : 'ltr'
    i18n.changeLanguage(lang)
    document.documentElement.dir = newDir
    document.documentElement.lang = lang
    set({ language: lang, direction: newDir })
  },

  toggleDarkMode: () => {
    set((state) => {
      const newMode = !state.isDarkMode
      if (newMode) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
      return { isDarkMode: newMode }
    })
  },

  toggleMobileSidebar: () => {
    set((state) => ({ isMobileSidebarOpen: !state.isMobileSidebarOpen }))
  },

  closeMobileSidebar: () => set({ isMobileSidebarOpen: false })
}))
