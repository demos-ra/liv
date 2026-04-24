// @liv-standard v1.5.1
// [F-memory/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1-arm-userid, 4b-nodeid-propagation
// slice:      F-memory
// layer:      R1
// wires-in:
//   W-ATOM  NodeId         core/R5 (primitives)
//   W-ATOM  MemGraph       F-memory/R0
//   W-ATOM  MemArm         F-memory/R0
//   W-ATOM  MemEdge        F-memory/R0
//   W-ATOM  MEMORY_CONFIG  F-memory/R0
// wires-out:  none (consumed by R1 present, R2 service)
// deps:
//   R0  ../config/memory-types
//   R1  ./memory-bind (cosine)
//   R5  @/core/types/primitives
// validated:  pending

// Living Memory v1.1 — arm detection and affinity.
// R1: pure functions, zero I/O.
// §5: arms are overlapping subgraphs detected by community structure (modularity).
// Not separate from the graph — soft constraints on traversal.
// arm_affinity = edge weight × embedding similarity.
// Traversal amplified within arms via shared_arm_weight modifier.
// A ping activates the entire arm across layers, gated by affinity threshold.
// 4b-nodeid-propagation: NodeId on all node-id-shaped signatures.

import type {
  MemGraph,
  MemArm,
  MLayer,
} from '../config/memory-types'
import { MEMORY_CONFIG } from '../config/memory-types'
import { cosine } from './memory-bind'
import type { NodeId } from '@/core/types/primitives'

// ─── Arm Affinity ─────────────────────────────────────────────────────────────
// §5: arm_affinity = edge weight × embedding similarity.
// Used to assign nodes to arms and to modulate traversal within arms.

export function armAffinity(
  nodeIdA: NodeId,
  nodeIdB: NodeId,
  graph: MemGraph,
): number {
  const nodeA = graph.nodes.get(nodeIdA)
  const nodeB = graph.nodes.get(nodeIdB)
  if (!nodeA || !nodeB) return 0

  // Edge weight component (check both directions, take max)
  const edgesA = graph.edges.get(nodeIdA) ?? []
  const edgesB = graph.edges.get(nodeIdB) ?? []
  const edgeAB = edgesA.find(e => e.toId === nodeIdB)
  const edgeBA = edgesB.find(e => e.toId === nodeIdA)
  const edgeWeight = Math.max(edgeAB?.weight ?? 0, edgeBA?.weight ?? 0)

  // Embedding similarity component
  let embSim = 0
  if (nodeA.embedding && nodeB.embedding) {
    embSim = cosine(nodeA.embedding, nodeB.embedding)
  }

  return edgeWeight * embSim
}

// ─── Detect Arms ──────────────────────────────────────────────────────────────
// §5: community detection via label propagation.
// Simple, fast, graph-native. No external dependencies.
// Produces overlapping communities — a node can belong to multiple arms.
//
// Algorithm:
//   1. Each node starts as its own community.
//   2. Iterate: each node adopts the community label most common among
//      its neighbors (weighted by arm_affinity).
//   3. Converge when no labels change.
//   4. Communities with ≥2 members become arms.

export function detectArms(graph: MemGraph): MemArm[] {
  if (graph.nodes.size === 0) return []

  const nodeIds = Array.from(graph.nodes.keys())

  // Initialize: each node is its own community
  const labels = new Map<NodeId, NodeId>()
  for (const id of nodeIds) {
    labels.set(id, id)
  }

  // Iterate label propagation (max 20 rounds to prevent infinite loops)
  const MAX_ROUNDS = 20
  for (let round = 0; round < MAX_ROUNDS; round++) {
    let changed = false

    // Process nodes in shuffled order (deterministic shuffle by node id hash)
    const ordered = [...nodeIds].sort((a, b) => simpleHash(a + round) - simpleHash(b + round))

    for (const nodeId of ordered) {
      const outEdges = graph.edges.get(nodeId) ?? []
      if (outEdges.length === 0) continue

      // Count neighbor labels weighted by affinity
      const labelWeights = new Map<NodeId, number>()
      for (const edge of outEdges) {
        const neighborLabel = labels.get(edge.toId)
        if (!neighborLabel) continue

        const affinity = armAffinity(nodeId, edge.toId, graph)
        if (affinity < MEMORY_CONFIG.ARM_AFFINITY_THRESHOLD) continue

        labelWeights.set(
          neighborLabel,
          (labelWeights.get(neighborLabel) ?? 0) + affinity,
        )
      }

      // Also check incoming edges
      for (const [fromId, edges] of graph.edges) {
        for (const edge of edges) {
          if (edge.toId === nodeId) {
            const neighborLabel = labels.get(fromId)
            if (!neighborLabel) continue

            const affinity = armAffinity(nodeId, fromId, graph)
            if (affinity < MEMORY_CONFIG.ARM_AFFINITY_THRESHOLD) continue

            labelWeights.set(
              neighborLabel,
              (labelWeights.get(neighborLabel) ?? 0) + affinity,
            )
          }
        }
      }

      if (labelWeights.size === 0) continue

      // Adopt highest-weight label
      let bestLabel = labels.get(nodeId)!
      let bestWeight = 0
      for (const [label, weight] of labelWeights) {
        if (weight > bestWeight) {
          bestLabel = label
          bestWeight = weight
        }
      }

      if (bestLabel !== labels.get(nodeId)) {
        labels.set(nodeId, bestLabel)
        changed = true
      }
    }

    if (!changed) break
  }

  // Group nodes by label → form arms
  const communities = new Map<NodeId, NodeId[]>()
  for (const [nodeId, label] of labels) {
    const list = communities.get(label) ?? []
    list.push(nodeId)
    communities.set(label, list)
  }

  // Only communities with ≥2 members become arms
  const arms: MemArm[] = []
  for (const [label, members] of communities) {
    if (members.length < 2) continue

    // Compute arm depth: how many M-layers does this arm span?
    const layers = new Set<MLayer>()
    for (const nodeId of members) {
      const node = graph.nodes.get(nodeId)
      if (node) layers.add(node.cachedLayer)
    }

    arms.push({
      id:        `arm_${label}`,
      userId:    null,  // Amendment 3: R1 pure — caller stamps real userId after return (A6)
      label:     null,  // semantic label assigned later by Present State
      nodeIds:   members,
      depth:     layers.size,
      updatedAt: Date.now(),
    })
  }

  return arms
}

// ─── Shared arm weight modifier ───────────────────────────────────────────────
// §5: traversal amplified within arms.
// If source and target are in the same arm, effective weight is multiplied.

export function sharedArmWeight(
  fromId: NodeId,
  toId: NodeId,
  arms: MemArm[],
): number {
  for (const arm of arms) {
    if (arm.nodeIds.includes(fromId) && arm.nodeIds.includes(toId)) {
      return MEMORY_CONFIG.SHARED_ARM_WEIGHT
    }
  }
  return 1.0  // no shared arm → no amplification
}

// ─── Arm merge detection ──────────────────────────────────────────────────────
// §5: arms can merge when cross-domain edge density exceeds threshold.
// Returns pairs of arm indices that should merge.

export function detectArmMerges(
  arms: MemArm[],
  graph: MemGraph,
): Array<{ armIdxA: number; armIdxB: number }> {
  const merges: Array<{ armIdxA: number; armIdxB: number }> = []

  for (let i = 0; i < arms.length; i++) {
    for (let j = i + 1; j < arms.length; j++) {
      const density = crossArmEdgeDensity(arms[i], arms[j], graph)
      // Merge threshold: if cross-arm density > 50% of within-arm density
      const withinA = withinArmEdgeDensity(arms[i], graph)
      const withinB = withinArmEdgeDensity(arms[j], graph)
      const minWithin = Math.min(withinA, withinB)

      if (minWithin > 0 && density / minWithin > 0.5) {
        merges.push({ armIdxA: i, armIdxB: j })
      }
    }
  }

  return merges
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function crossArmEdgeDensity(armA: MemArm, armB: MemArm, graph: MemGraph): number {
  const setA = new Set(armA.nodeIds)
  const setB = new Set(armB.nodeIds)
  let crossEdges = 0

  for (const nodeId of armA.nodeIds) {
    const edges = graph.edges.get(nodeId) ?? []
    for (const edge of edges) {
      if (setB.has(edge.toId)) crossEdges++
    }
  }
  for (const nodeId of armB.nodeIds) {
    const edges = graph.edges.get(nodeId) ?? []
    for (const edge of edges) {
      if (setA.has(edge.toId)) crossEdges++
    }
  }

  const possibleEdges = armA.nodeIds.length * armB.nodeIds.length * 2
  return possibleEdges > 0 ? crossEdges / possibleEdges : 0
}

function withinArmEdgeDensity(arm: MemArm, graph: MemGraph): number {
  const nodeSet = new Set(arm.nodeIds)
  let internalEdges = 0

  for (const nodeId of arm.nodeIds) {
    const edges = graph.edges.get(nodeId) ?? []
    for (const edge of edges) {
      if (nodeSet.has(edge.toId)) internalEdges++
    }
  }

  const possibleEdges = arm.nodeIds.length * (arm.nodeIds.length - 1)
  return possibleEdges > 0 ? internalEdges / possibleEdges : 0
}

function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0
  }
  return hash
}
