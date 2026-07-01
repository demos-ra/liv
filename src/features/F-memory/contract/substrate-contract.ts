// @liv-standard v1.5.1
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring), sprint-8-audit-patch (F-A: SUBSTRATE_EVENTS re-export), sprint-b2-shot-3 (exportByScope exposed), fixround-core-loop-read-restore (F10: exportByScope subsumed by first-class readScope, exposed from R2 — R4-direct wire removed), foundation-group1 (tokenize exposed at R3; writeRawTurn + readTranscript stay R4-internal, reached only via admitWriteRaw / gather — no R3 re-export)
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-FN     writeStateChange      F-memory/R2 substrate-service
//   W-FN     identityRecurrence    F-memory/R2 substrate-service
//   W-FN     rolePattern           F-memory/R2 substrate-service
//   W-FN     adjacency             F-memory/R2 substrate-service
//   W-FN     threadQuery           F-memory/R2 substrate-service
//   W-FN     readScope             F-memory/R2 substrate-service  (F10: canonical scope-ordered read)
//   W-FN     gather                F-memory/R2 substrate-service  (scope un-weld — the one scope-resolving cognition read / §4 fill-point)
//   W-FN     onBoot                F-memory/R2 substrate-service
//   W-FN     admitWriteRaw         F-memory/R2 substrate-service  (F-009 cognition write face — admit + writeRawTurn)
//   W-FN     gather                F-memory/R2 substrate-service  (Wave-2 read face — readTranscript, WHERE built by scopeClause; no admit token)
//   W-FN     tokenize              F-memory/R4 raw-turn-write     (Group 1)
// wires-out:
//   W-HOOK  writeStateChange    →  perimeter/intake (HR-LM1, Sprint 9 wiring)
//   W-HOOK  threadQuery         →  F-chat, F-plan, F-verify, F-discover, F-router (Sprint 9 wiring)
//   W-HOOK  identityRecurrence  →  general consumers (convenience)
//   W-HOOK  rolePattern         →  general consumers (convenience)
//   W-HOOK  adjacency           →  general consumers (convenience)
//   W-HOOK  onBoot              →  F-event-system/R2 startup (Sprint 8 Shot 4 wiring)
//   (SUBSTRATE_EVENTS now wires to event-schema from the lean substrate-events-contract, not this barrel — wave4-barrel-cycle)
//   W-HOOK  readScope           →  src/app/api/substrate/export/route.ts, F-chat core-loop read (F10)
//   W-HOOK  admitWriteRaw       →  F-chat/R3 chat-contract, F-present wire-turn-service + scored-turn-recorder (F-009 — the one write entry; writeRawTurn is R4-internal, no R3 re-export)
//   W-HOOK  tokenize            →  F-chat/R3 chat-contract (Group 1)
//   W-HOOK  gather              →  F-chat core-loop, F-present cognition-orchestrator + lookup + recorder + wire-turn-service (the one read entry; readTranscript is R4-internal, no R3 re-export)
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
  readScope,
  gather,
  admitWriteRaw,
  EntitlementFloorError,
  identityRecurrence,
  rolePattern,
  adjacency,
  threadQuery,
  onBoot,
} from '../app/substrate-service'
export type { ReadScope } from '../app/substrate-service'
export { mine, PUBLIC_SCOPE } from '../exec/scope-clause'
export type { ScopeSpec } from '../exec/scope-clause'

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

// SUBSTRATE_EVENTS / SubstrateEventType are wired cross-slice from the LEAN substrate-events-contract
// (wave4-barrel-cycle) — NOT re-exported here. The full barrel pulling the events created the
// load-cycle; the one home for the events wire is the lean contract.

// ─── Cognition rail (Group 1 — foundation-group1) ─────────────────────────────
// Only the cut helpers cross here. Both substrate primitives are SEALED behind their
// one-wall seams (no R3 re-export): the write primitive writeRawTurn is reached only by
// admitWriteRaw (F-009 write seal, 1e); the read primitive readTranscript is reached only
// by gather (the read seam, Wave-2 keystone), whose WHERE is built by the one builder
// scopeClause (mine binds user_id; public drops it for source_scope='public' — the one
// relaxation). There is no read admit token. Both primitives stay R4-internal. I1: this
// file holds no F-present logic.
export { cutCells, joinCells, isWordCell } from '../exec/raw-turn-write'

// Re-export substrate-raw types so spine consumers need not reach into core/R5.
export type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// ─── End ──────────────────────────────────────────────────────────────────────
