import { Outlet, Link } from 'react-router-dom'
import { LanguageToggle } from '@/components/shared/LanguageToggle'
import { Toaster } from '@/components/ui/toaster'

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-indigo-100 flex flex-col">
      <div className="absolute top-4 end-4">
        <LanguageToggle />
      </div>

      {/* Logo */}
      <div className="flex justify-center pt-12 pb-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">
            C
          </div>
          <span className="font-bold text-xl text-gray-900">ClothingStore</span>
        </Link>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <Outlet />
        </div>
      </div>

      <Toaster />
    </div>
  )
}
