import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, Package, MapPin, CreditCard, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/customer/OrderStatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useOrder, useCancelOrder } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { useState } from 'react'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { data: order, isLoading } = useOrder(id ?? '')
  const cancelOrder = useCancelOrder()
  const [showCancelDialog, setShowCancelDialog] = useState(false)

  if (isLoading) return <LoadingSpinner />
  if (!order) return <div className="p-12 text-center">Order not found</div>

  const handleCancel = async () => {
    try {
      await cancelOrder.mutateAsync(order.id)
      toast({ title: 'Order cancelled' })
      setShowCancelDialog(false)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const timeline = [
    { status: 'pending', label: t('orders.status_pending'), done: true },
    { status: 'confirmed', label: t('orders.status_confirmed'), done: ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'processing', label: t('orders.status_processing'), done: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { status: 'shipped', label: t('orders.status_shipped'), done: ['shipped', 'delivered'].includes(order.status) },
    { status: 'delivered', label: t('orders.status_delivered'), done: order.status === 'delivered' }
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/orders')}
          className="flex items-center justify-center h-9 w-9 rounded-md hover:bg-gray-100"
        >
          <ChevronLeft className="h-5 w-5 rtl-flip" />
        </button>
        <div>
          <h1 className="text-xl font-bold">
            {t('orders.order_details')} #{order.order_number}
          </h1>
          <p className="text-sm text-gray-500">{formatDate(order.created_at, lang)}</p>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      {/* Order Timeline */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <div className="rounded-xl border bg-white p-5 mb-4">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <Package className="h-4 w-4" />
            {t('orders.order_timeline')}
          </h2>
          <div className="flex items-center">
            {timeline.map((step, i) => (
              <div key={step.status} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold ${
                    step.done ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-[10px] mt-1 text-center">{step.label}</span>
                </div>
                {i < timeline.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${step.done ? 'bg-primary-600' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tracking */}
      {order.tracking_number && (
        <div className="rounded-xl border bg-white p-5 mb-4 flex items-center gap-3">
          <Truck className="h-5 w-5 text-primary-600" />
          <div>
            <p className="text-sm font-medium">{t('orders.tracking_number')}</p>
            <p className="font-mono text-primary-600">{order.tracking_number}</p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="rounded-xl border bg-white p-5 mb-4">
        <h2 className="font-semibold mb-4">{t('orders.items')}</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="h-14 w-12 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.product_name}</p>
                <p className="text-xs text-gray-500">
                  {item.color_name && `${item.color_name} / `}
                  {item.size_name} × {item.quantity}
                </p>
                <p className="text-xs text-gray-400">{item.sku}</p>
              </div>
              <div className="text-end">
                <p className="text-sm font-semibold">{formatPrice(item.total_price, lang)}</p>
                <p className="text-xs text-gray-500">{formatPrice(item.unit_price, lang)} each</p>
              </div>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between"><span className="text-gray-600">{t('cart.subtotal')}</span><span>{formatPrice(order.subtotal, lang)}</span></div>
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600"><span>{t('cart.discount')}</span><span>-{formatPrice(order.discount_amount, lang)}</span></div>
          )}
          <div className="flex justify-between"><span className="text-gray-600">{t('cart.shipping')}</span><span>{order.shipping_cost === 0 ? t('common.free') : formatPrice(order.shipping_cost, lang)}</span></div>
          <Separator className="my-2" />
          <div className="flex justify-between font-bold text-base"><span>{t('cart.total')}</span><span className="text-primary-600">{formatPrice(order.total, lang)}</span></div>
        </div>
      </div>

      {/* Shipping Address */}
      <div className="rounded-xl border bg-white p-5 mb-4">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {t('orders.shipping_address')}
        </h2>
        <p className="font-medium">{order.shipping_address.full_name}</p>
        <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
        <p className="text-sm text-gray-600">{order.shipping_address.address_line1}</p>
        <p className="text-sm text-gray-600">
          {order.shipping_address.city}, {order.shipping_address.state_province}
        </p>
      </div>

      {/* Cancel */}
      {order.status === 'pending' && (
        <Button
          variant="outline"
          className="w-full text-red-500 border-red-200 hover:bg-red-50"
          onClick={() => setShowCancelDialog(true)}
        >
          {t('orders.cancel_order')}
        </Button>
      )}

      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('orders.cancel_order')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{t('orders.cancel_confirm')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCancelDialog(false)}>{t('common.cancel')}</Button>
            <Button
              variant="destructive"
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
            >
              {cancelOrder.isPending ? t('common.loading') : t('common.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
