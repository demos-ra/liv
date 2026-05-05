// @liv-standard v1.5.1
// [F-artifact/contract/artifact-graph-port.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5.5, sprint-8-shot-3b (relocated from F-memory/contract/memory-graph-contract.ts)
// slice:      F-artifact
// layer:      R3
// wires-in:
//   W-ATOM   NodeId, CognitivePrimitive  ← core/R5 primitives
//   W-ATOM   ArtifactEmission, ArtifactEdge   ← core/R5 artifact-standard.types
//   W-ATOM   PlanArtifactContent          ← core/R5 plan-standard.types
//   W-ATOM   ArtifactGraphPort            ← F-artifact/R3 artifact-contract
//   W-ATOM   PlanResolutionPort           ← F-multi-instance/R3 mi-contract
//   W-FN     artifact substore primitives ← F-artifact/R2 artifact-store
// wires-out:
//   W-FN     createArtifactGraphPort      → F-planner/R3 planner-workflow, F-plan/R3 plan-inject,
//                                            F-discover/R3 discover-contract, F-verify/R3 verify-contract
//   W-FN     createPlanResolutionPort     → F-planner/R3 planner-workflow
// deps:
//   R5  @/core/types/primitives
//   R5  @/core/types/artifact-standard.types
//   R5  @/core/types/plan-standard.types
//   R3  @/features/F-artifact/contract/artifact-contract  (type only)
//   R3  @/features/F-multi-instance/contract/mi-contract  (type only)
//   R2  ../app/artifact-store
// validated:  pending
//
// sprint-8-shot-3b — relocation note:
//   Originally F-memory/contract/memory-graph-contract.ts. Moved to F-artifact
//   when F-memory dissolved its LM v2.x engine and became substrate-only.
//   File contents preserved; import path rewritten from '../app/memory-artifact-store'
//   to '../app/artifact-store'. Public functions retain their names so consumer
//   imports rewire by repointing the module path only.
//
// Phase 5.5 — F-artifact R3 surface for AS v2.2 emissions.
//
//   Two factories exposed:
//     createArtifactGraphPort()    — returns ArtifactGraphPort (8 methods)
//     createPlanResolutionPort()   — returns PlanResolutionPort (1 method)
//
//   Both are thin wrappers over the F-artifact R2 artifact substore (process
//   singleton). Stable across runPipeline invocations within a process —
//   closes Phase 5's PA5 cross-turn re-entry mechanic.
//
// A1 — F-artifact sole owner of all 8 ArtifactGraphPort methods + plan resolution.
// A5 — Cross-slice consumers (F-planner, F-plan, F-discover, F-verify) call this R3,
//      never reach into R2/R1.
// A6 — All methods declared at F-artifact R3.

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
} from '../app/artifact-store'

// ─── createArtifactGraphPort — ArtifactGraphPort (8 methods) ─────────────────

/**
 * Build an ArtifactGraphPort backed by F-artifact R2 artifact substore.
 *
 * Returned object is callable across multiple AS emissions and runPipeline
 * invocations — process-warm. Consumers (F-planner, F-plan, F-discover,
 * F-verify) construct one per pipeline call; the closures all reach into
 * the same module-singleton store.
 *
 * No internal state held in the closure — the closure is just a method-
 * binding view onto the F-artifact R2 substore.
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
 * Build a PlanResolutionPort backed by F-artifact R2 artifact substore.
 * HR-MI4 one-hop: resolvePlan reads the companion node attached to the
 * anchor and returns its payload.content as PlanArtifactContent. No graph
 * traversal beyond that single hop.
 */
export function createPlanResolutionPort(): PlanResolutionPort {
  return {
    resolvePlan: (planAnchorNodeId: NodeId) => resolvePlan(planAnchorNodeId),
  }
}
