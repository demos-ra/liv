// @liv-standard v1.0
// [F-chat/app/chat-workflow.ts]
// Built with LIV · livai.dev
// R2: orchestration, depends R0 + R1 + R4 only.
// A5: cross-slice AI call goes through F-ai-adapter contract only.
// Phase 4 change: loads per-user API key from api-key-db before streaming.
// Key lookup is non-blocking on failure — falls back to env gracefully.

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
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // Memory context — fast, no embedding
  const memoryContext = await lmRecall(content, memoryDeps, content.startsWith('/recall'))

  const systemPrompt = memoryContext
    ? `You are Liv, an AI software collaborator.\n\nMemory context:\n${memoryContext}`
    : `You are Liv, an AI software collaborator.`

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
