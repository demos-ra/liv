// @liv-standard v1.0
// [F-ai-adapter/exec/ai-io.ts]
// Built with LIV · livai.dev
// R4: I/O only, depends R0 only.
// A4: all provider HTTP calls live here — no other file touches provider APIs.
// Phase 4 change: streamAIResponse accepts optional apiKey + explicit provider param.
// Fallback chain: user key → env var → mock (never hard fails silently).
// Modular: adding a provider = add one case to getProviderStream, nothing else.

import { providerForModel } from '../config/ai-adapter-config'
import type { ChatMessage, StreamChunk, Provider as ProviderId } from '../config/ai-adapter-config'

// ── Provider base URLs (A6: declared here at R4, not scattered) ──────────────

const PROVIDER_BASES: Record<ProviderId, string> = {
  anthropic: 'https://api.anthropic.com',
  deepseek:  'https://api.deepseek.com/v1',
  openai:    'https://api.openai.com/v1',
}

// ── Key resolution ────────────────────────────────────────────────────────────
// Priority: caller-supplied key → env fallback → undefined (triggers mock)

function resolveKey(provider: ProviderId, callerKey?: string): string | undefined {
  if (callerKey) return callerKey
  const envMap: Record<ProviderId, string> = {
    anthropic: process.env.ANTHROPIC_API_KEY ?? '',
    deepseek:  process.env.DEEPSEEK_API_KEY  ?? '',
    openai:    process.env.OPENAI_API_KEY    ?? '',
  }
  return envMap[provider] || undefined
}

// ── DeepSeek ──────────────────────────────────────────────────────────────────

async function* streamFromDeepSeek(
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
): AsyncGenerator<StreamChunk> {
  const res = await fetch(`${PROVIDER_BASES.deepseek}/chat/completions`, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model:    modelId ?? 'deepseek-chat',
      messages: messages.map(m => ({ role: m.role, content: m.content })),
      stream:   true,
    }),
  })

  if (!res.ok) throw new Error(`DeepSeek ${res.status}: ${await res.text()}`)

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
        const chunk   = JSON.parse(raw)
        const content = chunk.choices?.[0]?.delta?.content
        if (content) yield { content, totalTokens: null, done: false }
      } catch {}
    }
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Anthropic ─────────────────────────────────────────────────────────────────

async function* streamFromAnthropic(
  messages: ChatMessage[],
  modelId:  string,
  apiKey:   string,
): AsyncGenerator<StreamChunk> {
  const systemMessages      = messages.filter(m => m.role === 'system')
  const conversationMessages = messages.filter(m => m.role !== 'system')

  const res = await fetch(`${PROVIDER_BASES.anthropic}/v1/messages`, {
    method:  'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      modelId ?? 'claude-sonnet-4-6',
      max_tokens: 4096,
      system:     systemMessages[0]?.content,
      messages:   conversationMessages.map(m => ({ role: m.role, content: m.content })),
      stream:     true,
    }),
  })

  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)

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
      try {
        const event = JSON.parse(raw)
        if (event.type === 'content_block_delta' && event.delta?.text) {
          yield { content: event.delta.text, totalTokens: null, done: false }
        }
      } catch {}
    }
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Mock (no key available) ───────────────────────────────────────────────────

async function* streamMock(messages: ChatMessage[]): AsyncGenerator<StreamChunk> {
  const last = messages[messages.length - 1]?.content ?? ''
  const response = `To get started, paste your API key in account settings (top right).`
  void last
  for (const char of response) {
    yield { content: char, totalTokens: null, done: false }
    await new Promise(resolve => setTimeout(resolve, 12))
  }
  yield { content: '', totalTokens: null, done: true }
}

// ── Main export ───────────────────────────────────────────────────────────────
// A3: typed boundary — callers pass apiKey? (optional), provider derived from modelId.
// Backward compatible: callers that don't pass apiKey get env fallback behaviour.

export async function* streamAIResponse(
  messages: ChatMessage[],
  modelId:  string,
  apiKey?:  string,          // Phase 4: per-user key, optional — falls back to env
): AsyncGenerator<StreamChunk> {
  const provider    = providerForModel(modelId)
  const resolvedKey = resolveKey(provider, apiKey)

  if (!resolvedKey) {
    yield* streamMock(messages)
    return
  }

  switch (provider) {
    case 'anthropic':
      yield* streamFromAnthropic(messages, modelId, resolvedKey)
      break
    case 'deepseek':
      yield* streamFromDeepSeek(messages, modelId, resolvedKey)
      break
    default:
      yield* streamMock(messages)
  }
}

export type { ChatMessage, StreamChunk }
