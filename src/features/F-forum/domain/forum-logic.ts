// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-forum/R1]
// Built with LIV · livai.dev
// [F-forum/domain/forum-logic.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    forum-is-reference: the authoring composition (buildPayloadCells / buildRootTieRef /
//             entryCoordOf / assembleEntry) is GONE — the forum assembles no entry shape. This layer
//             is now the PURE two-phase confirm decision for publish (no I/O, no substrate reach).
// slice:      F-forum
// layer:      R1
// wires-in:
//   W-ATOM  FORUM_PUBLISH_PROMPT  ../config/forum-types
//   W-ATOM  FORUM_REF_SCHEME      ../config/forum-types  (the ONE scheme literal — read, never re-typed)
//   W-ATOM  ForumRef             ../config/forum-types
//   W-ATOM  Coord                @/core/types/substrate-raw.types  (TYPE-ONLY — the ref's target)
// wires-out:
//   W-FN  decidePublish  →  F-forum/R2 forum-workflow
//   W-ATOM PublishDecision  →  F-forum/R2 forum-workflow
//   W-FN  buildForumRef / parseForumRef  →  F-forum/R2 (prepend) + R3 (network read)
// deps:
//   R0  ../config/forum-types
//   R5  @/core/types/substrate-raw.types  (TYPE-ONLY)
// validated:  pending

// PURE confirm-gate logic — NO I/O, NO await, NO substrate reach. Publishing crosses the
// private→public boundary, so it is wearer-gated by an explicit two-phase confirm (the locked-CTA
// precedent: phase one returns text the model surfaces to the wearer; the wearer's go-ahead arrives
// as a second call carrying confirmed:true). This layer decides ONLY which phase a call is in; the
// compose itself (recordWireTurn) is R2/R3's concern. The draft rides through untouched — this layer
// neither validates nor reshapes it (the core recordWireTurn is the sole shape validator).

import { FORUM_PUBLISH_PROMPT, FORUM_REF_SCHEME } from '../config/forum-types'
import type { ForumRef } from '../config/forum-types'
import type { Coord, Who } from '@/core/types/substrate-raw.types'

// The two-phase decision. `needs-confirm` carries the verbatim payload the driver surfaces to the
// wearer (phase one); `proceed` carries the SAME draft back out, signalling the compose may run
// (phase two). Generic over the draft type so this helper stays free of any compose vocabulary.
export type PublishDecision<D> =
  | { kind: 'needs-confirm'; payload: string }
  | { kind: 'proceed';       draft: D }

// decidePublish — phase selector. `confirmed` falsy (absent / false) → phase one: surface the
// confirm prompt, write nothing. `confirmed` true → phase two: proceed with the draft. The wearer's
// confirm is the ONLY thing that flips it; the draft is carried verbatim either way.
export function decidePublish<D>(draft: D, confirmed: boolean | undefined): PublishDecision<D> {
  return confirmed === true
    ? { kind: 'proceed', draft }
    : { kind: 'needs-confirm', payload: FORUM_PUBLISH_PROMPT }
}

// ── THE FORUM REFERENCE — symmetric encode/decode (the honest replacement for buildRootTieRef) ──
// The format lives in ONE home. build/parse are pure inverses (parse(build(c)) === c for any Coord)
// and share the ONE scheme literal from R0 — no inline `forumref` here, no regex duplicated. NO I/O.
//
// The wire form is `${FORUM_REF_SCHEME}${who}.${sc}.${pos}` — single-colon + dot-separated ON
// PURPOSE (see FORUM_REF_SCHEME): every internal punctuation is a single char flanked by word-chars,
// so the substrate cutter keeps the whole handle as ONE word-cell (a single RawWord). That is what
// lets it ride as content through recordWireTurn and come back parseable per-word from readForum.

// buildForumRef — encode a target Coord as the handle string that will ride in the payload's words.
export function buildForumRef(target: Coord): ForumRef {
  return `${FORUM_REF_SCHEME}${target.who}.${target.sc}.${target.pos}`
}

// The Who axis is open at the author, closed at the structure (substrate-raw): a decoded who must be
// one of the three stamped authors. A local guard keeps parse total (an unknown author → null, never
// a mis-cast Coord) without re-deriving the set elsewhere.
function asWho(s: string): Who | null {
  return s === 'wearer' || s === 'llm' || s === 'program' ? s : null
}

// parseForumRef — decode ONE word back to its Coord, or null for any word that is not a well-formed
// ref (a body word, a truncated handle, a non-integer coordinate). Total and strict: it reads the
// scheme prefix from R0 (never re-typing it), then requires exactly who.sc.pos with digit-only sc/pos
// (Number('') is 0, so an empty field would slip a bare Number check — the \d+ test rejects it).
export function parseForumRef(word: string): Coord | null {
  if (!word.startsWith(FORUM_REF_SCHEME)) return null
  const body = word.slice(FORUM_REF_SCHEME.length)
  const parts = body.split('.')
  if (parts.length !== 3) return null
  const [whoStr, scStr, posStr] = parts
  const who = asWho(whoStr)
  if (who === null) return null
  if (!/^\d+$/.test(scStr) || !/^\d+$/.test(posStr)) return null
  return { who, sc: Number(scStr), pos: Number(posStr) }
}
