// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (sprint-wire-economy — the wearer-cells block is gone)
// [F-present/app/__tests__/scoring-context.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-economy — the WEARER-TURN CELLS data block is DELETED (both rails). priorMarks
// are keyed by WORD-INDEX into the wearer's transcript text + surface, validated by the
// recorder — the model no longer copies <pos>:<word> pairs, so the scoring context is just
// the manual (M1) first, then the present. This pins:
//   - with a present: `${nativeManual}\n\n${present}`;
//   - without a present: the native manual alone.
//
// inline-marking Touch 3 — the COIN_MANUAL constant is gone (coin-manual is a strict R0 leaf).
// The native manual is RENDERED from primitives the caller computes from NATIVE_SITUATION; this
// test builds it the SAME way the orchestrator does, so it pins what buildScoringContext produces.
//
// Run: npx tsx --test src/features/F-present/app/__tests__/scoring-context.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildScoringContext } from '@/features/F-present/app/cognition-orchestrator'
import { projectManual } from '@/features/F-present/config/coin-manual'
import { NATIVE_SITUATION, projectEmissionSchema } from '@/features/F-present/domain/coin-score'

const nativeManual = projectManual({
  inline: NATIVE_SITUATION.replyMarking === 'inline',
  includeWearerText: NATIVE_SITUATION.includeWearerText,
  fields: Object.keys(projectEmissionSchema(NATIVE_SITUATION).properties ?? {}),
})

// ── the context is manual-first, present-second — no cells block ────────────────
test('with a present, the context is `${nativeManual}\\n\\n${present}`', () => {
  assert.equal(buildScoringContext('PRESENT-BODY'), `${nativeManual}\n\nPRESENT-BODY`)
})

test('without a present, the context is the manual alone', () => {
  assert.equal(buildScoringContext(null), nativeManual)
})

// ── the deleted block leaves no residue — no WEARER-TURN CELLS rendering ────────
test('no WEARER-TURN CELLS block is rendered into the context', () => {
  // the manual itself no longer mentions the block, and the context renders no pos:word pairs.
  assert.ok(!buildScoringContext('PRESENT-BODY').includes('WEARER-TURN CELLS'), 'the cells block is gone')
})
