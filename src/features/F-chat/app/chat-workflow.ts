// @liv-standard v1.5.1
// [F-chat/R2]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    lm-v1.1-wire-fix, phase-b-item2, phase-5.1-r1, phase-5-audit, lm-v2-2-shot2, lm-v2-2-shot3, sprint-8-shot-3a (codec pipeline removed), sprint-8-shot-3b (LM v2.x reads + write removed), fixround-context-channel (LIV_ANCHOR/LIV_SPEC prepend deleted — the hardcoded pre-substrate context channel; messages now carry the present + the wearer's turn only, or the turn alone when the present is empty; dead isFirstMessage removed)
// slice:      F-chat
// category:   Modality
// layer:      R2
// wires-in:
//   W-INJECT  persistMessage   F-chat/R4 (chat-db)
//   W-INJECT  getMessages      F-chat/R4 (chat-db)
//   W-HOOK   streamAIResponse F-ai-adapter/R3
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
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-user-profile/contract/user-profile-contract
//   R0  @/features/F-ai-adapter/config/ai-adapter-config
//   R0  @/features/F-user-profile/config/provider-keys-config
//   R5  @/core/types/primitives
// validated:  pending
//
// sprint-8-shot-3b (F-memory dissolved):
//   Removed:
//     - traverse, Present imports (LM v2.x F-memory contract reads)
//     - ScopeFilter, AxisSet type imports
//     - lmTraverseWrite import (R4 lm-io adapter — file deleted in 3b)
//     - memoryDeps construction (no consumers after removals)
//     - post-stream lmTraverseWrite call (write-path to LM v2.x graph)
//   Sprint 9 wires substrate write of LLM response (channel='ai', scope=userId)
//   directly at the post-stream callback, replacing the deleted lmTraverseWrite.
//   Surviving flow: AI streaming + chat-db persistence (both unchanged).

import { persistMessage, getMessages as dbGetMessages } from '../exec/chat-db'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
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

export interface SendMessageInput {
  projectId:      string
  content:        string
  modelId:        string
  userId:         string
  systemContext?: string  // retained as optional; chat-contract.ts no longer
                          // populates it (codec pipeline removed at 3a).
                          // Sprint 9 wires substrate thread-query results here.
}

export async function* sendMessage(input: SendMessageInput): AsyncGenerator<string> {
  const { projectId, content, modelId, userId, systemContext } = input

  // Session rotation
  const state = getOrCreateSessionState(userId)
  if (shouldRotateSession(state)) {
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // Assemble the LLM messages. The substrate is the only context channel:
  // systemContext IS the present (F-present's resolution of the accumulated
  // ledger). When the present is non-empty it is the system message; when it
  // is empty the call carries the wearer's turn alone — no empty system message.
  const messages = systemContext
    ? [
        { role: 'system' as const, content: systemContext },
        { role: 'user'   as const, content },
      ]
    : [
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

  // sprint-8-shot-3b: lmTraverseWrite removed (F-memory LM v2.x dissolved).
  // substrate writeStateChange wired at chat-contract.ts (sprint-11-shot-2).
  // Chat-db persistence retained — chat history is independent of substrate.
  Promise.all([
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
