import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductForm } from '@/components/admin/ProductForm'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'
import { useAdminProduct, useCreateProduct, useUpdateProduct, useUploadProductImage } from '@/hooks/useAdmin'
import { toast } from '@/components/ui/use-toast'

export default function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const isEdit = !!id && id !== 'new'

  const { data: product, isLoading } = useAdminProduct(isEdit ? Number(id) : 0)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const uploadImage = useUploadProductImage()

  const handleSubmit = async (
    data: Parameters<React.ComponentProps<typeof ProductForm>['onSubmit']>[0],
    images: File[],
    primaryIndex: number
  ) => {
    try {
      let savedProduct: Awaited<ReturnType<typeof createProduct.mutateAsync>> | undefined

      if (isEdit && product) {
        savedProduct = await updateProduct.mutateAsync({ id: product.id, ...data })
        toast({ title: 'Product updated' })
      } else {
        savedProduct = await createProduct.mutateAsync(data)
        toast({ title: 'Product created' })
      }

      // Upload images if any
      if (images.length > 0 && savedProduct) {
        const formData = new FormData()
        images.forEach((file, i) => {
          formData.append('images[]', file)
          if (i === primaryIndex) {
            formData.append('primary_index', String(i))
          }
        })
        await uploadImage.mutateAsync({ productId: savedProduct.id, formData })
      }

      navigate('/admin/products')
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')} className="gap-1">
          <ChevronLeft className="h-4 w-4 rtl-flip" />
          {t('common.back')}
        </Button>
        <h1 className="text-xl font-semibold">
          {isEdit ? t('admin.edit_product') : t('admin.add_product')}
        </h1>
      </div>

      <ProductForm
        defaultValues={product}
        onSubmit={handleSubmit}
        isLoading={createProduct.isPending || updateProduct.isPending}
      />
    </div>
  )
}
