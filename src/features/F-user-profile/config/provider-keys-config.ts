// @liv-standard v1.0
// [F-user-profile/config/provider-keys-config.ts]
// Built with LIV · livai.dev
// R0: pure config, zero dependencies.
// A6: single source of truth for all supported AI providers.
// Modular: adding a provider = one entry in PROVIDERS. Zero other files change.

// ── Provider registry ─────────────────────────────────────────────────────────
// Each entry defines everything needed to render UI + route API keys.
// envFallback: server env var to use if user has no stored key (graceful degradation).

export const PROVIDERS = {
  anthropic: {
    id:          'anthropic' as const,
    label:       'Anthropic',
    placeholder: 'sk-ant-...',
    envFallback: 'ANTHROPIC_API_KEY',
    baseUrl:     'https://api.anthropic.com',
  },
  deepseek: {
    id:          'deepseek' as const,
    label:       'DeepSeek',
    placeholder: 'sk-...',
    envFallback: 'DEEPSEEK_API_KEY',
    baseUrl:     'https://api.deepseek.com/v1',
  },
} as const

// Derived types — callers use these, never raw strings
export type ProviderId = keyof typeof PROVIDERS
export type ProviderConfig = typeof PROVIDERS[ProviderId]

// Ordered list for UI rendering — controls display order in account panel
export const PROVIDER_ORDER: ProviderId[] = ['anthropic', 'deepseek']

// ── Model → provider mapping ──────────────────────────────────────────────────
// A6: declared here at R0. ai-adapter and chat-workflow import this.
// Adding a new model: add one entry. Adding a new provider: add to PROVIDERS above.

export const MODEL_PROVIDER_MAP: Record<string, ProviderId> = {
  'claude-sonnet-4-6':   'anthropic',
  'claude-opus-4-6':     'anthropic',
  'gpt-4o':              'anthropic', // routed via anthropic key for now
  'deepseek-chat':       'deepseek',
  'deepseek-reasoner':   'deepseek',
} as const

// R1-safe helper — pure function, no I/O
// Returns provider for a given modelId, falls back to anthropic
export function providerForModel(modelId: string): ProviderId {
  return MODEL_PROVIDER_MAP[modelId] ?? 'anthropic'
}
