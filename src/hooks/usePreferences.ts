import { useState, useCallback } from 'react'
import type { Preferences } from '../types'

const STORAGE_KEY = 'pulse_preferences'

const defaultPrefs: Preferences = {
  reducePolitical: true,
  limitDoomLoops: true,
  constructiveNews: true,
  balancedSourcing: true,
  focusIndia: true,
  focusUS: true,
  focusScience: true,
  focusAITech: true,
}

function loadPrefs(): Preferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? { ...defaultPrefs, ...(JSON.parse(raw) as Partial<Preferences>) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

export function usePreferences() {
  const [prefs, setPrefs] = useState<Preferences>(loadPrefs)

  const toggle = useCallback((key: keyof Preferences) => {
    setPrefs((prev) => {
      const next = { ...prev, [key]: !prev[key] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // ignore
      }
      return next
    })
  }, [])

  return { prefs, toggle }
}
