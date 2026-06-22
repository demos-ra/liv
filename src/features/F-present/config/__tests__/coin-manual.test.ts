// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (M1 — the manual cannot teach a span that isn't there)
// [F-present/config/__tests__/coin-manual.test.ts]
// Built with LIV · livai.dev
//
// S1 name-not-count — the worked example's NAMED SPANS are pinned to the LIVE cutter. The
// manual no longer teaches a word-index (there is no index to pin); a mark NAMES the span it
// sits on and LIV locates it. The manual's prose renders FROM the exported COIN_EXAMPLE_*
// sentence constants (one home, no duplication); this test runs the real cutCells/locateWordMarks
// on both example texts and asserts every span the example names actually OCCURS there (byte-exact,
// no throw). If anyone edits a sentence or names a span the cutter cannot find, this fails — the
// manual is incapable of silently teaching a span that isn't in its own text.
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
  COIN_NATIVE_FIELDS, COIN_WIRE_FIELDS,
} from '../coin-manual'

let cutCells: (t: string) => { pos: number; word: string }[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let locateWordMarks: any, projectEmissionSchema: any, NATIVE_SITUATION: any

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
  ;({ locateWordMarks, projectEmissionSchema, NATIVE_SITUATION } = await import('@/features/F-present/domain/coin-score'))
})

// the named spans the worked example marks — the SAME `surface` strings the manual emits.
const REPLY_SPANS = ['Kyoto', 'truly', 'rivals', 'Tokyo']
const WEARER_SPANS = ['Kyoto']

// ── every named span in the example OCCURS in its text (the live cutter locates it) ──
// locateWordMarks throws MarkSurfaceError if a named span is not present; a clean resolve
// proves the example names only spans the cutter can find — byte-exact, both texts.
test('the worked example names only spans the live cutter can locate (both texts)', () => {
  const replyCells = cutCells(COIN_EXAMPLE_REPLY)
  const located = locateWordMarks(REPLY_SPANS.map(surface => ({ surface, marks: [{ op: 'identity' }] })), replyCells, 'reply')
  assert.equal(located.length, REPLY_SPANS.length, 'every reply span resolves to a canonical position (no throw)')

  const wearerCells = cutCells(COIN_EXAMPLE_WEARER)
  const wLocated = locateWordMarks(WEARER_SPANS.map(surface => ({ surface, marks: [{ op: 'identity' }] })), wearerCells, 'prior')
  assert.equal(wLocated.length, WEARER_SPANS.length, 'every priorMark span resolves in the wearer turn (no throw)')

  // the documented fact: "Kyoto" is named in BOTH turns and locates in each.
  assert.ok(REPLY_SPANS.includes('Kyoto') && WEARER_SPANS.includes('Kyoto'))
})

// ── HOW TO RETURN renders its field names FROM the one contract (no fourth home) ──
// (cognition-turn contract) The manual no longer hand-types field names in free prose: HOW
// TO RETURN renders them from COIN_NATIVE_FIELDS / COIN_WIRE_FIELDS, and those lists are
// pinned to the CORE contract's projected property keys (projectEmissionSchema). The schema
// and the manual share one logical source — the manual can never name a field the contract
// does not carry, nor drop one it does.
test('HOW TO RETURN renders the field names from the contract lists', () => {
  assert.ok(COIN_MANUAL.includes(`{ ${COIN_NATIVE_FIELDS.join(', ')} }`), 'native return renders from COIN_NATIVE_FIELDS')
  assert.ok(COIN_MANUAL.includes(`{ ${COIN_WIRE_FIELDS.join(', ')} }`), 'wire call renders from COIN_WIRE_FIELDS')
})

test('the manual field lists ARE the core contract\'s projected property keys', () => {
  // native: projectEmissionSchema(NATIVE_SITUATION) — reply + the two mark arrays.
  assert.deepEqual([...COIN_NATIVE_FIELDS], Object.keys(projectEmissionSchema(NATIVE_SITUATION).properties))
  // wire: the all-present + wearerText projection (the wire's situation) — all four.
  const wire = projectEmissionSchema({ includeWearerText: true, demand: 'all-present' })
  assert.deepEqual([...COIN_WIRE_FIELDS], Object.keys(wire.properties))
})

// ── F6: the manual's mark vocabulary is pinned to MUSICAL_OPS (the register) ───────
// The four op tokens the manual teaches (note · tie · chord · expression) ARE the musical
// content register (register-map). Pinned by its op-form ("op": "<token>") so a substring
// can't false-match. If the register renames an op, this fails — the manual can never teach
// an op the register does not carry, the same guarantee fields and spans already have.
test('the manual teaches exactly the MUSICAL_OPS vocabulary (by op-form)', async () => {
  const { MUSICAL_OPS } = await import('../register-map')
  for (const op of MUSICAL_OPS) {
    assert.ok(COIN_MANUAL.includes(`"op": "${op}"`), `the manual names the "${op}" mark in its op-form (MUSICAL_OPS)`)
  }
})

// ── the prose actually renders from the sentence constants AND the named-span shape ─
// no `word` field anywhere; the example marks carry { surface, marks } only, and the
// sentences render from the exported constants (no drift between text & test).
test('the manual prose renders the named-span shape (no word-index) from the constants', () => {
  assert.ok(COIN_MANUAL.includes(`Your reply: "${COIN_EXAMPLE_REPLY}"`), 'reply sentence renders from the constant')
  assert.ok(COIN_MANUAL.includes(`[7] (—): ${COIN_EXAMPLE_WEARER}`), 'transcript line renders the sentence constant')
  // the named-span shape: a mark entry is { "surface": …, "marks": … } — the priorMark renders it.
  assert.ok(COIN_MANUAL.includes('{ "surface": "Kyoto", "marks": [ { "op": "note" } ] }'), 'the priorMark renders the named-span shape')
  // the index era is GONE: no "word": <n> home key, no "word-index" prose anywhere.
  assert.ok(!/"word":\s*\d/.test(COIN_MANUAL), 'no { "word": <n> } home key remains (name-not-count)')
  assert.ok(!/word-index/i.test(COIN_MANUAL), 'no "word-index" language remains')
})
