import { useRef } from 'react'
import type { Category } from '../types'

const CATEGORIES: Category[] = [
  'Top', 'World', 'Science', 'Technology', 'AI', 'Gaming',
  'Space', 'Health', 'Climate', 'Business', 'Culture', 'Sports',
]

interface Props {
  category: Category
  onChange: (c: Category) => void
}

export function CategoryTabs({ category, onChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={scrollRef}
      className="flex gap-1 overflow-x-auto px-4 py-2 scrollbar-none"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      {CATEGORIES.map((c) => {
        const active = category === c
        return (
          <button
            key={c}
            onClick={() => onChange(c)}
            className="shrink-0 rounded-full px-3 py-1 text-sm font-medium transition-all active:scale-95"
            style={
              active
                ? {
                    color: 'var(--text)',
                    background: 'var(--surface2)',
                    border: '1px solid rgba(240,238,232,0.2)',
                  }
                : {
                    color: 'var(--muted)',
                    background: 'transparent',
                    border: '1px solid transparent',
                  }
            }
          >
            {c}
          </button>
        )
      })}
    </div>
  )
}
