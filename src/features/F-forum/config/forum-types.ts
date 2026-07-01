// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-forum/R0]
// Built with LIV · livai.dev
// [F-forum/config/forum-types.ts]

import type { Coord, RawTurn } from '@/core/types/substrate-raw.types'

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    forum-is-reference (the authoring drift removed): a forum entry is NO LONGER a
//             composed shape this slice assembles — publishing is the NORMAL marked compose stamped
//             source_scope='public' (F-present's recordWireTurn), so the author types (ForumPostInput
//             / ForumReplyInput / ForumEntry / ForumTieRef / FORUM_SCOPE) are GONE. FORUM_SCOPE is
//             replaced by the imported PUBLIC_SCOPE (F-memory R3 — the one reserved value), never
//             re-declared here. R0 now holds ONLY the forum's policy text: the publish confirm prompt.
// slice:      F-forum
// layer:      R0
// wires-out:
//   W-ATOM  FORUM_PUBLISH_PROMPT  →  F-forum/R1 forum-logic (the verbatim confirm payload)
//   W-ATOM  FORUM_REF_SCHEME      →  F-forum/R1 forum-logic (the ONE scheme literal — build/parse home)
//   W-ATOM  FORUM_ROOT            →  F-forum/R2 forum-workflow (the root-post marker Coord)
//   W-ATOM  ForumRef / ForumNode  →  F-forum/R1/R3 (the handle-string alias + the network edge shape)
// deps:
//   R5  @/core/types/substrate-raw.types  (TYPE-ONLY — Coord / RawTurn, the substrate's intrinsic
//        facts the ref points at + the node it rides on; the forum invents no substrate vocabulary)
// validated:  pending

// THE FORUM AUTHORS NOTHING. It is a network of PUBLIC REFERENCE: the public read is gather(public)
// (the keystone scope-clause public branch, inherited at R3 readForum), and PUBLISHING is the normal
// marked compose stamped source_scope='public' — the SAME recordWireTurn the wire's `compose` door
// uses, differing ONLY by the stamped scope. No forum_* action, no own store, no entry shape: take
// the forum away and the substrate is byte-unchanged.

// FORUM_PUBLISH_PROMPT — the verbatim text the model surfaces to the wearer in publish's PHASE ONE
// (the two-phase confirm, locked-CTA precedent: a tool returns text the model surfaces, then a second
// call carries confirmed:true and proceeds). Publishing crosses the private→public boundary, so it is
// wearer-gated by an explicit confirm; this is the policy text of that gate. It lives at R0 (config —
// the forum's one piece of policy); R1's pure decision helper returns it unchanged.
export const FORUM_PUBLISH_PROMPT =
  'Publish this to the public forum? It will be visible to everyone. Call publish again with confirmed:true to proceed.' as const

// ── THE FORUM REFERENCE — the completing half: a payload's REQUIRED outbound edge ──────────────
// The forum is a network of PUBLIC REFERENCE. A published payload carries the edge to the forum
// payload it points at (its reply parent, or the root marker for a top post), so the whole network
// is readable from gather(public) ALONE. The edge is NOT a new store/column/mark — it is CONTENT: a
// forum-owned handle string that RIDES in the payload's words (one RawWord), EXACTLY mirroring how a
// livbyte:// payload handle rides in a payload cell's `word`. recordWireTurn composes it forum-blind;
// readForum parses it back out.
//
// FORUM_REF_SCHEME — the ONE scheme literal (the only place `forumref` appears; R1 build/parse read
// it, never re-typing it). URI-shaped but SINGLE-COLON + DOT-separated by DESIGN, not aesthetics: the
// substrate cutter (cutCells / shapeAwareCut) keeps a token whole only while every internal
// punctuation is a SINGLE char flanked by word-chars on both sides. A livbyte:// handle survives as
// one cell ONLY because content-signature classifies it as a payload region (coalesced) — a bound we
// must NOT touch. A bare `forumref://…` would cut into `forumref` · `://` · `…` (three cells) and be
// unparseable per-word. `forumref:who.sc.pos` (colon flanked by word-chars, dots flanked by digits/
// letters) survives as ONE word-cell — so it round-trips through the cut as a single RawWord, which is
// exactly what parseForumRef(word) needs. The scheme owns the format; nothing else re-types it.
export const FORUM_REF_SCHEME = 'forumref:' as const

// FORUM_ROOT — the root-post marker. A REQUIRED ref means every published payload names a target; a
// top post has no reply parent to name, so it references this sentinel (chosen over self-reference,
// which is impossible pre-write: a payload cannot cite its own sc before the write assigns it).
// { who:'program', sc:0, pos:0 } is a natural sentinel — the substrate never emits a real payload at
// pos 0 (positions are 1-based; the cut starts at pos 1), so a reader tells root from reply by ref.sc.
export const FORUM_ROOT: Coord = { who: 'program', sc: 0, pos: 0 }

// ForumRef — a built handle string (`${FORUM_REF_SCHEME}${who}.${sc}.${pos}`). A plain string alias:
// it rides as content (a RawWord.word), never a new atom; the alias only names the intent at the seam.
export type ForumRef = string

// ForumNode — the network read's element: a public forum payload PLUS its parsed outbound edge (the
// Coord it points at, or null for a payload carrying no ref). readForum's raw node-read stays a
// RawTurn[]; the network read composes this edge on top, so the graph is walkable from the public
// read alone.
export type ForumNode = { node: RawTurn; ref: Coord | null }
