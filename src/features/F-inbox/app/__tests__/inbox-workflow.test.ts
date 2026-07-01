// @liv-standard v1.5.2
// [F-inbox/R2 — test]
// Built with LIV · livai.dev
// [F-inbox/app/__tests__/inbox-workflow.test.ts]
//
// Pins the two compositions with a DB-free injected SubstratePort (the repo's DI test idiom — cf.
// issuer-workflow's IssuerStore). The port only stubs cut + write, so the test loads no substrate
// graph:
//   1. the WALLED write — owner-stamped + scoped to the inbox's OWN scope (not 'public', not a
//      projectId), through ONE sealed write call.
//   2. the APPEND-PRIVATE promote — a NEW 'mine'/private write that tie-refs the inbox row's exact
//      Coord, with NO mutation of source_scope (exactly one write; no update path exists).

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { walledWriteDigest, promoteToPrivate, type SubstratePort } from '../inbox-workflow'
import { INBOX_SCOPE } from '../../config/inbox-types'
import type { Digest, InboxEntryRef } from '../../config/inbox-types'

// A recording port — captures every write call; cut splits on spaces (a stand-in for the real
// canonical cutter, enough to assert content reached cells). gather/mine unused by these two tests.
function recordingPort() {
  const calls: Array<{ who: string; words: { pos: number; word: string }[]; userId: string; scope: string; grantKey: string }> = []
  let nextSc = 100
  const port: SubstratePort = {
    write: async (input) => {
      calls.push({ who: input.who, words: input.words, userId: input.userId, scope: input.scope, grantKey: input.grantKey })
      return nextSc++
    },
    cut:    (text) => text.split(/\s+/).filter(Boolean).map((word, i) => ({ pos: i + 1, word })),
    gather: async () => [],
    mine:   (principals) => ({ kind: 'mine', principals }),
  }
  return { port, calls }
}

test('walledWriteDigest — owner-stamped + the inbox scope, ONE sealed write (the wall)', () => {
  return (async () => {
    const { port, calls } = recordingPort()
    const digest: Digest = { ownerUserId: 'u1', who: 'program', grantKey: 'paid', text: 'a digest payload', source: 'feed' }

    const ref = await walledWriteDigest(digest, port)

    assert.equal(calls.length, 1)                  // one write, nothing else
    assert.equal(calls[0].userId, 'u1')            // owner-stamped — the isolation wall
    assert.equal(calls[0].scope, INBOX_SCOPE)      // scoped to the inbox's OWN value
    assert.notEqual(calls[0].scope, 'public')      // NOT the public forum scope
    assert.ok(calls[0].words.length > 0)           // the digest content was cut to cells
    assert.deepEqual(ref, { who: 'program', sc: 100, pos: 1 })
  })()
})

test('promoteToPrivate — APPEND-PRIVATE: a NEW private write tie-ref-ing the inbox row, NO source_scope mutation', () => {
  return (async () => {
    const { port, calls } = recordingPort()
    const entry: InboxEntryRef = { who: 'program', sc: 100, pos: 1 }   // the inbox row to promote

    const r = await promoteToPrivate({ entry, userId: 'u1', privateScope: 'project-42', grantKey: 'paid' }, port)

    // exactly ONE write — a NEW append. There is no second call and no UPDATE of source_scope.
    assert.equal(calls.length, 1)
    const c = calls[0]
    assert.equal(c.scope, 'project-42')            // a NEW private scope (region PRIVATE)
    assert.notEqual(c.scope, INBOX_SCOPE)          // does NOT reuse / move the inbox scope
    assert.notEqual(c.scope, 'public')             // and NOT public
    assert.equal(c.userId, 'u1')
    assert.equal(c.who, 'wearer')                  // you-initiated — the wearer's act

    // the re-ref points at the inbox row's EXACT Coord — a tie (a pointer), not a move
    assert.deepEqual(r.tieRef, { op: 'tie', target: { who: 'program', sc: 100, pos: 1 } })
    assert.equal(r.promotedSc, 100)
  })()
})
