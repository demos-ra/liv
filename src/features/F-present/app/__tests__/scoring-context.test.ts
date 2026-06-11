// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (3R.5 — native wearer-cells thread)
// [F-present/app/__tests__/scoring-context.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition 3R.5 — the WEARER-TURN CELLS data block.
//   - PRESENT: with wearerTurn, the scoring context carries the block with canonical
//     <pos>:<word> pairs and the turn's sc, after the present.
//   - BACKWARD-COMPAT: with wearerTurn ABSENT, the scoring context is byte-identical to
//     the prior `${COIN_MANUAL}\n\n${present}` (and `COIN_MANUAL` alone when no present).
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first.
// Run: npx tsx --test src/features/F-present/app/__tests__/scoring-context.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

let buildScoringContext: (sp: string | null, wt?: { sc: number; cells: { pos: number; word: string }[] }) => string
let COIN_MANUAL: string

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ buildScoringContext } = await import('@/features/F-present/app/cognition-orchestrator'))
  ;({ COIN_MANUAL } = await import('@/features/F-present/config/coin-manual'))
})

// Fixture deliberately distinct from the manual's worked example (sc=7, Kyoto) so the
// markers below are unique to the RENDERED block, not the manual's prose.
const wearerTurn = { sc: 42, cells: [{ pos: 1, word: 'budget' }, { pos: 4, word: 'meeting' }] }

// ── present: the block renders with canonical positions ─────────────────────────
test('with wearerTurn, the context carries the WEARER-TURN CELLS block', () => {
  const ctx = buildScoringContext('PRESENT-BODY', wearerTurn)
  assert.ok(ctx.includes('WEARER-TURN CELLS'), 'block header present')
  assert.ok(ctx.includes('sc=42'), 'turn sc present')
  assert.ok(ctx.includes('1:budget | 4:meeting'), 'canonical <pos>:<word> pairs')
  // ordering: manual, then present, then the rendered block. Key on the unique pairs
  // (the manual itself mentions "WEARER-TURN CELLS", so match the data, not the phrase).
  assert.ok(ctx.indexOf('PRESENT-BODY') < ctx.indexOf('1:budget | 4:meeting'), 'block comes after the present')
  assert.ok(ctx.startsWith(COIN_MANUAL), 'manual first')
})

// ── backward-compat: absent wearerTurn → byte-identical to before ───────────────
test('without wearerTurn, the context is byte-identical to the prior form', () => {
  assert.equal(buildScoringContext('PRESENT-BODY'), `${COIN_MANUAL}\n\nPRESENT-BODY`)
  assert.equal(buildScoringContext(null), COIN_MANUAL)
})
