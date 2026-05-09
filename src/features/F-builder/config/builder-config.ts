// @liv-standard v1.5.1
// [F-builder/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring)
// slice:      F-builder
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  BUILDER_CONFIG  →  F-builder/R2 builder-workflow
// deps:       none
// validated:  pending

export const BUILDER_CONFIG = {
  // Maximum re-entry attempts before escalation (mirrors FAILSAFE.MAX_REENTRIES
  // in F-planner — single source of truth deferred to Sprint 12 when F-planner
  // types move to F-builder R0).
  MAX_REENTRIES: 3,
  // Log prefix for structured JSON log lines emitted by F-builder.
  LOG_SLICE: 'F-builder',
} as const

// ─── End ──────────────────────────────────────────────────────────────────────
