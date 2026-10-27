import { useEffect, useMemo, useRef, useState } from 'react'
import { IconSearch, IconX } from '@tabler/icons-react'
import type { Article, Preferences } from '../types'
import { fetchNews } from '../api/news'
import { applyPrefs } from '../lib/filter'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetail } from '../components/ArticleDetail'
import { ProgressBar } from '../components/ProgressBar'
import { FeedSkeleton } from '../components/Skeletons'

interface Props {
  prefs: Preferences
  isSaved: (id: string) => boolean
  onSave: (article: Article) => void
}

interface SearchState {
  query: string
  items?: Article[]
  error?: string
}

export function Explore({ prefs, isSaved, onSave }: Props) {
  const [input, setInput] = useState('')
  const [debounced, setDebounced] = useState('')
  const [state, setState] = useState<SearchState | null>(null)
  const [selected, setSelected] = useState<Article | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const t = setTimeout(() => setDebounced(input.trim()), 700)
    return () => clearTimeout(t)
  }, [input])

  useEffect(() => {
    if (!debounced) return
    const ac = new AbortController()
    fetchNews({ edition: 'Global', q: debounced }, ac.signal)
      .then((items) => setState({ query: debounced, items }))
      .catch((e: Error) => {
        if (e.name !== 'AbortError') setState({ query: debounced, error: e.message })
      })
    return () => ac.abort()
  }, [debounced])

  // Results belong to the query that produced them; anything else means we're still waiting.
  const current = debounced && state?.query === debounced ? state : null
  const loading = Boolean(input.trim()) && !current
  const results = useMemo(() => (current?.items ? applyPrefs(current.items, prefs) : []), [current, prefs])

  return (
    <div className="flex min-h-screen flex-col" style={{ paddingBottom: '72px' }}>
      <div
        className="sticky top-0 z-40 px-4 pt-4 pb-2"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
        }}
      >
        <div
          className="flex items-center gap-3 rounded-2xl px-4 py-3"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
        >
          <IconSearch size={18} style={{ color: 'var(--muted)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search any topic…"
            enterKeyHint="search"
            className="flex-1 bg-transparent text-base outline-none"
            style={{ color: 'var(--text)' }}
          />
          {input && (
            <button onClick={() => setInput('')} style={{ color: 'var(--muted)' }} aria-label="Clear search">
              <IconX size={16} />
            </button>
          )}
        </div>
        <div className="mt-2">
          <ProgressBar loading={loading} />
        </div>
      </div>

      {current?.error && (
        <div
          className="mx-4 mt-4 rounded-xl p-4 text-sm"
          style={{ background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--border)' }}
        >
          {current.error}
        </div>
      )}

      {!input.trim() && (
        <div className="mt-20 flex flex-col items-center justify-center px-8 text-center">
          <IconSearch size={48} style={{ color: 'var(--muted)', opacity: 0.4 }} />
          <p className="mt-4 text-sm" style={{ color: 'var(--muted)' }}>
            Search any topic and Pulse will pull the latest headlines from news sources.
          </p>
        </div>
      )}

      {loading && <FeedSkeleton featured={false} />}

      {current?.items && results.length === 0 && (
        <p className="mt-16 px-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
          No results for “{current.query}”.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-2">
          <p className="px-4 py-2 text-xs" style={{ color: 'var(--muted)' }}>
            {results.length} results for “{current?.query}”
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

      {selected && (
        <ArticleDetail
          article={selected}
          saved={isSaved(selected.id)}
          onSave={() => onSave(selected)}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  )
}
