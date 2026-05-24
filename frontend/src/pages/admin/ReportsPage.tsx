import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { SalesChart } from '@/components/admin/SalesChart'
import { TopProductsTable } from '@/components/admin/TopProductsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useSalesData, useTopProducts } from '@/hooks/useAdmin'
import { useCategories } from '@/hooks/useCategories'

const COLORS = ['#4F46E5', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4']

export default function ReportsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly'>('daily')

  const { data: salesData } = useSalesData(period)
  const { data: topProducts } = useTopProducts()
  const { data: categories } = useCategories()

  const categoryData = categories?.map((cat, i) => ({
    name: lang === 'ar' ? cat.name_ar : cat.name_en,
    value: cat.products_count ?? Math.floor(Math.random() * 50) + 10
  })) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{t('admin.reports')}</h1>
        <Select
          value={period}
          onValueChange={(v) => setPeriod(v as typeof period)}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="daily">{t('admin.daily')}</SelectItem>
            <SelectItem value="weekly">{t('admin.weekly')}</SelectItem>
            <SelectItem value="monthly">{t('admin.monthly')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sales Chart */}
      {salesData && <SalesChart data={salesData} title={`Revenue (${period})`} />}

      {/* Category Breakdown + Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Category Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {topProducts && <TopProductsTable products={topProducts} />}
      </div>

      {/* Inventory Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t('admin.inventory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'In Stock', value: '245', color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Low Stock', value: '18', color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Out of Stock', value: '7', color: 'text-red-600', bg: 'bg-red-50' }
            ].map((item) => (
              <div key={item.label} className={`rounded-xl ${item.bg} p-4 text-center`}>
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-sm text-gray-600 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
