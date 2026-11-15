// End-to-end flows and axe-core accessibility scans in headless Chrome, against the production preview
// (served with the production security headers, so blocked resources show up as errors).
import { spawn } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const base = process.argv[2] ?? 'http://localhost:4173'
const axeSource = readFileSync(process.argv[3] ?? new URL('../node_modules/axe-core/axe.min.js', import.meta.url), 'utf8')
const pf = process.env.PROGRAMFILES || 'C:\\Program Files', pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)'
const chrome = [join(pf, 'Google/Chrome/Application/chrome.exe'), join(pf86, 'Google/Chrome/Application/chrome.exe'), join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'), join(pf86, 'Microsoft/Edge/Application/msedge.exe'), join(pf, 'Microsoft/Edge/Application/msedge.exe')].find((p) => existsSync(p))
const port = 9336
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'naapo-e2e-'))}`, '--headless=new', '--no-first-run', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const results = []
const errors = []
let ws
try {
  let t; for (let i = 0; i < 50; i++) { try { t = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); if (t.some((x) => x.type === 'page')) break } catch {} await sleep(200) }
  ws = new WebSocket(t.find((x) => x.type === 'page').webSocketDebuggerUrl); await new Promise((r) => ws.addEventListener('open', r))
  let id = 0; const pend = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pend.has(m.id)) (pend.get(m.id)(m), pend.delete(m.id))
    if (m.method === 'Runtime.exceptionThrown') errors.push('exception: ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text).split('\n')[0])
    if (m.method === 'Runtime.consoleAPICalled' && m.params.type === 'error') errors.push('console.error: ' + m.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 200))
    if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error' && !/\/(brands\/not-a-brand|some\/random\/page)$/.test(m.params.entry.url ?? '')) errors.push('log: ' + m.params.entry.text.slice(0, 200) + (m.params.entry.url ? ' ' + m.params.entry.url : ''))
  })
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  const ev = async (x) => { const r = await send('Runtime.evaluate', { expression: x, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || 'eval failed'); return r.result?.result?.value }
  await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable')
  const size = (w, h, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile })
  const go = async (path) => { await send('Page.navigate', { url: base + path }); await sleep(1600) }
  const key = async (k, text) => {
    const code = k.length === 1 ? 'Key' + k.toUpperCase() : k
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, text: text ?? (k.length === 1 ? k : undefined), windowsVirtualKeyCode: k === 'Enter' ? 13 : k === 'Escape' ? 27 : k === '/' ? 191 : k.toUpperCase().charCodeAt(0) })
    await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code })
  }
  const type = async (s) => { for (const ch of s) { await send('Input.insertText', { text: ch }); await sleep(30) } }
  const click = (sel, text) => ev(`(() => { const els = [...document.querySelectorAll(${JSON.stringify(sel)})]; const el = ${text ? `els.find((e) => e.textContent.trim() === ${JSON.stringify(text)})` : 'els[0]'}; if (!el) throw new Error('not found: ' + ${JSON.stringify(sel + ' ' + (text ?? ''))}); el.scrollIntoView({ block: 'center' }); el.click(); return true })()`)
  const check = async (name, fn) => {
    const before = errors.length
    try { const detail = await fn(); results.push({ name, ok: true, detail }) } catch (e) { results.push({ name, ok: false, detail: e.message.split('\n')[0] }) }
    if (errors.length > before) results[results.length - 1].errors = errors.slice(before)
  }
  const expect = (cond, msg) => { if (!cond) throw new Error(msg) }
  const axe = async (label) => {
    await ev(`window.axe ? 1 : (eval(${JSON.stringify(axeSource)}), 1)`).catch(async () => { await send('Runtime.evaluate', { expression: axeSource }) })
    const v = await ev(`axe.run(document, { resultTypes: ['violations'], runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'] }).then((r) => r.violations.map((x) => ({ id: x.id, impact: x.impact, n: x.nodes.length, help: x.help, target: x.nodes[0].target.join(' ') })))`)
    results.push({ name: `axe: ${label}`, ok: v.length === 0, detail: v.length ? v.map((x) => `${x.impact} ${x.id} (${x.n}) ${x.help} -> ${x.target}`).join('\n      ') : 'no violations' })
  }

  // ---------- flows ----------
  await size(1280, 900)
  await check('home loads with headline and 146 brands', async () => {
    await go('/')
    const h1 = await ev(`document.querySelector('h1').textContent.replace(/\\s+/g, ' ').trim()`)
    expect(/Same you, every brand/i.test(h1), 'h1 is ' + h1)
    const eyebrow = await ev(`document.body.textContent.includes('Size comparison for 146 brands')`)
    expect(eyebrow, 'brand count missing')
    return h1
  })
  await axe('home, desktop')

  await check('"/" opens brand search, typing "snit" + Enter opens Snitch', async () => {
    await ev(`document.body.focus(); 1`)
    await key('/', '/')
    await sleep(500)
    expect(await ev(`!!document.querySelector('[role=dialog]')`), 'dialog did not open')
    await type('snit'); await sleep(300)
    const first = await ev(`document.querySelector('#brand-results [role=option]')?.textContent`)
    await axe('search dialog open')
    await key('Enter'); await sleep(1500)
    const path = await ev('location.pathname'), h1 = await ev(`document.querySelector('h1')?.textContent.trim()`)
    expect(path === '/brands/snitch' && h1 === 'Snitch', `landed on ${path} / ${h1}`)
    return `first result "${first?.trim().slice(0, 30)}", landed on ${path}`
  })

  await check('Escape closes search and page scroll is restored', async () => {
    await key('/', '/'); await sleep(400)
    await key('Escape'); await sleep(400)
    const open = await ev(`!!document.querySelector('[role=dialog]')`)
    const overflow = await ev(`document.documentElement.style.overflow`)
    expect(!open && overflow !== 'hidden', `open=${open} overflow=${overflow}`)
    return 'closed'
  })

  await check('browser Back returns to home', async () => {
    await send('Runtime.evaluate', { expression: 'history.back()' }); await sleep(1500)
    const path = await ev('location.pathname')
    expect(path === '/', 'path ' + path)
    return path
  })

  await check('finder: Male > Kids > Socks shows socks sizes', async () => {
    await go('/#finder')
    await click('#finder [role=radio]', 'Male'); await sleep(300)
    await click('#finder [role=radio]', 'Kids2–7 yrs'); await sleep(300)
    await click('#finder [role=radio]', 'Socks'); await sleep(600)
    const summary = await ev(`document.querySelector('#finder h3').parentElement.textContent`)
    expect(/Kids boys/.test(summary) && /Socks/.test(summary), summary)
    return summary.replace(/\s+/g, ' ').slice(0, 90)
  })

  await check('finder: slider and + button change the measurement', async () => {
    await click('#finder [role=radio]', 'Female'); await sleep(300)
    await click('#finder [role=radio]', 'WomenAdult'); await sleep(300)
    await click('#finder [role=radio]', 'T-shirts'); await sleep(300)
    const read = () => ev(`document.querySelector('#finder input[type=range]').value`)
    const a = await read()
    await click('#finder button[aria-label^="Increase"]'); await sleep(300)
    const b = await read()
    expect(Number(b) === Number(a) + 1, `${a} -> ${b}`)
    return `${a} -> ${b}`
  })

  await check('finder: "A size I wear" converts from a brand', async () => {
    await click('#finder [role=radio]', 'A size I wear'); await sleep(400)
    const ok = await ev(`!!document.querySelector('#ref-brand')`)
    expect(ok, 'brand select missing')
    await ev(`(() => { document.querySelector('#ref-brand').click(); return 1 })()`); await sleep(300)
    await ev(`(() => { const i = document.activeElement; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'H&M'); i.dispatchEvent(new Event('input', { bubbles: true })); return i.getAttribute('role') })()`); await sleep(200)
    await ev(`(() => { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 1 })()`)
    await sleep(300)
    const chosen = await ev(`document.querySelector('#ref-brand').textContent`)
    expect(chosen.includes('H&M'), 'picked ' + chosen)
    await sleep(500)
    const rows = await ev(`document.querySelectorAll('#finder ul > li').length`)
    expect(rows > 5, 'rows ' + rows)
    return rows + ' result rows'
  })

  await check('brand page: compare H&M M -> Zudio size', async () => {
    await go('/brands/zudio?for=women')
    await ev(`document.querySelector('#compare').scrollIntoView(); 1`); await sleep(500)
    await ev(`(() => { document.querySelector('#compare-brand').click(); return 1 })()`); await sleep(300)
    await ev(`(() => { const i = document.activeElement; const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; set.call(i, 'H&M'); i.dispatchEvent(new Event('input', { bubbles: true })); return i.getAttribute('role') })()`); await sleep(200)
    await ev(`(() => { document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })); return 1 })()`)
    await sleep(400)
    await click('#compare [role=radio]', 'M'); await sleep(600)
    const out = await ev(`document.querySelector('#compare [aria-live=polite]')?.textContent.trim()`)
    expect(out && out.length, 'no result')
    return 'result: ' + out
  })
  await axe('brand page, desktop')

  await check('women-only brand (Only) disables Male', async () => {
    await go('/brands/only')
    const disabled = await ev(`[...document.querySelectorAll('#sizes [role=radio]')].find((b) => b.textContent.trim() === 'Male')?.disabled`)
    expect(disabled === true, 'Male disabled=' + disabled)
    return 'Male is disabled'
  })

  await check('unknown brand shows the not-found page', async () => {
    await go('/brands/not-a-brand')
    const h1 = await ev(`document.querySelector('h1')?.textContent`)
    expect(/don't chart that brand/i.test(h1), h1)
    const robots = await ev(`document.querySelector('meta[name=robots]')?.content`)
    expect(robots === 'noindex', 'robots ' + robots)
    return h1
  })

  await check('server answers 404 for unknown addresses, 200 for real pages', async () => {
    const codes = {}
    for (const p of ['/', '/brands/levis', '/brands/levis?for=men', '/brands/not-a-brand', '/some/random/page', '/sitemap.xml', '/llms-full.txt'])
      codes[p] = (await fetch(base + p)).status
    const want = { '/brands/not-a-brand': 404, '/some/random/page': 404 }
    for (const [p, c] of Object.entries(codes)) expect(c === (want[p] ?? 200), `${p} -> ${c}`)
    await go('/some/random/page')
    const h1 = await ev(`document.querySelector('h1')?.textContent`)
    expect(/couldn't find that page/i.test(h1), h1)
    return Object.entries(codes).map(([p, c]) => `${p} ${c}`).join(', ')
  })

  await check('footer "Kids girls" link opens the finder on that group', async () => {
    await go('/brands/zudio')
    await click('footer a', 'Kids girls'); await sleep(1800)
    const sel = await ev(`[...document.querySelectorAll('#finder [role=radio][aria-checked=true]')].map((b) => b.textContent.trim()).join(' | ')`)
    expect(/Kids/.test(sel) && /Female/.test(sel), sel)
    return sel
  })

  await check('sitemap, llms.txt, llm.txt and robots.txt are served', async () => {
    const out = []
    for (const f of ['sitemap.xml', 'llms.txt', 'llm.txt', 'robots.txt']) {
      const r = await fetch(`${base}/${f}`); const body = await r.text()
      expect(r.ok && body.length > 50 && !body.includes('<div id="root">'), f + ' not served as a file')
      out.push(`${f} ${body.length}B`)
    }
    return out.join(', ')
  })

  // ---------- phone ----------
  await size(390, 844, true)
  await check('phone: menu opens, Escape closes it', async () => {
    await go('/')
    await click('header button', 'Menu'); await sleep(400)
    const open = await ev(`document.querySelector('header button[aria-controls=mobile-menu]').getAttribute('aria-expanded')`)
    await key('Escape'); await sleep(400)
    const closed = await ev(`document.querySelector('header button[aria-controls=mobile-menu]').getAttribute('aria-expanded')`)
    expect(open === 'true' && closed === 'false', `open=${open} closed=${closed}`)
    return 'ok'
  })
  await axe('home, phone')
  await go('/brands/bata?for=kidsBoys')
  await axe('brand page, phone')
} finally {
  ws?.close(); proc.kill()
}

let pass = 0
for (const r of results) {
  if (r.ok) pass++
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}\n      ${r.detail}`)
  if (r.errors) console.log('      errors: ' + r.errors.join('\n              '))
}
console.log(`\n${pass}/${results.length} passed; console errors overall: ${errors.length}`)
if (errors.length) console.log([...new Set(errors)].slice(0, 15).join('\n'))
