// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-contract.ts]
// Sprint 2 — Shot 1; read-engine (the lens re-derivation):
//   the v6.0 frame/intent/archive re-export set is gone with present-types /
//   present-errors / present-trpc / present-service; the read surface is now the
//   engine's rendered present. present() and the v6.0 presentRouter re-exports
//   are stripped; readPresent + presentRouter come from read-surface.ts.
//
// Public R3 boundary for F-present. External consumers MUST import from this
// surface only. Do NOT reach into F-present R0/R1/R2/R4 directly.
//
// R3 surface (wires-out):
//   W-FN  readPresent            →  F-mcp (present tool), /api/present (REST)
//   W-FN  presentRouter          →  F-identity/router (tRPC)
//   W-FN  registerCognitionUpgrades  →  F-chat, F-event-system/startup
//   W-FN  isMark                 →  scripts/reconcile-present-marks (the gate, surfaced)
//   W-FN  recordScoredTurn       →  F-mcp (write tool, who:'llm') — the scored-turn recorder
//   W-FN  emissionFromStructured →  F-mcp (write tool, who:'llm') — the narrowing/gate filter
//   W-ATOM COIN_MANUAL           →  F-mcp (present tool — manual-with-present, one home)
// re-export deps:
//   R1  ../domain/mark-gate      (isMark)
//   R1  ../domain/coin-score     (emissionFromStructured, ScoredEmission)
//   R0  ../config/coin-manual    (COIN_MANUAL)
//   R2  ../app/cognition-orchestrator
//   R2  ../app/scored-turn-recorder
//   R3  ./read-surface

// The read surface — the removable lens, rendered to context text.
export { readPresent, presentRouter } from './read-surface'

// The cognition composition wire. F-event-system bootstrap() and F-chat call
// this to register F-present's write-compose + read-front upgraders into the core
// cognition seam. The single removable wire: drop the call + this slice and the
// core loop runs its baseline.
export { registerCognitionUpgrades } from '../app/cognition-orchestrator'

// The mark gate (R1, pure) surfaced for EXTERNAL consumers that must narrow marks
// against the SAME isMark the engine uses — e.g. the reconciliation script. External
// code reaches the gate HERE (the R3 boundary), never via domain/mark-gate directly.
export { isMark } from '../domain/mark-gate'

// The scored-turn write surface (sprint-wire-cognition Shot 1/4) — symmetric with
// readPresent. The demanded wire (F-mcp write, who:'llm') records a pair-scored turn
// HERE: emissionFromStructured narrows the agent's emission through the same gate the
// native path uses, then recordScoredTurn lands it (cut once → write → split → verify →
// place). COIN_MANUAL is surfaced for the present tool's manual-with-present return
// (one home — defined in config/coin-manual, never re-declared at the wire).
export { recordScoredTurn } from '../app/scored-turn-recorder'
export { emissionFromStructured, MarkSurfaceError } from '../domain/coin-score'
export type { ScoredEmission } from '../domain/coin-score'
export { COIN_MANUAL } from '../config/coin-manual'

// The read controls + the rail-aware bundle (sprint-wire-economy R7/R8). The wire reads the
// present (PRESENT_BUNDLES.wire = tables only) and fetches cells on demand via lookup (turn |
// span | thing → numbered cells — grid generalized, re-homed here). One home per surface.
export { lookup } from '../app/lookup'
export type { LookupSelector, LookupResult, LookupCell } from '../app/lookup'
export { PRESENT_BUNDLES } from '../config/read-engine-types'
