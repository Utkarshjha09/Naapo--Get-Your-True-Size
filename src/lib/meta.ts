const DEFAULT_TITLE = 'naapo — Same you, every brand.'
const DEFAULT_DESCRIPTION =
  'Compare clothing and footwear sizes across Indian and international brands for men, women, boys, girls and kids, and find the right size before you buy.'

function tag(selector: string, create: () => HTMLElement) {
  let el = document.head.querySelector<HTMLElement>(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  return el
}

/** Title, description, canonical link and share tags for the page on screen. */
export function setMeta({
  title,
  description,
  path,
  noindex = false,
}: {
  title?: string
  description?: string
  path: string
  /** keep this page out of search results (not-found pages) */
  noindex?: boolean
}) {
  const t = title ?? DEFAULT_TITLE
  const d = description ?? DEFAULT_DESCRIPTION
  const url = `${__SITE_URL__}${path}`
  document.title = t
  const meta = (attr: 'name' | 'property', key: string, content: string) =>
    tag(`meta[${attr}="${key}"]`, () => {
      const m = document.createElement('meta')
      m.setAttribute(attr, key)
      return m
    }).setAttribute('content', content)
  meta('name', 'description', d)
  meta('property', 'og:title', t)
  meta('property', 'og:description', d)
  meta('property', 'og:url', url)
  const robots = document.head.querySelector('meta[name="robots"]')
  if (noindex) tag('meta[name="robots"]', () => {
    const m = document.createElement('meta')
    m.setAttribute('name', 'robots')
    return m
  }).setAttribute('content', 'noindex')
  else robots?.remove()
  tag('link[rel="canonical"]', () => {
    const l = document.createElement('link')
    l.setAttribute('rel', 'canonical')
    return l
  }).setAttribute('href', url)
}
