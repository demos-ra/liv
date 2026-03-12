// @liv-standard v1.3
// [F-planner/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    A2-r4-io-delegation
// slice:      F-planner
// layer:      R4
// wires-in:
//   W-ATOM  streamAIResponse  F-ai-adapter/exec/ai-io  (A2-r4-io-delegation — see below)
//   W-ATOM  ChatMessage       F-ai-adapter/config/ai-adapter-config  (R0 — permitted)
//   W-ATOM  PlannerResult     ../types/planner-types
// wires-out:  none  (R4 never imported — bound via IAiAdapter at R3)
// deps:
//   R0  ../types/planner-types
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R4  @/features/F-ai-adapter/exec/ai-io
// validated:  2026-03-12
//
// A2-r4-io-delegation amendment:
//   R4 imports one cross-slice R4 function (streamAIResponse) for pure I/O delegation.
//   No types, no logic, no state cross the boundary — only an async generator call.
//   getApiKey resolution moved to planner-inject (R3) and threaded as apiKey? string.
//   This is the minimal viable amendment: one import, one call, zero logic bleed.

import { streamAIResponse, type ChatMessage } from '@/features/F-ai-adapter/exec/ai-io'
import type { PlannerResult }                 from '../types/planner-types'

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
