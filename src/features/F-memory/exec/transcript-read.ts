// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-memory/R4]
// Built with LIV · livai.dev
// [F-memory/exec/transcript-read.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-4 (cognition transcript read — RawTurn adapter),
//             r12-total-read (TH1/R12: SELECT state_flag → RawTurn.flag; the read is
//             TOTAL — a row whose words cannot resolve becomes a safe empty-words
//             placeholder carrying flag='fail', never throwing the whole read)
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  RawTurn / RawWord / Who   @/core/types/substrate-raw.types
//   W-ATOM  db                        @/core/db/client
// wires-out:
//   W-FN    readTranscript  →  core loop (flat transcript) + coin-read derive
//   W-FN    toRawTurn       →  the pure row→RawTurn adapter (total; state_flag surfaced)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R5  @/core/db/client

// The cognition read: the words-bearing rows of the single substrate, as RawTurn[]
// — the flat transcript the core loop feeds the LLM and coin-read derives over.
// Imports only substrate-raw.types (+ infra db); no relational types, no F-present.
//
// Reads by the SCOPE DIAL (Wave-2 keystone) — the WHERE comes from the one builder
// (scopeClause): scope='mine' binds user_id (the isolation read); scope='public' drops
// it for source_scope='public' (the cross-author forum read). `words IS NOT NULL` selects
// cognition rows (system-introspection rows have NULL words). sc = the substrate position;
// the marks placed for a turn key on the SAME position, so coin-read's coordinates match.

import { db }                          from '@/core/db/client'
import { scopeClause }                 from './scope-clause'
import type { ScopeSpec }              from './scope-clause'
import type { RawTurn, RawWord, Who }  from '@/core/types/substrate-raw.types'

const SUBSTRATE_TABLE = 'state_change'

// source_channel → Who (cognition channels). Anything unexpected falls to 'llm'
// rather than throwing (the read never breaks the loop).
const WHO_OF: Record<string, Who> = { wearer: 'wearer', ai: 'llm', 'internal-derivation': 'program' }

// The raw DB row shape — words is `unknown` (jsonb / text; may be malformed).
export type SubstrateRow = { position: string; source_channel: string; source_scope: string; words: unknown; state_flag: string }

// The TOTAL row→RawTurn adapter (TH1/R12 save-and-flag). One bad row NEVER throws the
// whole read — that is what made a single malformed cell blank the entire present. The
// state_flag column (migration 029) is surfaced onto RawTurn.flag: 'fail' iff the stored
// row is flagged 'fail', OR its words cannot resolve (unparseable jsonb / not an array) —
// in which case the row degrades to a SAFE placeholder (empty words) carrying flag='fail'
// rather than throwing. The coordinate (sc/who/scope) is preserved so the model can locate
// and self-correct the capture on a future turn; nothing is silently dropped.
export function toRawTurn(row: SubstrateRow): RawTurn {
  let flag: 'pass' | 'fail' = row.state_flag === 'fail' ? 'fail' : 'pass'
  let words: RawWord[]
  try {
    const parsed = typeof row.words === 'string' ? JSON.parse(row.words) : row.words
    if (!Array.isArray(parsed)) throw new Error('words is not an array')
    words = parsed as RawWord[]
  } catch {
    words = []            // safe placeholder — the read stays total; the row keeps its coordinate
    flag  = 'fail'        // capture-integrity failure (R12): reconstructed as empty, surfaced not dropped
  }
  return {
    sc:    Number(row.position),
    who:   WHO_OF[row.source_channel] ?? 'llm',
    scope: row.source_scope,             // the row's own visibility — intrinsic, write-stamped
    flag,                                // capture integrity — intrinsic, write-stamped (migration 029)
    words,
  }
}

export async function readTranscript(scope: ScopeSpec): Promise<RawTurn[]> {
  // The WHERE comes from the one builder (scopeClause) — the sole place a substrate read's
  // scope-clause is constructed. `words IS NOT NULL` (the cognition-row conjunct) is appended
  // after it; positions follow the builder's params length (mine owns $1; public carries none).
  const sc = scopeClause(scope)
  const r = await db.query<SubstrateRow>(
    `SELECT position::text AS position, source_channel, source_scope, words, state_flag
       FROM ${SUBSTRATE_TABLE}
      WHERE ${sc.clause} AND words IS NOT NULL
      ORDER BY position ASC`,
    sc.params,
  )
  return r.rows.map(toRawTurn)      // TOTAL: each row adapts through the flag-surfacing, never-throwing seam
}
