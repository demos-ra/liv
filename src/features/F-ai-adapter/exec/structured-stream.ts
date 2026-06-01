// @liv-standard v1.3
// @governing-spec COIN v1.0
// [F-ai-adapter/exec/structured-stream.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    sprint-COIN-shot-1 (structured-emit transport — net-new; was the
//             false "KEEP structured-stream.ts unchanged" in MANIFEST §B — C2)
//             dispatch-fix (structured-output mode as declared per-provider property —
//             StructuredMode imported; emitOpenAICompatible branches on declared mode)
// slice:      F-ai-adapter
// layer:      R4
// wires-in:
//   W-ATOM  PROVIDERS             @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  ProviderId            @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  StructuredMode        @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  providerForModel      @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  ChatMessage           @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  StructuredEmitConfig  @/features/F-ai-adapter/config/ai-adapter-config
// wires-out:
//   W-ATOM  streamStructuredEmit  →  F-present/R1 (COIN write-side); generic + reusable
//   W-ATOM  StructuredChunk       →  F-present/R1
// deps:
//   R0  @/features/F-user-profile/config/provider-keys-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config

// ─────────────────────────────────────────────────────────────────────────────
// WHAT THIS IS. A transport that sends a JSON SCHEMA and parses a STRUCTURED
// return — distinct from ai-io.ts's plain-message streamAIResponse (text deltas,
// no schema, no response_format). Generic and F-ai-adapter-owned; the COIN schema
// (SCORE_SCHEMA / SCORE_EMIT_CONFIG) is F-present-owned and rides this transport.
//
// A4 RECONCILIATION (C3 disclosure — this is the SECOND provider-touching exec
// file). "Provider HTTP calls live in F-ai-adapter/exec": ai-io.ts owns the plain
// streaming path (streamAIResponse — UNTOUCHED, the core loop's I1 baseline); this
// file owns the structured-emit path. No file OUTSIDE F-ai-adapter/exec touches a
// provider API. ai-io.ts's literal A4 note ("no OTHER file") narrows to "no other
// file outside this exec layer."
//
// DESIGN DECISION — STREAMING (surfaced per dispatch §6, not imposed). The scored
// emission's correctness lives ENTIRELY in the final parsed object. Per-provider
// streamed structured parsing (incremental JSON for chat/completions; tool_use
// partial_json deltas for Anthropic) adds real fragility for zero correctness
// gain at this stage. So this transport issues ONE structured request
// (stream:false) and parses the complete object. It remains an async generator
// (interface-consistent with the streaming path, future-proof) that yields a
// single `final` chunk. config.streamArray/streamField are retained as
// forward-modular descriptors for a later incremental-surface enhancement —
// advisory today, no behaviour bound to them.
//
// DESIGN DECISION — PER-PROVIDER STRUCTURED MECHANISM (VERIFY AT THE DEPLOY GATE
// against live provider docs; NOT recalled-as-fact, per the mechanical-verification
// rule). The BASE request (url / headers / model / messages / system split) is
// mirrored VERBATIM from ai-io.ts (in-tree, verified at time of writing). The
// structured PARAM added per provider is the documented mechanism and is isolated
// to a single line per handler, so a wrong shape is a one-line correction at deploy
// and never contaminates the verified base request.
// ─────────────────────────────────────────────────────────────────────────────

import { PROVIDERS }                                          from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId, StructuredMode }                    from '@/features/F-user-profile/config/provider-keys-config'
import { providerForModel }                                   from '@/features/F-ai-adapter/config/ai-adapter-config'
import type { ChatMessage, StructuredEmitConfig }             from '@/features/F-ai-adapter/config/ai-adapter-config'

// A structured chunk: a delta surface (advisory, reserved) or the final parsed
// object (the contract). The consumer narrows `structured: unknown` to its type
// (e.g. coin-score.emissionFromStructured → ScoredEmission; malformed → empty).
export type StructuredChunk =
  | { type: 'delta'; content: string;     done: false }
  | { type: 'final'; structured: unknown; done: true }

// Mirrors ai-io.ts resolveKey. Kept local to keep ai-io.ts's baseline path frozen
// (I1) — exporting from ai-io.ts would touch the file the dispatch freezes. Flagged
// single-source consolidation candidate (when a shared F-ai-adapter/exec util lands).
function resolveKey(provider: ProviderId, callerKey?: string): string | undefined {
  if (callerKey) return callerKey
  const envVar = PROVIDERS[provider]?.envFallback
  if (!envVar) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).process?.env?.[envVar] || undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = Record<string, any>

// Tolerant parse: a JSON string → object; an already-object → itself; else null.
// null flows to the consumer's narrower as "malformed" → graceful empty.
function parseLoose(content: unknown): unknown {
  if (content && typeof content === 'object') return content
  if (typeof content !== 'string') return null
  try { return JSON.parse(content) } catch { return null }
}

// ── OpenAI / DeepSeek (/chat/completions) ─────────────────────────────────────
// Base request identical to ai-io.ts streamFromOpenAI / streamFromDeepSeek (minus
// stream). Structured param branches on the declared structuredMode:
//   json_schema  → response_format json_schema (OpenAI; provider-enforced)
//   json_object  → response_format json_object + schema injected into system message
//                  (DeepSeek: rejects json_schema; requires "json" in prompt;
//                   no provider-side schema enforcement — emissionFromStructured
//                   narrower handles malformed → graceful empty)
// VERIFY AT DEPLOY against live provider docs per mechanical-verification rule.
async function emitOpenAICompatible(
  baseUrl: string, messages: ChatMessage[], modelId: string, apiKey: string,
  config: StructuredEmitConfig, mode: StructuredMode,
): Promise<unknown> {
  // For json_object mode: inject schema + "json" into system message so the
  // provider (a) doesn't error on missing "json" keyword and (b) has the schema
  // as a prompt-side constraint (no provider enforcement assumed).
  const augmentedMessages: ChatMessage[] = mode === 'json_object'
    ? (() => {
        const schemaInstruction = `Respond ONLY with valid json matching this schema:\n${JSON.stringify(config.schema, null, 2)}`
        const existingSystem = messages.find(m => m.role === 'system')
        const otherMessages  = messages.filter(m => m.role !== 'system')
        const systemContent  = existingSystem
          ? `${existingSystem.content}\n\n${schemaInstruction}`
          : schemaInstruction
        return [{ role: 'system' as const, content: systemContent }, ...otherMessages]
      })()
    : messages

  const structuredParam = mode === 'json_schema'
    ? { response_format: { type: 'json_schema', json_schema: { name: 'emit', schema: config.schema, strict: true } } }
    : { response_format: { type: 'json_object' } }

  const res = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model:    modelId,
      messages: augmentedMessages.map(m => ({ role: m.role, content: m.content })),
      stream:   false,
      // DESIGN DECISION (verify at deploy): structured param varies by declared mode.
      ...structuredParam,
    }),
  })
  if (!res.ok) throw new Error(`structured ${res.status}: ${await res.text()}`)
  const data = await res.json() as AnyJson
  return parseLoose(data.choices?.[0]?.message?.content)
}

// ── Anthropic (/v1/messages) ──────────────────────────────────────────────────
// Base request identical to ai-io.ts streamFromAnthropic (system split out, minus
// stream). Structured param is the deploy-verify design decision: Anthropic's
// native structured output is forced tool use — the schema rides input_schema and
// the structured object comes back as the tool_use block's `input`.
async function emitAnthropic(
  baseUrl: string, messages: ChatMessage[], modelId: string, apiKey: string, config: StructuredEmitConfig,
): Promise<unknown> {
  const systemMsgs = messages.filter(m => m.role === 'system')
  const convMsgs   = messages.filter(m => m.role !== 'system')
  const res = await fetch(`${baseUrl}/v1/messages`, {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      modelId,
      max_tokens: 4096,
      system:     systemMsgs[0]?.content,
      messages:   convMsgs.map(m => ({ role: m.role, content: m.content })),
      // DESIGN DECISION (verify at deploy): Anthropic structured output = forced tool.
      tools:       [{ name: 'emit', description: 'Return the structured emission.', input_schema: config.schema }],
      tool_choice: { type: 'tool', name: 'emit' },
    }),
  })
  if (!res.ok) throw new Error(`structured ${res.status}: ${await res.text()}`)
  const data  = await res.json() as AnyJson
  const block = Array.isArray(data.content)
    ? data.content.find((b: AnyJson) => b.type === 'tool_use')
    : undefined
  return block?.input ?? null
}

// ── Dispatch map — PROVIDERS-driven, no switch (mirrors ai-io.ts A1) ───────────
// Handler signature carries mode for openai-compatible providers; emitAnthropic
// ignores it (its mechanism — forced tool — is fixed and already correct).
type StructuredHandler = (
  baseUrl: string, messages: ChatMessage[], modelId: string, apiKey: string,
  config: StructuredEmitConfig, mode: StructuredMode,
) => Promise<unknown>

// emitAnthropic has a fixed mechanism — wrap it to satisfy the shared signature.
function wrapAnthropic(
  baseUrl: string, messages: ChatMessage[], modelId: string, apiKey: string,
  config: StructuredEmitConfig, _mode: StructuredMode,
): Promise<unknown> {
  return emitAnthropic(baseUrl, messages, modelId, apiKey, config)
}

const STRUCTURED_HANDLERS: Partial<Record<ProviderId, StructuredHandler>> = {
  anthropic: wrapAnthropic,
  openai:    emitOpenAICompatible,
  deepseek:  emitOpenAICompatible,
}

// ── Main export ───────────────────────────────────────────────────────────────
// Async generator (interface-consistent with the streaming path). Yields one
// `final` chunk carrying the parsed structured object. No key / no handler → a
// graceful empty final (the consumer's narrower turns it into empty positions).
export async function* streamStructuredEmit(
  messages: ChatMessage[],
  modelId:  string,
  config:   StructuredEmitConfig,
  apiKey?:  string,
): AsyncGenerator<StructuredChunk> {
  const provider    = providerForModel(modelId)
  const resolvedKey = resolveKey(provider, apiKey)
  const handler     = STRUCTURED_HANDLERS[provider]

  if (!resolvedKey || !handler) {
    yield { type: 'final', structured: null, done: true }
    return
  }

  const baseUrl    = PROVIDERS[provider].baseUrl
  const mode       = PROVIDERS[provider].structuredMode
  const structured = await handler(baseUrl, messages, modelId, resolvedKey, config, mode)
  yield { type: 'final', structured, done: true }
}
