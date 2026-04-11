// @liv-standard v1.3
// [F-ai-adapter/R2]
// Built with LIV · livai.dev
// R2: orchestration, depends R0 + R1 + R4 only.
// Phase 4 change: apiKey? threaded through streamCompletion → getProviderStream → streamAIResponse.
// Backward compatible: apiKey is optional — callers that omit it get env fallback.

import { ChatMessage, StreamChunk, AI_ADAPTER_CONFIG } from '../config/ai-adapter-config'
import {
  resolveModel,
  shouldRetry,
  retryDelay,
} from '../domain/ai-adapter-logic'
import { streamAIResponse } from '../exec/ai-io'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

export async function* streamCompletion(
  messages: ChatMessage[],
  modelId:  string,
  apiKey?:  string,   // Phase 4: per-user key, optional
): AsyncGenerator<StreamChunk> {
  const model   = resolveModel(modelId)
  let attempt   = 0

  while (true) {
    try {
      yield* streamAIResponse(messages, modelId, apiKey)
      return

    } catch (err) {
      if (shouldRetry(attempt, err)) {
        await sleep(retryDelay(attempt))
        attempt++
        continue
      }

      await emitEvent({
        type:    EVENTS.AI.STREAM_ERROR,
        payload: { modelId, attempt, error: err instanceof Error ? err.message : 'unknown' },
      })

      throw err
    }
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
