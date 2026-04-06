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
// note:       Pure function. 8 CSS custom properties: 5 type sizes + 3 font stacks.

import {
  TYPE_BASE, TYPE_RATIO,
  FONT_UI, FONT_MONO, FONT_BRAND,
} from '../config/board'

export function deriveType(): Record<string, string> {
  return {
    '--type-xs':    Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, -2)) + 'px',
    '--type-sm':    Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, -1)) + 'px',
    '--type-base':  TYPE_BASE + 'px',
    '--type-lg':    Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, 1)) + 'px',
    '--type-xl':    Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, 2)) + 'px',
    '--font-ui':    FONT_UI,
    '--font-mono':  FONT_MONO,
    '--font-brand': FONT_BRAND,
  }
}
