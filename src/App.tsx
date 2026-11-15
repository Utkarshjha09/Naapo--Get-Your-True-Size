import { Suspense, lazy, useEffect } from 'react'
import { useLocation } from './lib/router'
import { startSmoothScroll } from './lib/scroll'
import { warmLogos } from './lib/warmLogos'
import { Footer, Header } from './components/Layout'
import { BrandSearchHost } from './components/BrandSearch'
import Home from './pages/Home'
import { NotFound } from './components/NotFound'
// brand pages load their own code only when one is opened
const BrandPage = lazy(() => import('./pages/BrandPage'))

/** Routes: / and /brands/:id. Anything else is a not-found page. */
export default function App() {
  const { path } = useLocation()
  useEffect(() => startSmoothScroll(), [])
  useEffect(() => warmLogos(), [])

  const brand = /^\/brands\/([\w-]+)\/?$/.exec(path)?.[1]

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-ink">
      <a
        href="#main"
        className="fixed left-3 top-3 z-50 -translate-y-[150%] rounded-md bg-ink px-3 py-2 text-sm text-paper focus:translate-y-0"
      >
        Skip to content
      </a>
      <Header />
      {brand ? (
        <Suspense fallback={<main id="main" className="min-h-[100svh]" aria-busy="true" />}>
          <BrandPage key={brand} id={brand} />
        </Suspense>
      ) : path === '/' || path === '' || path === '/index.html' ? (
        <Home />
      ) : (
        <NotFound path={path} />
      )}
      <Footer />
      <BrandSearchHost />
    </div>
  )
}
