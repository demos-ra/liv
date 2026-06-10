// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/coin-score.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    write-finalization M2/M4/M5 (pair-scoring emission + G1 re-key + wired verify);
//             COIN_SCORING_PROMPT removed → the dated manual is M1 (config/coin-manual.ts);
//             mark-gate-placement (isCoord/isMark moved to ../domain/mark-gate; consumed as a wire)
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  Who / RawTurn / RawWord / Coord   @/core/types/substrate-raw.types          (type-only)
//   W-ATOM  Mark / PlacedMark / Ref           ../config/mark-types                       (type-only)
//   W-ATOM  JsonSchema / StructuredEmitConfig @/features/F-ai-adapter/contract/ai-contract (type-only)
//   W-FN    cutCells / isWordCell             @/features/F-memory/contract/substrate-contract
//   W-FN    isCoord / isMark                  ../domain/mark-gate
// wires-out:
//   W-FN    emissionFromStructured / splitEmission / cutReply / verifyGrid / validateSharedUniverse  →  ../app/cognition-orchestrator (R2)
//   W-ATOM  SCORE_EMIT_CONFIG / SCORE_SCHEMA / ScoredEmission / ReplyMark / PriorMark                 →  ../app/cognition-orchestrator (R2)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R0  ../config/mark-types
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R1  ../domain/mark-gate
//
// COIN scoring write-path. The model emits its reply as ONE plain text field
// (`reply`) PLUS replyMarks (marks on its own reply, keyed by WORD INDEX) and
// priorMarks (marks on the person's already-cut cells, by coordinate) — both turns
// scored. splitEmission ROUTES the emission: the reply text → the wearer's substrate
// (a RawTurn of CANONICAL cells from G1 = cutCells(reply)); marks → F-present's
// external store (PlacedMarks pointing at coordinates). The substrate receives ONLY
// raw words; F-present receives ONLY pointers. No overlap.
//
// §FORK = A (reassembly-contract fix, 2-B): the reply text is AUTHORITATIVE — G1 cuts
// it (cutReply) and joinCells renders it byte-identical, so spacing is the model's own,
// never a re-join. The model never numbers the canonical grid; it references its reply
// words by 1-based index (the k-th word-cell), which cutReply resolves to the canonical
// position. The prior shape (positions[].word space-joined, then re-cut) injected a
// space before any standalone-punctuation token and is GONE — there is no reply join.

import type { Who, RawTurn, RawWord, Coord } from '@/core/types/substrate-raw.types'
import type { Mark, PlacedMark, Ref } from '@/features/F-present/config/mark-types'
import type { JsonSchema, StructuredEmitConfig } from '@/features/F-ai-adapter/contract/ai-contract'
import { cutCells, isWordCell } from '@/features/F-memory/contract/substrate-contract'
import { isCoord, isMark } from '@/features/F-present/domain/mark-gate'   // the gate (W-FN; see @manifest)

// The emission the model fills (structured output) — both turns.
// `reply` is the model's reply as plain text — authoritative for the river grid.
// `replyMarks` carry marks on the reply, keyed by WORD INDEX (1-based, counting the
// reply's word-cells left to right); cutReply resolves the index to a canonical pos.
export type ReplyMark = { word: number; marks: Mark[] }                      // word = 1-based reply word-cell index
export type PriorMark = { home: Coord; marks: Mark[] }                       // marks on the person's existing cells
export type ScoredEmission = { reply: string; replyMarks: ReplyMark[]; priorMarks: PriorMark[] }

// COIN schema (owned here, single-source). A mark is a permissive object {op + the
// fields that op uses}; the receiver narrows. Targets/peers are NAMES or COORDS.
const COORD: JsonSchema = { type: 'object', properties: { who: { type: 'string', enum: ['wearer', 'llm', 'program'] }, sc: { type: 'number' }, pos: { type: 'number' } }, required: ['who', 'sc', 'pos'], additionalProperties: false }
const REF: JsonSchema = { anyOf: [{ type: 'string' }, COORD] }
const MARK_ITEM: JsonSchema = {
  type: 'object',
  properties: {
    op: { type: 'string', enum: ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY'] },
    peers: { type: 'array', items: REF }, coloring: { type: 'string' }, target: REF,
  },
  required: ['op'], additionalProperties: false,
}
export const SCORE_SCHEMA: JsonSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    replyMarks: { type: 'array', items: {
      type: 'object',
      properties: { word: { type: 'number' }, marks: { type: 'array', items: MARK_ITEM } },
      required: ['word', 'marks'], additionalProperties: false,
    } },
    priorMarks: { type: 'array', items: {
      type: 'object',
      properties: { home: COORD, marks: { type: 'array', items: MARK_ITEM } },
      required: ['home', 'marks'], additionalProperties: false,
    } },
  },
  required: ['reply'], additionalProperties: false,
}
// streamField names the reply text for a later incremental surface; advisory today
// (the transport parses the whole object — structured-stream.ts).
export const SCORE_EMIT_CONFIG: StructuredEmitConfig = { schema: SCORE_SCHEMA, streamField: 'reply' }

export function emissionFromStructured(structured: unknown): ScoredEmission {
  if (structured === null || typeof structured !== 'object') return { reply: '', replyMarks: [], priorMarks: [] }
  const s = structured as { reply?: unknown; replyMarks?: unknown; priorMarks?: unknown }
  const reply = typeof s.reply === 'string' ? s.reply : ''
  const replyMarks: ReplyMark[] = []
  if (Array.isArray(s.replyMarks)) {
    for (const rm of s.replyMarks) {
      if (!rm || typeof rm !== 'object') continue
      const word = (rm as { word?: unknown }).word, marks = (rm as { marks?: unknown }).marks
      if (typeof word !== 'number' || !Number.isInteger(word) || word < 1) continue   // 1-based word-cell index
      replyMarks.push({ word, marks: Array.isArray(marks) ? marks.filter(isMark) : [] })
    }
  }
  const priorMarks: PriorMark[] = []
  if (Array.isArray(s.priorMarks)) {
    for (const pm of s.priorMarks) {
      if (!pm || typeof pm !== 'object') continue
      const home = (pm as { home?: unknown }).home, marks = (pm as { marks?: unknown }).marks
      if (!isCoord(home)) continue
      priorMarks.push({ home, marks: Array.isArray(marks) ? marks.filter(isMark) : [] })
    }
  }
  return { reply, replyMarks, priorMarks }
}

// ── §FORK A — G1 cuts the AUTHORITATIVE reply text; word-index → canonical position ──
// The reply text is the model's own, verbatim. cutCells(reply) is the canonical grid:
// joinCells(cells) === reply byte-for-byte (the cutter's exact inverse), so the rendered
// reply carries the model's exact spacing — no re-join, no space-before-punct. There is
// no alignment problem to solve: the reply IS the text. The only mapping is for marks —
// the k-th reply WORD-CELL (word cells in order, 1-based) has a canonical position;
// `wordCellPos[k-1]` is that position. A replyMark whose index is out of range homes
// nothing (dropped in splitEmission). This replaced rekeyReply's space-join/char-span
// re-key, which baked spurious spaces into the grid (2-B).
export function cutReply(reply: string): { cells: RawWord[]; wordCellPos: number[] } {
  const cells = cutCells(reply)
  const wordCellPos = cells.filter(c => isWordCell(c.word)).map(c => c.pos)
  return { cells, wordCellPos }
}

// ROUTE (A + pair): reply text → substrate (CANONICAL cells = cutReply); marks (both
// turns) → F-present store. Reply marks home on the canonical word-cell named by their
// 1-based word index; priorMarks home on the person's existing coords (already canonical).
export function splitEmission(emission: ScoredEmission, replyWho: Who, replySc: number): { rawTurn: RawTurn; placedMarks: PlacedMark[] } {
  const { cells, wordCellPos } = cutReply(emission.reply)
  const rawTurn: RawTurn = { sc: replySc, who: replyWho, words: cells }
  const replyMarks: PlacedMark[] = emission.replyMarks.flatMap(rm => {
    const pos = wordCellPos[rm.word - 1]                   // 1-based index → canonical word-cell position
    if (pos === undefined) return []                       // index out of range → drop (model miscounted)
    return rm.marks.map(mark => ({ home: { who: replyWho, sc: replySc, pos } as Coord, mark }))
  })
  const priorPlaced: PlacedMark[] = emission.priorMarks.flatMap(pm => pm.marks.map(mark => ({ home: pm.home, mark })))
  return { rawTurn, placedMarks: [...replyMarks, ...priorPlaced] }
}

// ── M4 verify ───────────────────────────────────────────────────────────────────
// Grid: cells numbered once & contiguous 1..N (no gap, no dup).
export function verifyGrid(cells: RawWord[]): boolean {
  const seen = new Set<number>()
  for (let i = 0; i < cells.length; i++) {
    if (cells[i].pos !== i + 1) return false
    if (seen.has(cells[i].pos)) return false
    seen.add(cells[i].pos)
  }
  return true
}

// shared-universe (coin-spec §0/§3): every target/peer must POSITIVELY resolve to
// something the reader knows — a coord key (this turn or a prior record) OR a name
// that clusters across records. Returns the marks that hold; drops danglers. `known`
// is seeded by the caller with substrate coord-keys AND the (lowercased) names in the
// universe — the lowercase convention matches the read's name clustering.
export function validateSharedUniverse(placedMarks: PlacedMark[], known: Set<string>): PlacedMark[] {
  const refKey = (r: Ref) => typeof r === 'string' ? r.toLowerCase() : `${r.who}:${r.sc}:${r.pos}`
  return placedMarks.filter(pm => {
    const m = pm.mark
    const ts: Ref[] = m.op === 'RELATE' ? m.peers : (m.op === 'QUALIFY' || m.op === 'IDENTIFY') ? [m.target] : []
    return ts.every(t => known.has(refKey(t)))
  })
}
