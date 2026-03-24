// @liv-standard v1.3
// [F-memory/R3]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-INJECT  runTraversal     F-memory/R2 (memory-service)
//   W-INJECT  getPresentState  F-memory/R2 (memory-service)
//   W-INJECT  onBoot           F-memory/R2 (memory-service)
// wires-out:
//   W-ATOM  traverse          →  F-chat/R4 (lm-io)
//   W-ATOM  getPresentState   →  F-chat/R4 (lm-io)
//   W-ATOM  onBoot            →  F-event-system/R2 (startup)
// deps:
//   R0  ../config/memory-types
//   R2  ../app/memory-service
// validated:  pending

// Living Memory v1.0 — public contract.
// R3: thin wire. No logic. No DB. No physics.
// §20: two surfaces for F-chat integration:
//   traverse(text, options?) — real-time traversal for specific query context
//   getPresentState()        — inject into system prompt before LLM call
// All other slices import from here — never from app/, domain/, exec/.

import type {
  TraversalResult,
  TraversalOptions,
  PresentState,
} from '../config/memory-types'
import type { Result } from '@/core/types/primitives'

import {
  runTraversal,
  getPresentState as _getPresentState,
  onBoot as _onBoot,
} from '../app/memory-service'

// ─── traverse ─────────────────────────────────────────────────────────────────
// §20: real-time traversal for specific query context.
// Also recomputes Present State as side effect.
//
// Usage per §20 flow:
//   1. getPresentState()              → inject as system context
//   2. traverse(userMessage, { returnActivation: true })  → query-specific context
//   3. Both injected into LLM context
//   4. LLM responds
//   5. traverse(llmResponse)          → write path, no activation returned

export async function traverse(
  text: string,
  options?: TraversalOptions,
): Promise<Result<TraversalResult | null>> {
  return runTraversal(text, options)
}

// ─── getPresentState ──────────────────────────────────────────────────────────
// §20: inject into system prompt before LLM call.
// G2: reads precomputed values only — never triggers recomputation.

export function getPresentState(): PresentState {
  return _getPresentState()
}

// ─── onBoot ───────────────────────────────────────────────────────────────────
// Called by F-event-system/app/startup.ts on server start.

export async function onBoot(): Promise<void> {
  return _onBoot()
}
