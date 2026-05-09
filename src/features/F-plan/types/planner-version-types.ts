// @liv-standard v1.3
// [F-planner/types/planner-version-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5e
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  SemVer        →  F-planner/R1, F-planner/R4
//   W-ATOM  VersionBump   →  F-planner/R1
//   W-ATOM  BuildVersion  →  F-planner/R1, F-planner/R2, F-planner/R3, F-planner/R4
// deps:       none
// validated:  pending
//
// step5e (A1, A6, A7):
//   New file. Version management is a distinct domain concern from the pipeline
//   job domain — kept separate from planner-types.ts per A7 (deletable independently).
//   Same pattern as planner-library-types.ts.
//   Axiom cite: A1 — F-planner is sole owner of build version types. A6 — declared
//   at R0 of owning slice. A7 — separate file, removable without touching core pipeline.

// ── AK-ENT — parsed semver ────────────────────────────────────────────────────
export type SemVer = {
  major: number
  minor: number
  patch: number
}

// ── AK-ENUM — which component to increment ────────────────────────────────────
export type VersionBump = 'major' | 'minor' | 'patch'

// ── AK-ENT — completed build version record ───────────────────────────────────
// Returned by dbGetVersionHistory. Matches the columns written by dbSetBuildVersion.
export type BuildVersion = {
  buildId:     string
  projectId:   string
  version:     string     // "1.0.0"
  description: string     // featureIntent from IF contract — stored denormalized
  createdAt:   number     // epoch ms
}
