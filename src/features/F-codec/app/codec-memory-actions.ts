// @liv-standard v1.5.1
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v2-2-shot5-fix-2, cog-v1.2.1-rename
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  MemoryAction       ←  F-codec/R0
//   W-ATOM  MemNode            ←  F-memory/R3
//   W-ATOM  EdgePrimitiveType  ←  F-memory/R3
//   W-FN    traverse()         ←  F-memory/R3
//   W-FN    getUserGraph()     ←  F-memory/R3
//   W-FN    emitEvent()        ←  F-event-system/R3
// wires-out:
//   W-FN  executeMemoryAction()  →  F-codec/R4 (API route)
// deps:
//   R0  ../config/codec-memory-types    (type only)
//   R3  ../../F-memory/contract/memory-contract  (type only)
// validated:  pending

// Memory program action orchestrator.
// R2: orchestration — maps structured UI actions to graph traversals.
// CA4: observable transition — user already chose the primitive by clicking
//      the button, so we bypass LLM classify and call traverse() directly
//      with an explicit primitiveType. Mechanical encode for UI actions.
// A1: F-codec owns encode intent. F-memory owns graph mutation.
// A2: depends on F-memory (lower), F-event-system (lower).

import type { Result } from '@/core/types/primitives'
import type { MemoryAction } from '../config/codec-memory-types'
import type { EdgePrimitiveType } from '@/features/F-memory/contract/memory-contract'
import { traverse, getUserGraph } from '@/features/F-memory/contract/memory-contract'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Event constant ──────────────────────────────────────────────────────────
// A6: declared at module scope. A5: consumed via event bus only.
const MEMORY_ACTION_EVENT = 'codec.memory-action' as const

// ─── executeMemoryAction ─────────────────────────────────────────────────────
// Maps each MemoryAction to a traverse() call with explicit primitiveType.
// A3: typed boundary — takes MemoryAction atom, returns Result<void>.
//
// | Action      | PrimitiveType | Effect                          |
// |-------------|---------------|---------------------------------|
// | restructure | restructure   | Reparent — weakens old, creates new edge |
// | suppress    | suppress      | Weakens node's edges            |
// | relate      | relate        | Creates connection between nodes|
// | reinforce   | reinforce     | Strengthens node                |

export async function executeMemoryAction(
  action: MemoryAction,
  userId: string,
): Promise<Result<void>> {
  try {
    const graph = getUserGraph(userId)

    switch (action.type) {
      case 'restructure': {
        // A2: look up both nodes, traverse with restructure primitive.
        const node = graph.nodes.get(action.nodeId)
        const newParent = graph.nodes.get(action.newParentId)
        if (!node)      return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.nodeId} not found`)
        if (!newParent) return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.newParentId} not found`)

        const label = `${node.content} → ${newParent.content}`
        await callTraverse(label, userId, 'restructure')
        break
      }

      case 'suppress': {
        const node = graph.nodes.get(action.nodeId)
        if (!node) return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.nodeId} not found`)

        await callTraverse(node.content, userId, 'suppress')
        break
      }

      case 'relate': {
        const fromNode = graph.nodes.get(action.fromNodeId)
        const toNode   = graph.nodes.get(action.toNodeId)
        if (!fromNode) return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.fromNodeId} not found`)
        if (!toNode)   return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.toNodeId} not found`)

        const label = `${fromNode.content} ${toNode.content}`
        await callTraverse(label, userId, 'relate')
        break
      }

      case 'reinforce': {
        const node = graph.nodes.get(action.nodeId)
        if (!node) return fail('MEMORY_ACTION_NODE_NOT_FOUND', `node ${action.nodeId} not found`)

        await callTraverse(node.content, userId, 'reinforce')
        break
      }
    }

    // Emit observability event (A5)
    await emitEvent({
      type:    MEMORY_ACTION_EVENT,
      payload: { actionType: action.type, userId },
      slice:   'F-codec',
    })

    return { ok: true, data: undefined }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[F-codec] executeMemoryAction error:', message)
    return { ok: false, error: { code: 'MEMORY_ACTION_FAILED', message } }
  }
}

// ─── Internal Helpers ────────────────────────────────────────────────────────

async function callTraverse(
  label:         string,
  userId:        string,
  primitiveType: EdgePrimitiveType,
): Promise<void> {
  const result = await traverse(label, userId, { primitiveType })
  if (!result.ok) {
    throw new Error(`traverse failed: ${result.error.message}`)
  }
}

function fail(code: string, message: string): Result<void> {
  return { ok: false, error: { code, message } }
}
