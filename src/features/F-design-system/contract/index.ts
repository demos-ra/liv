// @liv-standard v1.3
// [F-design-system/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    phase5-remediation
// slice:      F-design-system
// layer:      R3
// wires-in:   none
// wires-out:  (barrel — canonical export path for design system tokens, motion)
// deps:
//   R0 ../config (via barrel)
//   R1 ../domain (via barrel)
// validated:  pending
//
// phase5-remediation (A2):
//   Removed usePlanet/usePageTransition re-exports. Hooks moved to exec/ (R4).
//   R3 barrel cannot import R4. Consumers import from exec/ directly.

export * from '../config'
export { TIMING, CURVES, Z } from '../domain'
