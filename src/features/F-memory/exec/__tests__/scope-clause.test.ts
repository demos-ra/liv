// @liv-standard v1.5.2
// THE SAFETY GUARD (Wave-2 keystone) — the read face of the one wall. scopeClause is the SOLE
// builder of every substrate read's WHERE (both floors call it). The user_id bound is dropped in
// EXACTLY ONE branch — kind:'public' — and 'public' is the ONLY kind that omits user_id. 'mine'
// (and the alias-fold) ALWAYS bind it. Because there is no second WHERE-builder, no read can lose
// its user_id bound except the public branch — that structural fact is the guarantee these tests pin.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { scopeClause, mine, publicScope, readerOf } from '../scope-clause'

test('mine ALWAYS binds user_id (single id → user_id = $1)', () => {
  const c = scopeClause(mine('u1'))
  assert.equal(c.clause, 'user_id = $1')
  assert.deepEqual(c.params, ['u1'])
  assert.match(c.clause, /user_id/, 'mine must bind user_id')
})

test('mine with an alias-set folds to user_id = ANY($1) (the principal-set) — still bound', () => {
  const c = scopeClause(mine(['u1', 'u2']))
  assert.equal(c.clause, 'user_id = ANY($1)')
  assert.deepEqual(c.params, ['u1', 'u2'])
  assert.match(c.clause, /user_id/, 'the alias-fold still binds user_id')
})

test('public is the ONLY branch that drops user_id — source_scope=public, no user_id, no param; reader does NOT enter the clause', () => {
  const c = scopeClause(publicScope('u-session'))
  assert.equal(c.clause, "source_scope = 'public'")
  assert.deepEqual(c.params, [])
  assert.doesNotMatch(c.clause, /user_id/, 'public drops the user_id bound — and only public does')
  assert.doesNotMatch(c.clause, /u-session/, 'the reader is carried for the admit, NEVER in the clause')
})

// readerOf — the read-admit's reader, for EVERY scope (so admitRead is in front of all reads).
test('readerOf returns the reader for the admit: mine → the principal, public → the session user', () => {
  assert.equal(readerOf(mine('u1')), 'u1')
  assert.equal(readerOf(mine(['u1', 'u2'])), 'u1', 'the alias-set folds to the canonical principal for the admit')
  assert.equal(readerOf(publicScope('u-session')), 'u-session', 'public carries the session reader for the admit')
})
