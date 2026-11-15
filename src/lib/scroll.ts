import Lenis from 'lenis'

let lenis: Lenis | null = null

const HEADER_OFFSET = -64

/** Starts Lenis once. Skipped under reduced motion, where the page scrolls natively. */
export function startSmoothScroll() {
  if (lenis || typeof window === 'undefined') return () => {}
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.12,
    smoothWheel: true,
    // touch keeps the phone's own momentum scrolling
    syncTouch: false,
    // native scrolling inside the size-chart table and any overflow container
    prevent: (node) => node.closest('[data-lenis-prevent]') !== null,
  })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

/** Holds the page still while a dialog is open. */
export const pauseScroll = () => lenis?.stop()
export const resumeScroll = () => lenis?.start()

/** Instantly to the top, for a new page. */
export function jumpToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true })
  else window.scrollTo(0, 0)
}

export function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenis) {
    lenis.scrollTo(id === 'top' ? 0 : el, { offset: HEADER_OFFSET, duration: 1.1 })
  } else {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
}
