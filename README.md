# naapo

**Same you, every brand.**

naapo is a size comparison tool for Indian shoppers. Tell it the size you wear at one brand, or give it one body measurement, and it shows the size to buy at every other brand: clothing, innerwear, bras and footwear for men, women, boys, girls and kids.

It covers **162 Indian and international brands**, from Roadster, Snitch, Zudio and Libas to Levi's, H&M, Nike and Bata. naapo is a [Trivasite](https://www.trivasite.co.in/) product.

---

## What it does

- **Size finder.** Pick who it's for (Men, Women, Boys 8–14, Girls 8–14, Kids boys 2–7, Kids girls 2–7) and what you're buying. Then either:
  - enter one measurement (chest or bust, waist, hip, underbust, height or foot length), or
  - pick a size that already fits you at a brand you know.

  You get your size at every brand that makes that item, and whether each brand runs small, true to size or large.
- **Brand pages** (`/brands/<id>`). Every brand has its own page with:
  - full size charts for each group;
  - a converter: "I wear M at H&M, what's my Zudio size?";
  - the same fit at every other brand.
- **Side-by-side charts.** One table of every brand's sizes for a chosen group and item.
- **Brand search.** Press `/` or `Ctrl + K` anywhere to jump to a brand.
- **Measuring guide.** How to measure chest, waist, hip, foot length and a child's height.

### What can be compared

| Family | Items |
|---|---|
| Topwear | T-shirts, shirts, polo T-shirts, tops and crop tops |
| Winterwear | Sweatshirts, hoodies, sweaters and cardigans, jackets and puffers, coats, thermal wear |
| Dresses and ethnic | Kurtas, kurtis, dresses, frocks |
| Bottomwear | Jeans, trousers, shorts, track pants, leggings, skirts, palazzos and salwars |
| Innerwear | Vests, briefs, trunks, long trunks, boxers, camisoles; bikini, hipster, full brief, boyshort and thong panties |
| Bras | T-shirt, push-up, sports, bralette, minimizer, strapless and nursing bras; beginner bras for girls |
| Footwear | Sneakers, sports, formal, loafers, boots, heels, flats, sandals, slides, clogs, school shoes, socks |

### How sizes are matched

Sizes are matched on **body measurements in cm**, not on the letter, because an M at one brand can be an L at another.

| Item | Measured by |
|---|---|
| Topwear, winterwear, kurtas and dresses | Chest or bust |
| Bottomwear and men's underwear | Waist |
| Women's panties | Hip |
| Band-sized bras | Underbust |
| Kids' clothing | Height |
| Footwear | Foot length (Indian brands use UK sizes, shown as "UK/India") |

Where naapo has read a brand's **official** size chart from its own website, the page shows it with a link to the source:

- Libas
- Marks & Spencer
- Jockey
- Clovia
- Rupa and Rupa Frontline (men's briefs, trunks and vests, from Rupa's product catalogue)
- XYXX
- Coitonic
- Fuaark
- Manyavar

Every other chart is an **estimate** of the brand's typical fit, measured against a common chart, and is labelled "Estimated" on the site.

---

## Tech stack

| | |
|---|---|
| Framework | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build | [Vite 8](https://vite.dev) |
| Styling | [Tailwind CSS 4](https://tailwindcss.com) |
| Motion | [Motion](https://motion.dev) (`motion/react`) and [Lenis](https://lenis.darkroom.engineering) smooth scrolling |
| 3D | [three.js](https://threejs.org): a silk shader in the closing section, loaded only when it's near the screen |
| Fonts | Instrument Sans and Instrument Serif, self-hosted with [Fontsource](https://fontsource.org) |
| Testing | ESLint, a headless-Chrome end-to-end suite with [axe-core](https://github.com/dequelabs/axe-core) accessibility scans, and a responsive layout audit |
| Hosting | Any static host: Cloudflare Pages or Netlify (`public/_headers`), or Vercel (`vercel.json`) |

There is no backend: all size data lives in `src/data.ts` and the site is fully static.

---

## Getting started

You need **Node.js 20.19+ or 22.12+**, and Chrome or Edge to run the tests.

```bash
# install dependencies
npm install

# start the dev server at http://localhost:5173
npm run dev
```

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload. Slower than the live site, because files aren't bundled. |
| `npm run build` | Type-checks, then builds the site into `dist/`, including the SEO files and the pre-rendered brand pages. |
| `npm run preview` | Serves `dist/` at http://localhost:4173, with the same headers and 404 behaviour as the live site. |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript, with no output files |
| `npm run test:e2e` | End-to-end flows and accessibility scans. Needs `npm run preview` running. |
| `npm run test:responsive` | Checks for overflow, overlap and tap-target size at 12 screen widths from 320 to 1920 px. Needs `npm run preview` running. |

To test the speed of the site, use `npm run build` and `npm run preview`, not `npm run dev`.

---

## Folder structure

```
.
├── index.html               # page shell: title, meta tags, structured data
├── site.config.ts           # site address (auto-detected, or SITE_URL), name, tagline, data date, Trivasite links
├── vite.config.ts           # Vite setup + the plugin that writes the SEO files and pre-rendered pages
├── vercel.json              # Vercel: clean URLs, security headers, caching
├── eslint.config.js
├── tsconfig.json
├── package.json
├── LICENSE
│
├── public/                  # copied to the site as-is
│   ├── images/              # category photos, 4 widths each, WebP (men, women, boy, girl)
│   ├── logos/               # brand logos (SVG and PNG), listed in src/logos.ts
│   ├── favicon.png
│   └── _headers             # Cloudflare Pages / Netlify: security headers and caching
│
├── seo/
│   └── generate.ts          # builds sitemap.xml, robots.txt, llms.txt, llm.txt, llms-full.txt,
│                            # one pre-rendered HTML page per brand, and 404.html
│
├── src/
│   ├── main.tsx             # entry: fonts, global CSS, Motion setup, mounts <App />
│   ├── App.tsx              # routes: /, /brands/:id, anything else → not found
│   ├── index.css            # Tailwind theme (colours, fonts), global styles, hidden scrollbars
│   ├── data.ts              # ALL size data: groups, items, base charts, 162 brands,
│   │                        # official charts, size matching and brand-to-brand conversion
│   ├── logos.ts             # brand id → logo file
│   │
│   ├── pages/
│   │   ├── Home.tsx         # hero, categories, brand grid, size finder, side-by-side charts,
│   │   │                    # measuring guide, how it works
│   │   └── BrandPage.tsx    # one brand: size charts, fit at a glance, compare with another brand
│   │
│   ├── components/
│   │   ├── Layout.tsx       # header, mobile menu, footer, shared bits (fields, unit toggle)
│   │   ├── BrandSearch.tsx  # search dialog (/ or Ctrl+K) and its header button
│   │   ├── BrandSelect.tsx  # brand picker with logos, filter and keyboard support
│   │   ├── BrandLogo.tsx    # logo tile, with initials when a brand has no logo
│   │   ├── GarmentPicker.tsx# items grouped by family (topwear, bras, footwear…)
│   │   ├── WhoPicker.tsx    # gender, then age group
│   │   ├── NotFound.tsx     # page for unknown brands and addresses
│   │   ├── HeroDemo.tsx     # animated example in the hero
│   │   ├── Statement.tsx    # large statement section
│   │   ├── Silk.tsx         # three.js silk shader (lazy-loaded)
│   │   └── primitives.tsx   # small UI pieces: segmented control, chips, sliding text, arrows
│   │
│   └── lib/
│       ├── router.tsx       # tiny router on the History API, with real <a href> links
│       ├── scroll.ts        # Lenis smooth scroll: start, pause, jump to a section
│       ├── meta.ts          # sets title, description, canonical and noindex per page
│       └── warmLogos.ts     # fetches all logos in the background once the page is idle
│
└── tests/
    ├── e2e.mjs              # end-to-end flows, axe accessibility scans, status codes
    └── responsive.mjs       # layout audit across screen widths
```

---

## Adding or changing data

Almost everything about sizes lives in **`src/data.ts`**.

### Add a brand

Brands are created with the `b()` helper:

```ts
b('snitch', 'Snitch', IN, 'm', { t: -2, b: -1 })
//  id        name     origin who  fit offsets in cm (runs small here)

b('bata', 'Bata', IN, 'mwk', {}, [0, 'UK', ['formal', 'sandals', 'school']])
//                                 footwear: offset, size system, types
```

| Argument | What it is |
|---|---|
| `id` | The URL: `/brands/snitch` |
| who | Who the brand makes clothes for: `m` men, `w` women, `k` kids |
| fit offsets | How many cm a brand runs large (`+`) or small (`−`), for each family: `t` topwear, `b` bottomwear, `d` dresses, `e` ethnic, `w` winterwear, `i` innerwear |
| footwear | Optional: the shoe offset, the size system (`UK`, `US` or `EU`) and the footwear types the brand sells |

Then add the brand to the right lists in the same file, for example `ETHNIC_LABELS`, `SPORTSWEAR` or `INNER_MEN`, so it gets the right items. Use `BRA_STYLES` and `PANTIES` for bra and panty styles.

### Add a brand's official chart

1. Add the chart to `OFFICIAL` in `src/data.ts`, with the group, the item, the rows and the page you copied it from.
2. The site will label it "Official" and link to the source.

### Add a logo

1. Put an SVG or PNG (at least 64 px) in `public/logos/<id>.svg` or `<id>.png`.
2. Add it to `src/logos.ts`.

Brands without a logo show their initials instead.

After any data change, bump `SITE_UPDATED` in `site.config.ts`, so the sitemap and `llms-full.txt` show the new date.

---

## SEO and AI search

Everything below is generated from `src/data.ts` on every build, so it always matches the site.

| File | Purpose |
|---|---|
| `/sitemap.xml` | The home page and all 162 brand pages |
| `/robots.txt` | Lets every crawler in, including the AI crawlers (GPTBot, ClaudeBot, PerplexityBot and others), and points to the sitemap and `llms.txt` |
| `/llms.txt` (also `/llm.txt`) | A summary for AI assistants, in the [llms.txt](https://llmstxt.org) format |
| `/llms-full.txt` | Every size at every brand, with its body range in cm |
| `/brands/<id>.html` | A pre-rendered page per brand, with its own title, description and structured data, and its size charts as plain HTML. Crawlers that don't run JavaScript still see the content; visitors get the full app as soon as it loads. |
| `/404.html` | Served with a real 404 status for unknown addresses, and kept out of search results |

### The site's address

naapo runs on its own domain, as a product of Trivasite rather than a part of trivasite.co.in. The address used in every link is worked out at build time, in this order (see `site.config.ts`):

1. **`SITE_URL`**, if set. Once you buy a domain, add it in your host's environment variables, for example `SITE_URL=https://naapo.in`.
2. **Vercel:** the project's production domain. That's your custom domain once added, otherwise the `.vercel.app` address.
3. **Netlify:** the site's main address. On **Cloudflare Pages**, set `SITE_URL` yourself, because its built-in variable names each deploy, not the site.
4. **Your own computer:** `http://localhost:4173`, with a warning in the build output.

Nothing else needs changing when the domain arrives. Add it in the host, set `SITE_URL`, and redeploy.

---

## Performance

- **Code splitting.** Brand pages and the three.js shader load only when they're needed. The shader also waits until it's near the screen.
- **Self-hosted fonts.** The fonts are self-hosted, and the two used on the first screen are preloaded.
- **Photos.** They come in four widths as WebP, with `srcset`, so phones download small files.
- **Logos.** The logos on the first screen load straight away, and the rest load in the background once the page is idle. Background loading is skipped on data-saver and 2G connections.
- **Caching.**
  - Hashed files in `/assets` are cached for a year.
  - Logos, photos and the favicon are cached for a week, then refreshed quietly in the background.
- **Smooth scrolling.** Lenis smooths mouse-wheel and trackpad scrolling. Phones keep their own native scrolling. Two settings in `src/lib/scroll.ts` control the feel:
  - `wheelMultiplier` (now `0.75`): how far each flick moves. Lower it for slower scrolling.
  - `lerp` (now `0.12`): how quickly the page catches up. Keep it at `0.1` or above, or the page trails the wheel and feels laggy.
- **Light on the graphics chip.**
  - The sticky header and the hero card are solid, not blurred, because a backdrop blur is redrawn on every scroll frame.
  - The silk effect draws at ¾ resolution. Its soft gradients look the same, for about a quarter of the GPU work.
  - The silk stops drawing when it's off screen or paused, and respects "reduce motion".

To judge real speed, always use `npm run build` + `npm run preview` (or the live site). The dev server serves hundreds of unbundled files and is much slower.

---

## Handling heavy traffic

naapo is a **fully static site**: there is no server code, API or database. Every page, including all 162 brand pages, is a ready-made file served from the host's CDN, which copies it to servers around the world. Thousands of visitors a minute just means thousands of file downloads, which a CDN handles without slowing down. There is nothing that can crash or run out of memory.

What does grow with traffic is **bandwidth**, so each visit is kept small. These figures were measured on the production build on a phone:

| Visit | Data downloaded |
|---|---|
| Lands and leaves | about 406 KB |
| Scrolls the whole home page | about 600 KB |
| Comes back later | much less: fonts, scripts, photos and logos are cached |

At 1,000 new visitors a minute, that's roughly **0.4–0.6 GB a minute**. Pick a plan that covers it:

| Host | Bandwidth | Business use | Notes |
|---|---|---|---|
| **Cloudflare Pages** (free) | Unlimited for static sites | Allowed | Best fit for spikes. Uses `public/_headers`. |
| **Vercel Pro** ($20/month) | 1 TB a month included | Allowed | Uses `vercel.json`. |
| Vercel Hobby (free) | 100 GB a month | **Not allowed:** non-commercial use only | Fine for testing, not for a Trivasite product. |
| Netlify (free) | 100 GB a month | Allowed | Uses `public/_headers`. |

Built in to keep each visit light:
- Photos come in four sizes, so phones download the small ones.
- Brand pages and the 3D effect load only when needed.
- Logos download in the background only after the visitor scrolls or taps, so people who leave straight away never fetch them.
- Long cache lifetimes mean returning visitors download almost nothing.

---

## Deploying

The build command is `npm run build` and the output folder is `dist` on every host. After you buy the domain, add it in the host and set the environment variable `SITE_URL` (for example `https://naapo.in`).

**Cloudflare Pages (recommended for a business site)**
1. In Cloudflare, go to Workers & Pages → Create → Pages, then connect the repository.
2. Choose the Vite preset (build command `npm run build`, output `dist`), and add `SITE_URL` under environment variables.
3. `public/_headers` adds the security headers and caching. Clean URLs and the `404.html` page work without any extra setup.

**Vercel**
1. Import the repository. Vercel detects Vite.
2. `vercel.json` adds clean URLs, security headers and caching. Until `SITE_URL` is set, links use the project's `.vercel.app` address.

**Netlify**
1. Use the same build command and output folder.
2. `public/_headers` adds the headers. Netlify serves `404.html` for unknown addresses automatically.

**After the first deploy**
1. Add the site to [Google Search Console](https://search.google.com/search-console) and [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. Submit `/sitemap.xml` in both.

---

## Contact

- **naapo / Trivasite:** [trivasite.co.in/about](https://www.trivasite.co.in/about). Use this for corrections, a brand's official size chart, or a brand you'd like added.
- **Designed and built by** [Utkarsh Jha](https://utkarshjha.me)

## Licence

[MIT](LICENSE). Brand names and logos belong to their owners and are used only to identify the brands. Photographs are from [Unsplash](https://unsplash.com).
