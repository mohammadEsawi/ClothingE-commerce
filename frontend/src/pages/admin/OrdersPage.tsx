import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { DataTable } from '@/components/admin/DataTable'
import { OrderStatusBadge } from '@/components/customer/OrderStatusBadge'
import { useAdminOrders } from '@/hooks/useAdmin'
import { formatPrice, formatDate } from '@/lib/utils'
import type { Order } from '@/types'

const STATUS_OPTIONS = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function AdminOrdersPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')

  const { data, isLoading } = useAdminOrders(page, status, search)

  const columns = [
    {
      key: 'order_number',
      header: 'Order #',
      sortable: true,
      render: (row: Order) => (
        <span className="font-mono font-medium text-primary-600">#{row.order_number}</span>
      )
    },
    {
      key: 'customer',
      header: t('admin.customer_name'),
      render: (row: Order) => (
        <div>
          <p className="font-medium">{row.shipping_address.full_name}</p>
          <p className="text-xs text-gray-500">{row.shipping_address.phone}</p>
        </div>
      )
    },
    {
      key: 'total',
      header: t('orders.total'),
      sortable: true,
      render: (row: Order) => (
        <span className="font-semibold">{formatPrice(row.total, lang)}</span>
      )
    },
    {
      key: 'status',
      header: t('orders.order_status'),
      render: (row: Order) => <OrderStatusBadge status={row.status} />
    },
    {
      key: 'created_at',
      header: t('orders.order_date'),
      sortable: true,
      render: (row: Order) => (
        <span className="text-sm text-gray-600">{formatDate(row.created_at, lang)}</span>
      )
    },
    {
      key: 'actions',
      header: t('admin.actions'),
      render: (row: Order) => (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/admin/orders/${row.id}`)}
          className="h-8 w-8 p-0"
        >
          <Eye className="h-4 w-4" />
        </Button>
      )
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('admin.orders')}</h1>
        <Select value={status || 'all'} onValueChange={(v) => { setStatus(v === 'all' ? '' : v); setPage(1) }}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {STATUS_OPTIONS.filter(Boolean).map((s) => (
              <SelectItem key={s} value={s}>{t(`orders.status_${s}`)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <DataTable
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          searchPlaceholder="Search orders..."
          onSearch={(q) => { setSearch(q); setPage(1) }}
          currentPage={page}
          totalPages={data?.meta?.last_page ?? 1}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage={t('admin.no_orders')}
        />
      </div>
    </div>
  )
}
