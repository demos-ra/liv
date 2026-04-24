// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-nodeid-propagation
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  NodeId           core/R5 (primitives)
//   W-ATOM  DecodeCategory   F-codec/R0
//   W-ATOM  MLayer           F-memory/R0
// wires-out:
//   W-ATOM  MemoryTreeNode   →  F-codec/*
//   W-ATOM  MemoryAction     →  F-codec/*
//   W-ATOM  MemoryViewState  →  F-codec/*
// deps:
//   R0  ./codec-decode-types
//   R0  ../../F-memory/config/memory-types
//   R5  @/core/types/primitives
// validated:  pending

// Memory program types.
// A6: declared at R0 — consumed by R2 actions + R3 UI component.
// CA8: tree structure derived from decode output, not authored.
// 4b-nodeid-propagation: node-id-shaped fields in MemoryAction + MemoryTreeNode
//     use NodeId. MemoryTreeNode.id is built from DecodedStructure nodeIds, so
//     carries NodeId end-to-end from F-memory atom → UI click handler.

import type { DecodeCategory } from './codec-decode-types'
import type { MLayer } from '@/features/F-memory/config/memory-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Memory Tree Node ────────────────────────────────────────────────────────
// What the tree UI renders per item.
// Derived from DecodedStructure (#18) — the UI's data model.
// Note: id is a UI display key (may be composite for sequences/tensions/claims)
// — NOT necessarily a graph NodeId. MemoryAction below is where true NodeId
// references live: those flow into graph.nodes.get(...) at codec-memory-actions.

export type MemoryTreeNode = {
  id:         string
  label:      string
  category:   DecodeCategory       // entity, relation, claim, sequence, tension
  layer:      MLayer | null        // M0–M4 for entities/claims, null for relations
  energy:     number               // display weight
  confidence: number | null        // claims only
  children:   MemoryTreeNode[]     // nested relations, supporting claims
  expandable: boolean
}

// ─── Memory Action ───────────────────────────────────────────────────────────
// User actions on the memory tree — each maps to a cognitive primitive.
// CA5: observable transition — user click = known primitive, no LLM needed.
// nodeId fields are true graph NodeIds — they flow into graph.nodes.get()
// at codec-memory-actions.

export type MemoryAction =
  | { type: 'restructure'; nodeId: NodeId; newParentId: NodeId }  // drag-drop reparent
  | { type: 'suppress';    nodeId: NodeId }                       // delete/hide node
  | { type: 'relate';      fromNodeId: NodeId; toNodeId: NodeId } // draw connection
  | { type: 'reinforce';   nodeId: NodeId }                       // explicit strengthen

// ─── Memory View State ───────────────────────────────────────────────────────
// Client-side only, not persisted.
// expandedIds and selectedId reference MemoryTreeNode.id (UI display key, not NodeId).

export type MemoryViewState = {
  expandedIds: Set<string>
  selectedId:  string | null
  filter:      DecodeCategory | null   // null = show all
}
