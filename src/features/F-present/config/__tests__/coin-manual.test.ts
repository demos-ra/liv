// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (M1 — the manual cannot teach a false index)
// [F-present/config/__tests__/coin-manual.test.ts]
// Built with LIV · livai.dev
//
// DELTA FIX-1 (sprint-wire-economy) — the worked example's taught WORD-INDICES are pinned
// to the LIVE cutter. The manual's prose renders FROM the exported COIN_EXAMPLE_* constants
// (one home, no duplication); this test runs the real cutCells on both example texts, takes
// the WORD-CELLS in order, and asserts every taught index↔surface is the cutter's actual
// word-cell. If anyone edits a sentence or a taught index without re-running the cutter, this
// fails — the manual is incapable of silently teaching a false coordinate (now: a false
// word-index, the new home shape) again.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/config/__tests__/coin-manual.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import {
  COIN_MANUAL,
  COIN_EXAMPLE_WEARER, COIN_EXAMPLE_REPLY,
  COIN_EXAMPLE_WEARER_WORDS, COIN_EXAMPLE_REPLY_WORDS,
} from '../coin-manual'

let cutCells: (t: string) => { pos: number; word: string }[]
let wordCells: (cells: { pos: number; word: string }[]) => { pos: number; word: string }[]

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
  ;({ wordCells } = await import('@/features/F-present/domain/coin-score'))
})

// ── every taught word-index equals the live cutter's word-cell (both texts) ──────
test('the worked example teaches the cutter\'s real word-indices, byte-exact surfaces', () => {
  const wcWearer = wordCells(cutCells(COIN_EXAMPLE_WEARER))
  for (const [word, idx] of Object.entries(COIN_EXAMPLE_WEARER_WORDS)) {
    assert.equal(wcWearer[idx - 1]?.word, word, `wearer word-index ${idx} should be "${word}" but the cutter has "${wcWearer[idx - 1]?.word}"`)
  }
  const wcReply = wordCells(cutCells(COIN_EXAMPLE_REPLY))
  for (const [word, idx] of Object.entries(COIN_EXAMPLE_REPLY_WORDS)) {
    assert.equal(wcReply[idx - 1]?.word, word, `reply word-index ${idx} should be "${word}" but the cutter has "${wcReply[idx - 1]?.word}"`)
  }
  // the documented fact: "Kyoto" is the 3rd WORD-cell of the wearer turn (a word-index,
  // NOT canonical position 5 — word-indices skip the space slots).
  assert.equal(COIN_EXAMPLE_WEARER_WORDS.Kyoto, 3)
})

// ── the prose actually renders from those constants (no drift between text & test) ─
test('the manual prose renders the pinned word-indices', () => {
  const w = COIN_EXAMPLE_WEARER_WORDS, r = COIN_EXAMPLE_REPLY_WORDS
  assert.ok(COIN_MANUAL.includes(`${w.I}=I, ${w.toured}=toured, ${w.Kyoto}=Kyoto`), 'wearer word-cells line renders from constants')
  assert.ok(COIN_MANUAL.includes(`${r.Kyoto}=Kyoto, ${r.truly}=truly, ${r.rivals}=rivals, ${r.Tokyo}=Tokyo`), 'reply word-cells line renders from constants')
  assert.ok(COIN_MANUAL.includes(`[7] (—): ${COIN_EXAMPLE_WEARER}`), 'transcript line renders the sentence constant')
  assert.ok(COIN_MANUAL.includes(`"word": ${w.Kyoto}, "surface": "Kyoto"`), 'the priorMark renders word-index + surface from the constant')
})
