import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react'
import { LanguageToggle } from './LanguageToggle'

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">
                C
              </div>
              <span className="font-bold text-white text-lg">ClothingStore</span>
            </Link>
            <p className="text-sm text-gray-400 mb-4">{t('footer.tagline')}</p>
            <div className="flex gap-3">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('footer.shop')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/shop" className="hover:text-white transition-colors">{t('nav.shop')}</Link></li>
              <li><Link to="/shop?featured=1" className="hover:text-white transition-colors">{t('common.featured')}</Link></li>
              <li><Link to="/shop?on_sale=1" className="hover:text-white transition-colors">{t('common.sale')}</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-white transition-colors">{t('common.new')}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              {t('footer.company')}
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.contact')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.faq')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.returns')}</a></li>
            </ul>
          </div>

          {/* Legal + Language */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
              Legal
            </h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.terms')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer.privacy')}</a></li>
            </ul>
            <div className="mt-4">
              <p className="text-xs text-gray-500 mb-2">{t('footer.language')}</p>
              <LanguageToggle variant="text" className="text-gray-300 hover:text-white" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">{t('footer.copyright')}</p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{t('footer.payment_methods')}:</span>
            <div className="flex gap-2">
              {['Visa', 'MC', 'PayPal'].map((pm) => (
                <div
                  key={pm}
                  className="h-6 px-2 rounded bg-gray-700 flex items-center text-xs text-gray-300"
                >
                  {pm}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
