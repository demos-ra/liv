// @liv-standard v1.5.2
// [F-forum/R1 · test]
// Built with LIV · livai.dev
//
// Pins the forum reference format — the URN codec (RFC 8141), the completing half. build/parse of a
// coordinate URN are pure inverses over the ONE scheme, AND the built handle survives the substrate
// cutter (cutCells) as a SINGLE word-cell — the load-bearing invariant that lets the ref ride as
// content through recordWireTurn and come back parseable per-word from readForum. If the handle
// fragmented under the cut (as a URL form with slashes would), parseForumRef(word) could never re-read
// it; this test is the guard against that regression. The reserved root resource URN decodes to 'root'.

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildForumRef, parseForumRef, buildConfirmedRef, parseForumMotivation, renderForumThreads } from '../forum-logic'
import { FORUM_ROOT_URN, FORUM_CONFIRMED_URN } from '../../config/forum-types'
import type { ForumNode } from '../../config/forum-types'
import { cutCells } from '@/features/F-memory/contract/substrate-contract'
import type { Coord, RawTurn } from '@/core/types/substrate-raw.types'

const cases: Coord[] = [
  { who: 'wearer', sc: 7, pos: 3 },
  { who: 'llm', sc: 12, pos: 340 },
  { who: 'program', sc: 0, pos: 0 },
]

test('build → parse round-trips every coordinate URN (symmetric encode/decode)', () => {
  for (const c of cases) {
    assert.deepEqual(parseForumRef(buildForumRef(c)), c)
  }
})

test('the built coordinate URN is the urn:liv: form (RFC 8141, dotted triple)', () => {
  assert.equal(buildForumRef({ who: 'wearer', sc: 5, pos: 12 }), 'urn:liv:wearer.5.12')
})

test('the root resource URN decodes to the root marker (a top post\'s target)', () => {
  assert.equal(parseForumRef(FORUM_ROOT_URN), 'root')
  assert.equal(FORUM_ROOT_URN, 'urn:liv:forum')
})

test('the built handle survives cutCells as ONE word-cell (rides as a single RawWord)', () => {
  for (const c of cases) {
    const handle = buildForumRef(c)
    const cells = cutCells(handle)
    // exactly one cell, byte-identical to the handle — no slash fragmentation.
    assert.equal(cells.length, 1)
    assert.equal(cells[0].word, handle)
    // and it still parses after the round-trip through the cut.
    assert.deepEqual(parseForumRef(cells[0].word), c)
  }
})

test('the root resource URN also survives the cut as ONE cell and decodes to root', () => {
  const cells = cutCells(FORUM_ROOT_URN)
  assert.equal(cells.length, 1)
  assert.equal(cells[0].word, FORUM_ROOT_URN)
  assert.equal(parseForumRef(cells[0].word), 'root')
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
  assert.equal(parseForumRef('urn:liv:wearer.5'), null)         // too few coordinates
  assert.equal(parseForumRef('urn:liv:wearer.5.2.9'), null)     // too many
  assert.equal(parseForumRef('urn:liv:ghost.5.2'), null)        // unknown author
  assert.equal(parseForumRef('urn:liv:wearer.x.2'), null)       // non-integer sc
  assert.equal(parseForumRef('urn:liv:wearer..2'), null)        // empty field (Number('') is 0 — \d+ rejects)
  assert.equal(parseForumRef('livbyte://abc'), null)            // a different scheme
})

// ── THE CONFIRMED MOTIVATION — the un-weld: recorded consent, not a throwaway boolean ──────────────

test('confirmed motivation build → parse round-trips (the reserved marker, over the ONE scheme)', () => {
  assert.equal(buildConfirmedRef(), FORUM_CONFIRMED_URN)
  assert.equal(buildConfirmedRef(), 'urn:liv:confirmed')
  assert.equal(parseForumMotivation(buildConfirmedRef()), 'confirmed')
})

test('the confirmed marker survives cutCells as ONE word-cell (rides as a single RawWord, like the target)', () => {
  const cells = cutCells(buildConfirmedRef())
  assert.equal(cells.length, 1)
  assert.equal(cells[0].word, FORUM_CONFIRMED_URN)
  assert.equal(parseForumMotivation(cells[0].word), 'confirmed')
})

test('target and motivation are DISTINCT slots — neither decoder reads the other', () => {
  // parseForumRef (target/reply edge) returns null for the confirmed marker — it is not an edge.
  assert.equal(parseForumRef(FORUM_CONFIRMED_URN), null)
  // parseForumMotivation returns null for a target URN, the root board, and a body word — not motivations.
  assert.equal(parseForumMotivation(buildForumRef({ who: 'wearer', sc: 5, pos: 12 })), null)
  assert.equal(parseForumMotivation(FORUM_ROOT_URN), null)
  assert.equal(parseForumMotivation('hello'), null)
})

// ── THE FORUM THREAD RENDERER — generic + recursive, deterministic + pure ──────────────────────────

// helper: a public node with a single leading word at pos 0 (nodeUrnOf anchors on the leading word).
const node = (who: RawTurn['who'], sc: number, word: string): RawTurn => ({ sc, who, words: [{ pos: 0, word }], scope: 'public' })

test('renderForumThreads nests replies under their target recursively (a walkable thread under the board)', () => {
  // A (top, → root) ← B (reply → A) ← C (reply → B). Each node's own URN is its leading-word coordinate.
  const a = node('wearer', 1, 'top post')
  const b = node('llm', 2, 'first reply')
  const c = node('wearer', 3, 'nested reply')
  const net: ForumNode[] = [
    { node: a, ref: 'root' },                       // A targets the reserved root board
    { node: b, ref: { who: 'wearer', sc: 1, pos: 0 } }, // B targets A's URN
    { node: c, ref: { who: 'llm', sc: 2, pos: 0 } },    // C targets B's URN
  ]

  const boards = renderForumThreads(net)

  // one board (the reserved root), one top thread (A), B nested under A, C nested under B — recursive.
  assert.equal(boards.length, 1)
  assert.equal(boards[0].board, FORUM_ROOT_URN)
  assert.equal(boards[0].threads.length, 1)
  const threadA = boards[0].threads[0]
  assert.deepEqual(threadA.node, a)
  assert.equal(threadA.urn, 'urn:liv:wearer.1.0')
  assert.equal(threadA.children.length, 1)
  assert.deepEqual(threadA.children[0].node, b)
  assert.equal(threadA.children[0].children.length, 1)
  assert.deepEqual(threadA.children[0].children[0].node, c)
})

test('a FUTURE board needs no renderer change — any target URN owned by no node becomes its own board', () => {
  // Two top posts targeting two DIFFERENT boards: the reserved root, and a target URN owned by no loaded
  // node (standing in for a future reserved subboard URN — once its edge decodes upstream it rides here
  // untouched). The renderer buckets each under its own board key with ZERO code change — boards are
  // just target URNs owned by no node.
  const p = node('wearer', 1, 'on the root board')
  const q = node('llm', 2, 'on another board')
  const subboard = { who: 'program' as const, sc: 99, pos: 0 }   // an unowned target URN → a board key
  const net: ForumNode[] = [
    { node: p, ref: 'root' },
    { node: q, ref: subboard },
  ]

  const boards = renderForumThreads(net)

  assert.equal(boards.length, 2)
  assert.equal(boards[0].board, FORUM_ROOT_URN)
  assert.deepEqual(boards[0].threads[0].node, p)
  assert.equal(boards[1].board, buildForumRef(subboard))   // urn:liv:program.99.0 — bucketed generically
  assert.deepEqual(boards[1].threads[0].node, q)
})

test('nesting is order-independent — a reply read BEFORE its parent still nests (pure two-pass fold)', () => {
  const parent = node('wearer', 1, 'parent')
  const child = node('llm', 2, 'child')
  const net: ForumNode[] = [
    { node: child, ref: { who: 'wearer', sc: 1, pos: 0 } },  // child first
    { node: parent, ref: 'root' },                            // parent second
  ]

  const boards = renderForumThreads(net)

  assert.equal(boards.length, 1)
  assert.equal(boards[0].threads.length, 1)
  assert.deepEqual(boards[0].threads[0].node, parent)
  assert.deepEqual(boards[0].threads[0].children[0].node, child)
})

test('a ref-less payload roots under the default root board (no node dropped)', () => {
  const orphan = node('wearer', 1, 'pre-standard public turn, no ref')
  const boards = renderForumThreads([{ node: orphan, ref: null }])
  assert.equal(boards.length, 1)
  assert.equal(boards[0].board, FORUM_ROOT_URN)
  assert.deepEqual(boards[0].threads[0].node, orphan)
})

test('renderForumThreads is deterministic and pure (same input → deep-equal output, input untouched)', () => {
  const net: ForumNode[] = [
    { node: node('wearer', 1, 'a'), ref: 'root' },
    { node: node('llm', 2, 'b'), ref: { who: 'wearer', sc: 1, pos: 0 } },
  ]
  const snapshot = JSON.parse(JSON.stringify(net))
  assert.deepEqual(renderForumThreads(net), renderForumThreads(net))
  assert.deepEqual(net, snapshot)   // the input is not mutated
})
