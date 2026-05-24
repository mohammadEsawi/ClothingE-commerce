import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { ProductFilters } from '@/components/customer/ProductFilters'
import { useProducts } from '@/hooks/useProducts'
import type { ProductFilters as FiltersType } from '@/types'

export default function ShopPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<FiltersType>({
    category: searchParams.get('category') || undefined,
    search: searchParams.get('search') || undefined,
    on_sale: searchParams.get('on_sale') === '1' || undefined,
    sort: 'newest',
    page: 1,
    per_page: 24
  })

  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      category: searchParams.get('category') || undefined,
      search: searchParams.get('search') || undefined
    }))
  }, [searchParams])

  const { data, isLoading } = useProducts(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  const sortOptions = [
    { value: 'newest', label: t('sort.newest') },
    { value: 'price_asc', label: t('sort.price_asc') },
    { value: 'price_desc', label: t('sort.price_desc') },
    { value: 'popular', label: t('sort.popular') },
    { value: 'top_rated', label: t('sort.top_rated') }
  ]

  const activeFilterCount = [
    filters.category,
    filters.min_price,
    filters.max_price,
    filters.colors?.length,
    filters.sizes?.length,
    filters.on_sale,
    filters.in_stock
  ].filter(Boolean).length

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{t('nav.shop')}</h1>
        {meta && (
          <p className="text-sm text-gray-500">
            {meta.total} {t('common.items')}
          </p>
        )}
      </div>

      {/* Mobile: filters + sort */}
      <div className="flex items-center gap-3 mb-4 lg:hidden">
        <ProductFilters filters={filters} onFiltersChange={setFilters} />
        <Select
          value={filters.sort ?? 'newest'}
          onValueChange={(v) => setFilters({ ...filters, sort: v as FiltersType['sort'] })}
        >
          <SelectTrigger className="flex-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.category && (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-50 text-primary-700 px-3 py-1 text-xs font-medium">
              {filters.category}
              <button onClick={() => setFilters({ ...filters, category: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.on_sale && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-red-700 px-3 py-1 text-xs font-medium">
              {t('filters.on_sale')}
              <button onClick={() => setFilters({ ...filters, on_sale: undefined })}>
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => setFilters({ sort: filters.sort, search: filters.search, page: 1 })}
            className="text-xs text-gray-500 hover:text-red-500 underline"
          >
            {t('filters.clear_all')}
          </button>
        </div>
      )}

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <ProductFilters filters={filters} onFiltersChange={setFilters} />

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Desktop Sort */}
          <div className="hidden lg:flex items-center justify-end mb-4 gap-3">
            <span className="text-sm text-gray-500">{t('common.sort')}:</span>
            <Select
              value={filters.sort ?? 'newest'}
              onValueChange={(v) => setFilters({ ...filters, sort: v as FiltersType['sort'] })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <ProductGrid products={products} isLoading={isLoading} />

          {/* Pagination */}
          {meta && meta.last_page > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              {Array.from({ length: meta.last_page }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setFilters({ ...filters, page })}
                  className={`h-9 w-9 rounded-md border text-sm font-medium transition-colors ${
                    page === filters.page
                      ? 'bg-primary-600 border-primary-600 text-white'
                      : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}

          {!isLoading && products.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-500">{t('common.no_results')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
