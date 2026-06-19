// @liv-standard v1.5.2
// [F-entitlement/domain/__tests__/entitlement-logic.test.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    none
// slice:      F-entitlement
// layer:      R1
// wires-in:
//   W-FN  computeTrialEntitlement  ../entitlement-logic
//   W-FN  entitlementAdmits        ../entitlement-logic
//   W-FN  resolveEntitlement       ../../app/entitlement-workflow
// deps:
//   R1  ../entitlement-logic
//   R2  ../../app/entitlement-workflow
// validated: pending

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { computeTrialEntitlement, entitlementAdmits } from '../entitlement-logic'
import { resolveEntitlement } from '../../app/entitlement-workflow'
import type { EntitlementProvider } from '../../types/entitlement-types'
import { getStarted, connectClaudeCode } from '../../contract/onboarding-contract'

const DAY = 86_400_000

// The trial gate is time-boxed, never metered.
test('trial gate — inside the window is trial; past it is lapsed', () => {
  const created = new Date(0)
  assert.equal(computeTrialEntitlement(created, new Date(10 * DAY), 30).status, 'trial')
  assert.equal(computeTrialEntitlement(created, new Date(30 * DAY), 30).status, 'trial')
  assert.equal(computeTrialEntitlement(created, new Date(31 * DAY), 30).status, 'lapsed')
})

// The default never asserts paid (payment is a provider fact, not a clock fact).
test('trial gate — never returns paid, and a null anchor is permissive', () => {
  assert.notEqual(computeTrialEntitlement(new Date(0), new Date(999 * DAY), 30).status, 'paid')
  assert.equal(computeTrialEntitlement(null, new Date(999 * DAY), 30).status, 'trial')
})

// The crossing-decision shape: paid/trial admit, lapsed is the gate point.
test('entitlementAdmits — paid and trial admit; lapsed is the gate', () => {
  assert.equal(entitlementAdmits('paid'), true)
  assert.equal(entitlementAdmits('trial'), true)
  assert.equal(entitlementAdmits('lapsed'), false)
})

// THE §4 PROOF — a provider plugs in with zero line change. resolveEntitlement is
// provider-agnostic: a stand-in 'Polar' provider returning 'paid' is honored with
// no edit to the seam, the stamp, or any line block.
test('seam — a swapped provider is honored with zero consumer change', async () => {
  const fakePolar: EntitlementProvider = async () => ({ status: 'paid' })
  const out = await resolveEntitlement({ userId: 'u1', accountCreatedAt: null }, fakePolar)
  assert.equal(out.status, 'paid')
})

// The default binding resolves the hosted trial without a provider argument.
test('seam — the default binding resolves the hosted trial', async () => {
  const out = await resolveEntitlement({ userId: 'u1', accountCreatedAt: new Date(0) })
  assert.equal(out.status, 'lapsed')
})

// Onboarding — "Get started" defaults to hosted with the choice invisible.
test('onboarding — get-started is hosted, with no storage question', () => {
  const plan = getStarted()
  assert.equal(plan.pathId, 'get-started')
  assert.equal(plan.storageMode, 'hosted')
})

// Onboarding — the Connect-Claude-Code path drives the existing token route.
test('onboarding — connect-claude-code points at the agent-token route', () => {
  const plan = connectClaudeCode()
  assert.equal(plan.endpoint, '/api/agent-token')
  assert.equal(plan.storageMode, 'hosted')
})
