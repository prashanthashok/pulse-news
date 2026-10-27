import { useCallback, useEffect, useState } from 'react'
import { fetchNews } from '../api/news'
import type { Article, Category, Edition } from '../types'

const TTL_MS = 10 * 60 * 1000

interface CacheEntry {
  items: Article[]
  at: number
}

// Module-level so cached views survive switching tabs (the Feed view unmounts).
const cache = new Map<string, CacheEntry>()

interface Result {
  key: string
  items?: Article[]
  error?: string
}

/**
 * Loads one edition+category feed with an in-memory cache. Cached data shows
 * immediately and is silently re-fetched once older than TTL_MS. `refresh()`
 * drops the cache for this view and goes back to the loading state.
 */
export function useNews(edition: Edition, category: Category) {
  const cacheKey = `${edition}:${category}`
  const [token, setToken] = useState(0)
  const [result, setResult] = useState<Result | null>(null)

  const resultKey = `${cacheKey}#${token}`
  const cached = cache.get(cacheKey)
  const own = result?.key === resultKey ? result : null

  const items = cached?.items ?? own?.items
  const error = cached ? undefined : own?.error
  const loading = !items && !error

  useEffect(() => {
    const entry = cache.get(cacheKey)
    if (entry && Date.now() - entry.at < TTL_MS) return

    const ac = new AbortController()
    fetchNews({ edition, category }, ac.signal)
      .then((items) => {
        cache.set(cacheKey, { items, at: Date.now() })
        setResult({ key: resultKey, items })
      })
      .catch((e: Error) => {
        // A failed background refresh keeps showing the stale data.
        if (e.name !== 'AbortError') setResult({ key: resultKey, error: e.message })
      })
    return () => ac.abort()
  }, [edition, category, cacheKey, resultKey])

  const refresh = useCallback(() => {
    cache.delete(cacheKey)
    setToken((t) => t + 1)
  }, [cacheKey])

  return { items: items ?? [], loading, error, refresh }
}
