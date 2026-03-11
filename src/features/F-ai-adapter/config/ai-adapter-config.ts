// @liv-standard v1.0
// [F-ai-adapter/config/ai-adapter-config.ts]
// Built with LIV · livai.dev
// R0: pure config, zero dependencies.
// A6: single source of truth for all AI adapter types and model registry.
// Phase 4 change: added ProviderId alias + providerForModel pure helper.
// Modular: adding a provider = add to Provider type + PROVIDER_BASES in ai-io.ts.
// Adding a model = add one entry to MODELS.

export const AI_ADAPTER_CONFIG = {
  defaultModel:   'claude-sonnet-4-6',
  streamTimeout:  60_000,
  maxRetries:     2,
  retryDelayMs:   1000,
} as const

export const AI_ADAPTER_NAMESPACE = 'ai_adapter' as const

// Supported providers — extend here and in PROVIDER_BASES in ai-io.ts
export type Provider   = 'anthropic' | 'openai' | 'deepseek'
export type ProviderId = Provider   // alias — use ProviderId at call sites

export type ModelConfig = {
  modelId:           string
  provider:          Provider
  displayName:       string
  contextWindow:     number   // tokens
  supportsStreaming: boolean
}

// Single source of truth for all supported models
export const MODELS: Record<string, ModelConfig> = {
  'claude-sonnet-4-6': {
    modelId: 'claude-sonnet-4-6', provider: 'anthropic',
    displayName: 'Claude Sonnet 4.6', contextWindow: 200_000, supportsStreaming: true,
  },
  'claude-opus-4-6': {
    modelId: 'claude-opus-4-6', provider: 'anthropic',
    displayName: 'Claude Opus 4.6', contextWindow: 200_000, supportsStreaming: true,
  },
  'gpt-4o': {
    modelId: 'gpt-4o', provider: 'openai',
    displayName: 'GPT-4o', contextWindow: 128_000, supportsStreaming: true,
  },
  'deepseek-chat': {
    modelId: 'deepseek-chat', provider: 'deepseek',
    displayName: 'DeepSeek Chat', contextWindow: 64_000, supportsStreaming: true,
  },
  'deepseek-reasoner': {
    modelId: 'deepseek-reasoner', provider: 'deepseek',
    displayName: 'DeepSeek Reasoner', contextWindow: 64_000, supportsStreaming: true,
  },
} as const

// Pure helper — R1-safe (no I/O). Used by ai-io.ts and chat-workflow.ts.
// A6: declared here at R0 so both slices import from one place.
export function providerForModel(modelId: string): ProviderId {
  return MODELS[modelId]?.provider ?? 'anthropic'
}

export type ChatMessage = {
  role:    'user' | 'assistant' | 'system'
  content: string
}

export type StreamChunk = {
  content:     string
  totalTokens: number | null
  done:        boolean
}

export type CompletionResult = {
  content:     string
  totalTokens: number
  modelId:     string
}
