import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DataTable } from '@/components/admin/DataTable'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useAdminCustomers } from '@/hooks/useAdmin'
import { formatDate, formatPrice } from '@/lib/utils'
import type { User } from '@/types'

interface CustomerRow extends User {
  orders_count?: number
  total_spent?: number
  created_at?: string
}

export default function CustomersPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useAdminCustomers(page, search)

  const columns = [
    {
      key: 'name',
      header: t('admin.customer_name'),
      sortable: true,
      render: (row: CustomerRow) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
              {row.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{row.name}</p>
            <p className="text-xs text-gray-500">{row.email}</p>
          </div>
        </div>
      )
    },
    {
      key: 'phone',
      header: t('account.phone'),
      render: (row: CustomerRow) => <span className="text-sm">{row.phone ?? '—'}</span>
    },
    {
      key: 'orders_count',
      header: t('admin.orders_count'),
      sortable: true,
      render: (row: CustomerRow) => <span>{row.orders_count ?? 0}</span>
    },
    {
      key: 'total_spent',
      header: t('admin.total_spent'),
      sortable: true,
      render: (row: CustomerRow) => (
        <span className="font-medium">{formatPrice(row.total_spent ?? 0, lang)}</span>
      )
    },
    {
      key: 'created_at',
      header: t('admin.joined_date'),
      sortable: true,
      render: (row: CustomerRow) => (
        <span className="text-sm text-gray-600">
          {row.created_at ? formatDate(row.created_at, lang) : '—'}
        </span>
      )
    }
  ]

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">{t('admin.customers')}</h1>

      <div className="bg-white rounded-xl border p-4">
        <DataTable
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          searchPlaceholder="Search customers..."
          onSearch={(q) => { setSearch(q); setPage(1) }}
          currentPage={page}
          totalPages={data?.meta?.last_page ?? 1}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage={t('admin.no_customers')}
        />
      </div>
    </div>
  )
}
