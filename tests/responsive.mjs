// Responsive audit: loads pages at many widths in headless Chrome and reports layout faults.
import { spawn } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const base = process.argv[2] ?? 'http://localhost:5173'
const outDir = process.argv[3] ?? 'tests/responsive-report'
const widths = (process.argv[4] ?? '320,360,390,414,600,768,820,1024,1280,1440,1920').split(',').map(Number)
const pages = (process.argv[5] ?? '/,/brands/zudio?for=women,/brands/bata?for=kidsBoys,/brands/the-unknown').split(',')
const shots = process.argv[6] !== 'noshots'
mkdirSync(outDir, { recursive: true })

const pf = process.env.PROGRAMFILES || 'C:\\Program Files'
const pf86 = process.env['PROGRAMFILES(X86)'] || 'C:\\Program Files (x86)'
const chrome = [
  join(pf, 'Google/Chrome/Application/chrome.exe'),
  join(pf86, 'Google/Chrome/Application/chrome.exe'),
  join(process.env.LOCALAPPDATA || '', 'Google/Chrome/Application/chrome.exe'),
  join(pf86, 'Microsoft/Edge/Application/msedge.exe'),
  join(pf, 'Microsoft/Edge/Application/msedge.exe'),
].find((p) => existsSync(p))
const port = 9334
const profile = mkdtempSync(join(tmpdir(), 'naapo-audit-'))
const proc = spawn(chrome, [`--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--headless=new', '--no-first-run', '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' })
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// runs inside the page: finds elements past the screen edges, overlapping text, small tap targets
const PROBE = `(() => {
  const vw = document.documentElement.clientWidth
  const out = { vw, scrollW: document.documentElement.scrollWidth, overflow: [], small: [], overlap: [] }
  const inScroller = (el) => { for (let p = el.parentElement; p; p = p.parentElement) { const s = getComputedStyle(p); if (/(auto|scroll|hidden|clip)/.test(s.overflowX) && p !== document.body && p !== document.documentElement) return true } return false }
  const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '') + ' "' + (el.textContent || '').trim().slice(0, 30) + '"'
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect()
    if (!r.width || !r.height) continue
    const s = getComputedStyle(el)
    if (s.visibility === 'hidden' || s.display === 'none' || s.position === 'fixed') continue
    if ((r.right > vw + 1 || r.left < -1) && !inScroller(el)) out.overflow.push(name(el) + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']')
    const tap = el.matches('a[href], button, [role=radio], select, input, summary')
    if (tap && !el.closest('p, li p, td, th p') && (r.height < 36 || r.width < 32) && !el.closest('[aria-hidden=true]')) out.small.push(name(el) + ' ' + Math.round(r.width) + 'x' + Math.round(r.height))
  }
  // text blocks that overlap each other (same stacking level, not nested)
  const texts = [...document.querySelectorAll('h1,h2,h3,p,a,button,li > span, label')].filter((e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return r.width && r.height && s.position !== 'fixed' && s.position !== 'absolute' && !e.closest('header, [role=dialog], [aria-hidden=true]') })
  const rects = texts.map((e) => [e, e.getBoundingClientRect()])
  for (let i = 0; i < rects.length; i++) for (let j = i + 1; j < rects.length; j++) {
    const [a, ra] = rects[i], [b, rb] = rects[j]
    if (a.contains(b) || b.contains(a)) continue
    const x = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), y = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top)
    if (x > 4 && y > 4) out.overlap.push(name(a) + ' × ' + name(b))
    if (out.overlap.length > 12) break
  }
  out.overflow = [...new Set(out.overflow)].slice(0, 15)
  out.small = [...new Set(out.small)].slice(0, 15)
  return out
})()`

let ws
try {
  let targets
  for (let i = 0; i < 50; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json()
      if (targets.some((t) => t.type === 'page')) break
    } catch {}
    await sleep(200)
  }
  ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((r) => ws.addEventListener('open', r))
  let id = 0
  const pending = new Map()
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data)
    if (m.id && pending.has(m.id)) (pending.get(m.id)(m), pending.delete(m.id))
  })
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })) })
  const evalJs = async (expr) => (await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true })).result?.result?.value
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] })

  const report = []
  for (const path of pages) {
    for (const w of widths) {
      const h = w < 700 ? 844 : w < 1100 ? 1024 : 900
      await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: w < 700 })
      await send('Page.navigate', { url: base + path })
      await sleep(1800)
      // walk down the page so lazy parts mount, then back up
      await evalJs(`(async () => { for (let y = 0; y < document.documentElement.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 60)) } window.scrollTo(0, 0); return 1 })()`)
      await sleep(600)
      const r = await evalJs(PROBE)
      const sideways = r.scrollW > r.vw + 1
      const line = `${path.padEnd(28)} ${String(w).padStart(4)}px  sideways:${sideways ? 'YES ' + (r.scrollW - r.vw) + 'px' : 'no'}  overflow:${r.overflow.length}  overlap:${r.overlap.length}  small-taps:${r.small.length}`
      console.log(line)
      report.push({ path, w, ...r })
      if (shots) {
        const height = await evalJs('document.documentElement.scrollHeight')
        await send('Emulation.setDeviceMetricsOverride', { width: w, height: Math.min(height, 16000), deviceScaleFactor: 1, mobile: w < 700 })
        await sleep(400)
        const shot = await send('Page.captureScreenshot', { format: 'jpeg', quality: 60, captureBeyondViewport: true })
        const file = join(outDir, `${path.replace(/[^a-z0-9]+/gi, '_') || 'home'}-${w}.jpg`)
        writeFileSync(file, Buffer.from(shot.result.data, 'base64'))
      }
    }
  }
  writeFileSync(join(outDir, 'report.json'), JSON.stringify(report, null, 2))
} finally {
  ws?.close()
  proc.kill()
}
