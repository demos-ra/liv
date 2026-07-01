// @liv-standard v1.5.2
// [F-forum/R3 · test]
// Built with LIV · livai.dev
//
// Pins the two outward surfaces:
//   - readForum → gather(public): F-forum asks for the public scope dial ({ kind:'public', reader })
//     — the keystone scope-clause public branch — through the INJECTED gather port, re-gating nothing.
//   - publishToForum PHASE ONE: confirmed falsy → the wearer confirm, surfaced WITHOUT reaching the
//     compose (no substrate, no recordWireTurn — the confirm is decided before any write).
//   - readForumNetwork → readForum + the parsed outbound EDGE: each public node paired with the Coord
//     its leading ref handle points at (or null), so the network is walkable from gather(public) alone.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { readForum, readForumNetwork, publishToForum, type ForumReadPort } from '../forum-contract'
import { FORUM_PUBLISH_PROMPT } from '../../config/forum-types'
import { buildForumRef } from '../../domain/forum-logic'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import type { PerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'

test('readForum asks gather for the public scope dial (the cross-author forum feed)', async () => {
  const seen: unknown[] = []
  const feed: RawTurn[] = [{ sc: 1, who: 'wearer', words: [{ pos: 1, word: 'a public post' }], scope: 'public' }]
  const fakeGather: ForumReadPort = async (scope) => {
    seen.push(scope)
    return feed
  }

  const out = await readForum('reader-1', fakeGather)

  // the dial is the public branch, carrying the session user as reader (for the inherited read-admit).
  assert.equal(seen.length, 1)
  assert.deepEqual(seen[0], { kind: 'public', reader: 'reader-1' })
  // the forum feed is whatever gather returns — F-forum re-shapes nothing, re-gates nothing.
  assert.deepEqual(out, feed)
})

test('publishToForum phase one returns the wearer confirm without composing (no substrate reached)', async () => {
  // a minimal session slice — phase one never reads userId/grantKey into a compose, so a stub suffices.
  const session = { userId: 'u-1', grantKey: 'free' } as unknown as PerimeterSession
  const draft = { wearerText: 'w', reply: 'going public', replyMarks: [], priorMarks: [], target: { who: 'wearer' as const, sc: 2, pos: 1 } }

  const out = await publishToForum(session, draft /* confirmed omitted → phase one */)

  assert.deepEqual(out, { kind: 'confirm-required', payload: FORUM_PUBLISH_PROMPT })
})

test('readForumNetwork pairs each public node with its parsed outbound edge (the walkable graph)', async () => {
  const parent = buildForumRef({ who: 'wearer', sc: 7, pos: 3 })
  // node A replies to (wearer,7,3) — its leading word is the ref handle; node B carries no ref.
  const feed: RawTurn[] = [
    { sc: 9, who: 'llm', words: [{ pos: 1, word: parent }, { pos: 2, word: ' ' }, { pos: 3, word: 'a reply' }], scope: 'public' },
    { sc: 4, who: 'wearer', words: [{ pos: 1, word: 'no ref here' }], scope: 'public' },
  ]
  const fakeGather: ForumReadPort = async () => feed

  const net = await readForumNetwork('reader-1', fakeGather)

  // the network is nodes-with-their-edge: node carried through unchanged, edge parsed from the words.
  assert.equal(net.length, 2)
  assert.deepEqual(net[0].node, feed[0])
  assert.deepEqual(net[0].ref, { who: 'wearer', sc: 7, pos: 3 })   // the outbound edge, decoded
  assert.deepEqual(net[1].node, feed[1])
  assert.equal(net[1].ref, null)                                   // no ref word → null edge
})
