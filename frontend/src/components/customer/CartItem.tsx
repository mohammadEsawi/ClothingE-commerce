import { useTranslation } from 'react-i18next'
import { Trash2, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart'
import { formatPrice, getImageUrl } from '@/lib/utils'
import type { CartItem as CartItemType } from '@/types'

interface CartItemProps {
  item: CartItemType
}

export function CartItem({ item }: CartItemProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const updateItem = useUpdateCartItem()
  const removeItem = useRemoveCartItem()

  const product = item.variant.product
  const name = lang === 'ar' ? product.name_ar : product.name_en
  const price =
    item.variant.price_override ??
    product.sale_price ??
    product.base_price
  const primaryImage = product.primary_image || product.images?.[0]

  return (
    <div className="flex gap-3 py-3 border-b last:border-0">
      {/* Image */}
      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-md bg-gray-50">
        <img
          src={getImageUrl(primaryImage?.image_url)}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{name}</h4>
        <div className="flex items-center gap-2 mt-0.5">
          {item.variant.color && (
            <div
              className="h-3.5 w-3.5 rounded-full border border-gray-200"
              style={{ backgroundColor: item.variant.color.hex_code }}
            />
          )}
          {item.variant.size && (
            <span className="text-xs text-gray-500">{item.variant.size.name}</span>
          )}
        </div>
        <p className="text-sm font-semibold text-primary-600 mt-1">
          {formatPrice(price, lang)}
        </p>

        {/* Quantity + Remove */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <button
              onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity - 1 })}
              disabled={item.quantity <= 1 || updateItem.isPending}
              className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
            <button
              onClick={() => updateItem.mutate({ id: item.id, quantity: item.quantity + 1 })}
              disabled={updateItem.isPending}
              className="flex h-7 w-7 items-center justify-center rounded-md border hover:bg-gray-50 disabled:opacity-50"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          <button
            onClick={() => removeItem.mutate(item.id)}
            disabled={removeItem.isPending}
            className="flex items-center justify-center w-7 h-7 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Total */}
      <div className="text-sm font-bold text-gray-900 shrink-0">
        {formatPrice(price * item.quantity, lang)}
      </div>
    </div>
  )
}
