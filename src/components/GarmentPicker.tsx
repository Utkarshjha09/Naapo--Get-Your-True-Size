import { useId } from 'react'
import { m } from 'motion/react'
import { FAMILIES, FAMILY_LABEL, GARMENT_LABEL, familyOf, type Garment } from '../data'
import { SLIDE } from './primitives'

/**
 * Garments in labelled rows (topwear, winterwear, dresses and ethnic, bottomwear, innerwear, footwear), with one ink chip
 * that travels between them. A row with nothing in it is left out.
 */
export function GarmentPicker({
  garments,
  value,
  onChange,
  label = 'What are you buying',
  small = false,
}: {
  garments: Garment[]
  value: Garment
  onChange: (g: Garment) => void
  label?: string
  small?: boolean
}) {
  const id = useId()
  const rows = FAMILIES
    .map((f) => ({ name: FAMILY_LABEL[f], items: garments.filter((g) => familyOf(g) === f) }))
    .filter((r) => r.items.length)

  return (
    <div role="radiogroup" aria-label={label} className="space-y-3">
      {rows.map((row) => (
        <div key={row.name}>
          <p className="mb-1.5 text-[11px] text-muted">{row.name}</p>
          <div className="flex flex-wrap gap-1.5">
            {row.items.map((g) => {
              const on = g === value
              return (
                <button
                  key={g}
                  role="radio"
                  aria-checked={on}
                  onClick={() => onChange(g)}
                  className={`relative rounded-full border transition-colors duration-200 ${
                    small ? 'min-h-9 px-3 text-xs' : 'min-h-10 px-3.5 text-[13px]'
                  } ${on ? 'border-ink text-paper' : 'border-line text-ink hover:border-ink'}`}
                >
                  {on && (
                    <m.span
                      layoutId={`garment-${id}`}
                      aria-hidden
                      className="absolute -inset-px rounded-full bg-ink"
                      transition={SLIDE}
                    />
                  )}
                  <span className="relative whitespace-nowrap">{GARMENT_LABEL[g]}</span>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
