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

// Wearer tokenizer (R2 fold: tokenization folds into the raw-word write — this is
// exactly where a turn's string becomes positioned words). Verbatim: splits on
// whitespace, 1-based pos, NEVER normalizes ('buidl' stays 'buidl'; the clean form
// exists only in the lens). The wearer emits words, not scored marks — so the wearer
// path is R2a alone; the LLM path (R2b) adds the marks.
export function tokenize(text: string): RawWord[] {
  return text
    .split(/\s+/)
    .filter(w => w.length > 0)
    .map((word, i) => ({ pos: i + 1, word }))
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
