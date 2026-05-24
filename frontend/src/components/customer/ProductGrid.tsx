import { ProductCard } from './ProductCard'
import type { Product } from '@/types'

interface ProductGridProps {
  products?: Product[]
  isLoading?: boolean
  skeletonCount?: number
}

export function ProductGrid({
  products = [],
  isLoading = false,
  skeletonCount = 8
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCard key={i} product={{} as Product} isLoading />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
