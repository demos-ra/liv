// @liv-standard v1.3
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  MEMORY_EVENTS      →  F-event-system/R0 (event-schema)
//   W-ATOM  MemoryEventType    →  F-memory/*
// deps:       none
// validated:  pending

// Living Memory v1.0 — event declarations.
// A5: each slice declares its own events. This file is the authority.
// A6: declared at R0. Zero dependencies.
// §19: 7 events replacing v0.6's 5 events.
// F-event-system/config/event-schema.ts re-exports these.

export const MEMORY_EVENTS = {
  /** runTraversal() committed — graph mutated */
  TRAVERSAL_COMPLETE:  'memory.traversal-complete',

  /** New node entered graph at M4 */
  NODE_CREATED:        'memory.node-created',

  /** Node transitioned between M-layers */
  LAYER_CHANGED:       'memory.layer-changed',

  /** Source text cleared on M3→M2 transition. MA3: structural position carries meaning. */
  SOURCE_PRUNED:       'memory.source-pruned',

  /** New community structure found by detectArms() */
  ARM_DETECTED:        'memory.arm-detected',

  /** Two arms merged — cross-domain edge density exceeded threshold */
  ARM_MERGED:          'memory.arm-merged',

  /** Background recomputeDominance() complete */
  DOMINANCE_UPDATED:   'memory.dominance-updated',
} as const

export type MemoryEventType = typeof MEMORY_EVENTS[keyof typeof MEMORY_EVENTS]
