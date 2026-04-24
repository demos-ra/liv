// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-nodeid-propagation
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  NodeId        core/R5 (primitives)
//   W-ATOM  DecodeOutput  F-codec/R0
// wires-out:
//   W-ATOM  GlobalSeedInput     →  F-codec/*
//   W-ATOM  IngestionSource     →  F-codec/*
//   W-ATOM  GlobalAdminAction   →  F-codec/*
//   W-ATOM  GlobalGraphSummary  →  F-codec/*
// deps:
//   R0  ./codec-decode-types
//   R5  @/core/types/primitives
// validated:  pending

// Global graph admin types — declared at R0 (A6).
// Admin-only operations on the global knowledge graph.
// 4b-nodeid-propagation: node-id-shaped fields (GlobalSeedInput.relatedTo,
//     GlobalAdminAction.remove.nodeId) typed NodeId. HTTP route DELETE body is
//     the external-origin ingress site — brand at route handler, not here.

import type { DecodeOutput } from './codec-decode-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Seed Input ───────────────────────────────────────────────────────────────
// Manually authored knowledge node for the global graph.
// A6: declared at R0, consumed by R2 admin actions.

export type GlobalSeedInput = {
  label:      string       // normalized canonical label
  content:    string       // semantic content / description
  relatedTo?: NodeId       // optional: existing node ID to create edge to
}

// ─── Ingestion Source ─────────────────────────────────────────────────────────
// Curated external content encoded into the global graph.

export type IngestionSource = {
  type:    'url' | 'text'
  content: string           // URL to fetch or raw text
  label:   string           // what this source represents
}

// ─── Admin Action ─────────────────────────────────────────────────────────────
// Discriminated union of admin operations on the global graph.

export type GlobalAdminAction =
  | { type: 'seed';    input: GlobalSeedInput }
  | { type: 'ingest';  source: IngestionSource }
  | { type: 'remove';  nodeId: NodeId }

// ─── Global Graph Summary ─────────────────────────────────────────────────────
// What the admin view shows — decode output + aggregate counts.

export type GlobalGraphSummary = {
  decoded:   DecodeOutput
  nodeCount: number
  edgeCount: number
  armCount:  number
}
