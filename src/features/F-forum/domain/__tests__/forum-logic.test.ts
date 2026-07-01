// @liv-standard v1.5.2
// [F-forum/R1 · test]
// Built with LIV · livai.dev
//
// Pins the forum reference format — the completing half. build/parse are pure inverses over the ONE
// scheme, AND the built handle survives the substrate cutter (cutCells) as a SINGLE word-cell — the
// load-bearing invariant that lets the ref ride as content through recordWireTurn and come back
// parseable per-word from readForum. If the handle fragmented under the cut (as a bare `forumref://`
// would), parseForumRef(word) could never re-read it; this test is the guard against that regression.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildForumRef, parseForumRef } from '../forum-logic'
import { FORUM_ROOT } from '../../config/forum-types'
import { cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { Coord } from '@/core/types/substrate-raw.types'

const cases: Coord[] = [
  { who: 'wearer', sc: 7, pos: 3 },
  { who: 'llm', sc: 12, pos: 340 },
  { who: 'program', sc: 0, pos: 0 },   // the shape of FORUM_ROOT
  FORUM_ROOT,
]

test('build → parse round-trips every Coord (symmetric encode/decode)', () => {
  for (const c of cases) {
    assert.deepEqual(parseForumRef(buildForumRef(c)), c)
  }
})

test('the built handle survives cutCells as ONE word-cell (rides as a single RawWord)', () => {
  for (const c of cases) {
    const handle = buildForumRef(c)
    const cells = cutCells(handle)
    // exactly one cell, byte-identical to the handle — no `://` fragmentation.
    assert.equal(cells.length, 1)
    assert.equal(cells[0].word, handle)
    // and it still parses after the round-trip through the cut.
    assert.deepEqual(parseForumRef(cells[0].word), c)
  }
})

test('the handle survives the cut even when it LEADS a body (publish prepends it ahead of the body)', () => {
  const handle = buildForumRef({ who: 'wearer', sc: 7, pos: 3 })
  const cells = cutCells(`${handle} the reply body`)
  // the leading cell is the whole handle; the body follows as its own cells.
  assert.equal(cells[0].word, handle)
  assert.deepEqual(parseForumRef(cells[0].word), { who: 'wearer', sc: 7, pos: 3 })
})

test('parseForumRef returns null for anything that is not a well-formed ref', () => {
  assert.equal(parseForumRef('hello'), null)                    // a plain body word
  assert.equal(parseForumRef('forumref:wearer.5'), null)        // too few coordinates
  assert.equal(parseForumRef('forumref:wearer.5.2.9'), null)    // too many
  assert.equal(parseForumRef('forumref:ghost.5.2'), null)       // unknown author
  assert.equal(parseForumRef('forumref:wearer.x.2'), null)      // non-integer sc
  assert.equal(parseForumRef('forumref:wearer..2'), null)       // empty field (Number('') is 0 — \d+ rejects)
  assert.equal(parseForumRef('livbyte://abc'), null)            // a different scheme
})
