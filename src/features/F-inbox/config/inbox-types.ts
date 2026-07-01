// @liv-standard v1.5.2
// [F-inbox/R0]
// Built with LIV · livai.dev
// [F-inbox/config/inbox-types.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop (composition over the one substrate — ZERO new mechanism)
// layer:      R0
// wires-in:
//   W-ATOM   Coord / Who          @/core/types/substrate-raw.types   (kernel — the intrinsic coordinate)
//   W-ATOM   PerimeterSession     @/features/F-identity/contract/perimeter-consultation  (type-only; the grant-key type, derived to avoid drift)
// wires-out:
//   W-ATOM   INBOX_SCOPE          →  F-inbox/R1, F-inbox/R2, F-inbox/R3
//   W-ATOM   Digest               →  F-inbox/R1, F-inbox/R2, F-inbox/R3
//   W-ATOM   InboxEntry           →  F-inbox/R1, F-inbox/R2, F-inbox/R3
//   W-ATOM   InboxEntryRef        →  F-inbox/R1, F-inbox/R2, F-inbox/R3
//   W-ATOM   TieRef               →  F-inbox/R1, F-inbox/R2, F-inbox/R3
//   W-ATOM   GrantKey             →  F-inbox/R1, F-inbox/R2
// deps:
//   R5  @/core/types/substrate-raw.types
//   R3  @/features/F-identity/contract/perimeter-consultation  (type-only — allowed perimeter wire)
// validated:  pending
//
// F-inbox is a DOMAIN-LOOP slice that COMPOSES over the ONE substrate. It adds ZERO new
// mechanism: an inbox is existing primitives stacked — a WALLED substrate write (owner-stamped,
// scoped to the inbox's OWN scope value), a DIGEST carried as ordinary content, and PROMOTE =
// append-private (a NEW 'mine' write that re-refs the inbox row via the existing `tie` mark).
// No own store, no table, no migration, no new action, no MCP tool.

import type { Coord, Who } from '@/core/types/substrate-raw.types'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'

// ── AK-PRIM — the grant-key type ──────────────────────────────────────────────
// Derived from the perimeter session (the allowed F-identity R3 wire) rather than re-declared,
// so it can NEVER drift from the perimeter's resolved key. admitWriteRaw REQUIRES this key
// (compile-enforced no-bypass); the inbox passes the perimeter-resolved value straight through.
export type GrantKey = PerimeterSession['grantKey']

// ── AK-ATOM — the inbox's OWN walled scope value ──────────────────────────────
// A free-form source_scope marker — NOT 'public', NOT a projectId/'mine' circumstance. The
// existing write face stamps this raw string into source_scope (raw-turn-write: input.scope →
// source_scope). Read isolation is the owner's user_id (a `mine` read binds user_id); this scope
// value is the second wall — the inbox is walled by user_id + this scope. regionOfScope() maps any
// non-'public' scope to PRIVATE today (the 'inbox'→INBOX seam in F-entitlement is a held Wave-4
// step the inbox does NOT touch), so the inbox write sits in the owner-only PRIVATE floor — walled.
export const INBOX_SCOPE = 'inbox' as const

// ── AK-ENT — a Digest: the carried payload that becomes one walled inbox row ───
// A DIGEST is ordinary carried content (a first-class payload — locateCellIdentities homes such a
// cell), NOT a marked mechanism. It arrives on the bus; because a bus handler has no NextRequest to
// consult getPerimeterSession on, the producing crossing (which DID cross the perimeter) stamps the
// owner identity onto the payload: ownerUserId + who + grantKey, all perimeter-resolved upstream.
export type Digest = {
  ownerUserId: string    // the wearer who owns this inbox row (user_id stamp — the isolation wall)
  who:         Who       // authorship axis, perimeter-resolved at the producer
  grantKey:    GrantKey  // the tier-floor key, perimeter-resolved at the producer
  text:        string    // the digest payload content (verbatim → cut to cells by the existing cutter)
  source?:     string    // optional provenance label — informational only, never a mechanism
}

// ── AK-ENT — the composed walled-write entry (a Digest with its scope stamped) ─
export type InboxEntry = {
  who:     Who
  text:    string
  scope:   typeof INBOX_SCOPE
  source?: string
}

// ── AK-ENT — the coordinate handle of a written inbox row ─────────────────────
// `sc` is the DB-assigned position the write returns (one coordinate per turn). `pos` is the head
// cell (1) — the digest payload's appearance. PROMOTE ties to this exact appearance.
export type InboxEntryRef = { who: Who; sc: number; pos: number }

// ── AK-ENT — a tie-ref: the existing COIN `tie` mark pointing at one appearance ─
// `tie` is an existing mark op (coin-score); a mark POINTS into substrate coordinates and writes
// NOTHING back (mark-types: take the lens off → the substrate is byte-unchanged). PROMOTE re-refs
// the inbox row via this tie — it never moves or mutates the row.
export type TieRef = { op: 'tie'; target: Coord }
