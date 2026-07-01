// @liv-standard v1.3
// [F-event-system/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    sprint-8-shot-3 (MEMORY_EVENTS → SUBSTRATE_EVENTS; F-memory engine dissolved)
// slice:      F-event-system
// category:   Tool
// layer:      R0
// wires-in:
//   W-ATOM  IDENTITY_EVENTS     F-identity/R0 (auth-events)
//   W-ATOM  SESSION_EVENTS      F-identity/R0 (auth-events)
//   W-ATOM  AI_EVENTS           F-ai-adapter/R0 (ai-events)
//   W-ATOM  CHAT_EVENTS         F-chat/R0 (chat-events)
//   W-ATOM  SUBSTRATE_EVENTS    F-memory/contract/substrate-events-contract  (the LEAN events wire — not the full barrel; breaks the load-cycle)
//   W-ATOM  PROJECT_EVENTS      F-project/R0 (project-events)
//   W-ATOM  PLANNER_EVENTS      F-builder/R0 (builder-events)
//   W-ATOM  OUTPUT_EVENTS       F-output/R0 (output-events)
// wires-out:
//   W-ATOM  EVENTS              →  F-event-system/R2 (event-subscriptions, event-dispatch)
//   W-ATOM  ALL_EVENT_NAMES     →  F-event-system/R1 (bus)
// deps:
//   R0  @/features/F-identity/config/auth-events
//   R0  @/features/F-ai-adapter/config/ai-events
//   R0  @/features/F-chat/config/chat-events
//   R0  @/features/F-project/types/project-events
//   R0  @/features/F-builder/config/builder-events
//   R0  @/features/F-output/types/output-events
//   R3  @/features/F-memory/contract/substrate-contract
// validated:  pending
// R0 — re-export barrel only. Zero declarations. Zero owned event strings.
// A5: each slice declares its own events. This file re-exports only.
// sprint-8-shot-3: MEMORY_EVENTS → SUBSTRATE_EVENTS (legacy F-memory engine dissolved; F-memory is now substrate-only per LM v3.1).
// Adding a new slice = one import line + one entry in EVENTS.

import { IDENTITY_EVENTS }    from '@/features/F-identity/config/auth-events'
import { SESSION_EVENTS }     from '@/features/F-identity/config/auth-events'
import { AI_EVENTS }          from '@/features/F-ai-adapter/config/ai-events'
import { CHAT_EVENTS }        from '@/features/F-chat/config/chat-events'
import { SUBSTRATE_EVENTS }   from '@/features/F-memory/contract/substrate-events-contract'
import { PROJECT_EVENTS }     from '@/features/F-project/types/project-events'
import { PLANNER_EVENTS }     from '@/features/F-builder/config/builder-events'
import { OUTPUT_EVENTS }      from '@/features/F-output/types/output-events'

export const EVENTS = {
  IDENTITY:    IDENTITY_EVENTS,
  SESSION:     SESSION_EVENTS,
  AI:          AI_EVENTS,
  CHAT:        CHAT_EVENTS,
  SUBSTRATE:   SUBSTRATE_EVENTS,
  PROJECT:     PROJECT_EVENTS,
  PLANNER:     PLANNER_EVENTS,
  OUTPUT:      OUTPUT_EVENTS,
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
