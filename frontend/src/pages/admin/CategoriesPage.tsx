import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useAdmin'
import { toast } from '@/components/ui/use-toast'
import type { Category } from '@/types'

interface CategoryFormState {
  name_en: string
  name_ar: string
  parent_id?: string
}

export default function CategoriesPage() {
  const { t } = useTranslation()
  const { data: categories } = useAdminCategories()
  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState<CategoryFormState>({ name_en: '', name_ar: '' })

  const openCreate = () => {
    setEditingCategory(null)
    setForm({ name_en: '', name_ar: '' })
    setIsFormOpen(true)
  }

  const openEdit = (cat: Category) => {
    setEditingCategory(cat)
    setForm({ name_en: cat.name_en, name_ar: cat.name_ar, parent_id: cat.parent_id?.toString() })
    setIsFormOpen(true)
  }

  const handleSave = async () => {
    if (!form.name_en || !form.name_ar) return
    const slug = form.name_en.toLowerCase().replace(/\s+/g, '-')
    try {
      if (editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory.id,
          name_en: form.name_en,
          name_ar: form.name_ar,
          parent_id: form.parent_id ? Number(form.parent_id) : undefined,
          slug
        })
        toast({ title: 'Category updated' })
      } else {
        await createCategory.mutateAsync({
          name_en: form.name_en,
          name_ar: form.name_ar,
          parent_id: form.parent_id ? Number(form.parent_id) : undefined,
          slug
        })
        toast({ title: 'Category created' })
      }
      setIsFormOpen(false)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCategory.mutateAsync(deleteId)
      toast({ title: 'Category deleted' })
      setDeleteId(null)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const rootCategories = categories?.filter((c) => !c.parent_id) ?? []
  const childCategories = categories?.filter((c) => c.parent_id) ?? []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('admin.categories')}</h1>
        <Button onClick={openCreate}>
          <Plus className="me-2 h-4 w-4" />
          {t('admin.add_category')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border p-4">
        {rootCategories.length === 0 ? (
          <p className="text-center py-12 text-gray-500">{t('admin.no_products')}</p>
        ) : (
          <div className="space-y-2">
            {rootCategories.map((cat) => (
              <div key={cat.id}>
                <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    {cat.image && (
                      <img src={cat.image} alt="" className="h-8 w-8 rounded-md object-cover" />
                    )}
                    <div>
                      <p className="font-medium">{cat.name_en}</p>
                      <p className="text-xs text-gray-500">{cat.name_ar}</p>
                    </div>
                    {cat.products_count !== undefined && (
                      <span className="text-xs text-gray-400">{cat.products_count} products</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(cat)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(cat.id)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Children */}
                {childCategories.filter((c) => c.parent_id === cat.id).map((child) => (
                  <div key={child.id} className="flex items-center justify-between p-3 ps-10 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium">{child.name_en}</p>
                        <p className="text-xs text-gray-500">{child.name_ar}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(child)} className="h-7 w-7 p-0">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(child.id)}
                        className="h-7 w-7 p-0 text-red-500"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? t('admin.edit_category') : t('admin.add_category')}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="mb-1 block">{t('admin.name_en')}</Label>
              <Input
                value={form.name_en}
                onChange={(e) => setForm({ ...form, name_en: e.target.value })}
                placeholder="Category name"
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('admin.name_ar')}</Label>
              <Input
                value={form.name_ar}
                onChange={(e) => setForm({ ...form, name_ar: e.target.value })}
                placeholder="اسم الفئة"
                dir="rtl"
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('admin.parent_category')}</Label>
              <Select
                value={form.parent_id ?? 'none'}
                onValueChange={(v) => setForm({ ...form, parent_id: v === 'none' ? undefined : v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="No parent (root category)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (root category)</SelectItem>
                  {rootCategories
                    .filter((c) => c.id !== editingCategory?.id)
                    .map((cat) => (
                      <SelectItem key={cat.id} value={String(cat.id)}>{cat.name_en}</SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>{t('common.cancel')}</Button>
            <Button
              onClick={handleSave}
              disabled={createCategory.isPending || updateCategory.isPending}
            >
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.edit_category')}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{t('admin.confirm_delete')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteCategory.isPending}
            >
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
