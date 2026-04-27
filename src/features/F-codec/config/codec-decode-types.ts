// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.8-artifact-decode, 4b-nodeid-propagation, lm-v2-2-shot5-fix-2
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  NodeId              core/R5 (primitives)
//   W-ATOM  MLayer              F-memory/R3
//   W-ATOM  EdgePrimitiveType   F-memory/R3
//   W-ATOM  FrameworkMode       F-codec/R0
// wires-out:
//   W-ATOM  DecodeCategory      →  F-codec/*
//   W-ATOM  RelationType        →  F-codec/*
//   W-ATOM  DecodedStructure    →  F-codec/*
//   W-ATOM  DecodeOutput        →  F-codec/*
//   W-ATOM  DecodedContext      →  F-codec/*
//   W-ATOM  DECODE_MAX_TOKENS   →  F-codec/*
// deps:
//   R3  ../../F-memory/contract/memory-contract
//   R0  ./codec-module-types
//   R5  @/core/types/primitives
// validated:  pending

// Decode classification types.
// A6: declared at R0 — consumed by R1 decode + render.
// CA5: observable transition — classifications are deterministic structural reads.
// 4b-nodeid-propagation: node-id-shaped fields typed NodeId. F-codec reads
//     MemNode.id from F-memory atoms and republishes through DecodedStructure.

import type { MLayer, EdgePrimitiveType } from '@/features/F-memory/contract/memory-contract'
import type { FrameworkMode } from './codec-module-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Classification Category ─────────────────────────────────────────────────
// The 6 structural forms a graph produces when read.
// 6.8: artifact added for framework module outputs.
// CA8: derived from graph topology, not LLM inference.

export type DecodeCategory = 'entity' | 'relation' | 'claim' | 'sequence' | 'tension' | 'artifact'

// ─── Relation Type ───────────────────────────────────────────────────────────
// Derived from edge primitive_type. Maps the 5 write primitives + null to
// 6 semantic relation categories.

export type RelationType = 'depends-on' | 'derived-from' | 'contradicts' | 'supports' | 'associated'

// ─── Decoded Structure ───────────────────────────────────────────────────────
// A single classified structure from the graph.
// Discriminated union on category — each form carries only what it needs.

export type DecodedStructure =
  | { category: 'entity';   nodeId: NodeId; name: string; layer: MLayer; energy: number }
  | { category: 'relation'; fromNodeId: NodeId; toNodeId: NodeId; relationType: RelationType; weight: number; primitiveType: EdgePrimitiveType | null }
  | { category: 'claim';    nodeId: NodeId; name: string; confidence: number; supportCount: number; energy: number }
  | { category: 'sequence'; nodeIds: NodeId[]; labels: string[]; direction: 'forward'; armId: string | null }
  | { category: 'tension';  nodeIdA: NodeId; nodeIdB: NodeId; nameA: string; nameB: string; bridgeWeight: number }
  | { category: 'artifact'; nodeId: NodeId; moduleId: string; version: number; title: string; mode: FrameworkMode; fields: Record<string, string>; energy: number }

// ─── Decode Output ───────────────────────────────────────────────────────────
// The full decode result — all classified structures from a graph, bucketed.

export type DecodeOutput = {
  entities:   Extract<DecodedStructure, { category: 'entity' }>[]
  relations:  Extract<DecodedStructure, { category: 'relation' }>[]
  claims:     Extract<DecodedStructure, { category: 'claim' }>[]
  sequences:  Extract<DecodedStructure, { category: 'sequence' }>[]
  tensions:   Extract<DecodedStructure, { category: 'tension' }>[]
  artifacts:  Extract<DecodedStructure, { category: 'artifact' }>[]
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
