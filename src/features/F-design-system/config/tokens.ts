// @liv-standard v1.0
// [F-design-system/R0]
// Built with LIV · livai.dev
// Runtime design tokens — JS only. For canvas, charts, non-CSS contexts.
// All visual styling lives in globals.css. Do not duplicate here.

export const TOKENS = {
  dark: {
    bg:      '#141412',
    surface: '#1E1D1B',
    elevated:'#272522',
    border:  '#363430',
    text:    '#E8E6E1',
    textSec: '#857F76',
    textDis: '#5C5850',
    accent:  '#8EA4FF',
    error:   '#F2766D',
    amber:   '#DFAF56',
  },
  light: {
    bg:      '#F5F2ED',
    surface: '#FDFCF9',
    elevated:'#F0EDE8',
    border:  '#D8D4CC',
    text:    '#1A1917',
    textSec: '#6B6560',
    textDis: '#9B948C',
    accent:  '#4F6FD6',
    error:   '#C85C4E',
    amber:   '#B98E32',
  },
  font: {
    ui:    "'Geist', system-ui, sans-serif",
    mono:  "'CommitMono', monospace",
    brand: "'Montserrat', sans-serif",
  },
  grid: {
    u05: 4, u1: 8, u15: 12, u2: 16, u25: 20,
    u3: 24, u4: 32, u5: 40, u6: 48,
  },
  layout: {
    col:     680,
    colPad:  20,
    radius:  8,
    headerH: 48,
  },
} as const
