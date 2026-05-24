import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import type { ProductVariant, Color, Size } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  onVariantChange: (variant: ProductVariant) => void
}

export function VariantSelector({
  variants,
  selectedVariant,
  onVariantChange
}: VariantSelectorProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  // Get unique colors
  const colors: Color[] = [...new Map(
    variants.filter((v) => v.color).map((v) => [v.color!.id, v.color!])
  ).values()]

  // Get unique sizes
  const sizes: Size[] = [...new Map(
    variants.filter((v) => v.size).map((v) => [v.size!.id, v.size!])
  ).values()]

  const selectedColor = selectedVariant?.color
  const selectedSize = selectedVariant?.size

  const isColorAvailable = (color: Color) =>
    variants.some((v) => v.color?.id === color.id && v.status !== 'out_of_stock')

  const isSizeAvailable = (size: Size) => {
    if (selectedColor) {
      return variants.some(
        (v) =>
          v.color?.id === selectedColor.id &&
          v.size?.id === size.id &&
          v.status !== 'out_of_stock'
      )
    }
    return variants.some(
      (v) => v.size?.id === size.id && v.status !== 'out_of_stock'
    )
  }

  const handleColorSelect = (color: Color) => {
    // Find best variant for this color
    const variant =
      variants.find(
        (v) => v.color?.id === color.id && v.size?.id === selectedSize?.id
      ) || variants.find((v) => v.color?.id === color.id)
    if (variant) onVariantChange(variant)
  }

  const handleSizeSelect = (size: Size) => {
    const variant =
      variants.find(
        (v) => v.size?.id === size.id && v.color?.id === selectedColor?.id
      ) || variants.find((v) => v.size?.id === size.id)
    if (variant) onVariantChange(variant)
  }

  return (
    <div className="space-y-4">
      {/* Color Selector */}
      {colors.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {t('product.color')}
            </span>
            {selectedColor && (
              <span className="text-sm text-gray-600">
                {lang === 'ar' ? selectedColor.name_ar : selectedColor.name_en}
              </span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            {colors.map((color) => {
              const available = isColorAvailable(color)
              const isSelected = selectedColor?.id === color.id
              return (
                <button
                  key={color.id}
                  title={lang === 'ar' ? color.name_ar : color.name_en}
                  onClick={() => available && handleColorSelect(color)}
                  disabled={!available}
                  className={cn(
                    'relative h-8 w-8 rounded-full border-2 transition-all',
                    isSelected
                      ? 'border-primary-600 ring-2 ring-primary-200'
                      : 'border-gray-200 hover:border-gray-400',
                    !available && 'opacity-40 cursor-not-allowed'
                  )}
                  style={{ backgroundColor: color.hex_code }}
                >
                  {!available && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <span className="h-px w-full bg-gray-400 rotate-45 absolute" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Size Selector */}
      {sizes.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">
              {t('product.size')}
            </span>
            <button className="text-xs text-primary-600 hover:underline">
              {t('product.size_guide')}
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => {
              const available = isSizeAvailable(size)
              const isSelected = selectedSize?.id === size.id
              return (
                <button
                  key={size.id}
                  onClick={() => available && handleSizeSelect(size)}
                  disabled={!available}
                  className={cn(
                    'min-w-[44px] px-3 h-10 rounded-md border text-sm font-medium transition-all',
                    isSelected
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary-300',
                    !available && 'opacity-40 cursor-not-allowed line-through'
                  )}
                >
                  {size.name}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
