// @liv-standard v1.5.1
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring)
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  pending

// Wire contract registry for the F-memory substrate (Living Memory v3.1).
// A1: F-memory owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
// Canonical spec: PLACEMENT_REGISTRY.living_memory_standard
//
// Sprint 8 Shot 1: authored alongside legacy memory-wires.ts.
// Substrate wires below are independent of legacy LM v1.1 wires; both files
// coexist in R0 until Shot 3 dissolve.

// ─── R3 surface contracts ─────────────────────────────────────────────────────

// @wire
// type:    W-HOOK
// id:      W-HOOK-substrate-write
// payload: writeStateChange(input: SubstrateWriteInput) → WriteResult
// version: 1
// status:  active
// note:    HR-LM1 — perimeter/intake → LM write surface (LM v3.1 §6.2)

// @wire
// type:    W-HOOK
// id:      W-HOOK-substrate-thread-query
// payload: threadQuery(input: ThreadQueryInput) → ThreadQueryResult
// version: 1
// status:  active
// note:    Composes identity-recurrence, role-pattern, adjacency per LMA9

// @wire
// type:    W-HOOK
// id:      W-HOOK-substrate-on-boot
// payload: onBoot() → Promise<Result<void>>
// version: 1
// status:  active

// ─── R3 wire-atoms (input/output shapes) ──────────────────────────────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-substrate-write-input
// payload: SubstrateWriteInput
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-thread-query-input
// payload: ThreadQueryInput
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-state-change-record
// payload: StateChangeRecord
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-thread-result
// payload: ThreadResult
// version: 1
// status:  active

// ─── R4 injection ─────────────────────────────────────────────────────────────

// @wire
// type:    W-INJECT
// id:      W-INJECT-substrate-repository
// payload: Postgres CRUD against state_change table (substrate-repository.ts)
// version: 1
// status:  active

// ─── Events ───────────────────────────────────────────────────────────────────

// @wire
// type:    W-EVENT
// id:      W-EVENT-state-change-written
// payload: { id: StateChangeId; position: PositionRef; scope: ScopeRef }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-state-change-revoked
// payload: { revokedId: StateChangeId; revokedPosition: PositionRef }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-write-gate-failed
// payload: { axiom: SubstrateGateAxiomId; reason: string }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-substrate-boot-complete
// payload: { lastPosition: PositionRef | null }
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
