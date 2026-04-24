// @liv-standard v1.5.1
// [F-chat/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1-wire-fix, phase-b-item2, phase-5.1-r1, phase-5-audit
// slice:      F-chat
// layer:      R2
// wires-in:
//   W-ATOM    LIV_ANCHOR       F-chat/R0
//   W-ATOM    LIV_SPEC         F-chat/R0
//   W-INJECT  persistMessage   F-chat/R4 (chat-db)
//   W-INJECT  getMessages      F-chat/R4 (chat-db)
//   W-INJECT  lmTraverseWrite    F-chat/R4 (lm-io)
//   W-HOOK   streamAIResponse F-ai-adapter/R3
//   W-HOOK   traverse         F-memory/R3
//   W-HOOK   getPresentState  F-memory/R3
//   W-HOOK   getApiKey        F-user-profile/R3
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
//
// phase-5.1-r1 (A2):
//   Removed redundant read-path memory calls (lmGetPresentState, lmTraverseRead).
//   Codec's processMessage() already does encode + traverse + decode. The
//   systemContext parameter carries the decoded graph context. Direct memory
//   reads here duplicated codec's work.
//   Retained: lmTraverseWrite for write-path (persisting LLM response to graph).
//   Codec does not handle the write path — it only processes inbound user messages.
//   Removed W-INJECT for lmGetPresentState and lmTraverseRead from manifest.

import { LIV_ANCHOR, LIV_SPEC } from '../config/chat-config'
import { persistMessage, getMessages as dbGetMessages } from '../exec/chat-db'
import { lmTraverseWrite } from '../exec/lm-io'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
import { traverse, getPresentState } from '@/features/F-memory/contract/memory-contract'
import { getApiKey } from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel } from '@/features/F-ai-adapter/config/ai-adapter-config'
import { PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'
import { generateId } from '@/core/types/primitives'

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
// phase-5.1-r1: read-path memory (getPresentState, traverseRead) removed.
// Codec pipeline now owns the read path. systemContext carries decoded graph context.
// Write path (lmTraverseWrite) retained — codec does not handle post-stream writes.

export interface SendMessageInput {
  projectId:      string
  content:        string
  modelId:        string
  userId:         string
  systemContext?: string  // phase-b-item2: decoded graph context from codec pipeline
}

export async function* sendMessage(input: SendMessageInput): AsyncGenerator<string> {
  const { projectId, content, modelId, userId, systemContext } = input

  // v1.1: MemoryDeps for write path only
  const memoryDeps = { traverse, getPresentState, userId }

  // Session rotation
  const state = getOrCreateSessionState(userId)
  if (shouldRotateSession(state)) {
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  const isFirstMessage = state.messageGaps.length === 0
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // Assemble system prompt
  // phase-5.1-r1: read-path memory removed. systemContext from codec is the sole context source.
  const systemParts: string[] = [LIV_ANCHOR]
  if (isFirstMessage) systemParts.push(LIV_SPEC)
  if (systemContext) systemParts.push(systemContext)

  const systemPrompt = systemParts.join('\n\n')

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user'   as const, content },
  ]

  // Load per-user API key
  const provider = providerForModel(modelId)
  let apiKey: string | null = null
  if (provider in PROVIDERS) {
    const keyResult = await getApiKey(userId, provider as ProviderId)
    apiKey = keyResult.ok ? keyResult.data : null
  }

  // Stream
  let fullResponse = ''
  for await (const chunk of streamAIResponse(messages, modelId, apiKey ?? undefined)) {
    if (chunk.content) {
      fullResponse += chunk.content
      yield chunk.content
    }
  }

  // §20 step 5: traverse(llmResponse) → write path (async, never blocks)
  // Also: persist both messages to chat history.
  Promise.all([
    lmTraverseWrite(fullResponse.slice(0, 500), memoryDeps),
    persistMessage({
      messageId: generateId('msg'), projectId, sessionId: lmSessionId, userId,
      role: 'user', content, status: 'complete',
      createdAt: Date.now(), completedAt: Date.now(), tokenCount: 0, modelId, parentMessageId: null,
    }),
    persistMessage({
      messageId: generateId('msg'), projectId, sessionId: lmSessionId, userId,
      role: 'assistant', content: fullResponse, status: 'complete',
      createdAt: Date.now(), completedAt: Date.now(), tokenCount: 0, modelId, parentMessageId: null,
    }),
  ]).catch(err => console.error('[chat] post-stream ops failed', err))
}

export async function getMessages(
  projectId: string,
  cursor: string | null = null,
  limit = 50,
) {
  const result = await dbGetMessages(projectId, cursor, limit)
  if (!result.ok) throw new Error(result.error.message)
  return result.data
}
