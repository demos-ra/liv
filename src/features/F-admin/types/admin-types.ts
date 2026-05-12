// @liv-standard v1.3
// [F-admin/types/admin-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-phaseA
// slice:      F-admin
// category:   Modality
// layer:      R0
// wires-in:   none (R0 — pure declarations)
// wires-out:
//   W-ATOM  AdminBuild             →  F-admin/R3 (admin-ui.tsx), F-admin/R4 (admin-db.ts)
//   W-ATOM  PipelineReportSummary  →  F-admin/R3 (admin-ui.tsx), F-admin/R4 (admin-db.ts)
//   W-ATOM  AdminBuildsFilter      →  F-admin/R4 (admin-db.ts)
// deps:      none
// validated: pending
//
// step5b-phaseA (A1, A3, A6):
//   New file. F-admin declares its own atoms (A1 — F-admin owns its types).
//   These are read-only projections of the builds table — not imports from
//   F-planner types (A1: F-admin is its own owner, F-planner owns pipeline internals).
//   Shape mirrors DB columns, not F-planner internal types.
//   Axiom cite: A1 — separate ownership. A3 — typed atoms at boundary. A6 — at R0.

// ── PipelineReportSummary ─────────────────────────────────────────────────────
// Projection of the pipeline_report JSON column in builds table.
// Read-only. F-admin never writes to this shape.
export type PipelineReportSummary = {
  outcome:          string | null
  failureReason:    string | null
  stages:           PipelineStageEntry[]
  totalTransitions: number
  reentries:        number
  startedAt:        number
  completedAt?:     number
}

export type PipelineStageEntry = {
  instanceId:   string
  model:        string
  startedAt:    number
  completedAt:  number
  tokenCount:   number
  handoffValid: boolean
}

// ── AdminBuild ────────────────────────────────────────────────────────────────
// Read-only projection of a row in the builds table.
export type AdminBuild = {
  buildId:          string
  projectId:        string
  userId:           string
  status:           string
  currentStage:     string | null
  pipelineReport:   PipelineReportSummary | null
  transitionCount:  number
  reentryCount:     number
  createdAt:        number
  updatedAt:        number
}

// ── AdminBuildsFilter (A3) ────────────────────────────────────────────────────
// Input type for dbGetBuilds — typed boundary, not raw query params.
export type AdminBuildsFilter = {
  status?: string[]
  limit?:  number
}
