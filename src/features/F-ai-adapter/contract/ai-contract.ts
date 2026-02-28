// [F-ai-adapter/R3/C2] AI adapter contract — single interface for all consumers
// R3: interface boundary, depends R0 + R1 + R2
//
// This is the only import path for AI streaming across all slices.
// F-chat R2 imports streamAIResponse from here.

import { ChatMessage, StreamChunk } from '../config/ai-adapter-config'
import { streamCompletion } from '../app/ai-adapter-workflow'

// --- Primary export: what F-chat calls ---

export async function* streamAIResponse(
  messages: ChatMessage[],
  modelId: string
): AsyncGenerator<StreamChunk> {
  yield* streamCompletion(messages, modelId)
}

// --- Model selector hook ---

export { useModelSelector, useAvailableModels } from './ai-adapter-hook'
