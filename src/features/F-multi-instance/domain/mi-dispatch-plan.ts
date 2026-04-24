// @liv-standard v1.5.1
// [F-multi-instance/R1]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R1
// wires-in:
//   W-ATOM  PlanArtifactContent, Declaration, DeclId,
//           PlanTopology, DomainBinding,
//           InstanceResult, InstanceTerminalState      ←  F-multi-instance/R0 mi-types
// wires-out:  consumed by F-multi-instance/R2 mi-execute (S1 stage)
// deps:
//   R0  ../types/mi-types
// validated:  pending
//
// F-multi-instance R1 — S1 dispatch plan construction.
// Pure. Consumes a PlanArtifactContent and produces a DispatchPlan that
// describes which declarations run in which order, initialized instance
// results (all pending), and an empty violations bucket.
//
// Topology handling (§3.4.a):
//   - singleton: one declaration, one instance
//   - sequence:  declarations run in dependsOn-linearized order
//   - tier:      declarations grouped by tierHint; within-tier parallel allowed
//   - loop:      reentry permitted until perSet.maxReentries
//
// This is the initialization layer. It does not dispatch; R2 consumes the
// DispatchPlan and drives actual execution. Kept pure so S1 can be tested
// deterministically against PlanArtifactContent fixtures.

import type {
  PlanArtifactContent,
  Declaration,
  DeclId,
  PlanTopology,
  InstanceResult,
} from '../types/mi-types'

// ─── Dispatch plan shape ─────────────────────────────────────────────────────

export type DispatchOrder = {
  /**
   * Linearized sequence of DeclIds the engine will walk.
   * For 'tier' topology this is a flattening; within-tier parallelism is
   * preserved in tierGroups for the dispatcher to use.
   */
  order:      DeclId[]
  /**
   * Per-tier declaration groupings; empty array for non-tier topologies.
   */
  tierGroups: DeclId[][]
}

export type DispatchPlan = {
  topology:           PlanTopology
  dispatchOrder:      DispatchOrder
  initialInstances:   InstanceResult[]
  maxReentriesPerSet: number
}

// ─── Topology linearization ──────────────────────────────────────────────────

/**
 * Topologically sort declarations by dependsOn relation.
 * Assumes PA2b (acyclic) holds — Plan v2.2 invariant. Caller (S1) has read
 * PlanArtifactContent through F-memory, which trusts the prior Plan emission.
 */
function linearizeSequence(decls: Declaration[]): DeclId[] {
  const byId     = new Map<DeclId, Declaration>(decls.map(d => [d.id, d]))
  const visited  = new Set<DeclId>()
  const ordered: DeclId[] = []

  function visit(id: DeclId): void {
    if (visited.has(id)) return
    visited.add(id)
    const d = byId.get(id)
    if (!d) return
    for (const dep of d.dependsOn) visit(dep)
    ordered.push(id)
  }

  for (const d of decls) visit(d.id)
  return ordered
}

/**
 * Group declarations by tier hint for 'tier' topology.
 * Returns groups in tier-declaration order (stable relative to binding.tierLimits key order).
 */
function groupByTier(
  decls:     Declaration[],
  intent:    PlanArtifactContent['intent'],
  tierKeys:  string[],
): DeclId[][] {
  const byTier = new Map<string, DeclId[]>()
  for (const k of tierKeys) byTier.set(k, [])
  for (const d of decls) {
    const tier = intent[d.id]?.tierHint
    if (!tier) continue
    const bucket = byTier.get(String(tier))
    if (bucket) bucket.push(d.id)
    else byTier.set(String(tier), [d.id])
  }
  return Array.from(byTier.values()).filter(g => g.length > 0)
}

// ─── Entry: buildDispatchPlan ────────────────────────────────────────────────

/**
 * Construct a DispatchPlan from a resolved PlanArtifactContent.
 *
 * Discipline:
 *   - No mutation of plan.shape.declarations or plan.binding (IA2).
 *   - InstanceResult initialized with status='pending' before dispatch;
 *     engine transitions to terminal states during S2. The IA1 gate reads
 *     terminal states after all instances settle.
 *   - Note: `status` on InstanceResult is typed as InstanceTerminalState.
 *     Per spec §3.5, 'pending' is a non-terminal ExecutionPositional state
 *     tracked during runtime; terminal assignment happens before gate eval.
 *     We initialize to 'failed' as a safe default that will be overwritten
 *     by the dispatcher before S2; any instance left at 'failed' indicates
 *     it never ran, which is itself a terminal state satisfying IA1.
 */
export function buildDispatchPlan(plan: PlanArtifactContent): DispatchPlan {
  const decls    = plan.shape.declarations
  const topology = plan.shape.topology

  let order: DeclId[] = []
  let tierGroups: DeclId[][] = []

  switch (topology) {
    case 'singleton': {
      // PA1 guarantees length >= 1; singleton pins exactly one.
      order = decls.length > 0 ? [decls[0].id] : []
      break
    }
    case 'sequence': {
      order = linearizeSequence(decls)
      break
    }
    case 'tier': {
      const tierKeys = Object.keys(plan.binding.tierLimits)
      tierGroups = groupByTier(decls, plan.intent, tierKeys)
      order = tierGroups.flat()
      break
    }
    case 'loop': {
      order = linearizeSequence(decls)
      break
    }
  }

  const initialInstances: InstanceResult[] = order.map(declId => ({
    declId,
    status:     'failed' as const,   // safe default; dispatcher will overwrite (see docstring)
    tokenCount: 0,
    durationMs: 0,
    retries:    0,
    errors:     [],
  }))

  return {
    topology,
    dispatchOrder:      { order, tierGroups },
    initialInstances,
    maxReentriesPerSet: plan.limit.perSet.maxReentries,
  }
}
