// [F-memory/R0/C3] Event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const MEMORY_EVENTS = {
  NODE_WRITTEN: 'memory.node-written',
  CONCEPT_PROMOTED: 'memory.concept-promoted',
  SESSION_STARTED: 'memory.session-started',
  SESSION_ENDED: 'memory.session-ended',
  RECALL_FIRED: 'memory.recall-fired',
} as const

export type MemoryEventType = typeof MEMORY_EVENTS[keyof typeof MEMORY_EVENTS]
