// @liv-standard v1.3
// [F-ai-adapter/R3]
// Built with LIV · livai.dev
// R3: interface boundary, depends R0 + R1 + R2.
// A5: this is the only import path for AI streaming across all slices.
// Phase 4 change: streamAIResponse accepts optional apiKey — threaded to R2 + R4.

import type { ChatMessage, StreamChunk } from '../config/ai-adapter-config'
import { streamCompletion } from '../app/ai-adapter-workflow'

// ── Primary export: what F-chat R2 calls ─────────────────────────────────────
// apiKey: per-user key loaded by chat-workflow from api-key-db.
// If absent: ai-io falls back to env var, then mock.

export async function* streamAIResponse(
  messages: ChatMessage[],
  modelId:  string,
  apiKey?:  string,
): AsyncGenerator<StreamChunk> {
  yield* streamCompletion(messages, modelId, apiKey)
}

export { useModelSelector, useAvailableModels } from './ai-adapter-hook'
