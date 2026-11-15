import { LOGOS } from '../logos'

/**
 * Fetch every logo in the background, so lists, search and the brand picker show logos at once instead
 * of one by one as they scroll in. The files are small (about 145 KB together) and cached afterwards.
 *
 * It waits for the visitor's first scroll, tap, click or key press, so someone who lands and leaves
 * never downloads them: with thousands of visitors that is most of the bandwidth this would otherwise
 * cost. Skipped on data-saver and slow (2G) connections.
 */
let warmed = false
export function warmLogos() {
  if (warmed || typeof window === 'undefined') return
  warmed = true
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (conn?.saveData || /2g/.test(conn?.effectiveType ?? '')) return

  const idle = (cb: () => void) =>
    'requestIdleCallback' in window ? window.requestIdleCallback(cb, { timeout: 3000 }) : setTimeout(cb, 1500)
  const fetchAll = () => {
    for (const src of Object.values(LOGOS)) {
      const img = new Image()
      img.decoding = 'async'
      img.src = src
    }
  }

  const events = ['wheel', 'touchstart', 'pointerdown', 'keydown', 'scroll'] as const
  const onFirst = () => {
    for (const e of events) window.removeEventListener(e, onFirst)
    idle(fetchAll)
  }
  for (const e of events) window.addEventListener(e, onFirst, { once: true, passive: true })
}
