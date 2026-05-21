// @liv-standard v1.5.2
// @present-standard v2.0
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-errors.ts]
// Sprint 2 — Shot 1
//
// PresentError union. Error codes per Present Standard v2.0 §4.5.
// present-rederive-shot-2: @present-standard pin bumped v1.0.1 → v2.0; C1–C6
// criteria + PrG1–PrG8 gates unchanged (validate-intent + run-gates conform).

export type PresentErrorCode =
  | 'PRESENT_INTENT_INVALID'
  | 'PRESENT_AUTH_REJECTED'
  | 'PRESENT_READ_FAILED'
  | 'PRESENT_EMISSION_REJECTED'
  | 'PRESENT_GATE_FAILED'

export type PresentError = {
  code:            PresentErrorCode
  failedCriterion?: 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6'                                      // for PRESENT_INTENT_INVALID
  failedGate?:     'PrG1' | 'PrG2' | 'PrG3' | 'PrG4' | 'PrG5' | 'PrG6' | 'PrG7' | 'PrG8'        // for PRESENT_GATE_FAILED
  message:         string
  underlying?:     unknown
}

// Result envelope per substrate-service convention (mirrors Result<T> in primitives.ts).
export type PresentResult<T> = { ok: true; data: T } | { ok: false; error: PresentError }
