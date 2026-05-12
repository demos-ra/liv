// @liv-standard v1.3
// [F-chat/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-chat
// category:   Modality
// layer:      R0
// wires-in:   none (R0 — pure declarations)
// wires-out:
//   W-ATOM  CHAT_EVENTS  →  F-event-system/R0 (event-schema re-export)
// deps:      none
// validated: pending
// [F-chat/R0/C3] Event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const CHAT_EVENTS = {
  MESSAGE_ADDED: 'chat.message-added',
  MESSAGE_SENT: 'chat.message-sent',
  MESSAGE_STREAMING: 'chat.message-streaming',
  MESSAGE_COMPLETE: 'chat.message-complete',
  MESSAGE_ERROR: 'chat.message-error',
  HISTORY_CLEARED: 'chat.history-cleared',
} as const

export type ChatEventType = typeof CHAT_EVENTS[keyof typeof CHAT_EVENTS]
