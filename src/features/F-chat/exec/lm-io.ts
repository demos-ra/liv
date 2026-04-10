// @liv-standard v1.3
// [F-chat/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1-wire-fix
// slice:      F-chat
// layer:      R4
// wires-in:
//   W-ATOM  PresentState     F-memory/R0
//   W-ATOM  TraversalResult  F-memory/R0
// wires-out:  none (consumed by R2 chat-workflow)
// deps:       none (deps injected via MemoryDeps)
// validated:  pending

// Living Memory v1.1 adapter for F-chat.
// R4: I/O boundary. Adapts chat-workflow call signatures to F-memory contract.
// §20 integration: two surfaces — traverse(text, userId, options?) + getPresentState(userId).
// O3: fail-silent — memory down must never break chat.

import type { Result } from '@/core/types/primitives'

// ─── Memory deps interface ────────────────────────────────────────────────────
// Injected by R2 chat-workflow. Maps to F-memory/R3 contract.
// v1.1: +userId on both signatures (Amendment 3). userId field injected by R2 caller.

export interface MemoryDeps {
  traverse:        (text: string, userId: string, options?: { returnActivation?: boolean }) => Promise<Result<TraversalResultLike | null>>
  getPresentState: (userId: string) => PresentStateLike
  userId:          string
}

// Lightweight types to avoid cross-slice R0 import at R4.
// Shape matches F-memory/R0 PresentState and TraversalResult.
type PresentStateLike = {
  statements: Array<{
    arm:        string | null
    value:      string
    source:     string | null
    layer:      number
    confidence: string
    recency:    number
  }>
}

type TraversalResultLike = {
  activation: Map<string, number>
  topNodes:   Array<{ nodeId: string; content: string; score: number; layer: number }>
}

// ─── Get Present State ────────────────────────────────────────────────────────
// §20 step 1: inject into system prompt before LLM call.
// G2: reads precomputed values only — never blocks.

export function lmGetPresentState(deps: MemoryDeps): string {
  try {
    const state = deps.getPresentState(deps.userId)
    if (state.statements.length === 0) return ''

    const lines: string[] = []
    for (const stmt of state.statements) {
      const prefix = stmt.arm ? `[${stmt.arm}]` : ''
      const conf   = `(${stmt.confidence})`
      const src    = stmt.source ? ` — "${stmt.source}"` : ''
      lines.push(`${prefix} ${stmt.value} ${conf}${src}`.trim())
    }

    return lines.join('\n')
  } catch {
    return ''  // Memory down — fail silent
  }
}

// ─── Traverse (read path) ─────────────────────────────────────────────────────
// §20 step 2: traverse user message, return activated nodes as context.

export async function lmTraverseRead(
  text: string,
  deps: MemoryDeps,
): Promise<string> {
  try {
    const result = await deps.traverse(text, deps.userId, { returnActivation: true })
    if (!result.ok || !result.data) return ''

    const lines: string[] = []
    for (const node of result.data.topNodes) {
      lines.push(`[${(node.score * 100).toFixed(1)}%] ${node.content}`)
    }

    return lines.join('\n')
  } catch {
    return ''  // Memory down — fail silent
  }
}

// ─── Traverse (write path) ────────────────────────────────────────────────────
// §20 step 5: traverse LLM response, write-only (no activation returned).
// Also recomputes Present State as side effect.

export async function lmTraverseWrite(
  text: string,
  deps: MemoryDeps,
): Promise<void> {
  try {
    await deps.traverse(text, deps.userId)
  } catch {
    // Memory down — fail silent
  }
}
