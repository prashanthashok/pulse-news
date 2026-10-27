# Pulse News

A small, fast news PWA. Headlines come straight from publishers' public RSS feeds. No AI, no API keys, no accounts, no tracking.

- **Feed** — Global / US / India editions across 12 categories, with a featured story and article cards
- **Explore** — search any topic (powered by Google News RSS)
- **Saved** — bookmarks, stored on your device
- **Preferences** — hide sources you don't want, mute words
- **PWA** — installable, opens offline with the last headlines it saw

Sources: BBC, The Guardian, NPR, Al Jazeera, DW, The Hindu, NDTV, Ars Technica, Wired, Nature, NASA, Space.com, Inside Climate News.

## How it works

Browsers can't read most RSS feeds directly (no CORS headers), so a single Vercel function, [`api/news.ts`](api/news.ts), fetches them server-side and returns normalised JSON:

```
GET /api/news?edition=Global&category=Top
GET /api/news?q=climate+summit
```

It fetches the relevant feeds in parallel (6 s timeout each), parses RSS 2.0 / RDF / Atom, dedupes, sorts newest-first and caches at the edge for 5 minutes. A feed that is down is skipped rather than breaking the page; the response lists what failed under `failed`.

Which feeds back each edition + category lives in the `SOURCES` table at the top of `api/news.ts`.

## Develop

```bash
npm install
npm run dev          # http://localhost:5173, serves /api/news from the same handler
npm run build
npm run check:feeds  # hits every configured feed and reports dead URLs
```

No environment variables are needed.

## Deploy

Import the repo in Vercel and deploy. `vercel.json` handles SPA routing, security headers and no-cache on `sw.js`.

## Notes

- Feeds change URLs now and then. `npm run check:feeds` (or opening `/api/news?edition=Global&category=Top` and reading `failed`) tells you which one to fix.
- Summaries and images are the publishers'. Pulse links out for the full story and doesn't scrape article pages.
- Search relies on Google News' public RSS endpoint, which is unofficial. If it ever stops working, only the Explore tab is affected.
