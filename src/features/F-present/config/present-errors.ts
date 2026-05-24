// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-errors.ts]
// Sprint 2 — Shot 1
//
// PresentError union. Error codes per Present Standard v6.0 §4.5.
// Four error codes — unchanged across v4.0/v5.0/v6.0; none is
// focus/camera/lens/temporal-specific. failedGate union: 7 gates.
// sprint-b3-present-v6 — Shot 7: J-intent-binding criteria are re-stated
//   against the three-control envelope (C1 standpoint, C2 camera, C3 temporal).
//   failedCriterion union widens 'C1'|'C2' → 'C1'|'C2'|'C3'. Error CODE count
//   unchanged at 4 — PRESENT_INTENT_INVALID fires on any failed criterion.

export type PresentErrorCode =
  | 'PRESENT_INTENT_INVALID'
  | 'PRESENT_AUTH_REJECTED'
  | 'PRESENT_READ_FAILED'
  | 'PRESENT_GATE_FAILED'

export type PresentError = {
  code:            PresentErrorCode
  failedCriterion?: 'C1' | 'C2' | 'C3'                                                   // for PRESENT_INTENT_INVALID (v6.0: three-control envelope — C1 standpoint, C2 camera, C3 temporal)
  failedGate?:     'PrG1' | 'PrG2' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8'          // for PRESENT_GATE_FAILED
  message:         string
  underlying?:     unknown
}

// Result envelope per substrate-service convention (mirrors Result<T> in primitives.ts).
export type PresentResult<T> = { ok: true; data: T } | { ok: false; error: PresentError }
