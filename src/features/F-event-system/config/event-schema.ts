// @liv-standard v1.3
// [F-event-system/R0]
// Built with LIV · livai.dev
// R0 — re-export barrel only. Zero declarations. Zero owned event strings.
// A5: each slice declares its own events. This file re-exports only.
// Adding a new slice = one import line + one entry in EVENTS.

import { IDENTITY_EVENTS }    from '@/features/F-identity/config/auth-events'
import { SESSION_EVENTS }     from '@/features/F-identity/config/auth-events'
import { PERMISSIONS_EVENTS } from '@/features/F-permissions/config/permissions-events'
import { AI_EVENTS }          from '@/features/F-ai-adapter/config/ai-events'
import { CHAT_EVENTS }        from '@/features/F-chat/config/chat-events'
import { MEMORY_EVENTS }      from '@/features/F-memory/config/memory-events'
import { PROJECT_EVENTS }     from '@/features/F-project/types/project-events'
import { PLANNER_EVENTS }     from '@/features/F-planner/types/planner-events'

export const EVENTS = {
  IDENTITY:    IDENTITY_EVENTS,
  SESSION:     SESSION_EVENTS,
  PERMISSIONS: PERMISSIONS_EVENTS,
  AI:          AI_EVENTS,
  CHAT:        CHAT_EVENTS,
  MEMORY:      MEMORY_EVENTS,
  PROJECT:     PROJECT_EVENTS,
  PLANNER:     PLANNER_EVENTS,
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
