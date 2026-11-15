import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'
import type { Brand } from '../data'
import { BrandLogo } from './BrandLogo'
import { EASE_ENTER } from './primitives'

/**
 * A brand picker in the site's own skin: a field-like trigger showing the chosen brand's logo, and a
 * panel with a filter box and a scrollable list of logos and names. Keyboard: arrows move, Enter picks,
 * Escape closes, typing filters.
 */
export function BrandSelect({
  id,
  value,
  onChange,
  brands,
}: {
  id: string
  value: string
  onChange: (id: string) => void
  brands: Brand[]
}) {
  const uid = useId()
  const listId = `${uid}-list`
  const reduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(0)
  const [upward, setUpward] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const search = useRef<HTMLInputElement>(null)
  const list = useRef<HTMLUListElement>(null)

  const selected = brands.find((b) => b.id === value)
  const shown = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? brands.filter((b) => b.name.toLowerCase().includes(q)) : brands
  }, [brands, query])

  const openPanel = () => {
    const r = trigger.current?.getBoundingClientRect()
    if (r) setUpward(window.innerHeight - r.bottom < 360 && r.top > window.innerHeight - r.bottom)
    setQuery('')
    setActive(Math.max(0, brands.findIndex((b) => b.id === value)))
    setOpen(true)
  }
  const close = (focusTrigger = true) => {
    setOpen(false)
    if (focusTrigger) trigger.current?.focus()
  }
  const pick = (b: Brand) => {
    onChange(b.id)
    close()
  }

  // focus the filter box once the panel is up
  useEffect(() => {
    if (open) search.current?.focus({ preventScroll: true })
  }, [open])

  // a click anywhere else closes the panel
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  // keep the highlighted row in view
  useEffect(() => {
    if (!open) return
    list.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [active, open])

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault()
      openPanel()
    }
  }
  const onSearchKey = (e: KeyboardEvent) => {
    const last = shown.length - 1
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a >= last ? 0 : a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a <= 0 ? last : a - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(last)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (shown[active]) pick(shown[active])
    } else if (e.key === 'Escape') {
      e.preventDefault()
      close()
    } else if (e.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div ref={root} className="relative">
      <button
        ref={trigger}
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? close() : openPanel())}
        onKeyDown={onTriggerKey}
        className={`group flex min-h-14 w-full items-center gap-3 rounded-[10px] border bg-paper py-2 pl-2.5 pr-4 text-left outline-none transition-[border-color,box-shadow,transform] duration-150 hover:border-ink focus-visible:border-ink focus-visible:shadow-[0_0_0_3px_var(--color-sand)] active:scale-[0.995] ${
          open ? 'border-ink shadow-[0_0_0_3px_var(--color-sand)]' : 'border-line'
        }`}
      >
        {selected ? (
          <BrandLogo brand={selected} size="sm" eager />
        ) : (
          <span aria-hidden className="grid size-9 shrink-0 place-items-center rounded-[8px] border border-dashed border-line text-muted">
            ?
          </span>
        )}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] leading-tight">{selected?.name ?? 'Choose a brand'}</span>
          {selected && <span className="mt-0.5 block truncate text-xs text-muted">{selected.origin}</span>}
        </span>
        <svg
          aria-hidden
          width="12"
          height="8"
          viewBox="0 0 12 8"
          className={`shrink-0 text-muted transition-transform duration-200 group-hover:text-ink ${open ? 'rotate-180' : ''}`}
        >
          <path d="M1 1.5l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <m.div
            initial={{ opacity: 0, y: reduce ? 0 : upward ? 6 : -6, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduce ? 0 : upward ? 4 : -4, scale: reduce ? 1 : 0.985, transition: { duration: 0.12 } }}
            transition={{ duration: 0.2, ease: EASE_ENTER }}
            style={{ transformOrigin: upward ? 'bottom center' : 'top center' }}
            className={`absolute inset-x-0 z-40 overflow-hidden rounded-[12px] border border-ink/15 bg-paper shadow-[0_18px_40px_-12px_rgba(31,27,22,0.28),0_2px_6px_rgba(31,27,22,0.06)] ${
              upward ? 'bottom-full mb-2' : 'top-full mt-2'
            }`}
          >
            <div className="flex items-center gap-2 border-b border-line px-3.5">
              <svg aria-hidden width="15" height="15" viewBox="0 0 16 16" className="shrink-0 text-muted">
                <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <input
                ref={search}
                type="text"
                role="combobox"
                aria-label="Filter brands"
                aria-expanded="true"
                aria-controls={listId}
                aria-autocomplete="list"
                aria-activedescendant={shown[active] ? `${uid}-${shown[active].id}` : undefined}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setActive(0)
                }}
                onKeyDown={onSearchKey}
                placeholder={`Search ${brands.length} brands`}
                className="min-h-12 w-full bg-transparent text-[16px] outline-none placeholder:text-muted"
              />
            </div>
            <ul
              ref={list}
              id={listId}
              role="listbox"
              aria-label="Brands"
              data-lenis-prevent
              className="max-h-[min(320px,50vh)] overflow-y-auto overscroll-contain p-1.5"
            >
              {shown.length === 0 && <li className="px-3 py-6 text-center text-sm text-muted">No brand matches “{query}”</li>}
              {shown.map((b, i) => {
                const on = b.id === value
                const hot = i === active
                return (
                  <li
                    key={b.id}
                    id={`${uid}-${b.id}`}
                    role="option"
                    aria-selected={on}
                    data-index={i}
                    onPointerMove={() => setActive(i)}
                    onClick={() => pick(b)}
                    className={`flex min-h-12 cursor-pointer select-none items-center gap-3 rounded-[8px] px-2 py-1.5 transition-colors duration-100 ${
                      hot ? 'bg-sand' : ''
                    }`}
                  >
                    <BrandLogo brand={b} size="xs" />
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-[15px] leading-tight ${on ? 'font-medium' : ''}`}>{b.name}</span>
                      <span className="block truncate text-[11px] text-muted">{b.origin}</span>
                    </span>
                    {on && (
                      <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" className="shrink-0 text-ink">
                        <path d="M2.5 7.5l3 3 6-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </li>
                )
              })}
            </ul>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
