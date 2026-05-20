import { IconSearch, IconRefresh } from '@tabler/icons-react'
import { ProgressBar } from './ProgressBar'

interface Props {
  loading: boolean
  onSearchClick: () => void
  onRefresh: () => void
}

export function Header({ loading, onSearchClick, onRefresh }: Props) {
  return (
    <div className="sticky top-0 z-40" style={{ background: 'var(--bg)' }}>
      <div className="flex items-center justify-between px-4 py-3">
        <h1
          className="text-2xl font-black tracking-tight"
          style={{ fontFamily: "'Playfair Display', serif", color: 'var(--text)' }}
        >
          Pulse<span style={{ color: 'var(--accent)' }}>.</span>
        </h1>
        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors active:scale-95"
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            aria-label="Search"
          >
            <IconSearch size={18} />
          </button>
          <button
            onClick={onRefresh}
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors active:scale-95 ${loading ? 'animate-spin-slow' : ''}`}
            style={{ background: 'var(--surface2)', color: 'var(--muted)' }}
            aria-label="Refresh"
          >
            <IconRefresh size={18} />
          </button>
        </div>
      </div>
      <ProgressBar loading={loading} />
    </div>
  )
}
