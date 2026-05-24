import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, Package, RotateCcw, Shield, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ProductGrid } from '@/components/customer/ProductGrid'
import { CategoryCard } from '@/components/customer/CategoryCard'
import { useFeaturedProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { toast } from '@/components/ui/use-toast'

function CountdownTimer({ targetDate }: { targetDate: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const diff = targetDate.getTime() - now.getTime()
      if (diff <= 0) {
        clearInterval(interval)
        return
      }
      setTimeLeft({
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000)
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [targetDate])

  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className="flex items-center gap-2">
      {[timeLeft.hours, timeLeft.minutes, timeLeft.seconds].map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex flex-col items-center bg-white/20 rounded-lg px-3 py-2 min-w-[52px]">
            <span className="text-2xl font-bold text-white">{pad(val)}</span>
            <span className="text-xs text-white/80">
              {['H', 'M', 'S'][i]}
            </span>
          </div>
          {i < 2 && <span className="text-white text-xl font-bold">:</span>}
        </div>
      ))}
    </div>
  )
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
}

export default function HomePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { data: featuredProducts, isLoading } = useFeaturedProducts()
  const { data: categories } = useCategories()
  const [email, setEmail] = useState('')

  const saleEndDate = new Date()
  saleEndDate.setHours(saleEndDate.getHours() + 5)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    toast({ title: t('home.subscribed') })
    setEmail('')
  }

  const whyUsItems = [
    { icon: Package, title: t('home.free_shipping'), desc: t('home.free_shipping_desc') },
    { icon: RotateCcw, title: t('home.easy_returns'), desc: t('home.easy_returns_desc') },
    { icon: Shield, title: t('home.quality_guarantee'), desc: t('home.quality_guarantee_desc') }
  ]

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-indigo-900 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -start-4 w-72 h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute top-0 -end-4 w-72 h-72 bg-secondary-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-300" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="max-w-2xl">
            <motion.div {...fadeInUp}>
              <span className="inline-block bg-white/10 text-white text-sm px-3 py-1 rounded-full mb-4 backdrop-blur-sm">
                ✨ {t('common.new')} Collection 2024
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                {t('home.hero_title')}
              </h1>
              <p className="text-lg text-white/80 mb-8 max-w-xl">
                {t('home.hero_subtitle')}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-primary-700 hover:bg-gray-100"
                  onClick={() => navigate('/shop')}
                >
                  <ShoppingBag className="me-2 h-5 w-5" />
                  {t('home.shop_now')}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate('/shop?featured=1')}
                >
                  {t('home.explore')}
                  <ArrowRight className="ms-2 h-4 w-4 rtl-flip" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-6"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              {t('home.featured_categories')}
            </h2>
            <Link
              to="/shop"
              className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
            >
              {t('common.view_all')}
              <ArrowRight className="h-4 w-4 rtl-flip" />
            </Link>
          </motion.div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {categories.slice(0, 6).map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <CategoryCard category={cat} />
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Flash Sale */}
      <section className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">🔥 {t('home.flash_sale')}</h2>
              <p className="text-white/80 text-sm">{t('home.flash_sale_ends')}</p>
            </div>
            <CountdownTimer targetDate={saleEndDate} />
            <Button
              className="bg-white text-red-600 hover:bg-gray-100 shrink-0"
              onClick={() => navigate('/shop?on_sale=1')}
            >
              {t('home.shop_now')}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            {t('home.featured_products')}
          </h2>
          <Link
            to="/shop?featured=1"
            className="flex items-center gap-1 text-sm text-primary-600 hover:underline"
          >
            {t('common.view_all')}
            <ArrowRight className="h-4 w-4 rtl-flip" />
          </Link>
        </motion.div>
        <ProductGrid
          products={featuredProducts}
          isLoading={isLoading}
          skeletonCount={8}
        />
      </section>

      {/* Why Us */}
      <section className="bg-gray-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-2xl font-bold text-gray-900 text-center mb-8"
          >
            {t('home.why_us')}
          </motion.h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {whyUsItems.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="flex flex-col items-center text-center p-6 bg-white rounded-2xl shadow-sm"
              >
                <div className="mb-4 rounded-full bg-primary-50 p-4">
                  <Icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-sm text-gray-600">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl bg-gradient-to-br from-primary-600 to-indigo-700 text-white p-8 text-center"
        >
          <h2 className="text-2xl font-bold mb-2">{t('home.newsletter_title')}</h2>
          <p className="text-white/80 mb-6">{t('home.newsletter_subtitle')}</p>
          <form
            onSubmit={handleSubscribe}
            className="flex gap-3 max-w-md mx-auto"
          >
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('home.newsletter_placeholder')}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
              required
            />
            <Button
              type="submit"
              className="bg-white text-primary-700 hover:bg-gray-100 shrink-0"
            >
              {t('home.subscribe')}
            </Button>
          </form>
        </motion.div>
      </section>
    </div>
  )
}
