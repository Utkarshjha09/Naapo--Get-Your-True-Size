export type Category = 'men' | 'women' | 'boys' | 'girls' | 'kidsBoys' | 'kidsGirls'
export type Gender = 'female' | 'male'
export type Apparel =
  | 'tshirts'
  | 'shirts'
  | 'tops'
  | 'polos'
  | 'sweatshirts'
  | 'hoodies'
  | 'sweaters'
  | 'jackets'
  | 'coats'
  | 'thermals'
  | 'vests'
  | 'briefs'
  | 'boxers'
  | 'trunks'
  | 'longtrunks'
  | 'tshirtbra'
  | 'pushup'
  | 'sportsbra'
  | 'bralette'
  | 'minimizer'
  | 'strapless'
  | 'nursing'
  | 'beginnerbra'
  | 'bikini'
  | 'hipster'
  | 'fullbrief'
  | 'boyshorts'
  | 'thong'
  | 'panties'
  | 'camisoles'
  | 'kurtis'
  | 'kurtas'
  | 'dresses'
  | 'frocks'
  | 'jeans'
  | 'trousers'
  | 'leggings'
  | 'skirts'
  | 'palazzos'
  | 'shorts'
  | 'trackpants'
export type Footwear =
  | 'sneakers'
  | 'sports'
  | 'formal'
  | 'loafers'
  | 'sandals'
  | 'slides'
  | 'clogs'
  | 'boots'
  | 'heels'
  | 'flats'
  | 'school'
  | 'socks'
export type Garment = Apparel | Footwear
export type ShoeSystem = 'US' | 'UK' | 'EU'
export type Audience = 'men' | 'women' | 'kids'
export type BrandKind = 'clothing' | 'footwear'

export const APPAREL: Apparel[] = [
  'tshirts', 'shirts', 'polos', 'tops',
  'sweatshirts', 'hoodies', 'sweaters', 'jackets', 'coats', 'thermals',
  'kurtis', 'kurtas', 'dresses', 'frocks',
  'jeans', 'trousers', 'leggings', 'skirts', 'palazzos', 'shorts', 'trackpants',
  'vests', 'briefs', 'trunks', 'longtrunks', 'boxers',
  'camisoles', 'bikini', 'hipster', 'fullbrief', 'boyshorts', 'thong', 'panties',
  'tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless', 'nursing', 'beginnerbra',
]
/** Worn on the top half: sized by chest or bust (height for kids). */
export const TOPWEAR: Apparel[] = ['tshirts', 'shirts', 'polos', 'tops']
/** Winter layers: sized by chest or bust (height for kids). */
export const WINTERWEAR: Apparel[] = ['sweatshirts', 'hoodies', 'sweaters', 'jackets', 'coats', 'thermals']
/** Innerwear: vests and camisoles by chest or bust, briefs, boxers and panties by waist, bras by the underbust band. */
export const INNERWEAR: Apparel[] = [
  'vests', 'briefs', 'trunks', 'longtrunks', 'boxers',
  'camisoles', 'bikini', 'hipster', 'fullbrief', 'boyshorts', 'thong', 'panties',
]
/** Bra styles. Most are sized by band (underbust); sports bras and bralettes by bust letter; beginner bras by age. */
export const BRAS: Apparel[] = ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless', 'nursing', 'beginnerbra']
/** Bra styles sized by band, from the underbust. */
export const BAND_BRAS: Apparel[] = ['tshirtbra', 'pushup', 'minimizer', 'strapless', 'nursing']
/** Women's panty styles, sized by hip. */
export const PANTY_STYLES: Apparel[] = ['bikini', 'hipster', 'fullbrief', 'boyshorts', 'thong']
/** Dresses and ethnic wear: sized by chest or bust (height for kids). */
export const DRESSES_ETHNIC: Apparel[] = ['kurtis', 'kurtas', 'dresses', 'frocks']
/** Worn on the bottom half: sized by waist (height for kids). */
export const BOTTOMWEAR: Apparel[] = ['jeans', 'trousers', 'leggings', 'skirts', 'palazzos', 'shorts', 'trackpants']
/** Sized by waist: bottomwear and the lower half of innerwear. */
export const isLower = (g: Garment) =>
  (BOTTOMWEAR as Garment[]).includes(g) || ['briefs', 'trunks', 'longtrunks', 'boxers', 'panties'].includes(g)

export type Family = 'topwear' | 'winterwear' | 'ethnic' | 'bottomwear' | 'innerwear' | 'bras' | 'footwear'
export const FAMILIES: Family[] = ['topwear', 'winterwear', 'ethnic', 'bottomwear', 'innerwear', 'bras', 'footwear']
export const FAMILY_LABEL: Record<Family, string> = {
  topwear: 'Topwear',
  winterwear: 'Winterwear',
  ethnic: 'Dresses & ethnic',
  bottomwear: 'Bottomwear',
  innerwear: 'Innerwear',
  bras: 'Bras',
  footwear: 'Footwear',
}
export function familyOf(g: Garment): Family {
  if ((TOPWEAR as Garment[]).includes(g)) return 'topwear'
  if ((WINTERWEAR as Garment[]).includes(g)) return 'winterwear'
  if ((DRESSES_ETHNIC as Garment[]).includes(g)) return 'ethnic'
  if ((INNERWEAR as Garment[]).includes(g)) return 'innerwear'
  if ((BRAS as Garment[]).includes(g)) return 'bras'
  if ((BOTTOMWEAR as Garment[]).includes(g)) return 'bottomwear'
  return 'footwear'
}
export const FOOTWEAR: Footwear[] = [
  'sneakers', 'sports', 'formal', 'loafers', 'school', 'boots', 'heels', 'flats', 'sandals', 'clogs', 'slides', 'socks',
]
export const isFootwear = (g: Garment): g is Footwear => (FOOTWEAR as Garment[]).includes(g)
/** Sandals, floaters, flip-flops and slides come in whole sizes only. */
const WHOLE_SIZES: Footwear[] = ['sandals', 'slides', 'clogs']
export const isWholeSize = (g: Garment) => (WHOLE_SIZES as Garment[]).includes(g)
/** India sizes footwear on the UK scale. */
export const systemName = (s: ShoeSystem) => (s === 'UK' ? 'UK/India' : s)

export type Range = {
  label: string
  min: number
  max: number
  sub?: string
  systems?: Record<ShoeSystem, string>
}

export type Brand = {
  id: string
  name: string
  origin: string
  audience: Audience[]
  /** cm the brand's sizes sit above (+, runs large) or below (−, runs small) the common chart */
  offsets: Partial<Record<Garment, number>>
  shoeSystem?: ShoeSystem
  euBottoms?: boolean
  kinds: BrandKind[]
  /** size charts copied from the brand's own website, used in place of the estimate */
  official?: OfficialChart[]
}

export type OfficialChart = {
  audience: Audience
  garment: Garment
  /** the page the numbers were copied from */
  source: string
  rows: Range[]
  /** how the published numbers were turned into body sizes, shown beside the chart */
  note?: string
}

/**
 * An official chart that gives one body measurement per size: each size runs from halfway to the
 * size below it to halfway to the size above it.
 */
function fromPoints(labels: string[], values: number[], unit: 'cm' | 'in'): Range[] {
  const cm = values.map((v) => (unit === 'in' ? v * 2.54 : v))
  return cm.map((v, i) => {
    const below = i > 0 ? (cm[i - 1] + v) / 2 : v - (cm[1] - v) / 2
    const above = i < cm.length - 1 ? (v + cm[i + 1]) / 2 : v + (v - cm[i - 1]) / 2
    return { label: labels[i], min: below, max: above }
  })
}

export type CategoryInfo = {
  id: Category
  label: string
  /** short label used inside a gender group */
  short: string
  gender: Gender
  ages?: string
  caption: string
  /** local photo, without width and extension: /images/men -> /images/men-900.webp */
  image: string
  alt: string
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'men',
    label: 'Men',
    short: 'Men',
    gender: 'male',
    caption: 'T-shirts, shirts, jeans, kurtas, sneakers',
    image: '/images/men',
    alt: 'Man in a wide-sleeved black jacket against a white wall',
  },
  {
    id: 'women',
    label: 'Women',
    short: 'Women',
    gender: 'female',
    caption: 'Kurtis, tops, jeans, leggings, heels',
    image: '/images/women',
    alt: 'Woman standing in a long dress',
  },
  {
    id: 'boys',
    label: 'Boys',
    short: 'Boys',
    gender: 'male',
    ages: '8–14 yrs',
    caption: 'Ages 8 to 14, by height',
    image: '/images/boy',
    alt: 'Young boy standing on a grey pavement',
  },
  {
    id: 'girls',
    label: 'Girls',
    short: 'Girls',
    gender: 'female',
    ages: '8–14 yrs',
    caption: 'Ages 8 to 14, by height',
    image: '/images/girl',
    alt: 'Young girl in a dress reaching for a flower',
  },
  {
    id: 'kidsBoys',
    label: 'Kids boys',
    short: 'Kids',
    gender: 'male',
    ages: '2–7 yrs',
    caption: 'Ages 2 to 7, by height',
    image: '/images/boy',
    alt: 'Young boy standing on a grey pavement',
  },
  {
    id: 'kidsGirls',
    label: 'Kids girls',
    short: 'Kids',
    gender: 'female',
    ages: '2–7 yrs',
    caption: 'Ages 2 to 7, by height',
    image: '/images/girl',
    alt: 'Young girl in a dress reaching for a flower',
  },
]

export const categoryInfo = (c: Category) => CATEGORIES.find((x) => x.id === c)!

/** The age groups of each gender, oldest first. */
export const GROUPS: Record<Gender, Category[]> = {
  female: ['women', 'girls', 'kidsGirls'],
  male: ['men', 'boys', 'kidsBoys'],
}

const BOY: Garment[] = [
  'tshirts', 'shirts', 'polos',
  'sweatshirts', 'hoodies', 'sweaters', 'jackets', 'thermals',
  'kurtas', 'jeans', 'shorts', 'trackpants',
  'vests', 'briefs', 'trunks',
  'sneakers', 'sports', 'school', 'loafers', 'boots', 'sandals', 'clogs', 'slides', 'socks',
]
const GIRL: Garment[] = [
  'tshirts', 'tops', 'shirts',
  'sweatshirts', 'hoodies', 'sweaters', 'jackets', 'thermals',
  'frocks', 'kurtis', 'jeans', 'leggings', 'skirts', 'shorts', 'trackpants',
  'camisoles', 'panties', 'beginnerbra',
  'sneakers', 'sports', 'school', 'flats', 'boots', 'sandals', 'clogs', 'slides', 'socks',
]

export const GARMENTS: Record<Category, Garment[]> = {
  men: [
    'tshirts', 'shirts', 'polos',
    'sweatshirts', 'hoodies', 'sweaters', 'jackets', 'coats', 'thermals',
    'kurtas', 'jeans', 'trousers', 'shorts', 'trackpants',
    'vests', 'briefs', 'trunks', 'longtrunks', 'boxers',
    'sneakers', 'sports', 'formal', 'loafers', 'boots', 'sandals', 'clogs', 'slides', 'socks',
  ],
  women: [
    'tshirts', 'shirts', 'tops',
    'sweatshirts', 'hoodies', 'sweaters', 'jackets', 'coats', 'thermals',
    'kurtis', 'dresses', 'jeans', 'trousers', 'leggings', 'skirts', 'palazzos',
    'camisoles', 'bikini', 'hipster', 'fullbrief', 'boyshorts', 'thong',
    'tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless', 'nursing',
    'sneakers', 'sports', 'heels', 'flats', 'loafers', 'boots', 'sandals', 'clogs', 'slides', 'socks',
  ],
  boys: BOY,
  girls: GIRL,
  kidsBoys: BOY,
  kidsGirls: GIRL,
}

export const GARMENT_LABEL: Record<Garment, string> = {
  tshirts: 'T-shirts',
  polos: 'Polo T-shirts',
  sweatshirts: 'Sweatshirts',
  hoodies: 'Hoodies',
  sweaters: 'Sweaters & Cardigans',
  jackets: 'Jackets & Puffers',
  coats: 'Coats & Overcoats',
  thermals: 'Thermal Wear',
  vests: 'Vests',
  briefs: 'Briefs',
  boxers: 'Boxers',
  trunks: 'Trunks',
  longtrunks: 'Long Trunks & Boxer Briefs',
  tshirtbra: 'T-shirt Bras',
  pushup: 'Push-up & Padded Bras',
  sportsbra: 'Sports Bras',
  bralette: 'Bralettes & Wireless',
  minimizer: 'Minimizer & Full Coverage',
  strapless: 'Strapless & Multiway',
  nursing: 'Nursing & Maternity',
  beginnerbra: 'Beginner Bras',
  bikini: 'Bikini Panties',
  hipster: 'Hipster Panties',
  fullbrief: 'Full Briefs & High Waist',
  boyshorts: 'Boyshorts',
  thong: 'Thongs',
  panties: 'Panties',
  camisoles: 'Camisoles & Slips',
  shirts: 'Shirts',
  tops: 'Tops & Crop Tops',
  kurtis: 'Kurtis & Kurtas',
  kurtas: 'Kurtas',
  dresses: 'Dresses',
  frocks: 'Frocks & Dresses',
  jeans: 'Jeans',
  trousers: 'Trousers & Pants',
  leggings: 'Leggings & Jeggings',
  skirts: 'Skirts',
  palazzos: 'Palazzos & Salwars',
  shorts: 'Shorts',
  trackpants: 'Track Pants & Joggers',
  sneakers: 'Sneakers & Casual',
  sports: 'Sports & Running',
  formal: 'Formal Shoes',
  boots: 'Boots',
  heels: 'Heels',
  flats: 'Flats & Ballerinas',
  sandals: 'Sandals & Floaters',
  slides: 'Flip-flops & Slides',
  school: 'School Shoes',
  loafers: 'Loafers & Moccasins',
  clogs: 'Clogs',
  socks: 'Socks',
}

export type Measure = {
  key: 'chest' | 'bust' | 'underbust' | 'waist' | 'hip' | 'foot' | 'height'
  label: string
  min: number
  max: number
  step: number
  initial: number
}

export const isKids = (c: Category) => c !== 'men' && c !== 'women'
/** Little kids, ages 2 to 7. */
export const isLittle = (c: Category) => c === 'kidsBoys' || c === 'kidsGirls'

export function measureFor(cat: Category, g: Garment): Measure {
  if (isFootwear(g)) {
    if (isLittle(cat)) return { key: 'foot', label: 'Foot length', min: 12.5, max: 19.5, step: 0.1, initial: 16 }
    if (isKids(cat)) return { key: 'foot', label: 'Foot length', min: 18.5, max: 25, step: 0.1, initial: 21.5 }
    return cat === 'men'
      ? { key: 'foot', label: 'Foot length', min: 23, max: 31.5, step: 0.1, initial: 26.8 }
      : { key: 'foot', label: 'Foot length', min: 21, max: 28.5, step: 0.1, initial: 24.2 }
  }
  if ((BAND_BRAS as Garment[]).includes(g)) return { key: 'underbust', label: 'Underbust', min: 58, max: 104, step: 1, initial: 74 }
  if ((PANTY_STYLES as Garment[]).includes(g)) return { key: 'hip', label: 'Hip', min: 80, max: 120, step: 1, initial: 96 }
  if (isLittle(cat)) return { key: 'height', label: 'Height', min: 84, max: 134, step: 1, initial: 110 }
  if (isKids(cat)) return { key: 'height', label: 'Height', min: 122, max: 172, step: 1, initial: 146 }
  if (cat === 'men')
    return isLower(g)
      ? { key: 'waist', label: 'Waist', min: 68, max: 106, step: 1, initial: 84 }
      : { key: 'chest', label: 'Chest', min: 82, max: 130, step: 1, initial: 100 }
  return isLower(g)
    ? { key: 'waist', label: 'Waist', min: 56, max: 100, step: 1, initial: 72 }
    : { key: 'bust', label: 'Bust', min: 74, max: 118, step: 1, initial: 88 }
}

const LETTERS = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
/** Indian shirt sizes: the chest in inches printed beside the letter. */
const SHIRT_INCHES = ['36', '38', '40', '42', '44', '46']
const inch = (v: number) => v * 2.54
const EU_WOMEN = ['34', '36', '38', '40', '42', '44']

function seq(labels: string[], edges: number[]): Range[] {
  return labels.map((label, i) => ({ label, min: edges[i], max: edges[i + 1] }))
}

const n = (v: number) => String(Math.round(v * 2) / 2).replace(/\.0$/, '')

function shoeChart(cat: Category): Range[] {
  const out: Range[] = []
  if (cat === 'men' || cat === 'women') {
    const step = (0.5 / 3) * 2.54
    const [from, to] = cat === 'men' ? [5, 14] : [5, 12]
    for (let us = from; us <= to; us += 0.5) {
      const menUS = cat === 'men' ? us : us - 1.5
      const foot = ((menUS + 22) / 3) * 2.54 + 0.5
      const systems: Record<ShoeSystem, string> =
        cat === 'men'
          ? { US: n(us), UK: n(us - 1), EU: n(us + 33.5) }
          : { US: n(us), UK: n(us - 2.5), EU: n(us + 31) }
      out.push({ label: systems.US, min: foot - step / 2, max: foot + step / 2, systems })
    }
    return out
  }
  const [euFrom, euTo] = isLittle(cat) ? [22, 30] : [31, 38]
  for (let eu = euFrom; eu <= euTo; eu++) {
    const foot = eu / 1.5 - 1.5
    const v = Math.round(((eu - 15.6) / 1.27) * 2) / 2
    const uk = v <= 13.5 ? n(v) : n(v - 13)
    const usv = v + 1
    const us = usv <= 13.5 ? `${n(usv)}C` : `${n(usv - 13)}Y`
    out.push({ label: String(eu), min: foot - 1 / 3, max: foot + 1 / 3, systems: { US: us, UK: uk, EU: String(eu) } })
  }
  return out
}

/** Foot length (cm) for a UK shoe size, on the same scale as shoeChart. */
const footForUK = (uk: number) => ((uk + 1 + 22) / 3) * 2.54 + 0.5
/** Foot length (cm) for an EU kids' shoe size. */
const footForEU = (eu: number) => eu / 1.5 - 1.5

/** Socks come in a few sizes, each covering a span of shoe sizes. */
function socksChart(cat: Category): Range[] {
  const span = (label: string, sub: string, min: number, max: number): Range => ({ label, sub, min, max })
  if (cat === 'men')
    return [
      span('S', 'UK 5–7', footForUK(4.5), footForUK(7.5)),
      span('M', 'UK 8–10', footForUK(7.5), footForUK(10.5)),
      span('L', 'UK 11–12', footForUK(10.5), footForUK(12.5)),
    ]
  if (cat === 'women')
    return [
      span('S', 'UK 2–4', footForUK(1.5), footForUK(4.5)),
      span('M', 'UK 5–7', footForUK(4.5), footForUK(7.5)),
      span('L', 'UK 8–9', footForUK(7.5), footForUK(9.5)),
    ]
  if (isLittle(cat))
    return [
      span('2–3Y', 'EU 22–24', footForEU(21.5), footForEU(24.5)),
      span('3–5Y', 'EU 25–27', footForEU(24.5), footForEU(27.5)),
      span('5–7Y', 'EU 28–30', footForEU(27.5), footForEU(30.5)),
    ]
  return [
    span('8–10Y', 'EU 31–33', footForEU(30.5), footForEU(33.5)),
    span('10–12Y', 'EU 34–36', footForEU(33.5), footForEU(36.5)),
    span('12–14Y', 'EU 37–38', footForEU(36.5), footForEU(38.5)),
  ]
}

/** Bra band sizes by underbust (cm). The cup depends on the bust, measured separately. */
const BRA_BANDS = seq(['30', '32', '34', '36', '38', '40', '42'], [62.5, 67.5, 72.5, 77.5, 82.5, 87.5, 92.5, 97.5])

export function baseChart(cat: Category, g: Garment): Range[] {
  if (g === 'socks') return socksChart(cat)
  if ((BAND_BRAS as Garment[]).includes(g)) return BRA_BANDS.map((r) => ({ ...r }))
  if (cat === 'women' && (PANTY_STYLES as Garment[]).includes(g)) return seq(LETTERS, [84, 89, 94, 99, 104, 110, 116])
  if (isFootwear(g)) return shoeChart(cat)
  if (isKids(cat)) {
    const labels: string[] = []
    const edges: number[] = []
    const [fromAge, fromH] = isLittle(cat) ? [2, 92] : [8, 128]
    for (let a = fromAge; a <= fromAge + 5; a++) labels.push(`${a}–${a + 1}Y`)
    for (let h = fromH; h <= fromH + 36; h += 6) edges.push(h)
    return seq(labels, edges).map((r) => ({ ...r, sub: `${r.max} cm` }))
  }
  if (cat === 'men') {
    const waist = [70, 74, 79, 84, 89, 94, 99, 104]
    if (g === 'jeans') return seq(['W28', 'W30', 'W32', 'W34', 'W36', 'W38', 'W40'], waist)
    if (g === 'trousers') return seq(['28', '30', '32', '34', '36', '38', '40'], waist)
    if (isLower(g)) return seq(LETTERS, [71, 76, 81, 86, 91, 97, 102])
    const chest = seq(LETTERS, [84, 89, 96, 104, 112, 120, 128])
    return g === 'shirts' ? chest.map((r, i) => ({ ...r, sub: SHIRT_INCHES[i] })) : chest
  }
  if (g === 'jeans')
    return seq(['26', '28', '30', '32', '34', '36'], [25, 27, 29, 31, 33, 35, 37].map(inch))
  if (isLower(g)) return seq(LETTERS, [58, 64, 70, 76, 82, 90, 98])
  return seq(LETTERS, [76, 82, 88, 94, 100, 108, 116])
}

/*
 * The brand list. Offsets are naapo's estimates of how each brand cuts against the common chart,
 * from its published size charts and typical fit; they are approximate and change by collection.
 *
 * b(id, name, origin, audience, clothing, footwear?)
 *   audience: 'm' men, 'w' women, 'k' kids
 *   clothing: { t: tops, b: bottoms, d: dresses, e: kurtas and ethnic, w: winter wear (defaults to t),
 *               i: innerwear (defaults to 0 for labels in the innerwear lists) }, offsets in cm
 *   footwear: [offset in cm, the brand's size system, the kinds of footwear it makes]
 */
type Clothing = { t?: number; b?: number; d?: number; e?: number; w?: number; i?: number }
type Foot = [number, ShoeSystem, Footwear[]]

const AUD: Record<string, Audience> = { m: 'men', w: 'women', k: 'kids' }

function b(
  id: string,
  name: string,
  origin: string,
  audience: string,
  clothing: Clothing,
  foot?: Foot,
  extra: Partial<Brand> & { not?: Apparel[] } = {},
): Brand {
  const offsets: Partial<Record<Garment, number>> = {}
  const who = [...audience].map((c) => AUD[c])
  const women = who.includes('women')
  const kids = who.includes('kids')
  const men = who.includes('men')
  const set = (g: Apparel, v: number | undefined, when = true) => {
    if (v !== undefined && when && !extra.not?.includes(g)) offsets[g] = v
  }
  const ethnicOnly = ETHNIC_LABELS.includes(id)
  const sport = SPORTSWEAR.includes(id)
  // topwear
  set('tshirts', clothing.t, !ethnicOnly)
  set('shirts', clothing.t, !ethnicOnly && !sport)
  set('tops', clothing.t, women || kids)
  set('polos', clothing.t, (men || kids) && !ethnicOnly && !STREETWEAR_ONLY.includes(id))
  // winterwear
  const winter = clothing.w ?? clothing.t
  const casual = !ethnicOnly && !FORMAL_LABELS.includes(id)
  set('sweatshirts', winter, casual)
  set('hoodies', winter, casual)
  set('sweaters', winter, !ethnicOnly && !STREETWEAR_ONLY.includes(id) && !sport)
  set('jackets', winter, !ethnicOnly)
  set('coats', winter, COATS.includes(id) && (men || women))
  set('thermals', winter ?? clothing.i ?? 0, THERMALS.includes(id))
  // innerwear: by list, so a label only shows what it really sells
  const inner = clothing.i ?? 0
  set('vests', inner, (men || kids) && INNER_MEN.includes(id))
  set('briefs', inner, (men || kids) && INNER_MEN.includes(id))
  set('trunks', inner, (men || kids) && INNER_MEN.includes(id))
  set('longtrunks', inner, men && LONG_TRUNKS.includes(id))
  set('boxers', inner, men && (INNER_MEN.includes(id) || BOXERS.includes(id)))
  set('camisoles', inner, (women || kids) && INNER_WOMEN.includes(id))
  // bras and panties by style, from each label's own range
  if (women) for (const style of BRA_STYLES[id] ?? (SPORTSWEAR.includes(id) ? ['sportsbra'] : [])) set(style, inner)
  if (women) for (const style of PANTIES[id] ?? []) set(style, inner)
  set('panties', inner, kids && KIDS_INNER_GIRLS.includes(id))
  set('beginnerbra', inner, kids && KIDS_INNER_GIRLS.includes(id))
  // dresses and ethnic
  set('kurtis', clothing.e, women || kids)
  set('kurtas', clothing.e, men)
  set('dresses', clothing.d, women)
  set('frocks', clothing.d, kids)
  // bottomwear
  set('jeans', clothing.b, !ethnicOnly && !sport)
  set('trousers', clothing.b)
  set('leggings', clothing.b, (women || kids) && LEGGINGS.includes(id))
  set('skirts', clothing.d, women || kids)
  set('palazzos', clothing.e, women)
  set('shorts', clothing.b, (men || kids) && !FORMAL_LABELS.includes(id) && !ethnicOnly)
  set('trackpants', clothing.b, TRACKPANTS.includes(id))
  if (foot) for (const f of foot[2]) offsets[f] = foot[0]
  if (SOCKS.includes(id)) offsets.socks = 0
  const kinds: BrandKind[] = []
  if ((APPAREL as Garment[]).some((g) => offsets[g] !== undefined)) kinds.push('clothing')
  if (foot) kinds.push('footwear')
  const rest: Partial<Brand> & { not?: Apparel[] } = { ...extra }
  delete rest.not
  return { id, name, origin, audience: who, offsets, shoeSystem: foot?.[1], kinds, ...rest }
}

/** Labels that make coats and overcoats. */
const COATS = [
  'invictus', 'prada', 'people', 'reid-taylor',
  'zara', 'hm', 'mango', 'ms', 'uniqlo', 'only', 'vero-moda', 'westside', 'max', 'pantaloons', 'monte-carlo', 'raymond',
  'louis-philippe', 'van-heusen', 'allen-solly', 'tommy', 'calvin-klein', 'ucb', 'fort-collins', 'park-avenue', 'blackberrys',
  'peter-england', 'arrow', 'superdry', 'jack-jones',
]
/** Labels that make thermal wear. */
const THERMALS = [
  'jockey', 'uniqlo', 'lux-cozi', 'dollar', 'rupa', 'decathlon', 'ms', 'max', 'zudio', 'monte-carlo', 'wildcraft', 'vip',
  'dixcy-scott', 'bodycare', 'rupa-frontline',
]
/** Men's and boys' innerwear: vests, briefs and trunks, boxers. */
const INNER_MEN = [
  'jockey', 'van-heusen', 'calvin-klein', 'tommy', 'uspa', 'uniqlo', 'hm', 'ms', 'zudio', 'max', 'lux-cozi', 'dollar', 'rupa',
  'vip', 'xyxx', 'damensch', 'peter-england', 'allen-solly', 'westside', 'pantaloons', 'mothercare',
  'macroman', 'amul-macho', 'rupa-frontline', 'dixcy-scott', 'amul-comfy', 'shera-gold', 'vimal', 'bummer', 'ramraj', 'bodycare',
]
/** Labels that make boxers without the rest of the innerwear range. */
const BOXERS = ['bewakoof', 'souled-store', 'snitch', 'nobero', 'beyoung']
/** Women's and girls' innerwear: bras, panties, camisoles and slips. */
/** Men's long trunks and boxer briefs. */
const LONG_TRUNKS = [
  'jockey', 'xyxx', 'damensch', 'calvin-klein', 'uspa', 'van-heusen', 'tommy', 'hm', 'ms', 'uniqlo',
  'macroman', 'bummer', 'dixcy-scott', 'amul-macho', 'rupa-frontline',
]
/** Girls' innerwear: panties and beginner bras. */
const KIDS_INNER_GIRLS = [
  'jockey', 'zivame', 'clovia', 'hm', 'ms', 'zudio', 'max', 'mothercare', 'lux-cozi', 'westside', 'pantaloons', 'bodycare',
  'rupa-softline',
]
const ALL_BRAS: Apparel[] = ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless', 'nursing']
const ALL_PANTIES: Apparel[] = ['bikini', 'hipster', 'fullbrief', 'boyshorts', 'thong']
/** The bra styles each label sells. Sportswear labels not listed here sell sports bras only. */
const BRA_STYLES: Record<string, Apparel[]> = {
  zivame: ALL_BRAS,
  clovia: ALL_BRAS,
  enamor: ALL_BRAS,
  ms: ALL_BRAS,
  amante: ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless'],
  triumph: ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'strapless'],
  jockey: ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'minimizer', 'nursing'],
  hm: ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'nursing'],
  'calvin-klein': ['tshirtbra', 'pushup', 'sportsbra', 'bralette'],
  'van-heusen': ['tshirtbra', 'sportsbra', 'bralette'],
  uniqlo: ['bralette', 'sportsbra'],
  zudio: ['tshirtbra', 'sportsbra', 'bralette'],
  westside: ['tshirtbra', 'pushup', 'sportsbra', 'bralette'],
  max: ['tshirtbra', 'sportsbra'],
  pantaloons: ['tshirtbra', 'sportsbra'],
  'lux-cozi': ['tshirtbra'],
  shyaway: ALL_BRAS,
  prettysecrets: ['tshirtbra', 'pushup', 'sportsbra', 'bralette', 'strapless'],
  groversons: ['tshirtbra', 'pushup', 'sportsbra', 'minimizer', 'strapless', 'nursing'],
  lovable: ['tshirtbra', 'pushup', 'sportsbra', 'minimizer', 'strapless'],
  'rupa-softline': ['tshirtbra', 'sportsbra', 'minimizer'],
  'inner-sense': ['tshirtbra', 'sportsbra', 'bralette', 'nursing'],
  bodycare: ['tshirtbra', 'sportsbra', 'minimizer'],
  bummer: ['bralette'],
}
/** The panty styles each label sells. */
const PANTIES: Record<string, Apparel[]> = {
  zivame: ALL_PANTIES,
  clovia: ALL_PANTIES,
  enamor: ALL_PANTIES,
  amante: ALL_PANTIES,
  triumph: ALL_PANTIES,
  ms: ['bikini', 'hipster', 'fullbrief', 'boyshorts'],
  jockey: ['bikini', 'hipster', 'fullbrief', 'boyshorts'],
  hm: ['bikini', 'hipster', 'fullbrief', 'thong'],
  'calvin-klein': ['bikini', 'hipster', 'boyshorts', 'thong'],
  'van-heusen': ['bikini', 'hipster', 'boyshorts'],
  uniqlo: ['hipster', 'fullbrief'],
  zudio: ['bikini', 'hipster', 'fullbrief'],
  westside: ['bikini', 'hipster', 'fullbrief'],
  max: ['bikini', 'hipster', 'fullbrief'],
  pantaloons: ['bikini', 'hipster', 'fullbrief'],
  'lux-cozi': ['bikini', 'hipster', 'fullbrief'],
  shyaway: ALL_PANTIES,
  prettysecrets: ['bikini', 'hipster', 'boyshorts', 'thong'],
  groversons: ['bikini', 'hipster', 'fullbrief'],
  lovable: ['bikini', 'hipster', 'fullbrief'],
  'rupa-softline': ['bikini', 'hipster', 'fullbrief'],
  'inner-sense': ['bikini', 'hipster', 'fullbrief', 'boyshorts'],
  bodycare: ['bikini', 'hipster', 'fullbrief'],
  bummer: ['bikini', 'hipster', 'boyshorts'],
}
const INNER_WOMEN = [
  'jockey', 'zivame', 'clovia', 'amante', 'enamor', 'triumph', 'hm', 'ms', 'uniqlo', 'zudio', 'max', 'calvin-klein', 'van-heusen',
  'westside', 'pantaloons', 'lux-cozi', 'mothercare',
  'shyaway', 'prettysecrets', 'groversons', 'lovable', 'rupa-softline', 'inner-sense', 'bodycare',
]

/** Ethnic labels: kurtis, kurtas and palazzos, no jeans or t-shirts. */
const ETHNIC_LABELS = [
  'biba', 'w', 'aurelia', 'libas', 'global-desi', 'soch', 'manyavar', 'rangriti', 'anouk', 'jompers', 'tattva', 'vastramay', 'vastrado',
]
/** Labels that sell socks. */
const SOCKS = [
  'nike', 'adidas', 'puma', 'reebok', 'skechers', 'nb', 'decathlon', 'jockey', 'hm', 'uniqlo', 'ms', 'max', 'zudio', 'westside',
  'pantaloons', 'uspa', 'levis', 'tommy', 'allen-solly', 'peter-england', 'van-heusen', 'louis-philippe', 'bata', 'souled-store',
  'bewakoof', 'mothercare', 'gap', 'calvin-klein', 'hrx', 'campus', 'red-tape', 'woodland',
]
/** Oversized-tee streetwear labels that make no polos. */
const STREETWEAR_ONLY = ['bewakoof', 'souled-store', 'bonkers-corner', 'nobero', 'maniac', 'kook-n-keech', 'urban-monkey']
/** Sportswear labels: no shirts or jeans. */
const SPORTSWEAR = ['nike', 'adidas', 'puma', 'reebok', 'decathlon', 'hrx', 'fila', 'nb', 'asics', 'netplay', 'fuaark', 'coitonic']
/** Formalwear labels: no casual shorts. */
const FORMAL_LABELS = ['peter-england', 'van-heusen', 'louis-philippe', 'raymond', 'arrow', 'park-avenue', 'blackberrys', 'colorplus']
/** Labels that make leggings and jeggings. */
const LEGGINGS = [
  'anouk', 'fuaark', 'coitonic',
  'biba', 'w', 'aurelia', 'libas', 'global-desi', 'soch', 'rangriti', 'fabindia', 'max', 'zudio', 'westside', 'pantaloons',
  'jockey', 'nike', 'adidas', 'puma', 'decathlon', 'hrx', 'dressberry', 'hm', 'uniqlo', 'ms', 'gap', 'only', 'vero-moda',
  'mothercare', 'dnmx', 'tokyo-talkies', 'roadster',
]
/** Labels that make track pants and joggers. */
const TRACKPANTS = [
  'fuaark', 'coitonic', 'beyoung', 'cahoot', 'banana-club',
  'nike', 'adidas', 'puma', 'reebok', 'decathlon', 'hrx', 'jockey', 'fila', 'bewakoof', 'souled-store', 'nobero', 'snitch',
  'powerlook', 'maniac', 'bonkers-corner', 'netplay', 'dnmx', 'max', 'zudio', 'uspa', 'being-human', 'highlander', 'roadster',
  'jack-jones', 'hm', 'uniqlo', 'mothercare', 'gap', 'wrogn', 'duke', 'monte-carlo',
]

const IN = 'India'
const US = 'United States'
const UK = 'United Kingdom'

export const BRANDS: Brand[] = [
  // international fashion
  b('zara', 'Zara', 'Spain', 'mwk', { t: -1.5, b: -1, d: -1.5 }, [0, 'EU', ['sneakers', 'formal', 'boots', 'heels', 'flats', 'sandals', 'loafers']], { euBottoms: true }),
  b('hm', 'H&M', 'Sweden', 'mwk', { t: 0, b: 0, d: 0 }, [0.1, 'EU', ['sneakers', 'boots', 'flats', 'sandals', 'slides', 'loafers', 'clogs']]),
  b('uniqlo', 'Uniqlo', 'Japan', 'mwk', { t: -2.5, b: -1.5, d: -2 }),
  b('mango', 'Mango', 'Spain', 'mwk', { t: -1, b: -1.5, d: -1 }, [0.2, 'EU', ['sneakers', 'boots', 'heels', 'flats', 'sandals']], { euBottoms: true }),
  b('gap', 'Gap', US, 'mwk', { t: 2, b: 1.5, d: 2 }),
  b('ms', 'Marks & Spencer', UK, 'mwk', { t: 1.5, b: 1, d: 1.5 }, [0.3, 'UK', ['formal', 'boots', 'flats', 'sandals', 'school']]),
  b('tommy', 'Tommy Hilfiger', US, 'mwk', { t: 2, b: 1, d: 1.5 }, [0.1, 'UK', ['sneakers', 'formal', 'slides', 'loafers']]),
  b('levis', "Levi's", US, 'mwk', { t: 1, b: 0.5 }, [0, 'UK', ['sneakers']]),
  b('calvin-klein', 'Calvin Klein', US, 'mw', { t: 0.5, b: 0 }, [0, 'UK', ['sneakers', 'slides']]),
  b('ucb', 'United Colors of Benetton', 'Italy', 'mwk', { t: 0.5, b: 0.5, d: 0.5 }, [0, 'UK', ['sneakers', 'slides']]),
  b('jack-jones', 'Jack & Jones', 'Denmark', 'mk', { t: -1, b: -0.5 }, [0, 'UK', ['sneakers']]),
  b('only', 'Only', 'Denmark', 'w', { t: -1, b: -1, d: -1 }),
  b('vero-moda', 'Vero Moda', 'Denmark', 'w', { t: -1, b: -1, d: -1 }),
  b('pepe-jeans', 'Pepe Jeans', UK, 'mwk', { t: 0, b: 0.5 }, [0, 'UK', ['sneakers']]),
  b('lee', 'Lee', US, 'mw', { t: 1, b: 1 }),
  b('wrangler', 'Wrangler', US, 'mw', { t: 1, b: 1 }),
  b('superdry', 'Superdry', UK, 'mw', { t: -1, b: -0.5 }, [0, 'UK', ['sneakers']]),
  b('arrow', 'Arrow', US, 'm', { t: 1, b: 1 }, [0, 'UK', ['formal']]),
  b('uspa', 'U.S. Polo Assn.', US, 'mwk', { t: 1, b: 0.5 }, [0, 'UK', ['sneakers', 'sports', 'formal', 'sandals', 'slides', 'loafers']]),
  b('mothercare', 'Mothercare', UK, 'k', { t: 0.5, b: 0.5, d: 0.5 }, [0, 'UK', ['sneakers', 'sandals', 'boots']]),

  // Indian fashion and streetwear
  b('roadster', 'Roadster', IN, 'mw', { t: 0.5, b: 0, d: 0 }, [0, 'UK', ['sneakers', 'boots', 'sandals', 'slides', 'loafers']]),
  b('highlander', 'Highlander', IN, 'm', { t: -1, b: -0.5 }, [0, 'UK', ['sneakers']]),
  b('bearhouse', 'The Bear House', IN, 'm', { t: 0.5, b: 0 }),
  b('mast-harbour', 'Mast & Harbour', IN, 'mw', { t: 0, b: 0, d: 0 }, [0, 'UK', ['sneakers', 'formal', 'heels', 'flats', 'sandals', 'loafers']]),
  b('indian-garage-co', 'The Indian Garage Co', IN, 'm', { t: -1, b: -0.5 }),
  b('metronaut', 'Metronaut', IN, 'm', { t: 0, b: 0 }),
  b('powerlook', 'Powerlook', IN, 'm', { t: -1.5, b: -1 }),
  b('wrogn', 'Wrogn', IN, 'm', { t: -1, b: -1 }, [0, 'UK', ['sneakers', 'slides']]),
  b('flying-machine', 'Flying Machine', IN, 'mw', { t: 0, b: 0.5 }, [0, 'UK', ['sneakers']]),
  b('allen-solly', 'Allen Solly', IN, 'mwk', { t: 1, b: 1, d: 1 }, [0, 'UK', ['formal', 'sneakers', 'loafers']]),
  b('peter-england', 'Peter England', IN, 'm', { t: 1, b: 1 }, [0, 'UK', ['formal']]),
  b('van-heusen', 'Van Heusen', IN, 'mw', { t: 0.5, b: 0.5, d: 0.5 }, [0, 'UK', ['formal']]),
  b('louis-philippe', 'Louis Philippe', IN, 'm', { t: 0.5, b: 0.5 }, [0, 'UK', ['formal']]),
  b('raymond', 'Raymond', IN, 'm', { t: 1, b: 1, e: 1 }),
  b('snitch', 'Snitch', IN, 'm', { t: -2, b: -1 }),
  b('bewakoof', 'Bewakoof', IN, 'mw', { t: 1.5, b: 0.5, d: 0.5 }, [0, 'UK', ['slides']]),
  b('nobero', 'Nobero', IN, 'mw', { t: 1, b: 0.5 }),
  b('being-human', 'Being Human', IN, 'mwk', { t: 0.5, b: 0.5 }, [0, 'UK', ['sneakers', 'sandals', 'slides']]),
  b('maniac', 'Maniac', IN, 'm', { t: -1.5, b: -0.5 }),
  b('souled-store', 'The Souled Store', IN, 'mwk', { t: 1, b: 0.5, d: 0.5 }, [0, 'UK', ['sneakers', 'slides']]),
  b('bonkers-corner', 'Bonkers Corner', IN, 'mw', { t: 2, b: 1 }),
  b('spykar', 'Spykar', IN, 'mw', { t: 0, b: 0 }),
  b('mufti', 'Mufti', IN, 'm', { t: -0.5, b: 0 }),
  b('killer', 'Killer', IN, 'm', { t: 0, b: 0 }),
  b('here-now', 'Here&Now', IN, 'mw', { t: 0, b: 0, d: 0 }),
  b('hrx', 'HRX by Hrithik Roshan', IN, 'mw', { t: 0, b: 0 }, [0, 'UK', ['sports', 'sneakers', 'slides']]),
  b('dressberry', 'DressBerry', IN, 'w', { t: -0.5, b: -0.5, d: -0.5 }, [0, 'UK', ['heels', 'flats', 'sandals', 'sneakers']]),
  b('tokyo-talkies', 'Tokyo Talkies', IN, 'w', { t: -1, b: -1, d: -1 }),
  b('max', 'Max Fashion', 'United Arab Emirates', 'mwk', { t: 0.5, b: 0.5, d: 0.5, e: 0.5 }, [0, 'UK', ['sneakers', 'flats', 'sandals', 'slides', 'clogs', 'boots']]),

  // ethnic wear
  b('fabindia', 'Fabindia', IN, 'mwk', { t: 1, b: 1, d: 1, e: 1 }),
  b('biba', 'Biba', IN, 'wk', { t: 0.5, b: 0.5, d: 0.5, e: 0.5 }),
  b('w', 'W for Woman', IN, 'w', { t: 0, b: 0, d: 0, e: 0 }),
  b('aurelia', 'Aurelia', IN, 'w', { e: 0, b: 0 }),
  b('libas', 'Libas', IN, 'w', { d: 0.5, e: 0.5, b: 0.5 }),
  b('global-desi', 'Global Desi', IN, 'w', { t: 0, d: 0, e: 0 }),
  b('soch', 'Soch', IN, 'w', { e: 0.5, b: 0.5 }),
  b('manyavar', 'Manyavar', IN, 'mk', { e: 1 }, [0, 'UK', ['formal']], { not: ['kurtis'] }),

  // sportswear
  b('nike', 'Nike', US, 'mwk', { t: 0.5, b: 0 }, [-0.3, 'US', ['sneakers', 'sports', 'slides']]),
  b('adidas', 'Adidas', 'Germany', 'mwk', { t: 1, b: 0.5, d: 0.5 }, [0, 'UK', ['sneakers', 'sports', 'slides']]),
  b('puma', 'Puma', 'Germany', 'mwk', { t: 0, b: 0 }, [0.2, 'UK', ['sneakers', 'sports', 'slides']]),
  b('nb', 'New Balance', US, 'mwk', { t: 0.5 }, [-0.1, 'US', ['sneakers', 'sports']]),
  b('reebok', 'Reebok', US, 'mwk', { t: 0.5, b: 0 }, [0, 'UK', ['sports', 'sneakers', 'slides']]),
  b('asics', 'Asics', 'Japan', 'mw', {}, [-0.2, 'UK', ['sports']]),
  b('skechers', 'Skechers', US, 'mwk', {}, [0.1, 'UK', ['sneakers', 'sports', 'sandals', 'slides', 'clogs']]),
  b('fila', 'Fila', 'Italy', 'mw', { t: 0 }, [0, 'UK', ['sneakers', 'sports']]),
  b('decathlon', 'Decathlon', 'France', 'mwk', { t: 1, b: 1 }, [0.2, 'EU', ['sports', 'boots', 'sandals', 'slides', 'sneakers']]),
  b('converse', 'Converse', US, 'mwk', {}, [0.4, 'UK', ['sneakers']]),
  b('vans', 'Vans', US, 'mwk', {}, [0, 'UK', ['sneakers', 'slides']]),

  // footwear
  b('bata', 'Bata', IN, 'mwk', {}, [0, 'UK', ['formal', 'sneakers', 'heels', 'flats', 'sandals', 'slides', 'school', 'loafers', 'clogs', 'boots']]),
  b('campus', 'Campus', IN, 'mwk', {}, [-0.2, 'UK', ['sports', 'sneakers', 'sandals', 'slides', 'clogs']]),
  b('red-tape', 'Red Tape', IN, 'mw', {}, [0.1, 'UK', ['sneakers', 'sports', 'formal', 'boots', 'sandals', 'loafers']]),
  b('woodland', 'Woodland', IN, 'mw', {}, [0.2, 'UK', ['boots', 'sneakers', 'formal', 'sandals', 'loafers']]),
  b('liberty', 'Liberty', IN, 'mwk', {}, [0, 'UK', ['formal', 'sports', 'sandals', 'school', 'loafers']]),
  b('sparx', 'Sparx', IN, 'mw', {}, [-0.1, 'UK', ['sports', 'sandals', 'slides']]),
  b('relaxo', 'Relaxo', IN, 'mwk', {}, [0, 'UK', ['slides', 'sandals', 'clogs']]),
  b('action', 'Action', IN, 'mwk', {}, [0, 'UK', ['sports', 'sneakers', 'formal', 'sandals', 'school']]),
  b('paragon', 'Paragon', IN, 'mwk', {}, [0, 'UK', ['slides', 'sandals', 'formal']]),
  b('khadims', "Khadim's", IN, 'mwk', {}, [0, 'UK', ['formal', 'sneakers', 'sandals', 'slides', 'school', 'loafers']]),
  b('metro', 'Metro Shoes', IN, 'mw', {}, [0, 'UK', ['formal', 'sneakers', 'heels', 'flats', 'sandals', 'loafers']]),
  b('mochi', 'Mochi', IN, 'mw', {}, [0, 'UK', ['formal', 'heels', 'flats', 'sandals', 'loafers']]),
  b('red-chief', 'Red Chief', IN, 'm', {}, [0.1, 'UK', ['formal', 'boots', 'sneakers', 'sandals', 'loafers']]),
  b('bacca-bucci', 'Bacca Bucci', IN, 'm', {}, [-0.1, 'UK', ['boots', 'sneakers', 'formal', 'slides', 'loafers']]),
  b('neemans', "Neeman's", IN, 'mw', {}, [0, 'UK', ['sneakers', 'slides']]),
  b('asian', 'Asian', IN, 'mw', {}, [-0.1, 'UK', ['sports', 'sneakers']]),
  b('lee-cooper', 'Lee Cooper', UK, 'mw', {}, [0, 'UK', ['formal', 'sneakers', 'boots', 'sandals', 'loafers']]),
  b('hush-puppies', 'Hush Puppies', US, 'mw', {}, [0.1, 'UK', ['formal', 'sneakers', 'sandals', 'loafers']]),
  b('clarks', 'Clarks', UK, 'mwk', {}, [0, 'UK', ['formal', 'boots', 'sneakers', 'flats', 'sandals', 'school', 'loafers']]),
  b('crocs', 'Crocs', US, 'mwk', {}, [0.3, 'US', ['slides', 'sandals', 'clogs']]),
  b('birkenstock', 'Birkenstock', 'Germany', 'mwk', {}, [0.2, 'EU', ['sandals', 'slides']]),
  b('inc5', 'Inc.5', IN, 'w', {}, [0, 'UK', ['heels', 'flats', 'sandals']]),
  b('catwalk', 'Catwalk', IN, 'w', {}, [0, 'UK', ['heels', 'flats', 'sandals']]),
  b('carlton-london', 'Carlton London', UK, 'mw', {}, [0, 'UK', ['heels', 'flats', 'formal', 'sandals', 'loafers']]),
  b('aldo', 'Aldo', 'Canada', 'mw', {}, [0, 'UK', ['heels', 'flats', 'formal', 'sneakers', 'boots', 'loafers']]),
  b('steve-madden', 'Steve Madden', US, 'w', {}, [0, 'UK', ['heels', 'flats', 'sneakers', 'boots']]),

  // more of India's most-bought labels
  b('zudio', 'Zudio', IN, 'mwk', { t: 0.5, b: 0.5, d: 0.5, e: 0.5 }, [0, 'UK', ['sneakers', 'flats', 'sandals', 'slides', 'clogs', 'boots']]),
  b('westside', 'Westside', IN, 'mwk', { t: 0.5, b: 0.5, d: 0.5, e: 0.5 }, [0, 'UK', ['sneakers', 'heels', 'flats', 'sandals', 'boots']]),
  b('pantaloons', 'Pantaloons', IN, 'mwk', { t: 0.5, b: 0.5, d: 0.5, e: 0.5 }, [0, 'UK', ['sneakers', 'flats', 'sandals']]),
  b('jockey', 'Jockey', IN, 'mwk', { t: 0, b: 0 }, undefined, { not: ['shirts', 'jeans', 'skirts'] }),
  b('monte-carlo', 'Monte Carlo', IN, 'mwk', { t: 1, b: 1 }),
  b('park-avenue', 'Park Avenue', IN, 'm', { t: 1, b: 1 }, [0, 'UK', ['formal']]),
  b('blackberrys', 'Blackberrys', IN, 'm', { t: 0, b: 0 }, [0, 'UK', ['formal', 'sneakers']]),
  b('colorplus', 'ColorPlus', IN, 'm', { t: 1, b: 1 }),
  b('duke', 'Duke', IN, 'mk', { t: 0.5, b: 0.5 }),
  b('rare-rabbit', 'Rare Rabbit', IN, 'm', { t: -0.5, b: -0.5 }),
  b('dnmx', 'DNMX', IN, 'mwk', { t: 0, b: 0, d: 0 }),
  b('netplay', 'Netplay', IN, 'm', { t: 0, b: 0 }),
  b('rangriti', 'Rangriti', IN, 'w', { e: 0.5, d: 0.5, b: 0.5 }),
  b('walkaroo', 'Walkaroo', IN, 'mwk', {}, [0, 'UK', ['sandals', 'slides', 'sneakers', 'school', 'clogs']]),
  b('lancer', 'Lancer', IN, 'm', {}, [0, 'UK', ['sports', 'sandals', 'slides']]),
  b('vkc-pride', 'VKC Pride', IN, 'mwk', {}, [0, 'UK', ['sandals', 'slides', 'clogs']]),

  // innerwear and winter wear
  b('lux-cozi', 'Lux Cozi', IN, 'mwk', { i: 0 }),
  b('dollar', 'Dollar', IN, 'mk', { i: 0.5 }),
  b('rupa', 'Rupa', IN, 'mk', { i: 0.5 }),
  b('vip', 'VIP', IN, 'm', { i: 0 }),
  b('xyxx', 'XYXX', IN, 'm', { i: -0.5 }),
  b('damensch', 'Damensch', IN, 'm', { t: 0, i: 0 }, undefined, { not: ['shirts', 'polos', 'sweaters'] }),
  b('zivame', 'Zivame', IN, 'w', { i: 0 }),
  b('clovia', 'Clovia', IN, 'w', { i: 0 }),
  b('amante', 'Amante', IN, 'w', { i: 0 }),
  b('enamor', 'Enamor', IN, 'w', { i: 0 }),
  b('triumph', 'Triumph', 'Germany', 'w', { i: -0.5 }),

  // innerwear labels added on request (men's and women's)
  b('macroman', 'Macroman M-Series', IN, 'm', { i: -0.5 }),
  b('amul-macho', 'Amul Macho', IN, 'm', { i: 0.5 }),
  b('rupa-frontline', 'Rupa Frontline', IN, 'mk', { i: 0 }),
  b('dixcy-scott', 'Dixcy Scott', IN, 'mk', { i: 0 }),
  b('amul-comfy', 'Amul Comfy', IN, 'm', { i: 0.5 }, undefined, { not: ['boxers'] }),
  b('shera-gold', 'Shera Gold', IN, 'm', { i: 0.5 }, undefined, { not: ['briefs', 'trunks', 'boxers'] }),
  b('vimal', 'Vimal', IN, 'm', { i: 0.5 }, undefined, { not: ['trunks', 'boxers'] }),
  b('bummer', 'Bummer', IN, 'mw', { i: -0.5 }, undefined, { not: ['vests', 'camisoles'] }),
  b('ramraj', 'Ramraj Cotton', IN, 'mk', { i: 0.5 }, undefined, { not: ['boxers'] }),
  b('bodycare', 'Bodycare', IN, 'mwk', { i: 0 }),
  b('shyaway', 'Shyaway', IN, 'w', { i: 0 }),
  b('prettysecrets', 'PrettySecrets', IN, 'w', { i: -0.5 }),
  b('groversons', 'Groversons Paris Beauty', IN, 'w', { i: 0 }),
  b('lovable', 'Lovable', IN, 'w', { i: 0 }),
  b('rupa-softline', 'Rupa Softline', IN, 'wk', { i: 0 }),
  b('inner-sense', 'Inner Sense', IN, 'w', { i: 0 }),
  b('fort-collins', 'Fort Collins', IN, 'mw', { w: 1 }),
  b('wildcraft', 'Wildcraft', IN, 'mwk', { w: 0.5 }, [0, 'UK', ['sports', 'boots', 'sandals']]),

  // added on request: D2C, ethnic and gymwear labels
  b('anouk', 'Anouk', IN, 'w', { e: 0, d: 0, b: 0 }),
  b('allen-cooper', 'Allen Cooper', IN, 'm', { t: 0.5, b: 0.5 }, [0, 'UK', ['sneakers', 'formal', 'loafers', 'boots', 'sandals']]),
  b('banana-club', 'Banana Club', IN, 'm', { t: 0, b: 0 }),
  b('beyoung', 'Beyoung', IN, 'mw', { t: 0.5, b: 0 }),
  b('cahoot', 'Cahoot', IN, 'm', { t: 0.5, b: 0 }),
  b('dennis-lingo', 'Dennis Lingo', IN, 'm', { t: 0, b: 0 }),
  b('coitonic', 'Coitonic', IN, 'mw', { t: 0, b: 0 }, undefined, { not: ['trousers', 'polos'] }),
  b('fuaark', 'Fuaark', IN, 'mw', { t: -0.5, b: 0 }, undefined, { not: ['trousers', 'polos'] }),
  b('invictus', 'Invictus', IN, 'm', { t: 0, b: 0 }),
  b('integriti', 'Integriti', IN, 'm', { t: 0.5, b: 0 }),
  b('jompers', 'Jompers', IN, 'm', { e: 0.5 }),
  b('kook-n-keech', 'Kook N Keech', IN, 'mw', { t: 1, b: 0.5 }),
  b('prada', 'Prada', 'Italy', 'mw', { t: -1, b: -1, d: -1 }, [0.2, 'EU', ['sneakers', 'formal', 'loafers', 'boots', 'heels', 'flats', 'sandals']]),
  b('pantaloons-baby', 'Pantaloons Baby', IN, 'k', { t: 0, b: 0, d: 0 }, [0, 'UK', ['sneakers', 'sandals']]),
  b('provogue', 'Provogue', IN, 'm', { t: 0.5, b: 0.5 }, [0, 'UK', ['sneakers', 'formal']]),
  b('people', 'People', IN, 'm', { t: 0.5, b: 0 }, [0, 'UK', ['sneakers', 'slides']]),
  b('reid-taylor', 'Reid & Taylor', IN, 'm', { t: 1, b: 1 }),
  b('r-code', 'R.Code by The Roadster Life Co.', IN, 'mw', { t: 0.5, b: 0 }),
  b('tattva', 'TATTVA', IN, 'm', { e: 0.5 }),
  b('turtle', 'Turtle', IN, 'm', { t: 0.5, b: 0.5 }),
  b('vastramay', 'Vastramay', IN, 'mk', { e: 0.5 }),
  b('vastrado', 'Vastrado', IN, 'm', { e: 0.5 }),
  b('urban-monkey', 'Urban Monkey', IN, 'mw', { t: 1 }),
]

/*
 * Official charts, copied from the brands' own websites. Every other chart is an estimate.
 */
/** Coitonic size chart page: chest and waist in inches, S to XXL. */
const COITONIC = 'https://www.coitonic.com/pages/size-chart'
const COITONIC_CHEST = fromPoints(['S', 'M', 'L', 'XL', 'XXL'], [36, 38, 40, 42, 44], 'in')
const COITONIC_WAIST = fromPoints(['S', 'M', 'L', 'XL', 'XXL'], [30, 32, 34, 36, 38], 'in')
/** Fuaark's men's T-shirt guide gives the garment chest; the body fits 4 inches less (the same ease Manyavar publishes). */
const FUAARK = 'https://fuaark.com/blogs/insider-tips-and-trends/men-s-t-shirt-size-guide-picking-the-right-fit'
const FUAARK_TEES = fromPoints(['XS', 'S', 'M', 'L', 'XL'], [40, 42, 44, 46, 48].map((g) => g - 4), 'in')
/** Manyavar kurta body measurements: chest in inches, S (36) to 6XL (52). */
const MANYAVAR = 'https://www.manyavar.com/en-in/only-kurta/regal-wine-kurta/UC165352.html'
const MANYAVAR_KURTAS = fromPoints(
  ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', '4XL', '5XL', '6XL'],
  [36, 38, 40, 42, 44, 46, 48, 50, 52],
  'in',
)

const JOCKEY_BRAS = 'https://www.jockey.in/pages/bra-size-calculator'
const JOCKEY_BANDS: Range[] = [
  { label: '30', min: 63, max: 67 },
  { label: '32', min: 68, max: 72 },
  { label: '34', min: 73, max: 77 },
  { label: '36', min: 78, max: 82 },
  { label: '38', min: 83, max: 87 },
  { label: '40', min: 88, max: 92 },
  { label: '42', min: 93, max: 97 },
]
/** Clovia bra size calculator: band by underbust, cm. */
const CLOVIA_BRAS = 'https://www.clovia.com/bra-size-calculator/'
const CLOVIA_BANDS: Range[] = [
  { label: '28', min: 58.5, max: 63.5 },
  { label: '30', min: 63.5, max: 68.5 },
  { label: '32', min: 68.5, max: 73.5 },
  { label: '34', min: 73.5, max: 78.5 },
  { label: '36', min: 78.5, max: 84 },
  { label: '38', min: 84, max: 89 },
  { label: '40', min: 89, max: 94 },
  { label: '42', min: 94, max: 99 },
  { label: '44', min: 99, max: 104 },
]
/**
 * Rupa Frontline product catalogue (Dec 2024): every product page prints its sizes in cm, the wearer's
 * waist for briefs, drawers and trunks and the chest for vests, 5 cm apart.
 */
const RUPA = 'https://rupa.co.in/frontline_catalouge/pdf/RFL-Catalogue-dec24.pdf'
const RUPA_WAIST = fromPoints(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'], [75, 80, 85, 90, 95, 100, 105, 110], 'cm')
const RUPA_VESTS = fromPoints(['2XS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'], [70, 75, 80, 85, 90, 95, 100, 105, 110], 'cm')
const RUPA_NOTE = 'Rupa prints one cm size per label; each size covers 2.5 cm either side'
const rupaCharts = (): OfficialChart[] => [
  { audience: 'men', garment: 'briefs', source: RUPA, rows: RUPA_WAIST, note: RUPA_NOTE },
  { audience: 'men', garment: 'trunks', source: RUPA, rows: RUPA_WAIST, note: RUPA_NOTE },
  { audience: 'men', garment: 'longtrunks', source: RUPA, rows: RUPA_WAIST, note: RUPA_NOTE },
  { audience: 'men', garment: 'vests', source: RUPA, rows: RUPA_VESTS, note: RUPA_NOTE },
]

/** XYXX size guide: briefs and trunks by waist (cm), vests by chest (inches). */
const XYXX = 'https://www.xyxxcrew.com/pages/size-guide'
const XYXX_WAIST: Range[] = [
  { label: 'S', min: 70, max: 75 },
  { label: 'M', min: 80, max: 85 },
  { label: 'L', min: 90, max: 95 },
  { label: 'XL', min: 100, max: 105 },
  { label: '2XL', min: 110, max: 115 },
  { label: '3XL', min: 120, max: 125 },
  { label: '4XL', min: 130, max: 135 },
  { label: '5XL', min: 140, max: 145 },
]
const XYXX_VESTS: Range[] = [
  [32, 34],
  [36, 38],
  [40, 42],
  [44, 46],
  [48, 50],
].map(([lo, hi], i) => ({ label: ['S', 'M', 'L', 'XL', 'XXL'][i], min: lo * 2.54, max: hi * 2.54 }))

const OFFICIAL: Record<string, OfficialChart[]> = {
  coitonic: [
    { audience: 'men', garment: 'tshirts', source: COITONIC, rows: COITONIC_CHEST },
    { audience: 'men', garment: 'sweatshirts', source: COITONIC, rows: COITONIC_CHEST },
    { audience: 'men', garment: 'hoodies', source: COITONIC, rows: COITONIC_CHEST },
    { audience: 'men', garment: 'trackpants', source: COITONIC, rows: COITONIC_WAIST },
    { audience: 'men', garment: 'shorts', source: COITONIC, rows: COITONIC_WAIST },
  ],
  fuaark: [
    {
      audience: 'men',
      garment: 'tshirts',
      source: FUAARK,
      rows: FUAARK_TEES,
      note: 'Fuaark lists the garment chest; body sizes allow 4 in ease',
    },
  ],
  manyavar: [
    {
      audience: 'men',
      garment: 'kurtas',
      source: MANYAVAR,
      rows: MANYAVAR_KURTAS,
      note: 'Body chest from the kurta size chart; garments run 4 in larger',
    },
  ],
  // band size by underbust in cm, as published (the cup comes from the overbust)
  jockey: BAND_BRAS.map((garment) => ({ audience: 'women' as Audience, garment, source: JOCKEY_BRAS, rows: JOCKEY_BANDS })),
  clovia: BAND_BRAS.map((garment) => ({ audience: 'women' as Audience, garment, source: CLOVIA_BRAS, rows: CLOVIA_BANDS })),
  rupa: rupaCharts(),
  'rupa-frontline': rupaCharts(),
  xyxx: [
    { audience: 'men', garment: 'briefs', source: XYXX, rows: XYXX_WAIST },
    { audience: 'men', garment: 'trunks', source: XYXX, rows: XYXX_WAIST },
    { audience: 'men', garment: 'vests', source: XYXX, rows: XYXX_VESTS },
  ],
  libas: [
    {
      audience: 'women',
      garment: 'kurtis',
      source: 'https://www.libas.in/pages/size-chart',
      // Kurta & Kurti size chart, bust in inches
      rows: fromPoints(['XS', 'S', 'M', 'L', 'XL', 'XXL'], [34, 36, 38, 40, 42, 44], 'in'),
    },
  ],
  ms: [
    {
      audience: 'women',
      garment: 'tops',
      source: 'https://www.marksandspencer.in/sizeguides/?cid=sizeguidewomens-tops',
      // Women's tops size guide, bust in cm (UK sizes 6 to 26)
      rows: fromPoints(
        ['UK 6', 'UK 8', 'UK 10', 'UK 12', 'UK 14', 'UK 16', 'UK 18', 'UK 20', 'UK 22', 'UK 24', 'UK 26'],
        [78, 82, 87, 92, 97, 102.5, 108, 114, 120, 126, 132],
        'cm',
      ),
    },
  ],
}
for (const brand of BRANDS) if (OFFICIAL[brand.id]) brand.official = OFFICIAL[brand.id]

const audienceOf = (cat: Category): Audience => (isKids(cat) ? 'kids' : (cat as Audience))

/** The official chart for this group and item, if the brand publishes one naapo has read. */
export function officialChart(brand: Brand, cat: Category, g: Garment): OfficialChart | null {
  return brand.official?.find((c) => c.audience === audienceOf(cat) && c.garment === g && !isKids(cat)) ?? null
}

export function brandChart(brand: Brand, cat: Category, g: Garment): Range[] | null {
  const offset = brand.offsets[g]
  if (offset === undefined) return null
  if (!brand.audience.includes(audienceOf(cat))) return null
  if (!GARMENTS[cat].includes(g)) return null
  const official = officialChart(brand, cat, g)
  if (official) return official.rows.map((r) => ({ ...r }))
  const sys = brand.shoeSystem ?? 'EU'
  let base = baseChart(cat, g)
  if (isFootwear(g) && WHOLE_SIZES.includes(g)) {
    // whole sizes only; each one stretches to meet the next, so the half sizes between fold in
    const whole = base.filter((r) => /^\d+$/.test(r.systems![sys].replace(/[CY]$/, '')))
    base = whole.map((r, i) => ({ ...r, max: i < whole.length - 1 ? whole[i + 1].min : r.max + (r.max - r.min) }))
  }
  return base.map((r) => {
    const shifted: Range = { ...r, min: r.min + offset, max: r.max + offset }
    if (r.systems) {
      shifted.label = `${sys} ${r.systems[sys]}`
      shifted.sub = (['US', 'UK', 'EU'] as ShoeSystem[])
        .filter((s) => s !== sys)
        .map((s) => `${systemName(s)} ${r.systems![s]}`)
        .join(' · ')
    } else if (cat === 'women' && g === 'trousers' && brand.euBottoms) {
      const i = LETTERS.indexOf(r.label)
      shifted.label = `EU ${EU_WOMEN[i]}`
      shifted.sub = r.label
    }
    return shifted
  })
}

export type MatchStatus = 'fit' | 'between' | 'below' | 'above'

export function matchSize(chart: Range[], m: number): { index: number; status: MatchStatus } {
  const last = chart.length - 1
  if (m < chart[0].min) return { index: 0, status: 'below' }
  if (m >= chart[last].max) return { index: last, status: 'above' }
  let index = chart.findIndex((r) => m >= r.min && m < r.max)
  // whole-size charts leave gaps between sizes: take the nearest size up
  if (index === -1) index = chart.findIndex((r) => r.min > m)
  const r = chart[index]
  const pos = (m - r.min) / (r.max - r.min)
  return { index, status: pos > 0.8 && index < last ? 'between' : 'fit' }
}

export type Tendency = 'Runs small' | 'True to size' | 'Runs large'

export function fitTendency(brand: Brand, g: Garment): Tendency {
  const o = brand.offsets[g] ?? 0
  const t = isFootwear(g) ? 0.2 : 1
  if (o <= -t) return 'Runs small'
  if (o >= t) return 'Runs large'
  return 'True to size'
}

/** The garments a brand sizes for one group. */
export function brandGarments(brand: Brand, cat: Category): Garment[] {
  return GARMENTS[cat].filter((g) => brandChart(brand, cat, g) !== null)
}

/** Does the brand make anything for this group? */
export const brandServes = (brand: Brand, cat: Category) => brandGarments(brand, cat).length > 0

export const brandById = (id: string) => BRANDS.find((b) => b.id === id)

export const AUDIENCE_LABEL: Record<Audience, string> = { men: 'Men', women: 'Women', kids: 'Kids' }

/**
 * Someone wears size `fromIndex` of `from`; which size of `to` fits them the same way?
 * Takes the middle of the size they wear and finds it on the other brand's chart.
 */
export function convertSize(from: Brand, to: Brand, cat: Category, g: Garment, fromIndex: number) {
  const fromChart = brandChart(from, cat, g)
  const toChart = brandChart(to, cat, g)
  if (!fromChart || !toChart) return null
  const fromSize = fromChart[Math.min(fromIndex, fromChart.length - 1)]
  const body = (fromSize.min + fromSize.max) / 2
  const match = matchSize(toChart, body)
  const diff = (to.offsets[g] ?? 0) - (from.offsets[g] ?? 0)
  const t = isFootwear(g) ? 0.2 : 1
  // with an official chart on either side the estimate offsets say nothing about the real cut
  const official = officialChart(from, cat, g) || officialChart(to, cat, g)
  const relative: 'smaller' | 'larger' | 'same' | 'unknown' = official
    ? 'unknown'
    : diff <= -t
      ? 'smaller'
      : diff >= t
        ? 'larger'
        : 'same'
  return { body, fromSize, fromChart, toChart, ...match, toSize: toChart[match.index], relative }
}
