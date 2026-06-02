// @liv-standard v1.3
// [F-chat/R1]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    foundation-group3b (buildCursor/parseCursor relocated to R0 chat-config; R1 cursor section replaced with redirect comment)
// slice:      F-chat
// category:   Modality
// layer:      R1
// wires-in:
//   W-ATOM  CHAT_CONFIG   F-chat/R0
//   W-ATOM  ChatMessage   F-chat/R0
// wires-out:
//   W-ATOM  buildUserMessage          →  F-chat/R1 (internal)
//   W-ATOM  buildAssistantMessage     →  F-chat/R1 (internal)
//   W-ATOM  completeAssistantMessage  →  F-chat/R1 (internal)
//   W-ATOM  validateMessageContent    →  F-chat/R3
//   W-ATOM  buildCursor               →  R0 chat-config (foundation-group3b: relocated)
//   W-ATOM  parseCursor               →  R0 chat-config (foundation-group3b: relocated)
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

// --- Cursor pagination moved to R0 (chat-config) — foundation-group3b ---
// buildCursor and parseCursor are at R0 (chat-config) so R4 (chat-db) can import
// downward without an A2 violation. Import from '../config/chat-config'.
