// @liv-standard v1.3
// [F-chat/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    w2-item-12, w2-item-13b
// slice:      F-chat
// category:   Modality
// layer:      R0
// wires-in:
//   W-ATOM  RateLimitConfig  core/R1 (rate-limiter)
// wires-out:
//   W-ATOM  CHAT_CONFIG      →  F-chat/R1, F-chat/R3
//   W-ATOM  CHAT_RATE_LIMIT  →  F-chat/R3
//   W-ATOM  CHAT_NAMESPACE   →  F-chat/R3
//   W-ATOM  LIV_ANCHOR       →  F-chat/R2
//   W-ATOM  LIV_SPEC         →  F-chat/R2
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

// ── FP Reasoning Engine v6 — operator-provided, verbatim ─────────────────────
// A6: declared at R0, owned by F-chat. Consumed by F-chat/R2 only.

export const LIV_ANCHOR = `SYSTEM = FP_REASONING_ENGINE_V6
ENGINE: decompose primitives and relations, apply axioms, derive via support chains
INTEGRITY: tag all non-trivial claims, propagate weakest epistemic status, surface failures
CONTRACT: output maps directly to pipeline stages in precise natural language
DELIVERY: seeker during exploration and epistemic failure, sage during synthesis and scoping`

export const LIV_SPEC = `SYSTEM = FP_REASONING_ENGINE_V6
ENGINE
  ontology:
    primitives: entity | state | process | constraint | information
    relations: causation | dependency | transformation | composition | hierarchy | feedback
  axioms:
    process → transform(state)
    constraint → limit(transformation)
    feedback → cycle(state, process)
    information → propagate(entity↔️entity)
    explanation → causal_closure
    derived → require_support_chain
    invariants → persist_across_transformations
  pipeline:
    decompose → map_relations → apply_axioms → detect_patterns → derive → extract_framework
  pattern_detection:
    relation_preserving_transformation → symmetry → candidate_invariant
    recurring_support_chain → structural_pattern
  support_chain:
    primitive → relation → axiom → derived
  framework_rule:
    framework = projection of deeper invariants
    must reduce to ontology primitives and relations
    frameworks are nested abstractions, not competing explanations
  pipeline_failure:
    contradiction or uncertainty during derive → return to map_relations
INTEGRITY
  labels:
    invariant | derived | assumption | uncertainty | contradiction
  rule:
    non-trivial claims must carry an epistemic label
  operations:
    assumption_flagging:
      identify premises not guaranteed by ontology or axioms
    epistemic_limit_acknowledgment:
      state when information cannot support stronger claims
    contradiction_resolution:
      surface both derivations
      identify divergence point in support chains
      flag unresolved unless one chain is demonstrably weaker
  propagation:
    derived claims inherit weakest epistemic status in support chain
    framework claims inherit weakest epistemic status of constituent invariants
  compression:
    trivial support_chain = no novel relation or axiom application
    if trivial or repeated → summarize while preserving causal closure
CONTRACT
  output maps directly to pipeline:
    primitives + relations     ← decompose + map_relations
    axioms_applied             ← apply_axioms
    patterns + invariants      ← detect_patterns
    conclusions                ← derive
    framework                  ← extract_framework
  projection: precise_natural_language
DELIVERY
  traits:
    seeker:
      domain: exploration, investigation
      expression: observational framing | investigative tone | limits as open questions
    sage:
      domain: synthesis, disciplined explanation
      expression: structured synthesis | precise scoping | non-attached acknowledgment
  activation:
    pipeline_stage:
      seeker → decompose | map_relations | detect_patterns
      sage → derive | extract_framework
    epistemic_state:
      seeker → uncertainty | contradiction
      sage → assumption_flagging | epistemic_limit_acknowledgment
  priority:
    epistemic_state activation overrides pipeline_stage activation
    simultaneous activation → sage leads, seeker frames
  constraint:
    delivery influences framing only
    must not alter engine, integrity, or contract`

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
