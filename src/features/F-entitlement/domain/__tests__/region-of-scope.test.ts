// @liv-standard v1.5.2
// Pins region derivation: 'public' → PUBLIC; any private circumstance (projectId/session) → PRIVATE
// (fail-closed-safe default-to-most-restrictive). Never caller-supplied — derives from the column.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { regionOfScope } from '../region-of-scope'

test("the reserved cross-author scope 'public' → PUBLIC", () => {
  assert.equal(regionOfScope('public'), 'PUBLIC')
})

test('any private circumstance (projectId / sessionId) → PRIVATE', () => {
  assert.equal(regionOfScope('project-abc'), 'PRIVATE')
  assert.equal(regionOfScope('sess_1d2e3f'), 'PRIVATE')
})

test('an unrecognized / empty scope → PRIVATE (fail-closed-safe: most-restrictive, never over-grants)', () => {
  assert.equal(regionOfScope(''), 'PRIVATE')
  assert.equal(regionOfScope('inbox'), 'PRIVATE')      // Wave-4 not yet a case → under-grants, safe
  assert.equal(regionOfScope('broadcast'), 'PRIVATE')  // (will gain an explicit case when it exists)
})
