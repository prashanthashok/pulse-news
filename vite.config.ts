import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// `vite dev` doesn't run Vercel functions, so serve /api/news from the same
// handler file that Vercel deploys. (`vercel dev` works too.)
function devApi(): Plugin {
  return {
    name: 'pulse-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/news', async (req, res) => {
        try {
          const mod = await server.ssrLoadModule('/api/news.ts')
          const url = new URL(req.originalUrl ?? req.url ?? '/api/news', 'http://localhost')
          const response: Response = await mod.GET(new Request(url))
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(Buffer.from(await response.arrayBuffer()))
        } catch (e) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: String(e) }))
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devApi(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png'],
      manifest: {
        name: 'Pulse News',
        short_name: 'Pulse',
        description: 'Headlines from trusted sources, no AI, no accounts.',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        // App shell + bundled fonts are precached, so the installed app opens offline.
        globPatterns: ['**/*.{js,css,html,woff2,svg,png}'],
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Fresh headlines when online, last-seen headlines when not.
            urlPattern: ({ url }) => url.pathname === '/api/news',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'news-api',
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
    }),
  ],
})
