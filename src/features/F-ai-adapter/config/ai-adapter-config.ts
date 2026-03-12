// @liv-standard v1.3
// [F-ai-adapter/config/ai-adapter-config.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-ai-adapter
// layer:      R0
// wires-in:
//   W-ATOM  ProviderId  @/features/F-user-profile/config/provider-keys-config  (canonical owner)
// wires-out:
//   W-ATOM  AI_ADAPTER_CONFIG  →  F-ai-adapter/R4
//   W-ATOM  ModelConfig        →  F-ai-adapter/R4, F-ai-adapter/R1
//   W-ATOM  MODELS             →  F-ai-adapter/R4, F-ai-adapter/R1
//   W-ATOM  providerForModel   →  F-ai-adapter/R4, F-planner/R3
//   W-ATOM  ChatMessage        →  F-ai-adapter/R4, F-planner/R4
//   W-ATOM  StreamChunk        →  F-ai-adapter/R4
//   W-ATOM  CompletionResult   →  F-ai-adapter/R4
// deps:
//   R0  @/features/F-user-profile/config/provider-keys-config
// validated:  2026-03-12

// A1: F-ai-adapter owns MODELS and providerForModel — model registry is this slice's concern.
//     F-user-profile owns PROVIDERS and ProviderId — UI/key registry.
//     providerForModel derives from MODELS.provider — one source of model→provider truth.
//     Adding a model: one entry in MODELS. Adding a provider: one entry in PROVIDERS. Zero cascade.

import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'

export type { ProviderId }

export const AI_ADAPTER_CONFIG = {
  defaultModel:   'claude-sonnet-4-6',
  streamTimeout:  60_000,
  maxRetries:     2,
  retryDelayMs:   1000,
} as const

export const AI_ADAPTER_NAMESPACE = 'ai_adapter' as const

export type ModelConfig = {
  modelId:           string
  provider:          ProviderId
  displayName:       string
  contextWindow:     number
  supportsStreaming: boolean
}

// Single source of truth for all supported models.
// Adding a model: one entry here. providerForModel derives from this automatically.
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

// R1-safe pure helper — derives from MODELS, never a separate map
export function providerForModel(modelId: string): ProviderId {
  return (MODELS[modelId]?.provider ?? 'anthropic') as ProviderId
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
