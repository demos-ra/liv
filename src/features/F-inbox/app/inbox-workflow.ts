// @liv-standard v1.5.2
// [F-inbox/R2]
// Built with LIV · livai.dev
// [F-inbox/app/inbox-workflow.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-inbox
// category:   Domain-loop
// layer:      R2
// wires-in:
//   W-ATOM   RawWord / RawTurn / ScopeSpec   @/features/F-memory/contract/substrate-contract  (type-only — the substrate face's atoms)
//   W-ATOM   Who                             @/core/types/substrate-raw.types
//   W-ATOM   INBOX_SCOPE / Digest / InboxEntry / InboxEntryRef / TieRef / GrantKey   ../config/inbox-types
//   W-FN     composeInboxEntry / buildPromoteTieRef / PROMOTE_NOTE                    ../domain/inbox-compose
// wires-out:
//   W-FN     walledWriteDigest  →  F-inbox/R2 inbox-bus, F-inbox/R3
//   W-FN     promoteToPrivate   →  F-inbox/R3
//   W-FN     readInbox          →  F-inbox/R3
//   W-ATOM   SubstratePort      →  F-inbox/R2 inbox-substrate-port + inbox-bus, F-inbox/R3
// deps:
//   R3  @/features/F-memory/contract/substrate-contract  (TYPE-ONLY — the substrate atoms; the live
//        functions are bound once in inbox-substrate-port.ts, never imported as values here, so this
//        module loads without dragging the substrate/event graph in — DI per the repo's test idiom)
//   R5  @/core/types/substrate-raw.types
//   R0  ../config/inbox-types
//   R1  ../domain/inbox-compose
// validated:  pending
//
// The two write workflows + the inbox read, as PURE compositions over an INJECTED substrate port.
// The port's live binding (admitWriteRaw / gather / mine / cutCells — F-memory's ONE sealed face)
// lives in inbox-substrate-port.ts; injecting it keeps these workflows free of a value-import of the
// substrate graph (so the composition is unit-testable in isolation). No own store, no keystone
// touched, no UPDATE of source_scope anywhere.

import type { RawWord, RawTurn, ScopeSpec } from '@/features/F-memory/contract/substrate-contract'
import type { Who } from '@/core/types/substrate-raw.types'
import { INBOX_SCOPE } from '../config/inbox-types'
import type { Digest, InboxEntry, InboxEntryRef, TieRef, GrantKey } from '../config/inbox-types'
import { composeInboxEntry, buildPromoteTieRef, PROMOTE_NOTE } from '../domain/inbox-compose'

// SubstratePort — the slim slice of F-memory's R3 face the inbox composes over. `write` is the ONE
// sealed cognition write (admitWriteRaw: tier floor + substrate_write admit, then the dumb store);
// `cut` is the existing canonical cutter; `gather`/`mine` are the sealed scope-resolving read +
// the isolation scope. Injected (not value-imported) so the compositions test with no DB / no graph.
export type SubstratePort = {
  write:  (input: { who: Who; words: RawWord[]; userId: string; scope: string; grantKey: GrantKey }) => Promise<number>
  cut:    (text: string) => RawWord[]
  gather: (scope: ScopeSpec) => Promise<RawTurn[]>
  mine:   (principals: string | string[]) => ScopeSpec
}

// ── walledWriteDigest — the WALLED write composition ───────────────────────────
// Compose a Digest into one owner-stamped, inbox-scoped substrate write. The wall is two existing
// facts stacked: userId (the isolation floor — a `mine` read binds it) + scope = INBOX_SCOPE (the
// inbox's own value). Routes through the ONE write face; adds nothing. Returns the entry's
// coordinate handle (sc = the position the write returns; pos 1 = the digest payload's head cell).
export async function walledWriteDigest(digest: Digest, port: SubstratePort): Promise<InboxEntryRef> {
  const entry: InboxEntry = composeInboxEntry(digest)
  const words = port.cut(entry.text)          // the existing canonical cutter — no new tokenizer
  const sc = await port.write({
    who:      entry.who,
    words,
    userId:   digest.ownerUserId,             // owner-stamped — the isolation wall
    scope:    entry.scope,                     // INBOX_SCOPE — the inbox's own walled scope value
    grantKey: digest.grantKey,                 // perimeter-resolved floor key, passed straight through
  })
  return { who: entry.who, sc, pos: 1 }
}

// ── promoteToPrivate — APPEND-PRIVATE, you-initiated ───────────────────────────
// Promote = a NEW write into the wearer's PRIVATE scope (privateScope — any non-'public',
// non-inbox circumstance, e.g. a projectId) that re-refs the inbox row via the `tie` mark. The
// inbox row is LEFT INTACT: there is NO UPDATE/SET of source_scope here — this workflow has no
// update path at all. Promote NEVER moves a row; it APPENDS one that POINTS at the old (append-
// only, you-initiated, never auto). Returns the new private sc + the tie-ref (the link).
export async function promoteToPrivate(
  args: { entry: InboxEntryRef; userId: string; privateScope: string; grantKey: GrantKey },
  port: SubstratePort,
): Promise<{ promotedSc: number; tieRef: TieRef }> {
  const tieRef = buildPromoteTieRef(args.entry)   // the re-ref at the inbox row's exact Coord
  const words  = port.cut(PROMOTE_NOTE)
  const promotedSc = await port.write({
    who:      'wearer',                        // you-initiated — the wearer's act
    words,
    userId:   args.userId,
    scope:    args.privateScope,               // a NEW private write — NOT INBOX_SCOPE, NOT 'public'
    grantKey: args.grantKey,
  })
  return { promotedSc, tieRef }
}

// ── readInbox — gather over the inbox scope ────────────────────────────────────
// gather(mine(userId)) is the owner's substrate through the sealed read face (readTranscript, WHERE via scopeClause).
// `mine` binds user_id only (the isolation floor), and each RawTurn carries its OWN write-stamped
// scope — so the inbox select is a pure in-slice filter on RawTurn.scope. No keystone change, no new
// scope kind (the inbox ScopeSpec kind is a held keystone step the inbox does NOT add).
export async function readInbox(userId: string, port: SubstratePort): Promise<RawTurn[]> {
  const all = await port.gather(port.mine(userId))
  return all.filter(t => t.scope === INBOX_SCOPE)
}
