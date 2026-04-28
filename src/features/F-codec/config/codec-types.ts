// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.9-6.10-module-exec-config, 4b-nodeid-propagation, cog-v1.2.1-rename, cog-v1.3-symmetry
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  NodeId    core/R5 (primitives)
// wires-out:
//   W-ATOM  CognitivePrimitive   →  F-codec/*
//   W-ATOM  MutatingPrimitive    →  F-codec/*
//   W-ATOM  ClassifyResult       →  F-codec/*
//   W-ATOM  EncodeResult         →  F-codec consumers
//   W-ATOM  CODEC_CONFIG         →  F-codec/*
//   W-ATOM  MECHANICAL_MAPPINGS  →  F-codec/R2
// deps:
//   R5  @/core/types/primitives
// validated:  pending

// Cognitive Standard v1.2.1 — primitive vocabulary and codec configuration.
// A6: declared at R0. CA2: 6 primitives from 3 axes.
// CA3: unique mutation signature each.
// 4b-nodeid-propagation: EncodeResult.boundToNodeId carries a F-memory NodeId
//     (from TraversalResult.topNodes) or null.

import type { NodeId } from '@/core/types/primitives'

// ─── Cognitive Primitives ─────────────────────────────────────────────────────
// The 6 atomic operations on the graph.
// CA2: generated from 3 binary axes — binding (BOUND/UNBOUND),
//      structural (ADD/REORGANIZE/NONE), weight (INCREASE/DECREASE/NONE).

export type CognitivePrimitive =
  | 'anchor'
  | 'relate'
  | 'restructure'
  | 'reinforce'
  | 'suppress'
  | 'reference'

// The 5 that mutate the graph. Matches EdgePrimitiveType in F-memory/R0.
// Reference is read-only — no graph mutation, no primitive_type stamp.
export type MutatingPrimitive = Exclude<CognitivePrimitive, 'reference'>

// ─── All valid primitive values (for runtime validation) ──────────────────────

export const COGNITIVE_PRIMITIVES: readonly CognitivePrimitive[] = [
  'anchor',
  'relate',
  'restructure',
  'reinforce',
  'suppress',
  'reference',
] as const

export const MUTATING_PRIMITIVES: readonly MutatingPrimitive[] = [
  'anchor',
  'relate',
  'restructure',
  'reinforce',
  'suppress',
] as const

// ─── Classify Result ──────────────────────────────────────────────────────────
// CA1: intent → state → delta. This is the cycle output from classification.

export type ClassifyResult = {
  primitive:  CognitivePrimitive
  confidence: number              // 0–1, from LLM self-assessment
  reasoning:  string              // one-line explanation for debugging
}

// ─── Encode Result ────────────────────────────────────────────────────────────
// What the codec produces for each input. Consumed by F-chat post-integration.

export type EncodeResult = {
  primitive:     CognitivePrimitive
  label:         string | null     // normalized label. null for Reference (read-only).
  boundToNodeId: NodeId | null     // existing node if bind hit. null if new.
  userId:        string
  source:        'llm' | 'mechanical'
}

// ─── Codec Configuration ──────────────────────────────────────────────────────

export const CODEC_CONFIG = {
  // LLM model for classify + label extraction
  CLASSIFY_MODEL:       'claude-sonnet-4-20250514',
  CLASSIFY_MAX_TOKENS:  200,
  CLASSIFY_TEMPERATURE: 0,         // deterministic classification

  // Label extraction
  LABEL_MAX_LENGTH:     100,

  // Module execution — structured response (findings, plans, audits)
  MODULE_EXEC_MAX_TOKENS:  1024,
  MODULE_EXEC_TEMPERATURE: 0,

  // Cognitive v1.2.1 + v1.3 fallback discipline (CA3 / CA7).
  // classifyRunReport returns this on classify-LLM failure (Shot 3, V-S3.2).
  // decodeWorkOutput uses 0.0 as the default-confidence marker symmetric
  // to encode-side fallback (paired with non-null fallbackBasis per CA7).
  FALLBACK_CONFIDENCE: 0.0,
} as const

// ─── Mechanical Encode Mappings ───────────────────────────────────────────────
// Event type → primitive. CA4: observable transition from structured data.
// These 5 planner events have known, fixed primitive mappings — no LLM needed.

export const MECHANICAL_MAPPINGS: Record<string, MutatingPrimitive> = {
  'pipeline.started':   'anchor',
  'pipeline.completed': 'reinforce',
  'pipeline.failed':    'suppress',
  'stage.completed':    'reinforce',
  'stage.failed':       'suppress',
} as const
