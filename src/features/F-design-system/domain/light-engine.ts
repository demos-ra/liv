// @liv-standard v1.3
// [F-design-system/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-design-system
// layer:      R1
// wires-in:   none
// wires-out:  (internal — consumed by F-design-system barrel)
// deps:
//   R0 ../config/board
// validated:  pending
// note:       Pure function. 60 CSS custom properties: 24 shared + 36 per-tier.
//             Direct translation of liv-mockup-v26.html lines 598–760.
//             No DOM access. Returns Record, never calls style.setProperty.

import {
  Thue, Tsat, H,
  R1, R2, R4,
  L_CEIL, SCALE_FLOOR, COOL_SHIFT, DARK_THRESHOLD, SCOTOPIC_HUE,
  BREATH_DELTA, PX_SCALE,
  BLUE, RED,
  DENSITY_FULL, DENSITY_SOFT, DENSITY_HALF, DENSITY_FAINT,
  H_REST, H_HOVER, H_PRESS,
  CURVE_S, CURVE_E, CURVE_T, CURVE_B, CURVE_G,
  ATTACK, RELEASE,
} from '../config/board'

// ── Internal helpers (private) ───────────────────────────────────────────────

function hslRgb(h: number, s: number, l: number): [number, number, number] {
  h = ((h % 360) + 360) % 360 / 360
  s = Math.max(0, Math.min(1, s))
  l = Math.max(0, Math.min(1, l))
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v] }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const ch = (pp: number, qq: number, t: number): number => {
    if (t < 0) t += 1
    if (t > 1) t -= 1
    if (t < 1 / 6) return pp + (qq - pp) * 6 * t
    if (t < 1 / 2) return qq
    if (t < 2 / 3) return pp + (qq - pp) * (2 / 3 - t) * 6
    return pp
  }
  return [
    Math.round(ch(p, q, h + 1 / 3) * 255),
    Math.round(ch(p, q, h) * 255),
    Math.round(ch(p, q, h - 1 / 3) * 255),
  ]
}

function rgb(c: [number, number, number]): string {
  return `rgb(${c[0]},${c[1]},${c[2]})`
}

function rgbStr(c: [number, number, number]): string {
  return `${c[0]},${c[1]},${c[2]}`
}

function concentration(Hx: number): number {
  return 1 / ((1 - Hx) * (1 - Hx))
}

function absorption(Hx: number): number {
  return Math.exp(-Hx)
}

function darkBlend(I: number): number {
  return COOL_SHIFT * Math.max(0, 1 - I / DARK_THRESHOLD)
}

function shiftedHue(baseHue: number, I: number): number {
  return baseHue + (SCOTOPIC_HUE - baseHue) * darkBlend(I)
}

function shiftedSat(baseSat: number, I: number): number {
  return baseSat * (1 - darkBlend(I) * 0.5)
}

// ── Derive ───────────────────────────────────────────────────────────────────

export function deriveLight(I: number): Record<string, string> {
  const out: Record<string, string> = {}
  const isDark = I < 0.5

  const sHue = shiftedHue(Thue, I)
  const sSat = shiftedSat(Tsat, I)
  const fieldSat = Math.min(1.0, sSat)
  const surfaceStep = isDark ? R2 : R1

  // ── Shared (24) ──

  const bg = hslRgb(sHue, fieldSat, I)
  const surfaceConc = concentration(H_REST)
  const surfaceSat = Math.min(1.0, sSat * Math.sqrt(surfaceConc))
  const surface = hslRgb(sHue, surfaceSat, Math.min(L_CEIL, I * surfaceStep))

  const blue = hslRgb(BLUE.hue, BLUE.sat, BLUE.L)
  const red  = hslRgb(RED.hue, RED.sat, RED.L)

  out['--bg']      = rgb(bg)
  out['--surface'] = rgb(surface)
  out['--canyon']  = rgb(bg)
  out['--blue']    = rgbStr(blue)
  out['--red']     = rgbStr(red)

  const inkRest   = hslRgb(sHue, sSat, H_REST / R4)
  const chalkRest = hslRgb(sHue, sSat / R4, 1 - H_REST / R4)
  const textBase  = isDark ? chalkRest : inkRest
  const tbStr     = rgbStr(textBase)

  out['--text']     = `rgba(${tbStr},${DENSITY_FULL.toFixed(4)})`
  out['--text-sec'] = `rgba(${tbStr},${DENSITY_HALF.toFixed(4)})`
  out['--text-dis'] = `rgba(${tbStr},${DENSITY_FAINT.toFixed(4)})`

  const haloBias = BREATH_DELTA * PX_SCALE / R4
  out['--text-halo'] = `0 0 ${haloBias}px rgba(${tbStr},${BREATH_DELTA})`

  out['--density-full']     = DENSITY_FULL.toFixed(4)
  out['--density-soft']     = DENSITY_SOFT.toFixed(4)
  out['--density-half']     = DENSITY_HALF.toFixed(4)
  out['--density-faint']    = DENSITY_FAINT.toFixed(4)
  out['--identity-density'] = DENSITY_FULL.toFixed(4)
  out['--overlay-bg']       = `rgba(${rgbStr(bg)},${(DENSITY_HALF * R2).toFixed(4)})`

  out['--S'] = CURVE_S
  out['--E'] = CURVE_E
  out['--T'] = CURVE_T
  out['--B'] = CURVE_B
  out['--G'] = CURVE_G

  out['--dur-attack']  = ATTACK + 'ms'
  out['--dur-release'] = RELEASE + 'ms'
  out['--halo-bias']   = haloBias + 'px'
  out['--scale-floor'] = String(SCALE_FLOOR)

  // ── Per-tier (36) ──

  const tiers: Array<{ name: string; Hx: number }> = [
    { name: 'rest',  Hx: H_REST },
    { name: 'hover', Hx: H_HOVER },
    { name: 'press', Hx: H_PRESS },
  ]
  const blueStr = rgbStr(blue)
  const redStr  = rgbStr(red)

  for (const { name, Hx } of tiers) {
    const conc = concentration(Hx)
    const abs  = absorption(Hx)

    const inkT   = hslRgb(sHue, sSat, Hx / R4)
    const chalkT = hslRgb(sHue, sSat / R4, 1 - Hx / R4)
    out[`--ink-${name}`] = rgbStr(isDark ? chalkT : inkT)

    const glowSatT = Math.min(1.0, sSat * conc)
    const gcT      = hslRgb(sHue, glowSatT, I * abs)
    const gcStr    = rgbStr(gcT)
    out[`--glow-color-${name}`] = gcStr

    const levels: Array<{ label: string; step: number }> = [
      { label: 'low',  step: R4 },
      { label: 'mid',  step: R4 * R2 },
      { label: 'high', step: R4 * R4 },
    ]

    for (const { label, step } of levels) {
      const opacity = Math.min(1.0, Hx * step)
      const blur    = Math.round(opacity * PX_SCALE)
      out[`--glow-${name}-${label}`]      = `0 0 ${blur}px rgba(${gcStr},${opacity.toFixed(4)})`
      out[`--glow-blue-${name}-${label}`]  = `0 0 ${blur}px rgba(${blueStr},${opacity.toFixed(4)})`
      out[`--glow-red-${name}-${label}`]   = `0 0 ${blur}px rgba(${redStr},${opacity.toFixed(4)})`
    }

    const shOp     = Hx * R4
    const shSpread = Math.round(Hx * R4 * PX_SCALE)
    out[`--shadow-${name}`] = `-2px 0 ${shSpread}px rgba(${gcStr},${shOp.toFixed(4)})`
  }

  return out
}
