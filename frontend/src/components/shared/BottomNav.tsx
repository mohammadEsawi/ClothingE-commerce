import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Home, Grid, Heart, ShoppingCart, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const { t } = useTranslation()
  const location = useLocation()
  const { items, toggleCart } = useCartStore()
  const { productIds } = useWishlistStore()

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const navItems = [
    { to: '/', icon: Home, label: t('nav.home') },
    { to: '/shop', icon: Grid, label: t('nav.shop') },
    { to: '/wishlist', icon: Heart, label: t('nav.wishlist'), badge: productIds.length },
    { to: '/account', icon: User, label: t('nav.account') }
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around bg-white border-t border-gray-200 h-16"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {navItems.map(({ to, icon: Icon, label, badge }) => {
        const isActive = location.pathname === to

        return (
          <Link
            key={to}
            to={to}
            className={cn(
              'relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors',
              isActive ? 'text-primary-600' : 'text-gray-500'
            )}
          >
            <div className="relative">
              <Icon className="h-5 w-5" />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold">
                  {badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-medium">{label}</span>
            {isActive && (
              <motion.div
                layoutId="bottomNavIndicator"
                className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary-600 rounded-full"
              />
            )}
          </Link>
        )
      })}

      {/* Cart button */}
      <button
        onClick={toggleCart}
        className="relative flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors text-gray-500"
      >
        <div className="relative">
          <ShoppingCart className="h-5 w-5" />
          <AnimatePresence>
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-600 text-white text-[10px] font-bold"
              >
                {itemCount}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <span className="text-[10px] font-medium">{t('nav.cart')}</span>
      </button>
    </nav>
  )
}
