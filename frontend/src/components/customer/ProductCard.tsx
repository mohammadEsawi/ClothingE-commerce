import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, ShoppingCart } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRating } from './StarRating'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { useAddToCart } from '@/hooks/useCart'
import { formatPrice, getImageUrl, calculateDiscount } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Product } from '@/types'

interface ProductCardProps {
  product: Product
  isLoading?: boolean
}

export function ProductCard({ product, isLoading }: ProductCardProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { openCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()
  const addToCart = useAddToCart()
  const [imageError, setImageError] = useState(false)

  if (isLoading) {
    return (
      <div className="rounded-lg overflow-hidden border bg-white">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="p-3 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    )
  }

  const name = lang === 'ar' ? product.name_ar : product.name_en
  const primaryImage = product.primary_image || product.images[0]
  const inWishlist = isInWishlist(product.id)
  const discount = product.sale_price
    ? calculateDiscount(product.base_price, product.sale_price)
    : product.discount_percentage

  const firstVariant = product.variants[0]
  const colors = [...new Map(
    product.variants
      .filter((v) => v.color)
      .map((v) => [v.color!.id, v.color!])
  ).values()].slice(0, 4)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      toast({ title: t('auth.sign_in'), description: 'Please login to add items to cart', variant: 'destructive' })
      return
    }
    if (!firstVariant) return
    try {
      await addToCart.mutateAsync({ variantId: firstVariant.id, quantity: 1 })
      openCart()
      toast({ title: t('product.added_to_cart'), variant: 'default' })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleWishlist(product)
    toast({
      title: inWishlist ? t('wishlist.removed') : t('wishlist.added')
    })
  }

  const isOutOfStock = product.variants.every((v) => v.status === 'out_of_stock')

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative rounded-xl overflow-hidden border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
          {discount && discount > 0 && (
            <Badge
              variant="destructive"
              className="absolute top-2 start-2 z-10 text-xs"
            >
              -{discount}%
            </Badge>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/30">
              <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-700">
                {t('product.out_of_stock')}
              </span>
            </div>
          )}

          <button
            onClick={handleWishlist}
            className="absolute top-2 end-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow-sm hover:scale-110 transition-transform"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                inWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          <img
            src={imageError || !primaryImage ? '/placeholder-product.svg' : getImageUrl(primaryImage.image_url)}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Info */}
        <div className="p-3">
          <p className="text-xs text-gray-500 mb-1">{
            lang === 'ar' ? product.category?.name_ar : product.category?.name_en
          }</p>
          <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">{name}</h3>

          {/* Rating */}
          {product.avg_rating !== undefined && product.avg_rating > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <StarRating value={product.avg_rating} readonly size="sm" />
              <span className="text-xs text-gray-500">({product.reviews_count})</span>
            </div>
          )}

          {/* Colors */}
          {colors.length > 0 && (
            <div className="flex items-center gap-1 mb-2">
              {colors.map((color) => (
                <div
                  key={color.id}
                  title={lang === 'ar' ? color.name_ar : color.name_en}
                  className="h-4 w-4 rounded-full border border-gray-200 cursor-default"
                  style={{ backgroundColor: color.hex_code }}
                />
              ))}
              {product.variants.length > 4 && (
                <span className="text-xs text-gray-400">+{product.variants.length - 4}</span>
              )}
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            {product.sale_price ? (
              <>
                <span className="text-sm font-bold text-primary-600">
                  {formatPrice(product.sale_price, lang)}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  {formatPrice(product.base_price, lang)}
                </span>
              </>
            ) : (
              <span className="text-sm font-bold text-gray-900">
                {formatPrice(product.base_price, lang)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-3 pb-3">
        <Button
          size="sm"
          className="w-full text-xs"
          disabled={isOutOfStock || addToCart.isPending}
          onClick={handleAddToCart}
          variant={isOutOfStock ? 'outline' : 'default'}
        >
          <ShoppingCart className="me-1.5 h-3.5 w-3.5" />
          {isOutOfStock ? t('product.out_of_stock') : t('product.add_to_cart')}
        </Button>
      </div>
    </motion.div>
  )
}
