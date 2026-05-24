import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/components/ui/use-toast'
import api from '@/lib/axios'
import type { ApiResponse, User } from '@/types'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  terms: z.boolean().refine((v) => v === true, 'You must accept terms')
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ['password_confirmation']
})

type RegisterValues = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', phone: '', password: '', password_confirmation: '', terms: false }
  })

  const terms = watch('terms')

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true)
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/register',
        { name: data.name, email: data.email, phone: data.phone, password: data.password, password_confirmation: data.password_confirmation }
      )
      const { user, token } = response.data.data
      setAuth(user, token)
      toast({ title: t('auth.register_success') })
      navigate('/')
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.sign_up')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('auth.already_account')} {' '}
          <Link to="/login" className="text-primary-600 font-medium hover:underline">
            {t('auth.sign_in')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name" className="mb-1 block">{t('auth.name')}</Label>
          <Input
            id="name"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="email" className="mb-1 block">{t('auth.email')}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phone" className="mb-1 block">
            {t('auth.phone')} <span className="text-gray-400 text-xs">({t('common.optional')})</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            {...register('phone')}
            placeholder="+972 50 000 0000"
          />
        </div>

        <div>
          <Label htmlFor="password" className="mb-1 block">{t('auth.password')}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              {...register('password')}
              className={errors.password ? 'border-red-500 pe-10' : 'pe-10'}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="password_confirmation" className="mb-1 block">{t('auth.confirm_password')}</Label>
          <Input
            id="password_confirmation"
            type={showPassword ? 'text' : 'password'}
            {...register('password_confirmation')}
            className={errors.password_confirmation ? 'border-red-500' : ''}
          />
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>
          )}
        </div>

        <div className="flex items-start gap-2">
          <Checkbox
            id="terms"
            checked={terms}
            onCheckedChange={(v) => setValue('terms', !!v)}
            className="mt-0.5"
          />
          <Label htmlFor="terms" className="cursor-pointer text-sm leading-snug">
            {t('auth.terms_agree')}
          </Label>
        </div>
        {errors.terms && <p className="text-xs text-red-500">{errors.terms.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('auth.sign_up')}
        </Button>
      </form>
    </div>
  )
}
