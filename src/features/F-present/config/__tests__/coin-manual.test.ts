// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (M1 — the manual cannot teach a false coordinate)
// [F-present/config/__tests__/coin-manual.test.ts]
// Built with LIV · livai.dev
//
// DELTA FIX-1 — the worked example's taught coordinates are pinned to the LIVE cutter.
// The manual's prose renders FROM the exported COIN_EXAMPLE_SENTENCE / COIN_EXAMPLE_POS
// constants (one home, no duplication); this test runs the real cutCells on that same
// sentence and asserts every taught position is the cutter's actual canonical position.
// If anyone edits the sentence or a taught coordinate without re-running the cutter, this
// fails — the manual is incapable of silently lying again.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/config/__tests__/coin-manual.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import { COIN_MANUAL, COIN_EXAMPLE_SENTENCE, COIN_EXAMPLE_POS } from '../coin-manual'

let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// ── every taught coordinate equals the live cutter's canonical position ─────────
test('the worked example teaches the cutter\'s real positions (spaces occupy slots)', () => {
  const cells = cutCells(COIN_EXAMPLE_SENTENCE)
  for (const [word, taught] of Object.entries(COIN_EXAMPLE_POS)) {
    const cell = cells.find(c => c.word === word)
    assert.ok(cell, `example word "${word}" not found in cutCells(${JSON.stringify(COIN_EXAMPLE_SENTENCE)})`)
    assert.equal(cell!.pos, taught, `manual teaches ${word}@${taught} but the cutter puts it at ${cell!.pos}`)
  }
  // the documented fact: "Kyoto" is NOT at the word-index slot (3) — spaces occupy slots.
  assert.equal(COIN_EXAMPLE_POS.Kyoto, 5)
})

// ── the prose actually renders from those constants (no drift between text & test) ─
test('the manual prose renders the pinned coordinates', () => {
  const p = COIN_EXAMPLE_POS
  assert.ok(COIN_MANUAL.includes(`${p.I}:I | ${p.toured}:toured | ${p.Kyoto}:Kyoto`), 'cells block renders from constants')
  assert.ok(COIN_MANUAL.includes(`"sc": 7, "pos": ${p.Kyoto}`), 'IDENTIFY target + priorMark home render from the constant')
  assert.ok(COIN_MANUAL.includes(`(TRANSCRIPT): [7] (—): ${COIN_EXAMPLE_SENTENCE}`), 'transcript line renders the sentence constant')
})
