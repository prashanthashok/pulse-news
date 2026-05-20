# Pulse News

A mobile-first AI-powered news PWA built with React + Vite. Generates curated, plausible news briefings using the Google Gemini API.

## Features

- **AI-curated feed** — Global, US, and India editions across 12 categories
- **Article detail** — AI-generated ~350 word body for any article
- **Search** — Find stories on any topic via Gemini
- **Saved** — Bookmark articles to localStorage
- **Preferences** — Content filters and focus areas
- **PWA** — Installable, works offline (app shell), native feel on iOS

## Tech stack

- React 18 + Vite + TypeScript
- Tailwind CSS v4
- `vite-plugin-pwa` (Workbox service worker + manifest)
- `@tabler/icons-react`
- Google Gemini 1.5 Flash API

## Setup

```bash
cp .env.example .env
# Add your Gemini API key to .env
npm install
npm run dev
```

Get a free Gemini API key at [aistudio.google.com](https://aistudio.google.com/).

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add environment variable: `VITE_GEMINI_API_KEY`
4. Deploy — `vercel.json` handles SPA routing and security headers

## Environment variables

| Variable | Description |
|----------|-------------|
| `VITE_GEMINI_API_KEY` | Google Gemini API key (required) |
