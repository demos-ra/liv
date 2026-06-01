// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-present/R1]
// Built with LIV · livai.dev
// [F-present/domain/coin-score.ts]
// amended: coin-scoring-prompt (COIN_SCORING_PROMPT const added — compose instruction
//          prepended to system message in composeAndWrite; test calibration form)
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

// ── Scoring system prompt (compose instruction) ───────────────────────────────
// Prepended to the system message by composeAndWrite (before the present).
// Tells the LLM to compose its own reply and return it as scored positions.
// Intentionally explanatory — test calibration form; mechanical version is future work.
export const COIN_SCORING_PROMPT =
`You are talking with a person. Do two things in one pass: compose your natural reply to them, then return that reply as scored positions.

Your memory of the conversation so far is given below as PRESENT (things and relations that have come up) and TRANSCRIPT (every turn in order; "(—)" = the person, "(llm)" = you). Use it as what you know. Refer only to things already in it or that you introduce in this reply.

Compose your reply as you normally would. Then output it as a list of positions: one word per position, in order, every word kept — these words ARE your reply. Reply with YOUR words, never a copy of theirs.

Each position: { "pos": <n from 1>, "word": "<exact word>", "marks": [...] }. Split your reply into words the natural way; keep punctuation with its word. Every word gets a position, including small words like "the", "is", "and" — give each whatever marks it performs, or an empty list if none. Mark fully, not just the highlights.

The four marks (the whole set):

- identity — names a thing (person, place, object, idea): { "op": "identity" }
- RELATE — links 2+ things into a connection: { "op": "RELATE", "peers": [A, B] }
- QUALIFY — colors/modifies one target (quality, degree, negation, or claim-status like "asked"/"commanded"): { "op": "QUALIFY", "coloring": "<word or sense>", "target": T }. One coloring per mark; never combine.
- IDENTIFY — this word is the same thing as one already mentioned (co-reference or typo fix): { "op": "IDENTIFY", "target": T }

A target/peer (A, B, T) is: a thing's name ("budget"), a position number in this reply (3), or a past word as { "who": "wearer"|"llm", "sc": <n>, "pos": <n> } using the sc numbers in the TRANSCRIPT. A word may carry several marks at once.

Worked example — your reply "Sam owns the budget":
[
 {"pos":1,"word":"Sam","marks":[{"op":"identity"}]},
 {"pos":2,"word":"owns","marks":[{"op":"RELATE","peers":["Sam","budget"]}]},
 {"pos":3,"word":"the","marks":[{"op":"QUALIFY","coloring":"the","target":"budget"}]},
 {"pos":4,"word":"budget","marks":[{"op":"identity"}]}
]
If they had said "budget" in an earlier turn, position 4 would also carry {"op":"IDENTIFY","target":{"who":"wearer","sc":<that turn>,"pos":<that word>}} to tie it to the same thing.

Return only the JSON object: { "positions": [ ... ] }.`
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
