import type { Article, Preferences } from '../types'

export function applyPrefs(articles: Article[], prefs: Preferences): Article[] {
  if (prefs.disabledSources.length === 0 && prefs.mutedWords.length === 0) return articles
  const muted = prefs.mutedWords.map((w) => w.toLowerCase())
  return articles.filter((a) => {
    if (prefs.disabledSources.includes(a.source)) return false
    if (muted.length === 0) return true
    const haystack = `${a.title} ${a.summary}`.toLowerCase()
    return !muted.some((w) => haystack.includes(w))
  })
}
