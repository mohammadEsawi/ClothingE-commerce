import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
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

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean().optional()
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const { setAuth } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/'

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false }
  })

  const remember = watch('remember')

  const onSubmit = async (data: LoginValues) => {
    setIsLoading(true)
    try {
      const response = await api.post<ApiResponse<{ user: User; token: string }>>(
        '/auth/login',
        { email: data.email, password: data.password }
      )
      const { user, token } = response.data.data
      setAuth(user, token)
      toast({ title: t('auth.login_success'), variant: 'default' })
      navigate(from, { replace: true })
    } catch {
      toast({ title: t('auth.invalid_credentials'), variant: 'destructive' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('auth.sign_in')}</h1>
        <p className="mt-1 text-sm text-gray-600">{t('auth.no_account')} {' '}
          <Link to="/register" className="text-primary-600 font-medium hover:underline">
            {t('auth.sign_up')}
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <a href="#" className="text-xs text-primary-600 hover:underline">
              {t('auth.forgot_password')}
            </a>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
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

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={remember}
            onCheckedChange={(v) => setValue('remember', !!v)}
          />
          <Label htmlFor="remember" className="cursor-pointer text-sm">
            {t('auth.remember_me')}
          </Label>
        </div>

        <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
          {isLoading ? t('common.loading') : t('auth.sign_in')}
        </Button>
      </form>
    </div>
  )
}
