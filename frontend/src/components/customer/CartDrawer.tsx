import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ShoppingCart, X, ArrowRight } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CartItem as CartItemComponent } from './CartItem'
import { EmptyState } from '@/components/shared/EmptyState'
import { useCartStore } from '@/store/cartStore'
import { formatPrice } from '@/lib/utils'

export function CartDrawer() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { items, isOpen, closeCart, total, clearCart } = useCartStore()

  const FREE_SHIPPING_THRESHOLD = 200
  const subtotal = items.reduce((sum, item) => {
    const price =
      item.variant.price_override ??
      item.variant.product.sale_price ??
      item.variant.product.base_price
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 30
  const orderTotal = subtotal + shipping

  const handleCheckout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md p-0">
        <SheetHeader className="px-4 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {t('cart.your_cart')}
              {items.length > 0 && (
                <span className="text-sm font-normal text-gray-500">
                  ({items.reduce((s, i) => s + i.quantity, 0)} {t('common.items')})
                </span>
              )}
            </SheetTitle>
            <button
              onClick={closeCart}
              className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              icon={ShoppingCart}
              title={t('cart.empty_cart')}
              description={t('cart.empty_cart_desc')}
              action={{
                label: t('cart.continue_shopping'),
                onClick: () => { closeCart(); navigate('/shop') }
              }}
            />
          </div>
        ) : (
          <>
            {/* Shipping progress */}
            {subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="px-4 py-2 bg-amber-50 border-b">
                <p className="text-xs text-amber-700">
                  {t('cart.free_shipping_message', {
                    amount: (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)
                  })}
                </p>
                <div className="mt-1.5 h-1.5 rounded-full bg-amber-200">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all"
                    style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-4">
              {items.map((item) => (
                <CartItemComponent key={item.id} item={item} />
              ))}
            </div>

            {/* Summary */}
            <div className="border-t px-4 py-4 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span>{formatPrice(subtotal, lang)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
                  {shipping === 0 ? t('common.free') : formatPrice(shipping, lang)}
                </span>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-semibold">
                <span>{t('cart.total')}</span>
                <span className="text-primary-600">{formatPrice(orderTotal, lang)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full" size="lg">
                {t('cart.checkout')}
                <ArrowRight className="ms-2 h-4 w-4 rtl-flip" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-gray-500"
                onClick={() => closeCart()}
              >
                {t('cart.continue_shopping')}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
