/**
 * The address the site is published at. Used for the sitemap, llms.txt, robots.txt and
 * canonical links. Set SITE_URL when building, or change the fallback here.
 */
export const SITE_URL = (process.env.SITE_URL ?? 'https://naapo.trivasite.co.in').replace(/\/+$/, '')

/** When the size data last changed: the sitemap's lastmod and the date in llms-full.txt. Bump it with each data update. */
export const SITE_UPDATED = '2026-11-15'

export const SITE_NAME = 'naapo'
export const SITE_TAGLINE = 'Same you, every brand.'
export const SITE_DESCRIPTION =
  'Compare clothing and footwear sizes across Indian and international brands for men, women, boys, girls and kids, and find the right size before you buy.'
export const TRIVASITE = 'https://www.trivasite.co.in/'
export const TRIVASITE_ABOUT = 'https://www.trivasite.co.in/about'
