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
//             S1 mark-contract (name-not-count, M4): the COUNTED WordMark { word; surface; marks }
//               becomes the NAMED-SPAN SpanMark { surface; marks } — the model NAMES the span it
//               means (a verbatim word or short span it reproduces exactly) and LIV LOCATES the
//               position; no index is emitted. CLAIM + VALIDATE holds: locateWordMarks matches the
//               named span against the relevant cut's word-cells and rejects a span that isn't there
//               LOUD (MarkSurfaceError, byte-exact — the failure shifts from "you miscounted" to
//               "you named text that isn't there"). Home-disambiguation for a repeated span: the
//               FIRST occurrence (M4 within-contract — name a longer unique span to disambiguate;
//               `surface` already carries multi-word text, no new field).
//             E3 REWORK (block + payload are first-class CELLS): a BLOCK or PAYLOAD is no longer
//               a mark on a leading word — it is its OWN cell at its OWN coordinate. cutReply now
//               cuts the reply with shapeAwareCut (the engine's shape step over the dumb cut):
//               each block/payload region is ONE cell whose `word` is the verbatim region text
//               (a payload-cell's word IS the livbyte:// handle). The old routeBlockIdentities
//               `{ surface: lead.word }` home is REMOVED — that collision welded a block into a
//               word and broke object-identity (L0-forbidden). Block/payload-identities are now
//               located DIRECTLY on the home-capable block/payload cells (locateCellIdentities),
//               at the cell's own pos — no naming, no leading word. The home-gate widens to
//               isHomeCapableCell (E2-derived, no atom field). Ref is UNCHANGED (string | Coord);
//               no new op, no new field, no new atom kind, no new Ref form.
// slice:      F-present
// layer:      R1
// wires-in:
//   W-ATOM  Who / RawWord / Coord             @/core/types/substrate-raw.types          (type-only)
//   W-ATOM  Mark / PlacedMark / Ref           ../config/mark-types                       (type-only)
//   W-ATOM  JsonSchema / StructuredEmitConfig @/features/F-ai-adapter/contract/ai-contract (type-only)
//   W-FN    cutCells / isWordCell             @/features/F-memory/contract/substrate-contract
//   W-FN    isMark                            ../domain/mark-gate
//   W-FN    shapeAwareCut / isHomeCapableCell / classOfCell / isBlockClass  ../domain/content-signature  (Wing-B E3 — shape-aware cut + widened gate)
//   W-ATOM  MUSICAL_OPS / toEngineMark        ../config/register-map                     (R9 register seam — emit enum + intake translate)
// wires-out:
//   W-FN    emissionFromStructured / cutReply / wordCells / locateWordMarks / homeMarks
//           / verifyGrid / validateSharedUniverse / locateCellIdentities  →  ../app/scored-turn-recorder (R2)
//   W-ATOM  SCORE_EMIT_CONFIG / SCORE_SCHEMA / ScoredEmission / SpanMark / MarkSurfaceError
//                                                    →  ../app/cognition-orchestrator (R2), ../app/scored-turn-recorder (R2)
//   W-FN    projectEmissionSchema  W-ATOM MarkingSituation  →  ../contract/present-contract (R3 → F-mcp R3 mcp-contract:
//           the wire's `turn` inputSchema is projectEmissionSchema(MCP_SITUATION) — one contract, two derived views)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R0  ../config/mark-types
//   R0  ../config/register-map
//   R3  @/features/F-ai-adapter/contract/ai-contract
//   R3  @/features/F-memory/contract/substrate-contract
//   R1  ../domain/mark-gate
//   R1  ../domain/content-signature   (Wing-B E3 — shape-aware cut + widened home-gate)
//
// COIN scoring write-path. The model emits its reply as ONE plain text field (`reply`)
// PLUS replyMarks (marks on its own reply) and priorMarks (marks on the person's turn) —
// both turns scored, BOTH keyed the same way: each entry NAMES the span it means (a
// `surface` — a verbatim word or short span the model reproduces exactly), and LIV LOCATES
// the position in the relevant cut. NO index is emitted (S1, name-not-count, M4). The reply
// text → the wearer's substrate (a RawTurn of CANONICAL cells from G1 = cutCells(reply));
// the marks → F-present's external store (PlacedMarks pointing at coordinates). No overlap.
//
// §FORK = A (reassembly-contract fix, 2-B): the reply text is AUTHORITATIVE — G1 cuts it
// and joinCells renders it byte-identical, so spacing is the model's own, never a re-join.
//
// EMISSION-SEMANTIC PIN (S1, M4 — name, never count): a mark NAMES its home span; the model
// never numbers cells. LIV matches the named span against the WORD-CELLS of this call's texts
// (the reply for replyMarks, the wearer turn for priorMarks) and homes the mark at the span's
// first word-cell. A canonical cell coordinate appears ONLY inside a Ref (a mark's target/peer),
// ONLY copied from lookup output — never used as a home key. The surface-check is what makes
// this safe: a named span that does not occur in the relevant cut is rejected loud
// (MarkSurfaceError) — "you named text that isn't there." A repeated span resolves to its
// FIRST occurrence; to mean a later one the model names a longer span that is unique (within
// the contract — `surface` already carries multi-word text). A BLOCK or PAYLOAD is a FIRST-CLASS
// CELL (E3): the reply is cut with shapeAwareCut, so each block/payload region is ONE cell at its
// OWN coordinate; an `identity` mark homes DIRECTLY on that cell (locateCellIdentities) — no naming,
// no leading word. The home-gate widens to admit those cells (isHomeCapableCell, E2-derived — no
// atom field). No new op, no new field, no new atom kind, no Ref change — the widening is on the
// SUBJECT a mark sits on (a block/payload becomes a first-class thing), not on Ref.

import type { Who, RawWord, Coord } from '@/core/types/substrate-raw.types'
import type { Mark, PlacedMark, Ref } from '@/features/F-present/config/mark-types'
import type { JsonSchema, StructuredEmitConfig } from '@/features/F-ai-adapter/contract/ai-contract'
import { cutCells, isWordCell } from '@/features/F-memory/contract/substrate-contract'
import { isMark } from '@/features/F-present/domain/mark-gate'   // the gate (W-FN; see @manifest)
import { MUSICAL_OPS, toEngineMark } from '@/features/F-present/config/register-map'   // R9 register seam (translate names; the gate validates)
import { shapeAwareCut, isHomeCapableCell, classOfCell, isBlockClass } from '@/features/F-present/domain/content-signature'   // Wing-B E3: shape-aware cut + widened home-gate

// The emission the model fills (structured output) — both turns. `reply` is the model's
// reply as plain text (authoritative for the river grid). replyMarks score the reply;
// priorMarks score the person's most-recent turn. BOTH are SpanMarks: { surface, marks } —
// `surface` NAMES the span the mark sits on (a verbatim word or short span the model
// reproduces exactly; for a block, its leading span). LIV LOCATES the position; the model
// emits NO index (S1, name-not-count, M4). `surface` is both the claim and the validation key.
export type SpanMark = { surface: string; marks: Mark[] }
export type ScoredEmission = { reply: string; replyMarks: SpanMark[]; priorMarks: SpanMark[] }

// A surface-check failure — the model's claim (word-index → surface) disagrees with the
// machine's cut. Loud, named, byte-exact: index, claimed surface, actual surface (or the
// out-of-range count). Distinct class so the perimeters (native composer, wire turn door)
// can catch THIS specifically and state it truthfully, separate from any other failure.
export class MarkSurfaceError extends Error {
  constructor(message: string) { super(message); this.name = 'MarkSurfaceError' }
}

// COIN schema (owned here, single-source). A mark is a permissive object {op + the fields
// that op uses}; the receiver narrows. Targets/peers are NAMES or COORDS (copied from
// lookup). Both replyMarks and priorMarks share the SpanMark shape: surface + marks (the
// model NAMES its home span — no index; LIV locates it).
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
// A span mark NAMES its home (`surface`) and carries the marks that sit on it. No index —
// LIV locates the named span in the relevant cut (name-not-count, S1/M4). `surface` is the
// lone home key (a verbatim word/short span; for a block, its leading span).
const SPAN_MARK_ITEM: JsonSchema = {
  type: 'object',
  properties: {
    surface: { type: 'string' }, marks: { type: 'array', items: MARK_ITEM },
  },
  required: ['surface', 'marks'], additionalProperties: false,
}
// ── The one emission contract, projected per situation (single source) ────────────
// The emission SHAPE is owned HERE and ADVERTISED by projection — never hand-declared a
// second time. A MarkingSituation is the small set of choices a surface makes about the
// SAME contract: does the surface carry the person's turn inline (the wire sends wearerText;
// native's wearer turn is already written by E1), how much does it DEMAND (native asks only
// `reply`; the wire demands every present field), and what per-field guidance rides the
// advertisement (descriptions ride the WIRE only — native carries none, which keeps the
// native projection MINIMAL: reply-only, no wearerText, no field descriptions).
// Every surface's schema is projectEmissionSchema(its situation); COORD/REF/MARK_ITEM/
// SPAN_MARK_ITEM above are the LONE source of mark geometry, shared by every projection —
// so the wire can no longer drift to a bare `array` for its marks (the old MCP copy did).
export type MarkingSituation = {
  includeWearerText: boolean                  // wire carries the person's turn inline (wearerText); native does not
  demand: 'reply-only' | 'all-present'        // native demands only `reply`; the wire demands every present field
  descriptions?: Partial<Record<'wearerText' | 'reply' | 'replyMarks' | 'priorMarks', string>>
}

// Compose the emission schema from a situation. Fields are inserted present-order (wearerText
// first iff carried, then reply/replyMarks/priorMarks); `required` is ['reply'] for the
// reply-only demand and every present field for all-present. additionalProperties:false
// always (the emission admits no extras). A field's `description` rides only when the
// situation names it — absent on native, so the native projection stays minimal; the mark
// item is SPAN_MARK_ITEM uniformly, the one mark geometry.
export function projectEmissionSchema(situation: MarkingSituation): JsonSchema {
  const d = situation.descriptions ?? {}
  const field = (base: JsonSchema, key: 'wearerText' | 'reply' | 'replyMarks' | 'priorMarks'): JsonSchema =>
    d[key] === undefined ? base : { ...base, description: d[key] }
  const properties: Record<string, JsonSchema> = {}
  if (situation.includeWearerText) properties.wearerText = field({ type: 'string' }, 'wearerText')
  properties.reply = field({ type: 'string' }, 'reply')
  properties.replyMarks = field({ type: 'array', items: SPAN_MARK_ITEM }, 'replyMarks')
  properties.priorMarks = field({ type: 'array', items: SPAN_MARK_ITEM }, 'priorMarks')
  const required = situation.demand === 'reply-only' ? ['reply'] : Object.keys(properties)
  return { type: 'object', properties, required, additionalProperties: false }
}

// native cognition — the model returns ONLY the JSON object: no wearerText (E1 already wrote
// the wearer turn), only `reply` demanded (marks may be absent), and no field descriptions.
// NATIVE stays MINIMAL (reply-only, no wearerText, no descriptions); after S1 its mark item is
// the named-span SPAN_MARK_ITEM (surface + marks) — the single mark geometry, no index field.
export const NATIVE_SITUATION: MarkingSituation = { includeWearerText: false, demand: 'reply-only' }
export const SCORE_SCHEMA: JsonSchema = projectEmissionSchema(NATIVE_SITUATION)
// streamField names the reply text for a later incremental surface; advisory today
// (the transport parses the whole object — structured-stream.ts).
export const SCORE_EMIT_CONFIG: StructuredEmitConfig = { schema: SCORE_SCHEMA, streamField: 'reply' }

// Narrow an arbitrary SpanMark[] candidate: keep entries with a non-empty string `surface`
// (the named home span), and gate each mark through isMark. This is STRUCTURAL narrowing
// only (never throws) — the LOUD locate-by-name validation is locateWordMarks, which runs
// against the actual cut. A claim that was never made (no surface) is dropped here,
// fail-closed; a FALSE claim (a span that isn't in the cut) is caught loud below.
function narrowSpanMarks(v: unknown): SpanMark[] {
  const out: SpanMark[] = []
  if (!Array.isArray(v)) return out
  for (const e of v) {
    if (!e || typeof e !== 'object') continue
    const surface = (e as { surface?: unknown }).surface
    const marks = (e as { marks?: unknown }).marks
    if (typeof surface !== 'string' || surface.length === 0) continue
    // R9 intake: translate the op name musical→engine (toEngineMark), THEN the gate validates.
    // Already-engine ops (internal callers) and malformed values pass through to isMark.
    out.push({ surface, marks: Array.isArray(marks) ? marks.map(toEngineMark).filter(isMark) : [] })
  }
  return out
}

export function emissionFromStructured(structured: unknown): ScoredEmission {
  if (structured === null || typeof structured !== 'object') return { reply: '', replyMarks: [], priorMarks: [] }
  const s = structured as { reply?: unknown; replyMarks?: unknown; priorMarks?: unknown }
  const reply = typeof s.reply === 'string' ? s.reply : ''
  return { reply, replyMarks: narrowSpanMarks(s.replyMarks), priorMarks: narrowSpanMarks(s.priorMarks) }
}

// ── §FORK A — G1 cuts the AUTHORITATIVE reply text (E3: the SHAPE-AWARE cut) ──────────
// The reply text is the model's own, verbatim. The canonical grid is shapeAwareCut(reply):
// F-memory's dumb cut, then each block/payload region coalesced to ONE cell. It is STILL an
// exact inverse — joinCells(cells) === reply byte-for-byte — so the rendered reply carries
// the model's exact spacing (no re-join, no space-before-punct). There is no alignment
// problem to solve: the reply IS the text. A block/payload is now a first-class cell at its
// own coordinate; an `identity` mark homes directly on it (locateCellIdentities). `wordCellPos`
// stays the prose word-cells' canonical positions (a block/payload cell is not a word-cell).
export function cutReply(reply: string): { cells: RawWord[]; wordCellPos: number[] } {
  const cells = shapeAwareCut(reply)
  const wordCellPos = cells.filter(c => isWordCell(c.word)).map(c => c.pos)
  return { cells, wordCellPos }
}

// The word-cells of a cut, in order — each carries its canonical `pos` AND its `word`
// (the surface). The k-th entry (0-based k-1) is what a 1-based word-index k resolves to.
export function wordCells(cells: RawWord[]): RawWord[] {
  return cells.filter(c => isWordCell(c.word))
}

// ── CLAIM + VALIDATE — the locate-by-name resolver (S1 mark-contract, M4) ─────────────
// The model NAMES the span a mark sits on (`surface`); LIV LOCATES it. Resolve each
// SpanMark by FINDING its named span among `cells'` word-cells, byte-exact, and home the
// mark at the span's FIRST word-cell. A span may be one word ("Kyoto") or a short multi-word
// span ("truly rivals" — used to disambiguate a repeated word, or to name a block's leading
// span); it is cut by the SAME cutter (cutCells) into a word-cell sequence and matched
// against a window of the home's word-cells. Returns the resolved canonical `pos` (intrinsic
// to the cut — no sc, so this runs BEFORE any substrate write). A span that is EMPTY-of-words
// or DOES NOT OCCUR → MarkSurfaceError, loud, naming the claimed surface ("you named text
// that isn't there"). Repeated span → FIRST occurrence (M4 within-contract; name a longer
// unique span to mean a later one). `label` ('reply' | 'prior') names the text in the error.
export function locateWordMarks(marks: SpanMark[], cells: RawWord[], label: 'reply' | 'prior'): { pos: number; marks: Mark[] }[] {
  const wc = wordCells(cells)
  return marks.map(sm => {
    const want = wordCells(cutCells(sm.surface)).map(c => c.word)   // the named span's word-cells, same cutter
    if (want.length === 0) {
      throw new MarkSurfaceError(
        `${label} mark names surface "${sm.surface}" but it contains no word — a mark must name a span (a verbatim word or short span) the ${label} contains.`,
      )
    }
    const at = findSpan(wc.map(c => c.word), want)   // first occurrence of the word-sequence
    if (at === -1) {
      throw new MarkSurfaceError(
        `${label} mark names surface "${sm.surface}" but no such span occurs in the ${label} — you named text that isn't there. Name a verbatim word or short span the ${label} contains (LIV locates it; you never count cells). For a repeated word, name a longer span that is unique. Coordinates live only inside Refs, copied from lookup — never as a home.`,
      )
    }
    return { pos: wc[at].pos, marks: sm.marks }   // home at the span's FIRST word-cell
  })
}

// First index in `hay` where the contiguous subsequence `needle` (length ≥ 1) matches,
// byte-exact per word-cell; -1 if absent. The lone home-disambiguator (M4 within-contract):
// the FIRST occurrence wins, so a longer named span pins a later/unique appearance.
function findSpan(hay: string[], needle: string[]): number {
  outer: for (let i = 0; i + needle.length <= hay.length; i++) {
    for (let k = 0; k < needle.length; k++) if (hay[i + k] !== needle[k]) continue outer
    return i
  }
  return -1
}

// ── E3 — block/payload cells → object-identities ON THEIR OWN COORDINATE ──────────────
// The reply was cut with shapeAwareCut, so each BLOCK/PAYLOAD region (code/data/scaffold/
// payload) is already ONE cell at its OWN coordinate. A block/payload cell is a first-class
// thing: an `identity` mark homes DIRECTLY on it — at the cell's own `pos`, NOT a leading word
// (the old `{ surface: lead.word }` home welded a block into a word and broke object-identity;
// it is gone). No naming step, no locate-by-name — the cell IS the home; locateWordMarks is
// for the model's own NAMED spans only.
//
// The home-gate is isHomeCapableCell (E2-derived from the cell's own content — NO field on the
// atom): a block/payload cell with an inner word is admitted; pure chrome (a block-cell with no
// word at all, e.g. a bare box rule) is NOT — it has no coordinate to name, renders as structure
// (the render flag is Present-Standard debt ★). A plain prose word-cell is NOT a block-identity
// (the model marks those by name); only block/payload cells get an auto object-identity here.
//
// Returns located identities ({ pos, marks }) keyed on the cell's own canonical pos — the SAME
// shape locateWordMarks returns, so the recorder homes both through one homeMarks path. The
// payload-cell's CONTENT (its `word` is the livbyte:// handle) needs no special arm: it is the
// cell itself; bytes resolve lazily through the §3b socket on read, never a Ref. Pure: reads
// only the already-cut cells. NOTHING in the frozen contract changes (SpanMark/Ref/mark set).
export function locateCellIdentities(cells: RawWord[]): { pos: number; marks: Mark[] }[] {
  const out: { pos: number; marks: Mark[] }[] = []
  for (const cell of cells) {
    // E2 is the discriminator — NOT isWordCell. A coalesced block/payload cell can BEGIN with a
    // word char (e.g. "an image: livbyte://…"), so first-char is not enough; classOfCell reads
    // the whole content back to its class. Only a BLOCK/PAYLOAD class gets an auto object-identity
    // (prose word-cells are marked by the model BY NAME, not here).
    if (!isBlockClass(classOfCell(cell))) continue   // prose cell (word/space/punct) — never an auto-identity
    if (!isHomeCapableCell(cell)) continue           // pure chrome (no inner word) — no coordinate to sit on
    out.push({ pos: cell.pos, marks: [{ op: 'identity' }] })
  }
  return out
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
