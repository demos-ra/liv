// @liv-standard v1.3
// [F-planner/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  PLANNER_CONST  →  F-planner/R1, F-planner/R2
// deps:       none
// validated:  2026-03-12

// A6: R0 declares, never imports. Stage strings duplicated here intentionally —
// the canonical type is PipelineStage in planner-types.ts. R0 may not import R0.
// PLANNER_CONST.STAGE_ORDER is the runtime sequence. PipelineStage is the compile-time type.
// These must stay in sync manually — IN-AUDIT enforces parity.

export const PLANNER_CONST = {
  // Stage execution order — index determines sequence. Never reorder.
  STAGE_ORDER: [
    'IN_MAIN',
    'IN_BUILD',
    'IN_RESOLVE',
    'IN_AUDIT',
    'IN_COMPILE',
    'IN_QA',
  ] as const,

  // Per-stage timeout in milliseconds
  STAGE_TIMEOUTS_MS: {
    IN_MAIN:    5  * 60 * 1000,   //  5 min — human gate, short for auto fields
    IN_BUILD:   30 * 60 * 1000,   // 30 min — parallel slice builds
    IN_RESOLVE: 10 * 60 * 1000,   // 10 min — cross-bundle reconciliation
    IN_AUDIT:   10 * 60 * 1000,   // 10 min — manifest verification
    IN_COMPILE:  5 * 60 * 1000,   //  5 min — tsc loop
    IN_QA:       5 * 60 * 1000,   //  5 min — T5.3 checklist
  },

  // Max retries per stage before hard failure
  MAX_RETRIES_PER_STAGE: {
    IN_MAIN:    0,   // no retries — human gate
    IN_BUILD:   2,
    IN_RESOLVE: 2,
    IN_AUDIT:   1,
    IN_COMPILE: 3,   // tsc loop may need multiple passes
    IN_QA:      1,
  },

  // Soft cap — warn when pipeline_log entries exceed this per job
  LOG_ENTRIES_WARN_THRESHOLD: 50,
} as const

export const PLANNER_NAMESPACE = 'planner' as const
