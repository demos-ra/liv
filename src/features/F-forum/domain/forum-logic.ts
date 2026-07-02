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
//   W-ATOM  FORUM_ROOT_URN       ../config/forum-types  (the root resource URN — parse decodes it to 'root')
//   W-ATOM  FORUM_CONFIRMED_URN  ../config/forum-types  (the reserved 'confirmed' MOTIVATION marker — build/parse home)
//   W-ATOM  ForumRef / ForumNode / ForumThread / ForumBoard  ../config/forum-types
//   W-ATOM  Coord                @/core/types/substrate-raw.types  (TYPE-ONLY — the ref's target)
// wires-out:
//   W-FN  decidePublish  →  F-forum/R2 forum-workflow
//   W-ATOM PublishDecision  →  F-forum/R2 forum-workflow
//   W-FN  buildForumRef / parseForumRef  →  F-forum/R2 (prepend) + R3 (network read)
//   W-FN  buildConfirmedRef / parseForumMotivation  →  F-forum/R2 (stamp) + R3 (audit read)
//   W-FN  renderForumThreads  →  F-forum/R3 (the browse view — re-exposed for the F-mcp wire)
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

import { FORUM_PUBLISH_PROMPT, FORUM_REF_SCHEME, FORUM_ROOT_URN, FORUM_CONFIRMED_URN } from '../config/forum-types'
import type { ForumRef, ForumNode, ForumThread, ForumBoard } from '../config/forum-types'
import type { Coord, Who, RawTurn } from '@/core/types/substrate-raw.types'

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

// ── THE FORUM REFERENCE — the URN codec (RFC 8141; the honest replacement for buildRootTieRef) ──
// The format lives in ONE home. build/parse of a coordinate URN are pure inverses (parse(build(c)) ===
// c for any Coord) and share the ONE scheme literal from R0 — no inline scheme here, no regex
// duplicated. NO I/O.
//
// The wire form is `${FORUM_REF_SCHEME}${who}.${sc}.${pos}` — single-colon + dot-separated ON
// PURPOSE (see FORUM_REF_SCHEME): every internal punctuation is a single char flanked by word-chars,
// so the substrate cutter keeps the whole handle as ONE word-cell (a single RawWord). That is what
// lets it ride as content through recordWireTurn and come back parseable per-word from readForum.

// buildForumRef — encode a target Coord as the coordinate URN that will ride in the payload's words.
export function buildForumRef(target: Coord): ForumRef {
  return `${FORUM_REF_SCHEME}${target.who}.${target.sc}.${target.pos}`
}

// The Who axis is open at the author, closed at the structure (substrate-raw): a decoded who must be
// one of the three stamped authors. A local guard keeps parse total (an unknown author → null, never
// a mis-cast Coord) without re-deriving the set elsewhere.
function asWho(s: string): Who | null {
  return s === 'wearer' || s === 'llm' || s === 'program' ? s : null
}

// parseForumRef — decode ONE word back to its edge: the 'root' marker for the reserved resource URN
// (FORUM_ROOT_URN — a top post's target), a Coord for a coordinate URN, or null for any word that is
// not a well-formed ref (a body word, a truncated handle, a non-integer coordinate, a different
// scheme). Total and strict: it reads the scheme prefix from R0 (never re-typing it), then requires
// exactly who.sc.pos with digit-only sc/pos (Number('') is 0, so an empty field would slip a bare
// Number check — the \d+ test rejects it).
export function parseForumRef(word: string): Coord | 'root' | null {
  if (word === FORUM_ROOT_URN) return 'root'
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

// ── THE CONFIRMED MOTIVATION — the un-weld: recorded consent, not a throwaway boolean ──────────────
// The wearer's publish-confirm becomes RECORDED data (the Web Annotation motivation slot,
// forum-reference-standard §2). buildConfirmedRef emits the reserved marker publish stamps into the
// payload; parseForumMotivation is its strict inverse. Both read the ONE reserved literal from R0 — no
// inline scheme here. NO I/O. The motivation is a SEPARATE slot from the target edge: parseForumRef
// decodes who.sc.pos / the root board and returns null for the confirmed marker, so the leading target
// and the trailing consent never collide — two non-overlapping decoders over the same word stream.

// buildConfirmedRef — the reserved 'confirmed' motivation URN, the value publish records so the wearer's
// go-ahead lives IN the memory (auditable), rather than gating a write and vanishing.
export function buildConfirmedRef(): ForumRef {
  return FORUM_CONFIRMED_URN
}

// parseForumMotivation — decode ONE word to its motivation slot: 'confirmed' for the reserved marker,
// null for anything else (a body word, a target ref, a different scheme). Total and strict; the audit
// read scans a payload's words with this to find the recorded consent.
export function parseForumMotivation(word: string): 'confirmed' | null {
  return word === FORUM_CONFIRMED_URN ? 'confirmed' : null
}

// ── THE FORUM THREAD RENDERER — the browse view for look·public (pure, deterministic) ──────────────
// GENERIC + RECURSIVE — it hardcodes NO board. It folds a flat ForumNode[] (readForumNetwork's output)
// into the reference tree: each node nested under the node whose URN it targets, recursively; a node
// whose target is NOT a loaded node (a reserved BOARD URN, or a parent outside the read window) becomes
// a TOP post under that target URN. Boards are therefore just target URNs owned by no node — a FUTURE
// reserved board (a subboard URN) buckets automatically once its edge is decoded upstream, with NO
// change to this tree logic: only a new reserved URN is added at R0 + its decode at the codec above.
// Deterministic + pure: boards in first-seen order, threads/children in input order, no I/O.

// refToUrn — the ref-format decode: a parsed edge back to the target URN string it names (the root board
// marker → FORUM_ROOT_URN, a coordinate parent → its coordinate URN). Part of the codec (the format's
// home), read by the renderer's tree fold below.
function refToUrn(ref: Coord | 'root'): ForumRef {
  return ref === 'root' ? FORUM_ROOT_URN : buildForumRef(ref)
}

// nodeUrnOf — a post's OWN address: its leading-word coordinate as a URN (the word a reply targets). A
// published post leads with its ref handle (withRefPrepended), so the leading word's coordinate is the
// post's stable anchor. A ref-less / empty payload anchors at pos 0.
function nodeUrnOf(node: RawTurn): ForumRef {
  return buildForumRef({ who: node.who, sc: node.sc, pos: node.words[0]?.pos ?? 0 })
}

// renderForumThreads — fold the flat network into boards of threads. Two passes: (1) one thread cell per
// node, indexed by its own URN; (2) each node nested under its loaded parent, else rooted under the
// target board (or the root board for a ref-less payload). Building all cells before folding makes the
// parent lookup order-independent — a reply nests whether it reads before or after its parent. The
// self-guard (parentUrn !== own URN) blocks a self-loop; true cycles are impossible (a reply targets a
// pre-existing lower coordinate — coordinates are monotonic).
export function renderForumThreads(nodes: ForumNode[]): ForumBoard[] {
  const byUrn = new Map<ForumRef, ForumThread>()
  const seq: { thread: ForumThread; parentUrn: ForumRef | null }[] = []
  for (const { node, ref } of nodes) {
    const urn = nodeUrnOf(node)
    const thread: ForumThread = { urn, node, children: [] }
    if (!byUrn.has(urn)) byUrn.set(urn, thread)
    seq.push({ thread, parentUrn: ref === null ? null : refToUrn(ref) })
  }

  const boards: ForumBoard[] = []
  const boardByUrn = new Map<ForumRef, ForumBoard>()
  const rootUnder = (board: ForumRef, thread: ForumThread): void => {
    let b = boardByUrn.get(board)
    if (b === undefined) {
      b = { board, threads: [] }
      boardByUrn.set(board, b)
      boards.push(b)
    }
    b.threads.push(thread)
  }

  for (const { thread, parentUrn } of seq) {
    const parent = parentUrn !== null && parentUrn !== thread.urn ? byUrn.get(parentUrn) : undefined
    if (parent !== undefined) parent.children.push(thread)
    else rootUnder(parentUrn ?? FORUM_ROOT_URN, thread)
  }
  return boards
}
