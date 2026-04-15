// @liv-standard v1.5
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5
// amended:    phase-b-item2, phase-5.1-r1
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  CognitivePrimitive   F-codec/R0
//   W-ATOM  MutatingPrimitive    F-codec/R0
//   W-ATOM  EncodeResult         F-codec/R0
//   W-ATOM  DecodedContext       F-codec/R0
// wires-out:
//   W-ATOM  BindingDomain           →  F-codec/*
//   W-ATOM  RouteAction             →  F-codec/*
//   W-ATOM  BuildConfirmation       →  F-chat/R3
//   W-ATOM  CodecPipelineResult     →  F-codec consumers
//   W-ATOM  ROUTING_CONFIG          →  F-codec/*
//   W-ATOM  CODEC_ROUTING_EVENTS    →  F-codec/*
// deps:
//   R0  ./codec-types
//   R0  ./codec-decode-types
// validated:  pending

// Routing types — domain classification, route actions, pipeline result.
// A6: declared at R0. Zero I/O.
// CA1: primitive cycle output (intent → state → delta) feeds into route determination.
// CA8: domain derived from graph topology, not authored table.

import type { CognitivePrimitive, MutatingPrimitive, EncodeResult } from './codec-types'
import type { DecodedContext } from './codec-decode-types'

// ─── Binding Domain ──────────────────────────────────────────────────────────
// Topological classification of where bind() landed in the graph.
// Not enumerated exhaustively — derived from graph structure.
// New domains emerge naturally as new subgraphs form.

export type BindingDomain =
  | 'build'           // build-related subgraph (project/pipeline nodes)
  | 'conversational'  // general knowledge/chat subgraph
  | 'unknown'         // new or unclassifiable region

// ─── Build Confirmation ────────────────────────────────────────────────────
// phase-5.1-r1: Planner's confirmation response, carried on dispatch-planner route.
// A3: typed boundary atom. A6: declared at R0 of owning slice.

export type BuildConfirmation = {
  response:       string    // IN-MAIN's plan text for Liv to contextualize
  isConfirmation: boolean   // true = plan ready, awaiting user confirm. false = pipeline already launched.
  jobId:          string    // planner job ID for dashboard binding
}

// ─── Route Action ────────────────────────────────────────────────────────────
// What the system does in response to the encoded primitive + domain.
// Discriminated union on type — each action carries only what it needs.
// phase-5.1-r1: dispatch-planner now carries BuildConfirmation from W-HOOK query.

export type RouteAction =
  | { type: 'dispatch-planner'; primitive: MutatingPrimitive; label: string; userId: string; confirmation?: BuildConfirmation }
  | { type: 'chat-response';    primitive: CognitivePrimitive; userId: string }
  | { type: 'reference-only';   userId: string }

// ─── Pipeline Result ─────────────────────────────────────────────────────────
// The full result of the codec pipeline for one message.
// Consumed by F-chat post-integration.

export type CodecPipelineResult = {
  encode:         EncodeResult      // from #16
  route:          RouteAction       // from routing
  decodedContext: DecodedContext     // from #18 — system prompt block
  domain:         BindingDomain     // where bind landed
}

// ─── Routing Config ──────────────────────────────────────────────────────────
// Bootstrap heuristics for domain detection.
// Once the graph is dense enough, domain detection becomes purely topological
// (arm membership alone). These keyword signals are training wheels.

export const ROUTING_CONFIG = {
  // Domain detection: keywords/node-labels that indicate build subgraph.
  BUILD_DOMAIN_SIGNALS: ['pipeline', 'build', 'bundle', 'deploy', 'compile'] as readonly string[],

  // Threshold: Reinforce energy above which pipeline advances.
  // Graph-relative — recomputed per traversal via σ multiplier.
  ADVANCE_SIGMA_MULTIPLIER:  1.5,

  // Threshold: Suppress energy above which pipeline rolls back.
  ROLLBACK_SIGMA_MULTIPLIER: 1.5,
} as const

// ─── Routing Events ──────────────────────────────────────────────────────────
// A6: event names declared at R0 of emitting slice.
// A5: consumed via event bus only — no slice imports these directly.

export const CODEC_ROUTING_EVENTS = {
  ROUTE_BUILD:    'codec.route-build',
  ROUTE_COMPLETE: 'codec.route-complete',
} as const

export type CodecRoutingEventType = typeof CODEC_ROUTING_EVENTS[keyof typeof CODEC_ROUTING_EVENTS]

// ─── Route-Build Payload ─────────────────────────────────────────────────────
// A5: event payload for observability.
// phase-5.1-r1: retained for observability event emission. No longer triggers
// pipeline launch — that is now handled synchronously via W-HOOK in codec.

export type RouteBuildPayload = {
  primitive:  MutatingPrimitive
  label:      string
  userId:     string
  projectId:  string      // was optional, now required for build routes
  message:    string      // pass-through: original user message
  modelId:    string      // pass-through: model preference
}
