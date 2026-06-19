// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/features/F-memory/exec/transcript-read.ts (d6d13c8).
//
// The cognition read: the words-bearing rows of the single substrate, as RawTurn[]
// — the flat transcript the core loop feeds the LLM and the engine derives over.
// Imports only substrate-raw types (+ infra db); no relational types, no engine.
//
// Reads by user_id — the substrate isolation floor. `words IS NOT NULL` selecting
// cognition rows (relational rows have NULL words and stay on the relational read
// path). sc = the substrate position (one coordinate).

import { db }                          from '../db/client'
import type { RawTurn, RawWord, Who }  from '../types/substrate-raw.types'

const SUBSTRATE_TABLE = 'state_change'

// source_channel → Who (cognition channels). Anything unexpected falls to 'llm'
// rather than throwing (the read never breaks the loop).
const WHO_OF: Record<string, Who> = { wearer: 'wearer', ai: 'llm', 'internal-derivation': 'program' }

export async function readTranscript(userId: string): Promise<RawTurn[]> {
  const r = await db.query<{ position: string; source_channel: string; words: unknown }>(
    `SELECT position::text AS position, source_channel, words
       FROM ${SUBSTRATE_TABLE}
      WHERE user_id = $1 AND words IS NOT NULL
      ORDER BY position ASC`,
    [userId],
  )
  return r.rows.map(row => ({
    sc:    Number(row.position),
    who:   WHO_OF[row.source_channel] ?? 'llm',
    words: (typeof row.words === 'string' ? JSON.parse(row.words) : row.words) as RawWord[],
  }))
}
