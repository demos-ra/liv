// @liv-standard v1.5.2
// [F-inbox/R0]
// Built with LIV · livai.dev
// [F-inbox/config/inbox-events.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM   INBOX_SUBSCRIPTIONS  →  F-inbox/R2 (the bus subscription), F-inbox/R3
// deps:       none
// validated:  pending
//
// The bus events F-inbox SUBSCRIBES to. The inbox is a PURE CONSUMER — it EMITS nothing (no inbox.*
// event is declared here, by design). Cross-slice intake is bus-only: a digest producer emits this
// event with the owner identity stamped on the payload (perimeter-resolved at the producing
// crossing), and the inbox composes it into a walled write. Nothing here is an ACTION (no inbox_*
// in F-permissions) — these are event-name strings, data only.

export const INBOX_SUBSCRIPTIONS = {
  // The inbound digest event. Payload shape = Digest (config/inbox-types). A malformed payload is
  // dropped fail-closed by the R1 narrowing guard before any write.
  DIGEST_ARRIVED: 'digest.arrived',
} as const

export type InboxSubscription = typeof INBOX_SUBSCRIPTIONS[keyof typeof INBOX_SUBSCRIPTIONS]
