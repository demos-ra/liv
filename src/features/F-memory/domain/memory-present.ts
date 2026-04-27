// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1, 4b-nodeid-propagation, lm-v2-2-shot4
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  NodeId                core/R5 (primitives)
//   W-ATOM  MemGraph              F-memory/R0
//   W-ATOM  ScopedGraphSet        F-memory/R0
//   W-ATOM  MemArm                F-memory/R0
//   W-ATOM  PresentState          F-memory/R0 (v2.2 §D shape)
//   W-ATOM  AxisId, AxisSet, ScopeFilter  F-memory/R0
//   W-ATOM  AXIS_SCORERS          F-memory/R1 (memory-axes)
//   W-ATOM  PRESENT_LIMIT_MAX     F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
//   R1  ./memory-axes
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v2.2 — Present State Layer.
// R1: pure function, zero I/O.
// §18: the bridge between living process and immediate usability.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures.
//
// lm-v2-2-shot4: end-to-end rewrite per LM v2.2 §D.
//   v2.1 returned `{statements: PresentStateStatement[]}` — pre-rendered
//   statement records with arm/value/source/layer/confidence/recency.
//   v2.2 returns `{projected: NodeId[], axisScores, scopeContext}` — node
//   identifiers + per-axis scores + scope echo. Caller renders content from
//   projected via existing F-memory accessors (getUserGraph, getGlobalGraph).
//
// Pipeline (per LM v2.2 §D + brief §E):
//   1. Apply scope filter (LMA21, wired Shot 3) — scope filter precedes scoring
//      per LM v2.2 §C. The R2 caller has already filtered candidate nodes; this
//      function expects an in-scope node set as input.
//   2. Score per axis per node — call AXIS_SCORERS for each active axis.
//   3. Combine per-node scores into ranking — weighted sum per
//      AxisSet.weights (or PRESENT_DEFAULTS if not provided).
//   4. Sort nodes by ranking score descending.
//   5. Take top `limit` nodes → projected: NodeId[].
//   6. Return {projected, axisScores, scopeContext}.
//
// Orthogonality (LMA20 / V1): each axis function reads context independently;
// no axis reads another axis's output. Verified by inspection in memory-axes.ts.
// Combiner (this file) reads all axis scores AFTER they're computed — that's
// the ranking step, not the orthogonality-violation type (axes don't see each
// other; the combiner sees all).

import type {
  MemGraph,
  MemEdge,
  MemNode,
  MemArm,
  ScopedGraphSet,
  PresentState,
  AxisId,
  AxisSet,
  ScopeFilter,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M4_INPUT,
} from '../config/memory-types'
import type { NodeId } from '@/core/types/primitives'
import { AXIS_SCORERS } from './memory-axes'
import type { AxisScoringContext } from './memory-axes'

// ─── Compute Present State (LM v2.2 §D) ──────────────────────────────────────
// Pure R1 function. Input:
//   graphs:        scoped node sets (user + global) — already scope-filtered
//                  by R2 caller per LMA21
//   userArms:      arms for the user's graph (mode/program affinity inputs)
//   globalArms:    arms for the global graph
//   scope:         the active ScopeFilter (echoed back as scopeContext)
//   axes:          AxisSet — active axes, weights, per-axis configs
//   limit:         max nodes in projected output (PRESENT_LIMIT_MAX cap)

export function computePresentState(
  graphs:     ScopedGraphSet,
  userArms:   MemArm[],
  globalArms: MemArm[],
  scope:      ScopeFilter,
  axes:       AxisSet,
  limit:      number,
): PresentState {
  // Cold-boot: empty input → empty projection (preserves G1 cold-boot behavior
  // from v2.1: never block on computation).
  if (graphs.user.nodes.size === 0 && graphs.global.nodes.size === 0) {
    return {
      projected:    [],
      axisScores:   new Map(),
      scopeContext: scope,
    }
  }

  // ── Step 1: Build candidate node set ─────────────────────────────────────
  // R2 caller has already filtered by scope (LMA21 projection-side). Here we
  // assemble the candidate map and filter out M4_INPUT nodes (these are raw
  // input not yet promoted; v2.1 behavior preserved).
  const candidates = new Map<NodeId, MemNode>()
  for (const [id, node] of graphs.user.nodes) {
    if (node.cachedLayer === M4_INPUT) continue
    candidates.set(id, node)
  }
  for (const [id, node] of graphs.global.nodes) {
    if (node.cachedLayer === M4_INPUT) continue
    if (candidates.has(id)) continue   // user-graph wins on collision (v2.1 priority)
    candidates.set(id, node)
  }

  if (candidates.size === 0) {
    return {
      projected:    [],
      axisScores:   new Map(),
      scopeContext: scope,
    }
  }

  // ── Step 2: Build edges-by-from + edges-by-to indexes for axis context ──
  const edgesByFrom = new Map<NodeId, MemEdge[]>()
  const edgesByTo   = new Map<NodeId, MemEdge[]>()
  for (const g of [graphs.user, graphs.global]) {
    for (const [fromId, edges] of g.edges) {
      const accum = edgesByFrom.get(fromId) ?? []
      accum.push(...edges)
      edgesByFrom.set(fromId, accum)
      for (const e of edges) {
        const accumIn = edgesByTo.get(e.toId) ?? []
        accumIn.push(e)
        edgesByTo.set(e.toId, accumIn)
      }
    }
  }

  // ── Step 3: Compute axis context ─────────────────────────────────────────
  const now = Date.now()
  let createdAtMin = Infinity
  let createdAtMax = -Infinity
  for (const node of candidates.values()) {
    if (node.createdAt < createdAtMin) createdAtMin = node.createdAt
    if (node.createdAt > createdAtMax) createdAtMax = node.createdAt
  }
  const arms = [...userArms, ...globalArms]
  const ctx: AxisScoringContext = {
    candidates,
    edgesByFrom,
    edgesByTo,
    arms,
    scope,
    configs:      axes.configs,
    now,
    createdAtMin: createdAtMin === Infinity ? now : createdAtMin,
    createdAtMax: createdAtMax === -Infinity ? now : createdAtMax,
  }

  // ── Step 4: Score per axis per node ──────────────────────────────────────
  // axisScores: Map<NodeId, Map<AxisId, number>>. Per LMA20 orthogonality —
  // each axis function is called independently; no axis sees another's output.
  const axisScores = new Map<NodeId, Map<AxisId, number>>()
  for (const [id, node] of candidates) {
    const perAxis = new Map<AxisId, number>()
    for (const axisId of axes.active) {
      const scorer = AXIS_SCORERS[axisId]
      const score = scorer(node, ctx)
      perAxis.set(axisId, score)
    }
    axisScores.set(id, perAxis)
  }

  // ── Step 5: Combine per-node scores into ranking score ──────────────────
  // D-RANKING-COMBINER (optional D-row): weighted sum across active axes.
  // Weights from axes.weights; absent weight = 1 / activeCount (uniform).
  const activeCount = axes.active.length
  const uniformWeight = activeCount > 0 ? 1 / activeCount : 0
  const rankingScore = new Map<NodeId, number>()
  for (const [id, perAxis] of axisScores) {
    let sum = 0
    let weightTotal = 0
    for (const axisId of axes.active) {
      const w = axes.weights.get(axisId) ?? uniformWeight
      const s = perAxis.get(axisId) ?? 0
      sum += w * s
      weightTotal += w
    }
    // Normalize by weight total so ranking is in [0, 1] regardless of caller
    // weight sum convention.
    rankingScore.set(id, weightTotal > 0 ? sum / weightTotal : 0)
  }

  // ── Step 6: Rank + take top `limit` ─────────────────────────────────────
  const ranked = Array.from(rankingScore.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.min(limit, candidates.size))
    .map(([id]) => id)

  return {
    projected:    ranked,
    axisScores,
    scopeContext: scope,
  }
}

// ─── End of memory-present.ts ────────────────────────────────────────────────
