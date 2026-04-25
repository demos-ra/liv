// @liv-standard v1.5.1
// [F-memory/contract/memory-graph-contract.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.5
// slice:      F-memory
// layer:      R3
// wires-in:
//   W-ATOM   NodeId, CognitivePrimitive  ← core/R5 primitives
//   W-ATOM   ArtifactEmission, ArtifactEdge   ← core/R5 artifact-standard.types
//   W-ATOM   PlanArtifactContent          ← core/R5 plan-standard.types
//   W-ATOM   ArtifactGraphPort            ← F-artifact/R3 artifact-contract
//   W-ATOM   PlanResolutionPort           ← F-multi-instance/R3 mi-contract
//   W-FN     artifact substore primitives ← F-memory/R2 memory-artifact-store
// wires-out:
//   W-FN     createArtifactGraphPort      → F-planner/R3 planner-inject (Phase 5.5)
//   W-FN     createPlanResolutionPort     → F-planner/R3 planner-inject (Phase 5.5)
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/artifact-standard.types
//   R5  @/core/types/plan-standard.types
//   R3  @/features/F-artifact/contract/artifact-contract  (type only)
//   R3  @/features/F-multi-instance/contract/mi-contract  (type only)
//   R2  ../app/memory-artifact-store
// validated:  pending
//
// Phase 5.5 — F-memory R3 surface for AS v2.2 emissions.
//
//   Two factories exposed:
//     createArtifactGraphPort()    — returns ArtifactGraphPort (8 methods)
//     createPlanResolutionPort()   — returns PlanResolutionPort (1 method)
//
//   Both are thin wrappers over the F-memory R2 artifact substore (process
//   singleton). Stable across runPipeline invocations within a process —
//   closes Phase 5's PA5 cross-turn re-entry mechanic (the bug Phase 5
//   stubs left open: per-call Maps were re-created per pipeline invocation,
//   so prior-anchor lookup never found anything).
//
//   Phase 9 swaps the R2 substore with Postgres-backed persistence; this R3
//   contract surface stays stable.
//
// A1 — F-memory sole owner of all 8 ArtifactGraphPort methods + plan resolution.
// A5 — Cross-slice consumers (F-planner) call this R3, never reach into R2/R1.
// A6 — All 8 methods declared at F-memory R3.

import type { NodeId } from '@/core/types/primitives'
import type { ArtifactGraphPort } from '@/features/F-artifact/contract/artifact-contract'
import type { PlanResolutionPort } from '@/features/F-multi-instance/contract/mi-contract'

import {
  createAnchorNode,
  createCompanionNode,
  materializeContent,
  lookupModeNode,
  lookupPriorAnchor,
  registerEmission,
  isEmissionIdCollision,
  persistEdges,
  resolvePlan,
} from '../app/memory-artifact-store'

// ─── createArtifactGraphPort — ArtifactGraphPort (8 methods) ─────────────────

/**
 * Build an ArtifactGraphPort backed by F-memory R2 artifact substore.
 *
 * Returned object is callable across multiple AS emissions and runPipeline
 * invocations — process-warm. F-planner constructs one per pipeline call;
 * the closures all reach into the same module-singleton store (see
 * memory-artifact-store.ts), which is what makes the Phase 5 PA5 mechanic
 * close end-to-end (cross-turn).
 *
 * No internal state held in the closure — the closure is just a method-
 * binding view onto the F-memory R2 substore.
 */
export function createArtifactGraphPort(): ArtifactGraphPort {
  return {
    createAnchorNode:      createAnchorNode,
    createCompanionNode:   createCompanionNode,
    materializeContent:    materializeContent,
    lookupModeNode:        lookupModeNode,
    lookupPriorAnchor:     lookupPriorAnchor,
    registerEmission:      registerEmission,
    isEmissionIdCollision: isEmissionIdCollision,
    persistEdges:          persistEdges,
  }
}

// ─── createPlanResolutionPort — PlanResolutionPort (1 method) ───────────────

/**
 * Build a PlanResolutionPort backed by F-memory R2 artifact substore.
 * HR-MI4 one-hop: resolvePlan reads the companion node attached to the
 * anchor and returns its payload.content as PlanArtifactContent. No graph
 * traversal beyond that single hop.
 */
export function createPlanResolutionPort(): PlanResolutionPort {
  return {
    resolvePlan: (planAnchorNodeId: NodeId) => resolvePlan(planAnchorNodeId),
  }
}
