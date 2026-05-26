// @liv-standard v1.3
// [F-chat/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    w2-item-12, w2-item-13b, fixround-context-channel (LIV_ANCHOR + LIV_SPEC deleted — discarded test artifact; the substrate is the sole context channel)
// slice:      F-chat
// category:   Modality
// layer:      R0
// wires-in:
//   W-ATOM  RateLimitConfig  core/R1 (rate-limiter)
// wires-out:
//   W-ATOM  CHAT_CONFIG      →  F-chat/R1, F-chat/R3
//   W-ATOM  CHAT_RATE_LIMIT  →  F-chat/R3
//   W-ATOM  CHAT_NAMESPACE   →  F-chat/R3
//   W-ATOM  MessageRole      →  F-chat/R0 (internal — used by ChatMessage type)
//   W-ATOM  MessageStatus    →  F-chat/R0 (internal use)
//   W-ATOM  ChatMessage      →  F-chat/R1, F-chat/R4
//   W-ATOM  ChatThread       →  F-chat/R3, F-chat/R4
//   W-ATOM  ChatErrorCode    →  F-chat/R3 (chat-hook, chat-ui)
//   W-ATOM  ChatError        →  F-chat/R3 (chat-hook, chat-ui)
// deps:
//   R1  @/core/domain/rate-limiter
// validated:  pending
//
// w2-item-12 (A6):
//   CHAT_RATE_LIMIT added. 30 requests per 60s sliding window.
//   RateLimitConfig imported from R1 (A2 — lower layer).
//   Axiom cite: A6 — rate limit constant declared at R0 of owner slice.
//
// w2-item-13b (A3, A6):
//   ChatError type added. Typed atom crossing hook/UI boundary (A3).
//   ChatErrorCode union: 5 error classes for differentiated chat error messages.
//   Axiom cite: A6 — type declared at R0 of owner slice. A3 — typed boundary.

import type { RateLimitConfig } from '@/core/domain/rate-limiter'

export const CHAT_CONFIG = {
  maxMessageLength: 32_000,
  pageSize: 50,
  streamChunkSize: 64,
  contextWindow: 20,    // max messages sent to AI as context
} as const

// ── Rate limit (w2-item-12, A6) ──────────────────────────────────────────────
export const CHAT_RATE_LIMIT: RateLimitConfig = {
  windowMs: 60_000,        // 1 minute sliding window
  maxRequests: 30,         // 30 messages/minute
}

export const CHAT_NAMESPACE = 'chat' as const

export type MessageRole = 'user' | 'assistant' | 'system'

export type MessageStatus = 'pending' | 'streaming' | 'complete' | 'error'

export type ChatMessage = {
  messageId: string
  projectId: string
  sessionId: string
  userId: string
  role: MessageRole
  content: string
  status: MessageStatus
  createdAt: number   // unix ms
  completedAt: number | null
  tokenCount: number | null
  modelId: string | null
  parentMessageId: string | null // threading
}

export type ChatThread = {
  projectId: string
  messages: ChatMessage[]
  hasMore: boolean
  oldestCursor: string | null
}

// ── Chat error classification (w2-item-13b, A3) ──────────────────────────────
// Typed atom crossing chat-hook → chat-ui boundary.
// Each code maps to a differentiated user-facing message.

export type ChatErrorCode =
  | 'PROVIDER_UNREACHABLE'   // fetch threw or res.ok false (non-429)
  | 'STREAM_INTERRUPTED'     // reader threw mid-stream after chunks received
  | 'API_KEY_MISSING'        // HTTP 401 or 403 from AI provider
  | 'RATE_LIMITED'           // HTTP 429 from LIV rate limiter
  | 'NETWORK_UNREACHABLE'    // fetch threw TypeError (network error)

export type ChatError = {
  code:    ChatErrorCode
  message: string
}
