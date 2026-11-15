import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'
import { SITE_URL } from './site.config.ts'
import { notFoundPage, prerenderBrands, prerenderHome, seoFiles } from './seo/generate.ts'

/**
 * sitemap.xml, robots.txt, llms.txt, llm.txt and llms-full.txt, made from the brand data: emitted on build, served in dev.
 * On build it also fills the home page and writes one pre-rendered page per brand (brands/<id>.html).
 */
function seo(): Plugin {
  return {
    name: 'naapo-seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const name = req.url?.split('?')[0].replace(/^\//, '') ?? ''
        const file = seoFiles()[name]
        if (!file) return next()
        res.setHeader('Content-Type', file.type)
        res.end(file.body)
      })
    },
    generateBundle() {
      for (const [fileName, file] of Object.entries(seoFiles())) {
        this.emitFile({ type: 'asset', fileName, source: file.body })
      }
    },
    writeBundle(options) {
      const dir = options.dir ?? path.resolve(import.meta.dirname, 'dist')
      const indexPath = path.join(dir, 'index.html')
      const template = fs.readFileSync(indexPath, 'utf8')
      for (const [file, html] of Object.entries(prerenderBrands(template))) {
        fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
        fs.writeFileSync(path.join(dir, file), html)
      }
      fs.writeFileSync(path.join(dir, '404.html'), notFoundPage(template))
      fs.writeFileSync(indexPath, prerenderHome(template))
    },
    configurePreviewServer(server) {
      // like the live host: real pages are files, anything else gets 404.html with a 404 status
      const dist = path.resolve(import.meta.dirname, server.config.build.outDir)
      const isFile = (f: string) => f.startsWith(dist) && fs.existsSync(f) && fs.statSync(f).isFile()
      server.middlewares.use((req, res, next) => {
        const url = decodeURIComponent((req.url ?? '/').split(/[?#]/)[0])
        const file = path.join(dist, url)
        const page404 = path.join(dist, '404.html')
        if (url === '/' || isFile(file) || isFile(`${file.replace(/[\\/]$/, '')}.html`) || !isFile(page404)) return next()
        res.statusCode = 404
        res.setHeader('Content-Type', 'text/html; charset=utf-8')
        res.end(fs.readFileSync(page404))
      })
    },
    transformIndexHtml(html) {
      return html.split('%SITE_URL%').join(SITE_URL)
    },
  }
}

/** The production security headers from vercel.json, so `npm run preview` behaves like the live site. */
function productionHeaders(): Record<string, string> {
  const config = JSON.parse(fs.readFileSync(path.resolve(import.meta.dirname, 'vercel.json'), 'utf8'))
  const all = config.headers?.find((h: { source: string }) => h.source === '/(.*)')?.headers ?? []
  return Object.fromEntries(all.map((h: { key: string; value: string }) => [h.key, h.value]))
}

export default defineConfig({
  plugins: [react(), tailwindcss(), seo()],
  define: {
    __SITE_URL__: JSON.stringify(SITE_URL),
  },
  preview: {
    headers: productionHeaders(),
  },
  server: {
    watch: { ignored: ['**/.taste-skill/**'] },
  },
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
})
