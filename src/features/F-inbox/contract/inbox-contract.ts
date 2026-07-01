// @liv-standard v1.5.2
// [F-inbox/R3]
// Built with LIV · livai.dev
// [F-inbox/contract/inbox-contract.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R3
// wires-in:
//   W-FN     walledWriteDigest / promoteToPrivate / readInbox   ../app/inbox-workflow
//   W-ATOM   SubstratePort        ../app/inbox-workflow
//   W-ATOM   livePort             ../app/inbox-substrate-port
//   W-FN     registerInboxSubscriptions   ../app/inbox-bus
//   W-ATOM   INBOX_SCOPE / Digest / InboxEntry / InboxEntryRef / TieRef   ../config/inbox-types
//   W-ATOM   INBOX_SUBSCRIPTIONS  ../config/inbox-events
// wires-out:
//   W-FN     promoteToPrivate / readInbox / walledWriteDigest / registerInboxSubscriptions
//            →  the integrator (you-initiated promote + inbox read + boot-time bus registration)
//   W-ATOM   livePort / SubstratePort  →  the integrator (the default substrate binding)
// deps:
//   R2  ../app/inbox-workflow
//   R2  ../app/inbox-substrate-port
//   R2  ../app/inbox-bus
//   R0  ../config/inbox-types
//   R0  ../config/inbox-events
// validated:  pending
//
// The thin outbound surface. R3: thin wire, no logic. EXPORTED FUNCTIONS (not a route under
// src/app/api/inbox/) — chosen so the WHOLE slice lives under src/features/F-inbox/ with ZERO
// inbound refs: deleting the directory orphans nothing (A7). NO new MCP tool, NO new action.
// The you-initiated promote is promoteToPrivate (never auto); reading the inbox is readInbox
// (gather over the inbox scope). `livePort` is the default substrate binding for callers.

export {
  walledWriteDigest,
  promoteToPrivate,
  readInbox,
} from '../app/inbox-workflow'
export type { SubstratePort } from '../app/inbox-workflow'
export { livePort } from '../app/inbox-substrate-port'
export { registerInboxSubscriptions } from '../app/inbox-bus'

export { INBOX_SCOPE } from '../config/inbox-types'
export type { Digest, InboxEntry, InboxEntryRef, TieRef } from '../config/inbox-types'

export { INBOX_SUBSCRIPTIONS } from '../config/inbox-events'
