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
// note:       Pure function. 8 CSS custom properties for motion curves and durations.
//             Also exports resolved JS constants (TIMING, CURVES, Z) for direct
//             style.transition assignments — consumers get strings, never var().
//             deriveMotion() output overlaps with deriveLight() for --S, --E, --T,
//             --B, --G, --dur-attack, --dur-release. This is intentional — the light
//             engine sets them as part of its 60-var contract. deriveMotion() exists
//             so motion values can be set independently without recalculating light.

import {
  CURVE_S, CURVE_E, CURVE_T, CURVE_B, CURVE_G,
  ATTACK, RELEASE, BLOOM, CYCLE_STREAM,
} from '../config/board'

export function deriveMotion(): Record<string, string> {
  return {
    '--S':           CURVE_S,
    '--E':           CURVE_E,
    '--T':           CURVE_T,
    '--B':           CURVE_B,
    '--G':           CURVE_G,
    '--dur-attack':    ATTACK + 'ms',
    '--dur-release':   RELEASE + 'ms',
    '--cycle-stream':  CYCLE_STREAM + 'ms',
  }
}

export const TIMING = { attack: ATTACK, release: RELEASE, bloom: BLOOM } as const
export const CURVES = { S: CURVE_S, E: CURVE_E, T: CURVE_T, B: CURVE_B, G: CURVE_G } as const
export { Z } from '../config/board'
