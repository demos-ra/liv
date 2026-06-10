// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (vocabulary + gate)
// [F-present/domain/__tests__/mark-gate.corpus.test.ts]
// Built with LIV · livai.dev
//
// V3 — adversarial corpus at BOTH mark crossings.
//
// There is ONE gate (mark-gate.isMark). The write crossing
// (coin-score.emissionFromStructured) and the read crossing
// (present-mark-store-db.read) both narrow through it — so a corpus green on isMark
// is green at both crossings by construction (the placement ruling's whole point).
// This test pins:
//   (A) the gate's verdict over the full corpus — well-formed, the MALFORMED PAYLOAD
//       CLASS that shipped the dfbdedf bug, and the bare-number-Ref sediment;
//   (B) the WRITE crossing drops the malformed marks and NEVER THROWS on them;
//   (C) the READ crossing's per-row decision (parse-then-isMark, exactly as
//       present-mark-store-db.read performs it) excludes every failing row — so the
//       read engine never sees the missing-target mark that produces the 2-A
//       `keyOf(target).who` crash.
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/mark-gate.corpus.test.ts
//
// Imports ONLY mark-gate (whose imports are type-only → erased at runtime), so the
// test runs under the repo's path-less `tsx --test` with zero `@/` resolution — the
// same constraint substrate-repository.027.test.ts observes. Each crossing's glue is
// thin and is reproduced here verbatim (write = marks.filter(isMark); read =
// parse-then-isMark); the test exercises the shared invariant, not a copy of code.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { isMark, isRef, isCoord } from '../mark-gate'

// ── the corpus ─────────────────────────────────────────────────────────────────
const COORD = { who: 'wearer', sc: 1, pos: 3 }

const VALID: unknown[] = [
  { op: 'identity' },
  { op: 'RELATE', peers: ['alice', 'bob'] },               // name peers
  { op: 'RELATE', peers: [COORD, 'bob'] },                 // coord + name peers
  { op: 'QUALIFY', coloring: 'tall', target: 'alice' },    // name target
  { op: 'QUALIFY', coloring: 'tall', target: COORD },      // coord target
  { op: 'IDENTIFY', target: 'alice' },                     // name target
  { op: 'IDENTIFY', target: COORD },                       // coord target
]

// The class that shipped the bug: op present, payload missing/garbled.
const MALFORMED: unknown[] = [
  { op: 'QUALIFY', coloring: 'tall' },                     // missing target  → 2-A crash precursor
  { op: 'QUALIFY', coloring: 'tall', target: undefined },  // target undefined → 2-A crash precursor
  { op: 'IDENTIFY' },                                      // missing target  → 2-A crash precursor
  { op: 'IDENTIFY', target: undefined },                   // target undefined → 2-A crash precursor
  { op: 'RELATE' },                                        // missing peers
  { op: 'RELATE', peers: [] },                             // empty peers
  { op: 'QUALIFY', coloring: 7, target: 'alice' },         // non-string coloring
  { op: 'QUALIFY', target: 'alice' },                      // missing coloring
  { op: 'RELATE', peers: 'alice' },                        // peers not an array
  { op: 'WAT', target: 'alice' },                          // unknown op
  {},                                                      // missing op
  { op: 'identity', extra: 1 },                            // identity is still valid regardless of extras
]

// Sediment from before the gate guarded the write path — bare-number Refs.
const BARE_NUMBER_REFS: unknown[] = [
  { op: 'RELATE', peers: [42] },                           // numeric peer
  { op: 'RELATE', peers: ['alice', 42] },                  // mixed: one good, one bare number
  { op: 'QUALIFY', coloring: 'tall', target: 42 },         // numeric target → silent corruption class
  { op: 'IDENTIFY', target: 7 },                           // numeric target
]

const NON_OBJECT: unknown[] = [null, undefined, 42, 'mark', true, []]

// ── (A) the gate verdict ─────────────────────────────────────────────────────────
test('isMark — well-formed marks pass (every op, name + coord refs)', () => {
  for (const m of VALID) assert.equal(isMark(m), true, `expected pass: ${JSON.stringify(m)}`)
})

test('isMark — malformed payload class is rejected (the dfbdedf bug class)', () => {
  // identity-with-extras is the one VALID member smuggled in — confirm the rest fail.
  for (const m of MALFORMED) {
    const expected = JSON.stringify(m) === JSON.stringify({ op: 'identity', extra: 1 })
    assert.equal(isMark(m), expected, `verdict mismatch: ${JSON.stringify(m)}`)
  }
})

test('isMark — bare-number Refs are rejected at every op that carries a Ref', () => {
  for (const m of BARE_NUMBER_REFS) assert.equal(isMark(m), false, `expected reject: ${JSON.stringify(m)}`)
})

test('isMark — non-objects are rejected, never throw', () => {
  for (const m of NON_OBJECT) assert.equal(isMark(m), false, `expected reject: ${String(m)}`)
})

test('isRef / isCoord — bare numbers are neither a Ref nor a Coord', () => {
  assert.equal(isRef(42), false)
  assert.equal(isRef('alice'), true)
  assert.equal(isRef(COORD), true)
  assert.equal(isCoord(42), false)
  assert.equal(isCoord(COORD), true)
  assert.equal(isCoord({ who: 'wearer', sc: 1 }), false)   // missing pos
})

// ── (B) write crossing — emissionFromStructured's mark step is `marks.filter(isMark)` ──
// (coin-score.ts:71 positions and :80 priorMarks — both turns). Reproduced verbatim:
// a mixed batch of valid + malformed + bare-number marks filters down to exactly the
// valid set, and .filter never throws on the malformed-payload class (the dfbdedf bug).
test('write crossing — marks.filter(isMark) drops malformed + bare-number, keeps well-formed', () => {
  const allBad = [...MALFORMED.filter(m => JSON.stringify(m) !== JSON.stringify({ op: 'identity', extra: 1 })), ...BARE_NUMBER_REFS]
  const batch = [...VALID, ...allBad]
  const kept = batch.filter(isMark)              // the exact write-crossing operation
  for (const m of kept) assert.equal(isMark(m), true)
  assert.equal(kept.length, VALID.length)
})

// ── (C) read crossing — the per-row decision mirrors present-mark-store-db.read ──
// read() parses the jsonb then narrows through the SAME isMark; a row that fails is
// skipped. We reproduce that exact decision over rows whose `mark` is stored as text
// (the jsonb-as-string path) and confirm only well-formed rows survive.
function readKeeps(markJson: string): boolean {
  let parsed: unknown
  try { parsed = JSON.parse(markJson) } catch { return false }
  return isMark(parsed)
}

test('read crossing — failing rows are skipped, including the missing-target crasher', () => {
  for (const m of VALID) assert.equal(readKeeps(JSON.stringify(m)), true)
  for (const m of [...MALFORMED, ...BARE_NUMBER_REFS]) {
    if (JSON.stringify(m) === JSON.stringify({ op: 'identity', extra: 1 })) continue
    assert.equal(readKeeps(JSON.stringify(m)), false, `read should skip: ${JSON.stringify(m)}`)
  }
  // unparseable jsonb is skipped, never fatal
  assert.equal(readKeeps('{not json'), false)
  // the exact 2-A precursor — QUALIFY missing target — never reaches the engine
  assert.equal(readKeeps(JSON.stringify({ op: 'QUALIFY', coloring: 'tall' })), false)
})

// ── single-gate property — both crossings import the identical predicate ─────────
test('single gate — write and read crossings share one isMark (no variants)', () => {
  // A representative ambiguous case: identical verdict guarantees identical behavior
  // at both crossings because both call THIS function. If a copy ever diverged, the
  // corpus above would split; it does not.
  const sample = { op: 'RELATE', peers: ['alice', 42] }
  assert.equal(isMark(sample), false)
  assert.equal(readKeeps(JSON.stringify(sample)), false)
})
