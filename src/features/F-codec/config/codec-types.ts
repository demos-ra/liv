// @liv-standard v1.3
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  CognitivePrimitive   →  F-codec/*
//   W-ATOM  MutatingPrimitive    →  F-codec/*
//   W-ATOM  ClassifyResult       →  F-codec/*
//   W-ATOM  EncodeResult         →  F-codec consumers
//   W-ATOM  CODEC_CONFIG         →  F-codec/*
//   W-ATOM  MECHANICAL_MAPPINGS  →  F-codec/R2
// deps:       none
// validated:  pending

// Cognitive Standard v1.2 — primitive vocabulary and codec configuration.
// A6: declared at R0. Zero dependencies.
// CA3: 6 primitives from 3 axes (binding × structural × weight).
// CA4: unique mutation signature each.

// ─── Cognitive Primitives ─────────────────────────────────────────────────────
// The 6 atomic operations on the graph.
// CA3: generated from 3 binary axes — binding (BOUND/UNBOUND),
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
  boundToNodeId: string | null     // existing node if bind hit. null if new.
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
} as const

// ─── Mechanical Encode Mappings ───────────────────────────────────────────────
// Event type → primitive. CA5: observable transition from structured data.
// These 5 planner events have known, fixed primitive mappings — no LLM needed.

export const MECHANICAL_MAPPINGS: Record<string, MutatingPrimitive> = {
  'pipeline.started':   'anchor',
  'pipeline.completed': 'reinforce',
  'pipeline.failed':    'suppress',
  'stage.completed':    'reinforce',
  'stage.failed':       'suppress',
} as const
