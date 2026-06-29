// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-memory/R4]
// Built with LIV · livai.dev
// [F-memory/exec/transcript-read.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-4 (cognition transcript read — RawTurn adapter)
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  RawTurn / RawWord / Who   @/core/types/substrate-raw.types
//   W-ATOM  db                        @/core/db/client
// wires-out:
//   W-FN    readTranscript  →  core loop (flat transcript) + coin-read derive
// deps:
//   R0  @/core/types/substrate-raw.types
//   R5  @/core/db/client

// The cognition read: the words-bearing rows of the single substrate, as RawTurn[]
// — the flat transcript the core loop feeds the LLM and coin-read derives over.
// Imports only substrate-raw.types (+ infra db); no relational types, no F-present.
//
// Reads by user_id — the substrate isolation floor (matching the prior readScope),
// `words IS NOT NULL` selecting cognition rows (system-introspection rows have NULL
// words and stay on the relational read path). sc = the substrate position (one
// coordinate). The marks placed for a turn (R2b, home_sc) key on the SAME position,
// so coin-read's coordinates match across the substrate↔store seam.

import { db }                          from '@/core/db/client'
import { isolationFloor }              from './isolation-floor'
import type { RawTurn, RawWord, Who }  from '@/core/types/substrate-raw.types'

const SUBSTRATE_TABLE = 'state_change'

// source_channel → Who (cognition channels). Anything unexpected falls to 'llm'
// rather than throwing (the read never breaks the loop).
const WHO_OF: Record<string, Who> = { wearer: 'wearer', ai: 'llm', 'internal-derivation': 'program' }

export async function readTranscript(userId: string): Promise<RawTurn[]> {
  // §2.2: the isolation rule (`user_id = $1`) is built from the one helper, no
  // longer inlined here. `words IS NOT NULL` (the cognition-row conjunct) is
  // appended after the floor — the floor owns $1, this predicate carries no param.
  const floor = isolationFloor(userId)
  const r = await db.query<{ position: string; source_channel: string; source_scope: string; words: unknown }>(
    `SELECT position::text AS position, source_channel, source_scope, words
       FROM ${SUBSTRATE_TABLE}
      WHERE ${floor.clause} AND words IS NOT NULL
      ORDER BY position ASC`,
    floor.params,
  )
  return r.rows.map(row => ({
    sc:    Number(row.position),
    who:   WHO_OF[row.source_channel] ?? 'llm',
    scope: row.source_scope,                 // the row's own visibility — intrinsic, write-stamped
    words: (typeof row.words === 'string' ? JSON.parse(row.words) : row.words) as RawWord[],
  }))
}
