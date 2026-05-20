import { useState, useEffect, useRef } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import type { Article } from '../types'
import { searchNews } from '../api/gemini'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetail } from '../components/ArticleDetail'
import { ProgressBar } from '../components/ProgressBar'

interface Props {
  isSaved: (id: string) => boolean
  onSave: (article: Article) => void
  initialQuery?: string
}

export function Explore({ isSaved, onSave, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<Article | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!query.trim()) { setResults([]); return }

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      setError('')
      try {
        const data = await searchNews(query.trim())
        setResults(data)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    }, 700)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [query])

  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        saved={isSaved(selected.id)}
        onSave={() => onSave(selected)}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: '72px' }}>
      {/* Search header */}
      <div
        className="sticky top-0 z-40 px-4 pt-4 pb-2"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <IconSearch size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any topic..."
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: 'var(--text)' }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ color: 'var(--muted)' }}>
              <IconX size={16} />
            </button>
          )}
        </div>
        <ProgressBar loading={loading} />
      </div>

      {/* Results */}
      {error && (
        <div className="mx-4 mt-4 rounded-xl p-4 text-sm" style={{ background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--border)' }}>
          {error}
        </div>
      )}

      {!query.trim() && (
        <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
          <IconSearch size={48} style={{ color: 'var(--muted)', opacity: 0.4 }} />
          <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            Search for any topic — AI will find the latest relevant stories
          </p>
        </div>
      )}

      {loading && (
        <div className="px-4 mt-4 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              {[60, 90, 70].map((w, j) => (
                <div key={j} className="animate-pulse rounded" style={{ height: '0.75rem', background: 'var(--surface2)', width: `${w}%` }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="mt-2">
          <p className="px-4 py-2 text-xs" style={{ color: 'var(--muted)' }}>
            {results.length} results for "{query}"
          </p>
          {results.map((a, i) => (
            <ArticleCard
              key={a.id}
              article={a}
              saved={isSaved(a.id)}
              onSave={() => onSave(a)}
              onClick={() => setSelected(a)}
              showBorder={i < results.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
