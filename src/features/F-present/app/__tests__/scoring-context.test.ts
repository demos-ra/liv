// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (sprint-wire-economy — the wearer-cells block is gone)
// [F-present/app/__tests__/scoring-context.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-economy — the WEARER-TURN CELLS data block is DELETED (both rails). priorMarks
// are keyed by WORD-INDEX into the wearer's transcript text + surface, validated by the
// recorder — the model no longer copies <pos>:<word> pairs, so the scoring context is just
// the manual (M1) first, then the present. This pins:
//   - with a present: `${COIN_MANUAL}\n\n${present}`;
//   - without a present: `COIN_MANUAL` alone.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first.
// Run: npx tsx --test src/features/F-present/app/__tests__/scoring-context.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

let buildScoringContext: (sp: string | null) => string
let COIN_MANUAL: string

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ buildScoringContext } = await import('@/features/F-present/app/cognition-orchestrator'))
  ;({ COIN_MANUAL } = await import('@/features/F-present/config/coin-manual'))
})

// ── the context is manual-first, present-second — no cells block ────────────────
test('with a present, the context is `${COIN_MANUAL}\\n\\n${present}`', () => {
  assert.equal(buildScoringContext('PRESENT-BODY'), `${COIN_MANUAL}\n\nPRESENT-BODY`)
})

test('without a present, the context is the manual alone', () => {
  assert.equal(buildScoringContext(null), COIN_MANUAL)
})

// ── the deleted block leaves no residue — no WEARER-TURN CELLS rendering ────────
test('no WEARER-TURN CELLS block is rendered into the context', () => {
  // the manual itself no longer mentions the block, and the context renders no pos:word pairs.
  assert.ok(!buildScoringContext('PRESENT-BODY').includes('WEARER-TURN CELLS'), 'the cells block is gone')
})
