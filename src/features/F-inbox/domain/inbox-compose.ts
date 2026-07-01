// @liv-standard v1.5.2
// [F-inbox/R1]
// Built with LIV · livai.dev
// [F-inbox/domain/inbox-compose.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R1
// wires-in:
//   W-ATOM   Coord                @/core/types/substrate-raw.types
//   W-ATOM   Digest / InboxEntry / InboxEntryRef / TieRef / GrantKey / INBOX_SCOPE  ../config/inbox-types
// wires-out:
//   W-FN     composeInboxEntry    →  F-inbox/R2
//   W-FN     buildPromoteTieRef   →  F-inbox/R2
//   W-FN     toDigest             →  F-inbox/R2 (the bus-payload narrowing)
//   W-ATOM   PROMOTE_NOTE         →  F-inbox/R2
// deps:
//   R0  ../config/inbox-types
//   R5  @/core/types/substrate-raw.types
// validated:  pending
//
// PURE composition — no I/O, no cross-slice, no mechanism. Just structural transforms over the R0
// atoms: a Digest → the walled-write entry; an inbox entry → the `tie` re-ref; a bus payload →
// a narrowed Digest (fail-closed).

import type { Coord } from '@/core/types/substrate-raw.types'
import { INBOX_SCOPE } from '../config/inbox-types'
import type { Digest, InboxEntry, InboxEntryRef, TieRef, GrantKey } from '../config/inbox-types'

// composeInboxEntry — a Digest → the walled-write entry, stamping the inbox's OWN scope. No
// mechanism: it selects fields and pins scope to INBOX_SCOPE (the wall). Pure.
export function composeInboxEntry(digest: Digest): InboxEntry {
  return { who: digest.who, text: digest.text, scope: INBOX_SCOPE, source: digest.source }
}

// buildPromoteTieRef — the COIN `tie` mark that re-refs the inbox entry at its EXACT Coord (the
// disambiguating address — coin-spec §3 name-OR-address). A tie POINTS; it writes nothing back, so
// PROMOTE leaves the inbox row byte-unchanged (append-only). This is the link PROMOTE carries.
export function buildPromoteTieRef(entry: InboxEntryRef): TieRef {
  const target: Coord = { who: entry.who, sc: entry.sc, pos: entry.pos }
  return { op: 'tie', target }
}

// PROMOTE_NOTE — the verbatim content of the append-private turn. MINIMAL by design: the LINK lives
// in the tie-ref (the Coord), not in prose — the private row exists to carry the re-ref, so its
// words are a short honest marker, nothing computed. (Ambiguous design point → minimal composition.)
export const PROMOTE_NOTE = 'promoted from inbox' as const

// toDigest — narrow an opaque bus payload (Record<string,unknown>) to a Digest, FAIL-CLOSED: a
// malformed payload returns null and the handler drops it (never a partial walled write). Mirrors
// the perimeter's GRANT_KEY_ENUM ('free' | 'paid') and the Who set — no value slips through unchecked.
export function toDigest(payload: Record<string, unknown>): Digest | null {
  const ownerUserId = payload.ownerUserId
  const who         = payload.who
  const grantKey    = payload.grantKey
  const text        = payload.text
  if (typeof ownerUserId !== 'string' || typeof text !== 'string') return null
  if (who !== 'wearer' && who !== 'llm' && who !== 'program') return null
  if (grantKey !== 'free' && grantKey !== 'paid') return null
  const source = typeof payload.source === 'string' ? payload.source : undefined
  return { ownerUserId, who, grantKey: grantKey as GrantKey, text, source }
}
