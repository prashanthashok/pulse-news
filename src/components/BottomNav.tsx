import { IconRss, IconCompass, IconBookmark, IconSettings } from '@tabler/icons-react'
import type { View } from '../types'

const TABS: { id: View; label: string; Icon: React.ComponentType<{ size?: number }> }[] = [
  { id: 'feed', label: 'Feed', Icon: IconRss },
  { id: 'explore', label: 'Explore', Icon: IconCompass },
  { id: 'saved', label: 'Saved', Icon: IconBookmark },
  { id: 'prefs', label: 'Prefs', Icon: IconSettings },
]

interface Props {
  view: View
  onChange: (v: View) => void
}

export function BottomNav({ view, onChange }: Props) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 max-w-lg mx-auto"
      style={{
        background: 'rgba(10,10,15,0.92)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-center justify-around px-2 py-2">
        {TABS.map(({ id, label, Icon }) => {
          const active = view === id
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className="flex flex-1 flex-col items-center gap-1 py-1 transition-colors active:scale-95"
              style={{ color: active ? 'var(--accent)' : 'var(--muted)' }}
            >
              <Icon size={20} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
