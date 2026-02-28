// [F-memory/R0/C3] Memory event constants
// R0: imports from canonical event-schema only.
// CANONICAL LAW: Never declare local event name strings. Import from EVENTS only.

import { EVENTS } from '@/features/F-event-system/config/event-schema'

export const MEMORY_EVENTS = {
  NODE_WRITTEN:     EVENTS.MEMORY.NODE_WRITTEN,
  CONCEPT_PROMOTED: EVENTS.MEMORY.CONCEPT_PROMOTED,
  SESSION_STARTED:  EVENTS.MEMORY.SESSION_STARTED,
  SESSION_ENDED:    EVENTS.MEMORY.SESSION_ENDED,
  RECALL_FIRED:     EVENTS.MEMORY.RECALL_FIRED,
} as const
