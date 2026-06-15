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
//             mark-gate-placement (isCoord/isMark moved to ../domain/mark-gate; consumed as a wire);
//             sprint-wire-cognition Shot 1 (splitEmission accepts the caller's cut — single
//               tokenization per turn; still the single source of mark geometry)
//             sprint-wire-economy Shot 1 (CLAIM + VALIDATE — both turns marked by 1-based
//               WORD-INDEX into the text of THIS call, each mark carrying its `surface` word;
//               LIV cuts, resolves index→canonical pos, and VERIFIES cell.word === surface,
//               byte-exact; mismatch / out-of-range → loud rejection (MarkSurfaceError) naming
//               index, claimed surface, actual surface. splitEmission's coord-homed priorMarks
//               and silent index-drop are gone — replaced by locateWordMarks over BOTH texts.)
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  Who / RawWord / Coord             @/core/types/substrate-raw.types          (type-only)
//   W-ATOM  Mark / PlacedMark / Ref           ../config/mark-types                       (type-only)
//   W-ATOM  JsonSchema / StructuredEmitConfig @/features/F-ai-adapter/contract/ai-contract (type-only)
//   W-FN    cutCells / isWordCell             @/features/F-memory/contract/substrate-contract
//   W-FN    isMark                            ../domain/mark-gate
//   W-ATOM  MUSICAL_OPS / toEngineMark        ../config/register-map                     (R9 register seam — emit enum + intake translate)
// wires-out:
//   W-FN    emissionFromStructured / cutReply / wordCells / locateWordMarks / homeMarks
//           / verifyGrid / validateSharedUniverse  →  ../app/scored-turn-recorder (R2)
//   W-ATOM  SCORE_EMIT_CONFIG / SCORE_SCHEMA / ScoredEmission / WordMark / MarkSurfaceError
//                                                    →  ../app/cognition-orchestrator (R2), ../app/scored-turn-recorder (R2)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R0  ../config/mark-types
//   R0  ../config/register-map
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R1  ../domain/mark-gate
//
// COIN scoring write-path. The model emits its reply as ONE plain text field (`reply`)
// PLUS replyMarks (marks on its own reply) and priorMarks (marks on the person's turn) —
// both turns scored, BOTH keyed the same way: a 1-based WORD-INDEX into the text of THIS
// call, each entry carrying the `surface` word it claims to land on. The reply text →
// the wearer's substrate (a RawTurn of CANONICAL cells from G1 = cutCells(reply)); the
// marks → F-present's external store (PlacedMarks pointing at coordinates). No overlap.
//
// §FORK = A (reassembly-contract fix, 2-B): the reply text is AUTHORITATIVE — G1 cuts it
// and joinCells renders it byte-identical, so spacing is the model's own, never a re-join.
//
// EMISSION-SEMANTIC PIN (sprint-wire-economy A2.1): indexes count WORD-CELLS of this
// call's texts (the reply for replyMarks, the wearer turn for priorMarks). A canonical
// cell coordinate appears ONLY inside a Ref (a mark's target/peer), and ONLY copied from
// lookup output — never computed, never used as a home index. The surface-check is what
// makes this safe: a canonical position emitted where a word-index belongs lands on the
// wrong word-cell, its surface disagrees, and locateWordMarks rejects it loud.

import type { Who, RawWord, Coord } from '@/core/types/substrate-raw.types'
import type { Mark, PlacedMark, Ref } from '@/features/F-present/config/mark-types'
import type { JsonSchema, StructuredEmitConfig } from '@/features/F-ai-adapter/contract/ai-contract'
import { cutCells, isWordCell } from '@/features/F-memory/contract/substrate-contract'
import { isMark } from '@/features/F-present/domain/mark-gate'   // the gate (W-FN; see @manifest)
import { MUSICAL_OPS, toEngineMark } from '@/features/F-present/config/register-map'   // R9 register seam (translate names; the gate validates)

// The emission the model fills (structured output) — both turns. `reply` is the model's
// reply as plain text (authoritative for the river grid). replyMarks score the reply;
// priorMarks score the person's most-recent turn. BOTH are WordMarks: { word, surface,
// marks } — word is the 1-based word-cell index INTO THE RELEVANT TEXT, surface the word
// the model claims sits there (the validation key).
export type WordMark = { word: number; surface: string; marks: Mark[] }
export type ScoredEmission = { reply: string; replyMarks: WordMark[]; priorMarks: WordMark[] }

// A surface-check failure — the model's claim (word-index → surface) disagrees with the
// machine's cut. Loud, named, byte-exact: index, claimed surface, actual surface (or the
// out-of-range count). Distinct class so the perimeters (native composer, wire turn door)
// can catch THIS specifically and state it truthfully, separate from any other failure.
export class MarkSurfaceError extends Error {
  constructor(message: string) { super(message); this.name = 'MarkSurfaceError' }
}

// COIN schema (owned here, single-source). A mark is a permissive object {op + the fields
// that op uses}; the receiver narrows. Targets/peers are NAMES or COORDS (copied from
// lookup). Both replyMarks and priorMarks share the WordMark shape: word + surface + marks.
const COORD: JsonSchema = { type: 'object', properties: { who: { type: 'string', enum: ['wearer', 'llm', 'program'] }, sc: { type: 'number' }, pos: { type: 'number' } }, required: ['who', 'sc', 'pos'], additionalProperties: false }
const REF: JsonSchema = { anyOf: [{ type: 'string' }, COORD] }
// op is advertised in the MUSICAL register (R9 — model-facing surface): note·tie·chord·
// expression. toEngineMark re-skins it to the engine vocabulary at intake, then mark-gate
// validates. The payload field names (peers/coloring/target) are register-neutral.
const MARK_ITEM: JsonSchema = {
  type: 'object',
  properties: {
    op: { type: 'string', enum: [...MUSICAL_OPS] },
    peers: { type: 'array', items: REF }, coloring: { type: 'string' }, target: REF,
  },
  required: ['op'], additionalProperties: false,
}
const WORD_MARK_ITEM: JsonSchema = {
  type: 'object',
  properties: {
    word: { type: 'number' }, surface: { type: 'string' }, marks: { type: 'array', items: MARK_ITEM },
  },
  required: ['word', 'surface', 'marks'], additionalProperties: false,
}
export const SCORE_SCHEMA: JsonSchema = {
  type: 'object',
  properties: {
    reply: { type: 'string' },
    replyMarks: { type: 'array', items: WORD_MARK_ITEM },
    priorMarks: { type: 'array', items: WORD_MARK_ITEM },
  },
  required: ['reply'], additionalProperties: false,
}
// streamField names the reply text for a later incremental surface; advisory today
// (the transport parses the whole object — structured-stream.ts).
export const SCORE_EMIT_CONFIG: StructuredEmitConfig = { schema: SCORE_SCHEMA, streamField: 'reply' }

// Narrow an arbitrary WordMark[] candidate: keep entries with a 1-based integer `word`,
// a string `surface`, and gate each mark through isMark. This is STRUCTURAL narrowing
// only (never throws) — the LOUD index↔surface validation is locateWordMarks, which runs
// against the actual cut. A claim that was never made (no word / no surface) is dropped
// here, fail-closed; a FALSE claim (wrong surface / out of range) is caught loud below.
function narrowWordMarks(v: unknown): WordMark[] {
  const out: WordMark[] = []
  if (!Array.isArray(v)) return out
  for (const e of v) {
    if (!e || typeof e !== 'object') continue
    const word = (e as { word?: unknown }).word
    const surface = (e as { surface?: unknown }).surface
    const marks = (e as { marks?: unknown }).marks
    if (typeof word !== 'number' || !Number.isInteger(word) || word < 1) continue
    if (typeof surface !== 'string') continue
    // R9 intake: translate the op name musical→engine (toEngineMark), THEN the gate validates.
    // Already-engine ops (internal callers) and malformed values pass through to isMark.
    out.push({ word, surface, marks: Array.isArray(marks) ? marks.map(toEngineMark).filter(isMark) : [] })
  }
  return out
}

export function emissionFromStructured(structured: unknown): ScoredEmission {
  if (structured === null || typeof structured !== 'object') return { reply: '', replyMarks: [], priorMarks: [] }
  const s = structured as { reply?: unknown; replyMarks?: unknown; priorMarks?: unknown }
  const reply = typeof s.reply === 'string' ? s.reply : ''
  return { reply, replyMarks: narrowWordMarks(s.replyMarks), priorMarks: narrowWordMarks(s.priorMarks) }
}

// ── §FORK A — G1 cuts the AUTHORITATIVE reply text; word-index → canonical position ──
// The reply text is the model's own, verbatim. cutCells(reply) is the canonical grid:
// joinCells(cells) === reply byte-for-byte (the cutter's exact inverse), so the rendered
// reply carries the model's exact spacing — no re-join, no space-before-punct. There is
// no alignment problem to solve: the reply IS the text. The only mapping is for marks —
// the k-th WORD-CELL (word cells in order, 1-based) has a canonical position.
export function cutReply(reply: string): { cells: RawWord[]; wordCellPos: number[] } {
  const cells = cutCells(reply)
  const wordCellPos = cells.filter(c => isWordCell(c.word)).map(c => c.pos)
  return { cells, wordCellPos }
}

// The word-cells of a cut, in order — each carries its canonical `pos` AND its `word`
// (the surface). The k-th entry (0-based k-1) is what a 1-based word-index k resolves to.
export function wordCells(cells: RawWord[]): RawWord[] {
  return cells.filter(c => isWordCell(c.word))
}

// ── CLAIM + VALIDATE — the surface-checked resolver (sprint-wire-economy R3) ──────────
// Resolve each WordMark's 1-based word-index against `cells'` word-cells, VERIFYING the
// claimed surface byte-exact. Returns each mark's resolved canonical `pos` (intrinsic to
// the cut — no sc needed, so this runs BEFORE any substrate write). A miscount, an
// out-of-range index, or a canonical-position-as-index all land on the wrong word-cell
// (or none) → its surface disagrees → MarkSurfaceError, loud, naming index / claimed /
// actual. The model testifies (word + surface); the structure validates (this).
// `label` ('reply' | 'prior') names the text in the error so a failure is unambiguous.
export function locateWordMarks(marks: WordMark[], cells: RawWord[], label: 'reply' | 'prior'): { pos: number; marks: Mark[] }[] {
  const wc = wordCells(cells)
  return marks.map(wm => {
    const cell = wc[wm.word - 1]
    if (cell === undefined) {
      throw new MarkSurfaceError(
        `${label} mark word-index ${wm.word} is out of range — the ${label} has ${wc.length} word-cell${wc.length === 1 ? '' : 's'} (claimed surface "${wm.surface}"). Indexes count word-cells of this call's text, never canonical positions.`,
      )
    }
    if (cell.word !== wm.surface) {
      throw new MarkSurfaceError(
        `${label} mark word-index ${wm.word} claims surface "${wm.surface}" but word-cell ${wm.word} is "${cell.word}" — index↔surface mismatch (indexes count word-cells, never canonical positions; coordinates live only inside Refs, copied from lookup).`,
      )
    }
    return { pos: cell.pos, marks: wm.marks }
  })
}

// Home located marks at a turn's coordinate — trivial once `sc` is assigned (the write
// returns it). `pos` is already canonical (from locateWordMarks); who+sc complete the
// Coord. One located entry fans out to one PlacedMark per mark it carries.
export function homeMarks(located: { pos: number; marks: Mark[] }[], who: Who, sc: number): PlacedMark[] {
  return located.flatMap(l => l.marks.map(mark => ({ home: { who, sc, pos: l.pos } as Coord, mark })))
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
