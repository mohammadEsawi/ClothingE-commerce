import { Button } from '@/components/ui/button'
import { useUIStore } from '@/store/uiStore'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  className?: string
  variant?: 'button' | 'text'
}

export function LanguageToggle({
  className,
  variant = 'button'
}: LanguageToggleProps) {
  const { language, toggleLanguage } = useUIStore()

  if (variant === 'text') {
    return (
      <button
        onClick={toggleLanguage}
        className={cn(
          'text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors',
          className
        )}
      >
        {language === 'en' ? 'عربي' : 'English'}
      </button>
    )
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className={cn(
        'h-9 min-w-[72px] font-medium',
        language === 'ar' && 'font-arabic',
        className
      )}
    >
      {language === 'en' ? 'عربي' : 'English'}
    </Button>
  )
}
