// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  DecodeCategory   F-codec/R0
//   W-ATOM  MLayer           F-memory/R0
// wires-out:
//   W-ATOM  MemoryTreeNode   →  F-codec/*
//   W-ATOM  MemoryAction     →  F-codec/*
//   W-ATOM  MemoryViewState  →  F-codec/*
// deps:
//   R0  ./codec-decode-types
//   R0  ../../F-memory/config/memory-types
// validated:  pending

// Memory program types.
// A6: declared at R0 — consumed by R2 actions + R3 UI component.
// CA8: tree structure derived from decode output, not authored.

import type { DecodeCategory } from './codec-decode-types'
import type { MLayer } from '../../F-memory/config/memory-types'

// ─── Memory Tree Node ────────────────────────────────────────────────────────
// What the tree UI renders per item.
// Derived from DecodedStructure (#18) — the UI's data model.

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

export type MemoryAction =
  | { type: 'restructure'; nodeId: string; newParentId: string }  // drag-drop reparent
  | { type: 'suppress';    nodeId: string }                       // delete/hide node
  | { type: 'relate';      fromNodeId: string; toNodeId: string } // draw connection
  | { type: 'reinforce';   nodeId: string }                       // explicit strengthen

// ─── Memory View State ───────────────────────────────────────────────────────
// Client-side only, not persisted.

export type MemoryViewState = {
  expandedIds: Set<string>
  selectedId:  string | null
  filter:      DecodeCategory | null   // null = show all
}
