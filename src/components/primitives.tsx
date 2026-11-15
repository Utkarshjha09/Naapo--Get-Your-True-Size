import { useEffect, useId, useRef } from 'react'
import { AnimatePresence, m, useReducedMotion } from 'motion/react'

/** Entrance curve: settles without overshoot. */
export const EASE_ENTER = [0.22, 1, 0.36, 1] as const
/** UI curve for every step a click makes. */
export const EASE_UI = [0.2, 0.8, 0.2, 1] as const
/** Indicator travel: a tween, never a bounce. */
export const SLIDE = { type: 'tween', duration: 0.24, ease: EASE_UI } as const

/**
 * Text that rolls to its next value, up when the value grows and down when it shrinks.
 * Each character rolls on its own, so "88" -> "89" moves only the last digit.
 * Interruptible: a fast slider drag swaps mid-roll without queuing.
 */
export function SlideText({
  value,
  order,
  className = '',
}: {
  value: string
  /** a number that sets the direction of the roll */
  order: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const prev = useRef(order)
  const lastDir = useRef(1)
  const dir = order > prev.current ? 1 : order < prev.current ? -1 : lastDir.current
  useEffect(() => {
    prev.current = order
    lastDir.current = dir
  })
  const chars = value.split('')

  if (reduce) return <span className={className}>{value}</span>

  return (
    <span className={`inline-flex ${className}`}>
      <span className="sr-only">{value}</span>
      {chars.map((c, i) => (
        <span
          key={`${chars.length}-${i}`}
          aria-hidden
          className="relative inline-block overflow-hidden"
          style={{ paddingBlock: '0.08em', marginBlock: '-0.08em' }}
        >
          <AnimatePresence mode="popLayout" initial={false} custom={dir}>
            <m.span
              key={c}
              custom={dir}
              className="inline-block whitespace-pre"
              variants={{
                enter: (d: number) => ({ y: `${d * 100}%`, opacity: 0 }),
                center: { y: '0%', opacity: 1 },
                exit: (d: number) => ({ y: `${d * -100}%`, opacity: 0 }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.32, ease: EASE_ENTER }}
            >
              {c}
            </m.span>
          </AnimatePresence>
        </span>
      ))}
    </span>
  )
}

/** A segmented control whose ink pill glides to the chosen option (shared layout). */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string; disabled?: boolean }[]
  value: T
  onChange: (v: T) => void
  label: string
}) {
  const id = useId()
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid rounded-full bg-sand p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            disabled={o.disabled}
            onClick={() => onChange(o.value)}
            className={`relative min-h-11 rounded-full px-3 text-sm transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-40 ${
              on ? 'text-paper' : 'text-muted enabled:hover:text-ink'
            }`}
          >
            {on && (
              <m.span
                layoutId={`seg-${id}`}
                aria-hidden
                className="absolute inset-0 rounded-full bg-ink"
                transition={SLIDE}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** A row of chips with one ink background that travels to the chosen chip. */
export function Chips<T extends string>({
  options,
  value,
  onChange,
  label,
  small = false,
}: {
  options: { value: T; label: string }[]
  value: T
  onChange: (v: T) => void
  label: string
  small?: boolean
}) {
  const id = useId()
  return (
    <div role="radiogroup" aria-label={label} className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            role="radio"
            aria-checked={on}
            onClick={() => onChange(o.value)}
            className={`relative rounded-full border transition-colors duration-200 ${
              small ? 'min-h-9 px-3.5 text-xs' : 'min-h-11 px-4 text-sm'
            } ${on ? 'border-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
          >
            {on && (
              <m.span
                layoutId={`chip-${id}`}
                aria-hidden
                className="absolute -inset-px rounded-full bg-ink"
                transition={SLIDE}
              />
            )}
            <span className="relative">{o.label}</span>
          </button>
        )
      })}
    </div>
  )
}

/** Round 32px pause / play disc for anything that keeps moving. */
export function PauseButton({
  paused,
  onToggle,
  label,
  tone = 'dark',
  className = '',
}: {
  paused: boolean
  onToggle: () => void
  label: string
  tone?: 'dark' | 'light'
  className?: string
}) {
  return (
    <button
      onClick={onToggle}
      aria-label={`${paused ? 'Play' : 'Pause'} ${label}`}
      aria-pressed={paused}
      className={`grid size-8 place-items-center rounded-full transition-[background-color,transform] duration-150 active:scale-[0.94] ${
        tone === 'dark' ? 'bg-ink text-paper hover:bg-oxblood' : 'bg-paper text-ink hover:bg-sand'
      } ${className}`}
    >
      {paused ? (
        <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
          <path d="M1 1l8 5-8 5z" fill="currentColor" />
        </svg>
      ) : (
        <svg width="10" height="12" viewBox="0 0 10 12" aria-hidden>
          <rect x="1" y="1" width="3" height="10" rx="0.5" fill="currentColor" />
          <rect x="6" y="1" width="3" height="10" rx="0.5" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}

/** Arrow that nudges 3px on its button's hover. */
export function Arrow() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
      className="transition-transform duration-150 ease-out group-hover:translate-x-[3px]"
    >
      <path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
