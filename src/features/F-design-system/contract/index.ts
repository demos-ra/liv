// @liv-standard v1.3
// [F-design-system/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase3-planet, phase4-page-transitions
// slice:      F-design-system
// layer:      R3
// wires-in:   none
// wires-out:  (barrel — canonical export path for design system tokens, motion, hooks)
// deps:
//   R0 ../config (via barrel)
//   R1 ../domain (via barrel)
//   R2 ../workflow (via barrel)
// validated:  pending
//
// phase3-planet:
//   Added: usePlanet re-export from R2 workflow layer.
//
// phase4-page-transitions:
//   Added: usePageTransition re-export from R2 workflow layer.

export * from '../config'
export { TIMING, CURVES, Z } from '../domain'
export { usePlanet, usePageTransition } from '../workflow'
export type { UsePlanetResult } from '../workflow'
