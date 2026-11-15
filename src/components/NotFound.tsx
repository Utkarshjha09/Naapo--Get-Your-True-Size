import { useEffect } from 'react'
import { BRANDS } from '../data'
import { setMeta } from '../lib/meta'
import { ActionLink, TRIVASITE_ABOUT } from './Layout'

/**
 * The page for an address naapo does not have: an unknown brand, or any other path. The server already
 * answers these with a 404; this keeps search engines from indexing them if one is reached in the app.
 */
export function NotFound({ path, brand = false }: { path: string; brand?: boolean }) {
  useEffect(() => {
    setMeta({ title: `${brand ? 'Brand' : 'Page'} not found · naapo`, path, noindex: true })
    return () => setMeta({ path: '/', noindex: false })
  }, [path, brand])

  return (
    <main id="main" className="mx-auto flex min-h-[70svh] max-w-[1240px] 2xl:max-w-[1400px] flex-col items-start justify-center px-5 md:px-8">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">{brand ? 'Brands' : 'Not found'}</p>
      <h1 className="mt-4 font-display text-[clamp(40px,10vw,56px)] leading-none">
        {brand ? "We don't chart that brand yet" : "We couldn't find that page"}
      </h1>
      <p className="mt-4 max-w-[420px] text-muted">
        Pick one of the {BRANDS.length} brands naapo compares, or{' '}
        <a href={TRIVASITE_ABOUT} target="_blank" rel="noopener" className="link-underline text-ink">
          ask us to add {brand ? 'it' : 'a brand'}
        </a>
        .
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ActionLink href="/#brands">See all brands</ActionLink>
        {!brand && <ActionLink href="/">Go to the home page</ActionLink>}
      </div>
    </main>
  )
}
