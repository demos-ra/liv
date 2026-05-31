// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/coin-score.ts]
// COIN scoring write-path. The LLM emits scored positions (word + its marks) via
// the F-ai-adapter structured transport (the COIN schema rides it — reusable).
// splitEmission ROUTES the emission: raw words → the wearer's substrate (a
// RawTurn); marks → F-present's external store (PlacedMarks pointing at
// coordinates). The substrate receives ONLY raw words; F-present receives ONLY
// pointers. No overlap.

import type { Who, RawTurn, Coord } from '@/core/types/substrate-raw.types'
import type { Mark, PlacedMark, Ref } from '@/features/F-present/config/mark-types'
import type { JsonSchema, StructuredEmitConfig } from '@/features/F-ai-adapter/config/ai-adapter-config'

// The emission shape the LLM fills (structured output).
export type ScoredPosition = { pos: number; word: string; marks: Mark[] }
export type ScoredEmission = { positions: ScoredPosition[] }

// COIN schema (owned here, single-source). A mark is a permissive object {op + the
// fields that op uses}; the receiver narrows. Targets/peers are coords {who,sc,pos}.
const COORD: JsonSchema = { type: 'object', properties: { who: { type: 'string', enum: ['wearer', 'llm', 'program'] }, sc: { type: 'number' }, pos: { type: 'number' } }, required: ['who', 'sc', 'pos'], additionalProperties: false }
// A target/peer is a NAME or a COORD (coin-spec §3/line 48 — name primary, address
// the disambiguator). A mark's HOME is always a real coord; only what a mark POINTS
// AT (target/peers) may be a clustering name.
const REF: JsonSchema = { anyOf: [{ type: 'string' }, COORD] }
export const SCORE_SCHEMA: JsonSchema = {
  type: 'object',
  properties: { positions: { type: 'array', items: {
    type: 'object',
    properties: {
      pos: { type: 'number' }, word: { type: 'string' },
      marks: { type: 'array', items: {
        type: 'object',
        properties: {
          op: { type: 'string', enum: ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY'] },
          peers: { type: 'array', items: REF }, coloring: { type: 'string' }, target: REF,
        },
        required: ['op'], additionalProperties: false,
      } },
    },
    required: ['pos', 'word', 'marks'], additionalProperties: false,
  } } },
  required: ['positions'], additionalProperties: false,
}
export const SCORE_EMIT_CONFIG: StructuredEmitConfig = { schema: SCORE_SCHEMA, streamArray: 'positions', streamField: 'word' }

// narrow the transport's `unknown` → ScoredEmission (malformed → empty positions)
export function emissionFromStructured(structured: unknown): ScoredEmission {
  if (structured === null || typeof structured !== 'object') return { positions: [] }
  const arr = (structured as { positions?: unknown }).positions
  if (!Array.isArray(arr)) return { positions: [] }
  const positions: ScoredPosition[] = []
  for (const p of arr) {
    if (!p || typeof p !== 'object') continue
    const pos = (p as any).pos, word = (p as any).word, marks = (p as any).marks
    if (typeof pos !== 'number' || typeof word !== 'string') continue
    positions.push({ pos, word, marks: Array.isArray(marks) ? marks.filter(isMark) : [] })
  }
  return { positions }
}
function isMark(m: unknown): m is Mark {
  if (!m || typeof m !== 'object') return false
  const op = (m as any).op
  return op === 'identity' || op === 'RELATE' || op === 'QUALIFY' || op === 'IDENTIFY'
}

// ROUTE: raw words → substrate (RawTurn); marks → F-present store (PlacedMarks).
export function splitEmission(emission: ScoredEmission, who: Who, sc: number): { rawTurn: RawTurn; placedMarks: PlacedMark[] } {
  const rawTurn: RawTurn = { sc, who, words: emission.positions.map(p => ({ pos: p.pos, word: p.word })) }
  const placedMarks: PlacedMark[] = emission.positions.flatMap(p =>
    p.marks.map(mark => ({ home: { who, sc, pos: p.pos } as Coord, mark })))
  return { rawTurn, placedMarks }
}

// shared-universe (coin-spec §0/§3): every target/peer resolves to something the
// reader knows — a coord key (this turn or a prior record) OR a name that clusters
// across records. Returns the marks that hold; drops danglers. `known` is seeded by
// the caller with substrate coord-keys AND the (lowercased) names in the universe —
// the lowercase convention matches coin-read's name clustering.
export function validateSharedUniverse(placedMarks: PlacedMark[], known: Set<string>): PlacedMark[] {
  const refKey = (r: Ref) => typeof r === 'string' ? r.toLowerCase() : `${r.who}:${r.sc}:${r.pos}`
  return placedMarks.filter(pm => {
    const m = pm.mark
    const ts: Ref[] = m.op === 'RELATE' ? m.peers : (m.op === 'QUALIFY' || m.op === 'IDENTIFY') ? [m.target] : []
    return ts.every(t => known.has(refKey(t)))
  })
}
