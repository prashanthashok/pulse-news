import {
  IconArrowLeft,
  IconBookmark,
  IconBookmarkFilled,
  IconExternalLink,
} from '@tabler/icons-react'
import type { Article } from '../types'
import { timeAgo } from '../lib/time'
import { SourceBadge } from './SourceBadge'
import { Thumb } from './Thumb'

interface Props {
  article: Article
  saved: boolean
  onSave: () => void
  onBack: () => void
}

export function ArticleDetail({ article, saved, onSave, onBack }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto animate-slide-in"
      style={{ background: 'var(--bg)' }}
    >
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-4 py-3"
        style={{
          background: 'var(--bg)',
          borderBottom: '1px solid var(--border)',
          paddingTop: 'max(0.75rem, env(safe-area-inset-top))',
        }}
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
            aria-label={saved ? 'Remove bookmark' : 'Bookmark'}
          >
            {saved ? <IconBookmarkFilled size={17} /> : <IconBookmark size={17} />}
          </button>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            aria-label={`Open at ${article.source}`}
          >
            <IconExternalLink size={17} />
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-lg px-5 py-5">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span
            className="rounded px-2 py-0.5 text-xs font-medium"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
          >
            {article.category}
          </span>
          <SourceBadge source={article.source} />
          <span className="text-sm">{article.region}</span>
          <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
            {timeAgo(article.publishedAt)}
          </span>
        </div>

        <h1
          className="mb-5 text-2xl font-black leading-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          {article.title}
        </h1>

        {article.image && <Thumb src={article.image} className="mb-5 h-52 w-full rounded-xl" />}

        {article.summary && (
          <p className="text-base leading-relaxed" style={{ color: 'var(--text)' }}>
            {article.summary}
          </p>
        )}

        <div
          className="mt-8 rounded-xl p-4 text-sm leading-relaxed"
          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--muted)' }}
        >
          Pulse shows headlines and short summaries from {article.source}'s public feed. The full
          story is on their site.
        </div>

        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 rounded-2xl py-4 font-semibold transition-opacity active:opacity-70"
          style={{ background: 'var(--accent)', color: '#0a0a0f' }}
        >
          Read at {article.source}
          <IconExternalLink size={16} />
        </a>

        <div style={{ height: 'max(2rem, env(safe-area-inset-bottom))' }} />
      </div>
    </div>
  )
}
