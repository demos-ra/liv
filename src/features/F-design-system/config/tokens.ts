// @liv-standard v1.3
// [F-design-system/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-design-system
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  SPATIAL       → F-design-system/R3
//   W-ATOM  TYPE          → F-design-system/R3
//   W-ATOM  COLOR_ROLES   → F-design-system/R3
//   W-ATOM  MOTION        → F-design-system/R3
//   W-ATOM  GLOW          → F-design-system/R3
//   W-ATOM  RADIUS        → F-design-system/R3
//   W-ATOM  DEVICE_CLASS  → F-design-system/R3
//   W-ATOM  COLORS        → F-design-system/R3
//   W-ATOM  SPACE         → F-design-system/R3
//   W-ATOM  FONTS         → F-design-system/R3
//   W-ATOM  TYPE_SCALE    → F-design-system/R3
// deps:      none
// validated: pending

// Runtime design tokens — JS only. For canvas, charts, non-CSS contexts.
// All visual styling lives in globals.css. Do not duplicate there.
// Every value here must match its counterpart CSS custom property exactly.

// ── Token name registries (type layer — no runtime CSS) ──────────────────────
// Purpose: other slices reference token names without magic strings.

export const SPATIAL = [
  'u05', 'u1', 'u15', 'u2', 'u25', 'u3', 'u4', 'u5', 'u55', 'u6',
  'header-h', 'input-h', 'input-h-sm',
] as const

export const TYPE = [
  'type-xs', 'type-sm', 'type-base', 'type-lg', 'type-xl',
  'font-ui', 'font-mono', 'font-brand',
] as const

export const COLOR_ROLES = [
  'bg', 'surface', 'border', 'text', 'text-sec', 'text-dis',
  'accent', 'error', 'caution', 'surface-msg', 'input-panel-bg', 'overlay-bg',
] as const

export const MOTION = [
  'dur-fast', 'dur-normal', 'dur-slow',
  'ease-default', 'ease-enter', 'ease-exit', 'ease-float',
] as const

export const GLOW = [
  'glow-accent', 'glow-accent-strong', 'glow-accent-rest', 'glow-accent-subtle',
  'glow-error', 'glow-toast-entry',
  'shadow-surface', 'shadow-panel',
] as const

export const RADIUS = [
  'radius-pill', 'radius-surface', 'radius-bubble',
] as const

export const DEVICE_CLASS = ['col'] as const

// ── Runtime color values — JS/canvas contexts only ──────────────────────────
// Accent is #6B9FFF in both modes — one identity. (brief rule)

export const COLORS = {
  dark: {
    bg:         '#111110',
    surface:    '#1F1E1C',
    border:     '#2A2825',
    text:       '#E8E6E1',
    textSec:    '#857F76',
    textDis:    '#6B655C',
    accent:     '#6B9FFF',
    error:      '#E8695F',
    caution:    '#D4A84B',
    surfaceMsg: '#1F1E1C',
  },
  light: {
    bg:         '#F4F1EC',
    surface:    '#F8F6F2',
    border:     '#E2DED6',
    text:       '#1A1917',
    textSec:    '#6B6560',
    textDis:    '#8A837A',
    accent:     '#6B9FFF',
    error:      '#C4564A',
    caution:    '#B58A2E',
    surfaceMsg: '#F8F6F2',
  },
} as const

// ── Runtime spatial values (px as numbers) ──────────────────────────────────

export const SPACE = {
  u05: 4,  u1: 8,   u15: 12, u2: 16,  u25: 20,
  u3:  24, u4: 32,  u5:  40, u55: 44, u6:  48,
  headerH:  48,
  inputH:   44,
  inputHSm: 32,
} as const

// ── Runtime font stacks ──────────────────────────────────────────────────────

export const FONTS = {
  ui:    "'Geist', system-ui, -apple-system, sans-serif",
  mono:  "'CommitMono', monospace",
  brand: "'Montserrat', sans-serif",
} as const

// ── Runtime type scale (px as numbers) ──────────────────────────────────────

export const TYPE_SCALE = {
  xs:   11,
  sm:   13,
  base: 16,
  lg:   19,
  xl:   23,
} as const
