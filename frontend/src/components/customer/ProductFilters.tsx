import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { useCategories } from '@/hooks/useCategories'
import type { ProductFilters as FiltersType } from '@/types'

interface ProductFiltersProps {
  filters: FiltersType
  onFiltersChange: (filters: FiltersType) => void
}

const COLORS = [
  { id: 1, name_en: 'Black', name_ar: 'أسود', hex: '#000000' },
  { id: 2, name_en: 'White', name_ar: 'أبيض', hex: '#FFFFFF' },
  { id: 3, name_en: 'Red', name_ar: 'أحمر', hex: '#EF4444' },
  { id: 4, name_en: 'Blue', name_ar: 'أزرق', hex: '#3B82F6' },
  { id: 5, name_en: 'Green', name_ar: 'أخضر', hex: '#10B981' },
  { id: 6, name_en: 'Yellow', name_ar: 'أصفر', hex: '#F59E0B' }
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

function FiltersContent({
  filters,
  onFiltersChange,
  onApply
}: {
  filters: FiltersType
  onFiltersChange: (f: FiltersType) => void
  onApply?: () => void
}) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: categories } = useCategories()
  const [priceRange, setPriceRange] = useState([
    filters.min_price ?? 0,
    filters.max_price ?? 1000
  ])

  const update = (key: keyof FiltersType, value: unknown) => {
    onFiltersChange({ ...filters, [key]: value, page: 1 })
  }

  const toggleColor = (id: number) => {
    const colors = filters.colors ?? []
    const next = colors.includes(id)
      ? colors.filter((c) => c !== id)
      : [...colors, id]
    update('colors', next.length ? next : undefined)
  }

  const toggleSize = (name: string) => {
    const sizes = filters.sizes ?? []
    const sizeId = SIZES.indexOf(name) + 1
    const next = sizes.includes(sizeId)
      ? sizes.filter((s) => s !== sizeId)
      : [...sizes, sizeId]
    update('sizes', next.length ? next : undefined)
  }

  const clearAll = () => {
    onFiltersChange({ sort: filters.sort, search: filters.search, page: 1 })
    setPriceRange([0, 1000])
  }

  const activeCount = [
    filters.category,
    filters.min_price,
    filters.max_price,
    filters.colors?.length,
    filters.sizes?.length,
    filters.on_sale,
    filters.in_stock
  ].filter(Boolean).length

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{t('filters.title')}</h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-primary-600 hover:underline"
          >
            {t('filters.clear_all')} ({activeCount})
          </button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      {categories && categories.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-3">{t('filters.categories')}</h4>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center gap-2">
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={filters.category === cat.slug}
                  onCheckedChange={(checked) =>
                    update('category', checked ? cat.slug : undefined)
                  }
                />
                <Label htmlFor={`cat-${cat.id}`} className="text-sm cursor-pointer">
                  {lang === 'ar' ? cat.name_ar : cat.name_en}
                </Label>
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator />

      {/* Price Range */}
      <div>
        <h4 className="text-sm font-medium mb-3">{t('filters.price_range')}</h4>
        <Slider
          min={0}
          max={1000}
          step={10}
          value={priceRange}
          onValueChange={setPriceRange}
          onValueCommit={(val) => {
            update('min_price', val[0])
            update('max_price', val[1])
          }}
          className="mb-3"
        />
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>₪{priceRange[0]}</span>
          <span>₪{priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      {/* Colors */}
      <div>
        <h4 className="text-sm font-medium mb-3">{t('filters.colors')}</h4>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => {
            const selected = filters.colors?.includes(color.id)
            return (
              <button
                key={color.id}
                title={lang === 'ar' ? color.name_ar : color.name_en}
                onClick={() => toggleColor(color.id)}
                className={`h-7 w-7 rounded-full border-2 transition-all ${
                  selected
                    ? 'border-primary-600 ring-2 ring-primary-200'
                    : 'border-gray-200 hover:border-gray-400'
                } ${color.hex === '#FFFFFF' ? 'border-gray-300' : ''}`}
                style={{ backgroundColor: color.hex }}
              />
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Sizes */}
      <div>
        <h4 className="text-sm font-medium mb-3">{t('filters.sizes')}</h4>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size, i) => {
            const sizeId = i + 1
            const selected = filters.sizes?.includes(sizeId)
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`px-3 h-9 rounded-md border text-sm font-medium transition-all ${
                  selected
                    ? 'bg-primary-600 border-primary-600 text-white'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-400'
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Toggles */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="text-sm">{t('filters.on_sale')}</Label>
          <Switch
            checked={filters.on_sale ?? false}
            onCheckedChange={(v) => update('on_sale', v || undefined)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label className="text-sm">{t('filters.in_stock')}</Label>
          <Switch
            checked={filters.in_stock ?? false}
            onCheckedChange={(v) => update('in_stock', v || undefined)}
          />
        </div>
      </div>

      {onApply && (
        <Button onClick={onApply} className="w-full">
          {t('filters.apply')}
        </Button>
      )}
    </div>
  )
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeCount = [
    filters.category,
    filters.min_price,
    filters.max_price,
    filters.colors?.length,
    filters.sizes?.length,
    filters.on_sale,
    filters.in_stock
  ].filter(Boolean).length

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              {t('filters.title')}
              {activeCount > 0 && (
                <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                  {activeCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[85vh]">
            <SheetHeader className="mb-4">
              <SheetTitle>{t('filters.title')}</SheetTitle>
            </SheetHeader>
            <div className="overflow-y-auto h-full pb-20">
              <FiltersContent
                filters={filters}
                onFiltersChange={onFiltersChange}
                onApply={() => setMobileOpen(false)}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border bg-white p-4 max-h-[calc(100vh-120px)] overflow-y-auto">
          <FiltersContent filters={filters} onFiltersChange={onFiltersChange} />
        </div>
      </div>
    </>
  )
}
