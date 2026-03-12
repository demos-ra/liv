// @liv-standard v1.3
// [F-project/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  PROJECT_CONST  →  F-project/R1, F-project/R2
// deps:       none
// validated:  2026-03-12

export const PROJECT_CONST = {
  NAME_MAX_LEN:         80,
  DESCRIPTION_MAX_LEN:  500,
  BUILDS_PER_PROJECT:   100,   // soft cap — warn at 80
} as const

export const PROJECT_NAMESPACE = 'project' as const
export const BUILD_NAMESPACE   = 'build'   as const
