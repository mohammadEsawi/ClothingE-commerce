import { useTranslation } from 'react-i18next'
import { StarRating } from './StarRating'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import type { Review } from '@/types'

interface ReviewCardProps {
  review: Review
}

export function ReviewCard({ review }: ReviewCardProps) {
  const { t, i18n } = useTranslation()

  return (
    <div className="flex gap-3 py-4 border-b last:border-0">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
          {review.user.name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} readonly size="sm" />
              <Badge variant="outline" className="text-xs">
                {t('review.verified_purchase')}
              </Badge>
            </div>
          </div>
          <time className="text-xs text-gray-500 whitespace-nowrap">
            {formatDate(review.created_at, i18n.language)}
          </time>
        </div>
        {review.title && (
          <p className="text-sm font-medium text-gray-800 mt-1">{review.title}</p>
        )}
        {review.body && (
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{review.body}</p>
        )}
      </div>
    </div>
  )
}
