import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useUpdateOrderStatus } from '@/hooks/useAdmin'
import { toast } from '@/components/ui/use-toast'
import type { Order } from '@/types'

interface OrderStatusUpdateProps {
  order: Order
}

const STATUS_OPTIONS: Order['status'][] = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
  'refunded'
]

export function OrderStatusUpdate({ order }: OrderStatusUpdateProps) {
  const { t } = useTranslation()
  const [status, setStatus] = useState(order.status)
  const [tracking, setTracking] = useState(order.tracking_number ?? '')
  const updateStatus = useUpdateOrderStatus()

  const handleUpdate = async () => {
    try {
      await updateStatus.mutateAsync({
        id: order.id,
        status,
        tracking_number: tracking || undefined
      })
      toast({ title: 'Order status updated', variant: 'default' })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  return (
    <div className="rounded-xl border bg-white p-5 space-y-4">
      <h3 className="font-semibold">{t('admin.update_status')}</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">{t('orders.order_status')}</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as Order['status'])}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((s) => (
                <SelectItem key={s} value={s}>
                  {t(`orders.status_${s}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {(status === 'shipped' || order.tracking_number) && (
          <div>
            <Label className="mb-1 block">{t('admin.tracking_number')}</Label>
            <Input
              value={tracking}
              onChange={(e) => setTracking(e.target.value)}
              placeholder="e.g. IL123456789"
            />
          </div>
        )}
      </div>
      <Button
        onClick={handleUpdate}
        disabled={updateStatus.isPending}
        size="sm"
      >
        {updateStatus.isPending ? t('common.loading') : t('common.update')}
      </Button>
    </div>
  )
}
