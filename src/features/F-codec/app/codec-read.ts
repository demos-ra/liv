// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.11-artifact-read, lm-v2-2-shot5-fix-2
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-INJECT classifyGraph()    ←  F-codec/R1 (codec-decode)
//   W-HOOK   getGlobalGraph()   ←  F-memory/R3
//   W-HOOK   getUserGraph()     ←  F-memory/R3
//   W-HOOK   getGlobalArms()    ←  F-memory/R3
//   W-HOOK   getUserArms()      ←  F-memory/R3
//   W-ATOM   ScopedGraphSet     ←  F-memory/R3
//   W-ATOM   DecodeOutput       ←  F-codec/R0
//   W-ATOM   FrameworkMode, ModuleArtifactSummary, ARTIFACT_ACTIVE_THRESHOLD_MS  ←  F-codec/R0
//   W-ATOM   ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX  ←  F-codec/R0
//   W-INJECT getModule()        ←  F-codec/R2 (codec-registry)
// wires-out:
//   W-INJECT getDecodedState()      →  F-codec/R3 (codec-contract)
//   W-INJECT getArtifactsForMode()  →  F-codec/R3 (codec-contract)
// deps:
//   R0  ../config/codec-decode-types
//   R0  ../config/codec-module-types
//   R0  ../config/codec-artifact-types
//   R3  ../../F-memory/contract/memory-contract
//   R1  ../domain/codec-decode
//   R2  ./codec-registry
//   R3  @/features/F-memory/contract/memory-contract
// validated:  pending

// Read-only decode surface.
// R2: orchestration — assembles graph set, delegates to R1 classifier.
// A3: typed boundary — takes userId, returns DecodeOutput atom.
// No encode, no LLM, no mutation. Pure graph read → classify.

import type { ScopedGraphSet } from '@/features/F-memory/contract/memory-contract'
import type { DecodeOutput } from '../config/codec-decode-types'
import { classifyGraph } from '../domain/codec-decode'
import {
  getGlobalGraph,
  getUserGraph,
  getGlobalArms,
  getUserArms,
} from '@/features/F-memory/contract/memory-contract'

// ─── getDecodedState ─────────────────────────────────────────────────────────
// Returns the full classified graph for a user without triggering encode.
// A2: depends on F-memory (lower) and F-codec/R1 (same slice, lower layer).
// A3: typed boundary — DecodeOutput is an atom from F-codec/R0.

export function getDecodedState(userId: string): DecodeOutput {
  const graphs: ScopedGraphSet = {
    user:   getUserGraph(userId),
    global: getGlobalGraph(),
  }
  const userArms   = getUserArms(userId)
  const globalArms = getGlobalArms()

  return classifyGraph(graphs, userArms, globalArms)
}

// ─── getArtifactsForMode (6.11) ──────────────────────────────────────────────
// Returns artifact summaries for a given framework mode, sorted by energy desc.
// Reads user graph, identifies artifact nodes by content prefix convention (6.7),
// parses companion data nodes, computes status from topology.

import type { FrameworkMode, ModuleArtifactSummary } from '../config/codec-module-types'
import { ARTIFACT_ACTIVE_THRESHOLD_MS } from '../config/codec-module-types'
import { ARTIFACT_PREFIX, ARTIFACT_DATA_PREFIX } from '../config/codec-artifact-types'
import type { MemNode, MemGraph } from '@/features/F-memory/contract/memory-contract'
import { getModule } from './codec-registry'

export function getArtifactsForMode(
  mode:   string,
  userId: string,
): ModuleArtifactSummary[] {
  const module = getModule(mode as FrameworkMode)
  if (!module) return []

  const userGraph = getUserGraph(userId)
  const now = Date.now()

  // 1. Find artifact nodes matching this module's ID
  const artifactNodes: MemNode[] = []
  const dataNodes = new Map<string, string>()  // "moduleId:version" → JSON fields

  for (const node of userGraph.nodes.values()) {
    if (node.content.startsWith(ARTIFACT_PREFIX) && node.content.includes(module.id)) {
      artifactNodes.push(node)
    }
    if (node.content.startsWith(ARTIFACT_DATA_PREFIX) && node.content.includes(module.id)) {
      // Extract JSON fields from companion data node
      const jsonStart = node.content.indexOf('] ')
      if (jsonStart !== -1) {
        const key = node.content.slice(ARTIFACT_DATA_PREFIX.length, jsonStart)
        const jsonStr = node.content.slice(jsonStart + 2)
        dataNodes.set(key, jsonStr)
      }
    }
  }

  // 2. Build summaries
  const summaries: ModuleArtifactSummary[] = []

  for (const node of artifactNodes) {
    // Parse artifact prefix: [artifact:moduleId:version] title
    const closeBracket = node.content.indexOf('] ')
    if (closeBracket === -1) continue

    const prefix = node.content.slice(ARTIFACT_PREFIX.length, closeBracket)
    const parts = prefix.split(':')
    const moduleId = parts[0] ?? module.id
    const version = parts[1] ?? '1'
    const name = node.content.slice(closeBracket + 2)

    // Look up companion data node
    const dataKey = `${moduleId}:${version}`
    let fields: Record<string, string> = {}
    const dataJson = dataNodes.get(dataKey)
    if (dataJson) {
      try { fields = JSON.parse(dataJson) } catch { /* empty fields */ }
    }

    const status = deriveArtifactStatus(node, userGraph, now)
    const energy = node.lastTraversed ?? node.createdAt

    summaries.push({
      nodeId:    node.id,
      name,
      moduleId,
      mode:      module.mode,
      fields,
      energy,
      createdAt: node.createdAt,
      status,
    })
  }

  // 3. Sort by energy descending (most recently traversed first)
  summaries.sort((a, b) => b.energy - a.energy)

  return summaries
}

// ─── deriveArtifactStatus (R1-eligible pure function) ─────────────────────────
// Computes artifact status from graph topology. No I/O, no side effects.
// Archived: no recent traversal.
// Active: recent traversal + feeding forward into active work (relate edges to active nodes).
// Completed: recent traversal + not feeding forward.

export function deriveArtifactStatus(
  node:  MemNode,
  graph: MemGraph,
  now:   number,
): 'active' | 'completed' | 'archived' {
  const threshold = now - ARTIFACT_ACTIVE_THRESHOLD_MS

  // Archived: no recent traversal
  if (node.lastTraversed === null || node.lastTraversed < threshold) {
    return 'archived'
  }

  // Check outgoing relate edges for active forward references
  const outgoing = graph.edges.get(node.id) ?? []
  for (const edge of outgoing) {
    if (edge.primitiveType !== 'relate') continue
    const target = graph.nodes.get(edge.toId)
    if (!target) continue
    if (target.lastTraversed !== null && target.lastTraversed >= threshold) {
      return 'active'  // feeding forward into active work
    }
  }

  // Recent but not feeding forward
  return 'completed'
}
