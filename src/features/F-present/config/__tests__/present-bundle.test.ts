// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — sprint-wire-economy R7 defaults layer)
// [F-present/config/__tests__/present-bundle.test.ts]
// Built with LIV · livai.dev
//
// THE DEFAULTS LAYER (R7) — rail-aware named bundles, CONFIG DATA not code. The native rail
// wakes with the windshield transcript + both tables; the wire wakes with the tables ONLY —
// the transcript is fetched on demand (lookup, R8), never carried per turn. This pins the
// named configs; presentContext gates its sections by them (the live rail behaviour is
// exercised end-to-end post-deploy — no DB in-repo).
//
// Imports ONLY read-engine-types (pure) → runs under bare tsx with zero @/ resolution.
// Run: npx tsx --test src/features/F-present/config/__tests__/present-bundle.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { PRESENT_BUNDLES } from '../read-engine-types'

test('native bundle = windshield transcript + both sections', () => {
  assert.deepEqual(PRESENT_BUNDLES.native, { transcript: true, structure: true, state: true })
})

test('wire bundle = both sections ONLY — no transcript (fetched via lookup, R8)', () => {
  assert.equal(PRESENT_BUNDLES.wire.transcript, false, 'the wire carries no per-turn transcript')
  assert.equal(PRESENT_BUNDLES.wire.structure, true)
  assert.equal(PRESENT_BUNDLES.wire.state, true)
})
