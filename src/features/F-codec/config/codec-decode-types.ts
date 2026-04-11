// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  MLayer              F-memory/R0
//   W-ATOM  EdgePrimitiveType   F-memory/R0
// wires-out:
//   W-ATOM  DecodeCategory      →  F-codec/*
//   W-ATOM  RelationType        →  F-codec/*
//   W-ATOM  DecodedStructure    →  F-codec/*
//   W-ATOM  DecodeOutput        →  F-codec/*
//   W-ATOM  DecodedContext      →  F-codec/*
//   W-ATOM  DECODE_MAX_TOKENS   →  F-codec/*
// deps:
//   R0  ../../F-memory/config/memory-types
// validated:  pending

// Decode classification types.
// A6: declared at R0 — consumed by R1 decode + render.
// CA5: observable transition — classifications are deterministic structural reads.

import type { MLayer, EdgePrimitiveType } from '@/features/F-memory/config/memory-types'

// ─── Classification Category ─────────────────────────────────────────────────
// The 5 structural forms a graph produces when read.
// CA8: derived from graph topology, not LLM inference.

export type DecodeCategory = 'entity' | 'relation' | 'claim' | 'sequence' | 'tension'

// ─── Relation Type ───────────────────────────────────────────────────────────
// Derived from edge primitive_type. Maps the 5 write primitives + null to
// 6 semantic relation categories.

export type RelationType = 'depends-on' | 'derived-from' | 'contradicts' | 'supports' | 'associated'

// ─── Decoded Structure ───────────────────────────────────────────────────────
// A single classified structure from the graph.
// Discriminated union on category — each form carries only what it needs.

export type DecodedStructure =
  | { category: 'entity';   nodeId: string; name: string; layer: MLayer; energy: number }
  | { category: 'relation'; fromNodeId: string; toNodeId: string; relationType: RelationType; weight: number; primitiveType: EdgePrimitiveType | null }
  | { category: 'claim';    nodeId: string; name: string; confidence: number; supportCount: number; energy: number }
  | { category: 'sequence'; nodeIds: string[]; labels: string[]; direction: 'forward'; armId: string | null }
  | { category: 'tension';  nodeIdA: string; nodeIdB: string; nameA: string; nameB: string; bridgeWeight: number }

// ─── Decode Output ───────────────────────────────────────────────────────────
// The full decode result — all classified structures from a graph, bucketed.

export type DecodeOutput = {
  entities:   Extract<DecodedStructure, { category: 'entity' }>[]
  relations:  Extract<DecodedStructure, { category: 'relation' }>[]
  claims:     Extract<DecodedStructure, { category: 'claim' }>[]
  sequences:  Extract<DecodedStructure, { category: 'sequence' }>[]
  tensions:   Extract<DecodedStructure, { category: 'tension' }>[]
}

// ─── Decoded Context ─────────────────────────────────────────────────────────
// Rendered decode output — text form for injection into LLM context.

export type DecodedContext = {
  systemPromptBlock: string   // structured text for system prompt assembly
  structureCount:    number   // total classified structures
}

// ─── Config ──────────────────────────────────────────────────────────────────
// Token budget for system prompt rendering. Highest-energy structures first,
// truncate lowest to fit.

export const DECODE_MAX_TOKENS = 2000
