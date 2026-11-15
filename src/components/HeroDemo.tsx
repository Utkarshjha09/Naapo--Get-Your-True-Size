import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { BRANDS, brandChart, matchSize } from '../data'
import { PauseButton, SlideText } from './primitives'

const STEPS = [84, 88, 93, 98]
const SHOWN = ['zara', 'hm', 'uniqlo', 'gap']

/**
 * The product, working, in the hero: one bust measurement and the label it lands on at four
 * brands. It steps through four measurements every 3.2 s; the pause disc holds it.
 */
export function HeroDemo() {
  const reduce = useReducedMotion()
  const [step, setStep] = useState(1)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (reduce || paused) return
    const id = window.setInterval(() => setStep((s) => (s + 1) % STEPS.length), 3200)
    return () => window.clearInterval(id)
  }, [reduce, paused])

  const bust = STEPS[step]
  const rows = SHOWN.map((id) => {
    const brand = BRANDS.find((b) => b.id === id)!
    const chart = brandChart(brand, 'women', 'tops')!
    const { index } = matchSize(chart, bust)
    return { brand, label: chart[index].label, index }
  })

  return (
    <div className="rounded-[10px] border border-line bg-paper/95 p-4 shadow-[0_18px_40px_-24px_rgba(27,25,22,0.45)] backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-baseline gap-3">
          <p className="font-display text-[40px] leading-none tabular-nums">
            <SlideText value={String(bust)} order={bust} />
            <span className="ml-1 font-sans text-sm text-muted">cm</span>
          </p>
          <p className="text-xs uppercase leading-snug tracking-[0.14em] text-muted">
            Bust
            <br />
            Women's tops
          </p>
        </div>
        {!reduce && <PauseButton paused={paused} onToggle={() => setPaused((p) => !p)} label="size preview" />}
      </div>
      <ul className="mt-4 grid grid-cols-4 gap-2 border-t border-line pt-3">
        {rows.map((r) => (
          <li key={r.brand.id} className="min-w-0">
            <p className="truncate text-xs text-muted">{r.brand.name}</p>
            <p className="mt-1 font-display text-[26px] leading-none tabular-nums">
              <SlideText value={r.label} order={r.index} />
            </p>
          </li>
        ))}
      </ul>
      {!reduce && (
        <div className="mt-3 flex gap-1" aria-hidden>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${i === step ? 'bg-ink' : 'bg-line'}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
