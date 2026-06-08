// @liv-standard v1.5.2
// @governing-spec COIN v1.0
// [F-memory/R4]
// Built with LIV · livai.dev
// [F-memory/exec/raw-turn-write.ts]

// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    sprint-COIN-shot-4 (R2a: core-owned raw-word write — the cognition rail)
// slice:      F-memory
// layer:      R4
// wires-in:
//   W-ATOM  RawWord / Who   @/core/types/substrate-raw.types
//   W-FN    generateId      @/core/types/primitives
//   W-ATOM  db              @/core/db/client
// wires-out:
//   W-FN    writeRawTurn  →  F-present R2b orchestrator (F-present → core)
// deps:
//   R0  @/core/types/substrate-raw.types
//   R0  @/core/types/primitives
//   R5  @/core/db/client

// ─────────────────────────────────────────────────────────────────────────────
// R2a — CORE-OWNED RAW-WORD WRITE (R2 factoring, part a). Writes ONLY raw words +
// coordinates (a RawTurn) to the single substrate store `state_change`. The COIN
// cognition write: content is raw words (the `words` column), structure is NOT here
// (it lives in F-present marks).
//
// I1 INVARIANT (Condition 2; proven by Shot 5's delete-F-present smoke): this file
// imports ONLY `@/core/types/substrate-raw.types` among substrate/domain types, plus
// infra (db, generateId). It NEVER imports F-present. The core write path holds no
// F-present logic and no F-present import — that is what makes the byte-identical /
// traceless property hold at the WRITE seam, and lets the core loop build with the
// F-present directory absent.
//
// FOUNDATION-CLEAN (migration 027): the cognition row writes ONLY `words` and
// leaves `identities`/`relations` NULL (structure → F-present marks). The columns
// are nullable post-027; the content invariant accepts the row on its words branch.
// reuses the existing `wearer-life` content_class (no third class). System-
// introspection and program rows keep `identities`/`relations` populated; that
// legacy path is untouched here — separable, retired on its own later.
// ─────────────────────────────────────────────────────────────────────────────

import { db }            from '@/core/db/client'
import { generateId }    from '@/core/types/primitives'
import type { RawWord, Who } from '@/core/types/substrate-raw.types'

// `state_change` is the single substrate table (migration 016). Named as a literal
// here deliberately — R2a does not import substrate-config (which carries the
// stripped relational atoms), keeping this surface free of relational types.
const SUBSTRATE_TABLE = 'state_change'

// who → source_channel. wearer/llm are the cognition channels (both derive the
// existing 'wearer-life' content_class). program is folded for the Who generalization.
const CHANNEL_OF: Record<Who, string> = { wearer: 'wearer', llm: 'ai', program: 'internal-derivation' }

// G1 — the canonical cutter (bidirectional: text<->cells). Replaces the coarse
// `tokenize`. Authoritative for BOTH turns (wearer + reply); the model never cuts
// its own cells. NEVER normalizes ('buidl' stays 'buidl'; the clean form exists only
// in the lens). Each cell is one of: a word, a whitespace run, or a punctuation run.
// Boundary-punct resolution (settled by the §FORK stress test): a punctuation char
// joins a WORD cell only when flanked by word-chars on both sides (don't, well-known,
// U.S, 3.14) — so a model's natural word re-keys 1:1 to a word-cell; otherwise
// punctuation is its own (inert) cell. Whitespace/punctuation cells are inert by
// default and mark-capable later for free (the cell + position already exist).
//
// joinCells is the EXACT inverse: joinCells(cutCells(t)) === t for all t. The cutter
// owns the cell<->text boundary in BOTH directions — reassembling cells to readable
// text is G1's inverse, not a per-reader concern (no consumer joins cells ad hoc).
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
// and whitespace cells are inert. Used by the lens re-key (F-present), not by the river.
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
      'wearer-life',                 // existing class reused — no third class (manager §8.9)
      input.scope,
      input.userId,
      JSON.stringify(input.words),   // cognition content is words; identities/relations
                                     // omitted → NULL (migration 027 made them nullable).
                                     // Structure lives in F-present marks, not here.
    ],
  )
  const position = Number(inserted.rows[0]?.position)
  if (!Number.isFinite(position)) throw new Error('writeRawTurn: INSERT returned no position')
  return position
}
