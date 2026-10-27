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
  const { prefs, toggleSource, addMutedWord, removeMutedWord } = usePreferences()

  return (
    <div className="relative mx-auto max-w-lg" style={{ minHeight: '100svh', background: 'var(--bg)' }}>
      {view === 'feed' && (
        <Feed prefs={prefs} isSaved={isSaved} onSave={toggleSave} onSearchClick={() => setView('explore')} />
      )}
      {view === 'explore' && <Explore prefs={prefs} isSaved={isSaved} onSave={toggleSave} />}
      {view === 'saved' && <Saved saved={saved} isSaved={isSaved} onSave={toggleSave} />}
      {view === 'prefs' && (
        <Preferences
          prefs={prefs}
          onToggleSource={toggleSource}
          onAddMutedWord={addMutedWord}
          onRemoveMutedWord={removeMutedWord}
        />
      )}
      <BottomNav view={view} onChange={setView} />
    </div>
  )
}
