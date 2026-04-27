// @liv-standard v1.3
// [F-chat/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    lm-v1.1-wire-fix, lm-v2-2-shot2, lm-v2-2-shot3, lm-v2-2-shot4
// slice:      F-chat
// layer:      R4
// wires-in:
//   W-ATOM  PresentState     F-memory/R3 (re-export from memory-types via memory-contract)
//   W-ATOM  TraversalResult  F-memory/R3 (re-export)
//   W-ATOM  ScopeFilter, AxisSet  F-memory/R3 (re-export — LM v2.2 §C, §D; D-LIAISON-STRIKE close)
// wires-out:  none (consumed by R2 chat-workflow)
// deps:       none (deps injected via MemoryDeps)
// validated:  pending

// Living Memory v1.1 adapter for F-chat.
// R4: I/O boundary. Adapts chat-workflow call signatures to F-memory contract.
// §20 integration: two surfaces — traverse(text, userId, options?) + Present({scope, axes, limit}).
// O3: fail-silent — memory down must never break chat.
//
// lm-v2-2-shot2: MemoryDeps.getPresentState renamed to MemoryDeps.present per
// LM v2.2 §D parameter recovery. (Shot 2 used liaison types at R4; struck in
// shot3 per D-LIAISON-STRIKE — see header note below.)
//
// lm-v2-2-shot3 (D-LIAISON-STRIKE close): R4 liaison types
// `ScopeFilterLike`, `AxisSetLike`, `PresentStateLike` deleted. Atom types
// imported from F-memory/R3 (cross-slice re-export per A2 — R3 is the public
// surface). R-layer discipline preserved: R4 imports R3, not R0.

import type { Result } from '@/core/types/primitives'
// lm-v2-2-shot3: R0 atoms imported via F-memory/R3 cross-slice (D-LIAISON-STRIKE close).
import type {
  ScopeFilter,
  AxisSet,
  PresentState,
  TraversalResult,
} from '@/features/F-memory/contract/memory-contract'

// ─── Memory deps interface ────────────────────────────────────────────────────
// Injected by R2 chat-workflow. Maps to F-memory/R3 contract.
// v1.1: +userId on both signatures (Amendment 3). userId field injected by R2 caller.
// lm-v2-2-shot2: getPresentState renamed to present per LM v2.2 §D
// (D-PRESENT-OPTIONAL-PARAMS). DI port shape mirrors R3 export — partial-
// optional params; R3 fills defaults.
// lm-v2-2-shot3 (D-LIAISON-STRIKE close): types are R0 atoms imported via R3
// cross-slice; no liaisons.

export interface MemoryDeps {
  traverse:        (text: string, userId: string, options?: { returnActivation?: boolean }) => Promise<Result<TraversalResult | null>>
  present:         (params?: { scope?: ScopeFilter; axes?: AxisSet; limit?: number }) => PresentState
  userId:          string
}

// ─── Get Present State ────────────────────────────────────────────────────────
// §20 step 1: inject into system prompt before LLM call.
// G2: reads precomputed values only — never blocks.
// lm-v2-2-shot2: invocation shape per LM v2.2 §D. R4 site passes scope only;
// R3 fills axes + limit defaults (D-PRESENT-OPTIONAL-PARAMS). No R0 imports
// at R4; no constants duplicated across the R-layer boundary.
// lm-v2-2-shot4: PresentState body swapped to v2.2 §D shape. State now
// carries `projected: NodeId[]` instead of `statements`; rendering content
// requires graph accessors that lm-io's R4 deps surface does not carry.
// Function retained for export-shape stability (chat-workflow phase-5.1-r1
// removed the live caller; returning empty preserves the dead-code surface
// without expanding the deps shape). If a live caller returns, R2 caller
// should render content from projected via getUserGraph + getGlobalGraph
// at the chat-workflow site and pass the rendered string into deps.

export function lmGetPresentState(deps: MemoryDeps): string {
  try {
    // Touch the deps to preserve the dead-code call shape — present() returns
    // the v2.2 PresentState; we can verify state existence but cannot render
    // content here.
    const state = deps.present({ scope: { user: deps.userId } })
    if (state.projected.length === 0) return ''
    // Minimal rendering: opaque NodeId list. Real content rendering requires
    // graph accessors at R2 caller (see codec-encode.ts pattern).
    return state.projected.join('\n')
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
