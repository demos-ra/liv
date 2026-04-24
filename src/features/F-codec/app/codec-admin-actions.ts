// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.1-global-seed, 6.11-modules-for-client, 4b-nodeid-propagation
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  NodeId             core/R5 (primitives)
//   W-ATOM  GlobalSeedInput    F-codec/R0
//   W-ATOM  IngestionSource    F-codec/R0
//   W-ATOM  GlobalSeedNode     F-memory/R0 (via F-memory/R3)
//   W-INJECT normalizeLabel    F-codec/R1
//   W-INJECT seedGlobalNode    F-memory/R3
//   W-INJECT removeGlobalNode  F-memory/R3
//   W-INJECT seedAndTraverseGlobal F-memory/R3
// wires-out:  none (consumed by R4 API routes)
// deps:
//   R0  ../config/codec-admin-types
//   R1  ../domain/codec-label
//   R3  ../../F-memory/contract/memory-contract
//   R5  @/core/types/primitives
// validated:  pending

// Admin write operations — three actions on the global graph.
// R2: orchestration. Composes R1 pure functions and R3 contract calls.
// Moral principle: global graph contains only knowledge whose provenance
// is verifiable — admin-authored or externally sourced. No per-user content
// flows upward. All writes use userId: null.
// 4b-nodeid-propagation: `nodeId` synthesized from timestamp+random is a
//     locally-minted NodeId. Cast `as NodeId` with `// brand: locally minted`
//     at synthesis site. removeNode accepts NodeId — upstream HTTP route
//     brands raw body string at DELETE handler per amended Confirm 3.

import type { Result, NodeId } from '@/core/types/primitives'
import type { GlobalSeedInput, IngestionSource } from '../config/codec-admin-types'
import type { MemNode, MemEdge } from '@/features/F-memory/config/memory-types'
import type { GlobalSeedNode } from '@/features/F-memory/contract/memory-contract'
import { normalizeLabel } from '../domain/codec-label'
import {
  seedGlobalNode as persistSeed,
  removeGlobalNode as persistRemove,
  seedAndTraverseGlobal as _seedAndTraverseGlobal,
} from '@/features/F-memory/contract/memory-contract'

// ─── seedGlobalNode ───────────────────────────────────────────────────────────
// Admin authors a knowledge node directly into the global graph.
// A6: admin seeding is a direct graph write — not a traversal.
// No propagation, no sparsification, no activation.

export async function seedGlobalNode(input: GlobalSeedInput): Promise<Result<void>> {
  const label = normalizeLabel(input.label)
  const now = Date.now()
  // brand: locally minted — synthesized from timestamp+random inside F-codec admin
  const nodeId = `global-${now}-${Math.random().toString(36).slice(2, 8)}` as NodeId

  // A6: declared shape — MemNode with global defaults (M4, closure 0, asymmetry 0)
  const node: Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry'> = {
    id:            nodeId,
    userId:        null,
    content:       `${label}: ${input.content}`,
    embedding:     null,
    sourceText:    input.content,
    createdAt:     now,
    lastTraversed: null,
  }

  const edges: MemEdge[] = []

  // Optional: create edge to an existing node
  if (input.relatedTo) {
    edges.push({
      fromId:        nodeId,
      toId:          input.relatedTo,
      weight:        0.5,
      primitiveType: 'anchor',
      createdAt:     now,
      userId:        null,
    })
  }

  return persistSeed(node, edges)
}

// ─── ingestExternal ───────────────────────────────────────────────────────────
// Curated external source encoded into the global graph.
// Simpler path than LLM encode — admin provides label and content.
// Always anchor primitive (seeding new knowledge).
// URL fetching is R4 I/O — called from API route, text passed here.

export async function ingestExternal(source: IngestionSource): Promise<Result<void>> {
  // A4: URL fetching happens at R4 (API route). By the time we get here,
  // source.content is always resolved text.
  const label = normalizeLabel(source.label)

  const input: GlobalSeedInput = {
    label,
    content: source.content,
  }

  return seedGlobalNode(input)
}

// ─── removeGlobalNode ─────────────────────────────────────────────────────────
// Admin removes a global node and all connected edges.
// Cascade: query edges, include in mutation, atomic commit.

export async function removeNode(nodeId: NodeId): Promise<Result<void>> {
  return persistRemove(nodeId)
}

// ─── batchSeedAndTraverse ─────────────────────────────────────────────────────
// Phase 6.1: batch seed + self-traversal for global graph.
// Thin R2 passthrough to F-memory contract.

export async function batchSeedAndTraverse(
  nodes: GlobalSeedNode[],
): Promise<Result<{ seeded: number; traversed: number }>> {
  return _seedAndTraverseGlobal(nodes)
}

// ─── getModulesForClient (6.11) ──────────────────────────────────────────────
// Returns registered framework modules for the client-side program registry.
// No auth required — module definitions are not user-sensitive.

import { getRegisteredModules } from './codec-registry'
import type { FrameworkModule } from '../config/codec-module-types'

export function getModulesForClient(): FrameworkModule[] {
  return getRegisteredModules()
}
