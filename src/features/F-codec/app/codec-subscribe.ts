// @liv-standard v1.3
// [F-codec/R2]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-codec
// layer:      R2
// wires-in:
//   W-ATOM  MECHANICAL_MAPPINGS  ←  F-codec/R0
//   W-FN    encodeMechanical()   ←  F-codec/R2 (codec-encode)
//   W-FN    subscribeToEvent()   ←  F-event-system/R3
// wires-out:
//   W-FN  registerCodecSubscriptions()  →  F-codec/R3
// deps:
//   R0  ../config/codec-types
//   R2  ./codec-encode
// validated:  pending

// R2: event subscriptions for mechanical encode.
// A5: subscribes to planner events via event bus — never imports from F-planner.
// Wired during startup via registerSubscriptions() on the R3 contract.

import { MECHANICAL_MAPPINGS } from '../config/codec-types'
import { encodeMechanical } from './codec-encode'
import { subscribeToEvent } from '@/features/F-event-system/contract/event-bus'

// ─── Register Codec Subscriptions ─────────────────────────────────────────────
// Subscribe to all planner events that have mechanical primitive mappings.
// A5: event bus only — no direct F-planner import.
// Each subscription: extract userId from payload, call encodeMechanical.

export function registerCodecSubscriptions(): void {
  for (const eventType of Object.keys(MECHANICAL_MAPPINGS)) {
    subscribeToEvent(eventType, async (event) => {
      const payload = (event.payload ?? {}) as Record<string, unknown>
      const userId = typeof payload.userId === 'string' ? payload.userId : null

      if (!userId) {
        // No user context — skip. Mechanical encode requires userId for graph scoping.
        console.warn(`[F-codec] mechanical encode skipped — no userId in ${event.type}`)
        return
      }

      await encodeMechanical(event.type, payload, userId)
    })
  }
}
