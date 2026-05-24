import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { Toaster } from '@/components/ui/toaster'
import { motion } from 'framer-motion'

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'admin.dashboard',
  '/admin/products': 'admin.products',
  '/admin/categories': 'admin.categories',
  '/admin/orders': 'admin.orders',
  '/admin/customers': 'admin.customers',
  '/admin/coupons': 'admin.coupons',
  '/admin/reviews': 'admin.reviews',
  '/admin/reports': 'admin.reports'
}

export function AdminLayout() {
  const { t } = useTranslation()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const pageTitle = PAGE_TITLES[location.pathname]
  const title = pageTitle ? t(pageTitle) : t('nav.admin')

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <motion.div
        animate={{ marginLeft: sidebarOpen ? 240 : 68 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col min-h-screen"
      >
        <AdminHeader
          title={title}
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </motion.div>
      <Toaster />
    </div>
  )
}
