// @liv-standard v1.3
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  MemGraph              F-memory/R0
//   W-ATOM  ScopedGraphSet        F-memory/R0
//   W-ATOM  MemArm                F-memory/R0
//   W-ATOM  PresentState          F-memory/R0
//   W-ATOM  PresentStateStatement F-memory/R0
//   W-ATOM  ConfidenceTier        F-memory/R0
//   W-ATOM  MLayer                F-memory/R0
//   W-ATOM  MEMORY_CONFIG         F-memory/R0
// wires-out:  none (consumed by R2 service)
// deps:
//   R0  ../config/memory-types
// validated:  pending

// Living Memory v1.1 — Present State Layer.
// R1: pure function, zero I/O.
// §18: the bridge between living process and immediate usability.
// A pure R1 function: computePresentState(graphs, userArms, globalArms) → PresentState.
// Never stored. Always derived from current graph state. Never stale.
//
// G1: graceful fallback for weak arm structure.
//     Must produce useful output even when the graph has no clear community
//     structure (first ~5 sessions). Return nodes by layer + recency without
//     arm labels. Never return empty because arms haven't formed.
//
// G2: getPresentState() at R3 reads the precomputed result — this function
//     is called only inside runTraversal() as a side effect.
//
// lm-v1.1 changes (Amendment 3):
//   Signature: ScopedGraphSet + userArms + globalArms (two-graph model)
//   Merge: user nodes first (priority), then global nodes.
//   Dedup: global node skipped if cosine similarity ≥ LABEL_REUSE_THRESHOLD
//          to any user node (same constant as bind-before-create, A6).

import type {
  MemGraph,
  MemNode,
  MemArm,
  ScopedGraphSet,
  PresentState,
  PresentStateStatement,
  ConfidenceTier,
  MLayer,
} from '../config/memory-types'
import {
  MEMORY_CONFIG,
  M0_IDENTITY,
  M1_PURPOSE,
  M2_KNOWLEDGE,
  M3_CONTEXT,
  M4_INPUT,
} from '../config/memory-types'

// ─── Compute Present State ────────────────────────────────────────────────────
// §18: reads all nodes from both graphs, weighted by recency + layer depth.
// Output: structured data, not prose. The consuming LLM reads it as context injection.
// Amendment 3: accepts ScopedGraphSet. User nodes take priority over global nodes.

export function computePresentState(
  graphs: ScopedGraphSet,
  userArms: MemArm[],
  globalArms: MemArm[],
): PresentState {
  if (graphs.user.nodes.size === 0 && graphs.global.nodes.size === 0) {
    // G2: cold boot — return empty. Never block on computation.
    return { statements: [] }
  }

  const now = Date.now()

  // Build arm lookup: nodeId → arm label (span both arm sets)
  const nodeToArm = new Map<string, string | null>()
  for (const arm of userArms) {
    for (const nodeId of arm.nodeIds) {
      if (!nodeToArm.has(nodeId)) {
        nodeToArm.set(nodeId, arm.label ?? arm.id)
      }
    }
  }
  for (const arm of globalArms) {
    for (const nodeId of arm.nodeIds) {
      if (!nodeToArm.has(nodeId)) {
        nodeToArm.set(nodeId, arm.label ?? arm.id)
      }
    }
  }

  // Score and collect — user nodes first (priority), then deduplicated global nodes
  const scored: ScoredNode[] = []

  // Collect user graph nodes
  // Amendment 3: user nodes always included — they are the primary workspace
  const userEmbeddings: Array<{ nodeId: string; embedding: number[] }> = []

  for (const [nodeId, node] of graphs.user.nodes) {
    if (node.cachedLayer === M4_INPUT) continue
    scored.push(scoreNode(nodeId, node, nodeToArm, now))
    if (node.embedding) {
      userEmbeddings.push({ nodeId, embedding: node.embedding })
    }
  }

  // Collect global graph nodes — deduplicate against user nodes
  // Amendment 3: skip global node if near-identical to any user node (A6)
  for (const [nodeId, node] of graphs.global.nodes) {
    if (node.cachedLayer === M4_INPUT) continue

    // Dedup: if this global node is near-identical to a user node, skip it
    if (node.embedding && isNearDuplicate(node.embedding, userEmbeddings)) {
      continue
    }

    scored.push(scoreNode(nodeId, node, nodeToArm, now))
  }

  // Sort by score descending — most relevant first
  scored.sort((a, b) => b.sortScore - a.sortScore)

  // Take top N
  const topN = scored.slice(0, MEMORY_CONFIG.PRESENT_STATE_MAX)

  const statements: PresentStateStatement[] = topN.map(item => ({
    arm:        item.arm,
    value:      item.content,
    source:     item.source,
    layer:      item.layer,
    confidence: item.confidence,
    recency:    item.recency,
  }))

  return { statements }
}

// ─── Score a single node ──────────────────────────────────────────────────────

type ScoredNode = {
  nodeId:     string
  content:    string
  arm:        string | null
  source:     string | null
  layer:      MLayer
  confidence: ConfidenceTier
  recency:    number
  sortScore:  number
}

function scoreNode(
  nodeId: string,
  node: MemNode,
  nodeToArm: Map<string, string | null>,
  now: number,
): ScoredNode {
  // §18: recency = EMA-weighted traversal recency
  const recency = computeRecency(node.lastTraversed, now)

  // §18: layer depth — M0/M1 nodes carry more structural weight
  const layerWeight = layerDepthWeight(node.cachedLayer)

  // Combined sort score: layer weight + recency
  const sortScore = layerWeight * 0.6 + recency * 0.4

  const confidence = layerToConfidence(node.cachedLayer)

  // G1: arm is null if arms haven't formed yet
  const arm = nodeToArm.get(nodeId) ?? null

  // §18 source text lifecycle:
  //   M3: source_text available for exact recall
  //   M2+: source_text pruned, value from graph position
  const source = node.cachedLayer >= M3_CONTEXT ? node.sourceText : null

  return {
    nodeId,
    content: node.content,
    arm,
    source,
    layer:   node.cachedLayer,
    confidence,
    recency,
    sortScore,
  }
}

// ─── Near-duplicate detection (Amendment 3) ───────────────────────────────────
// Uses LABEL_REUSE_THRESHOLD (same constant as bind-before-create, A6).
// Cosine similarity between global node embedding and any user node embedding.

function isNearDuplicate(
  globalEmbedding: number[],
  userEmbeddings: Array<{ nodeId: string; embedding: number[] }>,
): boolean {
  for (const { embedding } of userEmbeddings) {
    const sim = cosine(globalEmbedding, embedding)
    if (sim >= MEMORY_CONFIG.LABEL_REUSE_THRESHOLD) {
      return true
    }
  }
  return false
}

// ─── Cosine similarity ────────────────────────────────────────────────────────
// R1: pure function. Duplicated here to avoid cross-file R1 dep on memory-bind.
// Both vectors assumed same length (1536). Returns [-1, 1].

function cosine(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, magA = 0, magB = 0
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i]
    magA += a[i] * a[i]
    magB += b[i] * b[i]
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB)
  return denom === 0 ? 0 : dot / denom
}

// ─── Recency ──────────────────────────────────────────────────────────────────
// §18: EMA-style weighting on last_traversed.
// Recent traversals contribute more. Half-life from config.
// Returns [0, 1] where 1 = just traversed, 0 = long ago / never.

function computeRecency(lastTraversed: number | null, now: number): number {
  if (lastTraversed === null) return 0

  const elapsed = now - lastTraversed
  if (elapsed <= 0) return 1

  // Exponential decay with half-life
  return Math.exp(-Math.LN2 * elapsed / MEMORY_CONFIG.RECENCY_HALF_LIFE)
}

// ─── Layer depth weight ───────────────────────────────────────────────────────
// §18: M0/M1 nodes carry more structural weight than M3/M4.

function layerDepthWeight(layer: MLayer): number {
  switch (layer) {
    case M0_IDENTITY:  return 1.0
    case M1_PURPOSE:   return 0.85
    case M2_KNOWLEDGE: return 0.65
    case M3_CONTEXT:   return 0.4
    case M4_INPUT:     return 0.1
  }
}

// ─── Confidence tier mapping ──────────────────────────────────────────────────
// §18: confidence tiers from layer position.

function layerToConfidence(layer: MLayer): ConfidenceTier {
  switch (layer) {
    case M0_IDENTITY:  return 'identity'
    case M1_PURPOSE:   return 'purpose'
    case M2_KNOWLEDGE: return 'consolidated'
    case M3_CONTEXT:   return 'recent'
    case M4_INPUT:     return 'new'
  }
}
