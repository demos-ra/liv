// [F-ai-adapter/R0/C2] AI adapter configuration and types
// R0: pure config, zero dependencies

export const AI_ADAPTER_CONFIG = {
  defaultModel: 'claude-sonnet-4-6',
  streamTimeout: 60_000,
  maxRetries: 2,
  retryDelayMs: 1000,
} as const

export const AI_ADAPTER_NAMESPACE = 'ai_adapter' as const

// Supported providers — extend here, nowhere else
export type Provider = 'anthropic' | 'openai' | 'gemini' | 'deepseek'

export type ModelConfig = {
  modelId: string
  provider: Provider
  displayName: string
  contextWindow: number     // tokens
  supportsStreaming: boolean
}

// Single source of truth for all supported models
export const MODELS: Record<string, ModelConfig> = {
  'claude-sonnet-4-6': {
    modelId: 'claude-sonnet-4-6',
    provider: 'anthropic',
    displayName: 'Claude Sonnet 4.6',
    contextWindow: 200_000,
    supportsStreaming: true,
  },
  'claude-opus-4-6': {
    modelId: 'claude-opus-4-6',
    provider: 'anthropic',
    displayName: 'Claude Opus 4.6',
    contextWindow: 200_000,
    supportsStreaming: true,
  },
  'gpt-4o': {
    modelId: 'gpt-4o',
    provider: 'openai',
    displayName: 'GPT-4o',
    contextWindow: 128_000,
    supportsStreaming: true,
  },
  'deepseek-chat': {
    modelId: 'deepseek-chat',
    provider: 'deepseek',
    displayName: 'DeepSeek Chat',
    contextWindow: 64_000,
    supportsStreaming: true,
  },
  'deepseek-reasoner': {
    modelId: 'deepseek-reasoner',
    provider: 'deepseek',
    displayName: 'DeepSeek Reasoner',
    contextWindow: 64_000,
    supportsStreaming: true,
  },
} as const

export type ChatMessage = {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export type StreamChunk = {
  content: string
  totalTokens: number | null
  done: boolean
}

export type CompletionResult = {
  content: string
  totalTokens: number
  modelId: string
}
