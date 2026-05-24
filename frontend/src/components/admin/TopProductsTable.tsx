import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatPrice, getImageUrl } from '@/lib/utils'
import type { TopProduct } from '@/types'

interface TopProductsTableProps {
  products: TopProduct[]
}

export function TopProductsTable({ products }: TopProductsTableProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('admin.top_products')}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-y">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-gray-600">Product</th>
              <th className="px-4 py-3 text-start font-medium text-gray-600">Sales</th>
              <th className="px-4 py-3 text-end font-medium text-gray-600">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, i) => (
              <tr key={product.id} className="border-b last:border-0 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      {product.image && (
                        <img
                          src={getImageUrl(product.image)}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {lang === 'ar' ? product.name_ar : product.name_en}
                      </p>
                      <p className="text-xs text-gray-500">#{i + 1}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">{product.sales_count}</td>
                <td className="px-4 py-3 text-end font-medium text-gray-900">
                  {formatPrice(product.revenue, lang)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  )
}
