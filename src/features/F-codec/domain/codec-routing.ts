// @liv-standard v1.5
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.5-6.6-routing
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  EncodeResult        F-codec/R0
//   W-ATOM  BindingDomain       F-codec/R0
//   W-ATOM  RouteAction         F-codec/R0
//   W-ATOM  FrameworkMode       F-codec/R0
//   W-ATOM  FrameworkModule     F-codec/R0
//   W-ATOM  PresentState        F-memory/R0
//   W-ATOM  MemArm              F-memory/R0
// wires-out:
//   W-INJECT  classifyDomain()   → F-codec/R2 (codec-orchestrate)
//   W-INJECT  determineRoute()   → F-codec/R2 (codec-orchestrate)
// deps:
//   R0  ../config/codec-routing-types
//   R0  ../config/codec-types
//   R0  ../config/codec-module-types
//   R0  ../../F-memory/config/memory-types
//   R1  ./codec-mode-classify
// validated:  pending

// Routing classifier — two pure functions. No I/O, no side effects.
// R1: same input = same output, deterministic.
// 6.5: classifyDomain delegates to classifyMode (mode-aware classification).
// 6.6: determineRoute uses registry lookup. 'generative' → dispatch-planner (existing path).
//      Other registered modes → dispatch-module. Unregistered → chat-response fallback.

import type { EncodeResult } from '../config/codec-types'
import type { BindingDomain, RouteAction } from '../config/codec-routing-types'
import type { FrameworkMode, FrameworkModule } from '../config/codec-module-types'
import type { PresentState, MemArm } from '@/features/F-memory/config/memory-types'
import { classifyMode } from './codec-mode-classify'

// ─── Classify Domain ─────────────────────────────────────────────────────────
// Determines which domain the encoded message belongs to.
// 6.5: delegates to classifyMode for mode-aware classification.
// If classifyMode returns a mode → that mode IS the domain (FrameworkMode ⊂ BindingDomain).
// If null → conversational (bound) or unknown (unbound). Same fallback as pre-6.5.

export function classifyDomain(
  encodeResult: EncodeResult,
  presentState: PresentState,
  arms: MemArm[],
  registryCheck: { hasModule: (mode: FrameworkMode) => boolean },
  originalContent?: string,
): BindingDomain {
  const mode = classifyMode(encodeResult, presentState, arms, registryCheck, originalContent)

  if (mode !== null) return mode

  // Fallback: no mode detected. Bound → conversational, unbound → unknown.
  return encodeResult.boundToNodeId !== null ? 'conversational' : 'unknown'
}

// ─── Determine Route ─────────────────────────────────────────────────────────
// Maps (primitive, domain) → action. Pure lookup.
// 6.6: registry-driven. Generative → dispatch-planner (bespoke build path).
//      Other registered modes → dispatch-module (generic, wired by 6.9+6.10).
//      Conversational/unknown → chat-response.
//
// | Primitive    | Domain = generative      | Domain = other mode            | Domain = conv/unknown    |
// |------------- |--------------------------|--------------------------------|--------------------------|
// | Anchor       | dispatch-planner         | dispatch-module                | chat-response            |
// | Relate       | dispatch-planner         | dispatch-module                | chat-response            |
// | Restructure  | dispatch-planner         | dispatch-module                | chat-response            |
// | Reinforce    | dispatch-planner         | dispatch-module                | chat-response            |
// | Suppress     | dispatch-planner         | dispatch-module                | chat-response            |
// | Reference    | reference-only           | reference-only                 | reference-only           |

export function determineRoute(
  encodeResult: EncodeResult,
  domain: BindingDomain,
  registryLookup: { getModule: (mode: FrameworkMode) => FrameworkModule | null },
): RouteAction {
  const { primitive, label, userId } = encodeResult

  // Reference — always read-only, domain-independent
  if (primitive === 'reference') {
    return { type: 'reference-only', userId }
  }

  // Generative mode — dispatch-planner (existing build path, bespoke handling)
  if (domain === 'generative') {
    return {
      type: 'dispatch-planner',
      primitive,
      label: label ?? '',
      userId,
    }
  }

  // Other framework modes — generic module dispatch
  if (domain !== 'conversational' && domain !== 'unknown') {
    const module = registryLookup.getModule(domain as FrameworkMode)
    if (module) {
      return {
        type: 'dispatch-module',
        module,
        primitive,
        label: label ?? '',
        userId,
      }
    }
  }

  // Conversational or unknown — chat fallback
  return { type: 'chat-response', primitive, userId }
}
