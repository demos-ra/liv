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
//   W-ATOM  FORUM_ROOT_URN        →  F-mcp/R3 (via forum-contract re-export) (the root-post target URN default)
//   W-ATOM  FORUM_CONFIRMED_URN   →  F-forum/R1 forum-logic (the reserved 'confirmed' MOTIVATION marker — build/parse home)
//   W-ATOM  ForumRef / ForumNode  →  F-forum/R1/R3 (the handle-string alias + the network edge shape)
//   W-ATOM  ForumThread / ForumBoard →  F-forum/R1/R3 (the rendered reference tree — thread + board shapes)
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
// FORUM_REF_SCHEME — the ONE scheme literal (the only place the URN prefix appears; R1 build/parse
// read it, never re-typing it). URN-shaped (RFC 8141) by the forum reference standard v1, and
// SINGLE-COLON + DOT-separated by DESIGN, not aesthetics: the substrate cutter (cutCells /
// shapeAwareCut) keeps a token whole only while every internal punctuation is a SINGLE char flanked
// by word-chars on both sides. A URL form (`liv://…`, slashes) would shatter into three cells and be
// unparseable per-word. `urn:liv:who.sc.pos` — every `:` and `.` a single char flanked by word-chars
// (`n:l`, `v:w`, `r.5`, `5.1`) — survives as ONE word-cell, so it round-trips through the cut as a
// single RawWord, which is exactly what parseForumRef(word) needs. The scheme owns the format; nothing
// else re-types it. URN, not URL, by design.
export const FORUM_REF_SCHEME = 'urn:liv:' as const

// FORUM_ROOT_URN — the root RESOURCE name (RFC 8141), a top post's target. A published payload always
// names a target; a top post has no reply parent to name, so it references this reserved resource URN
// (not a coordinate — `forum` is a name, not a who.sc.pos triple). The model supplies it as a value
// (or it is defaulted at the tool layer when absent); parseForumRef decodes it back to the 'root'
// marker so a reader tells a top post from a reply by its edge.
export const FORUM_ROOT_URN = `${FORUM_REF_SCHEME}forum` as const

// FORUM_CONFIRMED_URN — the reserved 'confirmed' MOTIVATION marker (the Web Annotation motivation slot,
// forum-reference-standard §2). The wearer's publish-confirm becomes RECORDED data, not a throwaway
// transport boolean: phase two of publish STAMPS this marker into the payload's words, so the consent
// lives IN the memory (auditable forever), one append, no new store/field. Built on the ONE scheme
// (FORUM_REF_SCHEME, reused — never re-typed): `urn:liv:confirmed` is a reserved RESOURCE name (not a
// coordinate — 'confirmed' is a name, not a who.sc.pos triple), so it survives the substrate cutter as
// ONE word-cell (`n:l`, `v:c` — every internal punctuation single-char, flanked by word-chars) exactly
// like FORUM_ROOT_URN, and parseForumRef returns null for it (it is not a target edge) — the leading
// target and the trailing consent are read by DIFFERENT, non-overlapping decoders.
export const FORUM_CONFIRMED_URN = `${FORUM_REF_SCHEME}confirmed` as const

// ForumRef — a built handle string (`${FORUM_REF_SCHEME}${who}.${sc}.${pos}`). A plain string alias:
// it rides as content (a RawWord.word), never a new atom; the alias only names the intent at the seam.
export type ForumRef = string

// ForumNode — the network read's element: a public forum payload PLUS its parsed outbound edge — a
// coordinate parent Coord, the 'root' marker (a top post targeting FORUM_ROOT_URN), or null for a
// payload carrying no ref. readForum's raw node-read stays a RawTurn[]; the network read composes this
// edge on top, so the graph is walkable from the public read alone.
export type ForumNode = { node: RawTurn; ref: Coord | 'root' | null }

// ForumThread — a rendered node in the reference tree: the public payload carried through unchanged, its
// OWN URN (the address a reply targets), and its replies nested recursively (the walkable thread).
export type ForumThread = { urn: ForumRef; node: RawTurn; children: ForumThread[] }

// ForumBoard — a reserved target URN (a board — today `urn:liv:forum`; tomorrow a subboard URN) with the
// top posts that point at it. renderForumThreads (R1) folds a flat ForumNode[] into ForumBoard[] by
// following edges; boards are just target URNs owned by no node, so a FUTURE board needs only a new
// reserved URN, never a renderer rebuild.
export type ForumBoard = { board: ForumRef; threads: ForumThread[] }
