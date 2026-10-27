import { useCallback, useState } from 'react'
import type { Preferences } from '../types'

const STORAGE_KEY = 'pulse_prefs_v2'

const defaults: Preferences = { disabledSources: [], mutedWords: [] }

function load(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaults
    const p = JSON.parse(raw) as Partial<Preferences>
    return {
      disabledSources: Array.isArray(p.disabledSources) ? p.disabledSources : [],
      mutedWords: Array.isArray(p.mutedWords) ? p.mutedWords : [],
    }
  } catch {
    return defaults
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(load)

  const update = useCallback((fn: (p: Preferences) => Preferences) => {
    setPrefs((prev) => {
      const next = fn(prev)
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // storage unavailable; keep the in-memory value
      }
      return next
    })
  }, [])

  const toggleSource = useCallback(
    (name: string) =>
      update((p) => ({
        ...p,
        disabledSources: p.disabledSources.includes(name)
          ? p.disabledSources.filter((s) => s !== name)
          : [...p.disabledSources, name],
      })),
    [update],
  )

  const addMutedWord = useCallback(
    (word: string) => {
      const w = word.trim().toLowerCase()
      if (!w) return
      update((p) => (p.mutedWords.includes(w) ? p : { ...p, mutedWords: [...p.mutedWords, w] }))
    },
    [update],
  )

  const removeMutedWord = useCallback(
    (word: string) => update((p) => ({ ...p, mutedWords: p.mutedWords.filter((w) => w !== word) })),
    [update],
  )

  return { prefs, toggleSource, addMutedWord, removeMutedWord }
}
