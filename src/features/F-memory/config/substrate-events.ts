// @liv-standard v1.5.1
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-8-shot-1 (substrate authoring)
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM SUBSTRATE_EVENTS    →  F-event-system/R0 (event-schema), substrate consumers
//   W-ATOM SubstrateEventType  →  F-memory/*, F-event-system
// deps:       none
// validated:  pending

// Living Memory v3.1 — substrate event declarations.
// R0: zero dependencies. Pure constant + type.
// Canonical spec: src/core/standards/living-memory.md
//
// A5: each slice declares its own events.
// A6: declared at R0.
//
// Sprint 8 Shot 1: authored alongside legacy memory-events.ts.

export const SUBSTRATE_EVENTS = {
  /** SW3 commit succeeded — new StateChangeRecord written. Carries position + scope. */
  STATE_CHANGE_WRITTEN: 'substrate.state-change-written',

  /** SW3 RevokeRef detected — target StateChangeRecord deleted in-band (LMA2). */
  STATE_CHANGE_REVOKED: 'substrate.state-change-revoked',

  /** SW2 gate failed — write rejected. Carries axiom id + reason. */
  WRITE_GATE_FAILED:    'substrate.write-gate-failed',

  /** Substrate boot hydration complete — substrate readable. */
  BOOT_COMPLETE:        'substrate.boot-complete',
} as const

export type SubstrateEventType =
  typeof SUBSTRATE_EVENTS[keyof typeof SUBSTRATE_EVENTS]
