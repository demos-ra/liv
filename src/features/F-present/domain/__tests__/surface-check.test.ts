// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (sprint-wire-economy R3 — claim + validate, A2.1/A2.4)
// [F-present/domain/__tests__/surface-check.test.ts]
// Built with LIV · livai.dev
//
// SURFACE-CHECK ADVERSARIAL SUITE (done-criterion #2) — the four failure classes, ALL LOUD,
// none silent. The model testifies (word-index + surface); the structure validates
// (locateWordMarks resolves the index to a canonical word-cell and verifies the surface
// byte-exact). A false claim throws MarkSurfaceError, naming index / claimed / actual:
//   - MISCOUNT             — the index lands on a different word than the claimed surface;
//   - CELL-POSITION-AS-INDEX — a canonical position used where a word-index belongs (the
//                              emission-semantic pin: indexes count word-cells, not slots);
//   - OUT-OF-RANGE         — an index past the last word-cell;
//   - DUPLICATE-WORD       — recurrence does not create a false match; the index disambiguates
//                            and the surface still confirms exactly at that index.
// And the loud check is ATOMIC: one bad mark in a batch fails the whole locate (none silent).
//
// Load note: warm the F-present R3 graph first (db client is lazy), then import coin-score.
// Run: npx tsx --test src/features/F-present/domain/__tests__/surface-check.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cs: any

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  cs = await import('@/features/F-present/domain/coin-score')
})

// full canonical cells of a text (cutReply gives the cut; locateWordMarks filters word-cells).
const cells = (t: string) => cs.cutReply(t).cells

// ── happy path — a valid claim resolves clean, both labels, no throw ──────────────
test('valid word-index + surface resolves to canonical word-cell positions (no throw)', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')              // word-cells: 1=Kyoto 2=truly 3=rivals 4=Tokyo
  const located = cs.locateWordMarks([
    { word: 1, surface: 'Kyoto', marks: [{ op: 'identity' }] },
    { word: 3, surface: 'rivals', marks: [{ op: 'RELATE', peers: ['Kyoto', 'Tokyo'] }] },
  ], reply, 'reply')
  const wc = cs.wordCells(reply)
  assert.equal(located.length, 2)
  assert.equal(located[0].pos, wc[0].pos)                       // word 1 → 1st word-cell's canonical pos
  assert.equal(located[1].pos, wc[2].pos)                       // word 3 → 3rd word-cell's canonical pos
})

// ── MISCOUNT — index points at a different word than the claimed surface → loud ───
test('MISCOUNT fails loud, naming index / claimed / actual', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')             // word 2 is "truly", not "rivals"
  assert.throws(
    () => cs.locateWordMarks([{ word: 2, surface: 'rivals', marks: [{ op: 'identity' }] }], reply, 'reply'),
    (e: unknown) => e instanceof cs.MarkSurfaceError
      && /word-index 2/.test((e as Error).message)
      && /"rivals"/.test((e as Error).message)              // claimed
      && /"truly"/.test((e as Error).message),              // actual
  )
})

// ── CELL-POSITION-AS-INDEX — a canonical position used as a word-index lands wrong ─
test('CELL-POSITION-AS-INDEX fails loud (indexes count word-cells, not slots)', () => {
  // "the big cat sat": word-cells 1=the 2=big 3=cat 4=sat. "big"'s canonical position is 3
  // (the-, space, big). A model that emits 3 (the slot) for "big" lands on word-cell 3 = "cat".
  const wearer = cells('the big cat sat')
  assert.throws(
    () => cs.locateWordMarks([{ word: 3, surface: 'big', marks: [{ op: 'identity' }] }], wearer, 'prior'),
    (e: unknown) => e instanceof cs.MarkSurfaceError
      && /word-index 3/.test((e as Error).message)
      && /"big"/.test((e as Error).message)                 // claimed
      && /"cat"/.test((e as Error).message),                // actual
  )
})

// ── OUT-OF-RANGE — an index past the last word-cell → loud ────────────────────────
test('OUT-OF-RANGE fails loud, naming the index and the word-cell count', () => {
  const reply = cells('two words')                            // 2 word-cells
  assert.throws(
    () => cs.locateWordMarks([{ word: 99, surface: 'whatever', marks: [{ op: 'identity' }] }], reply, 'reply'),
    (e: unknown) => e instanceof cs.MarkSurfaceError
      && /out of range/.test((e as Error).message)
      && /word-index 99/.test((e as Error).message),
  )
})

// ── DUPLICATE-WORD — recurrence does not create a false match; index disambiguates ─
test('DUPLICATE-WORD — each recurrence resolves to its own position; wrong surface still loud', () => {
  // "the cat the dog": word-cells 1=the 2=cat 3=the 4=dog — two "the"s at distinct positions.
  const t = cells('the cat the dog')
  const wc = cs.wordCells(t)
  const first = cs.locateWordMarks([{ word: 1, surface: 'the', marks: [{ op: 'identity' }] }], t, 'prior')
  const second = cs.locateWordMarks([{ word: 3, surface: 'the', marks: [{ op: 'identity' }] }], t, 'prior')
  assert.equal(first[0].pos, wc[0].pos)                        // the FIRST "the"
  assert.equal(second[0].pos, wc[2].pos)                       // the SECOND "the"
  assert.notEqual(first[0].pos, second[0].pos)                 // distinct — the index disambiguates
  // a wrong surface at a duplicate index is still caught — no false match off the other "the".
  assert.throws(
    () => cs.locateWordMarks([{ word: 3, surface: 'cat', marks: [{ op: 'identity' }] }], t, 'prior'),
    (e: unknown) => e instanceof cs.MarkSurfaceError && /word-index 3/.test((e as Error).message),
  )
})

// ── NONE SILENT — one bad mark in a batch fails the whole locate (atomic) ─────────
test('a single bad mark fails the whole batch loud — none silently dropped', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')
  assert.throws(
    () => cs.locateWordMarks([
      { word: 1, surface: 'Kyoto', marks: [{ op: 'identity' }] },   // valid
      { word: 2, surface: 'WRONG', marks: [{ op: 'identity' }] },   // miscount — must not be skipped silently
    ], reply, 'reply'),
    cs.MarkSurfaceError,
  )
})
