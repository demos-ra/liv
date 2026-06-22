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
//   W-FN  recordScoredTurn       →  F-mcp (turn door) + /api/compose (REST) — WRAPS the recorder, returns WriteAck
//   W-ATOM WriteAck              →  F-mcp + REST (the honest write-ack — landed:false carries no sc)
//   W-FN  presentOrDegraded      →  F-mcp (turn door) + /api/compose (REST) — post-write present-or-degraded (§1b)
//   W-ATOM DegradedPresent       →  F-mcp + REST (the one named degraded payload)
//   W-FN  emissionFromStructured →  F-mcp (turn tool, who:'llm') — the narrowing/gate filter
//   W-FN  projectEmissionSchema  →  F-mcp (turn tool — the `turn` inputSchema is a derived view)
//   W-ATOM MarkingSituation      →  F-mcp (MCP_SITUATION — the wire's per-surface contract choices, type-only)
//   W-ATOM COIN_MANUAL           →  F-mcp (turn tool — manual rides the description, one home)
//   W-FN  search/parseSearchSpec →  F-mcp (search tool — the text-pivot: region × lens)
//   W-ATOM SearchRegion/Lens/Spec/Result  →  F-mcp (search tool — type-only)
//   W-ATOM PRESENT_BUNDLES       →  F-mcp (present/turn — R7 rail-aware bundle: wire = tables only)
//   W-FN  recordWireTurn         →  F-mcp (compose door) + /api/compose (REST) — the one wire turn-service (A1)
//   W-FN  captureWearerTurn      →  F-mcp (summary door) + /api/compose (REST) — E1 capture-at-submit (writeRawTurn, native's mechanism)
//   W-ATOM WireTurn*/WireCapture*/AbsentCaptureFlag  →  F-mcp + REST (the wire turn-service carriers/outcomes/mode, type-only)
// re-export deps:
//   R1  ../domain/mark-gate      (isMark)
//   R1  ../domain/coin-score     (emissionFromStructured, ScoredEmission, MarkSurfaceError)
//   R0  ../config/coin-manual    (COIN_MANUAL)
//   R0  ../config/read-engine-types  (PRESENT_BUNDLES)
//   R0  ../config/write-ack-types    (WriteAck)
//   R2  ../app/cognition-orchestrator
//   R2  ../app/scored-turn-recorder  (aliased — wrapped by recordScoredTurn, returns WriteAck)
//   R2  ../app/write-ack             (toWriteAck — the one ack deriver)
//   R2  ../app/lookup            (search, parseSearchSpec, Search* types)
//   R3  ./read-surface
//   R3  ./present-or-degraded    (presentOrDegraded, DegradedPresent — the post-write read-door, §1b)
//   core @/core/types/substrate-raw.types  (Who — recordScoredTurn wrapper param)

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

// The scored-turn write surface (sprint-wire-cognition Shot 1/4) — symmetric with readPresent.
// The demanded wire (F-mcp write, who:'llm') records a pair-scored turn HERE: emissionFromStructured
// narrows the agent's emission through the same gate the native path uses, then the recorder lands
// it (cut once → write → split → verify → place). The door no longer re-exports the RAW recorder
// (§1a): it WRAPS it — keeping the name `recordScoredTurn` — so every rail derives the ONE honest
// acknowledgement. The wrapper returns the R3 WriteAck (toWriteAck reads the write evidence — cells
// — never sc; landed:false carries no sc). MarkSurfaceError — the loud, ATOMIC reject — propagates
// THROUGH the wrapper unchanged, ahead of any ack (only a RETURNED RecordedTurn is folded). COIN_MANUAL
// is surfaced for the present tool's manual-with-present return (one home — config/coin-manual).
import { recordScoredTurn as recordScoredTurnRaw } from '../app/scored-turn-recorder'
import type { WearerSource, ScoredTurnDeps } from '../app/scored-turn-recorder'
import { toWriteAck } from '../app/write-ack'
import type { WriteAck } from '../config/write-ack-types'
import type { ScoredEmission } from '../domain/coin-score'
import type { Who } from '@/core/types/substrate-raw.types'

export async function recordScoredTurn(
  emission: ScoredEmission,
  who: Who,
  userId: string,
  scope: string,
  wearer: WearerSource,
  deps?: ScoredTurnDeps,
): Promise<WriteAck> {
  const recorded = await recordScoredTurnRaw(emission, who, userId, scope, wearer, deps)
  return toWriteAck(recorded)
}
export type { WriteAck }
export { emissionFromStructured, MarkSurfaceError } from '../domain/coin-score'
export type { ScoredEmission } from '../domain/coin-score'
export { COIN_MANUAL } from '../config/coin-manual'

// The post-write present-or-degraded (R3 read-door, §1b — rehomed here from F-mcp so REST gains
// the same guard MCP has, and so it imports readPresent in-layer). The turn door (MCP) and the
// /api/compose route (REST) both derive their honest post-write response from this one unit.
export { presentOrDegraded } from './present-or-degraded'
export type { DegradedPresent } from './present-or-degraded'

// The emission contract's PROJECTOR (cognition-turn contract — one core-owned shape). The
// wire derives its `turn` inputSchema as projectEmissionSchema(MCP_SITUATION) at F-mcp R3 —
// it never hand-declares the emission shape. MarkingSituation is the per-surface choice set
// (carry wearerText? demand all? field descriptions?). One contract, surfaces derive.
export { projectEmissionSchema } from '../domain/coin-score'
export type { MarkingSituation } from '../domain/coin-score'

// search (region × lens — the text-pivot): the one read door, exposing both the raw cells
// (cellsOf) and the rendered grid (pivot → renderGrid) through region × lens. The wire `search`
// tool maps here; turn|span|thing are region shorthands. The superseded `lookup`/Lookup* R3
// re-exports are gone — search is the one read surface; lookup() stays an internal helper of
// app/lookup that search composes (PRESENT_BUNDLES.wire = tables only; cells fetched on demand).
export { search, parseSearchSpec } from '../app/lookup'
export type { SearchRegion, SearchLens, SearchSpec, SearchResult } from '../app/lookup'
export { PRESENT_BUNDLES } from '../config/read-engine-types'

// A1 — the ONE wire turn-service (capture · deliver · record · ack), surfaced for the agent-driven
// write surfaces (the MCP `summary`/`compose` doors and the REST /api/compose plug). E1: the wire
// captures the wearer turn at submit (captureWearerTurn — writeRawTurn, native's exact mechanism)
// and records the reply at Stop (recordWireTurn — wearer:{written}, no wearerText re-carry). Both
// drivers call these and map the discriminated outcomes to their own envelope (JSON-RPC codes /
// HTTP codes — the per-surface variable). wire-turn-service composes the in-layer turn-services
// (emissionFromStructured / recordScoredTurn / presentOrDegraded / readPresent) re-exported above
// plus the entitlement crossing decision and the substrate capture — one home, the driver stays thin.
export { recordWireTurn, captureWearerTurn } from './wire-turn-service'
export type {
  WireTurnInput, WireTurnIdentity, WireTurnOutcome,
  WireCaptureInput, WireCaptureOutcome, WireCaptureMode, AbsentCaptureFlag,
} from './wire-turn-service'
