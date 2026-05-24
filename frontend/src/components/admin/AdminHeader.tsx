import { Menu, Bell } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { LanguageToggle } from '@/components/shared/LanguageToggle'

interface AdminHeaderProps {
  title?: string
  onMenuClick: () => void
}

export function AdminHeader({ title, onMenuClick }: AdminHeaderProps) {
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="flex md:hidden h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        {title && (
          <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
        )}
      </div>
      <div className="flex items-center gap-2">
        <LanguageToggle />
        <button className="relative flex h-9 w-9 items-center justify-center rounded-md hover:bg-gray-100">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>
      </div>
    </header>
  )
}
