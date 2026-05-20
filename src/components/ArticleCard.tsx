import { IconBookmark, IconBookmarkFilled } from '@tabler/icons-react'
import type { Article } from '../types'
import { SourceBadge } from './SourceBadge'

function timeAgo(minutes: number): string {
  if (minutes < 60) return `${minutes}m ago`
  const h = Math.floor(minutes / 60)
  return `${h}h ago`
}

interface Props {
  article: Article
  saved: boolean
  onSave: () => void
  onClick: () => void
  showBorder?: boolean
}

export function ArticleCard({ article, saved, onSave, onClick, showBorder = true }: Props) {
  return (
    <div
      className="px-4 py-4 cursor-pointer active:bg-white/[0.02] transition-colors"
      style={showBorder ? { borderBottom: '1px solid var(--border)' } : undefined}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <SourceBadge source={article.source} small />
        <span className="text-sm">{article.region}</span>
        <span className="text-xs" style={{ color: 'var(--muted)' }}>{article.category}</span>
        <span className="ml-auto text-xs tabular-nums" style={{ color: 'var(--muted)' }}>
          {timeAgo(article.minutesAgo)}
        </span>
      </div>

      <h3
        className="text-base font-bold leading-snug mb-1.5"
        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
      >
        {article.title}
      </h3>

      <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--muted)' }}>
        {article.summary}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>Read →</span>
        <button
          onClick={(e) => { e.stopPropagation(); onSave() }}
          className="flex h-8 w-8 items-center justify-center rounded-full transition-colors active:scale-90"
          style={{ color: saved ? 'var(--accent)' : 'var(--muted)', background: 'var(--surface2)' }}
          aria-label={saved ? 'Remove bookmark' : 'Bookmark'}
        >
          {saved ? <IconBookmarkFilled size={15} /> : <IconBookmark size={15} />}
        </button>
      </div>
    </div>
  )
}
