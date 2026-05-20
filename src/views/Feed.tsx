import { useState, useEffect, useCallback, useRef } from 'react'
import type { Article, Edition, Category, Preferences } from '../types'
import { fetchFeed } from '../api/gemini'
import { Header } from '../components/Header'
import { EditionBar } from '../components/EditionBar'
import { CategoryTabs } from '../components/CategoryTabs'
import { FeaturedCard } from '../components/FeaturedCard'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetail } from '../components/ArticleDetail'

interface CacheEntry {
  featured: Article
  articles: Article[]
}

interface Props {
  prefs: Preferences
  isSaved: (id: string) => boolean
  onSave: (article: Article) => void
  onSearchClick: () => void
}

export function Feed({ prefs, isSaved, onSave, onSearchClick }: Props) {
  const [edition, setEdition] = useState<Edition>('Global')
  const [category, setCategory] = useState<Category>('Top')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [featured, setFeatured] = useState<Article | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [selected, setSelected] = useState<Article | null>(null)

  const cache = useRef<Map<string, CacheEntry>>(new Map())

  const cacheKey = `${edition}:${category}`

  const load = useCallback(
    async (bust = false) => {
      if (!bust) {
        const cached = cache.current.get(cacheKey)
        if (cached) {
          setFeatured(cached.featured)
          setArticles(cached.articles)
          return
        }
      } else {
        cache.current.delete(cacheKey)
      }

      setLoading(true)
      setError('')
      try {
        const data = await fetchFeed(edition, category, prefs)
        const f = data.featured as Article
        const a = data.articles as Article[]
        cache.current.set(cacheKey, { featured: f, articles: a })
        setFeatured(f)
        setArticles(a)
      } catch (e) {
        setError((e as Error).message)
      } finally {
        setLoading(false)
      }
    },
    [edition, category, prefs, cacheKey]
  )

  useEffect(() => {
    load()
  }, [load])

  const handleRefresh = () => load(true)

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
      <Header loading={loading} onSearchClick={onSearchClick} onRefresh={handleRefresh} />
      <EditionBar edition={edition} onChange={(e) => setEdition(e)} />
      <CategoryTabs category={category} onChange={(c) => setCategory(c)} />

      {error && (
        <div
          className="mx-4 mt-4 rounded-xl p-4 text-sm"
          style={{ background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--border)' }}
        >
          <strong>Error: </strong>{error}
          <br />
          <button onClick={handleRefresh} className="mt-2 underline" style={{ color: 'var(--accent)' }}>
            Retry
          </button>
        </div>
      )}

      {loading && !featured && (
        <div className="px-4 mt-4 space-y-4">
          <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="space-y-3">
              {[80, 100, 60, 40].map((w, i) => (
                <div key={i} className="animate-pulse rounded" style={{ height: '0.9rem', background: 'var(--surface2)', width: `${w}%` }} />
              ))}
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 py-4" style={{ borderBottom: '1px solid var(--border)' }}>
              {[60, 90, 70].map((w, j) => (
                <div key={j} className="animate-pulse rounded" style={{ height: '0.75rem', background: 'var(--surface2)', width: `${w}%` }} />
              ))}
            </div>
          ))}
        </div>
      )}

      {!loading && featured && (
        <>
          <FeaturedCard article={featured} onClick={() => setSelected(featured)} />
          <div className="mt-4">
            {articles.map((a, i) => (
              <ArticleCard
                key={a.id}
                article={a}
                saved={isSaved(a.id)}
                onSave={() => onSave(a)}
                onClick={() => setSelected(a)}
                showBorder={i < articles.length - 1}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
