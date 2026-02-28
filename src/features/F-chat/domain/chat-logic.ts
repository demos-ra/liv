// [F-chat/R1/C2] Chat domain logic
// R1: pure functions only. No I/O, no side effects, no imports from R2/R3/R4.

import { CHAT_CONFIG, SYSTEM_PROMPT } from '../config/chat-config'
import type { ChatMessage, MessageRole } from '../config/chat-config'
import { randomUUID } from 'crypto'

// --- Message builders ---

export function buildUserMessage(
  projectId: string,
  sessionId: string,
  userId: string,
  content: string
): ChatMessage {
  const now = Date.now()
  return {
    messageId: randomUUID(),
    projectId,
    sessionId,
    userId,
    role: 'user',
    content,
    status: 'complete',
    createdAt: now,
    completedAt: now,
    tokenCount: null,
    modelId: null,
    parentMessageId: null,
  }
}

export function buildAssistantMessage(
  projectId: string,
  sessionId: string,
  userId: string,
  modelId: string,
  parentMessageId: string
): ChatMessage {
  const now = Date.now()
  return {
    messageId: randomUUID(),
    projectId,
    sessionId,
    userId,
    role: 'assistant',
    content: '',
    status: 'streaming',
    createdAt: now,
    completedAt: null,
    tokenCount: null,
    modelId,
    parentMessageId,
  }
}

export function completeAssistantMessage(
  msg: ChatMessage,
  content: string,
  tokenCount: number
): ChatMessage {
  return {
    ...msg,
    content,
    status: 'complete',
    completedAt: Date.now(),
    tokenCount,
  }
}

// --- Validation ---

export function validateMessageContent(content: unknown): { valid: boolean; error?: string } {
  if (typeof content !== 'string') return { valid: false, error: 'content must be a string' }
  if (content.trim().length === 0) return { valid: false, error: 'content is empty' }
  if (content.length > CHAT_CONFIG.maxMessageLength) return { valid: false, error: 'content too long' }
  return { valid: true }
}

// --- Thread formatter ---

function formatThreadForContext(
  history: ChatMessage[]
): Array<{ role: MessageRole; content: string }> {
  return history
    .slice(-CHAT_CONFIG.contextWindow)
    .map((m) => ({ role: m.role, content: m.content }))
}

// --- Full context builder for AI request ---
// Prepends system prompt (with optional memory context injected),
// appends history, then current user message.
// History is optional — safe to pass empty array in demo mode.

export function buildMessageContext(
  currentContent: string,
  history: ChatMessage[] = [],
  memoryContext?: string
): Array<{ role: MessageRole; content: string }> {
  const thread = formatThreadForContext(history)

  const systemContent = memoryContext
    ? `${SYSTEM_PROMPT}\n\nMemory context:\n${memoryContext}`
    : SYSTEM_PROMPT

  return [
    { role: 'system', content: systemContent },
    ...thread,
    { role: 'user', content: currentContent },
  ]
}

// --- Cursor pagination ---

export function buildCursor(message: ChatMessage): string {
  return Buffer.from(`${message.createdAt}::${message.messageId}`).toString('base64')
}

export function parseCursor(cursor: string): { createdAt: number; messageId: string } | null {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf-8')
    const [createdAt, messageId] = decoded.split('::')
    if (!createdAt || !messageId) return null
    return { createdAt: Number(createdAt), messageId }
  } catch {
    return null
  }
}
