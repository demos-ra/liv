// [F-chat/app/chat-workflow.ts]
// R2 — Chat orchestration with Living Memory integration.

import { persistMessage, getMessages as dbGetMessages } from '../exec/chat-db'
import { lmWriteEvent, lmRecall, lmRemember, lmSessionEnd } from '../exec/lm-io'
import { streamAIResponse } from '@/features/F-ai-adapter/contract/ai-contract'
import { remember, recall, onSessionEnd } from '@/features/F-memory/contract/memory-contract'
import { generateId } from '@/core/types/primitives'

const memoryDeps = { remember, recall, onSessionEnd }

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

export interface SendMessageInput {
  projectId: string
  content:   string
  modelId:   string
  userId:    string
}

export async function* sendMessage(input: SendMessageInput): AsyncGenerator<string> {
  const { projectId, content, modelId, userId } = input

  const state = getOrCreateSessionState(userId)
  if (shouldRotateSession(state)) {
    lmSessionEnd(state.lmSessionId, memoryDeps).catch(() => {})
    state.lmSessionId = crypto.randomUUID()
    state.messageGaps = []
  }
  updateSessionState(state)
  const lmSessionId = state.lmSessionId

  // Recall memory context BEFORE streaming (fast — just diffusion, no embedding)
  const memoryContext = await lmRecall(content, memoryDeps, content.startsWith('/recall'))

  const systemPrompt = memoryContext
    ? `You are Liv, an AI software collaborator.\n\nMemory context:\n${memoryContext}`
    : `You are Liv, an AI software collaborator.`

  const messages = [
    { role: 'system' as const, content: systemPrompt },
    { role: 'user'   as const, content },
  ]

  // Stream first — no blocking calls before or during
  let fullResponse = ''
  for await (const chunk of streamAIResponse(messages, modelId)) {
    if (chunk.content) {
      fullResponse += chunk.content
      yield chunk.content
    }
  }

  // Memory + persistence AFTER stream completes — never block the stream
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

export async function getMessages(projectId: string, cursor: string | null = null, limit = 50) {
  return dbGetMessages(projectId, cursor, limit)
}
