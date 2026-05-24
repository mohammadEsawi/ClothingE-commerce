import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
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
import { useAdminCoupons, useCreateCoupon, useUpdateCoupon, useDeleteCoupon } from '@/hooks/useAdmin'
import { formatPrice } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Coupon } from '@/types'

interface CouponForm {
  code: string
  type: 'fixed' | 'percentage'
  value: number
  min_order_amount: number
  max_discount_amount: number
  is_active: boolean
  usage_limit: number
}

const defaultForm = (): CouponForm => ({
  code: '',
  type: 'percentage',
  value: 10,
  min_order_amount: 0,
  max_discount_amount: 0,
  is_active: true,
  usage_limit: 0
})

export default function CouponsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { data: coupons } = useAdminCoupons()
  const createCoupon = useCreateCoupon()
  const updateCoupon = useUpdateCoupon()
  const deleteCoupon = useDeleteCoupon()

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [form, setForm] = useState<CouponForm>(defaultForm())

  const openCreate = () => {
    setEditingCoupon(null)
    setForm(defaultForm())
    setIsFormOpen(true)
  }

  const openEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setForm({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      min_order_amount: coupon.min_order_amount ?? 0,
      max_discount_amount: coupon.max_discount_amount ?? 0,
      is_active: coupon.is_active,
      usage_limit: coupon.usage_limit ?? 0
    })
    setIsFormOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = {
        ...form,
        min_order_amount: form.min_order_amount || undefined,
        max_discount_amount: form.max_discount_amount || undefined,
        usage_limit: form.usage_limit || undefined
      }
      if (editingCoupon) {
        await updateCoupon.mutateAsync({ id: editingCoupon.id, ...payload })
        toast({ title: 'Coupon updated' })
      } else {
        await createCoupon.mutateAsync(payload as Omit<Coupon, 'id'>)
        toast({ title: 'Coupon created' })
      }
      setIsFormOpen(false)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await deleteCoupon.mutateAsync(deleteId)
      toast({ title: 'Coupon deleted' })
      setDeleteId(null)
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold">{t('admin.coupons')}</h1>
        <Button onClick={openCreate}>
          <Plus className="me-2 h-4 w-4" />
          {t('admin.add_coupon')}
        </Button>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-start font-medium text-gray-600">{t('admin.coupon_code')}</th>
              <th className="px-4 py-3 text-start font-medium text-gray-600">{t('admin.discount_type')}</th>
              <th className="px-4 py-3 text-start font-medium text-gray-600">{t('admin.discount_value')}</th>
              <th className="px-4 py-3 text-start font-medium text-gray-600">Usage</th>
              <th className="px-4 py-3 text-start font-medium text-gray-600">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {coupons?.map((coupon) => (
              <tr key={coupon.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className="font-mono font-medium text-primary-600">{coupon.code}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="outline">
                    {coupon.type === 'fixed' ? t('admin.fixed') : t('admin.percentage')}
                  </Badge>
                </td>
                <td className="px-4 py-3 font-medium">
                  {coupon.type === 'fixed'
                    ? formatPrice(coupon.value, lang)
                    : `${coupon.value}%`}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {coupon.usage_count ?? 0}
                  {coupon.usage_limit ? ` / ${coupon.usage_limit}` : ''}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={coupon.is_active ? 'success' : 'secondary'}>
                    {coupon.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(coupon)} className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(coupon.id)}
                      className="h-8 w-8 p-0 text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {(!coupons || coupons.length === 0) && (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                  {t('admin.no_coupons')}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingCoupon ? t('admin.edit_coupon') : t('admin.add_coupon')}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2">
              <Label className="mb-1 block">{t('admin.coupon_code')}</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="font-mono"
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('admin.discount_type')}</Label>
              <Select
                value={form.type}
                onValueChange={(v) => setForm({ ...form, type: v as 'fixed' | 'percentage' })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">{t('admin.percentage')}</SelectItem>
                  <SelectItem value="fixed">{t('admin.fixed')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1 block">
                {t('admin.discount_value')} {form.type === 'percentage' ? '(%)' : '(₪)'}
              </Label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: Number(e.target.value) })}
                min={0}
                max={form.type === 'percentage' ? 100 : undefined}
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('admin.min_order')} (₪)</Label>
              <Input
                type="number"
                value={form.min_order_amount}
                onChange={(e) => setForm({ ...form, min_order_amount: Number(e.target.value) })}
                min={0}
              />
            </div>
            <div>
              <Label className="mb-1 block">{t('admin.usage_limit')}</Label>
              <Input
                type="number"
                value={form.usage_limit}
                onChange={(e) => setForm({ ...form, usage_limit: Number(e.target.value) })}
                min={0}
                placeholder="0 = unlimited"
              />
            </div>
            <div className="col-span-2 flex items-center gap-2">
              <Switch
                checked={form.is_active}
                onCheckedChange={(v) => setForm({ ...form, is_active: v })}
              />
              <Label>Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>{t('common.cancel')}</Button>
            <Button onClick={handleSave} disabled={createCoupon.isPending || updateCoupon.isPending}>
              {t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Coupon</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">{t('admin.confirm_delete')}</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteCoupon.isPending}>
              {t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
