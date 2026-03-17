// @liv-standard v1.3
// [F-planner/types/planner-const.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step4b2-phase-c
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  PLANNER_CONST  →  F-planner/R1, F-planner/R2
// deps:       none
// validated:  pending
//
// A6: R0 declares, never imports. Stage strings duplicated here intentionally —
// the canonical type is PipelineStage in planner-types.ts. R0 may not import R0.
// PLANNER_CONST.STAGE_ORDER is the runtime sequence. PipelineStage is the compile-time type.
// These must stay in sync manually — IN-AUDIT enforces parity.
//
// step4b2-phase-a (A3, A6):
//   MODEL_TIER_MAP added. AI_CALL_TIMEOUT_MS added.
//
// step4b2-phase-c (A3, A6):
//   RETRY_LIMITS added — per-stage retry budgets for Phase C retry loops.
//     IN_COMPILE_LOOP: max tsc iterations while error count is decreasing.
//     IN_COMPILE_STALL: consecutive non-decreasing iterations before IN-DIAGNOSE.
//     IN_AUDIT routes to IN-BUILD on failure (not retry-in-place) — limit applies
//     to IN-BUILD retries triggered by audit rejection.
//   FAILSAFE added — hard caps that abort the pipeline regardless of retry state.
//     MAX_TRANSITIONS: per build. Prevents infinite loops across all stages.
//     MAX_REENTRIES: per build. Re-entry is expensive; cap at 3.
//     MAX_BUILD_TIME_MS: wall-clock cap from confirmed to terminal state.
//     AI_RETRY_LIMIT: infrastructure retries before CLASS_3 escalation.
//   Existing MAX_RETRIES_PER_STAGE retained for backward compatibility with
//   advanceStage() (Phase B). RETRY_LIMITS supersedes it for runPipeline() (Phase C).
//   Axiom cite: A6 — declared at R0 of owner. A3 — typed constants only.

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
    IN_MAIN:    5  * 60 * 1000,
    IN_BUILD:   30 * 60 * 1000,
    IN_RESOLVE: 10 * 60 * 1000,
    IN_AUDIT:   10 * 60 * 1000,
    IN_COMPILE:  5 * 60 * 1000,
    IN_QA:       5 * 60 * 1000,
  },

  // Retained for advanceStage() backward compatibility (Phase B HTTP routes)
  MAX_RETRIES_PER_STAGE: {
    IN_MAIN:    0,
    IN_BUILD:   2,
    IN_RESOLVE: 2,
    IN_AUDIT:   1,
    IN_COMPILE: 3,
    IN_QA:      1,
  },

  LOG_ENTRIES_WARN_THRESHOLD: 50,

  // ── Model resolution (step4b2-phase-a) ──────────────────────────────────────
  MODEL_TIER_MAP: {
    'anthropic-only': {
      Largest:  'claude-sonnet-4-20250514',
      Medium:   'claude-haiku-4-5-20251001',
      Smallest: 'claude-haiku-4-5-20251001',
    },
    'deepseek-only': {
      Largest:  'deepseek-chat',
      Medium:   'deepseek-chat',
      Smallest: 'deepseek-chat',
    },
    'both': {
      Largest:  'claude-sonnet-4-20250514',
      Medium:   'deepseek-chat',
      Smallest: 'deepseek-chat',
    },
  } as const,

  AI_CALL_TIMEOUT_MS: 120_000,

  // ── Retry budgets (step4b2-phase-c) ─────────────────────────────────────────
  // Used by runPipeline() Phase C retry loops. Supersedes MAX_RETRIES_PER_STAGE
  // for the autonomous pipeline path.
  RETRY_LIMITS: {
    // Retries before re-entering IN-MAIN
    IN_BUILD:          3,
    IN_RESOLVE:        2,
    IN_QA:             2,
    // IN-AUDIT failure routes back to IN-BUILD — IN-BUILD retry budget applies.
    // This limit governs how many times audit can reject before counting as
    // an IN-BUILD exhaustion (contributing to IN-BUILD retry count).
    IN_AUDIT:          2,
    // IN-COMPILE tsc loop: max iterations while error count is decreasing
    IN_COMPILE_LOOP:   10,
    // IN-COMPILE stall: consecutive non-decreasing iterations before IN-DIAGNOSE
    IN_COMPILE_STALL:  1,
  } as const,

  // ── Failsafes (step4b2-phase-c) ─────────────────────────────────────────────
  // Hard caps checked before every stage transition in runPipeline().
  // Breach of any failsafe → pipeline_status = 'failed', reason logged.
  // These are absolute — they override retry budgets.
  FAILSAFE: {
    MAX_TRANSITIONS:   50,               // per build, across all stages
    MAX_REENTRIES:     3,                // per build, back to IN-MAIN
    MAX_BUILD_TIME_MS: 30 * 60 * 1000,  // 30 min from pipeline start to terminal
    AI_RETRY_LIMIT:    1,               // infrastructure retries before CLASS_3
  } as const,

} as const

export const PLANNER_NAMESPACE = 'planner' as const
