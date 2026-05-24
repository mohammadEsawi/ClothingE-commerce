import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tag, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useApplyCoupon } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils'

interface CouponInputProps {
  onDiscountApplied: (code: string, discount: number) => void
  appliedCode?: string
  discount?: number
}

export function CouponInput({
  onDiscountApplied,
  appliedCode,
  discount
}: CouponInputProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const applyCoupon = useApplyCoupon()

  const handleApply = async () => {
    if (!code.trim()) return
    setError('')
    try {
      const result = await applyCoupon.mutateAsync(code.trim())
      onDiscountApplied(code.trim(), result.discount)
      setCode('')
    } catch {
      setError(t('checkout.coupon_invalid'))
    }
  }

  const handleClear = () => {
    onDiscountApplied('', 0)
    setCode('')
    setError('')
  }

  if (appliedCode && discount) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-3 py-2">
        <div className="flex items-center gap-2">
          <Tag className="h-4 w-4 text-green-600" />
          <span className="text-sm font-medium text-green-800">{appliedCode}</span>
          <span className="text-sm text-green-600">-{formatPrice(discount, lang)}</span>
        </div>
        <button
          onClick={handleClear}
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-green-200"
        >
          <X className="h-3 w-3 text-green-700" />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-1">
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t('checkout.coupon_code')}
          className={error ? 'border-red-500' : ''}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
        />
        <Button
          variant="outline"
          onClick={handleApply}
          disabled={!code.trim() || applyCoupon.isPending}
          className="shrink-0"
        >
          {applyCoupon.isPending ? '...' : t('checkout.apply')}
        </Button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
}
