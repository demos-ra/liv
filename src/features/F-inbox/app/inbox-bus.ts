// @liv-standard v1.5.2
// [F-inbox/R2]
// Built with LIV · livai.dev
// [F-inbox/app/inbox-bus.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R2
// wires-in:
//   W-FN     subscribeToEvent      @/features/F-event-system/contract/event-bus   (the bus — cross-slice intake)
//   W-ATOM   LivEvent              @/core/types/primitives
//   W-FN     walledWriteDigest     ./inbox-workflow
//   W-ATOM   SubstratePort         ./inbox-workflow
//   W-ATOM   livePort              ./inbox-substrate-port
//   W-FN     toDigest              ../domain/inbox-compose
//   W-ATOM   INBOX_SUBSCRIPTIONS   ../config/inbox-events
// wires-out:
//   W-FN     registerInboxSubscriptions  →  F-inbox/R3
// deps:
//   R3  @/features/F-event-system/contract/event-bus   (allowed wire — the bus itself, the sanctioned cross-slice mechanism)
//   R5  @/core/types/primitives
//   R2  ./inbox-workflow
//   R2  ./inbox-substrate-port
//   R1  ../domain/inbox-compose
//   R0  ../config/inbox-events
// validated:  pending
//
// The bus wire. Cross-slice intake is bus-only (IEventBus subscribe). The inbox is a PURE CONSUMER —
// it emits nothing. The live substrate port is the default; injectable for tests.

import { subscribeToEvent } from '@/features/F-event-system/contract/event-bus'
import type { LivEvent } from '@/core/types/primitives'
import { walledWriteDigest, type SubstratePort } from './inbox-workflow'
import { livePort } from './inbox-substrate-port'
import { toDigest } from '../domain/inbox-compose'
import { INBOX_SUBSCRIPTIONS } from '../config/inbox-events'

// registerInboxSubscriptions — subscribe to the inbound digest event; each payload is narrowed
// fail-closed (toDigest) then composed into a WALLED write. Returns the unsubscribe handle. Wired
// OUTWARD only — nothing imports F-inbox; the integrator calls this at boot (a held wiring step,
// like the keystone fills). The inbox EMITS nothing.
export function registerInboxSubscriptions(port: SubstratePort = livePort): () => void {
  return subscribeToEvent(INBOX_SUBSCRIPTIONS.DIGEST_ARRIVED, async (event: LivEvent) => {
    const digest = toDigest(event.payload)
    if (!digest) return                       // malformed → drop, never a partial write
    await walledWriteDigest(digest, port)
  })
}
