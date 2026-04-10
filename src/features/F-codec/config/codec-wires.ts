// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  MemNode, MemEdge, MemGraph, PresentState, TraversalOptions, EdgePrimitiveType  ←  F-memory/R0
//   W-FN    traverse(), getPresentState()  ←  F-memory/R3
//   W-EVENT pipeline.started, pipeline.completed, pipeline.failed, stage.completed, stage.failed  ←  F-planner/R0 (via event bus, A5)
//   W-FN    getApiKey()  ←  F-user-profile/R3
//   W-FN    emitEvent(), subscribeToEvent()  ←  F-event-system/R3
// wires-out:
//   W-ATOM  EncodeResult, CognitivePrimitive, ClassifyResult  →  F-codec consumers
//   W-HOOK  encode()  →  F-chat (post-integration)
//   W-EVENT codec.encode-complete, codec.encode-failed  →  F-event-system
// deps:       none
// validated:  pending

// T6.4: wire contract declarations for F-codec.
// A6: declared at R0. This file is documentation — no runtime exports.
// A1: F-codec owns encode. F-memory owns graph mutation. F-codec tells, F-memory executes.
// A2: F-codec depends on F-memory (lower), F-event-system (lower), F-user-profile (lower).
//     No slice depends on F-codec yet (F-chat integration is a follow-on task).
// A5: planner events consumed via event bus — no direct F-planner import.

export {}  // module marker — declarations live in @wire blocks above