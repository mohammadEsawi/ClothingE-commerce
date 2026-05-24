import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface VariantRow {
  color_name: string
  color_hex: string
  size_name: string
  sku: string
  price_override: string
  stock_quantity: string
}

interface VariantManagerProps {
  onChange: (variants: VariantRow[]) => void
  initialVariants?: VariantRow[]
}

const defaultRow = (): VariantRow => ({
  color_name: '',
  color_hex: '#000000',
  size_name: '',
  sku: '',
  price_override: '',
  stock_quantity: '0'
})

export function VariantManager({ onChange, initialVariants }: VariantManagerProps) {
  const { t } = useTranslation()
  const [rows, setRows] = useState<VariantRow[]>(
    initialVariants ?? [defaultRow()]
  )

  const updateRow = (index: number, key: keyof VariantRow, value: string) => {
    const updated = rows.map((row, i) =>
      i === index ? { ...row, [key]: value } : row
    )
    setRows(updated)
    onChange(updated)
  }

  const addRow = () => {
    const updated = [...rows, defaultRow()]
    setRows(updated)
    onChange(updated)
  }

  const removeRow = (index: number) => {
    const updated = rows.filter((_, i) => i !== index)
    setRows(updated)
    onChange(updated)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t('admin.variants')}</Label>
        <Button type="button" variant="outline" size="sm" onClick={addRow}>
          <Plus className="me-1.5 h-4 w-4" />
          {t('admin.add_variant')}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-3 py-2 text-start font-medium text-gray-600">Color</th>
              <th className="px-3 py-2 text-start font-medium text-gray-600">Hex</th>
              <th className="px-3 py-2 text-start font-medium text-gray-600">Size</th>
              <th className="px-3 py-2 text-start font-medium text-gray-600">SKU</th>
              <th className="px-3 py-2 text-start font-medium text-gray-600">Price Override</th>
              <th className="px-3 py-2 text-start font-medium text-gray-600">Stock</th>
              <th className="px-3 py-2" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className="border-b last:border-0">
                <td className="px-3 py-2">
                  <Input
                    value={row.color_name}
                    onChange={(e) => updateRow(i, 'color_name', e.target.value)}
                    placeholder="e.g. Black"
                    className="h-8 text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <input
                      type="color"
                      value={row.color_hex}
                      onChange={(e) => updateRow(i, 'color_hex', e.target.value)}
                      className="h-8 w-8 rounded border cursor-pointer"
                    />
                    <Input
                      value={row.color_hex}
                      onChange={(e) => updateRow(i, 'color_hex', e.target.value)}
                      className="h-8 text-xs w-24"
                    />
                  </div>
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.size_name}
                    onChange={(e) => updateRow(i, 'size_name', e.target.value)}
                    placeholder="e.g. M"
                    className="h-8 text-xs w-16"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    value={row.sku}
                    onChange={(e) => updateRow(i, 'sku', e.target.value)}
                    placeholder="SKU-001"
                    className="h-8 text-xs"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={row.price_override}
                    onChange={(e) => updateRow(i, 'price_override', e.target.value)}
                    placeholder="Optional"
                    className="h-8 text-xs w-24"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <Input
                    type="number"
                    value={row.stock_quantity}
                    onChange={(e) => updateRow(i, 'stock_quantity', e.target.value)}
                    className="h-8 text-xs w-20"
                    min="0"
                  />
                </td>
                <td className="px-3 py-2">
                  <button
                    type="button"
                    onClick={() => removeRow(i)}
                    disabled={rows.length === 1}
                    className="flex h-8 w-8 items-center justify-center rounded-md text-red-500 hover:bg-red-50 disabled:opacity-30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
