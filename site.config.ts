/**
 * naapo's own address (it has its own domain; it is a Trivasite product, not part of trivasite.co.in).
 * Used for canonical links, the sitemap, robots.txt, llms.txt and structured data. Picked in this order:
 *   1. SITE_URL, if set: e.g. SITE_URL=https://naapo.in in the host's environment variables
 *   2. Vercel's production domain (your custom domain once added, else the project's .vercel.app address)
 *   3. Netlify's site address (on Cloudflare Pages, set SITE_URL: its own variable names each deploy, not the site)
 *   4. localhost, for builds on your own computer (with a warning, so it is never deployed by mistake)
 */
function siteUrl() {
  const env = process.env
  const found =
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    (env.NETLIFY && env.URL)
  if (found) return found.replace(/\/+$/, '')
  if (env.NODE_ENV === 'production' || process.argv.includes('build'))
    console.warn('\n[naapo] SITE_URL is not set: links in the sitemap and llms.txt use http://localhost:4173. Set SITE_URL before deploying.\n')
  return 'http://localhost:4173'
}
export const SITE_URL = siteUrl()

/** When the size data last changed: the sitemap's lastmod and the date in llms-full.txt. Bump it with each data update. */
export const SITE_UPDATED = '2026-11-15'

export const SITE_NAME = 'naapo'
export const SITE_TAGLINE = 'Same you, every brand.'
export const SITE_DESCRIPTION =
  'Compare clothing and footwear sizes across Indian and international brands for men, women, boys, girls and kids, and find the right size before you buy.'
export const TRIVASITE = 'https://www.trivasite.co.in/'
export const TRIVASITE_ABOUT = 'https://www.trivasite.co.in/about'
