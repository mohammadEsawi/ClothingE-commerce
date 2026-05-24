import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Heart, Share2, Minus, Plus, ShoppingCart, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { ProductImageGallery } from '@/components/customer/ProductImageGallery'
import { VariantSelector } from '@/components/customer/VariantSelector'
import { StarRating } from '@/components/customer/StarRating'
import { ReviewCard } from '@/components/customer/ReviewCard'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useProduct, useRelatedProducts } from '@/hooks/useProducts'
import { useAddToCart } from '@/hooks/useCart'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCartStore } from '@/store/cartStore'
import { useAuthStore } from '@/store/authStore'
import { formatPrice, calculateDiscount, getStockStatusColor } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { ProductVariant, Review } from '@/types'

// Mock reviews since API might not have them for demo
const mockReviews: Review[] = []

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: product, isLoading } = useProduct(slug ?? '')
  const { data: relatedProducts } = useRelatedProducts(
    product?.id ?? 0,
    product?.category_id ?? 0
  )
  const addToCart = useAddToCart()
  const { toggleWishlist, isInWishlist } = useWishlistStore()
  const { openCart } = useCartStore()
  const { isAuthenticated } = useAuthStore()

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  if (isLoading) return <LoadingSpinner overlay />
  if (!product) return <div className="p-12 text-center">Product not found</div>

  const name = lang === 'ar' ? product.name_ar : product.name_en
  const description = lang === 'ar' ? product.description_ar : product.description_en
  const inWishlist = isInWishlist(product.id)
  const effectiveVariant = selectedVariant ?? product.variants[0]
  const price = effectiveVariant?.price_override ?? product.sale_price ?? product.base_price
  const isOutOfStock = effectiveVariant?.status === 'out_of_stock'
  const discount = product.sale_price
    ? calculateDiscount(product.base_price, product.sale_price)
    : undefined

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast({ title: 'Please login', description: 'Sign in to add items to cart', variant: 'destructive' })
      return
    }
    if (!effectiveVariant) {
      toast({ title: t('product.select_size'), variant: 'destructive' })
      return
    }
    try {
      await addToCart.mutateAsync({ variantId: effectiveVariant.id, quantity })
      openCart()
      toast({ title: t('product.added_to_cart') })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleShare = async () => {
    try {
      await navigator.share({ title: name, url: window.location.href })
    } catch {
      await navigator.clipboard.writeText(window.location.href)
      toast({ title: t('common.copied') })
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-primary-600">{t('nav.home')}</Link>
        <ChevronRight className="h-3.5 w-3.5 rtl-flip" />
        <Link to="/shop" className="hover:text-primary-600">{t('nav.shop')}</Link>
        {product.category && (
          <>
            <ChevronRight className="h-3.5 w-3.5 rtl-flip" />
            <Link
              to={`/shop?category=${product.category.slug}`}
              className="hover:text-primary-600"
            >
              {lang === 'ar' ? product.category.name_ar : product.category.name_en}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 rtl-flip" />
        <span className="text-gray-900 truncate max-w-[150px]">{name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ProductImageGallery images={product.images} />
        </motion.div>

        {/* Product Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4"
        >
          {/* Category */}
          {product.category && (
            <Link
              to={`/shop?category=${product.category.slug}`}
              className="text-sm text-primary-600 hover:underline"
            >
              {lang === 'ar' ? product.category.name_ar : product.category.name_en}
            </Link>
          )}

          {/* Name */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{name}</h1>

          {/* Rating */}
          {product.avg_rating !== undefined && (
            <div className="flex items-center gap-2">
              <StarRating value={product.avg_rating} readonly />
              <span className="text-sm text-gray-500">
                ({product.reviews_count} {t('product.reviews')})
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-primary-600">
              {formatPrice(price, lang)}
            </span>
            {product.sale_price && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {formatPrice(product.base_price, lang)}
                </span>
                {discount && (
                  <Badge variant="destructive" className="text-xs">
                    -{discount}%
                  </Badge>
                )}
              </>
            )}
          </div>

          {/* Stock Status */}
          {effectiveVariant && (
            <p className={`text-sm font-medium ${getStockStatusColor(effectiveVariant.status)}`}>
              {effectiveVariant.status === 'in_stock' && t('product.in_stock')}
              {effectiveVariant.status === 'low_stock' && t('product.low_stock')}
              {effectiveVariant.status === 'out_of_stock' && t('product.out_of_stock')}
              {effectiveVariant.status === 'low_stock' && ` (${effectiveVariant.stock_quantity} left)`}
            </p>
          )}

          <Separator />

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <VariantSelector
              variants={product.variants}
              selectedVariant={effectiveVariant}
              onVariantChange={setSelectedVariant}
            />
          )}

          {/* Quantity */}
          <div>
            <span className="text-sm font-medium text-gray-900 block mb-2">
              {t('product.quantity')}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-gray-50"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="flex h-10 w-10 items-center justify-center rounded-md border hover:bg-gray-50"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleAddToCart}
              disabled={isOutOfStock || addToCart.isPending}
            >
              <ShoppingCart className="me-2 h-5 w-5" />
              {isOutOfStock ? t('product.out_of_stock') : t('product.add_to_cart')}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => { toggleWishlist(product); toast({ title: inWishlist ? t('wishlist.removed') : t('wishlist.added') }) }}
              className="w-12 p-0"
            >
              <Heart className={`h-5 w-5 ${inWishlist ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleShare}
              className="w-12 p-0"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>

          {/* SKU */}
          {effectiveVariant && (
            <p className="text-xs text-gray-500">
              {t('product.sku')}: {effectiveVariant.sku}
            </p>
          )}
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <Tabs defaultValue="description">
          <TabsList className="w-full justify-start">
            <TabsTrigger value="description">{t('product.description')}</TabsTrigger>
            <TabsTrigger value="size_guide">{t('product.size_guide')}</TabsTrigger>
            <TabsTrigger value="reviews">
              {t('product.reviews')} ({mockReviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-4">
            <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
              <p>{description}</p>
            </div>
          </TabsContent>

          <TabsContent value="size_guide" className="mt-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    {['Size', 'Chest (cm)', 'Waist (cm)', 'Length (cm)'].map((h) => (
                      <th key={h} className="px-4 py-2 text-start font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[['XS', '84', '70', '64'], ['S', '88', '74', '65'], ['M', '92', '78', '66'], ['L', '96', '82', '67'], ['XL', '100', '86', '68']].map((row) => (
                    <tr key={row[0]} className="border-t hover:bg-gray-50">
                      {row.map((cell, i) => (
                        <td key={i} className="px-4 py-2">{cell}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-4">
            {mockReviews.length === 0 ? (
              <p className="text-gray-500 py-8 text-center">{t('product.no_reviews')}</p>
            ) : (
              <div>
                {mockReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Related Products */}
      {relatedProducts && relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {t('product.related_products')}
          </h2>
          <ProductGrid products={relatedProducts} />
        </section>
      )}
    </div>
  )
}
