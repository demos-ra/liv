// @liv-standard v1.3
// [F-ai-adapter/domain/ai-adapter-logic.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-ai-adapter
// layer:      R1
// wires-in:
//   W-ATOM  ProviderId       @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  ModelConfig      @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  MODELS           @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  ChatMessage      @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  AI_ADAPTER_CONFIG @/features/F-ai-adapter/config/ai-adapter-config
// wires-out:
//   W-ATOM  resolveModel         →  F-ai-adapter/R3
//   W-ATOM  getDefaultModel      →  F-ai-adapter/R3
//   W-ATOM  getAvailableModels   →  F-ai-adapter/R3
//   W-ATOM  supportsStreaming     →  F-ai-adapter/R3
//   W-ATOM  formatMessagesForAnthropic →  F-ai-adapter/R4
//   W-ATOM  formatMessagesForOpenAI   →  F-ai-adapter/R4
//   W-ATOM  shouldRetry          →  F-ai-adapter/R4
//   W-ATOM  retryDelay           →  F-ai-adapter/R4
// deps:
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
// validated:  2026-03-12

// R1: pure functions only — no I/O, no side effects.
// formatMessages* functions normalize per-provider message shape here, never in R4.
// Gemini removed — not a declared provider in PROVIDERS.

import {
  type ProviderId,
  type ModelConfig,
  type ChatMessage,
  MODELS,
  AI_ADAPTER_CONFIG,
} from '../config/ai-adapter-config'

// ── Model resolution ──────────────────────────────────────────────────────────

export function resolveModel(modelId: string): ModelConfig {
  const model = MODELS[modelId]
  if (!model) throw new Error(`Unknown model: ${modelId}. Add to MODELS in ai-adapter-config.ts`)
  return model
}

export function getDefaultModel(): ModelConfig {
  return resolveModel(AI_ADAPTER_CONFIG.defaultModel)
}

export function getAvailableModels(): ModelConfig[] {
  return Object.values(MODELS)
}

export function supportsStreaming(modelId: string): boolean {
  return resolveModel(modelId).supportsStreaming
}

// ── Message formatting per provider ──────────────────────────────────────────

export function formatMessagesForAnthropic(
  messages: ChatMessage[]
): { system: string | undefined; messages: Array<{ role: string; content: string }> } {
  const systemMessages      = messages.filter(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')
  return {
    system:   systemMessages.map(m => m.content).join('\n') || undefined,
    messages: conversationMessages.map(m => ({ role: m.role, content: m.content })),
  }
}

export function formatMessagesForOpenAI(
  messages: ChatMessage[]
): Array<{ role: string; content: string }> {
  return messages.map(m => ({ role: m.role, content: m.content }))
}

// ── Retry logic ───────────────────────────────────────────────────────────────

export function shouldRetry(attempt: number, error: unknown): boolean {
  if (attempt >= AI_ADAPTER_CONFIG.maxRetries) return false
  if (error instanceof Error) {
    if (error.message.includes('401') || error.message.includes('invalid_model')) return false
  }
  return true
}

export function retryDelay(attempt: number): number {
  return AI_ADAPTER_CONFIG.retryDelayMs * Math.pow(2, attempt)
}

export type { ProviderId, ModelConfig, ChatMessage }

