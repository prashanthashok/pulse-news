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
  minutesAgo: number
  body?: string
}

export interface FeedResponse {
  featured: Omit<Article, 'id'>
  articles: Omit<Article, 'id'>[]
}

export interface Preferences {
  reducePolitical: boolean
  limitDoomLoops: boolean
  constructiveNews: boolean
  balancedSourcing: boolean
  focusIndia: boolean
  focusUS: boolean
  focusScience: boolean
  focusAITech: boolean
}

export type View = 'feed' | 'explore' | 'saved' | 'prefs'
