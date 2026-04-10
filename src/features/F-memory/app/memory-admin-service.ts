// @liv-standard v1.3
// [F-memory/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    w3-20-admin-write
// slice:      F-memory
// layer:      R2
// wires-in:
//   W-ATOM  MemNode         F-memory/R0
//   W-ATOM  MemEdge         F-memory/R0
//   W-ATOM  GraphMutation   F-memory/R0
//   W-ATOM  M4_INPUT        F-memory/R0
//   W-FN    persistMutations   F-memory/R4
//   W-FN    loadEdgesForNode   F-memory/R4
// wires-out:
//   W-FN  seedGlobalNode    →  F-memory/R3 (memory-contract)
//   W-FN  removeGlobalNode  →  F-memory/R3 (memory-contract)
// deps:
//   R0  ../config/memory-types
//   R4  ../exec/memory-graph-io
//   R4  ../exec/memory-repository
// validated:  pending

// Admin write service — global graph seed and remove.
// R2: orchestration. Composes R4 persistence calls.
// Extracted from R3 contract (w3-20) to preserve layer discipline:
//   R3 = thin wire, R2 = orchestration with I/O delegation.

import type { Result } from '@/core/types/primitives'
import type {
  MemNode,
  MemEdge,
  GraphMutation,
} from '../config/memory-types'
import { M4_INPUT } from '../config/memory-types'
import { persistMutations } from '../exec/memory-graph-io'
import { loadEdgesForNode } from '../exec/memory-repository'

// ─── seedGlobalNode ───────────────────────────────────────────────────────────
// Direct node + edge insert into global graph (userId: null).
// Not a traversal — no propagation, no sparsification, no activation.
// Defaults: M4 layer, closure 0, asymmetry 0 (fresh node, no topology yet).

export async function seedGlobalNode(
  node: Omit<MemNode, 'cachedLayer' | 'cachedClosure' | 'cachedAsymmetry'>,
  edges: MemEdge[],
): Promise<Result<void>> {
  const fullNode: MemNode = {
    ...node,
    cachedLayer:     M4_INPUT,
    cachedClosure:   0,
    cachedAsymmetry: 0,
  }

  const mutation: GraphMutation = {
    nodeCreates:  [fullNode],
    edgeUpserts:  edges,
    edgeDeletes:  [],
    nodeDeletes:  [],
    sourcePrunes: [],
    layerUpdates: [],
  }

  return persistMutations(mutation, null)
}

// ─── removeGlobalNode ─────────────────────────────────────────────────────────
// Cascade delete: query connected edges via R4, build single atomic mutation.
// A4: I/O delegated to R4 (loadEdgesForNode + persistMutations).

export async function removeGlobalNode(nodeId: string): Promise<Result<void>> {
  // Load connected edges from R4
  const edgeResult = await loadEdgesForNode(nodeId, null)
  if (!edgeResult.ok) {
    return {
      ok: false,
      error: {
        code: 'ADMIN_REMOVE_FAILED',
        message: edgeResult.error.message,
        context: { nodeId },
      },
    }
  }

  const mutation: GraphMutation = {
    nodeCreates:  [],
    edgeUpserts:  [],
    edgeDeletes:  edgeResult.data,
    nodeDeletes:  [nodeId],
    sourcePrunes: [],
    layerUpdates: [],
  }

  return persistMutations(mutation, null)
}
