import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Input } from '@/components/ui/input'
import { debounce } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  className?: string
  onClose?: () => void
}

export function SearchBar({ className, onClose }: SearchBarProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [suggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const debouncedSearch = debounce((_q: unknown) => {
    // In a real app, this would fetch suggestions from the API
  }, 300)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    debouncedSearch(value)
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
        <Search className="absolute start-3 h-4 w-4 text-gray-400" />
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
            className="absolute end-3 flex h-5 w-5 items-center justify-center rounded-full hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </form>

      {suggestions.length > 0 && (
        <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-white shadow-lg">
          {suggestions.map((suggestion, i) => (
            <button
              key={i}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setQuery(suggestion)
                navigate(`/shop?search=${encodeURIComponent(suggestion)}`)
                onClose?.()
              }}
            >
              <Search className="h-3 w-3 text-gray-400" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
