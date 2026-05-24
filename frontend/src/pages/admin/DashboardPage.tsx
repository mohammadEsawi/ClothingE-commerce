import { useTranslation } from 'react-i18next'
import { DollarSign, ShoppingBag, Users, Clock } from 'lucide-react'
import { StatsCard } from '@/components/admin/StatsCard'
import { SalesChart } from '@/components/admin/SalesChart'
import { TopProductsTable } from '@/components/admin/TopProductsTable'
import { OrderStatusBadge } from '@/components/customer/OrderStatusBadge'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  useDashboardStats,
  useSalesData,
  useTopProducts,
  useAdminOrders
} from '@/hooks/useAdmin'
import { formatPrice, formatDate } from '@/lib/utils'

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: stats, isLoading: statsLoading } = useDashboardStats()
  const { data: salesData } = useSalesData('daily')
  const { data: topProducts } = useTopProducts()
  const { data: recentOrdersData } = useAdminOrders(1, '', '')

  if (statsLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title={t('admin.monthly_revenue')}
          value={stats?.revenue_month ?? 0}
          change={stats?.revenue_change}
          icon={DollarSign}
          prefix="₪"
          iconColor="text-primary-600"
          iconBg="bg-primary-50"
        />
        <StatsCard
          title={t('admin.monthly_orders')}
          value={stats?.orders_month ?? 0}
          change={stats?.orders_change}
          icon={ShoppingBag}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />
        <StatsCard
          title={t('admin.total_customers')}
          value={stats?.customers_total ?? 0}
          change={stats?.customers_change}
          icon={Users}
          iconColor="text-green-600"
          iconBg="bg-green-50"
        />
        <StatsCard
          title={t('admin.pending_orders')}
          value={stats?.pending_orders ?? 0}
          icon={Clock}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {salesData && <SalesChart data={salesData} />}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'Total Revenue', value: formatPrice((stats?.revenue_month ?? 0) * 12, lang) },
              { label: 'Avg Order Value', value: formatPrice(stats?.orders_month ? (stats.revenue_month / stats.orders_month) : 0, lang) },
              { label: 'Total Orders', value: stats?.orders_month ?? 0 },
              { label: 'Active Customers', value: stats?.customers_total ?? 0 }
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.label}</span>
                <span className="font-semibold">{item.value}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t('admin.recent_orders')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentOrdersData?.data?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3 border-b last:border-0">
                <div>
                  <p className="text-sm font-mono font-medium">#{order.order_number}</p>
                  <p className="text-xs text-gray-500">{formatDate(order.created_at, lang)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <OrderStatusBadge status={order.status} />
                  <span className="text-sm font-bold">{formatPrice(order.total, lang)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top Products */}
        {topProducts && <TopProductsTable products={topProducts} />}
      </div>
    </div>
  )
}
