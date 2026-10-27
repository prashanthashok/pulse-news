// Vercel function: GET /api/news?edition=Global&category=Top
//                  GET /api/news?q=climate+summit
//
// Browsers can't read publisher RSS feeds directly (no CORS headers), so this
// fetches them server-side, normalises RSS 2.0 / RDF / Atom into one shape and
// returns JSON. No API keys and no AI involved.

import { XMLParser } from 'fast-xml-parser'

type Edition = 'Global' | 'US' | 'India'
const EDITIONS: Edition[] = ['Global', 'US', 'India']

const CATEGORIES = [
  'Top', 'World', 'Science', 'Technology', 'AI', 'Gaming',
  'Space', 'Health', 'Climate', 'Business', 'Culture', 'Sports',
] as const
type Category = (typeof CATEGORIES)[number]

interface Source {
  name: string
  flag: string
  editions: Edition[]
  urls: Partial<Record<Category, string>>
  /** Edition-specific replacements for a category's feed. */
  overrides?: Partial<Record<Edition, Partial<Record<Category, string>>>>
}

const ALL: Edition[] = ['Global', 'US', 'India']

const SOURCES: Source[] = [
  {
    name: 'BBC',
    flag: '🇬🇧',
    editions: ALL,
    urls: {
      Top: 'https://feeds.bbci.co.uk/news/rss.xml',
      World: 'https://feeds.bbci.co.uk/news/world/rss.xml',
      Science: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml',
      Technology: 'https://feeds.bbci.co.uk/news/technology/rss.xml',
      Health: 'https://feeds.bbci.co.uk/news/health/rss.xml',
      Business: 'https://feeds.bbci.co.uk/news/business/rss.xml',
      Culture: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml',
      Sports: 'https://feeds.bbci.co.uk/sport/rss.xml',
    },
    overrides: {
      US: { Top: 'https://feeds.bbci.co.uk/news/world/us_and_canada/rss.xml' },
      India: { Top: 'https://feeds.bbci.co.uk/news/world/asia/india/rss.xml' },
    },
  },
  {
    name: 'The Guardian',
    flag: '🇬🇧',
    editions: ALL,
    urls: {
      Top: 'https://www.theguardian.com/international/rss',
      World: 'https://www.theguardian.com/world/rss',
      Science: 'https://www.theguardian.com/science/rss',
      Technology: 'https://www.theguardian.com/technology/rss',
      AI: 'https://www.theguardian.com/technology/artificialintelligenceai/rss',
      Gaming: 'https://www.theguardian.com/games/rss',
      Space: 'https://www.theguardian.com/science/space/rss',
      Health: 'https://www.theguardian.com/society/health/rss',
      Climate: 'https://www.theguardian.com/environment/climate-crisis/rss',
      Business: 'https://www.theguardian.com/business/rss',
      Culture: 'https://www.theguardian.com/culture/rss',
      Sports: 'https://www.theguardian.com/sport/rss',
    },
    overrides: {
      US: { Top: 'https://www.theguardian.com/us-news/rss' },
      India: { Top: 'https://www.theguardian.com/world/india/rss' },
    },
  },
  {
    name: 'NPR',
    flag: '🇺🇸',
    editions: ['Global', 'US'],
    urls: {
      Top: 'https://feeds.npr.org/1001/rss.xml',
      World: 'https://feeds.npr.org/1004/rss.xml',
      Science: 'https://feeds.npr.org/1007/rss.xml',
      Technology: 'https://feeds.npr.org/1019/rss.xml',
      Health: 'https://feeds.npr.org/1128/rss.xml',
      Business: 'https://feeds.npr.org/1006/rss.xml',
      Culture: 'https://feeds.npr.org/1008/rss.xml',
      Sports: 'https://feeds.npr.org/1055/rss.xml',
    },
    overrides: { US: { Top: 'https://feeds.npr.org/1003/rss.xml' } },
  },
  {
    name: 'Al Jazeera',
    flag: '🇶🇦',
    editions: ['Global', 'India'],
    urls: {
      Top: 'https://www.aljazeera.com/xml/rss/all.xml',
      World: 'https://www.aljazeera.com/xml/rss/all.xml',
    },
  },
  {
    name: 'DW',
    flag: '🇩🇪',
    editions: ['Global'],
    urls: {
      Top: 'https://rss.dw.com/rdf/rss-en-all',
      World: 'https://rss.dw.com/rdf/rss-en-world',
      Business: 'https://rss.dw.com/rdf/rss-en-bus',
      Science: 'https://rss.dw.com/rdf/rss-en-sci',
    },
  },
  {
    name: 'The Hindu',
    flag: '🇮🇳',
    editions: ['India'],
    urls: {
      Top: 'https://www.thehindu.com/news/national/feeder/default.rss',
      World: 'https://www.thehindu.com/news/international/feeder/default.rss',
      Science: 'https://www.thehindu.com/sci-tech/science/feeder/default.rss',
      Technology: 'https://www.thehindu.com/sci-tech/technology/feeder/default.rss',
      Health: 'https://www.thehindu.com/sci-tech/health/feeder/default.rss',
      Climate: 'https://www.thehindu.com/sci-tech/energy-and-environment/feeder/default.rss',
      Business: 'https://www.thehindu.com/business/feeder/default.rss',
      Culture: 'https://www.thehindu.com/entertainment/feeder/default.rss',
      Sports: 'https://www.thehindu.com/sport/feeder/default.rss',
    },
  },
  {
    name: 'NDTV',
    flag: '🇮🇳',
    editions: ['India'],
    urls: { Top: 'https://feeds.feedburner.com/ndtvnews-top-stories' },
  },
  {
    name: 'Ars Technica',
    flag: '🇺🇸',
    editions: ['Global', 'US'],
    urls: {
      Technology: 'https://feeds.arstechnica.com/arstechnica/technology-lab',
      Science: 'https://feeds.arstechnica.com/arstechnica/science',
      Gaming: 'https://feeds.arstechnica.com/arstechnica/gaming',
      AI: 'https://arstechnica.com/ai/feed/',
    },
  },
  {
    name: 'Wired',
    flag: '🇺🇸',
    editions: ['Global', 'US'],
    urls: {
      Technology: 'https://www.wired.com/feed/rss',
      Science: 'https://www.wired.com/feed/category/science/latest/rss',
      AI: 'https://www.wired.com/feed/tag/ai/latest/rss',
      Gaming: 'https://www.wired.com/feed/category/games/latest/rss',
    },
  },
  {
    name: 'Nature',
    flag: '🇬🇧',
    editions: ['Global'],
    urls: { Science: 'https://www.nature.com/nature.rss' },
  },
  {
    name: 'NASA',
    flag: '🇺🇸',
    editions: ['Global', 'US'],
    urls: { Space: 'https://www.nasa.gov/feed/' },
  },
  {
    name: 'Space.com',
    flag: '🇺🇸',
    editions: ['Global', 'US', 'India'],
    urls: { Space: 'https://www.space.com/feeds/all' },
  },
  {
    name: 'Inside Climate News',
    flag: '🇺🇸',
    editions: ['Global', 'US'],
    urls: { Climate: 'https://insideclimatenews.org/feed/' },
  },
]

interface Feed {
  /** Label used for items that don't carry their own source (everything but Google News). */
  source: string
  flag: string
  url: string
}

interface Item {
  id: string
  title: string
  summary: string
  source: string
  region: string
  category: string
  url: string
  publishedAt: string | null
  image?: string
}

interface FeedFailure {
  source: string
  url: string
  error: string
}

const FETCH_TIMEOUT_MS = 6000
const MAX_FEED_BYTES = 3_000_000
const PER_FEED = 8
const FEED_LIMIT = 30
const SEARCH_LIMIT = 15

function feedsFor(edition: Edition, category: Category): Feed[] {
  const feeds: Feed[] = []
  for (const s of SOURCES) {
    if (!s.editions.includes(edition)) continue
    const url = s.overrides?.[edition]?.[category] ?? s.urls[category]
    if (url) feeds.push({ source: s.name, flag: s.flag, url })
  }
  return feeds
}

// Google News RSS search is a free aggregator; it also powers the Explore tab.
function searchFeed(q: string, edition: Edition): Feed {
  const locale =
    edition === 'India'
      ? { hl: 'en-IN', gl: 'IN', ceid: 'IN:en' }
      : { hl: 'en-US', gl: 'US', ceid: 'US:en' }
  const params = new URLSearchParams({ q, ...locale })
  return {
    source: 'Google News',
    flag: '🌐',
    url: `https://news.google.com/rss/search?${params}`,
  }
}

// ---------------------------------------------------------------- parsing

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  textNodeName: '#text',
  parseTagValue: false,
  parseAttributeValue: false,
  trimValues: true,
})

type Node = Record<string, unknown>

const arr = <T>(v: T | T[] | undefined | null): T[] =>
  v === undefined || v === null ? [] : Array.isArray(v) ? v : [v]

function text(v: unknown): string {
  if (v === undefined || v === null) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return text(v[0])
  if (typeof v === 'object') return text((v as Node)['#text'])
  return String(v)
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', lsquo: '‘', rsquo: '’',
  ldquo: '“', rdquo: '”', copy: '©', reg: '®', trade: '™',
}

function decodeEntities(s: string): string {
  return s.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e: string) => {
    if (e[0] === '#') {
      const code = e[1].toLowerCase() === 'x' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)
      try {
        return String.fromCodePoint(code)
      } catch {
        return m
      }
    }
    return NAMED_ENTITIES[e.toLowerCase()] ?? m
  })
}

function stripHtml(html: string): string {
  return decodeEntities(
    html
      .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
      .replace(/<[^>]*>/g, ' '),
  )
    .replace(/\s+/g, ' ')
    .trim()
}

function truncate(s: string, max: number): string {
  if (s.length <= max) return s
  const cut = s.slice(0, max)
  return cut.slice(0, cut.lastIndexOf(' ') > max * 0.6 ? cut.lastIndexOf(' ') : max).trimEnd() + '…'
}

function safeUrl(raw: string | undefined, upgradeToHttps = false): string | undefined {
  if (!raw) return undefined
  try {
    const u = new URL(raw.trim())
    if (u.protocol === 'http:' && upgradeToHttps) u.protocol = 'https:'
    return u.protocol === 'https:' || (!upgradeToHttps && u.protocol === 'http:') ? u.href : undefined
  } catch {
    return undefined
  }
}

function pickLink(e: Node): string | undefined {
  for (const l of arr(e.link as unknown)) {
    if (typeof l === 'string') {
      const u = safeUrl(l)
      if (u) return u
    } else if (l && typeof l === 'object') {
      const n = l as Node
      const rel = n['@_rel']
      if (n['@_href'] && (!rel || rel === 'alternate')) {
        const u = safeUrl(String(n['@_href']))
        if (u) return u
      }
    }
  }
  return safeUrl(text(e.guid))
}

function collectMedia(e: Node): Node[] {
  const out: Node[] = []
  const push = (v: unknown) => out.push(...arr(v as Node | Node[]).filter((x) => x && typeof x === 'object'))
  push(e['media:content'])
  push(e['media:thumbnail'])
  for (const g of arr(e['media:group'] as Node | Node[])) {
    push(g?.['media:content'])
    push(g?.['media:thumbnail'])
  }
  return out
}

function pickImage(e: Node, html: string): string | undefined {
  let best: { url: string; width: number } | undefined
  const consider = (raw: unknown, width: number) => {
    const url = safeUrl(typeof raw === 'string' ? raw : undefined, true)
    if (url && (!best || width > best.width)) best = { url, width }
  }
  for (const m of collectMedia(e)) {
    if (m['@_medium'] === 'video' || String(m['@_type'] ?? '').startsWith('video')) continue
    consider(m['@_url'], parseInt(String(m['@_width'] ?? '0'), 10) || 0)
  }
  for (const enc of arr(e.enclosure as Node | Node[])) {
    if (String(enc?.['@_type'] ?? '').startsWith('image/')) consider(enc['@_url'], 0)
  }
  if (!best) {
    const m = html.match(/<img[^>]+src=["']([^"']+)["']/i)
    if (m) consider(decodeEntities(m[1]), 0)
  }
  return (best as { url: string } | undefined)?.url
}

function pickDate(e: Node): string | null {
  const raw = text(e.pubDate) || text(e['dc:date']) || text(e.published) || text(e.updated)
  const t = Date.parse(raw)
  if (Number.isNaN(t)) return null
  // A few feeds ship timezone-broken future dates that would pin to the top forever.
  return new Date(Math.min(t, Date.now())).toISOString()
}

// FNV-1a: stable ids so bookmarks survive re-fetches.
function hashId(s: string): string {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return (h >>> 0).toString(36)
}

function parseFeed(xml: string, feed: Feed, category: string): Item[] {
  const doc = parser.parse(xml) as Node
  const channel = arr((doc.rss as Node | undefined)?.channel as Node | Node[])[0]
  const entries = arr(
    (channel?.item ??
      (doc['rdf:RDF'] as Node | undefined)?.item ??
      (doc.feed as Node | undefined)?.entry) as Node | Node[] | undefined,
  )

  const items: Item[] = []
  for (const e of entries) {
    if (!e || typeof e !== 'object') continue
    const url = pickLink(e)
    let title = stripHtml(text(e.title))
    if (!url || !title) continue

    // Google News tags each item with <source> and suffixes the title with " - Source".
    let source = feed.source
    const itemSource = stripHtml(text(e.source))
    if (itemSource) {
      source = itemSource
      if (title.endsWith(` - ${itemSource}`)) title = title.slice(0, -(itemSource.length + 3))
    }

    const rawHtml = text(e.description) || text(e.summary) || text(e['content:encoded']) || text(e.content)
    let summary = stripHtml(rawHtml).replace(/\s*Continue reading\.{0,3}\s*$/i, '')
    // Aggregators repeat the headline as the "summary"; that's noise.
    if (summary.toLowerCase().startsWith(title.toLowerCase())) summary = ''

    items.push({
      id: hashId(url),
      title,
      summary: truncate(summary, 400),
      source,
      region: feed.flag,
      category,
      url,
      publishedAt: pickDate(e),
      image: pickImage(e, text(e['content:encoded']) || rawHtml),
    })
  }
  return items
}

async function loadFeed(feed: Feed, category: string): Promise<Item[]> {
  const res = await fetch(feed.url, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    redirect: 'follow',
    headers: {
      'User-Agent': 'PulseNews/1.0 (RSS reader; +https://github.com/prashanthashok/pulse-news)',
      Accept: 'application/rss+xml, application/atom+xml, application/xml;q=0.9, text/xml;q=0.8, */*;q=0.5',
    },
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const xml = await res.text()
  if (xml.length > MAX_FEED_BYTES) throw new Error('feed too large')
  return parseFeed(xml, feed, category)
}

// ---------------------------------------------------------------- handler

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

function json(body: unknown, status: number, cache: string): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': cache },
  })
}

export async function GET(request: Request): Promise<Response> {
  const params = new URL(request.url).searchParams
  const edition = (params.get('edition') ?? 'Global') as Edition
  const category = (params.get('category') ?? 'Top') as Category
  const q = (params.get('q') ?? '').trim().slice(0, 100)

  if (!EDITIONS.includes(edition)) return json({ error: 'Unknown edition' }, 400, 'no-store')
  if (!CATEGORIES.includes(category)) return json({ error: 'Unknown category' }, 400, 'no-store')

  const feeds = q ? [searchFeed(q, edition)] : feedsFor(edition, category)
  const label = q ? 'News' : category
  const perFeed = q ? SEARCH_LIMIT : PER_FEED

  const results = await Promise.allSettled(feeds.map((f) => loadFeed(f, label)))

  const failed: FeedFailure[] = []
  const collected: Item[] = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') {
      collected.push(...r.value.sort(byDate).slice(0, perFeed))
    } else {
      failed.push({
        source: feeds[i].source,
        url: feeds[i].url,
        error: r.reason instanceof Error ? r.reason.message : String(r.reason),
      })
    }
  })

  if (feeds.length > 0 && failed.length === feeds.length) {
    return json({ error: 'All news sources failed', failed }, 502, 'no-store')
  }

  const seen = new Set<string>()
  const items = collected
    .sort(byDate)
    .filter((it) => {
      const keys = [it.url, norm(it.title)]
      if (keys.some((k) => seen.has(k))) return false
      keys.forEach((k) => seen.add(k))
      return true
    })
    .slice(0, q ? SEARCH_LIMIT : FEED_LIMIT)

  return json(
    { items, failed, fetchedAt: new Date().toISOString() },
    200,
    'public, s-maxage=300, stale-while-revalidate=600',
  )
}

function byDate(a: Item, b: Item): number {
  return (Date.parse(b.publishedAt ?? '') || 0) - (Date.parse(a.publishedAt ?? '') || 0)
}
