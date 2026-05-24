import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Package } from 'lucide-react'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { EmptyState } from '@/components/shared/EmptyState'
import { OrderStatusBadge } from '@/components/customer/OrderStatusBadge'
import { useOrders } from '@/hooks/useOrders'
import { formatPrice, formatDate } from '@/lib/utils'

export default function OrdersPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const { data: orders, isLoading } = useOrders()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">{t('orders.my_orders')}</h1>

      {!orders || orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title={t('orders.no_orders')}
          description={t('orders.no_orders_desc')}
          action={{ label: t('cart.continue_shopping'), onClick: () => navigate('/shop') }}
        />
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              onClick={() => navigate(`/orders/${order.id}`)}
              className="rounded-xl border bg-white p-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-sm font-semibold text-primary-600">
                    #{order.order_number}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(order.created_at, lang)}
                  </p>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="flex items-center gap-3 mb-3">
                {order.items.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    className="h-12 w-10 rounded-md bg-gray-100 overflow-hidden text-xs flex items-center justify-center text-gray-400"
                  >
                    <Package className="h-4 w-4" />
                  </div>
                ))}
                {order.items.length > 3 && (
                  <span className="text-xs text-gray-500">+{order.items.length - 3} more</span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">
                  {order.items.length} {order.items.length === 1 ? t('common.item') : t('common.items')}
                </span>
                <span className="font-bold text-gray-900">
                  {formatPrice(order.total, lang)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
