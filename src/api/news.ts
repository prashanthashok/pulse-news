import type { Article, Category, Edition } from '../types'

export type NewsQuery =
  | { edition: Edition; category: Category }
  | { edition: Edition; q: string }

export async function fetchNews(query: NewsQuery, signal?: AbortSignal): Promise<Article[]> {
  const params = new URLSearchParams({ edition: query.edition })
  if ('q' in query) params.set('q', query.q)
  else params.set('category', query.category)

  let res: Response
  try {
    res = await fetch(`/api/news?${params}`, { signal })
  } catch (e) {
    if ((e as Error).name === 'AbortError') throw e
    throw new Error("Can't reach the news service. Check your connection and try again.", { cause: e })
  }

  if (res.status === 502) throw new Error('None of the news sources responded. Try again in a moment.')
  if (!res.ok) throw new Error(`News service error (${res.status}).`)

  try {
    const data = (await res.json()) as { items: Article[] }
    return data.items
  } catch {
    // e.g. the dev server returned index.html because /api isn't running
    throw new Error('News service returned an unexpected response.')
  }
}
