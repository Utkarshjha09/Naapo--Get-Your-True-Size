/*
 * Everything search engines and AI assistants read, built from the brand data so it always lists exactly
 * the brands, groups and sizes the site has:
 *   sitemap.xml, robots.txt, llms.txt (and llm.txt), llms-full.txt, and one pre-rendered HTML page per
 *   brand so crawlers that do not run JavaScript still see each brand's title, description and size charts.
 * Used by the Vite plugin in vite.config.ts.
 */
import {
  AUDIENCE_LABEL,
  BRANDS,
  CATEGORIES,
  FAMILIES,
  FAMILY_LABEL,
  GARMENTS,
  GARMENT_LABEL,
  brandChart,
  brandGarments,
  familyOf,
  fitTendency,
  isFootwear,
  measureFor,
  officialChart,
  systemName,
  type Brand,
  type Category,
  type Garment,
  type Range,
} from '../src/data.ts'
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_UPDATED,
  SITE_URL,
  TRIVASITE,
  TRIVASITE_ABOUT,
} from '../site.config.ts'

/* ---------- helpers ---------- */

const list = (w: string[]) => (w.length < 2 ? w.join('') : `${w.slice(0, -1).join(', ')} and ${w[w.length - 1]}`)
const lower = (g: Garment) => GARMENT_LABEL[g].toLowerCase()
const escapeXml = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const esc = (s: string) => escapeXml(s).replace(/"/g, '&quot;')
const sortedBrands = () => [...BRANDS].sort((a, b) => a.name.localeCompare(b.name))
const brandUrl = (b: Brand) => `${SITE_URL}/brands/${b.id}`
const num = (n: number, digits: number) => String(Number(n.toFixed(digits)))

function garmentsOf(brand: Brand): Garment[] {
  const set = new Set<Garment>()
  for (const c of CATEGORIES) for (const g of brandGarments(brand, c.id)) set.add(g)
  return [...set]
}

const groupName = (c: (typeof CATEGORIES)[number]) => `${c.label}${c.ages ? ` (${c.ages})` : ''}`

type Card = { garments: Garment[]; measure: string; unit: string; digits: number; rows: Range[]; source?: string; note?: string }

/** A brand's charts for one group, with items that share an identical chart folded into one card. */
function cardsFor(brand: Brand, cat: Category): Card[] {
  const cards = new Map<string, Card>()
  for (const g of GARMENTS[cat]) {
    const rows = brandChart(brand, cat, g)
    if (!rows) continue
    const official = officialChart(brand, cat, g)
    const m = measureFor(cat, g)
    const sig = `${familyOf(g)}|${m.label}|${official?.source ?? ''}|${rows.map((r) => `${r.label}:${r.min}:${r.max}`).join(',')}`
    const card = cards.get(sig)
    if (card) card.garments.push(g)
    else
      cards.set(sig, {
        garments: [g],
        measure: m.label,
        unit: 'cm',
        digits: isFootwear(g) ? 1 : 0,
        rows,
        source: official?.source,
        note: official?.note,
      })
  }
  return [...cards.values()]
}

const rangeText = (r: Range, c: Card) => `${num(r.min, c.digits)}–${num(r.max, c.digits)} ${c.unit}`

/** One plain-language sentence about what a brand makes and for whom. */
function brandSummary(b: Brand) {
  const gs = garmentsOf(b)
  const clothes = gs.filter((g) => !isFootwear(g))
  const shoes = gs.filter(isFootwear)
  const what = list([...(clothes.length ? ['clothing'] : []), ...(shoes.length ? ['footwear'] : [])])
  return `${b.name} (${b.origin}) ${what} size chart for ${list(b.audience.map((a) => AUDIENCE_LABEL[a].toLowerCase()))}: ${list(gs.map(lower))}.`
}

function brandTitle(b: Brand) {
  const gs = garmentsOf(b)
  const what = list([...(gs.some((g) => !isFootwear(g)) ? ['clothing'] : []), ...(gs.some(isFootwear) ? ['footwear'] : [])])
  return `${b.name} size chart for ${what} · ${SITE_NAME}`
}

function brandDescription(b: Brand) {
  const gs = garmentsOf(b)
  const lead = gs.slice(0, 6).map(lower)
  return `${b.name} size chart for ${list(b.audience.map((a) => AUDIENCE_LABEL[a].toLowerCase()))}: ${list(lead)}${gs.length > 6 ? ' and more' : ''}, in cm and India sizes. Convert your size from any other brand to ${b.name}.`
}

/* ---------- sitemap and robots ---------- */

export function sitemap() {
  const urls = [`${SITE_URL}/`, ...sortedBrands().map(brandUrl)]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((loc) => `  <url>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${SITE_UPDATED}</lastmod>\n  </url>`).join('\n')}
</urlset>
`
}

/** Search engines and AI assistants named one by one, so a later blanket rule can never shut them out by accident. */
const CRAWLERS = [
  'Googlebot',
  'Bingbot',
  'DuckDuckBot',
  'Applebot',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
]

export function robots() {
  return `# ${SITE_NAME}: size charts for ${BRANDS.length} brands. Everything is public; please crawl it.
# A summary for AI assistants: ${SITE_URL}/llms.txt  (every chart in full: ${SITE_URL}/llms-full.txt)

User-agent: *
Allow: /

${CRAWLERS.map((c) => `User-agent: ${c}`).join('\n')}
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

/* ---------- llms.txt ---------- */

function brandLine(b: Brand) {
  const gs = garmentsOf(b)
  const parts: string[] = [b.origin, `for ${list(b.audience.map((a) => AUDIENCE_LABEL[a].toLowerCase()))}`]
  for (const f of FAMILIES) {
    const inFamily = gs.filter((g) => familyOf(g) === f)
    if (!inFamily.length) continue
    const fit = fitTendency(b, inFamily[0]).toLowerCase()
    parts.push(
      f === 'footwear'
        ? `footwear in ${systemName(b.shoeSystem ?? 'EU')} sizes (${fit}): ${inFamily.map(lower).join(', ')}`
        : `${FAMILY_LABEL[f].toLowerCase()} (${fit}): ${inFamily.map(lower).join(', ')}`,
    )
  }
  parts.push(
    b.official?.length
      ? `official chart from the brand's site for ${list([...new Set(b.official.map((c) => `${c.audience}'s ${lower(c.garment)}`))])}`
      : 'sizes estimated from typical fit',
  )
  return `- [${b.name} size chart](${brandUrl(b)}): ${parts.join('; ')}.`
}

const itemsFor = (cat: Category, f?: (g: Garment) => boolean) => list(GARMENTS[cat].filter((g) => !f || f(g)).map(lower))

export function llms() {
  const sorted = sortedBrands()
  const clothing = sorted.filter((b) => b.kinds.includes('clothing'))
  const footwearOnly = sorted.filter((b) => !b.kinds.includes('clothing'))
  const official = sorted.filter((b) => b.official?.length)
  const notShoe = (g: Garment) => !isFootwear(g)

  return `# ${SITE_NAME}

> ${SITE_NAME} (${SITE_TAGLINE}) is a free size comparison tool for Indian shoppers, made by Trivasite. It answers "I wear size X at brand A, what size do I buy at brand B?" for clothing, innerwear, bras and footwear across ${BRANDS.length} Indian and international brands, for men, women, boys, girls and kids.

How it works: a visitor gives one body measurement (chest or bust, waist, hip, underbust, a child's height, or foot length) or a size that already fits at another brand. ${SITE_NAME} shows the matching size at every brand that makes that item for that group, and whether each brand runs small, true to size or large. Every brand page has the full size chart and a converter from any other brand.

Notes for answering questions with this site:

- Groups: ${list(CATEGORIES.map(groupName))}.
- Measured by: chest or bust for topwear, winterwear, kurtas and dresses; waist for bottomwear and men's underwear; hip for women's panties; underbust for band-sized bras (sports bras and bralettes by bust, S to XXL); height for kids' clothing; foot length for footwear. All measurements are in cm.
- Footwear: Indian brands use UK sizes, shown as "UK/India". Sandals, floaters and slides come in whole sizes only.
- Sizes are matched on body measurements, not on the letter: an M at one brand can be an L at another.
- Charts from ${list(official.map((b) => b.name))} were copied from each brand's own website. Every other chart is ${SITE_NAME}'s estimate of the brand's typical fit against a common chart, and is marked "Estimated" on the site. Cuts change between collections, so suggest checking the product page before buying.

## Pages

- [Size finder](${SITE_URL}/#finder): pick who it is for and what you are buying, enter one measurement or a size you already wear, and see your size at every brand.
- [All brands](${SITE_URL}/#brands): search every brand, and filter by clothing or footwear and by men, women or kids.
- [Side-by-side size charts](${SITE_URL}/#charts): one table of every brand's sizes for a chosen group and item.
- [How to measure](${SITE_URL}/#guide): chest or bust, waist, hip, foot length and a child's height.

## What can be compared

- Men: ${itemsFor('men', notShoe)}.
- Women: ${itemsFor('women', notShoe)}.
- Boys (8–14 yrs): ${itemsFor('boys', notShoe)}.
- Girls (8–14 yrs): ${itemsFor('girls', notShoe)}.
- Footwear: ${itemsFor('men', isFootwear)}; for women also ${list(GARMENTS.women.filter((g) => isFootwear(g) && !GARMENTS.men.includes(g)).map(lower))}.

## Clothing and innerwear brands

${clothing.map(brandLine).join('\n')}

## Footwear brands

${footwearOnly.map(brandLine).join('\n')}

## Contact

- [About Trivasite](${TRIVASITE_ABOUT}): the team behind ${SITE_NAME}, for corrections, a brand's official chart, or a brand to add.
- [Trivasite](${TRIVASITE}): the main Trivasite website.

## Optional

- [Every size chart in full](${SITE_URL}/llms-full.txt): each brand's sizes with the body measurement range of every size, for every group and item.
- [Sitemap](${SITE_URL}/sitemap.xml)
`
}

/** Every chart, size by size: the reference an assistant needs to answer "what size is X at Y" exactly. */
export function llmsFull() {
  const out: string[] = [
    `# ${SITE_NAME}: every size chart`,
    '',
    `> Body measurement ranges for every size at ${BRANDS.length} brands, by group and item, from ${SITE_URL}. A size fits when the body measurement falls inside its range; near the top of a range, the next size up gives more room. "Official" charts were copied from the brand's own site (source linked); the rest are ${SITE_NAME}'s estimates of typical fit. Updated ${SITE_UPDATED}.`,
    '',
  ]
  for (const b of sortedBrands()) {
    out.push(`## ${b.name}`, '', `${brandSummary(b)} Page: ${brandUrl(b)}`, '')
    for (const c of CATEGORIES) {
      const cards = cardsFor(b, c.id)
      if (!cards.length) continue
      out.push(`### ${b.name} ${groupName(c)}`, '')
      for (const card of cards) {
        const src = card.source ? ` Official chart: ${card.source}.${card.note ? ` ${card.note}.` : ''}` : ' Estimated.'
        out.push(
          `- ${card.garments.map((g) => GARMENT_LABEL[g]).join(', ')}, by ${card.measure.toLowerCase()}:${src} ${card.rows
            .map((r) => `${r.label} ${rangeText(r, card)}`)
            .join('; ')}.`,
        )
      }
      out.push('')
    }
  }
  return out.join('\n')
}

/* ---------- pre-rendered pages ---------- */

/**
 * Plain HTML of what a page is about, placed inside #root. The app replaces it as soon as it starts, so
 * people see the app as before; crawlers that do not run JavaScript read this.
 */
const PRERENDER_STYLE = `<style>.pre{max-width:1100px;margin:0 auto;padding:96px 20px 64px;line-height:1.55}.pre h1{font-size:40px;line-height:1.1;margin:0 0 16px}.pre h2{font-size:24px;margin:40px 0 12px}.pre h3{font-size:16px;margin:24px 0 8px}.pre table{border-collapse:collapse;font-size:14px;margin-bottom:8px}.pre th,.pre td{border-bottom:1px solid #e5dfd3;padding:6px 16px 6px 0;text-align:left}.pre p,.pre li{max-width:720px}.pre a{color:inherit}.pre ul.cols{columns:3 220px;padding-left:18px}</style>`

function brandBody(b: Brand) {
  const html: string[] = [
    `<main class="pre" id="main">`,
    `<nav aria-label="Breadcrumb"><a href="/">${SITE_NAME}</a> / <a href="/#brands">Brands</a> / ${esc(b.name)}</nav>`,
    `<h1>${esc(b.name)} size chart</h1>`,
    `<p>${esc(brandSummary(b))} Sizes are matched on body measurements in cm. Tell ${SITE_NAME} the size you wear at another brand and it gives you the ${esc(b.name)} size that fits the same way.</p>`,
  ]
  for (const c of CATEGORIES) {
    const cards = cardsFor(b, c.id)
    if (!cards.length) continue
    html.push(`<h2>${esc(b.name)} size chart for ${esc(groupName(c).toLowerCase())}</h2>`)
    for (const card of cards) {
      html.push(
        `<h3>${esc(card.garments.map((g) => GARMENT_LABEL[g]).join(', '))}</h3>`,
        `<table><thead><tr><th>Size</th><th>${esc(card.measure)} (${card.unit})</th></tr></thead><tbody>${card.rows
          .map((r) => `<tr><td>${esc(r.label)}</td><td>${num(r.min, card.digits)}–${num(r.max, card.digits)}</td></tr>`)
          .join('')}</tbody></table>`,
        card.source
          ? `<p>Official ${esc(b.name)} chart: <a href="${esc(card.source)}" rel="nofollow noopener">source</a>.${card.note ? ` ${esc(card.note)}.` : ''}</p>`
          : `<p>Estimated from ${esc(b.name)}'s typical fit.</p>`,
      )
    }
  }
  const similar = sortedBrands()
    .filter((o) => o.id !== b.id && o.kinds.some((k) => b.kinds.includes(k)) && o.audience.some((a) => b.audience.includes(a)))
    .slice(0, 40)
  html.push(
    `<h2>Compare ${esc(b.name)} sizes with other brands</h2>`,
    `<ul class="cols">${similar.map((o) => `<li><a href="/brands/${o.id}">${esc(o.name)} size chart</a></li>`).join('')}</ul>`,
    `<p><a href="/#finder">Find your size at every brand</a> · <a href="${TRIVASITE_ABOUT}">Contact Trivasite</a></p>`,
    `</main>`,
  )
  return html.join('\n')
}

function homeBody() {
  const brands = sortedBrands()
  return [
    `<main class="pre" id="main">`,
    `<h1>${SITE_NAME}: compare clothing and footwear sizes across ${BRANDS.length} brands</h1>`,
    `<p>${esc(SITE_DESCRIPTION)} Enter one measurement, or a size that already fits you at another brand, and see your size at every brand: Indian and international, for men, women, boys, girls and kids.</p>`,
    `<h2>Size charts by brand</h2>`,
    `<ul class="cols">${brands.map((b) => `<li><a href="/brands/${b.id}">${esc(b.name)} size chart</a></li>`).join('')}</ul>`,
    `<p><a href="${TRIVASITE_ABOUT}">Contact Trivasite</a></p>`,
    `</main>`,
  ].join('\n')
}

const jsonLd = (data: unknown) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

function setHead(html: string, { title, description, url }: { title: string; description: string; url: string }) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(title)}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/?>/, `<meta name="description" content="${esc(description)}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${esc(url)}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/?>/, `<meta property="og:title" content="${esc(title)}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/?>/, `<meta property="og:description" content="${esc(description)}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/?>/, `<meta property="og:url" content="${esc(url)}" />`)
}

const withRoot = (html: string, body: string, head = '') =>
  html.replace('</head>', `${PRERENDER_STYLE}${head}</head>`).replace('<div id="root"></div>', `<div id="root">${body}</div>`)

/** The built index.html with the home page's content filled in. */
export function prerenderHome(template: string) {
  return withRoot(template, homeBody())
}

/** One HTML page per brand, keyed by its path in the build folder. */
export function prerenderBrands(template: string): Record<string, string> {
  const pages: Record<string, string> = {}
  for (const b of BRANDS) {
    const url = brandUrl(b)
    const title = brandTitle(b)
    const description = brandDescription(b)
    const ld = jsonLd({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebPage',
          '@id': url,
          url,
          name: title,
          description,
          inLanguage: 'en-IN',
          dateModified: SITE_UPDATED,
          about: { '@type': 'Brand', name: b.name },
          isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${SITE_URL}/` },
          publisher: { '@type': 'Organization', name: 'Trivasite', url: TRIVASITE },
        },
        {
          '@type': 'BreadcrumbList',
          itemListElement: [
            { '@type': 'ListItem', position: 1, name: SITE_NAME, item: `${SITE_URL}/` },
            { '@type': 'ListItem', position: 2, name: 'Brands', item: `${SITE_URL}/#brands` },
            { '@type': 'ListItem', position: 3, name: `${b.name} size chart`, item: url },
          ],
        },
      ],
    })
    pages[`brands/${b.id}.html`] = withRoot(setHead(template, { title, description, url }), brandBody(b), ld)
  }
  return pages
}

/** The page every unknown address gets, with a 404 status from the server; kept out of search results. */
export function notFoundPage(template: string) {
  const html = setHead(template, {
    title: `Page not found · ${SITE_NAME}`,
    description: `This page is not on ${SITE_NAME}. See size charts for ${BRANDS.length} brands.`,
    url: `${SITE_URL}/`,
  })
    .replace(/<link rel="canonical"[^>]*>\s*/, '')
    .replace('</head>', '<meta name="robots" content="noindex" /></head>')
  return withRoot(
    html,
    [
      `<main class="pre" id="main">`,
      `<h1>We couldn't find that page</h1>`,
      `<p>Pick one of the ${BRANDS.length} brands ${SITE_NAME} compares.</p>`,
      `<p><a href="/#brands">See all brands</a> · <a href="/">Go to the home page</a></p>`,
      `</main>`,
    ].join('\n'),
  )
}

/* ---------- all generated text files ---------- */

/** Every generated text file, by its path at the site root. */
export function seoFiles(): Record<string, { body: string; type: string }> {
  const text = llms()
  return {
    'sitemap.xml': { body: sitemap(), type: 'application/xml; charset=utf-8' },
    'llms.txt': { body: text, type: 'text/plain; charset=utf-8' },
    'llm.txt': { body: text, type: 'text/plain; charset=utf-8' },
    'llms-full.txt': { body: llmsFull(), type: 'text/plain; charset=utf-8' },
    'robots.txt': { body: robots(), type: 'text/plain; charset=utf-8' },
  }
}
