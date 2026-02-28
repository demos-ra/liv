// [F-chat/R0/C2] Chat configuration and types
// R0: pure config, zero dependencies

export const CHAT_CONFIG = {
  maxMessageLength: 32_000,
  pageSize: 50,
  streamChunkSize: 64,
} as const

export const CHAT_NAMESPACE = 'chat' as const

// Demo mode — bypasses auth and DB for local development and demos.
// Controlled by env var at boot time. Never mutated at runtime.
export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export const DEMO_SESSION = {
  sessionId: 'demo-session',
  userId:    'demo-user',
} as const

// System prompt — defines Liv's identity and language contract.
// Owned at R0 so it can be evolved without touching contract logic.
export const SYSTEM_PROMPT =
  'You are Liv, an intelligent AI assistant and development partner. ' +
  'Always respond in English. Be concise, precise, and direct.'

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
