// @liv-standard v1.3
// [F-builder/exec/ai-adapter-io.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-builder
// amended:    sprint-12-shot-3 (moved from F-planner/exec — dissolution)
// layer:      R4
// wires-in:
//   W-ATOM  streamAIResponse  F-ai-adapter/contract/ai-contract  (R3 surface — A5 compliant)
//   W-ATOM  ChatMessage       F-ai-adapter/config/ai-adapter-config  (R0 — permitted)
//   W-ATOM  PlannerResult     ../types/planner-types
// wires-out:  none  (R4 never imported — bound via IAiAdapter at R3)
// deps:
//   R0  ../types/planner-types
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R3  @/features/F-ai-adapter/contract/ai-contract
// validated:  2026-03-12
//
// Step 1 — R4→R4 fix (A5):
//   Previously imported streamAIResponse from F-ai-adapter/exec/ai-io (R4).
//   Now imports from F-ai-adapter/contract/ai-contract (R3) — the declared
//   cross-slice surface for AI streaming. No behaviour change: ai-contract
//   delegates to ai-adapter-workflow (R2) → ai-io (R4) unchanged.
//   Prior self-declared A2-r4-io-delegation amendment is hereby retired.
//   Axiom cite: A5 — cross-slice I/O via R3 contract only.

import { streamAIResponse }  from '@/features/F-ai-adapter/contract/ai-contract'
import type { ChatMessage }  from '@/features/F-ai-adapter/config/ai-adapter-config'
import type { PlannerResult } from '@/features/F-plan/types/pipeline-types'

// apiKey is pre-resolved by planner-inject.ts (R3) via F-user-profile/contract.
// R4 never resolves identity — it only executes I/O with supplied credentials.
export async function ioStreamCompletion(opts: {
  apiKey?:  string
  modelId:  string
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
  onChunk:  (chunk: string) => void
}): Promise<PlannerResult<{ totalTokens: number; modelId: string }>> {
  try {
    const messages: ChatMessage[] = opts.messages.map(m => ({
      role:    m.role,
      content: m.content,
    }))

    let totalTokens = 0

    for await (const chunk of streamAIResponse(messages, opts.modelId, opts.apiKey)) {
      if (chunk.content) opts.onChunk(chunk.content)
      if (chunk.totalTokens) totalTokens = chunk.totalTokens
    }

    return { ok: true, data: { totalTokens, modelId: opts.modelId } }

  } catch (e) {
    console.error(JSON.stringify({
      level:     'error',
      event:     'planner.ai-io.error',
      message:   e instanceof Error ? e.message : String(e),
      slice:     'F-planner',
      layer:     'R4',
      timestamp: new Date().toISOString(),
    }))
    return { ok: false, error: { code: 'AI_IO_ERROR', message: 'AI stream failed', context: { cause: String(e) } } }
  }
}
