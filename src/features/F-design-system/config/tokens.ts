// @liv-standard v1.3
// [F-design-system/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    tokens reclassified R0→R1 (imports deriveLight from R1 domain)
// slice:      F-design-system
// layer:      R1
// wires-in:   none
// wires-out:  (consumed by canvas/JS contexts outside F-design-system)
// deps:
//   R0 ./board
//   R1 ../domain/light-engine
// validated:  pending
// note:       Runtime token values for JS/canvas contexts.
//             COLORS derived by calling deriveLight() at module scope (pure, no DOM).
//             Removed exports: COLOR_ROLES, old MOTION array, GLOW.

import {
  I_LIGHT, I_DARK,
  BLUE, RED, AMBER,
  FONT_UI, FONT_MONO, FONT_BRAND,
  TYPE_BASE, TYPE_RATIO,
  SPACE_UNIT,
  RADIUS_BUBBLE,
  COL_WIDTH, COL_WIDTH_LG, LOGIN_WIDTH,
  ATTACK, RELEASE, BLOOM, CYCLE_STREAM,
  CURVE_S, CURVE_E, CURVE_T, CURVE_B, CURVE_G,
} from './board'

import { deriveLight } from '../domain/light-engine'

// ── Colors — derived from light engine per mode ────────────────────────────

const lightVars = deriveLight(I_LIGHT)
const darkVars  = deriveLight(I_DARK)

function extractRgb(triplet: string): [number, number, number] {
  const parts = triplet.split(',').map(Number)
  return [parts[0], parts[1], parts[2]]
}

export const COLORS = {
  light: {
    bg:      lightVars['--bg'],
    surface: lightVars['--surface'],
    canyon:  lightVars['--canyon'],
    blue:    extractRgb(lightVars['--blue']),
    red:     extractRgb(lightVars['--red']),
    text:    lightVars['--text'],
    textSec: lightVars['--text-sec'],
    textDis: lightVars['--text-dis'],
  },
  dark: {
    bg:      darkVars['--bg'],
    surface: darkVars['--surface'],
    canyon:  darkVars['--canyon'],
    blue:    extractRgb(darkVars['--blue']),
    red:     extractRgb(darkVars['--red']),
    text:    darkVars['--text'],
    textSec: darkVars['--text-sec'],
    textDis: darkVars['--text-dis'],
  },
  pinned: {
    blue:  BLUE,
    red:   RED,
    amber: AMBER,
  },
} as const

// ── Space — derived from SPACE_UNIT ────────────────────────────────────────

export const SPACE = {
  u05: SPACE_UNIT * 0.5,
  u1:  SPACE_UNIT * 1,
  u15: SPACE_UNIT * 1.5,
  u2:  SPACE_UNIT * 2,
  u25: SPACE_UNIT * 2.5,
  u3:  SPACE_UNIT * 3,
  u4:  SPACE_UNIT * 4,
  u5:  SPACE_UNIT * 5,
  u55: SPACE_UNIT * 5.5,
  u6:  SPACE_UNIT * 6,
  headerH:      SPACE_UNIT * 6,
  inputH:       SPACE_UNIT * 5.5,
  inputHSm:     SPACE_UNIT * 4,
  radiusPill:   (SPACE_UNIT * 5.5) / 2,
  radiusSurface: SPACE_UNIT * 1.5,
  radiusBubble: RADIUS_BUBBLE,
  colWidth:     COL_WIDTH,
  colWidthLg:   COL_WIDTH_LG,
  loginWidth:   LOGIN_WIDTH,
} as const

// ── Fonts — from board ─────────────────────────────────────────────────────

export const FONTS = {
  ui:    FONT_UI,
  mono:  FONT_MONO,
  brand: FONT_BRAND,
} as const

// ── Type scale — derived from TYPE_BASE + TYPE_RATIO ───────────────────────

export const TYPE_SCALE = {
  xs:   Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, -2)),
  sm:   Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, -1)),
  base: TYPE_BASE,
  lg:   Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, 1)),
  xl:   Math.round(TYPE_BASE * Math.pow(TYPE_RATIO, 2)),
} as const

// ── Motion — resolved ms values for JS style.transition assignments ────────

export const MOTION = {
  attack:      ATTACK,
  release:     RELEASE,
  bloom:       BLOOM,
  cycleStream: CYCLE_STREAM,
} as const

// ── Curves — resolved strings, never CSS var() references ──────────────────

export const CURVES_RESOLVED = {
  S: CURVE_S,
  E: CURVE_E,
  T: CURVE_T,
  B: CURVE_B,
  G: CURVE_G,
} as const
