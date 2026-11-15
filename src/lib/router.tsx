import { useEffect, useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'
import { jumpToTop, scrollToId } from './scroll'

/*
 * A small path router on the History API: /, /brands/:id. Links are real <a href>, so they open
 * in a new tab, copy and share like any link; a plain click swaps the page without a reload.
 */

const listeners = new Set<() => void>()
const notify = () => listeners.forEach((l) => l())

if (typeof window !== 'undefined') window.addEventListener('popstate', notify)

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useLocation() {
  const path = useSyncExternalStore(subscribe, () => window.location.pathname)
  const search = useSyncExternalStore(subscribe, () => window.location.search)
  return { path, search }
}

/** The section to scroll to once the next page has rendered. */
let pendingSection: string | null = null

export function navigate(to: string, opts: { replace?: boolean } = {}) {
  const url = new URL(to, window.location.origin)
  const samePage = url.pathname === window.location.pathname
  const section = url.hash.slice(1) || null
  const target = url.pathname + url.search
  if (opts.replace) window.history.replaceState(null, '', target)
  else if (window.location.pathname + window.location.search !== target) window.history.pushState(null, '', target)

  if (samePage) {
    if (section) scrollToId(section)
    else if (!opts.replace) scrollToId('top')
    notify()
    return
  }
  pendingSection = section
  notify()
}

/** Called by each page once it has rendered: goes to the asked section, or to the top. */
export function usePageEntry(key: string) {
  useEffect(() => {
    const section = pendingSection
    pendingSection = null
    jumpToTop()
    if (section) requestAnimationFrame(() => scrollToId(section))
  }, [key])
}

/** Updates one query parameter without a new history entry. */
export function setQuery(name: string, value: string) {
  const params = new URLSearchParams(window.location.search)
  params.set(name, value)
  window.history.replaceState(null, '', `${window.location.pathname}?${params}`)
}

export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...rest} />
}
