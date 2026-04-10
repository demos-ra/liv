// @liv-standard v1.3
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  GlobalSeedInput    F-codec/R0
//   W-ATOM  IngestionSource    F-codec/R0
//   W-FN    normalizeLabel     F-codec/R1
//   W-FN    seedGlobalNode     F-memory/R3
//   W-FN    removeGlobalNode   F-memory/R3
// wires-out:  none (consumed by R4 API routes)
// deps:
//   R0  ../config/codec-admin-types
//   R1  ../domain/codec-label
//   R3  ../../F-memory/contract/memory-contract
// validated:  pending

// Admin write operations — three actions on the global graph.
// R2: orchestration. Composes R1 pure functions and R3 contract calls.
// Moral principle: global graph contains only knowledge whose provenance
// is verifiable — admin-authored or externally sourced. No per-user content
// flows upward. All writes use userId: null.

import type { Result } from '@/core/types/primitives'
import type { GlobalSeedInput, IngestionSource } from '../config/codec-admin-types'
import type { MemNode, MemEdge } from '../../F-memory/config/memory-types'
import { normalizeLabel } from '../domain/codec-label'
import { seedGlobalNode as persistSeed, removeGlobalNode as persistRemove } from '../../F-memory/contract/memory-contract'

// ─── seedGlobalNode ───────────────────────────────────────────────────────────
// Admin authors a knowledge node directly into the global graph.
// A6: admin seeding is a direct graph write — not a traversal.
// No propagation, no sparsification, no activation.

export async function seedGlobalNode(input: GlobalSeedInput): Promise<Result<void>> {
  const label = normalizeLabel(input.label)
  const now = Date.now()
  const nodeId = `global-${now}-${Math.random().toString(36).slice(2, 8)}`

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

export async function removeNode(nodeId: string): Promise<Result<void>> {
  return persistRemove(nodeId)
}
