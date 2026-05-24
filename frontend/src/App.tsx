import { Routes, Route, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'

// Layouts
import { CustomerLayout } from '@/components/layouts/CustomerLayout'
import { AdminLayout } from '@/components/layouts/AdminLayout'
import { AuthLayout } from '@/components/layouts/AuthLayout'

// Auth
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

// Customer Pages
import HomePage from '@/pages/customer/HomePage'
import ShopPage from '@/pages/customer/ShopPage'
import ProductDetailPage from '@/pages/customer/ProductDetailPage'
import CartPage from '@/pages/customer/CartPage'
import CheckoutPage from '@/pages/customer/CheckoutPage'
import OrdersPage from '@/pages/customer/OrdersPage'
import OrderDetailPage from '@/pages/customer/OrderDetailPage'
import AccountPage from '@/pages/customer/AccountPage'
import WishlistPage from '@/pages/customer/WishlistPage'

// Auth Pages
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'

// Admin Pages
import DashboardPage from '@/pages/admin/DashboardPage'
import ProductsPage from '@/pages/admin/ProductsPage'
import ProductFormPage from '@/pages/admin/ProductFormPage'
import CategoriesPage from '@/pages/admin/CategoriesPage'
import AdminOrdersPage from '@/pages/admin/OrdersPage'
import AdminOrderDetailPage from '@/pages/admin/OrderDetailPage'
import CustomersPage from '@/pages/admin/CustomersPage'
import CouponsPage from '@/pages/admin/CouponsPage'
import ReviewsPage from '@/pages/admin/ReviewsPage'
import ReportsPage from '@/pages/admin/ReportsPage'

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 }
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  )
}

export default function App() {
  const { i18n } = useTranslation()

  return (
    <AnimatePresence mode="wait">
      <Routes>
        {/* Auth Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<PageWrapper><LoginPage /></PageWrapper>} />
          <Route path="/register" element={<PageWrapper><RegisterPage /></PageWrapper>} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<PageWrapper><DashboardPage /></PageWrapper>} />
          <Route path="products" element={<PageWrapper><ProductsPage /></PageWrapper>} />
          <Route path="products/:id" element={<PageWrapper><ProductFormPage /></PageWrapper>} />
          <Route path="products/new" element={<PageWrapper><ProductFormPage /></PageWrapper>} />
          <Route path="categories" element={<PageWrapper><CategoriesPage /></PageWrapper>} />
          <Route path="orders" element={<PageWrapper><AdminOrdersPage /></PageWrapper>} />
          <Route path="orders/:id" element={<PageWrapper><AdminOrderDetailPage /></PageWrapper>} />
          <Route path="customers" element={<PageWrapper><CustomersPage /></PageWrapper>} />
          <Route path="coupons" element={<PageWrapper><CouponsPage /></PageWrapper>} />
          <Route path="reviews" element={<PageWrapper><ReviewsPage /></PageWrapper>} />
          <Route path="reports" element={<PageWrapper><ReportsPage /></PageWrapper>} />
        </Route>

        {/* Customer Routes */}
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<PageWrapper><HomePage /></PageWrapper>} />
          <Route path="/shop" element={<PageWrapper><ShopPage /></PageWrapper>} />
          <Route path="/shop/:category" element={<PageWrapper><ShopPage /></PageWrapper>} />
          <Route path="/products/:slug" element={<PageWrapper><ProductDetailPage /></PageWrapper>} />
          <Route path="/wishlist" element={<PageWrapper><WishlistPage /></PageWrapper>} />

          {/* Protected Customer Routes */}
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <PageWrapper><CartPage /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <PageWrapper><CheckoutPage /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <PageWrapper><OrdersPage /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <PageWrapper><OrderDetailPage /></PageWrapper>
              </ProtectedRoute>
            }
          />
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <PageWrapper><AccountPage /></PageWrapper>
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}
