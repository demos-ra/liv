// [F-chat/app/chat-workflow.ts]
// R2 — Chat orchestration with Living Memory integration.
// Dependency path: R2 → own R4 (lm-io, chat-db) + F-ai-adapter/contract (R3→R3)

import { db, taggedDb } from '@/core/db/client'
import { createChatDb } from '../exec/chat-db'
import { lmWriteEvent, lmRecall, lmRemember, lmSessionEnd } from '../exec/lm-io'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'

// ── Session State ─────────────────────────────────────────────────────────────

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

// ── Send Message ──────────────────────────────────────────────────────────────

export interface SendMessageInput {
  projectId: string
  content:   string
  modelId:   string
  userId:    string
}

export async function* sendMessage(input: SendMessageInput): AsyncGenerator<string> {
  const chatDb = createChatDb(taggedDb(db))
  const { projectId, content, modelId, userId } = input

  const state = getOrCreateSessionState(userId)
  if (shouldRotateSession(state)) {
    await lmSessionEnd(state.lmSessionId)
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  await lmWriteEvent(content, 'episodic', lmSessionId)

  const isDeepRecall = content.startsWith('/recall')
  const memoryContext = await lmRecall(content, isDeepRecall)

  const systemPrompt = memoryContext
    ? `You are Liv, an AI software collaborator.\n\nMemory context:\n${memoryContext}`
    : `You are Liv, an AI software collaborator.`

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user'   as const, content },
  ]

  let fullResponse = ''
  for await (const chunk of streamAIResponse(messages, modelId)) {
    if (chunk.content) {
      fullResponse += chunk.content
      yield chunk.content
    }
  }

  await chatDb.saveMessage({ projectId, role: 'user',      content })
  await chatDb.saveMessage({ projectId, role: 'assistant', content: fullResponse })

  await lmRemember('chat', 'liv', 'said', fullResponse.slice(0, 200), lmSessionId)
}

export async function getMessages(projectId: string, limit = 50) {
  const chatDb = createChatDb(taggedDb(db))
  return chatDb.getMessages(projectId, limit)
}
