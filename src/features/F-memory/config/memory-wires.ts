// @liv-standard v1.3
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  pending

// Wire contract registry for F-memory.
// A1: F-memory owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
// Living Memory v1.0 — §20 integration point.

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-node
// payload: MemNode
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-edge
// payload: MemEdge
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-graph
// payload: MemGraph
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-present-state
// payload: PresentState
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-traversal-result
// payload: TraversalResult
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-vital-signs
// payload: MemoryVitalSigns
// version: 1
// status:  active

// @wire
// type:    W-HOOK
// id:      W-HOOK-use-memory-status
// payload: useMemoryStatus() → MemoryVitalSigns
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-memory-repository
// payload: Postgres CRUD (memory-repository.ts)
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-embedding-service
// payload: encode(text) → vector (embedding-service.ts)
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-traversal-complete
// payload: { nodeCount: number; edgeCount: number }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-node-created
// payload: { nodeId: string }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-layer-changed
// payload: { nodeId: string; from: MLayer; to: MLayer }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-source-pruned
// payload: { nodeId: string }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-arm-detected
// payload: { armId: string; nodeCount: number }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-arm-merged
// payload: { armIdA: string; armIdB: string; mergedId: string }
// version: 1
// status:  active

// @wire
// type:    W-EVENT
// id:      W-EVENT-dominance-updated
// payload: { nodeCount: number }
// version: 1
// status:  active

export {}  // module marker — declarations live in @wire blocks above
