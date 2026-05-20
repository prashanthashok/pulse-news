import type { Article, Edition, Category, FeedResponse, Preferences } from '../types'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''
const ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

async function callGemini(prompt: string, maxTokens = 1500): Promise<string> {
  const res = await fetch(`${ENDPOINT}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: maxTokens },
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gemini API error ${res.status}: ${err}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

function buildFilterRules(prefs: Preferences): string {
  const rules: string[] = []
  if (prefs.reducePolitical) rules.push('minimize partisan political coverage unless globally significant')
  if (prefs.limitDoomLoops) rules.push('avoid repetitive crisis or doom-loop content')
  if (prefs.constructiveNews) rules.push('include at least one positive or solutions-focused story per batch')
  if (prefs.balancedSourcing) rules.push('use balanced, non-partisan global sources')
  return rules.length > 0 ? `\nContent rules:\n- ${rules.join('\n- ')}` : ''
}

function editionSources(edition: Edition): string {
  if (edition === 'US') return 'NPR, AP News, The Atlantic, Axios, ProPublica'
  if (edition === 'India') return 'The Hindu, NDTV, The Wire, Hindustan Times, Scroll.in'
  return 'Reuters, BBC, Al Jazeera, The Guardian, DW, AP News'
}

function extractJson(text: string): string {
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (jsonMatch) return jsonMatch[1].trim()
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start !== -1 && end !== -1) return text.slice(start, end + 1)
  return text.trim()
}

let idCounter = 0
function makeId(): string {
  return `article-${Date.now()}-${++idCounter}`
}

export async function fetchFeed(
  edition: Edition,
  category: Category,
  prefs: Preferences
): Promise<FeedResponse> {
  const sources = editionSources(edition)
  const filters = buildFilterRules(prefs)

  const prompt = `You are Pulse, a curated global news assistant. Generate a realistic, plausible news briefing for the ${edition} edition, ${category} category. Use credible sources like ${sources}.${filters}

Return ONLY valid JSON (no markdown, no extra text) in this exact shape:
{
  "featured": {
    "title": "compelling headline here",
    "summary": "2-3 sentence summary",
    "source": "source name",
    "region": "flag emoji",
    "category": "${category}",
    "url": "https://example.com/article",
    "minutesAgo": 15
  },
  "articles": [
    {
      "title": "headline",
      "summary": "2-3 sentence summary",
      "source": "source name",
      "region": "flag emoji",
      "category": "${category}",
      "url": "https://example.com/article",
      "minutesAgo": 30
    }
  ]
}

Generate exactly 6 articles (not the featured). Make titles specific, newsworthy, and timely. Vary minutesAgo between 5 and 120. Use realistic source names and plausible URLs.`

  const raw = await callGemini(prompt, 2000)
  const json = extractJson(raw)
  const parsed = JSON.parse(json) as FeedResponse

  return {
    featured: { ...parsed.featured, id: makeId() } as Article,
    articles: parsed.articles.map((a) => ({ ...a, id: makeId() })) as Article[],
  } as unknown as FeedResponse
}

export async function fetchArticleBody(article: Article): Promise<string> {
  const prompt = `You are Pulse, a neutral news writer. Write a ~350 word article body based on:
Title: ${article.title}
Summary: ${article.summary}
Source: ${article.source}

Return ONLY valid JSON (no markdown):
{"body": "paragraph1\\n\\nparagraph2\\n\\nparagraph3\\n\\nparagraph4"}`

  const raw = await callGemini(prompt, 800)
  const json = extractJson(raw)
  const parsed = JSON.parse(json) as { body: string }
  return parsed.body
}

export async function searchNews(query: string): Promise<Article[]> {
  const prompt = `You are Pulse, a curated global news assistant. Generate 5 realistic, plausible news articles about: "${query}". Use credible non-partisan global sources.

Return ONLY valid JSON (no markdown, no extra text):
{
  "articles": [
    {
      "title": "headline",
      "summary": "2-3 sentence summary",
      "source": "source name",
      "region": "flag emoji",
      "category": "relevant category",
      "url": "https://example.com/article",
      "minutesAgo": 45
    }
  ]
}`

  const raw = await callGemini(prompt, 1200)
  const json = extractJson(raw)
  const parsed = JSON.parse(json) as { articles: Omit<Article, 'id'>[] }
  return parsed.articles.map((a) => ({ ...a, id: makeId() })) as Article[]
}
