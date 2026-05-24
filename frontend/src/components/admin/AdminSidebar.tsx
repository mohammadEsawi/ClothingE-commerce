import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard,
  Package,
  FolderOpen,
  ShoppingBag,
  Users,
  Tag,
  Star,
  BarChart2,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Store
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useAuthStore } from '@/store/authStore'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/admin/products', icon: Package, key: 'products' },
  { to: '/admin/categories', icon: FolderOpen, key: 'categories' },
  { to: '/admin/orders', icon: ShoppingBag, key: 'orders' },
  { to: '/admin/customers', icon: Users, key: 'customers' },
  { to: '/admin/coupons', icon: Tag, key: 'coupons' },
  { to: '/admin/reviews', icon: Star, key: 'reviews' },
  { to: '/admin/reports', icon: BarChart2, key: 'reports' }
]

interface AdminSidebarProps {
  isOpen: boolean
  onToggle: () => void
}

export function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <motion.aside
      animate={{ width: isOpen ? 240 : 68 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed start-0 top-0 h-full bg-gray-900 text-white z-40 flex flex-col overflow-hidden"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-gray-700">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex items-center gap-2"
            >
              <Store className="h-5 w-5 text-primary-400" />
              <span className="font-bold text-sm whitespace-nowrap">ClothingStore Admin</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={onToggle}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-700 transition-colors"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ to, icon: Icon, key }) => {
          const isActive =
            to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to)

          return (
            <Link
              key={to}
              to={to}
              title={!isOpen ? t(`admin.${key}`) : undefined}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              )}
            >
              <Icon className="h-5 w-5 shrink-0" />
              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="whitespace-nowrap"
                  >
                    {t(`admin.${key}`)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )
        })}
      </nav>

      <Separator className="bg-gray-700" />

      {/* User + Logout */}
      <div className="p-3 space-y-2">
        {user && (
          <div className={cn('flex items-center gap-3 px-2 py-2 rounded-lg', isOpen && 'bg-gray-800')}>
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="bg-primary-600 text-white text-xs">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="min-w-0"
                >
                  <p className="text-xs font-medium truncate">{user.name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
        <button
          onClick={handleLogout}
          title={!isOpen ? t('nav.logout') : undefined}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <AnimatePresence>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {t('nav.logout')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>
    </motion.aside>
  )
}
