// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — sprint-wire-economy R8)
// [F-present/app/__tests__/lookup.test.ts]
// Built with LIV · livai.dev
//
// THE READ CONTROL (R8) — lookup generalizes grid: turn | span | thing → numbered cells.
//   turn  → one turn's cells (≡ the old grid), all cells (word/space/punct), the cutter's truth.
//   span  → every turn in an sc range (optional author filter), flattened.
//   thing → every appearance of a named thing (its cluster's member coordinates), with words.
//   misses (turn not found / unknown thing) are a stating { ok:false }, never an exception.
// I/O injected (A4 deps) so it runs DB-free.
//
// Run: npx tsx --test src/features/F-present/app/__tests__/lookup.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { lookup } from '@/features/F-present/app/lookup'
import { cutCells } from '@/features/F-memory/exec/raw-turn-write'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import type { PresentStore } from '@/features/F-present/config/mark-types'

// fixture: two wearer turns; "Kyoto" (pos 5 of sc 7) is marked a thing (identity).
const TRANSCRIPT = (): RawTurn[] => [
  { sc: 7, who: 'wearer', words: cutCells('I toured Kyoto') },        // Kyoto @ pos 5
  { sc: 9, who: 'llm', words: cutCells('Kyoto is lovely') },
]
const STORE = (): PresentStore => [{ home: { who: 'wearer', sc: 7, pos: 5 }, mark: { op: 'identity' } }]
const deps = () => ({ readTranscript: async () => TRANSCRIPT(), store: { read: async () => STORE(), place: async () => {}, clear: async () => {} } })

// ── turn ──────────────────────────────────────────────────────────────────────
test('lookup turn → all cells of that turn, the cutter\'s truth', async () => {
  const res = await lookup('u', { kind: 'turn', who: 'wearer', sc: 7 }, deps())
  assert.equal(res.ok, true)
  assert.deepEqual(res.cells, cutCells('I toured Kyoto').map(c => ({ who: 'wearer', sc: 7, pos: c.pos, word: c.word })))
  assert.ok(res.cells.some((c: { word: string }) => c.word === ' '), 'space slots present')
})

test('lookup turn not found → stating { ok:false }, never throws', async () => {
  const res = await lookup('u', { kind: 'turn', who: 'llm', sc: 99 }, deps())
  assert.equal(res.ok, false)
  assert.match(res.message, /no such turn/)
})

// ── span ──────────────────────────────────────────────────────────────────────
test('lookup span → every turn in the sc range, flattened', async () => {
  const res = await lookup('u', { kind: 'span', from: 7, to: 9 }, deps())
  assert.equal(res.ok, true)
  assert.ok(res.cells.some((c: { sc: number }) => c.sc === 7) && res.cells.some((c: { sc: number }) => c.sc === 9))
})

test('lookup span with a who filter narrows to that author', async () => {
  const res = await lookup('u', { kind: 'span', from: 1, to: 99, who: 'llm' }, deps())
  assert.equal(res.ok, true)
  assert.ok(res.cells.every((c: { who: string }) => c.who === 'llm'))
})

// ── thing ───────────────────────────────────────────────────────────────────────
test('lookup thing → the named thing\'s appearances as numbered cells', async () => {
  const res = await lookup('u', { kind: 'thing', name: 'Kyoto' }, deps())
  assert.equal(res.ok, true)
  // Kyoto was marked a thing at wearer:7:5 → that coordinate, with its word.
  assert.ok(res.cells.some((c: { who: string; sc: number; pos: number; word: string }) =>
    c.who === 'wearer' && c.sc === 7 && c.pos === 5 && c.word === 'Kyoto'), `expected Kyoto@wearer:7:5 in ${JSON.stringify(res.cells)}`)
})

test('lookup unknown thing → stating { ok:false }', async () => {
  const res = await lookup('u', { kind: 'thing', name: 'Atlantis' }, deps())
  assert.equal(res.ok, false)
  assert.match(res.message, /no thing named/)
})
