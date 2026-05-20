import { useState, useCallback } from 'react'
import type { Article } from '../types'

const STORAGE_KEY = 'pulse_saved_articles'

function loadSaved(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Article[]) : []
  } catch {
    return []
  }
}

function persistSaved(articles: Article[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch {
    // storage full or unavailable
  }
}

export function useSaved() {
  const [saved, setSaved] = useState<Article[]>(loadSaved)

  const toggleSave = useCallback((article: Article) => {
    setSaved((prev) => {
      const exists = prev.some((a) => a.id === article.id)
      const next = exists ? prev.filter((a) => a.id !== article.id) : [article, ...prev]
      persistSaved(next)
      return next
    })
  }, [])

  const isSaved = useCallback(
    (id: string) => saved.some((a) => a.id === id),
    [saved]
  )

  return { saved, toggleSave, isSaved }
}
