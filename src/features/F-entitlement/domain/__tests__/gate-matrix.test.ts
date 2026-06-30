// @liv-standard v1.5.2
// Pins the grant matrix to Access-Surface Build Spec §4 — the contents are from the spec, not
// invented; this test fails if they drift.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { grantAdmits, grantKeyOf } from '../gate-matrix'

test('free key admits EXACTLY PUBLIC r+w · BROADCAST r · INBOX r (§4); every paid-only cell LOCKED', () => {
  assert.equal(grantAdmits('free', 'PUBLIC', 'read'), true)
  assert.equal(grantAdmits('free', 'PUBLIC', 'write'), true)
  assert.equal(grantAdmits('free', 'BROADCAST', 'read'), true)
  assert.equal(grantAdmits('free', 'INBOX', 'read'), true)
  assert.equal(grantAdmits('free', 'PRIVATE', 'read'), false)
  assert.equal(grantAdmits('free', 'PRIVATE', 'write'), false)
  assert.equal(grantAdmits('free', 'BROADCAST', 'write'), false)
  assert.equal(grantAdmits('free', 'INBOX', 'write'), false)
})

test('paid key admits EVERY region×direction (§4: free + PRIVATE r+w · BROADCAST w · INBOX w)', () => {
  for (const region of ['PRIVATE', 'INBOX', 'BROADCAST', 'PUBLIC'] as const)
    for (const dir of ['read', 'write'] as const)
      assert.equal(grantAdmits('paid', region, dir), true, `paid must admit ${region}:${dir}`)
})

test('grantKeyOf reads the tier off the grant — one job, source-blind, no status/lapsed branch', () => {
  assert.equal(grantKeyOf({ tier: 'paid', grantedAt: new Date(0), durationDays: 30 }), 'paid')
})
