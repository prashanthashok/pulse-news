export type Edition = 'Global' | 'US' | 'India'

export type Category =
  | 'Top'
  | 'World'
  | 'Science'
  | 'Technology'
  | 'AI'
  | 'Gaming'
  | 'Space'
  | 'Health'
  | 'Climate'
  | 'Business'
  | 'Culture'
  | 'Sports'

export interface Article {
  id: string
  title: string
  summary: string
  source: string
  region: string
  category: string
  url: string
  publishedAt?: string | null
  image?: string
}

export interface Preferences {
  /** Sources hidden from the feed. */
  disabledSources: string[]
  /** Articles whose title or summary contain any of these words are hidden. */
  mutedWords: string[]
}

export type View = 'feed' | 'explore' | 'saved' | 'prefs'
