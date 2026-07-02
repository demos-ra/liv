// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-forum/R3]
// Built with LIV · livai.dev
// [F-forum/contract/forum-contract.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    forum-is-reference: postForumEntry / replyForumEntry are GONE (the forum authors no
//             entry). The WRITE surface is now publishToForum — the NORMAL marked compose stamped
//             source_scope='public': this door binds the live recordWireTurn (F-present R3) as the
//             compose port and PUBLIC_SCOPE (F-memory R3) as the stamped scope, then hands both into
//             the R2 workflow. readForum (the public node-read) is UNCHANGED.
// slice:      F-forum
// layer:      R3
// wires-in:
//   W-FN    gather            @/features/F-memory/contract/substrate-contract  (the one scope-resolving read)
//   W-ATOM  ReadScope         @/features/F-memory/contract/substrate-contract  (the scope dial)
//   W-ATOM  PUBLIC_SCOPE      @/features/F-memory/contract/substrate-contract  (the one reserved scope value — stamped on a publish)
//   W-FN    recordWireTurn    @/features/F-present/contract/present-contract   (the compose primitive — publish reuses it as-is)
//   W-ATOM  WireTurnInput / WireTurnIdentity / WireTurnOutcome  @/features/F-present/contract/present-contract  (type-only)
//   W-ATOM  PerimeterSession  @/features/F-identity/contract/perimeter-consultation
//   W-ATOM  RawTurn / Coord   @/core/types/substrate-raw.types
//   W-FN    parseForumRef     ../domain/forum-logic  (the network read's per-word edge decode)
//   W-FN    renderForumThreads ../domain/forum-logic  (the browse view — folds the network into boards of threads)
//   W-ATOM  FORUM_ROOT_URN / ForumNode / ForumThread / ForumBoard  ../config/forum-types  (root target URN re-export + the network + rendered shapes)
//   W-FN    publishToForum    ../app/forum-workflow  (the R2 two-phase workflow — aliased)
//   W-ATOM  ForumComposePort / PublishOutcome / ForumDraft  ../app/forum-workflow
// wires-out:
//   W-FN    publishToForum / readForum / readForumNetwork / renderForumThreads  →  F-mcp (publish tool + forum read/browse) / app callers (A2-thin)
//   W-ATOM  PublishOutcome / ForumDraft / ForumComposePort / ForumReadPort / ForumNode / ForumThread / ForumBoard / FORUM_ROOT_URN  →  re-exported surface
// deps:
//   R0  ../config/forum-types
//   R1  ../domain/forum-logic  (parseForumRef — the format's home; the network read composes on it)
//   R2  ../app/forum-workflow
//   R3  @/features/F-memory/contract/substrate-contract
//   R3  @/features/F-present/contract/present-contract
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R5  @/core/types/substrate-raw.types
// validated:  pending

// The forum's thin outward surface (A1: declared once; A2: contract is the only cross-slice door).
// The forum AUTHORS NOTHING — it is a network of public reference. WRITE = publishToForum, the
// NORMAL marked compose stamped source_scope='public' (recordWireTurn, reused as-is) behind a
// wearer confirm. READ = readForum, gather(public) — the keystone scope-clause public branch. Both
// inherit F-memory's one wall: the write its tier floor (admitWriteRaw), the read its scopeClause
// (the WHERE builder); F-forum adds NO gate, NO store, NO
// action of its own. The whole slice is wired OUTWARD only, so deleting src/features/F-forum/ orphans
// nothing (A7).

import { gather, PUBLIC_SCOPE } from '@/features/F-memory/contract/substrate-contract'
import type { ReadScope } from '@/features/F-memory/contract/substrate-contract'
import { recordWireTurn } from '@/features/F-present/contract/present-contract'
import type { WireTurnInput, WireTurnIdentity, WireTurnOutcome } from '@/features/F-present/contract/present-contract'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import type { RawTurn, Coord } from '@/core/types/substrate-raw.types'
import { publishToForum as runPublish } from '../app/forum-workflow'
import type { ForumComposePort, PublishOutcome, ForumDraft } from '../app/forum-workflow'
import { parseForumRef } from '../domain/forum-logic'
import type { ForumNode } from '../config/forum-types'

// Re-export the publish vocabulary so callers import everything from this one R3 door (A6).
// FORUM_ROOT_URN (the root-post target URN) and ForumNode (the network edge shape) ride out here too —
// a caller composing a top post or walking the network reaches them through this one door. The browse
// view (renderForumThreads + ForumThread/ForumBoard) rides out for the F-mcp wire's look·public.
export type { PublishOutcome, ForumDraft, ForumComposePort } from '../app/forum-workflow'
export type { ForumNode, ForumThread, ForumBoard } from '../config/forum-types'
export { FORUM_PUBLISH_PROMPT, FORUM_ROOT_URN } from '../config/forum-types'
export { renderForumThreads } from '../domain/forum-logic'

// The live compose port — recordWireTurn bound with its defaults (submit-captured capture, 'separate'
// reply-marking), EXACTLY the connection-scope compose. publishToForum stamps PUBLIC_SCOPE into the
// identity; recordWireTurn is reused WITHOUT modification (the marking is identical — only the scope
// differs). This is the DI seam's default real binding (tests inject a spy at R2).
const liveCompose: ForumComposePort = (input: WireTurnInput, identity: WireTurnIdentity): Promise<WireTurnOutcome> =>
  recordWireTurn(input, identity)

// publishToForum — the thin outward surface. The author is a SLICE of the perimeter session (PA-I —
// resolved once at the perimeter, never re-derived). Phase one (confirmed falsy) returns the wearer
// confirm; phase two (confirmed true) composes the draft stamped PUBLIC_SCOPE through recordWireTurn
// and returns its WireTurnOutcome. The driver (F-mcp) maps the discriminated PublishOutcome.
export async function publishToForum(
  session:   PerimeterSession,
  draft:     ForumDraft,
  confirmed?: boolean,
): Promise<PublishOutcome> {
  return runPublish(
    { userId: session.userId, grantKey: session.grantKey },
    draft,
    confirmed,
    PUBLIC_SCOPE,
    liveCompose,
  )
}

// The READ port — gather's signature. Default = the real sealed read seam (gather → readTranscript,
// WHERE built by scopeClause; the public branch inherits the keystone, re-adds nothing). Tests inject a spy.
export type ForumReadPort = (scope: ReadScope) => Promise<RawTurn[]>

const defaultRead: ForumReadPort = (scope) => gather(scope)

// readForum — the FORUM READ (the network's node-reader). gather({ kind:'public', reader }): the
// keystone scope-clause public branch (source_scope='public', user_id bound DROPPED — the ONE
// relaxation). Its WHERE is built by the one builder scopeClause; there is no read admit token.
// F-forum re-adds NO gate. MINIMAL composition: F-memory's R3 exposes no public-scope constructor,
// so the public ScopeSpec is built inline ({ kind:'public', reader }), typed by the re-exported
// ReadScope dial. This stays NODE-only — the cross-
// author edge-traversal (mark-read) is a separate ruled piece, not built here.
export async function readForum(
  sessionUserId: string,
  read:          ForumReadPort = defaultRead,
): Promise<RawTurn[]> {
  const scope: ReadScope = { kind: 'public', reader: sessionUserId }
  return read(scope)
}

// A payload's outbound edge — its FIRST forum-ref word (the leading handle publish prepends): a
// coordinate parent Coord, the 'root' marker (a top post), or null. A body carries at most one ref;
// scanning first-match keeps a stray ref-shaped word later in the body from masking the real leading
// edge. null when no word parses as a ref (a payload published before the completing half, or
// malformed). F-forum owns this decode; nothing in F-present/F-memory reads it.
function edgeOf(node: RawTurn): Coord | 'root' | null {
  for (const w of node.words) {
    const ref = parseForumRef(w.word)
    if (ref !== null) return ref
  }
  return null
}

// readForumNetwork — the NETWORK read: the raw public node-read (readForum, above) with each node's
// outbound edge parsed back out of its words, so the graph is walkable from gather(public) ALONE. It
// COMPOSES on the node-read (same injected port, same inherited read seam — re-gates nothing) and
// re-shapes nothing about the nodes; it only ATTACHES the parsed edge. The raw node-read stays
// available for a caller that wants nodes without edges.
export async function readForumNetwork(
  sessionUserId: string,
  read:          ForumReadPort = defaultRead,
): Promise<ForumNode[]> {
  const nodes = await readForum(sessionUserId, read)
  return nodes.map((node) => ({ node, ref: edgeOf(node) }))
}
