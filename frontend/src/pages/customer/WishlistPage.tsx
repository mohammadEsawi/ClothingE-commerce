import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { EmptyState } from '@/components/shared/EmptyState'
import { ProductCard } from '@/components/customer/ProductCard'
import { useWishlistStore } from '@/store/wishlistStore'
import { useProducts } from '@/hooks/useProducts'

export default function WishlistPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { productIds } = useWishlistStore()

  // Fetch products for wishlist IDs
  const { data, isLoading } = useProducts({ per_page: 100 })
  const wishlistProducts = data?.data?.filter((p) => productIds.includes(p.id)) ?? []

  if (productIds.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          icon={Heart}
          title={t('wishlist.empty')}
          description={t('wishlist.empty_desc')}
          action={{ label: t('cart.continue_shopping'), onClick: () => navigate('/shop') }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('wishlist.title')}</h1>
        <p className="text-sm text-gray-500">{productIds.length} {t('common.items')}</p>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {wishlistProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
