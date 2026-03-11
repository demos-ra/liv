// @liv-standard v1.0
// [F-event-system/config/event-schema.ts]
// Built with LIV · livai.dev
// R0 — re-export barrel only. Never declares. Never owns event strings.
// Each slice declares its own events in {slice}/config/{slice}-events.ts.
// Adding a new slice = add one import + one line to EVENTS below.

import { IDENTITY_EVENTS } from '@/features/F-identity/config/auth-events'
import { SESSION_EVENTS }  from '@/features/F-identity/config/auth-events'
import { PERMISSIONS_EVENTS } from '@/features/F-permissions/config/permissions-events'
import { AI_EVENTS }       from '@/features/F-ai-adapter/config/ai-events'
import { CHAT_EVENTS }     from '@/features/F-chat/config/chat-events'
import { MEMORY_EVENTS }   from '@/features/F-memory/config/memory-events'

export const EVENTS = {
  IDENTITY:    IDENTITY_EVENTS,
  SESSION:     SESSION_EVENTS,
  PERMISSIONS: PERMISSIONS_EVENTS,
  AI:          AI_EVENTS,
  CHAT:        CHAT_EVENTS,
  MEMORY:      MEMORY_EVENTS,
} as const

type EventNameValues<T> = T extends Record<string, string>
  ? T[keyof T]
  : T extends Record<string, Record<string, string>>
  ? { [K in keyof T]: EventNameValues<T[K]> }[keyof T]
  : never

export type EventName = EventNameValues<typeof EVENTS>

function flattenEvents(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((v) =>
    typeof v === 'string' ? [v] : flattenEvents(v as Record<string, unknown>)
  )
}

export const ALL_EVENT_NAMES = new Set(flattenEvents(EVENTS as unknown as Record<string, unknown>))

export interface SystemEvent {
  type:    string
  payload: Record<string, unknown>
}
