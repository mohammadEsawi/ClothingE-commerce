import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallback?: string
}

export function ImageWithFallback({
  src,
  alt,
  fallback = '/placeholder-product.svg',
  className,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {!loaded && (
        <div className="absolute inset-0 skeleton" />
      )}
      <img
        src={error ? fallback : src}
        alt={alt}
        className={cn(
          'h-full w-full object-cover transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0'
        )}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        loading="lazy"
        {...props}
      />
    </div>
  )
}
