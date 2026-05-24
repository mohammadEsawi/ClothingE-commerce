import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  onClose?: () => void
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
      onClose?.()
    }
  }

  const handleClear = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  return (
    <div className={cn('relative', className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <Search className="absolute start-3 h-4 w-4 text-gray-400 pointer-events-none" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleChange}
          placeholder={t('nav.search_placeholder')}
          className="ps-10 pe-10"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute end-3 flex h-5 w-5 min-h-0 min-w-0 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </form>
    </div>
  )
}
