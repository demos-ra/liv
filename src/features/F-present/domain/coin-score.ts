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
//   W-FN    emissionFromStructured / splitEmission / rekeyReply / verifyGrid / validateSharedUniverse  →  ../app/cognition-orchestrator (R2)
//   W-ATOM  SCORE_EMIT_CONFIG / SCORE_SCHEMA / ScoredEmission / ScoredPosition / PriorMark              →  ../app/cognition-orchestrator (R2)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R0  ../config/mark-types
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R1  ../domain/mark-gate
//
// COIN scoring write-path. The model emits scored positions (its reply, word + marks)
// PLUS priorMarks (marks on the person's already-cut cells, by coordinate) — both turns
// scored. splitEmission ROUTES the emission: raw words → the wearer's substrate (a
// RawTurn of CANONICAL cells from G1); marks → F-present's external store (PlacedMarks
// pointing at coordinates). The substrate receives ONLY raw words; F-present receives
// ONLY pointers. No overlap. §FORK = A: the model self-cuts its reply coarsely; G1
// re-cuts canonically and splitEmission re-keys each reply mark word→word-cell (the
// deterministic head-cell rule). The model never numbers the canonical grid.

import type { Who, RawTurn, RawWord, Coord } from '@/core/types/substrate-raw.types'
import type { Mark, PlacedMark, Ref } from '@/features/F-present/config/mark-types'
import type { JsonSchema, StructuredEmitConfig } from '@/features/F-ai-adapter/contract/ai-contract'
import { cutCells, isWordCell } from '@/features/F-memory/contract/substrate-contract'
import { isCoord, isMark } from '@/features/F-present/domain/mark-gate'   // the gate (W-FN; see @manifest)

// The emission the model fills (structured output) — both turns.
export type ScoredPosition = { pos: number; word: string; marks: Mark[] }   // the reply (coarse; G1 re-keys)
export type PriorMark = { home: Coord; marks: Mark[] }                       // marks on the person's existing cells
export type ScoredEmission = { positions: ScoredPosition[]; priorMarks: PriorMark[] }

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
    positions: { type: 'array', items: {
      type: 'object',
      properties: { pos: { type: 'number' }, word: { type: 'string' }, marks: { type: 'array', items: MARK_ITEM } },
      required: ['pos', 'word', 'marks'], additionalProperties: false,
    } },
    priorMarks: { type: 'array', items: {
      type: 'object',
      properties: { home: COORD, marks: { type: 'array', items: MARK_ITEM } },
      required: ['home', 'marks'], additionalProperties: false,
    } },
  },
  required: ['positions'], additionalProperties: false,
}
export const SCORE_EMIT_CONFIG: StructuredEmitConfig = { schema: SCORE_SCHEMA, streamArray: 'positions', streamField: 'word' }

export function emissionFromStructured(structured: unknown): ScoredEmission {
  if (structured === null || typeof structured !== 'object') return { positions: [], priorMarks: [] }
  const s = structured as { positions?: unknown; priorMarks?: unknown }
  const positions: ScoredPosition[] = []
  if (Array.isArray(s.positions)) {
    for (const p of s.positions) {
      if (!p || typeof p !== 'object') continue
      const pos = (p as { pos?: unknown }).pos, word = (p as { word?: unknown }).word, marks = (p as { marks?: unknown }).marks
      if (typeof pos !== 'number' || typeof word !== 'string') continue
      positions.push({ pos, word, marks: Array.isArray(marks) ? marks.filter(isMark) : [] })
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
  return { positions, priorMarks }
}

// ── §FORK A re-key — the model's coarse reply positions → G1's canonical word-cells ──
// canonical reply text = the model's words joined by single space; G1 re-cuts; each
// model word maps to the FIRST word-cell of its char span (deterministic head-cell rule).
//
// Alignment is by CHARACTER OFFSET, not array index: each emitted word occupies a known
// span in the joined text, and we home on the first word-cell overlapping that span. This
// is fail-closed against a non-conforming emission (M1 says one non-empty whitespace-free
// token per position; emissionFromStructured does not enforce it): an empty word advances
// the cursor by its joining space and homes nothing (it has no cell); a word that contains
// whitespace homes on its head word-cell and never desyncs the words after it. An
// index-based walk would let an empty word eat the next segment and silently mis-home or
// drop every subsequent reply mark — offset alignment cannot.
export function rekeyReply(positions: ScoredPosition[]): { cells: RawWord[]; homeOf: Map<number, number> } {
  const text = positions.map(p => p.word).join(' ')
  const cells = cutCells(text)
  // char span of every canonical cell in `text` (cells partition the text in order)
  const spans: { start: number; end: number; cell: RawWord }[] = []
  let at = 0
  for (const c of cells) { spans.push({ start: at, end: at + c.word.length, cell: c }); at += c.word.length }
  // walk the model words by their char offset in the single-space join; head-cell of each span
  const homeOf = new Map<number, number>()
  let cursor = 0
  for (const p of positions) {
    const wStart = cursor
    const wEnd = cursor + p.word.length
    cursor = wEnd + 1                                   // +1 for the joining space (holds even when p.word === '')
    if (p.word.length === 0) continue                   // empty word: no span, nothing to home
    const head = spans.find(s => isWordCell(s.cell.word) && s.start < wEnd && s.end > wStart)
    if (head) homeOf.set(p.pos, head.cell.pos)
  }
  return { cells, homeOf }
}

// ROUTE (A + pair): reply words → substrate (CANONICAL cells); marks (both turns) →
// F-present store. Reply marks re-key to canonical word-cells; priorMarks home on the
// person's existing coords (already canonical — no re-key).
export function splitEmission(emission: ScoredEmission, replyWho: Who, replySc: number): { rawTurn: RawTurn; placedMarks: PlacedMark[] } {
  const { cells, homeOf } = rekeyReply(emission.positions)
  const rawTurn: RawTurn = { sc: replySc, who: replyWho, words: cells }
  const replyMarks: PlacedMark[] = emission.positions.flatMap(p => {
    const pos = homeOf.get(p.pos)
    if (pos === undefined) return []                       // model marked a non-word cell → drop (M4 also catches)
    return p.marks.map(mark => ({ home: { who: replyWho, sc: replySc, pos } as Coord, mark }))
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
