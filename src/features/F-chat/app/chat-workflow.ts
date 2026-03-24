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
//   W-INJECT  lmGetPresentState  F-chat/R4 (lm-io)
//   W-INJECT  lmTraverseRead     F-chat/R4 (lm-io)
//   W-INJECT  lmTraverseWrite    F-chat/R4 (lm-io)
//   W-INJECT  streamAIResponse F-ai-adapter/R3
//   W-INJECT  traverse         F-memory/R3
//   W-INJECT  getPresentState  F-memory/R3
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
import { lmGetPresentState, lmTraverseRead, lmTraverseWrite } from '../exec/lm-io'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
import { traverse, getPresentState } from '@/features/F-memory/contract/memory-contract'
import { getApiKey } from '@/features/F-user-profile/contract/user-profile-contract'
import { providerForModel } from '@/features/F-ai-adapter/config/ai-adapter-config'
import { PROVIDERS } from '@/features/F-user-profile/config/provider-keys-config'
import type { ProviderId } from '@/features/F-user-profile/config/provider-keys-config'
import { generateId } from '@/core/types/primitives'

// v1.0: MemoryDeps maps to traverse + getPresentState (replaces remember/recall/onSessionEnd)
const memoryDeps = { traverse, getPresentState }

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
// v1.0 §20 flow:
//   1. getPresentState() → system context (who is this person)
//   2. traverse(userMessage, { returnActivation: true }) → query-specific context
//   3. Both injected into LLM context
//   4. LLM responds (streamed)
//   5. traverse(llmResponse) → write path, no activation returned

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
    // v1.0: no onSessionEnd needed — traversal handles everything
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  const isFirstMessage = state.messageGaps.length === 0
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // §20 step 1: getPresentState() → persistent background context
  const presentStateContext = lmGetPresentState(memoryDeps)

  // §20 step 2: traverse(userMessage) → query-specific activated context
  const traversalContext = await lmTraverseRead(content, memoryDeps)

  // Assemble system prompt
  const systemParts: string[] = [LIV_ANCHOR]
  if (isFirstMessage) systemParts.push(LIV_SPEC)
  if (presentStateContext) systemParts.push(`Memory (who you are talking to):\n${presentStateContext}`)
  if (traversalContext) systemParts.push(`Memory (relevant to this message):\n${traversalContext}`)

  const systemPrompt = systemParts.join('\n\n')

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user'   as const, content },
  ]

  // Load per-user API key
  const provider = providerForModel(modelId)
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

  // §20 step 5: traverse(llmResponse) → write path (async, never blocks)
  // Also: traverse user message write path (content was read above, now write)
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
  return dbGetMessages(projectId, cursor, limit)
}
