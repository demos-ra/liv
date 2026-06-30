// @liv-standard v1.5.2
// Pins the issuer: ONCE-per-principal (a second issuance of the same source is refused) + VALID
// (a well-formed grant from the spec, source kept off the Grant). Trial is a value, not a path.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { issueGrant, type IssuerStore } from '../issuer-workflow'
import { TRIAL_SPEC } from '../../domain/grant-issuance'

// A DB-free stub store: records (principal, source) keys; persists into a map.
function stubStore() {
  const issued = new Set<string>()
  const store: IssuerStore = {
    alreadyIssued: async (p, s) => issued.has(`${p}:${s}`),
    persist:       async (p, _g, s) => { issued.add(`${p}:${s}`) },
  }
  return { store, issued }
}

const anchor = new Date(1_000 * 86_400_000)

test('first issuance succeeds — a valid grant from the spec, source kept OFF the Grant', () => {
  return (async () => {
    const { store } = stubStore()
    const r = await issueGrant('u1', TRIAL_SPEC, anchor, store)
    assert.equal(r.issued, true)
    if (r.issued) {
      assert.deepEqual(r.grant, { tier: 'paid', grantedAt: anchor, durationDays: 30 })
      assert.equal('source' in r.grant, false) // the gate's Grant is source-blind
    }
  })()
})

test('second issuance of the same source for the same principal is REFUSED (once-per-principal)', () => {
  return (async () => {
    const { store } = stubStore()
    await issueGrant('u1', TRIAL_SPEC, anchor, store)
    const again = await issueGrant('u1', TRIAL_SPEC, anchor, store)
    assert.equal(again.issued, false)
    if (!again.issued) assert.equal(again.reason, 'already-issued')
  })()
})
