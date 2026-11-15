import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import { AUDIENCE_LABEL, BRANDS } from '../data'
import { navigate } from '../lib/router'
import { pauseScroll, resumeScroll } from '../lib/scroll'
import { BrandLogo } from './BrandLogo'
import { EASE_ENTER } from './primitives'

const POPULAR = ['roadster', 'snitch', 'zudio', 'allen-solly', 'bewakoof', 'souled-store', 'zara', 'hm', 'nike', 'adidas', 'bata', 'campus']

/** Brands whose name starts with the query come first, then names that contain it, then origins. */
function search(q: string) {
  const s = q.trim().toLowerCase().replace(/[^a-z0-9&' ]/g, '')
  if (!s) return POPULAR.map((id) => BRANDS.find((b) => b.id === id)!).filter(Boolean)
  const flat = (x: string) => x.toLowerCase().replace(/[^a-z0-9]/g, '')
  const fs = flat(s)
  return BRANDS.map((b) => {
    const name = flat(b.name)
    const words = b.name.toLowerCase().split(/\s+/)
    const score = name.startsWith(fs) ? 0 : words.some((w) => w.startsWith(s)) ? 1 : name.includes(fs) ? 2 : b.origin.toLowerCase().includes(s) ? 3 : 9
    return { b, score }
  })
    .filter((x) => x.score < 9)
    .sort((a, b) => a.score - b.score || a.b.name.localeCompare(b.b.name))
    .map((x) => x.b)
}

/*
 * One search dialog for the whole site. Every search button opens the same one, and the "/" and
 * Ctrl+K shortcut is registered once (in BrandSearchHost), however many buttons the header shows.
 */
let setOpenShared: ((open: boolean) => void) | null = null
const openSearch = () => setOpenShared?.(true)

/** Mount once, near the root: holds the dialog and the keyboard shortcut. */
export function BrandSearchHost() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    setOpenShared = setOpen
    const onKey = (e: KeyboardEvent) => {
      const typing = e.target instanceof HTMLElement && (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable)
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('keydown', onKey)
      setOpenShared = null
    }
  }, [])

  return <AnimatePresence>{open && <SearchDialog onClose={() => setOpen(false)} />}</AnimatePresence>
}

/** A search button for the header. */
export function BrandSearchButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      onClick={openSearch}
      aria-haspopup="dialog"
      className={
        compact
          ? 'grid size-11 place-items-center rounded-full text-ink transition-colors hover:bg-sand'
          : 'group flex min-h-10 items-center gap-2.5 rounded-full border border-line bg-paper pl-3.5 pr-2 text-sm text-muted transition-[border-color,color] duration-150 hover:border-ink hover:text-ink'
      }
      aria-label="Search brands"
    >
      <SearchGlyph />
      {!compact && (
        <>
          <span aria-hidden>Search brands</span>
          <kbd aria-hidden className="rounded-[5px] border border-line px-1.5 py-0.5 font-sans text-[11px] text-muted">
            /
          </kbd>
        </>
      )}
    </button>
  )
}

function SearchGlyph() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 16 16">
      <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function SearchDialog({ onClose }: { onClose: () => void }) {
  const reduce = useReducedMotion()
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const input = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)
  const results = useMemo(() => search(q), [q])
  const opener = useRef<Element | null>(null)

  useEffect(() => {
    opener.current = document.activeElement
    input.current?.focus()
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    pauseScroll()
    return () => {
      html.style.overflow = prev
      resumeScroll()
      ;(opener.current as HTMLElement | null)?.focus?.()
    }
  }, [])

  useEffect(() => setActive(0), [q])
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active])

  const go = (id: string) => {
    onClose()
    navigate(`/brands/${id}`)
  }

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(a + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(a - 1, 0))
    } else if (e.key === 'Enter' && results[active]) go(results[active].id)
  }

  return (
    <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Search brands" onKeyDown={onKey}>
      <m.div
        className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: reduce ? 0 : 0.18 }}
        onClick={onClose}
      />
      <m.div
        className="relative mx-auto flex h-[100svh] w-full flex-col bg-paper sm:mt-[10vh] sm:h-auto sm:max-h-[70vh] sm:max-w-[560px] sm:rounded-[14px] sm:border sm:border-line sm:shadow-[0_30px_60px_-30px_rgba(27,25,22,0.45)]"
        initial={reduce ? false : { opacity: 0, y: 8, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: 4, scale: 0.99, transition: { duration: 0.12 } }}
        transition={{ duration: 0.22, ease: EASE_ENTER }}
      >
        <div className="flex items-center gap-3 border-b border-line px-4 sm:px-5">
          <span className="text-muted">
            <SearchGlyph />
          </span>
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${BRANDS.length} brands`}
            aria-label="Brand name"
            aria-controls="brand-results"
            aria-activedescendant={results[active] ? `brand-opt-${results[active].id}` : undefined}
            role="combobox"
            aria-expanded="true"
            autoComplete="off"
            spellCheck={false}
            className="min-h-14 flex-1 bg-transparent text-[16px] outline-none placeholder:text-muted"
          />
          <button onClick={onClose} className="min-h-11 rounded-full px-3 text-sm text-muted hover:text-ink">
            Close
          </button>
        </div>
        <p className="px-4 pb-1 pt-3 text-[11px] uppercase tracking-[0.14em] text-muted sm:px-5">
          {q.trim() ? `${results.length} ${results.length === 1 ? 'brand' : 'brands'}` : 'Popular in India'}
        </p>
        <ul ref={list} id="brand-results" role="listbox" data-lenis-prevent className="overflow-y-auto px-2 pb-3 sm:px-3">
          {results.map((b, i) => (
            <li
              key={b.id}
              id={`brand-opt-${b.id}`}
              role="option"
              aria-selected={i === active}
              data-i={i}
              onClick={() => go(b.id)}
              onMouseMove={() => setActive(i)}
              className={`flex min-h-14 cursor-pointer items-center gap-3 rounded-[10px] px-2 transition-colors duration-100 ${
                i === active ? 'bg-sand' : ''
              }`}
            >
              <BrandLogo brand={b} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[15px]">{b.name}</span>
                <span className="block truncate text-xs text-muted">
                  {b.origin} · <span className="capitalize">{b.kinds.join(' & ')}</span> ·{' '}
                  {b.audience.map((a) => AUDIENCE_LABEL[a]).join(', ')}
                </span>
              </span>
              <span aria-hidden className={`text-muted ${i === active ? 'opacity-100' : 'opacity-0'}`}>
                ↵
              </span>
            </li>
          ))}
          {!results.length && (
            <li className="px-3 py-8 text-center text-sm text-muted">
              No brand called “{q.trim()}” yet.
            </li>
          )}
        </ul>
      </m.div>
    </div>
  )
}
