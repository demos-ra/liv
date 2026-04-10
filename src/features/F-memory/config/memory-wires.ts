// @liv-standard v1.3
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:  (this file IS the wire contract registry — see @wire blocks below)
// deps:       none
// validated:  pending

// Wire contract registry for F-memory.
// A1: F-memory owns every wire declared here.
// A6: all outbound wires declared at R0 of the defining slice.
// Living Memory v1.1 — §20 integration point.
//
// lm-v1.1 wire changes (WC.1: version incremented per T6.4):
//   W-ATOM-mem-node v1→v2: +userId (Amendment 3)
//   W-ATOM-mem-edge v1→v2: +primitiveType, +createdAt, +userId (Amendments 1+3)
//   W-ATOM-mem-arm  v1→v2: +userId (Amendment 3)

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-node
// payload: MemNode
// version: 2
// status:  active
// note:    v2: +userId (Amendment 3)

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-edge
// payload: MemEdge
// version: 2
// status:  active
// note:    v2: +primitiveType, +createdAt, +userId (Amendments 1+3)

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-graph
// payload: MemGraph
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-mem-arm
// payload: MemArm
// version: 2
// status:  active
// note:    v2: +userId (Amendment 3)

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
