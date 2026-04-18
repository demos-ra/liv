// @liv-standard v1.5
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.8-artifact-decode
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  MemGraph            F-memory/R0
//   W-ATOM  MemNode             F-memory/R0
//   W-ATOM  MemEdge             F-memory/R0
//   W-ATOM  MemArm              F-memory/R0
//   W-ATOM  MLayer              F-memory/R0
//   W-ATOM  EdgePrimitiveType   F-memory/R0
//   W-ATOM  ScopedGraphSet      F-memory/R0
//   W-ATOM  DecodeOutput        F-codec/R0
//   W-ATOM  RelationType        F-codec/R0
//   W-ATOM  ARTIFACT_PREFIX     F-codec/R0
//   W-ATOM  ARTIFACT_DATA_PREFIX F-codec/R0
//   W-ATOM  FrameworkMode       F-codec/R0
// wires-out:  none (consumed by R2 codec-orchestrate and R1 codec-decode-render)
// deps:
//   R0  ../../F-memory/config/memory-types
//   R0  ../config/codec-decode-types
//   R0  ../config/codec-artifact-types
// validated:  pending

// Decode classifier — the read side of the codec.
// R1: pure function. No I/O, no side effects.
// CA8: graph is context — classifications derived from topology alone.
// CA5: observable transition — same graph = same output, deterministic.

import type {
  MemGraph,
  MemNode,
  MemEdge,
  MemArm,
  MLayer,
  EdgePrimitiveType,
  ScopedGraphSet,
} from '@/features/F-memory/config/memory-types'

import type {
  DecodeOutput,
  RelationType,
  DecodedStructure,
} from '../config/codec-decode-types'

import { ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX } from '../config/codec-artifact-types'
import type { FrameworkMode } from '../config/codec-module-types'

// ─── Primitive → Relation mapping ────────────────────────────────────────────
// A6: declared at module scope, deterministic map.
// Maps write primitives to semantic relation types.

function mapPrimitiveToRelation(pt: EdgePrimitiveType | null): RelationType {
  switch (pt) {
    case 'relate':      return 'depends-on'
    case 'anchor':      return 'derived-from'
    case 'restructure': return 'contradicts'
    case 'reinforce':   return 'supports'
    case 'suppress':    return 'contradicts'
    case null:          return 'associated'
  }
}

// ─── Graph Statistics ────────────────────────────────────────────────────────
// Computed once at the top of classifyGraph. Mean and σ of incoming edge weights.

type GraphStats = {
  incomingWeightMean: number
  incomingWeightStdDev: number
}

function computeGraphStats(incomingEdges: Map<string, MemEdge[]>): GraphStats {
  // Collect total incoming weight per node
  const totals: number[] = []
  for (const edges of incomingEdges.values()) {
    let sum = 0
    for (const e of edges) sum += e.weight
    totals.push(sum)
  }

  if (totals.length === 0) {
    return { incomingWeightMean: 0, incomingWeightStdDev: 0 }
  }

  let sum = 0
  for (const t of totals) sum += t
  const mean = sum / totals.length

  let variance = 0
  for (const t of totals) variance += (t - mean) * (t - mean)
  variance /= totals.length

  return {
    incomingWeightMean: mean,
    incomingWeightStdDev: Math.sqrt(variance),
  }
}

// ─── Reverse Index ───────────────────────────────────────────────────────────
// Builds toId → MemEdge[] from MemGraph's fromId → MemEdge[] index.
// Single pass over all edge lists.

function buildIncomingIndex(graph: MemGraph): Map<string, MemEdge[]> {
  const incoming = new Map<string, MemEdge[]>()
  for (const edges of graph.edges.values()) {
    for (const edge of edges) {
      const list = incoming.get(edge.toId)
      if (list) {
        list.push(edge)
      } else {
        incoming.set(edge.toId, [edge])
      }
    }
  }
  return incoming
}

// ─── Degree ──────────────────────────────────────────────────────────────────
// Total degree = outgoing + incoming.

function nodeDegree(
  nodeId: string,
  graph: MemGraph,
  incoming: Map<string, MemEdge[]>,
): number {
  const outCount = graph.edges.get(nodeId)?.length ?? 0
  const inCount = incoming.get(nodeId)?.length ?? 0
  return outCount + inCount
}

// ─── Merge Graphs ────────────────────────────────────────────────────────────
// User graph takes priority. Global fills in via fallthrough read.
// Returns a single merged view — nodes and edges combined, user wins on conflict.

function mergeGraphs(scoped: ScopedGraphSet): MemGraph {
  const nodes = new Map<string, MemNode>()
  const edges = new Map<string, MemEdge[]>()

  // Global first (lower priority)
  for (const [id, node] of scoped.global.nodes) nodes.set(id, node)
  for (const [fromId, edgeList] of scoped.global.edges) {
    edges.set(fromId, [...edgeList])
  }

  // User overwrites (higher priority)
  for (const [id, node] of scoped.user.nodes) nodes.set(id, node)
  for (const [fromId, edgeList] of scoped.user.edges) {
    const existing = edges.get(fromId)
    if (existing) {
      // Deduplicate by toId — user edge wins
      const userToIds = new Set(edgeList.map(e => e.toId))
      const merged = edgeList.concat(existing.filter(e => !userToIds.has(e.toId)))
      edges.set(fromId, merged)
    } else {
      edges.set(fromId, [...edgeList])
    }
  }

  return { nodes, edges }
}

// ─── Classify Graph ──────────────────────────────────────────────────────────
// Core classifier. Pure function. Same input = same output.
// CA8: graph topology is the only input — no LLM, no heuristics.
// CA5: every classification is a deterministic structural read.
//
// Algorithm:
// 1. Merge scoped graphs (user priority, global fallthrough)
// 2. Build reverse index once
// 3. Compute graph statistics once
// 4. Five ordered passes: entities → relations → claims → sequences → tensions

export function classifyGraph(
  graphs: ScopedGraphSet,
  userArms: MemArm[],
  globalArms: MemArm[],
): DecodeOutput {
  // A3: typed boundary — takes atoms, returns atoms.

  const merged = mergeGraphs(graphs)
  const incoming = buildIncomingIndex(merged)
  const stats = computeGraphStats(incoming)

  // Build arm membership: nodeId → armId
  const nodeToArm = new Map<string, string>()
  // Global first, user overwrites
  for (const arm of globalArms) {
    for (const nid of arm.nodeIds) nodeToArm.set(nid, arm.id)
  }
  for (const arm of userArms) {
    for (const nid of arm.nodeIds) nodeToArm.set(nid, arm.id)
  }

  // ── Pass 1: Entities ───────────────────────────────────────────────────────
  // Node with cachedLayer ≤ 2 and degree ≥ 2.
  // Energy = sum of incoming edge weights.
  // 6.8: skip artifact nodes and artifact-data companion nodes — they have their own pass.

  const entityIds = new Set<string>()
  const entities: Extract<DecodedStructure, { category: 'entity' }>[] = []

  for (const [nodeId, node] of merged.nodes) {
    if (node.cachedLayer > 2) continue
    if (nodeDegree(nodeId, merged, incoming) < 2) continue
    if (node.content.startsWith(ARTIFACT_PREFIX)) continue
    if (node.content.startsWith(ARTIFACT_DATA_PREFIX)) continue

    entityIds.add(nodeId)

    const inEdges = incoming.get(nodeId) ?? []
    let energy = 0
    for (const e of inEdges) energy += e.weight

    entities.push({
      category: 'entity',
      nodeId,
      name: node.content,
      layer: node.cachedLayer,
      energy,
    })
  }

  // ── Pass 2: Relations ──────────────────────────────────────────────────────
  // Edge between two Entity nodes. Type from primitiveType.

  const relations: Extract<DecodedStructure, { category: 'relation' }>[] = []

  for (const edgeList of merged.edges.values()) {
    for (const edge of edgeList) {
      if (!entityIds.has(edge.fromId) || !entityIds.has(edge.toId)) continue

      relations.push({
        category: 'relation',
        fromNodeId: edge.fromId,
        toNodeId: edge.toId,
        relationType: mapPrimitiveToRelation(edge.primitiveType),
        weight: edge.weight,
        primitiveType: edge.primitiveType,
      })
    }
  }

  // ── Pass 3: Claims ─────────────────────────────────────────────────────────
  // Entity whose incoming energy exceeds μ + 1σ.
  // Confidence = reinforce energy / total incoming energy.

  const claims: Extract<DecodedStructure, { category: 'claim' }>[] = []
  const claimThreshold = stats.incomingWeightMean + stats.incomingWeightStdDev

  for (const entity of entities) {
    const inEdges = incoming.get(entity.nodeId) ?? []
    if (inEdges.length === 0) continue

    // Total incoming weight
    let totalIncoming = 0
    for (const e of inEdges) totalIncoming += e.weight
    if (totalIncoming <= claimThreshold) continue

    // Reinforcing energy and count
    let reinforceEnergy = 0
    let supportCount = 0
    for (const e of inEdges) {
      if (e.primitiveType === 'reinforce') {
        reinforceEnergy += e.weight
        supportCount++
      }
    }

    const confidence = totalIncoming > 0 ? reinforceEnergy / totalIncoming : 0

    claims.push({
      category: 'claim',
      nodeId: entity.nodeId,
      name: entity.name,
      confidence,
      supportCount,
      energy: entity.energy,
    })
  }

  // ── Pass 4: Sequences ──────────────────────────────────────────────────────
  // Directed chains of ≥ 2 edges with chronological createdAt within same arm.
  // Build chains by following outgoing edges that stay in the same arm and
  // maintain chronological order.

  const sequences: Extract<DecodedStructure, { category: 'sequence' }>[] = []
  const sequenceVisited = new Set<string>()

  // Only consider edges between entities with createdAt, grouped by arm
  type ArmEdge = MemEdge & { createdAt: number }
  const armEdges = new Map<string, ArmEdge[]>()

  for (const edgeList of merged.edges.values()) {
    for (const edge of edgeList) {
      if (!entityIds.has(edge.fromId) || !entityIds.has(edge.toId)) continue
      if (edge.createdAt == null) continue

      const fromArm = nodeToArm.get(edge.fromId)
      const toArm = nodeToArm.get(edge.toId)
      if (fromArm == null || fromArm !== toArm) continue

      const list = armEdges.get(fromArm)
      const armEdge = edge as ArmEdge
      if (list) {
        list.push(armEdge)
      } else {
        armEdges.set(fromArm, [armEdge])
      }
    }
  }

  // For each arm, build adjacency and find chains
  for (const [armId, edges] of armEdges) {
    // Sort edges by createdAt for deterministic chain building
    edges.sort((a, b) => a.createdAt - b.createdAt)

    // Outgoing map within this arm: fromId → edges sorted by createdAt
    const armOutgoing = new Map<string, ArmEdge[]>()
    for (const e of edges) {
      const list = armOutgoing.get(e.fromId)
      if (list) list.push(e)
      else armOutgoing.set(e.fromId, [e])
    }

    // Find chain starts: entity nodes with outgoing arm-edges that aren't
    // the target of another arm-edge (or haven't been visited)
    const hasIncoming = new Set<string>()
    for (const e of edges) hasIncoming.add(e.toId)

    const starts = new Set<string>()
    for (const e of edges) {
      if (!hasIncoming.has(e.fromId)) starts.add(e.fromId)
    }
    // If all nodes have incoming (cycle), pick earliest-created edge's fromId
    if (starts.size === 0 && edges.length > 0) {
      starts.add(edges[0].fromId)
    }

    for (const startId of starts) {
      if (sequenceVisited.has(startId)) continue

      const chain: string[] = [startId]
      let current = startId
      let lastTime = -Infinity

      while (true) {
        const outEdges = armOutgoing.get(current)
        if (!outEdges) break

        // Pick the first chronologically valid outgoing edge
        let found: ArmEdge | null = null
        for (const e of outEdges) {
          if (e.createdAt >= lastTime && !sequenceVisited.has(e.toId)) {
            found = e
            break
          }
        }
        if (!found) break

        chain.push(found.toId)
        sequenceVisited.add(found.toId)
        lastTime = found.createdAt
        current = found.toId
      }

      if (chain.length < 3) continue // ≥ 2 edges = ≥ 3 nodes

      // Mark all as visited
      for (const nid of chain) sequenceVisited.add(nid)

      const labels = chain.map(nid => merged.nodes.get(nid)?.content ?? nid)

      sequences.push({
        category: 'sequence',
        nodeIds: chain,
        labels,
        direction: 'forward',
        armId,
      })
    }
  }

  // ── Pass 5: Tensions ───────────────────────────────────────────────────────
  // Entity pairs with contradictory primitives between them, or both high-energy
  // with a weak/missing bridge.

  const tensions: Extract<DecodedStructure, { category: 'tension' }>[] = []
  const tensionSeen = new Set<string>()

  // Build entity energy lookup for strong-node/weak-bridge detection
  const entityEnergy = new Map<string, number>()
  for (const e of entities) entityEnergy.set(e.nodeId, e.energy)

  // High energy threshold: entities with energy > μ + 1σ (same as claim threshold)
  const highEnergyThreshold = claimThreshold

  // Check all entity pairs connected by edges
  // First: contradictory primitive pairs
  const pairEdges = new Map<string, MemEdge[]>()
  for (const edgeList of merged.edges.values()) {
    for (const edge of edgeList) {
      if (!entityIds.has(edge.fromId) || !entityIds.has(edge.toId)) continue
      // Canonical pair key (sorted for bidirectional lookup)
      const pairKey = edge.fromId < edge.toId
        ? `${edge.fromId}|${edge.toId}`
        : `${edge.toId}|${edge.fromId}`
      const list = pairEdges.get(pairKey)
      if (list) list.push(edge)
      else pairEdges.set(pairKey, [edge])
    }
  }

  for (const [pairKey, edges] of pairEdges) {
    if (tensionSeen.has(pairKey)) continue

    const primitives = new Set<EdgePrimitiveType | null>()
    for (const e of edges) primitives.add(e.primitiveType)

    // Contradictory: has both reinforcing and suppressing/restructuring primitives
    const hasPositive = primitives.has('reinforce') || primitives.has('relate') || primitives.has('anchor')
    const hasNegative = primitives.has('suppress') || primitives.has('restructure')

    if (hasPositive && hasNegative) {
      tensionSeen.add(pairKey)
      const [idA, idB] = pairKey.split('|')
      const nodeA = merged.nodes.get(idA)
      const nodeB = merged.nodes.get(idB)
      if (!nodeA || !nodeB) continue

      let bridgeWeight = 0
      for (const e of edges) bridgeWeight += e.weight

      tensions.push({
        category: 'tension',
        nodeIdA: idA,
        nodeIdB: idB,
        nameA: nodeA.content,
        nameB: nodeB.content,
        bridgeWeight,
      })
    }
  }

  // Strong-node/weak-bridge: both entities high-energy, but weak or no connection
  const entityList = entities.filter(e => e.energy > highEnergyThreshold)
  for (let i = 0; i < entityList.length; i++) {
    for (let j = i + 1; j < entityList.length; j++) {
      const a = entityList[i]
      const b = entityList[j]
      const pairKey = a.nodeId < b.nodeId
        ? `${a.nodeId}|${b.nodeId}`
        : `${b.nodeId}|${a.nodeId}`

      if (tensionSeen.has(pairKey)) continue

      const edges = pairEdges.get(pairKey)
      let bridgeWeight = 0
      if (edges) {
        for (const e of edges) bridgeWeight += e.weight
      }

      // Weak bridge: total weight between them is below graph mean
      if (bridgeWeight < stats.incomingWeightMean) {
        tensionSeen.add(pairKey)
        tensions.push({
          category: 'tension',
          nodeIdA: a.nodeId,
          nodeIdB: b.nodeId,
          nameA: a.name,
          nameB: b.name,
          bridgeWeight,
        })
      }
    }
  }

  // ── Pass 6: Artifacts ──────────────────────────────────────────────────────
  // 6.8: Nodes whose content starts with ARTIFACT_PREFIX.
  // Parse moduleId, version, title from content string.
  // Find companion data node (ARTIFACT_DATA_PREFIX) via outgoing edges for field values.

  const artifacts: Extract<DecodedStructure, { category: 'artifact' }>[] = []

  for (const [nodeId, node] of merged.nodes) {
    if (!node.content.startsWith(ARTIFACT_PREFIX)) continue

    // Parse: "[artifact:{moduleId}:{version}] {title}"
    const parsed = parseArtifactContent(node.content)
    if (!parsed) continue

    // Find companion data node via outgoing edges
    const fields = findArtifactFields(nodeId, parsed.moduleId, parsed.version, merged)

    // Determine mode: follow categorical edge to mode node, or fallback to static map
    const mode = resolveArtifactMode(nodeId, parsed.moduleId, merged)

    // Energy: sum of incoming edge weights
    const inEdges = incoming.get(nodeId) ?? []
    let energy = 0
    for (const e of inEdges) energy += e.weight

    artifacts.push({
      category: 'artifact',
      nodeId,
      moduleId: parsed.moduleId,
      version:  parsed.version,
      title:    parsed.title,
      mode,
      fields,
      energy,
    })
  }

  return {
    entities,
    relations,
    claims,
    sequences,
    tensions,
    artifacts,
  }
}

// ─── Artifact Helpers ────────────────────────────────────────────────────────

/**
 * Parse artifact content string: "[artifact:{moduleId}:{version}] {title}"
 */
function parseArtifactContent(
  content: string,
): { moduleId: string; version: number; title: string } | null {
  // Format: "[artifact:{moduleId}:{version}] {title}"
  const closeBracket = content.indexOf(']')
  if (closeBracket === -1) return null

  const inner = content.slice(ARTIFACT_PREFIX.length, closeBracket)
  const colonIdx = inner.lastIndexOf(':')
  if (colonIdx === -1) return null

  const moduleId = inner.slice(0, colonIdx)
  const version = parseInt(inner.slice(colonIdx + 1), 10)
  if (isNaN(version) || !moduleId) return null

  const title = content.slice(closeBracket + 1).trimStart()
  return { moduleId, version, title }
}

/**
 * Find companion data node fields via outgoing edges from artifact node.
 * Companion content format: "[artifact-data:{moduleId}:{version}] {JSON}"
 */
function findArtifactFields(
  artifactNodeId: string,
  moduleId: string,
  version: number,
  merged: MemGraph,
): Record<string, string> {
  const prefix = `${ARTIFACT_DATA_PREFIX}${moduleId}:${version}]`
  const outEdges = merged.edges.get(artifactNodeId) ?? []

  for (const edge of outEdges) {
    const targetNode = merged.nodes.get(edge.toId)
    if (!targetNode) continue
    if (!targetNode.content.startsWith(prefix)) continue

    // Extract JSON after "] "
    const jsonStr = targetNode.content.slice(prefix.length).trimStart()
    try {
      const parsed = JSON.parse(jsonStr)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, string>
      }
    } catch {
      // Malformed JSON — return empty
    }
  }

  // Also check all nodes (companion may not be directly linked yet — physics may
  // have created the edge via bind, not via direct outgoing edge from artifact)
  for (const [_, node] of merged.nodes) {
    if (!node.content.startsWith(prefix)) continue
    const jsonStr = node.content.slice(prefix.length).trimStart()
    try {
      const parsed = JSON.parse(jsonStr)
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed as Record<string, string>
      }
    } catch {
      // Malformed JSON — skip
    }
  }

  return {}
}

// Static moduleId → mode fallback map for known modules.
const MODULE_MODE_MAP: Record<string, FrameworkMode> = {
  'build':     'generative',
  'discovery': 'epistemic',
  'planning':  'structural',
}

/**
 * Resolve artifact mode from graph topology or static fallback.
 * R1: pure — no registry access. Reads mode from graph edges to global mode nodes.
 */
function resolveArtifactMode(
  artifactNodeId: string,
  moduleId: string,
  merged: MemGraph,
): FrameworkMode {
  // Check outgoing edges for connection to a global mode node.
  // Mode node IDs follow convention: 'global-seed-mode-{modeName}' (from 6.1 seed).
  const outEdges = merged.edges.get(artifactNodeId) ?? []
  for (const edge of outEdges) {
    const idMatch = edge.toId.match(/global-seed-mode-(epistemic|structural|generative|verificative)$/)
    if (idMatch) return idMatch[1] as FrameworkMode
  }

  // Fallback: static map
  return MODULE_MODE_MAP[moduleId] ?? 'generative'
}
