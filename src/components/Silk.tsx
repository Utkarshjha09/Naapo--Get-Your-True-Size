import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { PauseButton } from './primitives'

/*
 * Silk folds: satin cloth in one colour with broad, slow folds and an anisotropic sheen.
 * Ported from tasteskill's silk-folds effect to a three.js ShaderMaterial. Shading is done in
 * OKLab, so the sheen lightens the cloth without shifting its hue. A calm area keeps the cloth
 * flat and dark where the band's text sits.
 */

function srgbToOklab(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16)
  const lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  const [r, g, b] = lin
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b)
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ]
}

const vert = /* glsl */ `
void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }
`

const frag = /* glsl */ `
precision highp float;
uniform vec2 u_res;
uniform float u_time;
uniform vec3 u_base;
uniform float u_calmL;
uniform vec2 u_calmAB;
uniform vec2 u_calmAt;
uniform float u_shadowK;
uniform float u_sheenL;

const float SCALE = 1.0, FOLDS = 0.62, SHEEN = 0.62, SPEED = 0.05, GRAIN = 0.02, ANGLE = 25.0, CALM = 0.55;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
vec2 grad(vec2 i) { float a = hash(i) * 6.2831853; return vec2(cos(a), sin(a)); }

vec3 nd(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
  vec2 du = 30.0 * f * f * (f * (f - 2.0) + 1.0);
  vec2 ga = grad(i), gb = grad(i + vec2(1.0, 0.0)), gc = grad(i + vec2(0.0, 1.0)), gd = grad(i + vec2(1.0, 1.0));
  float va = dot(ga, f), vb = dot(gb, f - vec2(1.0, 0.0)), vc = dot(gc, f - vec2(0.0, 1.0)), vd = dot(gd, f - vec2(1.0, 1.0));
  float k4 = va - vb - vc + vd;
  float v = va + u.x * (vb - va) + u.y * (vc - va) + u.x * u.y * k4;
  vec2 d = ga + u.x * (gb - ga) + u.y * (gc - ga) + u.x * u.y * (ga - gb - gc + gd) + du * (u.yx * k4 + vec2(vb, vc) - va);
  return vec3(v, d);
}

vec3 labLin(vec3 lab) {
  vec3 lms = vec3(lab.x + 0.3963377774 * lab.y + 0.2158037573 * lab.z,
                  lab.x - 0.1055613458 * lab.y - 0.0638541728 * lab.z,
                  lab.x - 0.0894841775 * lab.y - 1.2914855480 * lab.z);
  lms = lms * lms * lms;
  return vec3(dot(lms, vec3(4.0767416621, -3.3077115913, 0.2309699292)),
              dot(lms, vec3(-1.2684380046, 2.6097574011, -0.3413193965)),
              dot(lms, vec3(-0.0041960863, -0.7034186147, 1.7076147010)));
}
bool inside(vec3 c) { return all(greaterThanEqual(c, vec3(-0.001))) && all(lessThanEqual(c, vec3(1.001))); }
vec3 srgb(vec3 c) {
  c = clamp(c, 0.0, 1.0);
  return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(vec3(0.0031308), c));
}
vec3 toRGB(vec3 lab) {
  lab.x = clamp(lab.x, 0.0, 1.0);
  vec3 c = labLin(lab);
  if (!inside(c)) {
    float lo = 0.0, hi = 1.0;
    for (int i = 0; i < 7; i++) {
      float k = 0.5 * (lo + hi);
      if (inside(labLin(vec3(lab.x, lab.yz * k)))) lo = k; else hi = k;
    }
    c = labLin(vec3(lab.x, lab.yz * lo));
  }
  return srgb(c);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 p = (gl_FragCoord.xy - 0.5 * u_res) / u_res.y * 2.0 / SCALE;
  float t = u_time * SPEED + 0.37;

  float ang = radians(ANGLE);
  vec2 T = vec2(sin(ang), cos(ang));
  vec2 A = vec2(T.y, -T.x);
  float a = dot(p, A), b = dot(p, T);

  // calm area under the text
  vec2 dc = (uv - u_calmAt) * vec2(u_res.x / u_res.y, 1.0);
  float m = (1.0 - smoothstep(0.12, 0.62, length(dc * vec2(0.8, 1.3)))) * CALM;
  float mm = smoothstep(0.0, 0.5, m);
  float depth = (0.12 + 0.32 * FOLDS) * (1.0 - 0.8 * mm);

  vec3 wv = nd(vec2(a * 0.9 + 5.0, b * 0.35 - t * 0.6));
  float aw = a + 0.2 * wv.x;
  float dawA = 1.0 + 0.2 * 0.9 * wv.y, dawB = 0.2 * 0.35 * wv.z;

  float fan = 1.0 + 0.36 * b;
  float af = aw * fan;
  vec2 dAF = vec2(fan * dawA, fan * dawB + 0.36 * aw);

  vec3 w1 = nd(vec2(b * 0.75 + 3.1, a * 0.3 + t * 2.0));
  vec3 w2 = nd(vec2(b * 1.1 - 7.3, a * 0.45 - t * 1.6 + 5.0));
  float ph1 = 2.1 * w1.x, ph2 = 2.4 * w2.x;
  vec2 dph1 = 2.1 * vec2(0.3 * w1.z, 0.75 * w1.y);
  vec2 dph2 = 2.4 * vec2(0.45 * w2.z, 1.1 * w2.y);

  float f1 = 7.4, f2 = 12.9, f3 = 3.9;
  float s1 = f1 * af + ph1 + t * 1.7;
  float s2 = f2 * af + ph2 - t * 1.2 + 1.3;
  float s3 = f3 * af + 0.8 * ph2 + 2.2;
  float k2 = 0.22 + 0.3 * (0.5 + 0.5 * w1.x);
  float h = sin(s1) + k2 * sin(s2) + 0.6 * sin(s3);
  vec2 dh = cos(s1) * (f1 * dAF + dph1) + k2 * cos(s2) * (f2 * dAF + dph2) + 0.6 * cos(s3) * (f3 * dAF + 0.8 * dph2);
  float hs = h - 0.12 * h * h;
  dh *= 1.0 - 0.24 * h;

  vec2 g = (A * dh.x + T * dh.y) * depth / 4.6;
  vec3 n = normalize(vec3(-g, 1.0));

  vec3 L = normalize(vec3(-0.5, 0.62, 0.6));
  vec3 V = vec3(0.0, 0.0, 1.0);
  vec3 H = normalize(L + V);
  float diff = clamp((dot(n, L) + 0.25) / 1.25, 0.0, 1.0);
  diff = diff * diff * (3.0 - 2.0 * diff);

  vec3 X = normalize(vec3(A, 0.0) - n * dot(vec3(A, 0.0), n));
  vec3 Y = normalize(cross(n, X));
  float hx = dot(H, X), hy = dot(H, Y), hn = max(dot(H, n), 0.05);
  float spec = exp(-(hx * hx / 0.034 + hy * hy / 0.9) / (hn * hn));
  float broad = exp(-(hx * hx / 0.14 + hy * hy / 1.8) / (hn * hn));
  float sk = SHEEN * (1.0 - mm);

  float ao = 0.84 + 0.16 * smoothstep(-1.4, 0.8, hs);

  float I = mix(u_shadowK, 1.0, diff) * ao;
  float Lc = u_base.x * mix(0.62, 1.08, I);
  vec2 ab = u_base.yz * mix(0.82, 1.0, I);
  float sh = clamp(spec * 0.62 + broad * 0.28, 0.0, 1.0) * sk;
  Lc += (u_sheenL - Lc) * sh;
  ab *= 1.0 - 0.55 * sh;
  Lc = mix(Lc, u_calmL + (Lc - u_base.x) * 0.15, mm);
  ab = mix(ab, u_calmAB, mm);

  vec3 col = toRGB(vec3(Lc, ab));
  float gr = hash(gl_FragCoord.xy + floor(u_time * 24.0)) - 0.5;
  col += gr * GRAIN * 0.3 + (hash(gl_FragCoord.yx) - 0.5) / 255.0;
  gl_FragColor = vec4(col, 1.0);
}
`

/** The CSS still shown before the first frame, without WebGL, and behind the canvas. */
const FALLBACK =
  'linear-gradient(140deg, #4a1912 0%, #6b261c 24%, #8e3a2d 36%, #6b261c 50%, #4a1912 64%, #6b261c 80%, #87382b 92%, #6b261c 100%)'

export function Silk({
  color = '#7b2d22',
  calmAt = [0.3, 0.5],
  className = '',
}: {
  color?: string
  /** where the text sits, as 0..1 of the box (x from left, y from bottom) */
  calmAt?: [number, number]
  className?: string
}) {
  const [calmX, calmY] = calmAt
  const host = useRef<HTMLDivElement>(null)
  const [paused, setPaused] = useState(false)
  const [live, setLive] = useState(false)
  const pausedRef = useRef(false)
  pausedRef.current = paused

  useEffect(() => {
    const el = host.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: false, alpha: false, powerPreference: 'low-power' })
    } catch {
      return // the CSS still stays
    }
    const canvas = renderer.domElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    el.appendChild(canvas)

    // a deeper shade of the colour on a dark band so the cloth does not glare
    const base = srgbToOklab(color)
    base[0] = Math.min(0.5, Math.max(0.3, base[0]))
    const uniforms = {
      u_res: { value: new THREE.Vector2(1, 1) },
      u_time: { value: 6 },
      u_base: { value: new THREE.Vector3(...base) },
      u_calmL: { value: Math.max(0.24, base[0] - 0.1) },
      u_calmAB: { value: new THREE.Vector2(base[1] * 0.85, base[2] * 0.85) },
      u_calmAt: { value: new THREE.Vector2(calmX, calmY) },
      u_shadowK: { value: 0.26 },
      u_sheenL: { value: Math.min(0.96, base[0] + 0.32) },
    }
    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2, 2),
      new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms }),
    )
    scene.add(mesh)

    const draw = () => renderer.render(scene, camera)

    const resize = () => {
      const { width, height } = el.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, width < 640 ? 1 : 1.5)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      uniforms.u_res.value.set(Math.max(1, width * dpr), Math.max(1, height * dpr))
      draw()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(el)
    resize()
    setLive(true)

    // runs on a clock from load; skips drawing while off screen or paused, so nothing restarts
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting))
    io.observe(el)
    const start = performance.now()
    let raf = 0
    let frozenAt = 6
    let offset = 0
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick)
      if (pausedRef.current) {
        offset = (now - start) / 1000 - frozenAt + 6
        return
      }
      const t = (now - start) / 1000 - offset + 6
      frozenAt = t
      if (!visible || document.hidden) return
      uniforms.u_time.value = t
      draw()
    }
    if (!reduce) raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      mesh.geometry.dispose()
      ;(mesh.material as THREE.Material).dispose()
      renderer.dispose()
      canvas.remove()
    }
  }, [color, calmX, calmY])

  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  return (
    <div ref={host} className={`absolute inset-0 overflow-hidden ${className}`} style={{ background: FALLBACK }}>
      {live && !reduce && (
        <PauseButton
          paused={paused}
          onToggle={() => setPaused((p) => !p)}
          label="silk background"
          tone="light"
          className="absolute bottom-3 right-3 z-10"
        />
      )}
    </div>
  )
}
