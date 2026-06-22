// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (S1 name-not-count — claim + validate, A2.1/A2.4)
// [F-present/domain/__tests__/surface-check.test.ts]
// Built with LIV · livai.dev
//
// SURFACE-CHECK ADVERSARIAL SUITE (done-criterion #2) — the failure classes, ALL LOUD, none
// silent. The model NAMES the span a mark sits on (`surface` — a verbatim word or short span);
// the structure validates (locateWordMarks finds the span among the text's word-cells and homes
// the mark at its first word-cell). A span that isn't there throws MarkSurfaceError, naming the
// claimed surface:
//   - NAMED-SPAN-NOT-PRESENT — the model names text the turn does not contain (the S1 failure
//                              that subsumes the old miscount / cell-pos-as-index / out-of-range:
//                              there is no index to mis-emit; you either named real text or you
//                              did not);
//   - EMPTY-OF-WORDS         — a surface that cuts to no word-cell (punctuation only) is loud;
//   - DUPLICATE-WORD         — a repeated word resolves to its FIRST occurrence; to mean a later
//                              one, name a longer span that is unique.
// And the loud check is ATOMIC: one bad span in a batch fails the whole locate (none silent).
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

// ── happy path — a named span resolves clean to its first word-cell, both labels ──
test('a named span resolves to its canonical word-cell position (no throw)', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')              // word-cells: Kyoto truly rivals Tokyo
  const located = cs.locateWordMarks([
    { surface: 'Kyoto', marks: [{ op: 'identity' }] },
    { surface: 'rivals', marks: [{ op: 'RELATE', peers: ['Kyoto', 'Tokyo'] }] },
  ], reply, 'reply')
  const wc = cs.wordCells(reply)
  assert.equal(located.length, 2)
  assert.equal(located[0].pos, wc[0].pos)                       // "Kyoto" → 1st word-cell's canonical pos
  assert.equal(located[1].pos, wc[2].pos)                       // "rivals" → 3rd word-cell's canonical pos
})

// ── a multi-word span resolves to its FIRST word-cell ─────────────────────────────
test('a multi-word span homes at its first word-cell', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')
  const located = cs.locateWordMarks([{ surface: 'truly rivals', marks: [{ op: 'identity' }] }], reply, 'reply')
  const wc = cs.wordCells(reply)
  assert.equal(located.length, 1)
  assert.equal(located[0].pos, wc[1].pos)                       // the span begins at "truly" (2nd word-cell)
})

// ── NAMED-SPAN-NOT-PRESENT — the model names text the turn does not contain → loud ─
test('NAMED-SPAN-NOT-PRESENT fails loud, naming the claimed surface', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')             // contains no "Osaka"
  assert.throws(
    () => cs.locateWordMarks([{ surface: 'Osaka', marks: [{ op: 'identity' }] }], reply, 'reply'),
    (e: unknown) => e instanceof cs.MarkSurfaceError
      && /"Osaka"/.test((e as Error).message)                 // names the claimed span
      && /isn't there|no such span/.test((e as Error).message),
  )
})

// the old "cell-position-as-index" mistake cannot even be expressed now — there is no index.
// What remains is the same loud truth: a span not in the text is rejected, naming it.
test('a near-miss span (wrong text) is rejected loud (no index to mis-emit)', () => {
  const wearer = cells('the big cat sat')                      // contains no "dog"
  assert.throws(
    () => cs.locateWordMarks([{ surface: 'dog', marks: [{ op: 'identity' }] }], wearer, 'prior'),
    (e: unknown) => e instanceof cs.MarkSurfaceError && /"dog"/.test((e as Error).message),
  )
})

// ── EMPTY-OF-WORDS — a surface that cuts to no word-cell → loud ───────────────────
test('a surface with no word-cell (punctuation only) fails loud', () => {
  const reply = cells('two words')
  assert.throws(
    () => cs.locateWordMarks([{ surface: '...', marks: [{ op: 'identity' }] }], reply, 'reply'),
    (e: unknown) => e instanceof cs.MarkSurfaceError && /no word/.test((e as Error).message),
  )
})

// ── DUPLICATE-WORD — first occurrence wins; a longer unique span means a later one ─
test('DUPLICATE-WORD — a repeated word resolves to its FIRST occurrence; a longer span pins a later one', () => {
  // "the cat the dog": word-cells the cat the dog — two "the"s at distinct positions.
  const t = cells('the cat the dog')
  const wc = cs.wordCells(t)
  const bare = cs.locateWordMarks([{ surface: 'the', marks: [{ op: 'identity' }] }], t, 'prior')
  assert.equal(bare[0].pos, wc[0].pos)                          // the FIRST "the" (first-occurrence-wins)
  // to mean the SECOND "the", name a longer span that is unique ("the dog").
  const later = cs.locateWordMarks([{ surface: 'the dog', marks: [{ op: 'identity' }] }], t, 'prior')
  assert.equal(later[0].pos, wc[2].pos)                         // the span begins at the SECOND "the"
  assert.notEqual(bare[0].pos, later[0].pos)                    // distinct — the longer span disambiguates
})

// ── NONE SILENT — one bad span in a batch fails the whole locate (atomic) ─────────
test('a single bad span fails the whole batch loud — none silently dropped', () => {
  const reply = cells('Kyoto truly rivals Tokyo.')
  assert.throws(
    () => cs.locateWordMarks([
      { surface: 'Kyoto', marks: [{ op: 'identity' }] },        // valid
      { surface: 'WRONG', marks: [{ op: 'identity' }] },        // not in the reply — must not be skipped silently
    ], reply, 'reply'),
    cs.MarkSurfaceError,
  )
})
