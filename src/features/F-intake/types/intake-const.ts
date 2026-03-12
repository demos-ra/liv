// @liv-standard v1.3
// [F-intake/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-intake
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  INTAKE_CONST  →  F-intake/R1, F-intake/R3
// deps:       none
// validated:  2026-03-12

export const INTAKE_CONST = {
  TEXT_MIN_LEN:    20,          // chars — must be meaningful description
  TEXT_MAX_LEN:    50_000,      // chars — hard cap before chunking needed
  ZIP_MAX_BYTES:   50_000_000,  // 50 MB
  GIT_URL_PATTERN: /^(https?:\/\/|git@)[^\s]+$/,
  BRANCH_PATTERN:  /^[a-zA-Z0-9._\-/]{1,200}$/,
  DEFAULT_BRANCH:  'main',
} as const
