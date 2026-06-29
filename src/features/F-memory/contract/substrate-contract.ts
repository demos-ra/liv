// @liv-standard v1.5.1
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring), sprint-8-audit-patch (F-A: SUBSTRATE_EVENTS re-export), sprint-b2-shot-3 (exportByScope exposed), fixround-core-loop-read-restore (F10: exportByScope subsumed by first-class readScope, exposed from R2 — R4-direct wire removed), foundation-group1 (writeRawTurn/tokenize/readTranscript exposed at R3 — spine consumers import R3, not exec)
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-FN     writeStateChange      F-memory/R2 substrate-service
//   W-FN     readStateChange       F-memory/R2 substrate-service
//   W-FN     iterateAxis           F-memory/R2 substrate-service
//   W-FN     identityRecurrence    F-memory/R2 substrate-service
//   W-FN     rolePattern           F-memory/R2 substrate-service
//   W-FN     adjacency             F-memory/R2 substrate-service
//   W-FN     threadQuery           F-memory/R2 substrate-service
//   W-FN     readScope             F-memory/R2 substrate-service  (F10: canonical scope-ordered read)
//   W-FN     gather                F-memory/R2 substrate-service  (scope un-weld — the one scope-resolving cognition read / §4 fill-point)
//   W-FN     onBoot                F-memory/R2 substrate-service
//   W-ATOM   SUBSTRATE_EVENTS      F-memory/R0 substrate-events
//   W-ATOM   SubstrateEventType    F-memory/R0 substrate-events
//   W-FN     writeRawTurn          F-memory/R4 raw-turn-write     (cognition rail — Group 1)
//   W-FN     tokenize              F-memory/R4 raw-turn-write     (Group 1)
//   W-FN     readTranscript        F-memory/R4 transcript-read    (Group 1)
// wires-out:
//   W-HOOK  writeStateChange    →  perimeter/intake (HR-LM1, Sprint 9 wiring)
//   W-HOOK  threadQuery         →  F-chat, F-plan, F-verify, F-discover, F-router (Sprint 9 wiring)
//   W-HOOK  readStateChange     →  general consumers
//   W-HOOK  iterateAxis         →  general consumers
//   W-HOOK  identityRecurrence  →  general consumers (convenience)
//   W-HOOK  rolePattern         →  general consumers (convenience)
//   W-HOOK  adjacency           →  general consumers (convenience)
//   W-HOOK  onBoot              →  F-event-system/R2 startup (Sprint 8 Shot 4 wiring)
//   W-ATOM  SUBSTRATE_EVENTS    →  F-event-system/R0 event-schema (cross-slice via R3 per A2)
//   W-HOOK  readScope           →  src/app/api/substrate/export/route.ts, F-chat core-loop read (F10)
//   W-HOOK  writeRawTurn        →  F-chat/R3 chat-contract, F-present/R2 cognition-orchestrator (Group 1)
//   W-HOOK  tokenize            →  F-chat/R3 chat-contract (Group 1)
//   W-HOOK  readTranscript      →  F-chat/R3 chat-contract, F-present/R2 cognition-orchestrator (Group 1)
// deps:
//   R2  ../app/substrate-service
//   R0  ../config/substrate-events
//   R4  ../exec/raw-turn-write
//   R4  ../exec/transcript-read
//   R5  @/core/types/substrate.types
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v3.1 — substrate public contract.
// R3: thin wire. No logic. No DB. No procedures.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
//
// HR-LM1 — perimeter/intake → LM write surface (LM v3.1 §6.2).
//   Caller submits SubstrateWriteInput. LM executes SW1–SW3 atomically (LMA4).
//   Authority enforcement and scope access control are perimeter responsibilities;
//   LM writes whatever arrives.
//
// All other slices import from this file — never from app/, exec/.
// A1: declared once. A6: outbound surface declared at R3 of the defining slice.
//
// Sprint 8 Shot 1 note: this contract is authored at the R3 surface but is not
// yet bound to consumers. F-chat, F-plan, F-verify, F-discover, F-router,
// admin routes wire to this surface at Sprint 9 (rewire sprint).

export {
  writeStateChange,
  readStateChange,
  iterateAxis,
  readScope,
  gather,
  identityRecurrence,
  rolePattern,
  adjacency,
  threadQuery,
  onBoot,
} from '../app/substrate-service'
export type { ReadScope } from '../app/substrate-service'

// F10: exportByScope (was R4-direct-wired) is subsumed — the scope-ordered read
// is first-class as readScope, exposed here from the R2 service. The export
// route and the core-loop read both consume readScope; one read, not two.

// Re-export R5 substrate atoms so external consumers import everything from
// the contract surface without reaching into core/R5 directly. This matches
// the existing F-memory pattern (memory-contract re-exports R0 atoms).

export type {
  SubstrateWriteInput,
  ThreadQueryInput,
  StateChangeRecord,
  ThreadResult,
  StateChangeId,
  IdentityRef,
  ScopeRef,
  SubstrateSourceRef,
  PositionRef,
  RoleRef,
  Relation,
  RelationModality,
  IdentityWithRole,
  ThreadKind,
  SourceChannel,
} from '@/core/types/substrate.types'

export { REVOKE_REF } from '@/core/types/substrate.types'

// audit-patch F-A: SUBSTRATE_EVENTS re-export for cross-slice consumers
// (F-event-system/config/event-schema.ts imports from this R3 surface per A2).
// Constant lives at F-memory/R0 substrate-events; this is a thin pass-through.
export { SUBSTRATE_EVENTS } from '../config/substrate-events'
export type { SubstrateEventType } from '../config/substrate-events'

// ─── Cognition rail (Group 1 — foundation-group1) ─────────────────────────────
// writeRawTurn, tokenize, readTranscript were reached directly from the spine
// via F-memory/exec/ (A2 violation). Exposed here as the single R3 gate.
// Same functions, same signatures — one indirection only. I1: this file has
// zero F-present imports; the core write path still holds no F-present logic.
export { writeRawTurn, cutCells, joinCells, isWordCell } from '../exec/raw-turn-write'
export { readTranscript }         from '../exec/transcript-read'

// Re-export substrate-raw types so spine consumers need not reach into core/R5.
export type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// ─── End ──────────────────────────────────────────────────────────────────────
