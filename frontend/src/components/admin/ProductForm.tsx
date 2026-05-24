import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { ImageUploader } from './ImageUploader'
import { VariantManager } from './VariantManager'
import { useAdminCategories } from '@/hooks/useAdmin'
import type { Product } from '@/types'

const productSchema = z.object({
  name_en: z.string().min(2, 'Name in English is required'),
  name_ar: z.string().min(2, 'Name in Arabic is required'),
  description_en: z.string().min(10),
  description_ar: z.string().min(10),
  category_id: z.string().min(1, 'Category is required'),
  base_price: z.number().min(0.01),
  sale_price: z.number().optional(),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true)
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  defaultValues?: Partial<Product>
  onSubmit: (data: ProductFormValues, images: File[], primaryIndex: number) => void
  isLoading?: boolean
}

export function ProductForm({
  defaultValues,
  onSubmit,
  isLoading
}: ProductFormProps) {
  const { t } = useTranslation()
  const { data: categories } = useAdminCategories()
  let uploadedImages: File[] = []
  let primaryImageIndex = 0

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name_en: defaultValues?.name_en ?? '',
      name_ar: defaultValues?.name_ar ?? '',
      description_en: defaultValues?.description_en ?? '',
      description_ar: defaultValues?.description_ar ?? '',
      category_id: defaultValues?.category_id?.toString() ?? '',
      base_price: defaultValues?.base_price ?? 0,
      sale_price: defaultValues?.sale_price,
      is_featured: defaultValues?.is_featured ?? false,
      is_active: defaultValues?.is_active ?? true
    }
  })

  const isFeatured = watch('is_featured')
  const isActive = watch('is_active')

  const handleFormSubmit = (data: ProductFormValues) => {
    onSubmit(data, uploadedImages, primaryImageIndex)
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Info */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Basic Information</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="name_en" className="mb-1 block">
              {t('admin.name_en')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name_en"
              {...register('name_en')}
              className={errors.name_en ? 'border-red-500' : ''}
            />
            {errors.name_en && (
              <p className="mt-1 text-xs text-red-500">{errors.name_en.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="name_ar" className="mb-1 block">
              {t('admin.name_ar')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name_ar"
              {...register('name_ar')}
              dir="rtl"
              className={errors.name_ar ? 'border-red-500' : ''}
            />
            {errors.name_ar && (
              <p className="mt-1 text-xs text-red-500">{errors.name_ar.message}</p>
            )}
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description_en" className="mb-1 block">
              {t('admin.description_en')} <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description_en"
              {...register('description_en')}
              rows={3}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                errors.description_en ? 'border-red-500' : 'border-input'
              }`}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="description_ar" className="mb-1 block">
              {t('admin.description_ar')} <span className="text-red-500">*</span>
            </Label>
            <textarea
              id="description_ar"
              {...register('description_ar')}
              rows={3}
              dir="rtl"
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-600 ${
                errors.description_ar ? 'border-red-500' : 'border-input'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Pricing + Category */}
      <div className="rounded-xl border bg-white p-5 space-y-4">
        <h3 className="font-semibold text-gray-900">Pricing & Category</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="category_id" className="mb-1 block">
              {t('admin.category')} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch('category_id')}
              onValueChange={(v) => setValue('category_id', v)}
            >
              <SelectTrigger className={errors.category_id ? 'border-red-500' : ''}>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="base_price" className="mb-1 block">
              {t('admin.base_price')} (₪) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="base_price"
              type="number"
              step="0.01"
              min="0"
              {...register('base_price', { valueAsNumber: true })}
              className={errors.base_price ? 'border-red-500' : ''}
            />
          </div>
          <div>
            <Label htmlFor="sale_price" className="mb-1 block">
              {t('admin.sale_price')} (₪)
            </Label>
            <Input
              id="sale_price"
              type="number"
              step="0.01"
              min="0"
              {...register('sale_price', { valueAsNumber: true })}
            />
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <Switch
              checked={isFeatured}
              onCheckedChange={(v) => setValue('is_featured', v)}
            />
            <Label>{t('admin.is_featured')}</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={(v) => setValue('is_active', v)}
            />
            <Label>{t('admin.is_active')}</Label>
          </div>
        </div>
      </div>

      {/* Images */}
      <div className="rounded-xl border bg-white p-5">
        <h3 className="font-semibold text-gray-900 mb-4">{t('admin.images')}</h3>
        <ImageUploader
          onChange={(files, primaryIdx) => {
            uploadedImages = files
            primaryImageIndex = primaryIdx
          }}
        />
      </div>

      {/* Variants */}
      <div className="rounded-xl border bg-white p-5">
        <VariantManager onChange={() => {}} />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full sm:w-auto" size="lg">
        {isLoading ? t('common.loading') : t('common.save')}
      </Button>
    </form>
  )
}
