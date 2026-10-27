// Checks that every configured feed still responds and parses.
//   npm run check:feeds
// Runs the same handler Vercel deploys, once per edition x category, and
// prints each feed that failed (dead URL, blocked, malformed XML...).

import { GET } from '../api/news.ts'

const EDITIONS = ['Global', 'US', 'India']
const CATEGORIES = [
  'Top', 'World', 'Science', 'Technology', 'AI', 'Gaming',
  'Space', 'Health', 'Climate', 'Business', 'Culture', 'Sports',
]

interface Failure {
  source: string
  url: string
  error: string
}

const failures = new Map<string, Failure>()
let combos = 0
let empty = 0

for (const edition of EDITIONS) {
  for (const category of CATEGORIES) {
    combos++
    const res = await GET(new Request(`http://local/api/news?edition=${edition}&category=${category}`))
    const body = (await res.json()) as { items?: unknown[]; failed?: Failure[] }
    for (const f of body.failed ?? []) failures.set(f.url, f)
    const count = body.items?.length ?? 0
    if (count === 0) empty++
    console.log(`${edition.padEnd(7)} ${category.padEnd(11)} ${String(count).padStart(2)} stories` +
      (body.failed?.length ? `  (${body.failed.length} feed(s) failed)` : ''))
  }
}

console.log(`\n${combos} views checked, ${empty} came back empty.`)
if (failures.size > 0) {
  console.log(`\n${failures.size} feed URL(s) failed:`)
  for (const f of failures.values()) console.log(`  ${f.source.padEnd(20)} ${f.error.padEnd(14)} ${f.url}`)
  process.exitCode = 1
} else {
  console.log('All feeds OK.')
}
