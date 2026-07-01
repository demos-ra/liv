// @liv-standard v1.5.2
// [F-memory/R3]
// Built with LIV · livai.dev
// [F-memory/contract/substrate-events-contract.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    wave4-barrel-cycle (lean events re-export — the A2 wire for SUBSTRATE_EVENTS alone)
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-ATOM  SUBSTRATE_EVENTS / SubstrateEventType   ../config/substrate-events  (R0 — the atoms)
// wires-out:
//   W-ATOM  SUBSTRATE_EVENTS  →  F-event-system/R0 event-schema (the cross-slice events wire, A2 via R3)
// deps:
//   R0  ../config/substrate-events
// validated: pending
//
// THE LEAN EVENTS WIRE. The full substrate barrel (substrate-contract) re-exports the whole R2/R3
// graph (admitWriteRaw / gather / readScope / the service); a consumer that needs ONLY the event
// names must not pull that graph. A cold load of the full barrel from event-schema formed a
// load-time cycle (barrel → substrate-service → event-schema → barrel, SUBSTRATE_EVENTS read
// mid-init → undefined). This file carries ONLY the R0 event atoms — importing it pulls no
// relational/service code, so the cycle cannot form. event-schema imports HERE, not the full barrel.
//
// A2-compliant (cross-slice via an R3 surface), but a LEAN one: zero behaviour, no keystone
// (scopeClause / admit*) reachable from this path — pure atom re-export.

export { SUBSTRATE_EVENTS } from '../config/substrate-events'
export type { SubstrateEventType } from '../config/substrate-events'
