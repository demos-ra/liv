// @liv-standard v1.5.1
// [F-codec/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-b-item2, phase-5.1-r1, 6.5-6.6-routing, 6.9-6.10-module-exec
// slice:      F-codec
// layer:      R0
// wires-in:
//   W-ATOM  CognitivePrimitive   F-codec/R0
//   W-ATOM  MutatingPrimitive    F-codec/R0
//   W-ATOM  EncodeResult         F-codec/R0
//   W-ATOM  DecodedContext       F-codec/R0
//   W-ATOM  FrameworkMode        F-codec/R0
//   W-ATOM  FrameworkModule      F-codec/R0
//   W-ATOM  ModuleExecutionResult F-codec/R0
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
//   R0  ./codec-module-types
// validated:  pending

// Routing types — domain classification, route actions, pipeline result.
// A6: declared at R0. Zero I/O.
// CA1: primitive cycle output (intent → state → delta) feeds into route determination.
// CA8: domain derived from graph topology, not authored table.

import type { CognitivePrimitive, MutatingPrimitive, EncodeResult } from './codec-types'
import type { DecodedContext } from './codec-decode-types'
import type { FrameworkMode, FrameworkModule, ModuleExecutionResult } from './codec-module-types'

// ─── Binding Domain ──────────────────────────────────────────────────────────
// Topological classification of where bind() landed in the graph.
// 6.5: widened from literal 'build' to FrameworkMode union.
// 'generative' replaces 'build'. New modes enter as modules register.
// CA8: domain derived from graph topology, not authored table.

export type BindingDomain =
  | FrameworkMode        // 'epistemic' | 'structural' | 'generative' | 'verificative'
  | 'conversational'    // no module registered, general chat
  | 'unknown'           // unclassifiable

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
// phase-5.1-r1: dispatch-planner carries BuildConfirmation from W-HOOK query.
// 6.6: dispatch-module added for non-build framework modules.
//   dispatch-planner retained as generative specialization (bespoke planner integration).

export type RouteAction =
  | { type: 'dispatch-module';  module: FrameworkModule; primitive: CognitivePrimitive; label: string; userId: string; moduleResult?: ModuleExecutionResult }
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
// 6.5: BUILD_DOMAIN_SIGNALS superseded by MODE_SIGNALS in codec-mode-classify.ts.
// Retained for backward compatibility — no longer referenced by the classifier.
// Cleanup candidate for a future pass.

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
