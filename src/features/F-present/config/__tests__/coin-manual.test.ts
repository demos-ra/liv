// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (M1 — the manual cannot teach a span that isn't there, nor a field the contract doesn't project)
// [F-present/config/__tests__/coin-manual.test.ts]
// Built with LIV · livai.dev
//
// S1 name-not-count — the worked example's NAMED SPANS are pinned to the LIVE cutter. The
// manual no longer teaches a word-index (there is no index to pin); a mark NAMES the span it
// sits on and LIV locates it. The manual's prose renders FROM the exported COIN_EXAMPLE_*
// sentence constants (one home, no duplication).
//
// inline-marking Touch 3 — the manual is RENDERED from primitives (projectManual(opts)). coin-manual
// is a strict R0 LEAF (imports nothing from coin-score/R1): the CALLER computes the schema and feeds
// { inline, includeWearerText, fields }. The test builds opts via a local helper from the LIVE
// projectEmissionSchema, exactly as the caller sites do. This test pins:
//   - the inline worked example to the LIVE parser+cutter (parseInlineReply.clean === the reply,
//     every wrapped span byte-exact in cutReply's cells, all four marks survive the gate);
//   - the named worked example spans to the live cutter (locateWordMarks, no throw);
//   - HOW TO RETURN's field list IS Object.keys(projectEmissionSchema(situation).properties) — both
//     projections (native = inline → {reply, priorMarks}; wire = separate → all four);
//   - ATTRIBUTION per surface (FIX 3): native's HOW TO RETURN is the "return ONLY the JSON object"
//     line with {reply, priorMarks} and NO "call compose" line; the wire's is "call compose ONCE"
//     with {wearerText, reply, replyMarks, priorMarks} and NO "return ONLY the JSON object" line —
//     each field list pinned ON its correctly-attributed instruction;
//   - projectManual teaches the matching FORM (inline [[ ]] vs named { surface, marks });
//   - the MUSICAL_OPS vocabulary pin (both forms name the four marks); the no-word-index guarantees.
//
// Run: npx tsx --test src/features/F-present/config/__tests__/coin-manual.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  COIN_EXAMPLE_WEARER, COIN_EXAMPLE_REPLY, COIN_EXAMPLE_INLINE,
  projectManual,
} from '../coin-manual'
import { cutCells } from '@/features/F-memory/exec/raw-turn-write'
import { locateWordMarks, projectEmissionSchema, NATIVE_SITUATION, parseInlineReply, cutReply, locateInlineMarks } from '@/features/F-present/domain/coin-score'

// a separate (named-form) situation — the wire's shape: carry wearerText + demand all present.
const SEPARATE_SITUATION = { includeWearerText: true, demand: 'all-present' as const }

// the CALLER's opts derivation — exactly what cognition-orchestrator (native) and mcp-contract
// (wire) do: compute the schema, hand projectManual the primitives. R0 renders what it is handed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const optsFor = (s: any) => ({
  inline: s.replyMarking === 'inline',
  includeWearerText: s.includeWearerText,
  fields: Object.keys(projectEmissionSchema(s).properties ?? {}),
})

// the named spans the worked example marks — the SAME `surface` strings the manual emits.
const REPLY_SPANS = ['Kyoto', 'truly', 'rivals', 'Tokyo']
const WEARER_SPANS = ['Kyoto']

// ── the INLINE worked example round-trips through the LIVE parser + cutter ──────────
test('the inline worked example: clean === reply, every wrapped span byte-exact in the cut', () => {
  const { clean, marks } = parseInlineReply(COIN_EXAMPLE_INLINE)
  assert.equal(clean, COIN_EXAMPLE_REPLY, 'parseInlineReply(inline).clean reproduces the reply sentence byte-exact')
  assert.equal(marks.length, REPLY_SPANS.length, 'the inline example wraps exactly the four example spans')

  for (let i = 0; i < marks.length; i++) {
    const span: string = clean.slice(marks[i].start, marks[i].end)
    assert.equal(span, REPLY_SPANS[i], `wrapped span ${i} is "${REPLY_SPANS[i]}" byte-exact`)
  }

  const { cells } = cutReply(clean)
  const located = locateInlineMarks(marks, cells)
  assert.equal(located.length, REPLY_SPANS.length, 'every wrapped span homes on a word-cell in the live cut')
  // all four musical marks pass the gate (the example demonstrates the whole set + a coloring;
  // Kyoto carries note+tie, so identity appears twice — five marks across four spans).
  const ops = located.flatMap((l: { marks: { op: string }[] }) => l.marks.map(m => m.op))
  assert.equal(ops.length, 5, 'five marks home (note+tie on Kyoto, expression, chord, note)')
  assert.deepEqual([...new Set(ops)].sort(), ['IDENTIFY', 'QUALIFY', 'RELATE', 'identity'].sort(),
    'all four engine marks (note/tie/chord/expression → identity/IDENTIFY/RELATE/QUALIFY) survive the gate')
})

// ── the NAMED worked example names only spans the live cutter can locate ────────────
test('the named worked example names only spans the live cutter can locate (both texts)', () => {
  const replyCells = cutCells(COIN_EXAMPLE_REPLY)
  const located = locateWordMarks(REPLY_SPANS.map(surface => ({ surface, marks: [{ op: 'identity' }] })), replyCells, 'reply')
  assert.equal(located.length, REPLY_SPANS.length, 'every reply span resolves to a canonical position (no throw)')

  const wearerCells = cutCells(COIN_EXAMPLE_WEARER)
  const wLocated = locateWordMarks(WEARER_SPANS.map(surface => ({ surface, marks: [{ op: 'identity' }] })), wearerCells, 'prior')
  assert.equal(wLocated.length, WEARER_SPANS.length, 'every priorMark span resolves in the wearer turn (no throw)')

  assert.ok(REPLY_SPANS.includes('Kyoto') && WEARER_SPANS.includes('Kyoto'))
})

// ── the field list IS the contract's projected property keys (per situation) ────────
test('the projected field list IS the contract\'s property keys (per situation)', () => {
  assert.deepEqual(optsFor(NATIVE_SITUATION).fields, ['reply', 'priorMarks'],
    'native inline projects exactly {reply, priorMarks} (no replyMarks)')
  assert.deepEqual(optsFor(SEPARATE_SITUATION).fields, ['wearerText', 'reply', 'replyMarks', 'priorMarks'],
    'the wire separate projection carries all four')
})

// ── FIX 3 — HOW TO RETURN is ATTRIBUTED per surface, field list pinned ON its own line ──
// native (includeWearerText:false) → the "return ONLY the JSON object" instruction with its own
// fields, and NO "call compose" line. The wire is the mirror. The bug this guards: a field list
// printed under the WRONG instruction, or both instructions in one projection.
test('native HOW TO RETURN: "return ONLY the JSON object" with {reply, priorMarks}, no compose line', () => {
  const m = projectManual(optsFor(NATIVE_SITUATION))
  assert.ok(m.includes('return ONLY the JSON object, exactly these fields: { reply, priorMarks }.'),
    'native field list pinned ON the "return ONLY the JSON object" instruction')
  assert.ok(!m.includes('call compose ONCE'), 'native carries NO wire "call compose" instruction')
})

test('wire HOW TO RETURN: "call compose ONCE" with all four fields, no return-JSON line', () => {
  const m = projectManual(optsFor(SEPARATE_SITUATION))
  assert.ok(m.includes('call compose ONCE with exactly these fields: { wearerText, reply, replyMarks, priorMarks }'),
    'wire field list pinned ON the "call compose ONCE" instruction')
  assert.ok(!m.includes('return ONLY the JSON object'), 'the wire carries NO native "return ONLY the JSON object" instruction')
})

// ── projectManual teaches the matching FORM per situation ───────────────────────────
test('the inline form (opts.inline true) teaches the [[ ]] form', () => {
  const m = projectManual(optsFor(NATIVE_SITUATION))
  assert.ok(m.includes('[[span]]'), 'the inline manual teaches the [[span]] wrap')
  assert.ok(m.includes('[[span]](chord A, B)'), 'the inline manual teaches the chord clause')
  assert.ok(m.includes('[[span]](expression <coloring> <target>)'), 'the inline manual teaches the expression clause (coloring + target — ruling B)')
  assert.ok(m.includes(COIN_EXAMPLE_INLINE), 'the inline worked example renders from the constant')
  assert.ok(!m.includes('{ "surface": "Kyoto",  "marks":'), 'the inline manual does not render the named replyMarks JSON')
})

test('the named form (opts.inline false) teaches the { surface, marks } form', () => {
  const m = projectManual(optsFor(SEPARATE_SITUATION))
  // the named emission shape — VERBATIM from the current manual prose.
  assert.ok(m.includes('{ "surface": "Kyoto", "marks": [ { "op": "note" } ] }'), 'the named manual renders the named-span shape')
  assert.ok(m.includes('{ "op": "chord", "peers": [A, B] }'), 'the named manual renders the chord JSON form')
  assert.ok(m.includes(`Your reply: "${COIN_EXAMPLE_REPLY}"`), 'the named worked example renders the reply sentence constant')
  assert.ok(!m.includes('[[span]]'), 'the named manual does not teach the [[ ]] wrap')
})

// ── F6: the manual's mark vocabulary is the MUSICAL_OPS register (both forms) ────────
test('both projections teach exactly the MUSICAL_OPS vocabulary', async () => {
  const { MUSICAL_OPS } = await import('../register-map')
  const named = projectManual(optsFor(SEPARATE_SITUATION))
  const inline = projectManual(optsFor(NATIVE_SITUATION))
  for (const op of MUSICAL_OPS) {
    assert.ok(named.includes(`"op": "${op}"`), `the named manual names the "${op}" mark in its op-form`)
    assert.ok(inline.includes(op), `the inline manual names the "${op}" mark`)
  }
})

// ── the no-word-index guarantees hold in BOTH forms ─────────────────────────────────
test('no word-index home key or language remains in either projection', () => {
  for (const m of [projectManual(optsFor(NATIVE_SITUATION)), projectManual(optsFor(SEPARATE_SITUATION))]) {
    assert.ok(!/"word":\s*\d/.test(m), 'no { "word": <n> } home key remains (name-not-count)')
    assert.ok(!/word-index/i.test(m), 'no "word-index" language remains')
  }
})
