import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getImageUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types'

interface ProductImageGalleryProps {
  images: ProductImage[]
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order)
  const current = sorted[selectedIndex]

  const navigate = (newIndex: number) => {
    setDirection(newIndex > selectedIndex ? 1 : -1)
    setSelectedIndex(newIndex)
  }

  const prev = () => navigate(Math.max(0, selectedIndex - 1))
  const next = () => navigate(Math.min(sorted.length - 1, selectedIndex + 1))

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 })
  }

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square rounded-xl bg-gray-100 flex items-center justify-center">
        <span className="text-gray-400">No image</span>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-50">
        <AnimatePresence custom={direction} mode="wait">
          <motion.img
            key={selectedIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            src={getImageUrl(current?.image_url)}
            alt={current?.alt_text || 'Product image'}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>

        {/* Navigation Arrows */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={prev}
              disabled={selectedIndex === 0}
              className={cn(
                'absolute start-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white',
                selectedIndex === 0 && 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronLeft className="h-4 w-4 rtl-flip" />
            </button>
            <button
              onClick={next}
              disabled={selectedIndex === sorted.length - 1}
              className={cn(
                'absolute end-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-md transition-all hover:bg-white',
                selectedIndex === sorted.length - 1 && 'opacity-30 cursor-not-allowed'
              )}
            >
              <ChevronRight className="h-4 w-4 rtl-flip" />
            </button>
          </>
        )}

        {/* Dots */}
        {sorted.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {sorted.map((_, i) => (
              <button
                key={i}
                onClick={() => navigate(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  i === selectedIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                )}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => navigate(i)}
              className={cn(
                'flex-shrink-0 h-16 w-16 rounded-lg overflow-hidden border-2 transition-all',
                i === selectedIndex
                  ? 'border-primary-600'
                  : 'border-transparent hover:border-gray-300'
              )}
            >
              <img
                src={getImageUrl(img.image_url)}
                alt={img.alt_text || `Image ${i + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
