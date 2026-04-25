// @liv-standard v1.5.1
// [F-planner/exec/phase8-cognitive-stub.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.5
// slice:      F-planner
// layer:      R4
// wires-in:
//   W-ATOM  NodeId, CognitivePrimitive  ← core/R5 primitives
//   W-ATOM  CognitiveClassificationPort  ← F-multi-instance/R3 mi-contract
// wires-out:
//   W-FN    createCognitiveStub          → F-planner/R2 planner-workflow (per-call construction)
// deps:
//   R5  @/core/types/primitives
//   R3  @/features/F-multi-instance/contract/mi-contract
// validated:  pending
//
// Phase 5.5 — last surviving Phase 5 stub.
//
//   Phase 5 introduced three stub ports (graph, plan, cognitive). Phase 5.5
//   replaces graph + plan with real F-memory R3 surfaces. Cognitive stays
//   stubbed until Phase 8 lands the F-codec R3 adapter that maps encodeLLM's
//   {primitive, label, boundToNodeId} shape to the {classificationNodeId,
//   primitive, confidence} shape this port requires.
//
//   This file is isolated by design (A7 deletability) — when Phase 8 lands,
//   the entire file is removed and planner-workflow.ts swaps the import to
//   F-codec R3.

import type { NodeId, CognitivePrimitive } from '@/core/types/primitives'
import type { CognitiveClassificationPort } from '@/features/F-multi-instance/contract/mi-contract'
import { generateId } from '@/core/types/primitives'

/**
 * Build a cognitive classifier stub.
 *
 * Deterministic: every classification returns primitive='anchor' with
 * confidence=1.0 and a fresh classificationNodeId. Sufficient for AS S1
 * input requirements; M-I G-Ar4 (codec presence) passes; downstream
 * gates that depend on classification semantics will require real F-codec
 * wiring at Phase 8.
 */
export function createCognitiveStub(): CognitiveClassificationPort {
  return {
    classifyRunReport: async (_args) => ({
      classificationNodeId: generateId('cls') as NodeId,
      primitive:            'anchor' as CognitivePrimitive,
      confidence:           1.0,
    }),
  }
}
