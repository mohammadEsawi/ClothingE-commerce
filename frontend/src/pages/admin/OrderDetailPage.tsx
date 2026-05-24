import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, MapPin, CreditCard, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { OrderStatusBadge, PaymentStatusBadge } from '@/components/customer/OrderStatusBadge'
import { OrderStatusUpdate } from '@/components/admin/OrderStatusUpdate'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAdminOrder } from '@/hooks/useAdmin'
import { formatPrice, formatDate } from '@/lib/utils'

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { data: order, isLoading } = useAdminOrder(id ?? '')

  if (isLoading) return <LoadingSpinner />
  if (!order) return <div className="p-12 text-center">Order not found</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/orders')}>
          <ChevronLeft className="h-4 w-4 rtl-flip" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Order #{order.order_number}</h1>
          <p className="text-sm text-gray-500">{formatDate(order.created_at, lang)}</p>
        </div>
        <div className="ms-auto flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment_status} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {/* Items */}
          <div className="rounded-xl border bg-white p-5">
            <h2 className="font-semibold mb-4 flex items-center gap-2">
              <Package className="h-4 w-4" />
              {t('orders.items')}
            </h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="h-14 w-12 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                    <Package className="h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product_name}</p>
                    <p className="text-xs text-gray-500">
                      {item.color_name} {item.size_name && `/ ${item.size_name}`} × {item.quantity}
                    </p>
                    <p className="text-xs font-mono text-gray-400">{item.sku}</p>
                  </div>
                  <div className="text-end">
                    <p className="text-sm font-semibold">{formatPrice(item.total_price, lang)}</p>
                    <p className="text-xs text-gray-400">{formatPrice(item.unit_price, lang)}/each</p>
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.subtotal')}</span>
                <span>{formatPrice(order.subtotal, lang)}</span>
              </div>
              {order.discount_amount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>{t('cart.discount')}</span>
                  <span>-{formatPrice(order.discount_amount, lang)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">{t('cart.shipping')}</span>
                <span>{formatPrice(order.shipping_cost, lang)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>{t('cart.total')}</span>
                <span className="text-primary-600">{formatPrice(order.total, lang)}</span>
              </div>
            </div>
          </div>

          {/* Status Update */}
          <OrderStatusUpdate order={order} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Customer */}
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t('orders.shipping_address')}
            </h3>
            <p className="font-medium">{order.shipping_address.full_name}</p>
            <p className="text-sm text-gray-600">{order.shipping_address.phone}</p>
            <p className="text-sm text-gray-600">{order.shipping_address.address_line1}</p>
            {order.shipping_address.address_line2 && (
              <p className="text-sm text-gray-600">{order.shipping_address.address_line2}</p>
            )}
            <p className="text-sm text-gray-600">
              {order.shipping_address.city}, {order.shipping_address.state_province}
            </p>
          </div>

          {/* Payment */}
          <div className="rounded-xl border bg-white p-5">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              {t('orders.payment_info')}
            </h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">{t('orders.payment_status')}</span>
              <PaymentStatusBadge status={order.payment_status} />
            </div>
            {order.tracking_number && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">{t('admin.tracking_number')}</p>
                <p className="font-mono text-primary-600">{order.tracking_number}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
