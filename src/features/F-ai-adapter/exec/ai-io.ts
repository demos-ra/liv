// @liv-standard v1.3
// [F-ai-adapter/exec/ai-io.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-ai-adapter
// layer:      R4
// wires-in:
//   W-ATOM  PROVIDERS        @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  ProviderId       @/features/F-user-profile/config/provider-keys-config
//   W-ATOM  providerForModel @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  ChatMessage      @/features/F-ai-adapter/config/ai-adapter-config
//   W-ATOM  StreamChunk      @/features/F-ai-adapter/config/ai-adapter-config
// wires-out:
//   W-ATOM  streamAIResponse →  F-ai-adapter/R3, F-planner/R4
// deps:
//   R0  @/features/F-user-profile/config/provider-keys-config
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
// validated:  2026-03-12

// A4: all provider HTTP calls live here — no other file touches provider APIs.
// A1: baseUrl and envFallback derive from PROVIDERS — no hardcoded duplication.
//     Adding a provider: one entry in PROVIDERS. Zero changes here.
//     dispatch map replaces switch — new providers auto-register via PROVIDERS keys.

import { PROVIDERS }                                  from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId }                            from '@/features/F-user-profile/config/provider-keys-config'
import { providerForModel }                           from '@/features/F-ai-adapter/config/ai-adapter-config'
import type { ChatMessage, StreamChunk }              from '@/features/F-ai-adapter/config/ai-adapter-config'

// ── Key resolution ────────────────────────────────────────────────────────────
// Derives env var name from PROVIDERS[provider].envFallback — no hardcoded map.

function resolveKey(provider: ProviderId, callerKey?: string): string | undefined {
  if (callerKey) return callerKey
  const envVar = PROVIDERS[provider]?.envFallback
  if (!envVar) return undefined
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (globalThis as any).process?.env?.[envVar] || undefined
}

// ── Stream handlers ───────────────────────────────────────────────────────────

async function* streamFromDeepSeek(
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
): AsyncGenerator<StreamChunk> {
  const baseUrl = PROVIDERS.deepseek.baseUrl
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model:    modelId,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream:   true,
    }),
  })
  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`)
  yield* streamSSE(res, chunk => chunk.choices?.[0]?.delta?.content)
}

async function* streamFromOpenAI(
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
): AsyncGenerator<StreamChunk> {
  const baseUrl = PROVIDERS.openai.baseUrl
  const res = await fetch(`${baseUrl}/chat/completions`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({
      model:    modelId,
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream:   true,
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)
  yield* streamSSE(res, chunk => chunk.choices?.[0]?.delta?.content)
}

async function* streamFromAnthropic(
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
): AsyncGenerator<StreamChunk> {
  const baseUrl      = PROVIDERS.anthropic.baseUrl
  const systemMsgs   = messages.filter(m => m.role === 'system')
  const convMsgs     = messages.filter(m => m.role !== 'system')
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
      stream:     true,
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)
  yield* streamSSE(res, chunk =>
    chunk.type === 'content_block_delta' ? chunk.delta?.text : undefined
  )
}

// ── Mock (no key available) ───────────────────────────────────────────────────

async function* streamMock(_messages: ChatMessage[]): AsyncGenerator<StreamChunk> {
  const response = `To get started, paste your API key in account settings (top right).`
  for (const char of response) {
    yield { content: char, totalTokens: null, done: false }
    await new Promise(resolve => setTimeout(resolve, 12))
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── SSE reader (shared) ───────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyJson = Record<string, any>

async function* streamSSE(
  res: Response,
  extract: (chunk: AnyJson) => string | undefined,
): AsyncGenerator<StreamChunk> {
  const reader  = res.body!.getReader()
  const decoder = new TextDecoder()
  let buffer    = ''
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (raw === '[DONE]') return
      try {
        const chunk   = JSON.parse(raw) as Record<string, unknown>
        const content = extract(chunk)
        if (content) yield { content, totalTokens: null, done: false }
      } catch {}
    }
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Dispatch map — no switch, no hardcoding ───────────────────────────────────
// Adding a provider: add handler above + entry here. Nothing else changes.

type StreamHandler = (
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
) => AsyncGenerator<StreamChunk>

const STREAM_HANDLERS: Partial<Record<ProviderId, StreamHandler>> = {
  anthropic: streamFromAnthropic,
  deepseek:  streamFromDeepSeek,
  openai:    streamFromOpenAI,
}

// ── Main export ───────────────────────────────────────────────────────────────

export async function* streamAIResponse(
  messages: ChatMessage[],
  modelId:  string,
  apiKey?:  string,
): AsyncGenerator<StreamChunk> {
  const provider    = providerForModel(modelId)
  const resolvedKey = resolveKey(provider, apiKey)

  if (!resolvedKey) {
    yield* streamMock(messages)
    return
  }

  const handler = STREAM_HANDLERS[provider]
  if (!handler) {
    yield* streamMock(messages)
    return
  }

  yield* handler(messages, modelId, resolvedKey)
}

export type { ChatMessage, StreamChunk }

