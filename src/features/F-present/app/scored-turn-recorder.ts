// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/scored-turn-recorder.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-wire-cognition Shot 1 (extraction of composeAndWrite steps 2–7 into
//               ONE composition — the scored-turn recorder; single-cut folded in);
//             sprint-wire-cognition Shot 2 (M4 universe seeded from the session window)
//             sprint-wire-economy Shot 1 (PAIRED-TURN recorder — accepts the wearer source
//               (native: E1's already-written turn; wire: the turn door's wearerText) and
//               scores BOTH turns. CLAIM + VALIDATE order: locate+verify BOTH mark sets by
//               word-index↔surface BEFORE any write — a false claim throws MarkSurfaceError
//               and nothing persists (the wire is atomic; native's wearer turn is E1's
//               pre-write, untouched). "feeds it", not "moves inside": E1's perimeter
//               stamping is never disturbed (§7).)
//             Wing-B E3 REWORK (block + payload are first-class CELLS): the Y-seam's two-arm
//               convergence is GONE — both arms are now ONE cut. cutReply uses shapeAwareCut, so
//               each block/payload region is ONE cell at its own coordinate; locateCellIdentities
//               places an `identity` mark DIRECTLY on each home-capable block/payload cell, at its
//               OWN pos — no naming, no leading-word collision, no convergeArms. A payload-cell's
//               `word` IS the livbyte:// handle (the sidecar PayloadAppearance.handle / arms.payloads
//               are superseded — y-seam.ts removed); bytes resolve lazily via the §3b socket on
//               read, never a Ref. locateWordMarks still serves the model's OWN named spans only.
//             cognition-turn contract (the door is transport): the `{ text }` WearerSource
//               intake now takes `unknown` and guards a non-string → empty wearer text. The
//               MCP door sheds emission-SHAPE validation (mis-owned at R1); this contract is
//               the sole validator, so the wearerText-is-usable-text guard homes HERE.
//             inline-marking Touch 2 (additive recorder fork by FORMAT): recordScoredTurn gains a
//               `replyMarking: 'separate' | 'inline'` param (absent ≡ 'separate' — the SpanMark[]
//               path, byte-identical to today). It reaches the recorder from the caller's SITUATION
//               (native NATIVE_SITUATION / wire MCP_SITUATION), NEVER from a surface name. When
//               'inline' the reply carries its marks in its text: parseInlineReply STRIPS the markup
//               → the CLEAN reply (cut by the SAME deps.cutReply — no second cutter) + each wrap's
//               span offsets, and the reply-side locate consumes those offsets (locateInlineMarks)
//               instead of locateWordMarks-by-name. locateCellIdentities (block/payload auto-identity)
//               runs UNCHANGED on the inline path. The PRIOR side, the cut, homeMarks, verifyGrid,
//               validateSharedUniverse, the write order and the WriteAck are all UNTOUCHED.
// slice:      F-present
// layer:      R2
// wires-in:
//   W-FN    cutReply/wordCells/locateWordMarks/locateCellIdentities/homeMarks/verifyGrid/validateSharedUniverse/parseInlineReply/locateInlineMarks  ../domain/coin-score
//   W-ATOM  ScoredEmission                                             ../domain/coin-score (type-only)
//   W-FN    buildFactTable                                             ../domain/fact-table
//   W-FN    resolveDimension                                           ../domain/resolve-dimension
//   W-FN    weighDimension                                             ../domain/chain-ping
//   W-FN    currentFocus/sessionWindow                                 ../domain/session-window
//   W-FN    createDbPresentMarkStore                                   ../exec/present-mark-store-db
//   W-ATOM  PresentMarkStore                                           ../app/present-store (type-only)
//   W-ATOM  PlacedMark                                                 ../config/mark-types (type-only)
//   W-FN    writeRawTurn/readTranscript/joinCells/cutCells   @/features/F-memory/contract/substrate-contract (R3 surface)
//   W-ATOM  RawTurn/RawWord/Who                     @/core/types/substrate-raw.types (type-only)
// wires-out:
//   W-FN    recordScoredTurn  →  ../app/cognition-orchestrator (R2), ../contract/present-contract (R3 → F-mcp wire)
//   W-ATOM  WearerSource      →  ../app/cognition-orchestrator (R2), F-mcp wire (R3)
// deps:
//   R1  ../domain/coin-score          (Wing-B E3 — shapeAwareCut via cutReply + locateCellIdentities)
//   R1  ../domain/fact-table
//   R1  ../domain/resolve-dimension
//   R1  ../domain/chain-ping
//   R1  ../domain/session-window
//   R4  ../exec/present-mark-store-db
//   R2  ../app/present-store
//   R0  ../config/mark-types
//   R3  @/features/F-memory/contract/substrate-contract
//   R0  @/core/types/substrate-raw.types
//
// ─────────────────────────────────────────────────────────────────────────────
// THE SCORED-TURN RECORDER (R2). One composition that records a PAIR of turns — the
// person's words-only turn and the llm/program reply that carries its pair-scoring —
// into the substrate + the lens. It is the shared spine of BOTH scored-turn writers:
//   - native cognition (composeAndWrite): the wearer turn is ALREADY written by E1 (the
//     chat spine, at the perimeter); the recorder takes it as `wearer: { written }` and
//     records only the reply + both mark sets. E1's perimeter stamping is untouched.
//   - the demanded wire (F-mcp turn door): one call carries wearerText + the scored reply;
//     the recorder takes `wearer: { text }`, cuts + writes the wearer turn, then the reply.
//
// THE ORDER (sprint-wire-economy Shot 1) — CLAIM + VALIDATE, validate BEFORE write:
//   cut reply ONCE · resolve the wearer word-cells (cut text, or E1's) ·
//   locateWordMarks(reply) + locateWordMarks(prior) — VERIFY index↔surface, throw loud ·
//   THEN writeRawTurn(wearer?) · writeRawTurn(reply) · homeMarks · M4 verify · place · render.
// A surface-check failure raises MarkSurfaceError before any write — the turn is rejected
// loud and nothing persists (wire atomic; native's wearer is E1's pre-write). §FORK = A:
// the reply text is authoritative; joinCells renders it byte-identical (no re-join).
//
// A4 (isolated execution): the ambient I/O — transcript read, raw-turn write, the mark
// store — and the canonical cutters are INJECTED as `deps`. Production callers omit deps
// and get the real wires; tests inject stubs to run DB-free and to COUNT the single cut.
// ─────────────────────────────────────────────────────────────────────────────

import { cutReply, wordCells, locateWordMarks, locateCellIdentities, homeMarks, verifyGrid, validateSharedUniverse, parseInlineReply, locateInlineMarks } from '@/features/F-present/domain/coin-score'
import type { ScoredEmission } from '@/features/F-present/domain/coin-score'
import { buildFactTable } from '@/features/F-present/domain/fact-table'
import { resolveDimension } from '@/features/F-present/domain/resolve-dimension'
import { weighDimension } from '@/features/F-present/domain/chain-ping'
import { currentFocus, sessionWindow } from '@/features/F-present/domain/session-window'
import { createDbPresentMarkStore } from '@/features/F-present/exec/present-mark-store-db'
import type { PresentMarkStore } from '@/features/F-present/app/present-store'
import type { PlacedMark } from '@/features/F-present/config/mark-types'
import { admitWriteRaw, readTranscript, joinCells, cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { RawTurn, RawWord, Who } from '@/core/types/substrate-raw.types'

// What the recorder returns — the substrate position (sc) of the reply, the CANONICAL cut
// (so the caller holds exact coordinates), the count of marks that survived M4, and the
// byte-identical render of the reply (joinCells, never an ad-hoc join).
export type RecordedTurn = { sc: number; cells: RawWord[]; markCount: number; text: string }

// The wearer turn this scored reply answers. Native hands the turn E1 already wrote
// (its sc + word-cells, for priorMark resolution); the wire hands the raw text and the
// recorder cuts + writes it. priorMarks resolve against this turn's word-cells.
export type WearerSource =
  | { written: { sc: number; wordCells: RawWord[] } }   // native — E1 wrote it (perimeter-stamped, untouched)
  | { text: unknown }                                   // wire — the turn door's wearerText (the door sheds shape-validation;
                                                        //   this contract is the sole validator); recorder cuts + writes

// How the reply carries its marks — the FORMAT axis, mirroring MarkingSituation.replyMarking
// (coin-score R1). It reaches the recorder from the SITUATION the caller is in (native →
// NATIVE_SITUATION, wire → MCP_SITUATION), NOT from any surface name: the recorder branches on
// the format, never on which surface called. Absent ≡ 'separate' (the SpanMark[] path,
// byte-identical to today). 'inline' selects the parsed-span reply-side homer (locateInlineMarks).
export type ReplyMarking = 'separate' | 'inline'

// The injected I/O + cutter seam (A4). Default-bound to the live wires.
export type ScoredTurnDeps = {
  readTranscript: (userId: string) => Promise<RawTurn[]>
  writeRawTurn:   (input: { who: Who; words: RawWord[]; userId: string; scope: string }) => Promise<number>
  store:          PresentMarkStore
  cutReply:       (reply: string) => { cells: RawWord[]; wordCellPos: number[] }
  cutCells:       (text: string) => RawWord[]
}

function defaultDeps(): ScoredTurnDeps {
  // the production reply/wearer writes route through the F-009 seam (admit + writeRawTurn); the dep
  // key stays `writeRawTurn` (its shape) so tests inject their own. Pure indirection (admits today).
  return { readTranscript, writeRawTurn: admitWriteRaw, store: createDbPresentMarkStore(), cutReply, cutCells }
}

const EMPTY: RecordedTurn = { sc: 0, cells: [], markCount: 0, text: '' }

// Record ONE scored turn against its wearer turn. `emission` is already narrowed
// (emissionFromStructured) — the structural gate that drops malformed marks lives there.
// The LOUD index↔surface validation is here (locateWordMarks), ahead of any write.
export async function recordScoredTurn(
  emission: ScoredEmission,
  who: Who,
  userId: string,
  scope: string,
  wearer: WearerSource,
  replyMarking: ReplyMarking = 'separate',
  deps: ScoredTurnDeps = defaultDeps(),
): Promise<RecordedTurn> {
  // Empty / malformed reply → honest non-write (byte-identical to the prior guard).
  if (emission.reply.length === 0) return EMPTY

  // 1. cut the reply ONCE — the canonical grid (the reply text is authoritative, §FORK = A).
  //    INLINE (format, never surface): the reply carries its marks in its text ([[ … ]] + musical),
  //    so parseInlineReply STRIPS the markup → the CLEAN reply (what gets cut) + each wrap's span
  //    offsets. The cut stays deps.cutReply — the SAME ONE cutter, run on the clean text (no second
  //    cutter). SEPARATE (absent/today): cut the reply text as-is. The parsed inline spans (if any)
  //    feed the reply-side locate in step 3; the prior side is unchanged in both formats.
  const parsedInline = replyMarking === 'inline' ? parseInlineReply(emission.reply) : null
  const replyText = parsedInline ? parsedInline.clean : emission.reply
  const replyCut = deps.cutReply(replyText)
  const replyCells = replyCut.cells
  if (replyCells.length === 0) return EMPTY

  // 2. resolve the wearer turn's word-cells (native: E1's; wire: cut the text — written below).
  let wearerSc: number | null
  let wearerWordCells: RawWord[]
  let wearerFull: RawWord[] | null = null
  if ('written' in wearer) {
    wearerSc = wearer.written.sc
    wearerWordCells = wearer.written.wordCells
  } else {
    // the wire's wearerText arrives `unknown` (the door sheds shape-validation — this
    // contract is the sole validator). A non-string is absorbed HERE → empty wearer text,
    // never thrown into cutCells (graceful; nothing masked). The reply still records; any
    // priorMarks against the now-empty wearer turn fail LOUD via locateWordMarks (out of
    // range), not silently here. This is the one guard that followed the contract home.
    const text = typeof wearer.text === 'string' ? wearer.text : ''
    wearerFull = deps.cutCells(text)
    wearerWordCells = wordCells(wearerFull)
    wearerSc = null
  }

  // 3. CLAIM + VALIDATE — locate the model's NAMED marks by span↔surface, byte-exact. A false
  //    claim throws MarkSurfaceError HERE, before any write: the turn is rejected loud and
  //    nothing persists. `pos` is intrinsic to the cut (no sc yet), so this precedes the write.
  //
  //    Wing-B E3 (block + payload are first-class CELLS): there is no two-arm convergence to run.
  //    The reply was cut with shapeAwareCut (cutReply), so each block/payload region is ALREADY
  //    ONE cell at its own coordinate. locateCellIdentities places an `identity` mark DIRECTLY on
  //    each home-capable block/payload cell — at the cell's OWN pos, no naming, no leading word.
  //    A payload-cell's CONTENT is its own `word` (the livbyte:// handle); bytes resolve lazily
  //    via the §3b socket on read, never a Ref. The model's own named replyMarks/priorMarks still
  //    locate by name (locateWordMarks). Both home-paths return { pos, marks } and merge into one.
  //
  //    INLINE vs SEPARATE is the reply-side FORK, by FORMAT (never surface): under 'inline' the
  //    reply's own marks were folded into its text, so they home from the PARSED SPAN OFFSETS
  //    (locateInlineMarks over the same replyCells) instead of locateWordMarks-by-name. Both
  //    return the SAME { pos, marks } shape. locateCellIdentities (block/payload auto-identity)
  //    runs UNCHANGED on the inline path. The PRIOR side is UNCHANGED in both formats — priorMarks
  //    always resolve against the wearer cells by name.
  const replyWordLocated = parsedInline
    ? locateInlineMarks(parsedInline.marks, replyCells)
    : locateWordMarks(emission.replyMarks, replyCells, 'reply')
  const replyLocated = [
    ...replyWordLocated,
    ...locateCellIdentities(replyCells),
  ]
  const priorLocated = locateWordMarks(emission.priorMarks, wearerWordCells, 'prior')

  // 4. session window (Shot 2): the M4 universe is the windowed run from the EXISTING
  //    transcript + lens, not all history. This turn's writes land below.
  const transcript = await deps.readTranscript(userId)
  const store = await deps.store.read(userId)
  const rows = buildFactTable(transcript, store)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  const window = sessionWindow(transcript, dim, rows, currentFocus(dim))

  // 5. WRITE — wearer first (wire only; native's is already in the substrate), then the
  //    reply. The assigned position IS sc — one coordinate; the marks placed below key on it.
  if (wearerFull) wearerSc = await deps.writeRawTurn({ who: 'wearer', words: wearerFull, userId, scope })
  const sc = await deps.writeRawTurn({ who, words: replyCells, userId, scope })

  // 6. HOME the located marks now both sc's are assigned (reply on this turn; prior on the
  //    wearer turn). `pos` was resolved+verified in step 3; who+sc complete the Coord.
  const placedMarks: PlacedMark[] = [
    ...homeMarks(replyLocated, who, sc),
    ...homeMarks(priorLocated, 'wearer', wearerSc as number),
  ]

  // 7. M4 VERIFY — (a) the reply grid is numbered once & contiguous; (b) every ref POSITIVELY
  //    resolves against the known universe (this reply's cells + the wearer turn's word-cells
  //    + the windowed turns: coord-keys AND lowercased names). Marks failing either drop.
  const known = new Set<string>()
  for (const c of replyCells) { known.add(`${who}:${sc}:${c.pos}`); known.add(c.word.toLowerCase()) }
  for (const c of wearerWordCells) { known.add(`wearer:${wearerSc as number}:${c.pos}`); known.add(c.word.toLowerCase()) }
  for (const t of window) for (const w of t.words) { known.add(`${t.who}:${t.sc}:${w.pos}`); known.add(w.word.toLowerCase()) }
  const verified = verifyGrid(replyCells) ? validateSharedUniverse(placedMarks, known) : []

  // 8. place the verified marks into F-present's store (writes nothing to substrate).
  await deps.store.place(userId, verified)

  // 9. render text — G1's inverse (joinCells), never an ad-hoc space-join.
  return { sc, cells: replyCells, markCount: verified.length, text: joinCells(replyCells) }
}
