import { useState } from 'react'
import type { View } from './types'
import { useSaved } from './hooks/useSaved'
import { usePreferences } from './hooks/usePreferences'
import { BottomNav } from './components/BottomNav'
import { Feed } from './views/Feed'
import { Explore } from './views/Explore'
import { Saved } from './views/Saved'
import { Preferences } from './views/Preferences'

export default function App() {
  const [view, setView] = useState<View>('feed')
  const { saved, toggleSave, isSaved } = useSaved()
  const { prefs, toggle } = usePreferences()

  return (
    <div className="relative max-w-lg mx-auto" style={{ minHeight: '100svh', background: 'var(--bg)' }}>
      {view === 'feed' && (
        <Feed
          prefs={prefs}
          isSaved={isSaved}
          onSave={toggleSave}
          onSearchClick={() => setView('explore')}
        />
      )}
      {view === 'explore' && (
        <Explore isSaved={isSaved} onSave={toggleSave} />
      )}
      {view === 'saved' && (
        <Saved saved={saved} isSaved={isSaved} onSave={toggleSave} />
      )}
      {view === 'prefs' && (
        <Preferences prefs={prefs} onToggle={toggle} />
      )}
      <BottomNav view={view} onChange={setView} />
    </div>
  )
}
