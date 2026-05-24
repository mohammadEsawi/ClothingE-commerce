import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { BottomNav } from '@/components/shared/BottomNav'
import { Footer } from '@/components/shared/Footer'
import { CartDrawer } from '@/components/customer/CartDrawer'
import { Toaster } from '@/components/ui/toaster'

export function CustomerLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pb-16 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
      <CartDrawer />
      <Toaster />
    </div>
  )
}
