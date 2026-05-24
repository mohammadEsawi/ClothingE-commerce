import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  Search,
  ChevronDown,
  LogOut,
  Package,
  Settings
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { SearchBar } from './SearchBar'
import { LanguageToggle } from './LanguageToggle'
import { useAuthStore } from '@/store/authStore'
import { useCartStore } from '@/store/cartStore'
import { useWishlistStore } from '@/store/wishlistStore'
import { useCategories } from '@/hooks/useCategories'
import { cn } from '@/lib/utils'

export function Navbar() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { items, toggleCart } = useCartStore()
  const { productIds } = useWishlistStore()
  const { data: categories } = useCategories()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white'
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile: hamburger */}
          <button
            className="flex md:hidden items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl text-primary-600"
          >
            <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <span className="hidden sm:block">ClothingStore</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('nav.home')}
            </Link>
            <Link
              to="/shop"
              className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              {t('nav.shop')}
            </Link>
            {categories && categories.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors">
                    {t('nav.categories')}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {categories.map((cat) => (
                    <DropdownMenuItem
                      key={cat.id}
                      onClick={() => navigate(`/shop?category=${cat.slug}`)}
                    >
                      {cat.name_en}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xs mx-6">
            <SearchBar className="w-full" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Mobile Search */}
            <button
              className="flex md:hidden items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
            </button>

            <LanguageToggle className="hidden sm:flex" />

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <Heart className="h-5 w-5" />
              {productIds.length > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold"
                >
                  {productIds.length}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative flex items-center justify-center w-10 h-10 rounded-md hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary-600 text-white text-xs font-bold"
                  >
                    {itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Auth */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-md hover:bg-gray-100 p-1">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-primary-100 text-primary-700 text-xs">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/account')}>
                    <User className="me-2 h-4 w-4" />
                    {t('account.title')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/orders')}>
                    <Package className="me-2 h-4 w-4" />
                    {t('orders.my_orders')}
                  </DropdownMenuItem>
                  {user.role === 'admin' && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Settings className="me-2 h-4 w-4" />
                        {t('nav.admin')}
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="me-2 h-4 w-4" />
                    {t('nav.logout')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  {t('nav.login')}
                </Button>
                <Button size="sm" onClick={() => navigate('/register')}>
                  {t('nav.register')}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden pb-3"
            >
              <SearchBar onClose={() => setIsSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden border-t bg-white"
          >
            <nav className="flex flex-col p-4 gap-3">
              <Link
                to="/"
                className="py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/shop"
                className="py-2 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.shop')}
              </Link>
              {categories?.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.slug}`}
                  className="py-2 text-sm text-gray-600 ps-4"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {cat.name_en}
                </Link>
              ))}
              <div className="pt-2 border-t flex items-center gap-2">
                <LanguageToggle />
                {!isAuthenticated && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => { navigate('/login'); setIsMobileMenuOpen(false) }}
                    >
                      {t('nav.login')}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => { navigate('/register'); setIsMobileMenuOpen(false) }}
                    >
                      {t('nav.register')}
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
