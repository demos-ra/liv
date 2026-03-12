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
//   W-ATOM  IntakeMode             →  F-intake/R1, F-intake/R3
//   W-ATOM  IntakeInput            →  F-intake/R1, F-intake/R3
//   W-ATOM  IntakeValidationError  →  F-intake/R1, F-intake/R3
//   W-ATOM  IntakeState            →  F-intake/R3
//   W-ATOM  IntakeResult           →  reserved — no fn signature uses it until
//                                      StartPipelinePayload gains a description field
// deps:       none
// validated:  2026-03-12

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
export type IntakeMode = 'text' | 'zip' | 'git'

// ── AK-ENT ────────────────────────────────────────────────────────────────────
// Union of the three intake forms. R1 validates each branch independently.

export type IntakeInputText = {
  mode:        'text'
  description: string   // free-form requirements text
}

export type IntakeInputZip = {
  mode:     'zip'
  fileName: string
  fileSize: number   // bytes
  fileData: string   // base64-encoded zip contents
}

export type IntakeInputGit = {
  mode:   'git'
  gitUrl: string   // https:// or git@ URL
  branch: string   // defaults to 'main'
}

export type IntakeInput = IntakeInputText | IntakeInputZip | IntakeInputGit

// ── AK-ERR ────────────────────────────────────────────────────────────────────
export type IntakeValidationError = {
  field:   string   // which field failed
  code:    string   // machine-readable code
  message: string   // human-readable message
}

// ── AK-RES ────────────────────────────────────────────────────────────────────
export type IntakeResult =
  | { ok: true;  buildId: string; projectId: string }
  | { ok: false; errors: IntakeValidationError[] }

// ── AK-ENT — UI state shape ───────────────────────────────────────────────────
// Owned by intake-hook.ts (R3). Declared here for type safety across R3 components.
export type IntakeState = {
  mode:        IntakeMode
  text:        string
  gitUrl:      string
  gitBranch:   string
  zipFileName: string | null
  zipFileSize: number | null
  zipFileData: string | null   // base64
  // submitting removed — planner.status is the single source of truth (A1)
  errors:      IntakeValidationError[]
}
