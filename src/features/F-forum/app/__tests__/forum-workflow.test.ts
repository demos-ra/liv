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
import { FORUM_PUBLISH_PROMPT, FORUM_ROOT_URN, FORUM_CONFIRMED_URN } from '../../config/forum-types'
import { buildForumRef, parseForumRef, parseForumMotivation } from '../../domain/forum-logic'
import { PUBLIC_SCOPE, cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { WireTurnInput, WireTurnIdentity } from '@/features/F-present/contract/present-contract'

const authority: PublishAuthority = { userId: 'u-1', grantKey: 'free' }
// a reply draft: the required target is a parent forum payload's coordinate URN (the model supplies it).
const draft: ForumDraft = { wearerText: 'w', reply: 'hello forum', replyMarks: [], priorMarks: [], target: buildForumRef({ who: 'wearer', sc: 7, pos: 3 }) }

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

  // the REQUIRED ref rides as the payload's LEADING content, ahead of the body — the completing half —
  // and the recorded 'confirmed' motivation TRAILS it (the un-weld: consent stamped as auditable data).
  // the target is ALREADY the handle (the URN string the model supplies) — prepended verbatim.
  const handle = draft.target
  assert.equal(calls[0].input.reply, `${handle} hello forum ${FORUM_CONFIRMED_URN}`)
  // target is CONSUMED here — it is not a compose field; the body's marking rides through untouched.
  assert.deepEqual(calls[0].input.replyMarks, [])
  assert.deepEqual(calls[0].input.priorMarks, [])
  assert.equal(calls[0].input.wearerText, 'w')
  assert.equal('target' in (calls[0].input as Record<string, unknown>), false)

  // the workflow returns the compose port's WireTurnOutcome straight through.
  assert.deepEqual(out, { kind: 'present', present: 'fresh-present' })
})

test('a top post (target = FORUM_ROOT_URN) prepends the root resource URN as leading content', async () => {
  const { port, calls } = spyCompose()
  const rootDraft: ForumDraft = { wearerText: 'w', reply: 'a top post', replyMarks: [], priorMarks: [], target: FORUM_ROOT_URN }

  await publishToForum(authority, rootDraft, true, PUBLIC_SCOPE, port)

  assert.equal(calls[0].input.reply, `${FORUM_ROOT_URN} a top post ${FORUM_CONFIRMED_URN}`)
  // the leading cell survives the cutter as ONE word and decodes back to the root marker (a top post).
  const cells = cutCells(calls[0].input.reply as string)
  assert.equal(cells[0].word, FORUM_ROOT_URN)
  assert.equal(parseForumRef(cells[0].word), 'root')
})

test('phase two RECORDS the confirm: the payload trails the reserved confirmed motivation as its own word-cell', async () => {
  const { port, calls } = spyCompose()

  await publishToForum(authority, draft, true, PUBLIC_SCOPE, port)

  // the un-weld: the wearer's OK is DATA in the memory, not a vanished flag. The confirmed marker rides
  // as the payload's TRAILING word-cell — one append, no new store/field — and survives the cutter whole.
  const cells = cutCells(calls[0].input.reply as string)
  const last = cells[cells.length - 1]
  assert.equal(last.word, FORUM_CONFIRMED_URN)
  assert.equal(parseForumMotivation(last.word), 'confirmed')   // the auditable consent, read back
  // the leading target edge is UNTOUCHED by the trailing motivation — non-overlapping decoders.
  assert.deepEqual(parseForumRef(cells[0].word), { who: 'wearer', sc: 7, pos: 3 })
  assert.equal(parseForumMotivation(cells[0].word), null)      // the target is not a motivation
  assert.equal(parseForumRef(last.word), null)                 // the motivation is not a target edge
})

test('a body-less draft still records the confirm: [target-cell, confirmed-cell], no empty body word', async () => {
  const { port, calls } = spyCompose()
  const bodyless: ForumDraft = { wearerText: 'w', reply: '', replyMarks: [], priorMarks: [], target: FORUM_ROOT_URN }

  await publishToForum(authority, bodyless, true, PUBLIC_SCOPE, port)

  assert.equal(calls[0].input.reply, `${FORUM_ROOT_URN} ${FORUM_CONFIRMED_URN}`)
  // no empty body word: the payload is just the target cell then the confirmed cell (the cutter also
  // emits the separating space as its own cell, so length > 2 — the load-bearing facts are the edges).
  const cells = cutCells(calls[0].input.reply as string)
  assert.equal(parseForumRef(cells[0].word), 'root')                          // leading target edge
  assert.equal(parseForumMotivation(cells[cells.length - 1].word), 'confirmed') // trailing consent
})

test('an explicit coordinate-URN target is prepended as the leading word and survives the cutter as ONE cell', async () => {
  const { port, calls } = spyCompose()

  await publishToForum(authority, draft, true, PUBLIC_SCOPE, port)

  // the prepended reply cut into cells — the leading cell is the whole coordinate URN, unfragmented,
  // and decodes back to the parent Coord (the reply edge is walkable from the public words alone).
  const cells = cutCells(calls[0].input.reply as string)
  assert.equal(cells[0].word, draft.target)
  assert.deepEqual(parseForumRef(cells[0].word), { who: 'wearer', sc: 7, pos: 3 })
})

test('the compose port outcome is relayed unchanged (locked / degraded / invalid-testimony pass through)', async () => {
  const lockedPort: ForumComposePort = async () => ({ kind: 'locked', locked: { status: 'locked', region: 'PUBLIC', cta: 'cta-text', relay: true } })
  const out = await publishToForum(authority, draft, true, PUBLIC_SCOPE, lockedPort)
  assert.equal(out.kind, 'locked')
})
