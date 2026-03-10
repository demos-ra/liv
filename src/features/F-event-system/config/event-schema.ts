// [F-event-system/config/event-schema.ts]
// R0 — re-export barrel only. Never declares. Never owns event strings.
// Each slice declares its own events in {slice}/config/{slice}-events.ts.
// Adding a new slice = add one import + one line to EVENTS below.

import { IDENTITY_EVENTS }    from '@/features/F-identity/config/auth-events'
import { SESSION_EVENTS }      from '@/features/F-identity/config/auth-events'
import { PERMISSIONS_EVENTS }  from '@/features/F-permissions/config/permissions-events'
import { PROJECT_EVENTS }      from '@/features/F-project/config/project-events'
import { CONSTITUTION_EVENTS } from '@/features/F-constitution/config/constitution-events'
import { GIT_EVENTS }          from '@/features/F-git-connector/config/git-events'
import { TERMINAL_EVENTS }     from '@/features/F-terminal-bridge/config/terminal-events'
import { AI_EVENTS }           from '@/features/F-ai-adapter/config/ai-events'
import { CHAT_EVENTS }         from '@/features/F-chat/config/chat-events'
import { TOPOGRAPHY_EVENTS }   from '@/features/F-topography/config/topography-events'
import { COMMIT_LOG_EVENTS }   from '@/features/F-commit-log/config/commitlog-events'
import { HEALTH_EVENTS }       from '@/features/F-health-panel/config/health-events'
import { EXECUTION_EVENTS }    from '@/features/F-execution-panel/config/execution-events'
import { NOTIFICATIONS_EVENTS } from '@/features/F-notifications/config/notifications-events'
import { MEMORY_EVENTS }       from '@/features/F-memory/config/memory-events'

export const EVENTS = {
  IDENTITY:      IDENTITY_EVENTS,
  SESSION:       SESSION_EVENTS,
  PERMISSIONS:   PERMISSIONS_EVENTS,
  PROJECT:       PROJECT_EVENTS,
  CONSTITUTION:  CONSTITUTION_EVENTS,
  GIT:           GIT_EVENTS,
  TERMINAL:      TERMINAL_EVENTS,
  AI:            AI_EVENTS,
  CHAT:          CHAT_EVENTS,
  TOPOGRAPHY:    TOPOGRAPHY_EVENTS,
  COMMIT_LOG:    COMMIT_LOG_EVENTS,
  HEALTH:        HEALTH_EVENTS,
  EXECUTION:     EXECUTION_EVENTS,
  NOTIFICATIONS: NOTIFICATIONS_EVENTS,
  MEMORY:        MEMORY_EVENTS,
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
