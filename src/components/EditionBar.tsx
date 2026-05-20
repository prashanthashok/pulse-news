import type { Edition } from '../types'

const EDITIONS: { id: Edition; label: string }[] = [
  { id: 'Global', label: '🌍 Global' },
  { id: 'US', label: '🇺🇸 US' },
  { id: 'India', label: '🇮🇳 India' },
]

interface Props {
  edition: Edition
  onChange: (e: Edition) => void
}

export function EditionBar({ edition, onChange }: Props) {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2"
      style={{ borderBottom: '1px solid var(--border)' }}
    >
      <div className="flex flex-1 items-center gap-2">
        {EDITIONS.map((e) => {
          const active = edition === e.id
          return (
            <button
              key={e.id}
              onClick={() => onChange(e.id)}
              className="rounded-full px-3 py-1 text-sm font-medium transition-all active:scale-95"
              style={
                active
                  ? { background: 'var(--accent)', color: '#0a0a0f' }
                  : { background: 'var(--surface2)', color: 'var(--muted)' }
              }
            >
              {e.label}
            </button>
          )
        })}
      </div>
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2 w-2">
          <span
            className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
            style={{ background: 'var(--red)' }}
          />
          <span
            className="relative inline-flex h-2 w-2 rounded-full"
            style={{ background: 'var(--red)' }}
          />
        </span>
        <span className="text-xs font-medium" style={{ color: 'var(--muted)' }}>
          Live
        </span>
      </div>
    </div>
  )
}
