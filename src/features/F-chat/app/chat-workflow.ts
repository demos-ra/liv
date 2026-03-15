// @liv-standard v1.3
// [F-chat/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-chat
// layer:      R2
// wires-in:
//   W-ATOM    LIV_ANCHOR       F-chat/R0
//   W-ATOM    LIV_SPEC         F-chat/R0
//   W-INJECT  persistMessage   F-chat/R4 (chat-db)
//   W-INJECT  getMessages      F-chat/R4 (chat-db)
//   W-INJECT  lmWriteEvent     F-chat/R4 (lm-io)
//   W-INJECT  lmRecall         F-chat/R4 (lm-io)
//   W-INJECT  lmRemember       F-chat/R4 (lm-io)
//   W-INJECT  lmSessionEnd     F-chat/R4 (lm-io)
//   W-INJECT  streamAIResponse F-ai-adapter/R3
//   W-INJECT  remember         F-memory/R3
//   W-INJECT  recall           F-memory/R3
//   W-INJECT  onSessionEnd     F-memory/R3
//   W-INJECT  getApiKey        F-user-profile/R3
//   W-ATOM    providerForModel F-ai-adapter/R0
//   W-ATOM    PROVIDERS        F-user-profile/R0
//   W-ATOM    ProviderId       F-user-profile/R0
//   W-ATOM    generateId       core/R5
// wires-out:
//   W-ATOM  SendMessageInput  →  F-chat/R3
//   W-ATOM  sendMessage       →  F-chat/R3
//   W-ATOM  getMessages       →  F-chat/R3
// deps:
//   R0  ../config/chat-config
//   R4  ../exec/chat-db
//   R4  ../exec/lm-io
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-memory/contract/memory-contract
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R0  @/features/F-user-profile/config/provider-keys-config
//   R5  @/core/types/primitives
// validated:  pending

import { LIV_ANCHOR, LIV_SPEC } from '../config/chat-config'
import { persistMessage, getMessages as dbGetMessages } from '../exec/chat-db'
import { lmWriteEvent, lmRecall, lmRemember, lmSessionEnd } from '../exec/lm-io'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
import { remember, recall, onSessionEnd } from '@/features/F-memory/contract/memory-contract'
import { getApiKey } from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel } from '@/features/F-ai-adapter/config/ai-adapter-config'
import { PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'
import { generateId } from '@/core/types/primitives'

const memoryDeps = { remember, recall, onSessionEnd }

// ── Session state ─────────────────────────────────────────────────────────────

interface SessionState {
  lmSessionId:   string
  lastMessageAt: number
  messageGaps:   number[]
}

const sessionStates = new Map<string, SessionState>()

function getOrCreateSessionState(userId: string): SessionState {
  if (!sessionStates.has(userId)) {
    sessionStates.set(userId, {
      lmSessionId:   crypto.randomUUID(),
      lastMessageAt: Date.now(),
      messageGaps:   [],
    })
  }
  return sessionStates.get(userId)!
}

function shouldRotateSession(state: SessionState): boolean {
  const timeSinceLast = Date.now() - state.lastMessageAt
  if (state.messageGaps.length === 0) return false
  if (timeSinceLast > 15 * 60 * 1000) return true
  const avg = state.messageGaps.reduce((a, b) => a + b, 0) / state.messageGaps.length
  return timeSinceLast / avg > 3.0
}

function updateSessionState(state: SessionState): void {
  const now = Date.now()
  state.messageGaps.push(now - state.lastMessageAt)
  if (state.messageGaps.length > 10) state.messageGaps.shift()
  state.lastMessageAt = now
}

// ── Send message ──────────────────────────────────────────────────────────────

export interface SendMessageInput {
  projectId: string
  content:   string
  modelId:   string
  userId:    string
}

export async function* sendMessage(input: SendMessageInput): AsyncGenerator<string> {
  const { projectId, content, modelId, userId } = input

  // Session rotation
  const state = getOrCreateSessionState(userId)
  if (shouldRotateSession(state)) {
    lmSessionEnd(state.lmSessionId, memoryDeps).catch(() => {})
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  // isFirstMessage captured before updateSessionState mutates messageGaps.
  // Zero gaps = no message has been processed in this session yet.
  const isFirstMessage = state.messageGaps.length === 0
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // Memory context — fast, no embedding
  const memoryContext = await lmRecall(content, memoryDeps, content.startsWith('/recall'))

  // Session-aware system prompt assembly.
  // Anchor (identity) sent on every call.
  // Spec (reasoning framework) sent on first message only — lives in history thereafter.
  // After session rotation, messageGaps resets to [] so spec re-injects on first message of new session.

  const systemParts: string[] = [LIV_ANCHOR]
  if (isFirstMessage) systemParts.push(LIV_SPEC)
  if (memoryContext) systemParts.push(`Memory context:
${memoryContext}`)

  const systemPrompt = systemParts.join('\n\n')

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user'   as const, content },
  ]

  // Phase 4: load per-user API key for this model's provider.
  // Non-blocking — null falls back to env var in ai-io.ts.
  // A4: I/O call isolated here at R2 boundary, never inside R4 stream loop.
  const provider = providerForModel(modelId)
  // A3: guard narrows ai-adapter's Provider ('anthropic'|'openai'|'deepseek') to
  // user-profile's ProviderId ('anthropic'|'deepseek') — openai has no user-key flow.
  const apiKey = (provider in PROVIDERS)
    ? await getApiKey(userId, provider as ProviderId).catch(() => null)
    : null

  // Stream
  let fullResponse = ''
  for await (const chunk of streamAIResponse(messages, modelId, apiKey ?? undefined)) {
    if (chunk.content) {
      fullResponse += chunk.content
      yield chunk.content
    }
  }

  // Post-stream ops — never block the stream
  const now = Date.now()
  Promise.all([
    lmWriteEvent(content, 'episodic', lmSessionId, memoryDeps),
    lmRemember('chat', 'liv', 'said', fullResponse.slice(0, 200), lmSessionId, memoryDeps),
    persistMessage({
      messageId: generateId('msg'), projectId, sessionId: lmSessionId, userId,
      role: 'user', content, status: 'complete',
      createdAt: now, completedAt: now, tokenCount: 0, modelId, parentMessageId: null,
    }),
    persistMessage({
      messageId: generateId('msg'), projectId, sessionId: lmSessionId, userId,
      role: 'assistant', content: fullResponse, status: 'complete',
      createdAt: now, completedAt: now, tokenCount: 0, modelId, parentMessageId: null,
    }),
  ]).catch(err => console.error('[chat] post-stream ops failed', err))
}

export async function getMessages(
  projectId: string,
  cursor: string | null = null,
  limit = 50,
) {
  return dbGetMessages(projectId, cursor, limit)
}
