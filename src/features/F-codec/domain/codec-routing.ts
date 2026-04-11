// @liv-standard v1.3
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  EncodeResult        F-codec/R0
//   W-ATOM  BindingDomain       F-codec/R0
//   W-ATOM  RouteAction         F-codec/R0
//   W-ATOM  ROUTING_CONFIG      F-codec/R0
//   W-ATOM  PresentState        F-memory/R0
//   W-ATOM  MemArm              F-memory/R0
// wires-out:
//   W-FN  classifyDomain()   →  F-codec/R2
//   W-FN  determineRoute()   →  F-codec/R2
// deps:
//   R0  ../config/codec-routing-types
//   R0  ../config/codec-types
//   R0  ../../F-memory/config/memory-types
// validated:  pending

// Routing classifier — two pure functions. No I/O, no side effects.
// R1: same input = same output, deterministic.
// CA8: domain derived from graph topology (arm membership + node labels).
// CA5: observable transition — routing is a structural read of encode result + graph.

import type { EncodeResult } from '../config/codec-types'
import type { BindingDomain, RouteAction } from '../config/codec-routing-types'
import { ROUTING_CONFIG } from '../config/codec-routing-types'
import type { PresentState, MemArm } from '@/features/F-memory/config/memory-types'

// ─── Classify Domain ─────────────────────────────────────────────────────────
// Determines which domain subgraph the encoded message belongs to.
// CA8: graph topology is the primary input. Keyword signals are bootstrap heuristic.
//
// Algorithm:
// 1. If boundToNodeId is non-null, check which arm contains it.
//    If the arm's label or constituent node labels contain BUILD_DOMAIN_SIGNALS → 'build'.
// 2. If no arm match but the encoded label itself contains build signals → 'build'.
// 3. If bound to existing node in a non-build arm → 'conversational'.
// 4. If unbound (new node, no arm) → 'unknown'.
//
// As the graph densifies, arm membership alone determines domain.
// The keyword signals are training wheels.

export function classifyDomain(
  encodeResult: EncodeResult,
  _presentState: PresentState,
  arms: MemArm[],
): BindingDomain {
  // A3: typed boundary — takes atoms, returns atom.

  const { boundToNodeId, label } = encodeResult
  const signals = ROUTING_CONFIG.BUILD_DOMAIN_SIGNALS

  // 1. Bound to existing node — check arm membership
  if (boundToNodeId !== null) {
    for (const arm of arms) {
      if (!arm.nodeIds.includes(boundToNodeId)) continue

      // Check arm label for build signals
      if (arm.label !== null && containsSignal(arm.label, signals)) {
        return 'build'
      }

      // Arm matched but no build signal — conversational
      return 'conversational'
    }

    // Bound to node but no arm contains it — check label fallback
    if (label !== null && containsSignal(label, signals)) {
      return 'build'
    }

    // Bound, no arm, no build signal — conversational
    return 'conversational'
  }

  // 2. Unbound (new node) — check label for build signals
  if (label !== null && containsSignal(label, signals)) {
    return 'build'
  }

  // 3. Unbound, no build signals — unknown (defaults to conversational behavior)
  return 'unknown'
}

// ─── Determine Route ─────────────────────────────────────────────────────────
// Maps (primitive, domain) → action. Pure lookup.
// CA5: deterministic — same inputs always produce the same route.
//
// | Primitive    | Domain = build           | Domain = conversational/unknown |
// |------------- |--------------------------|-------------------------------- |
// | Anchor       | dispatch-planner         | chat-response                   |
// | Relate       | dispatch-planner         | chat-response                   |
// | Restructure  | dispatch-planner         | chat-response                   |
// | Reinforce    | dispatch-planner         | chat-response                   |
// | Suppress     | dispatch-planner         | chat-response                   |
// | Reference    | reference-only           | reference-only                  |
//
// Reference is always reference-only regardless of domain — read-only by definition.

export function determineRoute(
  encodeResult: EncodeResult,
  domain: BindingDomain,
): RouteAction {
  // A3: typed boundary — takes atoms, returns atom.

  const { primitive, label, userId } = encodeResult

  // Reference — always read-only, no domain routing
  if (primitive === 'reference') {
    return { type: 'reference-only', userId }
  }

  // Build domain — dispatch to planner via event bus
  if (domain === 'build') {
    return {
      type: 'dispatch-planner',
      primitive,
      label: label ?? '',
      userId,
    }
  }

  // Conversational or unknown — chat handles response
  return { type: 'chat-response', primitive, userId }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function containsSignal(text: string, signals: readonly string[]): boolean {
  const lower = text.toLowerCase()
  for (const signal of signals) {
    if (lower.includes(signal)) return true
  }
  return false
}
