import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { DataTable } from '@/components/admin/DataTable'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import { useAdminProducts, useDeleteProduct } from '@/hooks/useAdmin'
import { getImageUrl, formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Product } from '@/types'

export default function ProductsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { data, isLoading } = useAdminProducts(page, search)
  const deleteProduct = useDeleteProduct()

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteProduct.mutateAsync(deleteId)
      toast({ title: 'Product deleted' })
      setDeleteId(null)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const columns = [
    {
      key: 'image',
      header: '',
      render: (row: Product) => (
        <div className="h-12 w-10 rounded-md overflow-hidden bg-gray-100">
          <img
            src={getImageUrl(row.primary_image?.image_url)}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      )
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (row: Product) => (
        <div>
          <p className="font-medium">{lang === 'ar' ? row.name_ar : row.name_en}</p>
          <p className="text-xs text-gray-500">{row.category?.name_en}</p>
        </div>
      )
    },
    {
      key: 'base_price',
      header: 'Price',
      sortable: true,
      render: (row: Product) => (
        <div>
          <p className="font-medium">{formatPrice(row.sale_price ?? row.base_price, lang)}</p>
          {row.sale_price && (
            <p className="text-xs text-gray-400 line-through">{formatPrice(row.base_price, lang)}</p>
          )}
        </div>
      )
    },
    {
      key: 'variants',
      header: 'Stock',
      render: (row: Product) => {
        const totalStock = row.variants.reduce((s, v) => s + v.stock_quantity, 0)
        const hasLow = row.variants.some((v) => v.status === 'low_stock')
        const hasOut = row.variants.some((v) => v.status === 'out_of_stock')
        return (
          <Badge variant={hasOut ? 'error' : hasLow ? 'warning' : 'success'}>
            {totalStock} units
          </Badge>
        )
      }
    },
    {
      key: 'is_active',
      header: 'Status',
      render: (row: Product) => (
        <div className="flex gap-1">
          <Badge variant={row.is_active ? 'success' : 'secondary'}>
            {row.is_active ? t('admin.is_active') : 'Inactive'}
          </Badge>
          {row.is_featured && <Badge variant="default">Featured</Badge>}
        </div>
      )
    },
    {
      key: 'actions',
      header: t('admin.actions'),
      render: (row: Product) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/products/${row.slug}`)}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/admin/products/${row.id}/edit`)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(row.id)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )
    }
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('admin.products')}</h1>
        <Button onClick={() => navigate('/admin/products/new')}>
          <Plus className="me-2 h-4 w-4" />
          {t('admin.add_product')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        <DataTable
          data={(data?.data ?? []) as unknown as Record<string, unknown>[]}
          columns={columns as Parameters<typeof DataTable>[0]['columns']}
          searchPlaceholder="Search products..."
          onSearch={setSearch}
          currentPage={page}
          totalPages={data?.meta?.last_page ?? 1}
          onPageChange={setPage}
          isLoading={isLoading}
          emptyMessage={t('admin.no_products')}
        />
      </div>

      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.delete_product')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{t('admin.confirm_delete')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteProduct.isPending}
            >
              {deleteProduct.isPending ? t('common.loading') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
