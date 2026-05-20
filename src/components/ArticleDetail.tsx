import { useEffect, useState } from 'react'
import {
  IconArrowLeft,
  IconBookmark,
  IconBookmarkFilled,
  IconExternalLink,
} from '@tabler/icons-react'
import type { Article } from '../types'
import { fetchArticleBody } from '../api/gemini'
import { SourceBadge } from './SourceBadge'

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`
  return `${Math.floor(minutes / 60)}h ago`
}

interface Props {
  article: Article
  saved: boolean
  onSave: () => void
  onBack: () => void
}

export function ArticleDetail({ article, saved, onSave, onBack }: Props) {
  const [body, setBody] = useState<string>(article.body ?? '')
  const [loading, setLoading] = useState(!article.body)
  const [error, setError] = useState('')

  useEffect(() => {
    if (article.body) { setBody(article.body); return }
    setLoading(true)
    setError('')
    fetchArticleBody(article)
      .then((b) => setBody(b))
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false))
  }, [article.id])

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-slide-in"
      style={{ background: 'var(--bg)' }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium"
          style={{ color: 'var(--muted)' }}
        >
          <IconArrowLeft size={18} /> Back
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'var(--surface2)', color: saved ? 'var(--accent)' : 'var(--muted)' }}
          >
            {saved ? <IconBookmarkFilled size={17} /> : <IconBookmark size={17} />}
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <IconExternalLink size={17} />
          </a>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 py-5 max-w-2xl mx-auto">
        {/* Meta */}
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="text-xs font-medium px-2 py-0.5 rounded" style={{ background: 'var(--surface2)', color: 'var(--muted)' }}>
            {article.category}
          </span>
          <SourceBadge source={article.source} />
          <span className="text-sm">{article.region}</span>
          <span className="text-xs ml-auto tabular-nums" style={{ color: 'var(--muted)' }}>
            {timeAgo(article.minutesAgo)}
          </span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-black leading-tight mb-4"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          {article.title}
        </h1>

        {/* AI Badge */}
        <div
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 mb-5"
          style={{ background: '#5d8aff18', border: '1px solid #5d8aff30' }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: 'var(--accent2)' }} />
            <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: 'var(--accent2)' }} />
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent2)' }}>
            AI Summary · Claude
          </span>
        </div>

        {/* Body */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse rounded" style={{ height: '1rem', background: 'var(--surface2)', width: i === 3 ? '60%' : '100%' }} />
            ))}
          </div>
        ) : error ? (
          <div className="rounded-xl p-4 text-sm" style={{ background: 'var(--surface)', color: 'var(--red)', border: '1px solid var(--border)' }}>
            {error}
          </div>
        ) : (
          <div className="space-y-4">
            {body.split('\n\n').map((para, i) => (
              <p key={i} className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
                {para}
              </p>
            ))}
          </div>
        )}

        {/* Disclaimer */}
        <div
          className="mt-8 rounded-xl p-4 text-sm leading-relaxed"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
        >
          <strong style={{ color: 'var(--text)' }}>Note: </strong>
          This article body was generated by AI (Claude) based on the original headline and summary. It is a plausible reconstruction, not a verbatim copy of the source article.{' '}
          <a href={article.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent2)' }}>
            Read the original at {article.source} →
          </a>
        </div>

        {/* CTA */}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-opacity active:opacity-70"
          style={{ background: 'var(--surface2)', color: 'var(--text)', border: '1px solid var(--border)' }}
        >
          Read at {article.source}
          <IconExternalLink size={16} />
        </a>

        <div className="h-8" />
      </div>
    </div>
  )
}
