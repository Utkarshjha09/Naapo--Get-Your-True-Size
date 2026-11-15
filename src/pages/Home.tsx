import { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react'
import { m as motion, useReducedMotion } from 'motion/react'
import {
  BRANDS,
  CATEGORIES,
  GARMENTS,
  GARMENT_LABEL,
  brandChart,
  baseChart,
  categoryInfo,
  fitTendency,
  AUDIENCE_LABEL,
  isFootwear,
  matchSize,
  measureFor,
  systemName,
  type Audience,
  type BrandKind,
  type Category,
  type Garment,
} from '../data'
import { Link, navigate, useLocation, usePageEntry } from '../lib/router'
import { scrollToId } from '../lib/scroll'
import { setMeta } from '../lib/meta'
import { Arrow, Chips, EASE_ENTER, SLIDE, Segmented, SlideText } from '../components/primitives'
import { ActionLink, Field, TRIVASITE_ABOUT, UnitToggle, fmt, photoSet, photoSrc, stripSystem, type Unit } from '../components/Layout'
import { GarmentPicker } from '../components/GarmentPicker'
import { BrandSelect } from '../components/BrandSelect'
import { BrandLogo } from '../components/BrandLogo'
import { HeroDemo } from '../components/HeroDemo'
import { Statement } from '../components/Statement'
import { WhoPicker } from '../components/WhoPicker'
const Silk = lazy(() => import('../components/Silk').then((m) => ({ default: m.Silk })))

type Mode = 'measure' | 'brand'

/** The brands named under the hero; the rest are one click away. */
const FEATURED = ['roadster', 'highlander', 'snitch', 'bewakoof', 'souled-store', 'allen-solly', 'wrogn', 'zara', 'hm', 'nike', 'adidas', 'puma', 'bata', 'campus', 'red-tape', 'woodland']
const FIRST_ROWS = 12

/* ---------- hero ---------- */

/** The hero arrives once on load: the h1 line by line out of masks, then the words under it. */
function Hero() {
  const reduce = useReducedMotion()
  const line = (i: number) =>
    reduce
      ? {}
      : { initial: { y: '105%' }, animate: { y: '0%' }, transition: { duration: 0.7, delay: 0.08 * i, ease: EASE_ENTER } }
  const after = (i: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.52, delay: 0.42 + 0.06 * i, ease: EASE_ENTER },
        }
  const settle = (delay = 0) =>
    reduce ? {} : { initial: { scale: 1.05 }, animate: { scale: 1 }, transition: { duration: 1.1, delay, ease: EASE_ENTER } }

  return (
    <section id="top" className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 pb-16 pt-8 md:px-8 md:pb-24 md:pt-14">
      <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-12 xl:gap-16">
        <div>
          <span className="block overflow-hidden">
            <motion.p {...line(0)} className="text-xs uppercase tracking-[0.18em] text-muted">
              Size comparison for {BRANDS.length} brands
            </motion.p>
          </span>
          <h1 className="mt-6 font-display text-[clamp(52px,14vw,104px)] leading-[0.92] tracking-[-0.02em] lg:text-[clamp(64px,7.4vw,124px)]">
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span {...line(1)} className="block">
                Same you,
              </motion.span>
            </span>{' '}
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span {...line(2)} className="block">
                every <em className="text-oxblood">brand.</em>
              </motion.span>
            </span>
          </h1>
          <motion.p {...after(0)} className="mt-8 max-w-[460px] text-[17px] leading-relaxed text-muted">
            A medium in one store is a small in the next. Give naapo one measurement, or a size that already fits,
            and see the label to pick at every other brand, for men, women, boys, girls and little kids.
          </motion.p>
          <motion.div {...after(1)} className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <ActionLink href="/#finder" />
            <Link href="/#brands" className="link-underline inline-flex min-h-11 items-center text-[15px] text-ink">
              Browse brands
            </Link>
          </motion.div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[CATEGORIES[1], CATEGORIES[0]].map((c, i) => (
              <figure key={c.id} className={`overflow-hidden rounded-[6px] bg-sand ${i === 1 ? 'mt-14' : ''}`}>
                <motion.img
                  {...settle(i * 0.08)}
                  src={photoSrc(c.image)}
                  srcSet={photoSet(c.image)}
                  sizes="(min-width: 1024px) 260px, (min-width: 640px) 45vw, 50vw"
                  width={900}
                  height={1200}
                  fetchPriority="high"
                  alt={c.alt}
                  className="aspect-[3/4] w-full object-cover"
                />
              </figure>
            ))}
          </div>
          <motion.div {...after(2)} className="mt-4 sm:absolute sm:inset-x-6 sm:-bottom-10 sm:mt-0 lg:inset-x-10">
            <HeroDemo />
          </motion.div>
        </div>
      </div>

      <div className="mt-16 border-t border-line pt-6">
        <ul className="flex flex-wrap gap-x-7 gap-y-1 text-sm text-muted" aria-label="Some of the brands compared">
          {FEATURED.map((id) => {
            const b = BRANDS.find((x) => x.id === id)!
            return (
              <li key={b.id}>
                <Link href={`/brands/${b.id}`} className="link-underline -mx-1 inline-flex min-h-10 min-w-10 items-center justify-center px-1 hover:text-ink">
                  {b.name}
                </Link>
              </li>
            )
          })}
          <li>
            <Link href="/#brands" className="link-underline inline-flex min-h-9 items-center text-ink">
              and {BRANDS.length - FEATURED.length} more
            </Link>
          </li>
        </ul>
      </div>
    </section>
  )
}

/* ---------- who ---------- */

const TILES: { photo: Category; title: string; groups: Category[] }[] = [
  { photo: 'women', title: 'Women', groups: ['women'] },
  { photo: 'men', title: 'Men', groups: ['men'] },
  { photo: 'girls', title: 'Girls', groups: ['girls', 'kidsGirls'] },
  { photo: 'boys', title: 'Boys', groups: ['boys', 'kidsBoys'] },
]

function CategoryTiles({ onPick }: { onPick: (c: Category) => void }) {
  return (
    <section className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 pb-24 md:px-8 md:pb-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="font-display text-[40px] leading-none tracking-tight md:text-[56px]">Shop by who</h2>
        <p className="max-w-[320px] text-sm text-muted">
          Adults compare by body measurements. Kids compare by height, in two bands: 2 to 7 and 8 to 14.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-4 md:gap-x-4">
        {TILES.map((t, i) => {
          const c = categoryInfo(t.photo)
          return (
            <div key={t.title} className="group">
              <button
                onClick={() => onPick(t.groups[0])}
                className="block w-full text-left transition-transform duration-[180ms] ease-out hover:-translate-y-0.5"
              >
                <div className="overflow-hidden rounded-[6px] bg-sand">
                  <img
                    src={photoSrc(c.image)}
                    srcSet={photoSet(c.image)}
                    sizes="(min-width: 1240px) 290px, (min-width: 768px) 24vw, 48vw"
                    width={900}
                    height={1200}
                    alt={c.alt}
                    loading="lazy"
                    className="aspect-[3/4] w-full object-cover transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03] group-hover:duration-[600ms]"
                  />
                </div>
                <div className="mt-4 flex items-baseline justify-between">
                  <span className="link-underline font-display text-[28px] leading-none">{t.title}</span>
                  <span aria-hidden className="text-xs tabular-nums text-muted">0{i + 1}</span>
                </div>
              </button>
              {t.groups.length > 1 ? (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {t.groups.map((g) => (
                    <button
                      key={g}
                      onClick={() => onPick(g)}
                      className="min-h-9 rounded-full border border-line px-3 text-xs transition-colors duration-150 hover:border-ink"
                    >
                      {categoryInfo(g).short === t.title ? `${t.title} ${categoryInfo(g).ages}` : `Kids ${categoryInfo(g).ages}`}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-1.5 text-sm text-muted">{c.caption}</p>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

/* ---------- brands ---------- */

type KindFilter = 'all' | BrandKind
type AudienceFilter = 'all' | Audience

const FIRST_BRANDS = 24

function BrandGrid() {
  const [query, setQuery] = useState('')
  const [kind, setKind] = useState<KindFilter>('all')
  const [who, setWho] = useState<AudienceFilter>('all')
  const [all, setAll] = useState(false)

  const q = query.trim().toLowerCase()
  const found = BRANDS.filter(
    (b) =>
      (kind === 'all' || b.kinds.includes(kind)) &&
      (who === 'all' || b.audience.includes(who)) &&
      (!q || b.name.toLowerCase().includes(q) || b.origin.toLowerCase().includes(q)),
  ).sort((a, b) => a.name.localeCompare(b.name))
  const filtering = q !== '' || kind !== 'all' || who !== 'all'
  const shown = all || filtering ? found : found.slice(0, FIRST_BRANDS)

  return (
    <section id="brands" className="scroll-mt-16 border-t border-line">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{BRANDS.length} brands</p>
            <h2 className="mt-4 font-display text-[44px] leading-[0.95] tracking-tight md:text-[64px]">
              Every chart, one brand at a time
            </h2>
          </div>
          <p className="max-w-[340px] text-[15px] text-muted">
            Clothing and footwear labels, Indian and international. Open one for its full size charts and to turn a
            size you wear elsewhere into its size.
          </p>
        </div>

        <div className="mt-10 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
          <label className="relative block">
            <span className="sr-only">Search brands</span>
            <svg aria-hidden width="16" height="16" viewBox="0 0 16 16" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted">
              <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search a brand, like Snitch or Bata"
              className="min-h-12 w-full rounded-full border border-line bg-paper pl-11 pr-4 text-[16px] outline-none transition-[border-color,box-shadow] duration-[140ms] placeholder:text-muted/80 focus:border-ink focus:shadow-[0_0_0_3px_var(--color-sand)]"
            />
          </label>
          <Segmented<KindFilter>
            label="Brand type"
            value={kind}
            onChange={setKind}
            options={[
              { value: 'all', label: 'All' },
              { value: 'clothing', label: 'Clothing' },
              { value: 'footwear', label: 'Footwear' },
            ]}
          />
          <Segmented<AudienceFilter>
            label="Made for"
            value={who}
            onChange={setWho}
            options={[
              { value: 'all', label: 'All' },
              { value: 'men', label: 'Men' },
              { value: 'women', label: 'Women' },
              { value: 'kids', label: 'Kids' },
            ]}
          />
        </div>

        <p className="mt-6 text-sm text-muted" aria-live="polite">
          {found.length === BRANDS.length ? `${BRANDS.length} brands` : `${found.length} of ${BRANDS.length} brands`}
        </p>

        {found.length ? (
          <ul className="mt-4 grid grid-cols-1 gap-2.5 min-[480px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {shown.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/brands/${b.id}`}
                  className="group flex h-full flex-col rounded-[10px] border border-line bg-paper p-4 transition-[transform,border-color,box-shadow] duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-ink/40 hover:shadow-[0_12px_24px_-16px_rgba(27,25,22,0.25)] md:p-5"
                >
                  <div className="flex items-start gap-3">
                    <BrandLogo brand={b} size="md" />
                    <div className="min-w-0 flex-1">
                      <span className="block font-display text-[22px] leading-[1.05] md:text-[24px]">{b.name}</span>
                      <p className="mt-1 text-xs text-muted">{b.origin}</p>
                    </div>
                    <span className="mt-0.5 shrink-0 text-muted transition-colors group-hover:text-ink">
                      <Arrow />
                    </span>
                  </div>
                  <div className="mt-auto flex flex-wrap gap-1 pt-5">
                    {b.kinds.map((k) => (
                      <span key={k} className="rounded-full bg-sand px-2 py-0.5 text-[11px] capitalize">
                        {k}
                      </span>
                    ))}
                    <span className="px-1 py-0.5 text-[11px] text-muted">
                      {b.audience.map((a) => AUDIENCE_LABEL[a]).join(' · ')}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 rounded-[10px] border border-dashed border-line p-6 text-muted">
            No brand matches “{query}”. Try another spelling, or{' '}
            <a href={TRIVASITE_ABOUT} target="_blank" rel="noopener" className="link-underline text-ink">
              ask us to add it
            </a>
            .
          </p>
        )}

        {!filtering && found.length > FIRST_BRANDS && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setAll((a) => !a)}
              aria-expanded={all}
              className="min-h-12 rounded-full border border-ink px-6 text-sm transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-ink hover:text-paper active:translate-y-px active:scale-[0.985]"
            >
              {all ? 'Show fewer brands' : `Show all ${found.length} brands`}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ---------- finder ---------- */

type FinderState = {
  cat: Category
  setCat: (c: Category) => void
  garment: Garment
  setGarment: (g: Garment) => void
  unit: Unit
  setUnit: (u: Unit) => void
  m: number
}

function Finder({
  state,
  mode,
  setMode,
  value,
  setValue,
  refBrand,
  setRefBrand,
  refSize,
  setRefSize,
}: {
  state: FinderState
  mode: Mode
  setMode: (m: Mode) => void
  value: number
  setValue: (v: number) => void
  refBrand: string
  setRefBrand: (b: string) => void
  refSize: number
  setRefSize: (i: number) => void
}) {
  const { cat, setCat, garment, setGarment, unit, setUnit, m } = state
  const measure = measureFor(cat, garment)
  const isShoe = isFootwear(garment)
  const digits = isShoe ? 1 : 0
  const [allRows, setAllRows] = useState(false)

  const rows = useMemo(
    () =>
      BRANDS.flatMap((b) => {
        const chart = brandChart(b, cat, garment)
        if (!chart) return []
        return [{ brand: b, chart, ...matchSize(chart, m) }]
      }),
    [cat, garment, m],
  )

  const available = rows.map((r) => r.brand)
  const refChart = useMemo(() => {
    const b = BRANDS.find((x) => x.id === refBrand)
    return b ? brandChart(b, cat, garment) : null
  }, [refBrand, cat, garment])

  const pct = ((value - measure.min) / (measure.max - measure.min)) * 100
  const info = categoryInfo(cat)

  return (
    <section id="finder" className="scroll-mt-16 border-t border-line bg-cream">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Size finder</p>
        <h2 className="mt-4 font-display text-[44px] leading-[0.95] tracking-tight md:text-[64px]">Find your size</h2>

        <div className="mt-12 grid gap-10 lg:grid-cols-[340px_1fr] lg:gap-10 xl:grid-cols-[400px_1fr] xl:gap-14">
          <div className="lg:self-start">
            <div className="space-y-8 rounded-[10px] border border-line bg-paper p-5 md:p-7">
              <Field label="Who is it for">
                <WhoPicker value={cat} onChange={setCat} />
              </Field>

              <Field label="What are you buying">
                <GarmentPicker garments={GARMENTS[cat]} value={garment} onChange={setGarment} />
              </Field>

              <Field label="Start from">
                <Segmented
                  label="Mode"
                  value={mode}
                  onChange={setMode}
                  options={[
                    { value: 'measure', label: 'Measurements' },
                    { value: 'brand', label: 'A size I wear' },
                  ]}
                />
              </Field>

              {mode === 'measure' ? (
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.14em] text-muted">{measure.label}</span>
                    <UnitToggle unit={unit} setUnit={setUnit} />
                  </div>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <button
                      aria-label={`Decrease ${measure.label.toLowerCase()}`}
                      onClick={() => setValue(Math.max(measure.min, +(value - measure.step).toFixed(1)))}
                      className="size-11 shrink-0 rounded-full border border-line text-lg transition-[border-color,transform] duration-150 hover:border-ink active:scale-95"
                    >
                      −
                    </button>
                    <div className="text-center" aria-live="polite">
                      <span className="font-display text-[56px] leading-none tabular-nums sm:text-[64px]">
                        <SlideText value={fmt(value, unit, digits)} order={value} />
                      </span>
                      <span className="ml-1.5 text-muted">{unit}</span>
                    </div>
                    <button
                      aria-label={`Increase ${measure.label.toLowerCase()}`}
                      onClick={() => setValue(Math.min(measure.max, +(value + measure.step).toFixed(1)))}
                      className="size-11 shrink-0 rounded-full border border-line text-lg transition-[border-color,transform] duration-150 hover:border-ink active:scale-95"
                    >
                      +
                    </button>
                  </div>
                  <input
                    type="range"
                    aria-label={measure.label}
                    min={measure.min}
                    max={measure.max}
                    step={measure.step}
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    className="range mt-3 w-full"
                    style={{ ['--pct' as string]: `${pct}%` }}
                  />
                  <div className="mt-2 flex justify-between text-xs tabular-nums text-muted">
                    <span>{fmt(measure.min, unit, digits)}</span>
                    <span>{fmt(measure.max, unit, digits)}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <Field label="Brand you know" htmlFor="ref-brand">
                    <BrandSelect
                      id="ref-brand"
                      value={available.some((b) => b.id === refBrand) ? refBrand : ''}
                      onChange={setRefBrand}
                      brands={available}
                    />
                  </Field>
                  {refChart && (
                    <Field label="Size that fits you there">
                      <Chips
                        label="Size"
                        small
                        value={String(refSize)}
                        onChange={(v) => setRefSize(Number(v))}
                        options={refChart.map((r, i) => ({ value: String(i), label: stripSystem(r.label) }))}
                      />
                    </Field>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-ink pb-4">
              <h3 className="font-display text-[28px] leading-none">Your size at {rows.length} brands</h3>
              <p className="text-sm text-muted">
                {info.label}
                {info.ages ? ` ${info.ages}` : ''} · {GARMENT_LABEL[garment]} · {measure.label.toLowerCase()}{' '}
                {fmt(m, unit, digits)} {unit}
              </p>
            </div>
            <ul key={`${cat}-${garment}`}>
              {(allRows ? rows : rows.slice(0, FIRST_ROWS)).map((r, i) => {
                const size = r.chart[r.index]
                const tendency = fitTendency(r.brand, garment)
                return (
                  <li
                    key={r.brand.id}
                    className="row-in grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-3 border-b border-line py-5 sm:gap-x-6 md:grid-cols-[1.1fr_1.4fr_auto] lg:grid-cols-[1fr_auto] xl:grid-cols-[1.1fr_1.4fr_auto]"
                    style={{ animationDelay: `${i * 30}ms` }}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <BrandLogo brand={r.brand} size="sm" className="mt-0.5" />
                      <div className="min-w-0">
                      <Link
                        href={`/brands/${r.brand.id}?for=${cat}`}
                        className="link-underline inline-flex min-h-10 items-center font-display text-[22px] leading-tight sm:text-[24px]"
                      >
                        {r.brand.name}
                      </Link>
                      <p className="mt-1 text-xs text-muted">
                        {r.brand.origin} ·{' '}
                        <span
                          className={
                            tendency === 'Runs small' ? 'text-oxblood' : tendency === 'Runs large' ? 'text-olive' : ''
                          }
                        >
                          {tendency}
                        </span>
                      </p>
                      </div>
                    </div>

                    <div className="order-3 col-span-2 flex flex-wrap gap-1 md:order-none md:col-span-1 lg:order-3 lg:col-span-2 xl:order-none xl:col-span-1">
                      {r.chart.map((s, si) => {
                        if (Math.abs(si - r.index) > (isShoe ? 3 : 6)) return null
                        const on = si === r.index
                        return (
                          <span
                            key={s.label}
                            className={`relative rounded-[4px] px-2 py-1 text-[11px] tabular-nums transition-colors duration-200 ${
                              on
                                ? 'text-paper'
                                : r.status === 'between' && si === r.index + 1
                                  ? 'bg-sand text-ink'
                                  : 'text-muted'
                            }`}
                          >
                            {on && (
                              <motion.span
                                layoutId={`strip-${r.brand.id}`}
                                aria-hidden
                                className="absolute inset-0 rounded-[4px] bg-ink"
                                transition={SLIDE}
                              />
                            )}
                            <span className="relative">{stripSystem(s.label)}</span>
                          </span>
                        )
                      })}
                    </div>

                    <div className="text-right">
                      <p className="font-display text-[30px] leading-none tabular-nums sm:text-[34px]">
                        <SlideText value={size.label} order={r.index} />
                      </p>
                      <p className="mt-1.5 text-xs text-muted">
                        {r.status === 'between'
                          ? `Between sizes, try ${r.chart[r.index + 1].label} for room`
                          : r.status === 'below'
                            ? 'Smallest size available'
                            : r.status === 'above'
                              ? 'Largest size available'
                              : (size.sub ?? `${fmt(size.min, unit, 0)}–${fmt(size.max, unit, 0)} ${unit}`)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ul>
            {rows.length > FIRST_ROWS && (
              <button
                onClick={() => setAllRows((a) => !a)}
                aria-expanded={allRows}
                className="mt-6 min-h-11 rounded-full border border-ink px-5 text-sm transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-ink hover:text-paper active:translate-y-px active:scale-[0.985]"
              >
                {allRows ? 'Show fewer brands' : `Show all ${rows.length} brands`}
              </button>
            )}
            <p className="mt-6 max-w-[560px] text-xs leading-relaxed text-muted">
              Sizes are based on each brand's published charts and typical fit. Cuts vary by collection, so treat
              this as a strong starting point and check the product page before you buy.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

/* ---------- charts ---------- */

function Charts({ state }: { state: FinderState }) {
  const { cat, setCat, garment, setGarment, unit, m } = state
  const base = baseChart(cat, garment)
  const measure = measureFor(cat, garment)
  const isShoe = isFootwear(garment)
  const [allRows, setAllRows] = useState(false)
  const brands = BRANDS.flatMap((b) => {
    const chart = brandChart(b, cat, garment)
    return chart ? [{ b, chart }] : []
  })
  // footwear: one column per foot length, each brand's size for it in the cell
  const column = base.findIndex((s) => m >= s.min && m < s.max)

  return (
    <section id="charts" className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] scroll-mt-16 px-5 py-20 md:px-8 md:py-28">
      <div className="grid gap-8 xl:grid-cols-[1fr_460px] xl:items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Side by side</p>
          <h2 className="mt-4 font-display text-[44px] leading-[0.95] tracking-tight md:text-[64px]">Size charts</h2>
          <p className="mt-4 max-w-[460px] text-[15px] text-muted">
            {isShoe
              ? `Each brand's size for every foot length, in its own size system. The finder's foot length is marked.`
              : `Each brand's size for every ${measure.label.toLowerCase()} band. The finder's measurement is marked.`}
          </p>
        </div>
        <div className="max-w-[640px] space-y-3 xl:max-w-none">
          <WhoPicker value={cat} onChange={setCat} compact />
          <GarmentPicker garments={GARMENTS[cat]} value={garment} onChange={setGarment} label="Chart garment" small />
        </div>
      </div>

      <motion.div
        layoutScroll
        data-lenis-prevent-horizontal
        className="mt-10 overflow-x-auto rounded-[10px] border border-line"
        tabIndex={0}
        role="region"
        aria-label={`${measure.label} chart, scrolls sideways`}
      >
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-cream">
              <th className="sticky left-0 z-20 bg-cream px-4 py-3 text-left text-xs font-normal uppercase tracking-[0.12em] text-muted">
                Brand
              </th>
              {base.map((s) => (
                <th key={s.label} className="whitespace-nowrap px-3 py-3 text-center font-medium tabular-nums">
                  {isShoe ? (
                    `${fmt((s.min + s.max) / 2, unit, 1)} ${unit}`
                  ) : (
                    <>
                      {fmt(s.min, unit, 0)}–{fmt(s.max, unit, 0)}
                      <span className="block text-[10px] font-normal text-muted">{unit}</span>
                    </>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(allRows ? brands : brands.slice(0, FIRST_ROWS)).map(({ b, chart }) => (
              <tr key={b.id} className="border-t border-line">
                <th
                  scope="row"
                  className="sticky left-0 z-20 whitespace-nowrap bg-paper px-4 py-3 text-left font-display text-[18px] font-normal"
                >
                  <Link href={`/brands/${b.id}?for=${cat}`} className="flex min-h-10 items-center gap-2.5">
                    <BrandLogo brand={b} size="xs" />
                    <span className="link-underline">{b.name}</span>
                  </Link>
                </th>
                {base
                  .map((s, i) => {
                    const size = chart[matchSize(chart, (s.min + s.max) / 2).index]
                    return { key: s.label, on: i === column, text: stripSystem(size.label) }
                  })
                  .map((c) => (
                  <td
                    key={c.key}
                    className={`relative whitespace-nowrap px-3 py-3 text-center text-xs tabular-nums transition-colors duration-200 ${
                      c.on ? 'text-paper' : 'text-muted'
                    }`}
                  >
                    {c.on && (
                      <motion.span
                        layoutId={`cell-${b.id}`}
                        aria-hidden
                        className="absolute inset-0 bg-oxblood"
                        transition={SLIDE}
                      />
                    )}
                    <span className="relative">{c.text.replace(/^UK /, `${systemName('UK')} `)}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
      {brands.length > FIRST_ROWS && (
        <button
          onClick={() => setAllRows((a) => !a)}
          aria-expanded={allRows}
          className="mt-6 min-h-11 rounded-full border border-ink px-5 text-sm transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-ink hover:text-paper active:translate-y-px active:scale-[0.985]"
        >
          {allRows ? 'Show fewer brands' : `Show all ${brands.length} brands`}
        </button>
      )}
    </section>
  )
}

/* ---------- guide, steps, close ---------- */

function Guide() {
  const items = [
    ['Chest / Bust', 'Wrap the tape around the fullest part, under the arms, keeping it level across the back.'],
    ['Waist', 'Measure around your natural waist, just above the belly button. Keep one finger under the tape.'],
    ['Foot length', 'Stand on paper, heel to a wall. Mark the longest toe and measure. Do it in the evening.'],
    ['Height (kids)', 'Back against a wall, no shoes, heels together. Mark the top of the head with a flat book.'],
  ]
  return (
    <section id="guide" className="scroll-mt-16 bg-ink text-paper">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-20 md:px-8 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-paper/60">Guide</p>
            <h2 className="mt-4 font-display text-[44px] leading-[0.95] tracking-tight md:text-[64px]">How to measure</h2>
          </div>
          <ActionLink href="/#finder" dark={false} />
        </div>
        <div className="mt-14 grid gap-px overflow-hidden rounded-[10px] bg-paper/15 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([t, d], i) => (
            <div key={t} className="bg-ink p-6 md:p-8">
              <p className="text-xs tabular-nums text-paper/50">0{i + 1}</p>
              <MeasureGlyph kind={i} />
              <p className="mt-8 font-display text-[28px] leading-none">{t}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-paper/70">{d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Small still line diagrams of where the tape goes. */
function MeasureGlyph({ kind }: { kind: number }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25, strokeLinecap: 'round' as const }
  const tape = { ...common, stroke: '#c9664f', strokeWidth: 2 }
  return (
    <svg viewBox="0 0 96 64" width="96" height="64" aria-hidden className="mt-8 text-paper/60">
      {kind === 0 && (
        <>
          <path {...common} d="M30 6c4 6 10 8 18 8s14-2 18-8M26 10l-8 18 8 4M70 10l8 18-8 4M30 22v38M66 22v38" />
          <ellipse {...tape} cx="48" cy="28" rx="19" ry="5" />
        </>
      )}
      {kind === 1 && (
        <>
          <path {...common} d="M32 4c-2 14 2 22 2 30s-4 16-4 26M64 4c2 14-2 22-2 30s4 16 4 26" />
          <ellipse {...tape} cx="48" cy="32" rx="15" ry="4" />
        </>
      )}
      {kind === 2 && (
        <>
          <path {...common} d="M14 6v52M14 50h70" />
          <path {...common} d="M16 46c0-6 4-10 14-10h30c10 0 18 2 20 6s-4 6-10 6H16z" />
          <path {...tape} d="M16 58h64M16 55v6M80 55v6" />
        </>
      )}
      {kind === 3 && (
        <>
          <path {...common} d="M20 4v58M20 62h60" />
          <circle {...common} cx="52" cy="22" r="6" />
          <path {...common} d="M52 28v18M52 46l-6 16M52 46l6 16M44 34h16" />
          <path {...tape} d="M28 14h40M28 14v48" />
        </>
      )}
    </svg>
  )
}

function HowItWorks() {
  const steps = [
    ['Choose who', 'Female or male, then the age group. Then what you are buying, from kurtis and jeans to sneakers.'],
    ['Add one number', 'Enter a measurement, or tell us a size that already fits you somewhere.'],
    ['Shop anywhere', 'See the matching label at every brand, plus who runs small or large.'],
  ]
  return (
    <section className="border-b border-line">
      <div className="mx-auto grid max-w-[1240px] 2xl:max-w-[1400px] gap-12 px-5 py-20 md:grid-cols-[1fr_2fr] md:px-8 md:py-28">
        <h2 className="font-display text-[44px] leading-[0.95] tracking-tight md:text-[56px]">
          Three steps,
          <br />
          <em className="text-oxblood">no guessing.</em>
        </h2>
        <ol className="grid gap-10 sm:grid-cols-3">
          {steps.map(([t, d], i) => (
            <li key={t}>
              <p aria-hidden className="font-display text-[56px] leading-none text-[#958a77]">0{i + 1}</p>
              <p className="mt-6 text-[17px] font-medium">{t}</p>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

/** Closing band: satin in oxblood (three.js), mounted only as it comes near. */
function CloseBand() {
  const ref = useRef<HTMLElement>(null)
  const [near, setNear] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '900px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  const still = <div aria-hidden className="absolute inset-0 bg-[#5e2219]" />
  return (
    <section ref={ref} className="relative isolate overflow-hidden bg-oxblood text-paper">
      {near ? (
        <Suspense fallback={still}>
          <Silk calmAt={[0.28, 0.5]} />
        </Suspense>
      ) : (
        still
      )}
      <div className="relative mx-auto flex min-h-[72svh] max-w-[1240px] 2xl:max-w-[1400px] flex-col justify-center px-5 py-24 md:px-8">
        <p className="text-xs uppercase tracking-[0.18em] text-paper/70">One number, {BRANDS.length} brands</p>
        <h2 className="mt-5 max-w-[720px] font-display text-[clamp(48px,12vw,96px)] leading-[0.92] tracking-[-0.02em]">
          Measure once, <em>shop anywhere.</em>
        </h2>
        <p className="mt-6 max-w-[440px] text-[17px] leading-relaxed text-paper/80">
          Takes a tape measure and about a minute. No account, nothing saved.
        </p>
        <div className="mt-10">
          <ActionLink href="/#finder" dark={false} />
        </div>
      </div>
    </section>
  )
}

/* ---------- page ---------- */

const CATEGORY_IDS = CATEGORIES.map((c) => c.id)

export default function Home() {
  const { search } = useLocation()
  const asked = new URLSearchParams(search).get('for') as Category | null
  const [cat, setCatRaw] = useState<Category>(asked && CATEGORY_IDS.includes(asked) ? asked : 'women')
  const [garment, setGarmentRaw] = useState<Garment>('tshirts')
  const [unit, setUnit] = useState<Unit>('cm')
  const [mode, setMode] = useState<Mode>('measure')
  const [value, setValue] = useState(measureFor(cat, 'tshirts').initial)
  const [refBrand, setRefBrand] = useState('zara')
  const [refSize, setRefSize] = useState(2)

  usePageEntry('home')
  useEffect(() => setMeta({ path: '/' }), [])

  const resetFor = (c: Category, g: Garment) => {
    setValue(measureFor(c, g).initial)
    const chart = baseChart(c, g)
    setRefSize(Math.floor(chart.length / 2) - (isFootwear(g) ? 0 : 1))
  }

  const setCat = (c: Category) => {
    const g = GARMENTS[c].includes(garment) ? garment : GARMENTS[c][0]
    setCatRaw(c)
    setGarmentRaw(g)
    resetFor(c, g)
  }
  const setGarment = (g: Garment) => {
    setGarmentRaw(g)
    resetFor(cat, g)
  }

  // a footer link like /?for=kidsGirls#finder picks the group
  useEffect(() => {
    if (asked && CATEGORY_IDS.includes(asked) && asked !== cat) setCat(asked)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asked])

  const m = useMemo(() => {
    if (mode === 'measure') return value
    const b = BRANDS.find((x) => x.id === refBrand)
    const chart = b && brandChart(b, cat, garment)
    if (!chart) return value
    const r = chart[Math.min(refSize, chart.length - 1)]
    return (r.min + r.max) / 2
  }, [mode, value, refBrand, refSize, cat, garment])

  const state: FinderState = { cat, setCat, garment, setGarment, unit, setUnit, m }

  const goCategory = (c: Category) => {
    setCat(c)
    if (window.location.search) navigate('/', { replace: true })
    scrollToId('finder')
  }

  return (
    <main id="main">
      <Hero />
      <CategoryTiles onPick={goCategory} />
      <BrandGrid />
      <Statement
        label="Why sizes differ"
        parts={[
          { text: 'Zara cuts a medium top for a bust up to 92 cm. At Gap, the same M runs to 96.' },
          { text: 'naapo reads every chart, so one measurement lands on' },
          { text: 'the right label', accent: true },
          { text: `across ${BRANDS.length} brands.` },
        ]}
      />
      <Finder
        state={state}
        mode={mode}
        setMode={setMode}
        value={value}
        setValue={setValue}
        refBrand={refBrand}
        setRefBrand={setRefBrand}
        refSize={refSize}
        setRefSize={setRefSize}
      />
      <Charts state={state} />
      <Guide />
      <HowItWorks />
      <CloseBand />
    </main>
  )
}
