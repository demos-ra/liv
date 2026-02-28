// [F-ai-adapter/R2/C3] AI adapter workflow — streaming orchestration + retry
// R2: orchestration, depends R0 + R1 + R4

import { ChatMessage, StreamChunk, AI_ADAPTER_CONFIG } from '../config/ai-adapter-config'
import {
  resolveModel,
  shouldRetry,
  retryDelay,
} from '../domain/ai-adapter-logic'
import { streamAIResponse } from '../exec/ai-io'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'

// --- Main streaming entry point (called by F-chat R2) ---

export async function* streamCompletion(
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  const model = resolveModel(modelId)
  let attempt = 0

  while (true) {
    try {
      const stream = getProviderStream(model.provider, messages, modelId)

      for await (const chunk of stream) {
        yield chunk
      }

      return // clean exit

    } catch (err) {
      if (shouldRetry(attempt, err)) {
        await sleep(retryDelay(attempt))
        attempt++
        continue
      }

      await emitEvent({
        type: EVENTS.AI.STREAM_ERROR,
        payload: { modelId, attempt, error: err instanceof Error ? err.message : 'unknown' },
      })

      throw err
    }
  }
}

// --- Route to correct provider stream ---

function getProviderStream(
  provider: string,
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  return streamAIResponse(messages, modelId)
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
