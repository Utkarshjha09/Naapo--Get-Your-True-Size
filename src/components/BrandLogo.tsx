import { LOGOS } from '../logos'
import type { Brand } from '../data'

const SIZES = { xs: 'size-7 rounded-[6px]', sm: 'size-9 rounded-[8px]', md: 'size-11 rounded-[10px]', lg: 'size-16 rounded-[12px]', xl: 'size-20 rounded-[14px]' }

/** Initials for a brand with no logo file: "The Souled Store" -> "SS", "Bata" -> "B". */
const initials = (name: string) =>
  name
    .replace(/^the\s+/i, '')
    .split(/[\s&.+-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')

/** Rendered width of each tile in CSS px, so the browser reserves the space before the file arrives. */
const PX = { xs: 28, sm: 36, md: 44, lg: 64, xl: 80 }

/**
 * The brand's logo on a white tile, from public/logos. A brand without a logo file gets its
 * initials, set in the display face, on the same tile. `eager` is for logos that are on screen
 * early (the brand grid, a brand page's own logo); every other logo loads as it scrolls in.
 */
export function BrandLogo({
  brand,
  size = 'sm',
  className = '',
  eager = false,
}: {
  brand: Brand
  size?: keyof typeof SIZES
  className?: string
  eager?: boolean
}) {
  const src = LOGOS[brand.id]
  return (
    <span
      className={`grid shrink-0 place-items-center overflow-hidden border border-line bg-white ${SIZES[size]} ${className}`}
      aria-hidden
    >
      {src ? (
        <img
          src={src}
          alt=""
          width={PX[size]}
          height={PX[size]}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          className={`size-full object-contain ${src.endsWith('.svg') ? 'p-[18%]' : 'p-[10%]'}`}
        />
      ) : (
        <span
          className={`font-display leading-none text-ink ${size === 'xs' ? 'text-[13px]' : size === 'sm' ? 'text-[15px]' : size === 'md' ? 'text-[18px]' : size === 'lg' ? 'text-[26px]' : 'text-[32px]'}`}
        >
          {initials(brand.name)}
        </span>
      )}
    </span>
  )
}
