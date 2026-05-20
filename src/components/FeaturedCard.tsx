import { IconArrowRight } from '@tabler/icons-react'
import type { Article } from '../types'
import { SourceBadge } from './SourceBadge'

interface Props {
  article: Article
  onClick: () => void
}

export function FeaturedCard({ article, onClick }: Props) {
  return (
    <div
      className="mx-4 mt-4 rounded-2xl p-5 cursor-pointer active:scale-[0.99] transition-transform"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      onClick={onClick}
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-[2px] w-6 rounded-full" style={{ background: 'var(--accent)' }} />
        <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: 'var(--accent)' }}>
          Featured Story
        </span>
      </div>

      <h2
        className="text-xl font-black leading-snug mb-3"
        style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
      >
        {article.title}
      </h2>

      <p className="text-sm leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--muted)' }}>
        {article.summary}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SourceBadge source={article.source} />
          <span className="text-base">{article.region}</span>
        </div>
        <button
          className="flex items-center gap-1 text-sm font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          Read more <IconArrowRight size={14} />
        </button>
      </div>
    </div>
  )
}
