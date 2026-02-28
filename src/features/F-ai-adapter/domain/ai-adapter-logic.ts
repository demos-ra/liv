// [F-ai-adapter/R1/C2] AI adapter domain logic — provider selection + message formatting
// R1: pure functions, no I/O, depends R0 only

import {
  Provider,
  ModelConfig,
  MODELS,
  ChatMessage,
  AI_ADAPTER_CONFIG,
} from '../config/ai-adapter-config'

// --- Model resolution ---

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

// --- Message formatting per provider ---
// Each provider has slightly different expected formats.
// All normalization happens here in R1, never in R4.

export function formatMessagesForAnthropic(
  messages: ChatMessage[]
): { system: string | undefined; messages: Array<{ role: string; content: string }> } {
  const systemMessages = messages.filter((m) => m.role === 'system')
  const conversationMessages = messages.filter((m) => m.role !== 'system')

  return {
    system: systemMessages.map((m) => m.content).join('\n') || undefined,
    messages: conversationMessages.map((m) => ({ role: m.role, content: m.content })),
  }
}

export function formatMessagesForOpenAI(
  messages: ChatMessage[]
): Array<{ role: string; content: string }> {
  return messages.map((m) => ({ role: m.role, content: m.content }))
}

export function formatMessagesForGemini(
  messages: ChatMessage[]
): Array<{ role: string; parts: Array<{ text: string }> }> {
  // Gemini uses 'user'/'model' roles, no 'system'
  return messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
}

// --- Retry logic (pure: returns whether to retry) ---

export function shouldRetry(attempt: number, error: unknown): boolean {
  if (attempt >= AI_ADAPTER_CONFIG.maxRetries) return false
  // Don't retry on auth errors or invalid model errors
  if (error instanceof Error) {
    if (error.message.includes('401') || error.message.includes('invalid_model')) return false
  }
  return true
}

export function retryDelay(attempt: number): number {
  return AI_ADAPTER_CONFIG.retryDelayMs * Math.pow(2, attempt) // exponential backoff
}
