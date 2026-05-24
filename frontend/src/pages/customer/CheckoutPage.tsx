import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { CheckCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { CheckoutSteps } from '@/components/customer/CheckoutSteps'
import { AddressForm } from '@/components/customer/AddressForm'
import { CouponInput } from '@/components/customer/CouponInput'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAddresses, useCreateAddress, useCreateOrder } from '@/hooks/useOrders'
import { useCartStore } from '@/store/cartStore'
import { formatPrice, getImageUrl } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Address } from '@/types'

export default function CheckoutPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { items, clearCart } = useCartStore()
  const { data: addresses, isLoading: addressesLoading } = useAddresses()
  const createAddress = useCreateAddress()
  const createOrder = useCreateOrder()

  const [step, setStep] = useState(1)
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [placedOrderNumber, setPlacedOrderNumber] = useState('')

  const subtotal = items.reduce((sum, item) => {
    const price = item.variant.price_override ?? item.variant.product.sale_price ?? item.variant.product.base_price
    return sum + price * item.quantity
  }, 0)
  const shipping = subtotal >= 200 ? 0 : 30
  const total = subtotal + shipping - discount

  const handleAddAddress = async (data: Omit<Address, 'id'>) => {
    try {
      const address = await createAddress.mutateAsync(data)
      setSelectedAddressId(address.id)
      setShowAddressForm(false)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast({ title: 'Please select an address', variant: 'destructive' })
      return
    }
    try {
      const order = await createOrder.mutateAsync({
        address_id: selectedAddressId,
        coupon_code: couponCode || undefined
      })
      clearCart()
      setPlacedOrderNumber(order.order_number)
      setStep(3)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  if (addressesLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <CheckoutSteps currentStep={step} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="rounded-xl border bg-white p-5">
              <h2 className="font-semibold text-lg mb-4">{t('checkout.shipping_address')}</h2>

              {!showAddressForm ? (
                <div className="space-y-3">
                  {addresses?.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div className="flex-1">
                        <p className="font-medium">{addr.full_name}</p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                        <p className="text-sm text-gray-600">
                          {addr.address_line1}, {addr.city}, {addr.state_province}
                        </p>
                        {addr.is_default && (
                          <span className="text-xs text-primary-600 font-medium">
                            {t('account.default_address')}
                          </span>
                        )}
                      </div>
                    </label>
                  ))}

                  <Button
                    variant="outline"
                    className="w-full mt-2"
                    onClick={() => setShowAddressForm(true)}
                  >
                    <Plus className="me-2 h-4 w-4" />
                    {t('checkout.add_new_address')}
                  </Button>

                  <Button
                    className="w-full mt-2"
                    disabled={!selectedAddressId}
                    onClick={() => setStep(2)}
                  >
                    {t('common.next')}
                  </Button>
                </div>
              ) : (
                <AddressForm
                  onSubmit={handleAddAddress}
                  onCancel={() => setShowAddressForm(false)}
                  isLoading={createAddress.isPending}
                />
              )}
            </div>
          )}

          {/* Step 2: Review */}
          {step === 2 && (
            <div className="rounded-xl border bg-white p-5">
              <h2 className="font-semibold text-lg mb-4">{t('checkout.order_summary')}</h2>
              <div className="space-y-3 mb-4">
                {items.map((item) => {
                  const product = item.variant.product
                  const name = lang === 'ar' ? product.name_ar : product.name_en
                  const price = item.variant.price_override ?? product.sale_price ?? product.base_price
                  return (
                    <div key={item.id} className="flex items-center gap-3">
                      <div className="h-14 w-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                        <img
                          src={getImageUrl(product.primary_image?.image_url)}
                          alt={name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{name}</p>
                        <p className="text-xs text-gray-500">
                          {item.variant.color && (lang === 'ar' ? item.variant.color.name_ar : item.variant.color.name_en)}
                          {item.variant.size && ` / ${item.variant.size.name}`}
                          {` × ${item.quantity}`}
                        </p>
                      </div>
                      <p className="text-sm font-semibold shrink-0">
                        {formatPrice(price * item.quantity, lang)}
                      </p>
                    </div>
                  )
                })}
              </div>

              <CouponInput
                onDiscountApplied={(code, d) => { setCouponCode(code); setDiscount(d) }}
                appliedCode={couponCode}
                discount={discount}
              />

              <div className="flex gap-3 mt-4">
                <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                  {t('common.back')}
                </Button>
                <Button
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending}
                  className="flex-1"
                >
                  {createOrder.isPending ? t('common.loading') : t('checkout.place_order')}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmed */}
          {step === 3 && (
            <div className="rounded-xl border bg-white p-8 text-center">
              <div className="mb-4 flex justify-center">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.order_placed')}</h2>
              <p className="text-gray-600 mb-2">{t('checkout.order_placed_desc')}</p>
              <p className="text-sm text-gray-500 mb-1">{t('checkout.order_number')}: <span className="font-mono font-bold text-primary-600">{placedOrderNumber}</span></p>
              <p className="text-sm text-gray-500 mb-6">{t('checkout.estimated_delivery')}: {t('checkout.delivery_days')}</p>
              <p className="text-gray-600 mb-6">{t('checkout.thank_you')}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => navigate('/orders')}>{t('checkout.view_order')}</Button>
                <Button variant="outline" onClick={() => navigate('/shop')}>{t('checkout.continue_shopping')}</Button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        {step < 3 && (
          <div className="lg:col-span-1">
            <div className="rounded-xl border bg-white p-5 sticky top-24 space-y-3">
              <h3 className="font-semibold">{t('checkout.order_summary')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.subtotal')}</span>
                  <span>{formatPrice(subtotal, lang)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>{t('cart.discount')}</span>
                    <span>-{formatPrice(discount, lang)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('cart.shipping')}</span>
                  <span className={shipping === 0 ? 'text-green-600' : ''}>
                    {shipping === 0 ? t('common.free') : formatPrice(shipping, lang)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold">
                  <span>{t('cart.total')}</span>
                  <span className="text-primary-600">{formatPrice(total, lang)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
