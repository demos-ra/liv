// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v2-2-shot4
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  MemNode, MemEdge, MemGraph, MemArm, ScopeFilter, AxisId, AxisConfig  F-memory/R0
//   W-ATOM  EdgePrimitiveType, MEMORY_CONFIG                                     F-memory/R0
// wires-out:
//   W-FN  scoreTopology         →  F-memory/R1 memory-present
//   W-FN  scoreRecency          →  F-memory/R1 memory-present
//   W-FN  scoreChronology       →  F-memory/R1 memory-present
//   W-FN  scoreProjectAffinity  →  F-memory/R1 memory-present
//   W-FN  scoreModeAffinity     →  F-memory/R1 memory-present
//   W-FN  scoreProgramAffinity  →  F-memory/R1 memory-present
//   W-FN  scoreLineageProximity →  F-memory/R1 memory-present
//   W-FN  scoreEnergy           →  F-memory/R1 memory-present
//   W-FN  AXIS_SCORERS          →  F-memory/R1 memory-present
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v2.2 §E — 8-axis projection algorithms.
//
// Each axis is a pure function: (node, context) → number ∈ [0, 1]. The score
// is what the axis projects per LM v2.2 §E declarations. Algorithms below are
// F-memory's authoring choice for "how" the projection computes; the standard
// owns "what" each axis projects.
//
// ─── Orthogonality (LMA20 / V1) ────────────────────────────────────────────
// No axis function reads any other axis's score at projection time. Axes may
// share inputs (graph state, scope tags, lineage edges, timestamps, arm
// membership) but never each other's outputs. Auditable by file inspection:
// each scoreX function takes (node, ctx) where ctx is graph + caller config —
// no `axisScores` parameter, no cross-axis call. Sprint-close auditor verifies
// V1 as variable predicate over this surface.
//
// ─── D-AXIS-DEFAULT-WEIGHTS rationale ─────────────────────────────────────
// Default weights at PRESENT_DEFAULTS aim for "graph-balanced": topology +
// energy weighted slightly higher (these are stable structural signals);
// affinity axes (project/mode/program) weighted lower since they depend on
// caller context that may be sparse. Recency + chronology weighted moderate.
// All sum to 1.0 for stable ranked-score interpretation. These are seed
// values — empirical tuning is post-shot4.
//
// ─── Score normalization ───────────────────────────────────────────────────
// Every score is in [0, 1]. 0 = "not at all aligned with this axis's projection
// concern"; 1 = "maximally aligned". Combiner (memory-present.ts) takes
// weighted sum across active axes; per-node ranking score is also in [0, 1]
// when weights sum to 1.

import type {
  MemNode,
  MemEdge,
  MemGraph,
  MemArm,
  ScopeFilter,
  AxisId,
  AxisConfig,
} from '../config/memory-types'
import { MEMORY_CONFIG, M0_IDENTITY, M1_PURPOSE, M2_KNOWLEDGE, M3_CONTEXT, M4_INPUT } from '../config/memory-types'
import type { NodeId } from '@/core/types/primitives'

// ─── Shared scoring context ────────────────────────────────────────────────
// Every axis function consumes the same context shape. Per LMA20 orthogonality:
// shared inputs are read; per-axis outputs never appear here.

export type AxisScoringContext = {
  /** All in-scope nodes considered for the projection (post-LMA21 filter). */
  candidates:    Map<NodeId, MemNode>
  /** All edges among candidates (graph topology). */
  edgesByFrom:   Map<NodeId, MemEdge[]>
  edgesByTo:     Map<NodeId, MemEdge[]>
  /** Arms covering candidates (membership lookup). */
  arms:          MemArm[]
  /** Active scope at projection time — caller's ScopeFilter. */
  scope:         ScopeFilter
  /** Per-axis caller config (carries activeMode / activeProgram / activeLineage). */
  configs:       Map<AxisId, AxisConfig>
  /** Reference timestamp for recency decay (typically Date.now()). */
  now:           number
  /** Min/max createdAt across candidates — used by chronology. */
  createdAtMin:  number
  createdAtMax:  number
}

// ─── topology — graph-structural position ──────────────────────────────────
// Standard §E row 1: "graph-structural position of the node — degree,
// closure, asymmetry as observed in the current graph."
//
// Algorithm: combines normalized degree, cachedClosure, cachedAsymmetry into
// a single position score. Higher score = node sits at a structurally
// significant position (high degree, well-closed, asymmetric outflow).
// Closure already in [0, 1]; degree normalized against MEMORY_CONFIG.MAX_DEGREE.

export function scoreTopology(node: MemNode, ctx: AxisScoringContext): number {
  const out = ctx.edgesByFrom.get(node.id)?.length ?? 0
  const inb = ctx.edgesByTo.get(node.id)?.length ?? 0
  const degree = out + inb
  const degreeNorm = Math.min(1, degree / MEMORY_CONFIG.MAX_DEGREE)
  const closure = node.cachedClosure                 // already [0, 1]
  const asymmetry = Math.min(1, Math.abs(node.cachedAsymmetry))
  // Equal weighting across the three structural fields. Tuned at empirical
  // pass post-shot4.
  return (degreeNorm + closure + asymmetry) / 3
}

// ─── recency — time-since-touch ────────────────────────────────────────────
// Standard §E row 2: "distance from now to the node's most recent traversal
// or write."
//
// Algorithm: exponential decay over `(now - lastTouch)`. lastTouch is
// `lastTraversed` if non-null, else `createdAt`. Half-life from
// MEMORY_CONFIG.RECENCY_HALF_LIFE (7 days). Score = 2^(-Δt/halfLife).
// Caller may override halfLifeMs via configs['recency'].

export function scoreRecency(node: MemNode, ctx: AxisScoringContext): number {
  const lastTouch = node.lastTraversed ?? node.createdAt
  const halfLife = (ctx.configs.get('recency')?.halfLifeMs as number | undefined)
                   ?? MEMORY_CONFIG.RECENCY_HALF_LIFE
  const dt = Math.max(0, ctx.now - lastTouch)
  return Math.pow(2, -dt / halfLife)
}

// ─── chronology — write-order position ─────────────────────────────────────
// Standard §E row 3: "the node's rank in the persistence sequence."
//
// Algorithm: linear rank by createdAt within candidate set. Newest = 1,
// oldest = 0. Distinguished from `recency`: chronology is rank-position
// (where in the sequence?), recency is decay-weight (how recently?).
// Per LMA20: chronology score is independent of recency score — both read
// timestamps but compose differently.

export function scoreChronology(node: MemNode, ctx: AxisScoringContext): number {
  const span = ctx.createdAtMax - ctx.createdAtMin
  if (span <= 0) return 1  // single timestamp or empty — degenerate; full score
  return (node.createdAt - ctx.createdAtMin) / span
}

// ─── projectAffinity — alignment to active project scope ───────────────────
// Standard §E row 4: "alignment between the node's stamped project scope and
// the active project context."
//
// Algorithm: binary-graded by stamped scope tags vs active project. Reads
// LMA21 scope-tags (wired Shot 3). Score:
//   1.0 if node carries 'project:<activeProject>' OR is 'global'-tagged (per
//        D-GLOBAL-UNIVERSAL — global knowledge appears in every project view)
//   0.0 otherwise (no project alignment)
// When no active project (scopeContext.project undefined), score = 1.0 (no
// filter constraint) — every node passes.

export function scoreProjectAffinity(node: MemNode, ctx: AxisScoringContext): number {
  const activeProject = ctx.scope.project
  if (activeProject === undefined) return 1
  if (node.scope.has('global')) return 1
  if (node.scope.has('project:' + activeProject)) return 1
  return 0
}

// ─── modeAffinity — alignment to active mode ───────────────────────────────
// Standard §E row 5: "alignment between the node's prior mode contexts and
// the active mode (plan / verify / discover / build)."
//
// Algorithm: per D-MODE-PROGRAM-PROPAGATION reading (b2) — caller supplies
// active mode via configs['modeAffinity'] = { activeMode: <FrameworkMode> }.
// F-memory derives node-side mode association from arm membership: if node is
// in an arm whose label matches `mode-<activeMode>`, score = 1; else if
// node-id contains 'mode-<activeMode>' literal, score = 1; else 0.5 (no
// signal, treat as neutral); else 0 if mode-arm exists but node not in it.
// When configs['modeAffinity'] absent or activeMode undefined → 1.0 (no filter).

export function scoreModeAffinity(node: MemNode, ctx: AxisScoringContext): number {
  const cfg = ctx.configs.get('modeAffinity')
  const activeMode = cfg?.activeMode as string | undefined
  if (!activeMode) return 1
  // Node-id direct match (seeded mode-nodes use 'global-seed-mode-<m>')
  if (node.id.includes('mode-' + activeMode)) return 1
  // Arm membership match
  for (const arm of ctx.arms) {
    if (!arm.nodeIds.includes(node.id)) continue
    if (arm.label && arm.label.includes('mode-' + activeMode)) return 1
  }
  // No mode signal — neutral (don't penalize nodes for a feature we can't
  // reliably infer from current graph).
  return 0.5
}

// ─── programAffinity — alignment to active program ─────────────────────────
// Standard §E row 6: "alignment between the node's prior program contexts
// and the active program (L4 surface)."
//
// Algorithm: per D-MODE-PROGRAM-PROPAGATION reading (b2) — caller supplies
// active program via configs['programAffinity'] = { activeProgram: <id> }.
// Node-side program association currently has no graph carrier (no program
// tags on nodes today). Until program-side topology is seeded, score = 1.0
// (neutral) when activeProgram set, 1.0 when absent. Effectively a no-op
// axis at HEAD; placeholder for Shot 5+ when program-side seed nodes land.

export function scoreProgramAffinity(node: MemNode, ctx: AxisScoringContext): number {
  const cfg = ctx.configs.get('programAffinity')
  const activeProgram = cfg?.activeProgram as string | undefined
  if (!activeProgram) return 1
  // Node-id direct match (placeholder pattern; see seed-data when program
  // seeds land)
  if (node.id.includes('program-' + activeProgram)) return 1
  // Arm membership match
  for (const arm of ctx.arms) {
    if (!arm.nodeIds.includes(node.id)) continue
    if (arm.label && arm.label.includes('program-' + activeProgram)) return 1
  }
  // Neutral — no program carrier on nodes at HEAD; don't penalize.
  return 0.5
}

// ─── lineageProximity — distance from active lineage chain ─────────────────
// Standard §E row 7: "distance, along edges, from the node to the active
// lineage chain."
//
// Algorithm: per D-MODE-PROGRAM-PROPAGATION (b2) — caller supplies the
// active lineage chain via configs['lineageProximity'] = { activeChain:
// NodeId[] }. Score = 1 / (1 + min-edge-distance to any node in activeChain).
// BFS-bounded by configs['lineageProximity'] = { maxHops: number } (default 5).
// Composes on the same edge-traversal pattern as Lineage primitive (Shot 3).
//
// When activeChain absent or empty → 1.0 (no lineage filter).
// When node IS in activeChain → 1.0 (distance 0).
// When unreachable within maxHops → 0.

export function scoreLineageProximity(node: MemNode, ctx: AxisScoringContext): number {
  const cfg = ctx.configs.get('lineageProximity')
  const activeChain = cfg?.activeChain as NodeId[] | undefined
  if (!activeChain || activeChain.length === 0) return 1
  if (activeChain.includes(node.id)) return 1
  const maxHops = (cfg?.maxHops as number | undefined) ?? 5
  // BFS from node outward, bounded by maxHops, looking for any chain node.
  // Scope filter implicitly applied because ctx.candidates is already in-scope.
  const visited = new Set<NodeId>([node.id])
  let frontier: NodeId[] = [node.id]
  for (let depth = 1; depth <= maxHops; depth++) {
    const next: NodeId[] = []
    for (const cur of frontier) {
      const out = ctx.edgesByFrom.get(cur) ?? []
      const inb = ctx.edgesByTo.get(cur) ?? []
      for (const e of [...out, ...inb]) {
        const neighbor = e.fromId === cur ? e.toId : e.fromId
        if (visited.has(neighbor)) continue
        if (!ctx.candidates.has(neighbor)) continue   // out-of-scope per LMA21
        if (activeChain.includes(neighbor)) {
          return 1 / (1 + depth)
        }
        visited.add(neighbor)
        next.push(neighbor)
      }
    }
    if (next.length === 0) break
    frontier = next
  }
  return 0
}

// ─── energy — activation/concentration in local subgraph ───────────────────
// Standard §E row 8: "activation and concentration in the node's local
// subgraph."
//
// Algorithm: composite of (a) cachedLayer position — deeper layers (M0/M1 =
// identity/purpose) carry more energy than M4 (input); (b) local edge-weight
// concentration — sum of incoming + outgoing edge weights normalized by
// MAX_DEGREE × max-weight. Layer mapping:
//   M0_IDENTITY  → 1.00
//   M1_PURPOSE   → 0.85
//   M2_KNOWLEDGE → 0.65
//   M3_CONTEXT   → 0.40
//   M4_INPUT     → 0.20
// Combined with edge-weight concentration (50/50). Layer signal stable;
// edge concentration tracks recent activation through learn() weight updates.
// Both are independent of any other axis's score — LMA20 holds.

const LAYER_ENERGY: Record<number, number> = {
  [M0_IDENTITY]:  1.00,
  [M1_PURPOSE]:   0.85,
  [M2_KNOWLEDGE]: 0.65,
  [M3_CONTEXT]:   0.40,
  [M4_INPUT]:     0.20,
}

export function scoreEnergy(node: MemNode, ctx: AxisScoringContext): number {
  const layerEnergy = LAYER_ENERGY[node.cachedLayer] ?? 0.20
  const out = ctx.edgesByFrom.get(node.id) ?? []
  const inb = ctx.edgesByTo.get(node.id) ?? []
  const weightSum = [...out, ...inb].reduce((s, e) => s + e.weight, 0)
  // MemEdge.weight ∈ (0, 1] per existing v0.6 invariant; cap normalizer.
  const concentration = Math.min(1, weightSum / MEMORY_CONFIG.MAX_DEGREE)
  return (layerEnergy + concentration) / 2
}

// ─── AXIS_SCORERS — dispatch table ─────────────────────────────────────────
// Map from AxisId to scoring function. Used by computePresentState to compute
// score per active axis per candidate node. Single source of truth for
// axis identity → scoring impl.

export const AXIS_SCORERS: Record<AxisId, (node: MemNode, ctx: AxisScoringContext) => number> = {
  topology:         scoreTopology,
  recency:          scoreRecency,
  chronology:       scoreChronology,
  projectAffinity:  scoreProjectAffinity,
  modeAffinity:     scoreModeAffinity,
  programAffinity:  scoreProgramAffinity,
  lineageProximity: scoreLineageProximity,
  energy:           scoreEnergy,
}

// ─── End of memory-axes.ts ─────────────────────────────────────────────────
