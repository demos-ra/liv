// @liv-standard v1.5.1
// [F-codec/R1]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.8-artifact-decode, 4b-nodeid-propagation, lm-v2-2-shot5-fix-2, cog-v1.3-symmetry
// slice:      F-codec
// layer:      R1
// wires-in:
//   W-ATOM  NodeId                    core/R5 (primitives)
//   W-ATOM  MemGraph                  F-memory/R3
//   W-ATOM  MemNode                   F-memory/R3
//   W-ATOM  MemEdge                   F-memory/R3
//   W-ATOM  MemArm                    F-memory/R3
//   W-ATOM  MLayer                    F-memory/R3
//   W-ATOM  EdgePrimitiveType         F-memory/R3
//   W-ATOM  ScopedGraphSet            F-memory/R3
//   W-ATOM  DecodeOutput              F-codec/R0
//   W-ATOM  RelationType              F-codec/R0
//   W-ATOM  ARTIFACT_PREFIX           F-codec/R0
//   W-ATOM  ARTIFACT_DATA_PREFIX      F-codec/R0
//   W-ATOM  FrameworkMode             F-codec/R0
//   W-ATOM  WorkOutputDecodeResult    F-codec/R0 (Cognitive v1.3 §10.1)
//   W-ATOM  WorkOutputShapeRegistry   F-codec/R0 (Cognitive v1.3 §10.1)
// wires-out:  none (consumed by R2 codec-orchestrate, R3 codec-contract, R1 codec-decode-render)
// deps:
//   R3  ../../F-memory/contract/memory-contract
//   R0  ../config/codec-decode-types
//   R0  ../config/codec-artifact-types
//   R5  @/core/types/primitives
// validated:  pending

// Decode classifier — the read side of the codec.
// R1: pure function. No I/O, no side effects.
// CA5: graph is context — classifications derived from topology alone.
// CA4: observable transition — same graph = same output, deterministic.
// 4b-nodeid-propagation: NodeId flows from F-memory atoms through F-codec
//     internal maps and into DecodedStructure. Local helpers retyped to
//     NodeId; internal incoming/pairEdges/armEdges maps keyed by NodeId.

import type {
  MemGraph,
  MemNode,
  MemEdge,
  MemArm,
  MLayer,
  EdgePrimitiveType,
  ScopedGraphSet,
} from '@/features/F-memory/contract/memory-contract'

import type {
  DecodeOutput,
  RelationType,
  DecodedStructure,
  WorkOutputDecodeResult,
} from '../config/codec-decode-types'

import { WorkOutputShapeRegistry } from '../config/codec-decode-types'

import { ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX } from '../config/codec-artifact-types'
import type { FrameworkMode } from '../config/codec-module-types'
import type { NodeId } from '@/core/types/primitives'

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

function computeGraphStats(incomingEdges: Map<NodeId, MemEdge[]>): GraphStats {
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

function buildIncomingIndex(graph: MemGraph): Map<NodeId, MemEdge[]> {
  const incoming = new Map<NodeId, MemEdge[]>()
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
  nodeId: NodeId,
  graph: MemGraph,
  incoming: Map<NodeId, MemEdge[]>,
): number {
  const outCount = graph.edges.get(nodeId)?.length ?? 0
  const inCount = incoming.get(nodeId)?.length ?? 0
  return outCount + inCount
}

// ─── Merge Graphs ────────────────────────────────────────────────────────────
// User graph takes priority. Global fills in via fallthrough read.
// Returns a single merged view — nodes and edges combined, user wins on conflict.

function mergeGraphs(scoped: ScopedGraphSet): MemGraph {
  const nodes = new Map<NodeId, MemNode>()
  const edges = new Map<NodeId, MemEdge[]>()

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
// CA5: graph topology is the only input — no LLM, no heuristics.
// CA4: every classification is a deterministic structural read.
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
  const nodeToArm = new Map<NodeId, string>()
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

  const entityIds = new Set<NodeId>()
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
  const sequenceVisited = new Set<NodeId>()

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
    const armOutgoing = new Map<NodeId, ArmEdge[]>()
    for (const e of edges) {
      const list = armOutgoing.get(e.fromId)
      if (list) list.push(e)
      else armOutgoing.set(e.fromId, [e])
    }

    // Find chain starts: entity nodes with outgoing arm-edges that aren't
    // the target of another arm-edge (or haven't been visited)
    const hasIncoming = new Set<NodeId>()
    for (const e of edges) hasIncoming.add(e.toId)

    const starts = new Set<NodeId>()
    for (const e of edges) {
      if (!hasIncoming.has(e.fromId)) starts.add(e.fromId)
    }
    // If all nodes have incoming (cycle), pick earliest-created edge's fromId
    if (starts.size === 0 && edges.length > 0) {
      starts.add(edges[0].fromId)
    }

    for (const startId of starts) {
      if (sequenceVisited.has(startId)) continue

      const chain: NodeId[] = [startId]
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
  const entityEnergy = new Map<NodeId, number>()
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
      // brand: locally minted — pairKey is a composite of NodeIds joined by '|',
      // split-and-rebrand is an F-codec-internal decomposition of an existing
      // NodeId pair, not a new atom construction.
      const [idAStr, idBStr] = pairKey.split('|')
      const idA = idAStr as NodeId
      const idB = idBStr as NodeId
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
  artifactNodeId: NodeId,
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
  artifactNodeId: NodeId,
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

// ─── Work-Output Decode (Cognitive v1.3 §10.4 — CA6 + CA7) ───────────────────
// Pure structural decode of module work-output to typed per-mode shape.
// B-direction symmetric to A-direction encode at R2 (encodeLLM).
//
// CA4 purity: no I/O, no LLM, no graph mutation. Determined by (output, mode).
// CA6 coverage: every mode in FrameworkMode has a registry entry (compile-time
//      enforced via Record<FrameworkMode, ...> typing at R0). Returned
//      decodedFields keys ⊇ registry.expectedFields for declared mode.
// CA7 XOR pairing: parseFailureFlag === true ↔ fallbackBasis !== null,
//      symmetric to CA3 encode fallback (anchor on classify failure;
//      normalized-content-slice on label failure).

/**
 * Extract a field from an unknown source object as a string.
 *
 * Returns { value, missing } where:
 * - missing = true iff the key is absent OR the value is null/undefined.
 * - value is a string coercion of the underlying type:
 *     string → as-is
 *     number/boolean → String(v)
 *     array → newline-joined (string elements as-is, others JSON.stringify'd)
 *     object → JSON.stringify
 *
 * Coercion rules are deterministic per CA4; pure per R1 layer discipline.
 */
function extractField(
  source: Record<string, unknown>,
  key: string,
): { value: string; missing: boolean } {
  if (!(key in source)) return { value: '', missing: true }
  const raw = source[key]
  if (raw === null || raw === undefined) return { value: '', missing: true }
  if (typeof raw === 'string') return { value: raw, missing: false }
  if (typeof raw === 'number' || typeof raw === 'boolean') {
    return { value: String(raw), missing: false }
  }
  if (Array.isArray(raw)) {
    return {
      value: raw
        .map((el) => (typeof el === 'string' ? el : JSON.stringify(el)))
        .join('\n'),
      missing: false,
    }
  }
  if (typeof raw === 'object') {
    return { value: JSON.stringify(raw), missing: false }
  }
  return { value: String(raw), missing: false }
}

/**
 * Decode a module work-output to its typed per-mode shape.
 *
 * Signature: (output, mode) → WorkOutputDecodeResult per spec §5.2 + Cognitive
 * v1.3 §10.1. Pure function; consumed by post-Sprint-3 callers (Verification +
 * Research domain frameworks at Sprints 4/5 land their concrete pairing input
 * atoms; this function is generative scaffolding ahead of consumer arrival).
 *
 * Failure semantics (CA7 XOR):
 * - Total failure (envelope is not an object): every expectedField defaults
 *   to '' with parseFailureFlag = true; fallbackBasis declares envelope failure.
 * - Partial failure (some expectedFields missing): present fields decode as-is,
 *   missing fields default to '' with parseFailureFlag = true; fallbackBasis
 *   enumerates missing fields.
 * - Clean parse: every expectedField present and non-null; parseFailureFlag =
 *   false; fallbackBasis = null.
 *
 * pairValid (on symmetricToInput) is true iff the *data contract* held —
 * envelope was an object AND every expectedField decoded without fallback.
 * moduleId presence does not affect pairValid per §10.1: pairing is between
 * inputAtomRef and output-data-shape, not module identity.
 */
export function decodeWorkOutput(
  output: unknown,
  mode:   FrameworkMode,
): WorkOutputDecodeResult {
  const registryEntry = WorkOutputShapeRegistry[mode]

  // Top-level envelope shape check.
  const isObjectEnvelope =
    output !== null && typeof output === 'object' && !Array.isArray(output)
  const source = isObjectEnvelope ? (output as Record<string, unknown>) : {}

  // moduleId discovery from envelope (Decision-D below): extract opportunistic;
  // missing moduleId contributes to parseFailureFlag but not to pairValid.
  const moduleIdExtract = extractField(source, 'moduleId')
  const moduleId = moduleIdExtract.value

  // Per-field extraction across registry.expectedFields. Missing fields fill
  // with '' (declared fallback; preserves Record<string, string> shape per
  // §10.1 atom declaration — no undefined values in decodedFields).
  const decodedFields: Record<string, string> = {}
  const missingFields: string[] = []
  for (const field of registryEntry.expectedFields) {
    const { value, missing } = extractField(source, field)
    decodedFields[field] = value
    if (missing) missingFields.push(field)
  }

  // CA7 composition. parseFailureFlag = true if envelope failed OR moduleId
  // missing OR any expectedField missing.
  const envelopeFailure = !isObjectEnvelope
  const moduleIdFailure = moduleIdExtract.missing
  const fieldsFailure   = missingFields.length > 0
  const parseFailureFlag = envelopeFailure || moduleIdFailure || fieldsFailure

  // CA7 XOR fallbackBasis: declared string iff parseFailureFlag, null otherwise.
  let fallbackBasis: string | null
  if (parseFailureFlag) {
    if (envelopeFailure) {
      fallbackBasis =
        'mode-specific empty defaults applied: input was not an object envelope'
    } else if (moduleIdFailure && fieldsFailure) {
      fallbackBasis =
        `partial-parse with missing moduleId and ${missingFields.length} ` +
        `expectedField(s) filled by registry default: ${missingFields.join(', ')}`
    } else if (moduleIdFailure) {
      fallbackBasis =
        'partial-parse with missing moduleId filled by registry default'
    } else {
      fallbackBasis =
        `partial-parse with missing fields filled by registry default: ` +
        `${missingFields.join(', ')}`
    }
  } else {
    fallbackBasis = null
  }

  // pairValid: data-contract validity only. moduleId-missing does not
  // invalidate pairing per §10.1 (pairing is inputAtomRef ↔ output-shape).
  const pairValid = !envelopeFailure && !fieldsFailure

  return {
    mode,
    moduleId,
    decodedFields,
    symmetricToInput: {
      inputAtomRef: registryEntry.pairingInputAtom,
      pairValid,
    },
    parseFailureFlag,
    fallbackBasis,
  }
}
