// @liv-standard v1.3
// [F-ai-adapter/R3]
// Built with LIV · livai.dev
// R3: interface boundary, depends R0 + R1 + R2.
// A5: this is the only import path for AI streaming across all slices.
// Phase 4 change: streamAIResponse accepts optional apiKey — threaded to R2 + R4.
//
// @manifest
// standard:   LIV-Standard v1.3
// amended:    foundation-group1 (streamStructuredEmit/StructuredChunk exposed at R3 — spine imports R3 not exec), foundation-group2 (MODELS/providerForModel/PROVIDER_DEFAULT_MODEL/ChatMessage/JsonSchema/StructuredEmitConfig republished at R3)
// slice:      F-ai-adapter
// layer:      R3
// wires-in:
//   W-FN    streamCompletion       F-ai-adapter/R2 ai-adapter-workflow
//   W-FN    streamStructuredEmit   F-ai-adapter/R4 structured-stream   (Group 1)
//   W-ATOM  StructuredChunk        F-ai-adapter/R4 structured-stream   (Group 1)
//   W-ATOM  ChatMessage            F-ai-adapter/R0 ai-adapter-config   (Group 2: type republish)
//   W-ATOM  JsonSchema             F-ai-adapter/R0 ai-adapter-config   (Group 2: type republish)
//   W-ATOM  StructuredEmitConfig   F-ai-adapter/R0 ai-adapter-config   (Group 2: type republish)
// wires-out:
//   W-HOOK  streamAIResponse       →  F-chat/R2 chat-workflow
//   W-HOOK  streamStructuredEmit   →  F-present/R2 cognition-orchestrator (Group 1)
//   W-ATOM  StructuredChunk        →  F-present/R2 cognition-orchestrator (Group 1)
//   W-HOOK  useModelSelector       →  UI consumers
//   W-HOOK  useAvailableModels     →  UI consumers
//   W-ATOM  MODELS                 →  F-chat/R3 chat-contract (Group 2)
//   W-ATOM  providerForModel       →  F-chat/R3 chat-contract, F-chat/R2 chat-workflow (Group 2)
//   W-ATOM  PROVIDER_DEFAULT_MODEL →  F-chat/R3 chat-contract (Group 2)
//   W-ATOM  ChatMessage            →  F-present/R2 cognition-orchestrator (Group 2)
//   W-ATOM  JsonSchema             →  F-present/R1 coin-score (Group 2)
//   W-ATOM  StructuredEmitConfig   →  F-present/R1 coin-score (Group 2)
// deps:
//   R2  ../app/ai-adapter-workflow
//   R4  ../exec/structured-stream
//   R0  ../config/ai-adapter-config

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

// ─── Structured-emit surface (Group 1 — foundation-group1) ───────────────────
// streamStructuredEmit was reached directly from F-present via F-ai-adapter/exec/
// (A2 violation). Exposed here as the single R3 gate. Same function, same
// signature — one indirection only.
export { streamStructuredEmit } from '../exec/structured-stream'
export type { StructuredChunk } from '../exec/structured-stream'

// ─── Model registry surface (Group 2 — foundation-group2) ────────────────────
// MODELS, providerForModel, PROVIDER_DEFAULT_MODEL, ChatMessage, JsonSchema,
// StructuredEmitConfig were consumed from F-ai-adapter/config by the spine.
// Republished here so spine imports R3, not config directly.
export { MODELS, providerForModel, PROVIDER_DEFAULT_MODEL } from '../config/ai-adapter-config'
export type { ChatMessage, JsonSchema, StructuredEmitConfig } from '../config/ai-adapter-config'
