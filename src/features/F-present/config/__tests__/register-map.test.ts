// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (R9 — registers)
// [F-present/config/__tests__/register-map.test.ts]
// Built with LIV · livai.dev
//
// THE REGISTER MAP (R9) — translates NAMES; mark-gate alone validates.
//   (A) round-trip: every engine op ↔ its musical name, both directions, total.
//   (B) toEngineMark re-skins ONLY the op; the payload (peers/coloring/target) passes
//       through; already-engine ops and malformed values pass through untouched.
//   (C) integration: the model emitting MUSICAL ops flows through emissionFromStructured →
//       translated to engine → mark-gate validates → engine marks placed. A non-musical,
//       non-engine op is dropped by the gate (the map never validates).
//
// Run: npx tsx --test src/features/F-present/config/__tests__/register-map.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MUSICAL_OPS, toEngineMark, engineOpToMusical, isMusicalOp } from '../register-map'
import type { Mark } from '../mark-types'
import { emissionFromStructured } from '@/features/F-present/domain/coin-score'

const ENGINE_OPS: Mark['op'][] = ['identity', 'RELATE', 'QUALIFY', 'IDENTIFY']

// ── (A) round-trip — note·tie·chord·expression ↔ identity·IDENTIFY·RELATE·QUALIFY ──
test('engine ↔ musical round-trips, both directions, total', () => {
  assert.deepEqual([...MUSICAL_OPS], ['note', 'tie', 'chord', 'expression'])
  for (const eng of ENGINE_OPS) {
    const mus = engineOpToMusical(eng)
    assert.ok(isMusicalOp(mus))
    const back = (toEngineMark({ op: mus }) as { op: string }).op
    assert.equal(back, eng, `${eng} → ${mus} → ${back}`)
  }
  // the canonical mapping
  assert.equal(engineOpToMusical('identity'), 'note')
  assert.equal(engineOpToMusical('IDENTIFY'), 'tie')
  assert.equal(engineOpToMusical('RELATE'), 'chord')
  assert.equal(engineOpToMusical('QUALIFY'), 'expression')
})

// ── (B) toEngineMark re-skins only the op; passes everything else through ─────────
test('toEngineMark translates only the op name; payload passes through', () => {
  assert.deepEqual(toEngineMark({ op: 'chord', peers: ['a', 'b'] }), { op: 'RELATE', peers: ['a', 'b'] })
  assert.deepEqual(toEngineMark({ op: 'expression', coloring: 'tall', target: 'a' }), { op: 'QUALIFY', coloring: 'tall', target: 'a' })
  // already-engine op → untouched (internal callers / tests keep working)
  assert.deepEqual(toEngineMark({ op: 'identity' }), { op: 'identity' })
  // malformed / unknown → untouched (the gate decides, the map never validates)
  assert.deepEqual(toEngineMark({ op: 'glissando' }), { op: 'glissando' })
  assert.equal(toEngineMark(null), null)
  assert.equal(toEngineMark(42), 42)
})

// ── (C) integration — musical emission → engine marks via the gate ────────────────
test('a model emitting MUSICAL ops yields validated ENGINE marks', () => {
  const e = emissionFromStructured({
    reply: 'Kyoto truly rivals Tokyo.',
    replyMarks: [
      { surface: 'Kyoto', marks: [{ op: 'note' }, { op: 'tie', target: 'Kyoto' }] },
      { surface: 'rivals', marks: [{ op: 'chord', peers: ['Kyoto', 'Tokyo'] }] },
      { surface: 'truly', marks: [{ op: 'expression', coloring: 'truly', target: 'Kyoto' }] },
    ],
    priorMarks: [],
  })
  const ops = e.replyMarks.flatMap((m: { marks: Mark[] }) => m.marks.map(k => k.op))
  assert.deepEqual(ops.sort(), ['IDENTIFY', 'QUALIFY', 'RELATE', 'identity'])   // all translated to engine
})

test('a non-musical, non-engine op is dropped by the gate (the map never validates)', () => {
  const e = emissionFromStructured({
    reply: 'a b',
    replyMarks: [{ surface: 'a', marks: [{ op: 'glissando' }, { op: 'note' }] }],
    priorMarks: [],
  })
  assert.deepEqual(e.replyMarks[0].marks.map((m: Mark) => m.op), ['identity'])   // glissando dropped, note kept
})
