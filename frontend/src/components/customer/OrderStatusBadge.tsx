import { useTranslation } from 'react-i18next'
import { Badge } from '@/components/ui/badge'
import { getOrderStatusColor } from '@/lib/utils'
import type { Order } from '@/types'

interface OrderStatusBadgeProps {
  status: Order['status']
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const { t } = useTranslation()

  const statusMap: Record<Order['status'], string> = {
    pending: t('orders.status_pending'),
    confirmed: t('orders.status_confirmed'),
    processing: t('orders.status_processing'),
    shipped: t('orders.status_shipped'),
    delivered: t('orders.status_delivered'),
    cancelled: t('orders.status_cancelled'),
    refunded: t('orders.status_refunded')
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getOrderStatusColor(status)}`}>
      {statusMap[status]}
    </span>
  )
}

interface PaymentStatusBadgeProps {
  status: Order['payment_status']
}

export function PaymentStatusBadge({ status }: PaymentStatusBadgeProps) {
  const { t } = useTranslation()

  const statusMap: Record<Order['payment_status'], string> = {
    pending: t('orders.payment_pending'),
    paid: t('orders.payment_paid'),
    failed: t('orders.payment_failed'),
    refunded: t('orders.payment_refunded')
  }

  const colorMap: Record<Order['payment_status'], string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    paid: 'bg-green-100 text-green-800',
    failed: 'bg-red-100 text-red-800',
    refunded: 'bg-gray-100 text-gray-800'
  }

  return (
    <Badge className={colorMap[status]}>
      {statusMap[status]}
    </Badge>
  )
}
