import { useMemo, useState } from 'react'
import type { Article, Category, Edition, Preferences } from '../types'
import { useNews } from '../hooks/useNews'
import { applyPrefs } from '../lib/filter'
import { Header } from '../components/Header'
import { EditionBar } from '../components/EditionBar'
import { CategoryTabs } from '../components/CategoryTabs'
import { FeaturedCard } from '../components/FeaturedCard'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetail } from '../components/ArticleDetail'
import { FeedSkeleton } from '../components/Skeletons'

interface Props {
  prefs: Preferences
  isSaved: (id: string) => boolean
  onSave: (article: Article) => void
  onSearchClick: () => void
}

export function Feed({ prefs, isSaved, onSave, onSearchClick }: Props) {
  const [edition, setEdition] = useState<Edition>('Global')
  const [category, setCategory] = useState<Category>('Top')
  const [selected, setSelected] = useState<Article | null>(null)

  const { items, loading, error, refresh } = useNews(edition, category)

  const { featured, rest } = useMemo(() => {
    const visible = applyPrefs(items, prefs)
    // Lead with the newest story that has a picture; fall back to the newest overall.
    const lead = visible.find((a) => a.image) ?? visible[0]
    return { featured: lead, rest: visible.filter((a) => a !== lead) }
  }, [items, prefs])

  return (
    <div className="flex min-h-screen flex-col" style={{ paddingBottom: '72px' }}>
      <Header loading={loading} onSearchClick={onSearchClick} onRefresh={refresh} />
      <EditionBar edition={edition} onChange={setEdition} />
      <CategoryTabs category={category} onChange={setCategory} />

      {error && (
        <div
          className="mx-4 mt-4 rounded-xl p-4 text-sm"
          style={{ background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--border)' }}
        >
          {error}
          <button onClick={refresh} className="mt-2 block font-semibold underline" style={{ color: 'var(--accent)' }}>
            Try again
          </button>
        </div>
      )}

      {loading && <FeedSkeleton />}

      {!loading && !error && !featured && (
        <p className="mt-16 px-8 text-center text-sm" style={{ color: 'var(--muted)' }}>
          {items.length > 0
            ? 'Everything here is hidden by your source and word filters.'
            : 'No stories right now. Try refreshing in a minute.'}
        </p>
      )}

      {featured && (
        <>
          <FeaturedCard article={featured} onClick={() => setSelected(featured)} />
          <div className="mt-4">
            {rest.map((a, i) => (
              <ArticleCard
                key={a.id}
                article={a}
                saved={isSaved(a.id)}
                onSave={() => onSave(a)}
                onClick={() => setSelected(a)}
                showBorder={i < rest.length - 1}
              />
            ))}
          </div>
        </>
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
