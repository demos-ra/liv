// [F-design-system/R0/C2] Design tokens — raw values only
// R0: zero dependencies. All layers import from here.
// A theme change is a change in this file. It propagates automatically.

// ─── Color ────────────────────────────────────────────────────────────────────

export const color = {
  // Neutral scale
  black:       '#0A0A0A',
  neutral950:  '#111111',
  neutral900:  '#1A1A1A',
  neutral800:  '#2A2A2A',
  neutral700:  '#3A3A3A',
  neutral600:  '#555555',
  neutral500:  '#777777',
  neutral400:  '#999999',
  neutral300:  '#BBBBBB',
  neutral200:  '#DDDDDD',
  neutral100:  '#F0F0F0',
  neutral50:   '#F8F8F8',
  white:       '#FFFFFF',

  // Brand
  brandPrimary:   '#1A1A2E',
  brandAccent:    '#4F46E5',
  brandAccentHover: '#4338CA',

  // Semantic
  success:  '#16A34A',
  warning:  '#CA8A04',
  error:    '#DC2626',
  info:     '#2563EB',

  // Surface
  surfaceBase:    '#0A0A0A',
  surfaceRaised:  '#141414',
  surfaceSunken:  '#060606',
  surfaceBorder:  '#2A2A2A',

  // Code/workspace surface
  workspaceBg:     '#0D0D0D',
  workspaceBorder: '#222222',
  workspaceText:   '#E0E0E0',
} as const

// ─── Typography ───────────────────────────────────────────────────────────────
// Instrument Serif — headers
// Inter — body
// Commit Mono — workspace/code

export const font = {
  header:    '"Instrument Serif", Georgia, serif',
  body:      '"Inter", system-ui, sans-serif',
  workspace: '"Commit Mono", "JetBrains Mono", "Fira Code", monospace',
} as const

export const fontSize = {
  xs:   '11px',
  sm:   '13px',
  base: '15px',
  md:   '17px',
  lg:   '20px',
  xl:   '24px',
  '2xl': '30px',
  '3xl': '36px',
  '4xl': '48px',
} as const

export const fontWeight = {
  regular: '400',
  medium:  '500',
  semibold:'600',
  bold:    '700',
} as const

export const lineHeight = {
  tight:  '1.2',
  snug:   '1.4',
  normal: '1.6',
  loose:  '1.8',
} as const

export const letterSpacing = {
  tight:  '-0.02em',
  normal: '0em',
  wide:   '0.04em',
  wider:  '0.08em',
} as const

// ─── Spacing ──────────────────────────────────────────────────────────────────
// Base unit: 4px

export const space = {
  0:    '0px',
  0.5:  '2px',
  1:    '4px',
  1.5:  '6px',
  2:    '8px',
  2.5:  '10px',
  3:    '12px',
  4:    '16px',
  5:    '20px',
  6:    '24px',
  8:    '32px',
  10:   '40px',
  12:   '48px',
  16:   '64px',
  20:   '80px',
  24:   '96px',
  32:   '128px',
} as const

// ─── Radius ───────────────────────────────────────────────────────────────────

export const radius = {
  none: '0px',
  sm:   '3px',
  md:   '6px',
  lg:   '10px',
  xl:   '16px',
  full: '9999px',
} as const

// ─── Border ───────────────────────────────────────────────────────────────────

export const border = {
  width: {
    thin:   '1px',
    medium: '2px',
  },
  style: 'solid',
  color: {
    default: color.surfaceBorder,
    subtle:  color.neutral800,
    strong:  color.neutral600,
  },
} as const

// ─── Shadow ───────────────────────────────────────────────────────────────────

export const shadow = {
  sm:  '0 1px 2px rgba(0,0,0,0.4)',
  md:  '0 4px 8px rgba(0,0,0,0.5)',
  lg:  '0 8px 24px rgba(0,0,0,0.6)',
  xl:  '0 16px 48px rgba(0,0,0,0.7)',
} as const

// ─── Motion ───────────────────────────────────────────────────────────────────

export const duration = {
  instant: '0ms',
  fast:    '100ms',
  normal:  '200ms',
  slow:    '350ms',
} as const

export const easing = {
  standard:   'cubic-bezier(0.4, 0, 0.2, 1)',
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const

// ─── Z-index ──────────────────────────────────────────────────────────────────

export const zIndex = {
  base:    0,
  raised:  10,
  overlay: 100,
  modal:   200,
  toast:   300,
} as const

// ─── Breakpoints ──────────────────────────────────────────────────────────────

export const breakpoint = {
  sm:  '640px',
  md:  '768px',
  lg:  '1024px',
  xl:  '1280px',
  '2xl': '1536px',
} as const
