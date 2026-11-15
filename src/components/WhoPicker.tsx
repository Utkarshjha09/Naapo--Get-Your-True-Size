import { useId } from 'react'
import { m } from 'motion/react'
import { GROUPS, categoryInfo, type Category, type Gender } from '../data'
import { SLIDE, Segmented } from './primitives'

/**
 * Two steps: the gender, then the age group inside it (Women / Girls 8–14 / Kids girls 2–7).
 * Switching gender keeps the same age band: Girls becomes Boys, Kids girls becomes Kids boys.
 */
export function WhoPicker({
  value,
  onChange,
  only,
  compact = false,
}: {
  value: Category
  onChange: (c: Category) => void
  /** limit the groups shown (a brand that sizes only some of them) */
  only?: Category[]
  compact?: boolean
}) {
  const id = useId()
  const gender = categoryInfo(value).gender
  const band = GROUPS[gender].indexOf(value)

  const pickGender = (g: Gender) => {
    if (g === gender) return
    const groups = GROUPS[g].filter((c) => !only || only.includes(c))
    onChange(groups[Math.min(band, groups.length - 1)] ?? GROUPS[g][0])
  }

  const groups = GROUPS[gender].filter((c) => !only || only.includes(c))

  return (
    <div className="space-y-3">
      <Segmented<Gender>
        label="Gender"
        value={gender}
        onChange={pickGender}
        options={(['female', 'male'] as Gender[]).map((g) => ({
          value: g,
          label: g === 'female' ? 'Female' : 'Male',
          disabled: !!only && !GROUPS[g].some((c) => only.includes(c)),
        }))}
      />
      <div role="radiogroup" aria-label="Age group" className="grid grid-cols-3 gap-2">
        {groups.map((c) => {
          const info = categoryInfo(c)
          const on = c === value
          return (
            <button
              key={c}
              role="radio"
              aria-checked={on}
              onClick={() => onChange(c)}
              className={`relative flex flex-col items-center justify-center rounded-[10px] border px-2 text-center transition-colors duration-200 ${
                compact ? 'min-h-12 py-1.5' : 'min-h-14 py-2'
              } ${on ? 'border-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
            >
              {on && (
                <m.span
                  layoutId={`who-${id}`}
                  aria-hidden
                  className="absolute -inset-px rounded-[10px] bg-ink"
                  transition={SLIDE}
                />
              )}
              <span className="relative text-sm leading-tight">{info.short}</span>
              <span className={`relative mt-0.5 text-[11px] leading-tight ${on ? 'text-paper/70' : 'text-muted'}`}>
                {info.ages ?? 'Adult'}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
