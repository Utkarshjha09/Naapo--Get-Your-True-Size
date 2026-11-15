import { useEffect, useMemo, useState } from 'react'
import { m, useReducedMotion } from 'motion/react'
import {
  APPAREL,
  AUDIENCE_LABEL,
  BRANDS,
  CATEGORIES,
  FOOTWEAR,
  FAMILIES,
  FAMILY_LABEL,
  GARMENT_LABEL,
  brandChart,
  familyOf,
  brandGarments,
  categoryInfo,
  convertSize,
  fitTendency,
  isFootwear,
  isKids,
  matchSize,
  measureFor,
  officialChart,
  systemName,
  type Brand,
  type Category,
  type Garment,
  type Range,
  type Tendency,
} from '../data'
import { Link, setQuery, useLocation, usePageEntry } from '../lib/router'
import { setMeta } from '../lib/meta'
import { EASE_ENTER, SlideText } from '../components/primitives'
import { ActionLink, Field, UnitToggle, fmt, stripSystem, type Unit } from '../components/Layout'
import { WhoPicker } from '../components/WhoPicker'
import { GarmentPicker } from '../components/GarmentPicker'
import { BrandSelect } from '../components/BrandSelect'
import { BrandLogo } from '../components/BrandLogo'
import { NotFound } from '../components/NotFound'

const ORDER: Garment[] = [...APPAREL, ...FOOTWEAR]
const tendencyTone = (t: Tendency) => (t === 'Runs small' ? 'text-oxblood' : t === 'Runs large' ? 'text-olive' : 'text-ink')
const listWords = (words: string[]) =>
  words.length < 2 ? words.join('') : `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}`

/* ---------- size chart card ---------- */

/** One chart. Footwear that shares a chart (every half-size style) is listed under one card. */
function SizeTable({
  brand,
  cat,
  g,
  title,
  styles,
  unit,
}: {
  brand: Brand
  cat: Category
  g: Garment
  title: string
  styles?: Garment[]
  unit: Unit
}) {
  const chart = brandChart(brand, cat, g)!
  const measure = measureFor(cat, g)
  const isShoe = isFootwear(g)
  const digits = isShoe ? 1 : 0
  // shoes carry their other size systems; socks carry the shoe sizes they fit
  const hasSystems = !!chart[0]?.systems
  const showSub = !hasSystems && chart.some((r) => r.sub) && (g === 'socks' || !isKids(cat))
  const tendency = fitTendency(brand, g)
  const own = brand.shoeSystem ?? 'EU'
  const others = (['US', 'UK', 'EU'] as const).filter((s) => s !== own)

  return (
    <article className="flex min-w-0 flex-col rounded-[10px] border border-line bg-paper">
      <header className="border-b border-line px-5 py-4 md:px-6">
        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h3 className="font-display text-[26px] leading-none">{title}</h3>
          <p className={`text-xs ${tendencyTone(tendency)}`}>{tendency}</p>
        </div>
        {styles && styles.length > 0 && (
          <p className="mt-2 text-xs text-muted">{styles.map((s) => GARMENT_LABEL[s]).join(' · ')}</p>
        )}
        <SourceBadge brand={brand} cat={cat} g={g} />
      </header>
      <div className="overflow-x-auto" data-lenis-prevent-horizontal>
        <table className="w-full border-collapse text-sm">
          <caption className="sr-only">
            {brand.name} {title} sizes by {measure.label.toLowerCase()}
          </caption>
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-[0.12em] text-muted">
              <th scope="col" className="px-5 py-3 font-normal md:px-6">
                {hasSystems ? systemName(own) : 'Size'}
              </th>
              {showSub && (
                <th scope="col" className="px-3 py-3 font-normal">
                  {g === 'socks' ? 'Fits shoe' : 'Also'}
                </th>
              )}
              {hasSystems &&
                others.map((s) => (
                  <th key={s} scope="col" className="whitespace-nowrap px-3 py-3 font-normal">
                    {systemName(s)}
                  </th>
                ))}
              <th scope="col" className="px-5 py-3 text-right font-normal md:px-6">
                {measure.label} ({unit})
              </th>
            </tr>
          </thead>
          <tbody>
            {chart.map((r) => (
              <tr key={r.label} className="border-t border-line">
                <th scope="row" className="whitespace-nowrap px-5 py-2.5 text-left font-medium tabular-nums md:px-6">
                  {stripSystem(r.label)}
                </th>
                {showSub && <td className="px-3 py-2.5 tabular-nums text-muted">{r.sub ?? '—'}</td>}
                {hasSystems &&
                  others.map((s) => (
                    <td key={s} className="whitespace-nowrap px-3 py-2.5 tabular-nums text-muted">
                      {r.systems?.[s]}
                    </td>
                  ))}
                <td className="whitespace-nowrap px-5 py-2.5 text-right tabular-nums text-muted md:px-6">
                  {fmt(r.min, unit, digits)}–{fmt(r.max, unit, digits)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </article>
  )
}

/** Where a chart's numbers come from: the brand's own page, or naapo's estimate. */
function SourceBadge({ brand, cat, g }: { brand: Brand; cat: Category; g: Garment }) {
  const official = officialChart(brand, cat, g)
  return official ? (
    <span className="flex flex-col items-start">
    <a
      href={official.source}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2.5 inline-flex min-h-9 items-center gap-1.5 rounded-full bg-olive/10 px-3 text-[11px] text-olive transition-colors hover:bg-olive/20"
    >
      <svg aria-hidden width="10" height="10" viewBox="0 0 10 10"><path d="M1.5 5.2l2.2 2.2L8.5 2.6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
      Official {brand.name} chart · source ↗
    </a>
    {official.note && <span className="mt-1.5 text-[11px] text-muted">{official.note}</span>}
    </span>
  ) : (
    <p className="mt-2.5 inline-flex min-h-7 items-center rounded-full bg-sand px-2.5 text-[11px] text-muted">
      Estimated from typical fit
    </p>
  )
}

/** The cards for one group: one per clothing item, then footwear grouped by shared chart. */
function chartCards(brand: Brand, cat: Category) {
  const made = ORDER.filter((g) => brandGarments(brand, cat).includes(g))
  // garments that share exactly the same chart (labels and ranges) go on one card
  const groups = new Map<string, Garment[]>()
  for (const g of made) {
    const rows = brandChart(brand, cat, g)!
    const key = familyOf(g) + '|' + rows.map((r) => `${r.label}:${r.min.toFixed(1)}-${r.max.toFixed(1)}:${r.sub ?? ''}`).join(',')
    groups.set(key, [...(groups.get(key) ?? []), g])
  }
  return [...groups.values()].map((gs) => ({
    key: gs.join('-'),
    g: gs[0],
    title: gs.length === 1 ? GARMENT_LABEL[gs[0]] : gs.length <= 3 ? gs.map((g) => GARMENT_LABEL[g]).join(" · ") : FAMILY_LABEL[familyOf(gs[0])],
    styles: gs.length > 3 ? gs : undefined,
  }))
}

/* ---------- compare ---------- */

/** Two size ranges on one ruler, with the body measurement between them. */
function RangeRuler({
  rows,
  body,
  unit,
  digits,
}: {
  rows: { name: string; range: Range; tone: 'ink' | 'oxblood' }[]
  body: number
  unit: Unit
  digits: number
}) {
  const reduce = useReducedMotion()
  const lo = Math.min(...rows.map((r) => r.range.min), body)
  const hi = Math.max(...rows.map((r) => r.range.max), body)
  const pad = (hi - lo) * 0.35 || 1
  const a = lo - pad
  const b = hi + pad
  const pct = (v: number) => ((v - a) / (b - a)) * 100
  const ease = { duration: reduce ? 0 : 0.5, ease: EASE_ENTER }

  return (
    <div className="relative mt-8 pt-7" aria-hidden>
      <m.div
        className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-[11px] tabular-nums text-muted"
        animate={{ left: `${pct(body)}%` }}
        initial={false}
        transition={ease}
      >
        you · {fmt(body, unit, digits)} {unit}
      </m.div>
      <m.div className="absolute bottom-0 top-5 w-px bg-ink/40" animate={{ left: `${pct(body)}%` }} initial={false} transition={ease} />
      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.name} className="relative h-9 rounded-[6px] bg-sand/70">
            <m.div
              className={`absolute inset-y-0 flex items-center overflow-hidden rounded-[6px] px-2.5 text-xs text-paper ${
                r.tone === 'ink' ? 'bg-ink' : 'bg-oxblood'
              }`}
              initial={false}
              animate={{ left: `${pct(r.range.min)}%`, width: `${pct(r.range.max) - pct(r.range.min)}%` }}
              transition={ease}
            >
              <span className="truncate">
                {r.name} {stripSystem(r.range.label)}
              </span>
            </m.div>
          </div>
        ))}
      </div>
    </div>
  )
}

const FIRST_OTHERS = 12

function Compare({ brand, cat, unit }: { brand: Brand; cat: Category; unit: Unit }) {
  const garments = ORDER.filter((g) => brandGarments(brand, cat).includes(g))
  const [g, setG] = useState<Garment>(garments[0])
  const garment = garments.includes(g) ? g : garments[0]
  const [allOthers, setAllOthers] = useState(false)

  const others = BRANDS.filter((b) => b.id !== brand.id && brandChart(b, cat, garment)).sort((a, b) =>
    a.name.localeCompare(b.name),
  )
  const preferred = ['hm', 'zara', 'roadster', 'nike', 'bata', 'adidas']
  const [fromId, setFromId] = useState<string | null>(null)
  const from =
    others.find((b) => b.id === fromId) ?? others.find((b) => preferred.includes(b.id)) ?? others[0]

  const fromChart = from ? brandChart(from, cat, garment)! : null
  const middle = fromChart ? Math.floor(fromChart.length / 2) - (isFootwear(garment) ? 0 : 1) : 0
  const [fromIndex, setFromIndex] = useState<number | null>(null)
  const idx = fromChart ? Math.max(0, Math.min(fromIndex ?? middle, fromChart.length - 1)) : 0

  // a new garment, group or brand starts again from the middle size
  useEffect(() => setFromIndex(null), [garment, cat, from?.id])

  const result = from ? convertSize(from, brand, cat, garment, idx) : null
  const measure = measureFor(cat, garment)
  const digits = isFootwear(garment) ? 1 : 0
  const gName = GARMENT_LABEL[garment].toLowerCase()

  const everywhere = useMemo(() => {
    if (!result) return []
    return others.flatMap((b) => {
      const chart = brandChart(b, cat, garment)
      if (!chart) return []
      const { index } = matchSize(chart, result.body)
      return [{ b, label: chart[index].label, index }]
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result?.body, brand.id, cat, garment])

  if (!from || !fromChart || !result) {
    return (
      <p className="rounded-[10px] border border-dashed border-line p-6 text-muted">
        No other brand in naapo sizes {gName} for this group yet, so there is nothing to compare against.
      </p>
    )
  }

  const cut =
    result.relative === 'smaller'
      ? `${brand.name} cuts ${gName} smaller than ${from.name}`
      : result.relative === 'larger'
        ? `${brand.name} cuts ${gName} larger than ${from.name}`
        : `${brand.name} and ${from.name} cut ${gName} about the same`
  const fromLabel = stripSystem(result.fromSize.label)
  const toLabel = stripSystem(result.toSize.label)
  const sameSystem = result.fromSize.label.split(' ')[0] === result.toSize.label.split(' ')[0]
  const note =
    result.relative === 'unknown'
      ? `Your ${from.name} ${fromLabel} matches ${brand.name} ${result.toSize.label}, going by ${officialChart(brand, cat, garment) ? brand.name : from.name}'s official chart.`
      : sameSystem && fromLabel === toLabel
      ? `${cut}, so your usual ${fromLabel} ${result.relative === 'same' ? 'carries over' : 'still fits'}.`
      : `${cut}. Your ${from.name} ${fromLabel} matches ${brand.name} ${result.toSize.label}.`

  return (
    <div className="grid gap-6 lg:grid-cols-[400px_1fr] lg:gap-10">
      <div className="space-y-7 self-start rounded-[10px] border border-line bg-paper p-5 md:p-7">
        <Field label="What are you buying">
          <GarmentPicker garments={garments} value={garment} onChange={setG} label="Garment to compare" />
        </Field>
        <Field label="Brand you wear" htmlFor="compare-brand">
          <BrandSelect id="compare-brand" value={from.id} onChange={setFromId} brands={others} />
        </Field>
        <Field label={`Your ${from.name} size`}>
          <div role="radiogroup" aria-label={`${from.name} size`} className="flex flex-wrap gap-1.5">
            {fromChart.map((r, i) => (
              <button
                key={r.label}
                role="radio"
                aria-checked={i === idx}
                onClick={() => setFromIndex(i)}
                className={`min-h-9 min-w-11 rounded-full border px-3 text-xs tabular-nums transition-colors duration-200 ${
                  i === idx ? 'border-ink bg-ink text-paper' : 'border-line hover:border-ink'
                }`}
              >
                {stripSystem(r.label)}
              </button>
            ))}
          </div>
          {isFootwear(garment) && garment !== 'socks' && (
            <p className="mt-2 text-xs text-muted">{from.name} sizes in {systemName(from.shoeSystem ?? 'EU')}.</p>
          )}
        </Field>
      </div>

      <div className="min-w-0 rounded-[10px] bg-ink p-5 text-paper md:p-8">
        <p className="text-xs uppercase tracking-[0.14em] text-paper/60">
          Your {brand.name} {gName} size
        </p>
        <p className="mt-3 font-display text-[clamp(56px,14vw,104px)] leading-[0.9] tabular-nums" aria-live="polite">
          <SlideText value={result.toSize.label.replace(/^UK /, 'UK/India ')} order={result.index} />
        </p>
        <p className="mt-4 max-w-[540px] text-[15px] leading-relaxed text-paper/80">
          {result.status === 'between' ? (
            <>
              You sit near the top of {toLabel}. For room, take{' '}
              <span className="text-paper">{stripSystem(result.toChart[result.index + 1].label)}</span>.{' '}
            </>
          ) : result.status === 'below' ? (
            <>This is the smallest {brand.name} size. </>
          ) : result.status === 'above' ? (
            <>This is the largest {brand.name} size. </>
          ) : null}
          {note}
        </p>

        <div className="mt-6 rounded-[8px] bg-paper p-4 text-ink md:p-5">
          <p className="text-xs text-muted">
            {measure.label} range of each size, in {unit}
          </p>
          <RangeRuler
            body={result.body}
            unit={unit}
            digits={digits}
            rows={[
              { name: from.name, range: result.fromSize, tone: 'ink' },
              { name: brand.name, range: result.toSize, tone: 'oxblood' },
            ]}
          />
          <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-xs text-muted">
                {from.name} {fromLabel}
              </dt>
              <dd className="mt-1 tabular-nums">
                {fmt(result.fromSize.min, unit, digits)}–{fmt(result.fromSize.max, unit, digits)} {unit}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">
                {brand.name} {toLabel}
              </dt>
              <dd className="mt-1 tabular-nums">
                {fmt(result.toSize.min, unit, digits)}–{fmt(result.toSize.max, unit, digits)} {unit}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8">
          <p className="text-xs uppercase tracking-[0.14em] text-paper/60">
            The same fit at {everywhere.length} other brands
          </p>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 min-[420px]:grid-cols-2 xl:grid-cols-3">
            {(allOthers ? everywhere : everywhere.slice(0, FIRST_OTHERS)).map(({ b, label, index }) => (
              <li key={b.id} className="flex min-h-11 items-center justify-between gap-3 border-b border-paper/15 py-1.5 text-sm">
                <Link
                  href={`/brands/${b.id}?for=${cat}`}
                  className="flex min-h-10 min-w-0 items-center gap-2.5 text-paper/80 hover:text-paper"
                >
                  <BrandLogo brand={b} size="xs" className="border-paper/20" />
                  <span className="link-underline truncate">{b.name}</span>
                </Link>
                <span className="shrink-0 font-medium tabular-nums">
                  <SlideText value={label.replace(/^UK /, 'UK ')} order={index} />
                </span>
              </li>
            ))}
          </ul>
          {everywhere.length > FIRST_OTHERS && (
            <button
              onClick={() => setAllOthers((a) => !a)}
              aria-expanded={allOthers}
              className="mt-5 min-h-11 rounded-full border border-paper/40 px-5 text-sm transition-[background-color,color,transform] duration-150 hover:-translate-y-px hover:bg-paper hover:text-ink active:translate-y-px active:scale-[0.985]"
            >
              {allOthers ? 'Show fewer' : `Show all ${everywhere.length}`}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- page ---------- */

export default function BrandPage({ id }: { id: string }) {
  const brand = BRANDS.find((b) => b.id === id)
  const { search } = useLocation()
  usePageEntry(`brand-${id}`)

  const offered = brand ? CATEGORIES.map((c) => c.id).filter((c) => brandGarments(brand, c).length > 0) : []
  const asked = new URLSearchParams(search).get('for') as Category | null
  const [cat, setCatRaw] = useState<Category>(asked && offered.includes(asked) ? asked : (offered[0] ?? 'women'))
  const [unit, setUnit] = useState<Unit>('cm')

  const everything = brand ? ORDER.filter((g) => offered.some((c) => brandGarments(brand, c).includes(g))) : []
  const clothes = everything.filter((g) => !isFootwear(g))
  const shoes = everything.filter(isFootwear)

  useEffect(() => {
    if (!brand) return
    const what = listWords([
      ...(clothes.length ? ['clothing'] : []),
      ...(shoes.length ? ['footwear'] : []),
    ])
    setMeta({
      title: `${brand.name} size chart for ${what} · naapo`,
      description: `${brand.name} size chart for ${listWords(brand.audience.map((a) => AUDIENCE_LABEL[a].toLowerCase()))}: ${listWords(
        everything.map((g) => GARMENT_LABEL[g].toLowerCase()),
      )}. Convert your size from another brand to ${brand.name}.`,
      path: `/brands/${brand.id}`,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand?.id])

  if (!brand) return <NotFound path={`/brands/${id}`} brand />

  const setCat = (c: Category) => {
    setCatRaw(c)
    setQuery('for', c)
  }

  const info = categoryInfo(cat)
  const cards = chartCards(brand, cat)
  const groupWord = `${info.label.toLowerCase()}${info.ages ? ` (${info.ages})` : ''}`
  const similar = BRANDS.filter(
    (b) => b.id !== brand.id && b.kinds.some((k) => brand.kinds.includes(k)) && b.audience.some((a) => brand.audience.includes(a)),
  ).slice(0, 12)

  // fit at a glance, one line per family the brand makes
  const glance = FAMILIES.flatMap((f) => {
    const first = everything.find((g) => familyOf(g) === f)
    if (!first) return []
    const name = f === 'footwear' ? `Footwear (${systemName(brand.shoeSystem ?? 'EU')})` : FAMILY_LABEL[f]
    return [{ key: f, name, t: fitTendency(brand, first) }]
  })

  return (
    <main id="main">
      {/* intro */}
      <section id="top" className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 pb-12 pt-8 md:px-8 md:pb-16 md:pt-12">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/#brands" className="link-underline inline-flex min-h-10 items-center hover:text-ink">
                Brands
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li aria-current="page" className="text-ink">
              {brand.name}
            </li>
          </ol>
        </nav>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">
              {brand.origin} · {listWords(brand.kinds)} size chart
            </p>
            <div className="mt-5 flex items-center gap-4 md:gap-6">
              <BrandLogo brand={brand} size="xl" className="max-sm:size-16" eager />
              <h1 className="min-w-0 break-words font-display text-[clamp(44px,11vw,112px)] leading-[0.9] tracking-[-0.02em]">
                {brand.name}
              </h1>
            </div>
            <p className={`mt-5 inline-flex rounded-full px-2.5 py-1 text-xs ${brand.official ? 'bg-olive/10 text-olive' : 'bg-sand text-muted'}`}>
              {brand.official
                ? `Includes official ${brand.name} charts, linked on each chart`
                : `Sizes estimated from ${brand.name}'s typical fit`}
            </p>
            <p className="mt-5 max-w-[540px] text-[17px] leading-relaxed text-muted">
              {brand.name} size charts for {listWords(brand.audience.map((a) => AUDIENCE_LABEL[a].toLowerCase()))}
              {clothes.length || shoes.length ? `, covering ${listWords([...(clothes.length ? [`${clothes.length} ${clothes.length === 1 ? 'type' : 'types'} of clothing`] : []), ...(shoes.length ? [`${shoes.length} ${shoes.length === 1 ? 'kind' : 'kinds'} of footwear`] : [])])}` : ''}
              . Pick who you are shopping for, or turn a size you wear at another brand into a {brand.name} size.
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[10px] border border-line bg-line">
            {glance.map((row) => (
              <div key={row.key} className="bg-paper p-4">
                <dt className="text-xs text-muted">{row.name}</dt>
                <dd className={`mt-1.5 text-sm ${tendencyTone(row.t)}`}>{row.t}</dd>
              </div>
            ))}
            {glance.length % 2 === 1 && <div aria-hidden className="bg-paper" />}
          </dl>
        </div>
      </section>

      {/* charts */}
      <section id="sizes" className="scroll-mt-16 border-t border-line bg-cream">
        <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_440px] lg:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-muted">Step 1 · Who is it for</p>
              <h2 className="mt-4 font-display text-[clamp(34px,8vw,56px)] leading-[0.95] tracking-tight">
                {brand.name} sizes for {groupWord}
              </h2>
            </div>
            <div className="space-y-3">
              <WhoPicker value={cat} onChange={setCat} only={offered} />
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {cards.length} {cards.length === 1 ? 'chart' : 'charts'}
                </p>
                <UnitToggle unit={unit} setUnit={setUnit} />
              </div>
            </div>
          </div>

          {cards.length ? (
            <div key={cat} className="row-in mt-10 grid gap-4 md:grid-cols-2">
              {cards.map((c) => (
                <SizeTable key={c.key} brand={brand} cat={cat} g={c.g} title={c.title} styles={c.styles} unit={unit} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-muted">
              {brand.name} has no {groupWord} range in naapo yet.
            </p>
          )}
        </div>
      </section>

      {/* compare */}
      <section id="compare" className="scroll-mt-16 border-t border-line">
        <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-16 md:px-8 md:py-24">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Step 2 · Compare</p>
          <h2 className="mt-4 max-w-[820px] font-display text-[clamp(34px,8vw,56px)] leading-[0.95] tracking-tight">
            Wear another brand? Find your {brand.name} size.
          </h2>
          <p className="mt-4 max-w-[540px] text-[15px] text-muted">
            Tell us the size that fits you somewhere else, for {groupWord}. naapo lines up both charts and suggests the{' '}
            {brand.name} size that fits the same way.
          </p>
          <div className="mt-10">{cards.length ? <Compare key={cat} brand={brand} cat={cat} unit={unit} /> : null}</div>
        </div>
      </section>

      {/* similar brands */}
      <section className="border-t border-line bg-cream">
        <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 py-16 md:px-8 md:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-[clamp(32px,7vw,48px)] leading-none tracking-tight">Similar brands</h2>
            <ActionLink href="/#brands">All {BRANDS.length} brands</ActionLink>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
            {similar.map((b) => (
              <li key={b.id}>
                <Link
                  href={`/brands/${b.id}?for=${cat}`}
                  className="flex h-full min-h-20 flex-col justify-between rounded-[10px] border border-line bg-paper p-4 transition-[transform,border-color] duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-ink/40"
                >
                  <span className="flex items-center gap-2.5">
                    <BrandLogo brand={b} size="sm" />
                    <span className="min-w-0 font-display text-[19px] leading-tight">{b.name}</span>
                  </span>
                  <span className="mt-3 text-[11px] capitalize text-muted">{b.kinds.join(' · ')}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}
