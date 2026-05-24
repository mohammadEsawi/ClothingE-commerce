import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StarRating } from '@/components/customer/StarRating'
import { useAdminReviews, useUpdateReview } from '@/hooks/useAdmin'
import { formatDate } from '@/lib/utils'
import { toast } from '@/components/ui/use-toast'
import type { Review } from '@/types'

export default function ReviewsPage() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [page, setPage] = useState(1)

  const { data, isLoading } = useAdminReviews(page)
  const updateReview = useUpdateReview()

  const handleApprove = async (id: number) => {
    try {
      await updateReview.mutateAsync({ id, is_approved: true })
      toast({ title: 'Review approved' })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  const handleReject = async (id: number) => {
    try {
      await updateReview.mutateAsync({ id, is_approved: false })
      toast({ title: 'Review rejected' })
    } catch {
      toast({ title: t('common.error'), variant: 'destructive' })
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">{t('admin.reviews')}</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-gray-500">Loading...</div>
        ) : !data?.data || data.data.length === 0 ? (
          <div className="p-12 text-center text-gray-500">{t('admin.no_reviews')}</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-start font-medium text-gray-600">User</th>
                <th className="px-4 py-3 text-start font-medium text-gray-600">Rating</th>
                <th className="px-4 py-3 text-start font-medium text-gray-600">Review</th>
                <th className="px-4 py-3 text-start font-medium text-gray-600">Date</th>
                <th className="px-4 py-3 text-start font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {data.data.map((review: Review) => (
                <tr key={review.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{review.user.name}</p>
                    <p className="text-xs text-gray-500">{review.user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <StarRating value={review.rating} readonly size="sm" />
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    {review.title && <p className="font-medium text-xs">{review.title}</p>}
                    <p className="text-xs text-gray-600 line-clamp-2">{review.body}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500">
                    {formatDate(review.created_at, lang)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={review.is_approved ? 'success' : 'warning'}>
                      {review.is_approved ? 'Approved' : 'Pending'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {!review.is_approved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleApprove(review.id)}
                          className="h-8 w-8 p-0 text-green-600 hover:bg-green-50"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      )}
                      {review.is_approved && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(review.id)}
                          className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {data?.meta && data.meta.last_page > 1 && (
        <div className="flex justify-center mt-4 gap-2">
          {Array.from({ length: data.meta.last_page }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`h-9 w-9 rounded-md border text-sm ${page === p ? 'bg-primary-600 text-white border-primary-600' : 'hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
