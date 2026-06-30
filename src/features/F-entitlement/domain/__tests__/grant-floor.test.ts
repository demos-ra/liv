// @liv-standard v1.5.2
// Pins the floor: expiry-by-absence (no 'lapsed' branch), one-way resolve (live grant → tier; null
// or elapsed → free). Trial-end, paid-end, never-had-one all fall the same way.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { grantKeyForRead, isGrantLive, FREE_FLOOR } from '../grant-floor'

const DAY = 86_400_000
const now = new Date(1_000 * DAY) // day 1000

test('a live grant resolves to its tier key', () => {
  const live = { tier: 'paid' as const, grantedAt: new Date(990 * DAY), durationDays: 30 }
  assert.equal(isGrantLive(live, now), true)
  assert.equal(grantKeyForRead(live, now), 'paid')
})

test('an elapsed grant falls to the free floor — by ABSENCE, not a lapsed branch', () => {
  const elapsed = { tier: 'paid' as const, grantedAt: new Date(900 * DAY), durationDays: 30 }
  assert.equal(isGrantLive(elapsed, now), false)
  assert.equal(grantKeyForRead(elapsed, now), 'free')
})

test('never-had-one (null) falls to the free floor — the same one way', () => {
  assert.equal(grantKeyForRead(null, now), 'free')
  assert.equal(FREE_FLOOR, 'free')
})
