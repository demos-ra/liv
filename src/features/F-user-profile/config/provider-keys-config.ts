// @liv-standard v1.3
// [F-user-profile/config/provider-keys-config.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    dispatch-fix (structured-output mode as declared per-provider property —
//             StructuredMode type exported; structuredMode field added to each PROVIDERS entry)
// slice:      F-user-profile
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  ProviderId      →  F-ai-adapter/R0, F-user-profile/R4, F-planner/R3, F-chat/R2, F-chat/R3
//   W-ATOM  ProviderConfig  →  F-user-profile/R3
//   W-ATOM  StructuredMode  →  F-ai-adapter/R4
//   W-ATOM  PROVIDERS       →  F-ai-adapter/R4, F-chat/R3, F-chat/R2
//   W-ATOM  PROVIDER_ORDER  →  F-chat/R3
// deps:       none
// validated:  2026-03-12

// A1: F-user-profile owns PROVIDERS and ProviderId — the UI/key registry.
//     Adding a provider: one entry here. Zero other files change.
//     F-ai-adapter owns MODELS and providerForModel — model registry is separate concern.
//     PROVIDERS[id].envFallback and baseUrl are the single source for key resolution and HTTP base URLs.
//     PROVIDERS[id].structuredMode is the single source for the per-provider structured-output mechanism.
//     Closed union: 'tool' (Anthropic forced tool use) | 'json_schema' (OpenAI response_format) |
//     'json_object' (DeepSeek — schema injected into system message; no provider-side enforcement).

export type StructuredMode = 'tool' | 'json_schema' | 'json_object'

export const PROVIDERS = {
  anthropic: {
    id:             'anthropic' as const,
    label:          'Anthropic',
    placeholder:    'sk-ant-...',
    envFallback:    'ANTHROPIC_API_KEY',
    baseUrl:        'https://api.anthropic.com',
    structuredMode: 'tool'        as const satisfies StructuredMode,
  },
  deepseek: {
    id:             'deepseek' as const,
    label:          'DeepSeek',
    placeholder:    'sk-...',
    envFallback:    'DEEPSEEK_API_KEY',
    baseUrl:        'https://api.deepseek.com/v1',
    structuredMode: 'json_object' as const satisfies StructuredMode,
  },
  openai: {
    id:             'openai' as const,
    label:          'OpenAI',
    placeholder:    'sk-...',
    envFallback:    'OPENAI_API_KEY',
    baseUrl:        'https://api.openai.com/v1',
    structuredMode: 'json_schema' as const satisfies StructuredMode,
  },
} as const

// Derived types — callers use these, never raw strings
export type ProviderId     = keyof typeof PROVIDERS
export type ProviderConfig = typeof PROVIDERS[ProviderId]

// Ordered list for UI rendering — controls display order in account panel
export const PROVIDER_ORDER: ProviderId[] = ['anthropic', 'deepseek', 'openai']
