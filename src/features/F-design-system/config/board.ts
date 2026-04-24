// @liv-standard v1.5.1
// [F-design-system/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.3
// slice:      F-design-system
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  ATTACK  → core/app/R4 (page transition focus timing)
//   (internal: ATTACK, RELEASE → F-design-system/R4)
// deps:       none
// validated:  pending

// ── Light masters ────────────────────────────────────────────────────────────

export const I_LIGHT = 0.95
export const I_DARK  = 0.08
export const H       = 0.125
export const Thue    = 45
export const Tsat    = 0.125

// ── Russell scale ────────────────────────────────────────────────────────────

export const R1 = Math.pow(2, 1 / 4)   // 1.18920...
export const R2 = Math.pow(2, 1 / 2)   // 1.41421...
export const R3 = Math.pow(2, 3 / 4)   // 1.68179...
export const R4 = 2                     // octave

// ── Light constants ──────────────────────────────────────────────────────────

export const L_CEIL         = 0.99
export const SCALE_FLOOR    = 0.003
export const COOL_SHIFT     = 1 / 32        // 0.03125
export const DARK_THRESHOLD = 0.5
export const SCOTOPIC_HUE   = 175
export const BREATH_DELTA   = 1 / 64        // 0.015625
export const PX_SCALE       = 32

// ── Pinned materials ─────────────────────────────────────────────────────────

export const BLUE  = { hue: 220, sat: 1.0,  L: 0.71 } as const
export const RED   = { hue: 7,   sat: 0.52, L: 0.53 } as const
export const AMBER = { hue: 40,  sat: 0.75, L: 0.55 } as const

// ── Density scale (derived from R-steps) ─────────────────────────────────────

export const DENSITY_FULL  = 1.0
export const DENSITY_SOFT  = 1 / R1          // 0.8409...
export const DENSITY_HALF  = 1 / R4          // 0.5
export const DENSITY_FAINT = 1 / (R4 * R4)   // 0.25

// ── H compression tiers ──────────────────────────────────────────────────────

export const H_REST  = H
export const H_HOVER = H / R1
export const H_PRESS = H / R4

// ── Type masters ─────────────────────────────────────────────────────────────

export const TYPE_BASE  = 16     // px
export const TYPE_RATIO = R1     // shared constant — 2^(1/4)

// ── Type authored — font stacks ──────────────────────────────────────────────

export const FONT_UI    = "'Geist', system-ui, -apple-system, sans-serif"
export const FONT_MONO  = "'CommitMono', monospace"
export const FONT_BRAND = "'Exo 2', sans-serif"

// ── Type authored — weights ──────────────────────────────────────────────────

export const WEIGHT = { regular: 400, medium: 500, bold: 700 } as const

// ── Type authored — line heights ─────────────────────────────────────────────

export const LINE_HEIGHT = { tight: 1, body: 1.5, reading: 1.6 } as const

// ── Type authored — letter spacing ───────────────────────────────────────────

export const LETTER_SPACING = {
  brand:    '0.3em',
  brandLg:  '0.35em',
  mono:     '0.08em',
  monoSm:   '0.06em',
  monoXs:   '0.05em',
  monoWide: '0.1em',
  label:    '0.06em',
} as const

// ── Space master ─────────────────────────────────────────────────────────────

export const SPACE_UNIT = 8    // px

// ── Space authored ───────────────────────────────────────────────────────────

export const RADIUS_BUBBLE = 18    // px — authored, optical tuning
export const COL_WIDTH     = 680   // px
export const COL_WIDTH_LG  = 720   // px
export const LOGIN_WIDTH   = 340   // px
export const BREAKPOINT_SM = 480   // px
export const BREAKPOINT_MD = 768   // px — dashboard height cap, mid-tier adjustments
export const BREAKPOINT_LG = 1281  // px

// ── Component dimensions (authored) ──────────────────────────────────────────

export const DOT_SIZE         = 6    // px
export const SPINNER_SIZE     = 14   // px
export const SPINNER_SIZE_SM  = 12   // px
export const DASH_MIN_H       = 100  // px
export const PANEL_WIDTH      = 320  // px

// ── Motion — timing ──────────────────────────────────────────────────────────

export const ATTACK       = 256    // 2^8 ms
export const RELEASE      = 512    // 2^9 ms
export const BLOOM        = 1024   // 2^10 ms
export const CYCLE_STREAM = 2048   // 2^11 ms

// ── Motion — curves (resolved strings, never CSS var references) ─────────────

export const CURVE_S = 'cubic-bezier(0.08, 0.82, 0.36, 1)'
export const CURVE_E = 'cubic-bezier(0, 0, 0.2, 1)'
export const CURVE_T = 'cubic-bezier(0.4, 0, 1, 1)'
export const CURVE_B = 'cubic-bezier(0.45, 0, 0.55, 1)'
export const CURVE_G = 'cubic-bezier(0, 0, 0.58, 1)'

// ── Motion — z-index ─────────────────────────────────────────────────────────

export const Z = {
  field:   0,
  content: 1,
  forming: 2,     // transient: incoming page above dissolving
  mask:    5,     // scroll fade, above content, below dash
  dash:    9,
  header:  10,
  overlay: 20,
  panel:   21,    // slide panel, above overlay
  toast:   30,
} as const
