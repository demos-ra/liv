// @liv-standard v1.3
// [F-ai-adapter/config/ai-adapter-config.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    sprint-beta-addon-shot-2 (PROVIDER_DEFAULT_MODEL added — canonical model per provider)
// amended:    sprint-COIN-shot-1 (JsonSchema + StructuredEmitConfig added — structured-emit transport vocabulary)
// amended:    scope-b-cleanup (AI_ADAPTER_CONFIG.defaultModel removed — only consumer was dead getDefaultModel)
// slice:      F-ai-adapter
// layer:      R0
// wires-in:
//   W-ATOM  ProviderId  @/features/F-user-profile/config/provider-keys-config  (canonical owner)
// wires-out:
//   W-ATOM  AI_ADAPTER_CONFIG     →  F-ai-adapter/R4
//   W-ATOM  ModelConfig           →  F-ai-adapter/R4, F-ai-adapter/R1
//   W-ATOM  MODELS                →  F-ai-adapter/R4, F-ai-adapter/R1
//   W-ATOM  providerForModel      →  F-ai-adapter/R4, F-planner/R3
//   W-ATOM  PROVIDER_DEFAULT_MODEL →  F-user-profile/R3  (sprint-beta-addon-shot-2)
//   W-ATOM  ChatMessage           →  F-ai-adapter/R4, F-planner/R4
//   W-ATOM  StreamChunk           →  F-ai-adapter/R4
//   W-ATOM  CompletionResult      →  F-ai-adapter/R4
//   W-ATOM  JsonSchema            →  F-ai-adapter/R4, F-present/R1  (sprint-COIN-shot-1)
//   W-ATOM  StructuredEmitConfig  →  F-ai-adapter/R4, F-present/R1  (sprint-COIN-shot-1)
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

// ── PROVIDER_DEFAULT_MODEL — the canonical model per provider ─────────────────
// sprint-beta-addon-shot-2: provider-granularity engine selection. The wearer
// picks a provider; this declares which MODELS entry that provider resolves to.
// One model per provider — the declared answer to "the provider's model" (MODELS
// itself holds several models for some providers; this names the canonical one).
//
// Consumed read-only by F-user-profile's PUT /api/profile/models to write a
// real model id into ModelPreferences. Each value MUST be a live MODELS key.
//
// Forward-modular: when multi-model selection ships, a model sub-picker lets the
// wearer override this per-provider default; this constant stays as the default,
// the picker writes `model` directly. The { provider, model } atom is unchanged.
export const PROVIDER_DEFAULT_MODEL: Record<ProviderId, string> = {
  anthropic: 'claude-sonnet-4-6',
  deepseek:  'deepseek-chat',
  openai:    'gpt-4o',
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

// ── Structured-emit transport types (COIN write-side — sprint-COIN-shot-1) ────
// The structured transport (exec/structured-stream.ts) sends a schema and parses
// a structured return. These types are the schema vocabulary + call config. They
// are generic and F-ai-adapter-owned; the COIN schema that rides them
// (SCORE_SCHEMA / SCORE_EMIT_CONFIG) stays F-present-owned.

// JsonSchema: the documented subset of JSON-Schema callers compose for structured
// output. Recursive. Exactly the shape coin-score's COORD/SCORE_SCHEMA build
// (object/array/scalar + properties/items/required/enum/additionalProperties) —
// not a full JSON-Schema implementation.
export type JsonSchemaType =
  | 'object' | 'array' | 'string' | 'number' | 'integer' | 'boolean' | 'null'

export type JsonSchema = {
  type?:                 JsonSchemaType
  properties?:           Record<string, JsonSchema>
  items?:                JsonSchema
  required?:             string[]
  enum?:                 readonly (string | number)[]
  additionalProperties?: boolean
  anyOf?:                JsonSchema[]
  description?:          string
}

// StructuredEmitConfig: a schema + optional streaming descriptors. `schema` is the
// shape the provider must return. `streamArray`/`streamField` name the top-level
// array and the per-item field for incremental field surfacing — forward-modular
// descriptors; the Shot 1 transport parses the complete object at end-of-call
// (see structured-stream.ts design note), so they are advisory today.
export type StructuredEmitConfig = {
  schema:       JsonSchema
  streamArray?: string
  streamField?: string
}
