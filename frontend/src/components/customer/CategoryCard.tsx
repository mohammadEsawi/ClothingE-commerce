import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { getImageUrl } from '@/lib/utils'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { i18n } = useTranslation()
  const navigate = useNavigate()
  const lang = i18n.language
  const name = lang === 'ar' ? category.name_ar : category.name_en

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => navigate(`/shop?category=${category.slug}`)}
      className="relative cursor-pointer overflow-hidden rounded-xl aspect-square bg-gray-100 group"
    >
      {category.image ? (
        <img
          src={getImageUrl(category.image)}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="h-full w-full bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary-600 opacity-30">
            {name.charAt(0)}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <h3 className="text-sm font-semibold text-white">{name}</h3>
        {category.products_count !== undefined && (
          <p className="text-xs text-white/70">{category.products_count} items</p>
        )}
      </div>
    </motion.div>
  )
}
