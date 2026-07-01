// @liv-standard v1.5.2
// [F-forum/R2 · test]
// Built with LIV · livai.dev
//
// Pins the publish two-phase confirm + the compose-port DI seam. publishToForum AUTHORS NOTHING — it
// calls the INJECTED compose port (recordWireTurn's exact shape) stamped with the PUBLIC scope. A spy
// port captures exactly what the workflow handed the compose, WITHOUT the cognition graph:
//   - phase one (confirmed falsy) surfaces the confirm prompt and NEVER reaches the port;
//   - phase two (confirmed true) hands the draft through, stamped PUBLIC_SCOPE.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { publishToForum, type PublishAuthority, type ForumComposePort, type ForumDraft } from '../forum-workflow'
import { FORUM_PUBLISH_PROMPT, FORUM_ROOT } from '../../config/forum-types'
import { buildForumRef } from '../../domain/forum-logic'
import { PUBLIC_SCOPE } from '@/features/F-memory/contract/substrate-contract'
import type { WireTurnInput, WireTurnIdentity } from '@/features/F-present/contract/present-contract'

const authority: PublishAuthority = { userId: 'u-1', grantKey: 'free' }
// a reply draft: the required target is a parent forum payload's Coord.
const draft: ForumDraft = { wearerText: 'w', reply: 'hello forum', replyMarks: [], priorMarks: [], target: { who: 'wearer', sc: 7, pos: 3 } }

// A spy compose port — records each call and returns a fixed 'present' outcome.
function spyCompose() {
  const calls: Array<{ input: WireTurnInput; identity: WireTurnIdentity }> = []
  const port: ForumComposePort = async (input, identity) => {
    calls.push({ input, identity })
    return { kind: 'present', present: 'fresh-present' }
  }
  return { port, calls }
}

test('phase one (confirmed absent) surfaces the confirm prompt and NEVER reaches the compose port', async () => {
  const { port, calls } = spyCompose()

  const out = await publishToForum(authority, draft, undefined, PUBLIC_SCOPE, port)

  assert.deepEqual(out, { kind: 'confirm-required', payload: FORUM_PUBLISH_PROMPT })
  assert.equal(calls.length, 0)   // phase one writes NOTHING
})

test('phase one (confirmed:false) is identical — still no compose', async () => {
  const { port, calls } = spyCompose()
  const out = await publishToForum(authority, draft, false, PUBLIC_SCOPE, port)
  assert.equal(out.kind, 'confirm-required')
  assert.equal(calls.length, 0)
})

test('phase two (confirmed:true) prepends the target ref, composes stamped PUBLIC, returns the outcome', async () => {
  const { port, calls } = spyCompose()

  const out = await publishToForum(authority, draft, true, PUBLIC_SCOPE, port)

  // exactly one compose, stamped the PUBLIC scope, carrying the author's id + grant (NOT a connection scope).
  assert.equal(calls.length, 1)
  assert.equal(calls[0].identity.scope, PUBLIC_SCOPE)   // the ONE reserved cross-author scope
  assert.equal(calls[0].identity.userId, 'u-1')         // the author's OWN substrate
  assert.equal(calls[0].identity.grantKey, 'free')      // perimeter-resolved key, handed down

  // the REQUIRED ref rides as the payload's LEADING content, ahead of the body — the completing half.
  const handle = buildForumRef(draft.target)
  assert.equal(calls[0].input.reply, `${handle} hello forum`)
  // target is CONSUMED here — it is not a compose field; the body's marking rides through untouched.
  assert.deepEqual(calls[0].input.replyMarks, [])
  assert.deepEqual(calls[0].input.priorMarks, [])
  assert.equal(calls[0].input.wearerText, 'w')
  assert.equal('target' in (calls[0].input as Record<string, unknown>), false)

  // the workflow returns the compose port's WireTurnOutcome straight through.
  assert.deepEqual(out, { kind: 'present', present: 'fresh-present' })
})

test('a root post (target = FORUM_ROOT) prepends the root marker ref as leading content', async () => {
  const { port, calls } = spyCompose()
  const rootDraft: ForumDraft = { wearerText: 'w', reply: 'a top post', replyMarks: [], priorMarks: [], target: FORUM_ROOT }

  await publishToForum(authority, rootDraft, true, PUBLIC_SCOPE, port)

  assert.equal(calls[0].input.reply, `${buildForumRef(FORUM_ROOT)} a top post`)
})

test('the compose port outcome is relayed unchanged (locked / degraded / invalid-testimony pass through)', async () => {
  const lockedPort: ForumComposePort = async () => ({ kind: 'locked', locked: { status: 'locked', region: 'PUBLIC', cta: 'cta-text', relay: true } })
  const out = await publishToForum(authority, draft, true, PUBLIC_SCOPE, lockedPort)
  assert.equal(out.kind, 'locked')
})
