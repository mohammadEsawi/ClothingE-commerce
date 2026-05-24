import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  overlay?: boolean
}

export function LoadingSpinner({
  className,
  size = 'md',
  overlay = false
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-4'
  }

  const spinner = (
    <div
      className={cn(
        'animate-spin rounded-full border-primary-600 border-t-transparent',
        sizeClasses[size],
        className
      )}
    />
  )

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">{spinner}</div>
  )
}
