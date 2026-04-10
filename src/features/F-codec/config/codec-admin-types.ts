// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  DecodeOutput  F-codec/R0
// wires-out:
//   W-ATOM  GlobalSeedInput     →  F-codec/*
//   W-ATOM  IngestionSource     →  F-codec/*
//   W-ATOM  GlobalAdminAction   →  F-codec/*
//   W-ATOM  GlobalGraphSummary  →  F-codec/*
// deps:
//   R0  ./codec-decode-types
// validated:  pending

// Global graph admin types — declared at R0 (A6).
// Admin-only operations on the global knowledge graph.

import type { DecodeOutput } from './codec-decode-types'

// ─── Seed Input ───────────────────────────────────────────────────────────────
// Manually authored knowledge node for the global graph.
// A6: declared at R0, consumed by R2 admin actions.

export type GlobalSeedInput = {
  label:      string       // normalized canonical label
  content:    string       // semantic content / description
  relatedTo?: string       // optional: existing node ID to create edge to
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
  | { type: 'remove';  nodeId: string }

// ─── Global Graph Summary ─────────────────────────────────────────────────────
// What the admin view shows — decode output + aggregate counts.

export type GlobalGraphSummary = {
  decoded:   DecodeOutput
  nodeCount: number
  edgeCount: number
  armCount:  number
}
