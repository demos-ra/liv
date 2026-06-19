// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// Built with LIV · livai.dev
// Vendored — portable substrate package. Canonical home: src/features/F-memory/exec/raw-turn-write.ts (d6d13c8).
//
// CORE-OWNED RAW-WORD WRITE. Writes ONLY raw words + coordinates (a RawTurn) to
// the single substrate store `state_change`. Content is raw words (the `words`
// column); structure is NOT here (it lives in the engine's marks).
//
// I1 INVARIANT: this file imports ONLY substrate-raw types among substrate types,
// plus infra (db, generateId). It NEVER imports the engine. The store write path
// holds no engine logic and no engine import — that is what makes the
// byte-identical / traceless property hold at the WRITE seam, and lets the store
// run with the recomposer absent.

import { db }            from '../db/client'
import { generateId }    from '../types/primitives'
import type { RawWord, Who } from '../types/substrate-raw.types'

// `state_change` is the single substrate table. Named as a literal here
// deliberately — this file does not import substrate-config, keeping this surface
// free of relational types.
const SUBSTRATE_TABLE = 'state_change'

// who → source_channel. wearer/llm are the cognition channels (both derive the
// existing 'wearer-life' content_class). program is folded for the Who generalization.
const CHANNEL_OF: Record<Who, string> = { wearer: 'wearer', llm: 'ai', program: 'internal-derivation' }

// G1 — the canonical cutter (bidirectional: text<->cells). Authoritative for BOTH
// turns (wearer + reply); the model never cuts its own cells. NEVER normalizes
// ('buidl' stays 'buidl'; the clean form exists only in the lens). Each cell is one
// of: a word, a whitespace run, or a punctuation run. Boundary-punct resolution: a
// punctuation char joins a WORD cell only when flanked by word-chars on both sides
// (don't, well-known, U.S, 3.14) — so a model's natural word re-keys 1:1 to a
// word-cell; otherwise punctuation is its own (inert) cell.
//
// joinCells is the EXACT inverse: joinCells(cutCells(t)) === t for all t.
const isWordChar = (c: string) => /[\p{L}\p{N}]/u.test(c)
const isSpaceChar = (c: string) => /\s/u.test(c)

export function cutCells(text: string): RawWord[] {
  const cells: RawWord[] = []
  let i = 0, pos = 1
  while (i < text.length) {
    const c = text[i]
    if (isSpaceChar(c)) {
      let j = i; while (j < text.length && isSpaceChar(text[j])) j++
      cells.push({ pos: pos++, word: text.slice(i, j) }); i = j
    } else if (isWordChar(c)) {
      let j = i
      while (j < text.length) {
        if (isWordChar(text[j])) { j++; continue }
        // absorb a single internal punctuation char flanked by word-chars on both sides
        if (!isSpaceChar(text[j]) && j > i && isWordChar(text[j - 1]) && j + 1 < text.length && isWordChar(text[j + 1])) { j++; continue }
        break
      }
      cells.push({ pos: pos++, word: text.slice(i, j) }); i = j
    } else {
      let j = i; while (j < text.length && !isWordChar(text[j]) && !isSpaceChar(text[j])) j++
      cells.push({ pos: pos++, word: text.slice(i, j) }); i = j
    }
  }
  return cells
}

// The exact inverse of cutCells — cells carry their literal text (whitespace cells
// included), so concatenation reproduces the original exactly.
export function joinCells(cells: RawWord[]): string {
  return cells.map(c => c.word).join('')
}

// A cell is a WORD cell iff it begins with a word-char (cutCells partitions cleanly,
// so the first char determines the class). Marks home only on word cells; punctuation
// and whitespace cells are inert. Used by the lens re-key (the engine), not by the store.
export function isWordCell(word: string): boolean {
  return word.length > 0 && isWordChar(word[0])
}

// Writes one cognition turn's raw words to the substrate. Returns the DB-assigned
// position, which IS this turn's sc (one coordinate — the marks placed for this turn
// key on the same position; no sc↔position drift). Never throws on shape; surfaces
// only a genuine write failure (a turn with no coordinate is unusable).
export async function writeRawTurn(input: {
  who:    Who
  words:  RawWord[]
  userId: string
  scope:  string
}): Promise<number> {
  const id = generateId('sc')
  const inserted = await db.query<{ position: string }>(
    `INSERT INTO ${SUBSTRATE_TABLE}
       (id, time_ms, source_channel, source_content_class, source_scope, user_id, words)
     VALUES ($1, $2, $3, $4, $5, $6, $7::jsonb)
     RETURNING position::text AS position`,
    [
      id,
      String(Date.now()),
      CHANNEL_OF[input.who],
      'wearer-life',                 // existing class reused — no third class
      input.scope,
      input.userId,
      JSON.stringify(input.words),   // cognition content is words; identities/relations
                                     // omitted → NULL. Structure lives in the engine's
                                     // marks, not here.
    ],
  )
  const position = Number(inserted.rows[0]?.position)
  if (!Number.isFinite(position)) throw new Error('writeRawTurn: INSERT returned no position')
  return position
}
