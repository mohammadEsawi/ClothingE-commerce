import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartItem as CartItemComponent } from '@/components/customer/CartItem'
import { CouponInput } from '@/components/customer/CouponInput'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCartStore } from '@/store/cartStore'
import { useClearCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'
import { useState } from 'react'

export default function CartPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { items, clearCart } = useCartStore()
  const clearCartMutation = useClearCart()
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)

  const FREE_SHIPPING = 200
  const subtotal = items.reduce((sum, item) => {
    const price = item.variant.price_override ?? item.variant.product.sale_price ?? item.variant.product.base_price
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal >= FREE_SHIPPING ? 0 : 30
  const total = subtotal + shipping - discount

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <EmptyState
          icon={ShoppingCart}
          title={t('cart.empty_cart')}
          description={t('cart.empty_cart_desc')}
          action={{ label: t('cart.continue_shopping'), onClick: () => navigate('/shop') }}
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('cart.your_cart')}</h1>
        <button
          onClick={() => clearCartMutation.mutate()}
          className="text-sm text-red-500 hover:underline"
        >
          {t('cart.clear_cart')}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2">
          <div className="rounded-xl border bg-white p-4">
            {items.map((item) => (
              <CartItemComponent key={item.id} item={item} />
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-4 text-gray-500"
            onClick={() => navigate('/shop')}
          >
            ← {t('cart.continue_shopping')}
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="rounded-xl border bg-white p-5 space-y-4 sticky top-24">
            <h2 className="font-semibold text-lg">{t('checkout.order_summary')}</h2>

            <CouponInput
              onDiscountApplied={(code, d) => { setCouponCode(code); setDiscount(d) }}
              appliedCode={couponCode}
              discount={discount}
            />

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal, lang)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>{t('cart.discount')}</span>
                  <span>-{formatPrice(discount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className={shipping === 0 ? 'text-green-600' : ''}>
                  {shipping === 0 ? t('common.free') : formatPrice(shipping, lang)}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span className="text-primary-600">{formatPrice(total, lang)}</span>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate('/checkout')}
            >
              {t('cart.checkout')}
              <ArrowRight className="ms-2 h-4 w-4 rtl-flip" />
            </Button>

            {shipping > 0 && (
              <p className="text-xs text-center text-amber-600">
                {t('cart.free_shipping_message', { amount: (FREE_SHIPPING - subtotal).toFixed(2) })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
