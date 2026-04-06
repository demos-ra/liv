// @liv-standard v1.3
// [F-design-system/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-design-system
// layer:      R1
// wires-in:   none
// wires-out:  (internal — barrel for F-design-system domain layer)
// deps:
//   R1 ./light-engine
//   R1 ./type-engine
//   R1 ./space-engine
//   R1 ./motion
//   R0 ../config/board
// validated:  pending

export { deriveLight } from './light-engine'
export { deriveType } from './type-engine'
export { deriveSpace } from './space-engine'
export { deriveMotion, TIMING, CURVES } from './motion'
export { Z } from '../config/board'
