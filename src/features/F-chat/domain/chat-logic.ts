// @liv-standard v1.3
// [F-chat/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-chat
// layer:      R1
// wires-in:
//   W-ATOM  CHAT_CONFIG   F-chat/R0
//   W-ATOM  ChatMessage   F-chat/R0
// wires-out:
//   W-ATOM  buildUserMessage          →  F-chat/R1 (internal)
//   W-ATOM  buildAssistantMessage     →  F-chat/R1 (internal)
//   W-ATOM  completeAssistantMessage  →  F-chat/R1 (internal)
//   W-ATOM  validateMessageContent    →  F-chat/R3
//   W-ATOM  buildCursor               →  F-chat/R4
//   W-ATOM  parseCursor               →  F-chat/R4
// deps:
//   R0  ../config/chat-config
//   R5  crypto
// validated:  pending

import { CHAT_CONFIG } from '../config/chat-config'
import type { ChatMessage } from '../config/chat-config'
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
