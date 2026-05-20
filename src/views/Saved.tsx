import { useState } from 'react'
import { IconBookmark } from '@tabler/icons-react'
import type { Article } from '../types'
import { ArticleCard } from '../components/ArticleCard'
import { ArticleDetail } from '../components/ArticleDetail'

interface Props {
  saved: Article[]
  isSaved: (id: string) => boolean
  onSave: (article: Article) => void
}

export function Saved({ saved, isSaved, onSave }: Props) {
  const [selected, setSelected] = useState<Article | null>(null)

  if (selected) {
    return (
      <ArticleDetail
        article={selected}
        saved={isSaved(selected.id)}
        onSave={() => { onSave(selected); setSelected(null) }}
        onBack={() => setSelected(null)}
      />
    )
  }

  return (
    <div className="flex flex-col min-h-screen" style={{ paddingBottom: '72px' }}>
      <div
        className="sticky top-0 z-40 px-4 py-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <h2
          className="text-xl font-black"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          Saved
        </h2>
      </div>

      {saved.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 px-8 text-center">
          <IconBookmark size={52} style={{ color: 'var(--muted)', opacity: 0.3 }} />
          <p className="mt-4 font-semibold" style={{ color: 'var(--text)' }}>Nothing saved yet</p>
          <p className="mt-1 text-sm" style={{ color: 'var(--muted)' }}>
            Tap the bookmark icon on any article to save it here
          </p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="px-4 py-2 text-xs" style={{ color: 'var(--muted)' }}>
            {saved.length} saved {saved.length === 1 ? 'article' : 'articles'}
          </p>
          {saved.map((a, i) => (
            <ArticleCard
              key={a.id}
              article={a}
              saved={isSaved(a.id)}
              onSave={() => onSave(a)}
              onClick={() => setSelected(a)}
              showBorder={i < saved.length - 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
