import { useEffect, useState, type ReactNode } from 'react'
import { BRANDS, CATEGORIES } from '../data'
import { Link } from '../lib/router'
import { Arrow } from './primitives'
import { BrandSearchButton } from './BrandSearch'

export type Unit = 'cm' | 'in'

export const TRIVASITE = 'https://www.trivasite.co.in/'
export const TRIVASITE_ABOUT = 'https://www.trivasite.co.in/about'

export const fmt = (cm: number, unit: Unit, digits = 1) =>
  unit === 'cm' ? String(Number(cm.toFixed(digits))) : String(Number((cm / 2.54).toFixed(1)))

/** Local photos, saved at four widths in public/images. */
const WIDTHS = [360, 540, 720, 900]
export const photoSrc = (base: string, w = 900) => `${base}-${w}.webp`
export const photoSet = (base: string) => WIDTHS.map((w) => `${photoSrc(base, w)} ${w}w`).join(', ')

export const stripSystem = (label: string) => label.replace(/^(US|UK|EU) /, '')

const press =
  'transition-[transform,background-color,color,border-color] duration-150 ease-out hover:-translate-y-px active:translate-y-px active:scale-[0.985] active:duration-[90ms]'

/** The one main action: an ink (or paper, on dark grounds) pill with an arrow. */
export function ActionLink({
  href,
  dark = true,
  children = 'Find my size',
}: {
  href: string
  dark?: boolean
  children?: ReactNode
}) {
  return (
    <Link
      href={href}
      className={`group inline-flex min-h-12 items-center gap-3 rounded-full py-3.5 pl-6 pr-5 text-[15px] font-medium ${press} ${
        dark ? 'bg-ink text-paper hover:bg-[#3a2420]' : 'bg-paper text-ink hover:bg-sand'
      }`}
    >
      {children}
      <Arrow />
    </Link>
  )
}

export function Field({ label, children, htmlFor }: { label: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div>
      {htmlFor ? (
        <label htmlFor={htmlFor} className="mb-3 block text-xs uppercase tracking-[0.14em] text-muted">
          {label}
        </label>
      ) : (
        <p className="mb-3 text-xs uppercase tracking-[0.14em] text-muted">{label}</p>
      )}
      {children}
    </div>
  )
}

export function UnitToggle({ unit, setUnit }: { unit: Unit; setUnit: (u: Unit) => void }) {
  return (
    <div className="flex gap-1 text-xs" role="radiogroup" aria-label="Unit">
      {(['cm', 'in'] as Unit[]).map((u) => (
        <button
          key={u}
          role="radio"
          aria-checked={unit === u}
          onClick={() => setUnit(u)}
          className={`min-h-9 min-w-9 rounded px-2 transition-colors ${
            unit === u ? 'bg-sand text-ink' : 'text-muted hover:text-ink'
          }`}
        >
          {u}
        </button>
      ))}
    </div>
  )
}

const NAV = [
  { href: '/#brands', label: 'Brands' },
  { href: '/#finder', label: 'Size finder' },
  { href: '/#charts', label: 'Size charts' },
  { href: '/#guide', label: 'How to measure' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    if (!open) return
    const close = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', close)
    return () => window.removeEventListener('keydown', close)
  }, [open])

  return (
    <header
      // solid, not blurred: a backdrop blur is redrawn on every scroll frame and was a main cause of jank
      className={`sticky top-0 z-40 border-b bg-paper/[0.97] transition-[border-color] duration-300 ${
        scrolled || open ? 'border-line' : 'border-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1240px] 2xl:max-w-[1400px] items-center justify-between gap-6 px-5 md:px-8">
        <Link href="/" className="-ml-1 inline-flex min-h-11 items-center px-1 font-display text-[30px] leading-none tracking-tight" aria-label="naapo home">
          naapo
        </Link>
        <nav aria-label="Main" className="hidden items-center gap-7 text-sm text-muted lg:flex">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="link-underline py-2 hover:text-ink">
              {n.label}
            </Link>
          ))}
          <a href={TRIVASITE_ABOUT} target="_blank" rel="noopener" className="link-underline py-2 hover:text-ink">
            Contact
          </a>
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <div className="hidden xl:block">
            <BrandSearchButton />
          </div>
          <div className="xl:hidden">
            <BrandSearchButton compact />
          </div>
          <Link
            href="/#finder"
            className={`rounded-full border border-ink px-4 py-2 text-sm hover:bg-ink hover:text-paper ${press}`}
          >
            Find my size
          </Link>
        </div>
        <div className="-mr-3 flex items-center lg:hidden">
          <BrandSearchButton compact />
          <button
            className="min-h-11 px-3 text-sm"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>
      <div
        id="mobile-menu"
        className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out lg:hidden ${
          open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="mx-auto flex max-w-[1240px] 2xl:max-w-[1400px] flex-col px-5 pb-5 md:px-8">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                tabIndex={open ? 0 : -1}
                onClick={() => setOpen(false)}
                className="border-b border-line py-3 font-display text-2xl"
              >
                {n.label}
              </Link>
            ))}
            <a
              href={TRIVASITE_ABOUT}
              target="_blank"
              rel="noopener"
              tabIndex={open ? 0 : -1}
              className="border-b border-line py-3 font-display text-2xl"
            >
              Contact
            </a>
            <div className="pt-4">
              <ActionLink href="/#finder">Find my size</ActionLink>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

const FOOTER_BRANDS = ['roadster', 'snitch', 'bewakoof', 'souled-store', 'allen-solly', 'highlander', 'zara', 'hm', 'nike', 'adidas', 'bata', 'campus']

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto max-w-[1240px] 2xl:max-w-[1400px] px-5 pb-10 pt-16 md:px-8 md:pt-20">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.3fr_1.2fr]">
          <div>
            <p className="font-display text-[88px] leading-[0.8] tracking-tight md:text-[128px]">naapo</p>
            <p className="mt-6 text-muted">Same you, every brand.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Shop by</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
              {CATEGORIES.map((c) => (
                <li key={c.id}>
                  <Link href={`/?for=${c.id}#finder`} className="link-underline inline-flex min-h-9 items-center">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Brands</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4">
              {FOOTER_BRANDS.map((id) => BRANDS.find((b) => b.id === id)!).map((b) => (
                <li key={b.id}>
                  <Link href={`/brands/${b.id}`} className="link-underline inline-flex min-h-9 items-center">
                    {b.name}
                  </Link>
                </li>
              ))}
              <li className="col-span-2">
                <Link href="/#brands" className="link-underline inline-flex min-h-9 items-center text-muted hover:text-ink">
                  All {BRANDS.length} brands
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-muted">Contact</p>
            <p className="mt-4 max-w-[300px] text-[15px] leading-relaxed text-muted">
              naapo is part of Trivasite. Questions, a brand to add, or working together: reach the team there.
            </p>
            <div className="mt-5 flex flex-col items-start gap-3">
              <a
                href={TRIVASITE_ABOUT}
                target="_blank"
                rel="noopener"
                className={`group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-ink px-5 text-sm text-paper hover:bg-[#3a2420] ${press}`}
              >
                Contact us
                <Arrow />
              </a>
              <a href={TRIVASITE} target="_blank" rel="noopener" className="link-underline inline-flex min-h-9 items-center text-sm">
                Visit trivasite.co.in
              </a>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-wrap justify-between gap-4 border-t border-line pt-6 text-xs text-muted">
          <p>
            © {new Date().getFullYear()} naapo, a{' '}
            <a href={TRIVASITE} target="_blank" rel="noopener" className="link-underline">
              Trivasite
            </a>{' '}
            product · Photographs from Unsplash
          </p>
          <p>Brand names belong to their owners. Sizes are approximate.</p>
          <p className="w-full sm:w-auto">
            Designed and built by{' '}
            <a
              href="https://utkarshjha.me"
              target="_blank"
              rel="noopener"
              className="link-underline font-medium text-ink"
            >
              Utkarsh Jha
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
