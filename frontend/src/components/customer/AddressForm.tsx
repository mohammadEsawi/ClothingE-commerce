import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import type { Address } from '@/types'

const addressSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().min(8),
  address_line1: z.string().min(5),
  address_line2: z.string().optional(),
  city: z.string().min(2),
  state_province: z.string().min(2),
  country: z.string().min(2),
  postal_code: z.string().optional(),
  is_default: z.boolean().default(false)
})

type AddressFormValues = z.infer<typeof addressSchema>

interface AddressFormProps {
  defaultValues?: Partial<Address>
  onSubmit: (data: Omit<Address, 'id'>) => void
  onCancel?: () => void
  isLoading?: boolean
}

export function AddressForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading
}: AddressFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: defaultValues?.full_name ?? '',
      phone: defaultValues?.phone ?? '',
      address_line1: defaultValues?.address_line1 ?? '',
      address_line2: defaultValues?.address_line2 ?? '',
      city: defaultValues?.city ?? '',
      state_province: defaultValues?.state_province ?? '',
      country: defaultValues?.country ?? 'Israel',
      postal_code: defaultValues?.postal_code ?? '',
      is_default: defaultValues?.is_default ?? false
    }
  })

  const isDefault = watch('is_default')

  const fields = [
    { name: 'full_name' as const, label: t('account.full_name'), required: true },
    { name: 'phone' as const, label: t('account.phone'), required: true },
    { name: 'address_line1' as const, label: t('account.address_line1'), required: true },
    { name: 'address_line2' as const, label: t('account.address_line2'), required: false },
    { name: 'city' as const, label: t('account.city'), required: true },
    { name: 'state_province' as const, label: t('account.state'), required: true },
    { name: 'country' as const, label: t('account.country'), required: true },
    { name: 'postal_code' as const, label: t('account.postal_code'), required: false }
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map(({ name, label, required }) => (
          <div key={name} className={name === 'address_line1' || name === 'address_line2' ? 'sm:col-span-2' : ''}>
            <Label htmlFor={name} className="mb-1 block">
              {label}
              {required && <span className="text-red-500 ms-1">*</span>}
            </Label>
            <Input
              id={name}
              {...register(name)}
              className={errors[name] ? 'border-red-500' : ''}
            />
            {errors[name] && (
              <p className="mt-1 text-xs text-red-500">{errors[name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="is_default"
          checked={isDefault}
          onCheckedChange={(v) => setValue('is_default', !!v)}
        />
        <Label htmlFor="is_default" className="cursor-pointer">
          {t('account.set_default')}
        </Label>
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? t('common.loading') : t('common.save')}
        </Button>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            {t('common.cancel')}
          </Button>
        )}
      </div>
    </form>
  )
}
