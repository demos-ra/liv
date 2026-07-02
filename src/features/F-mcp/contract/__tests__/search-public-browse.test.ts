// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (the look·public fork)
// [F-mcp/contract/__tests__/search-public-browse.test.ts]
// Built with LIV · livai.dev
//
// The WIRE composition at the F-mcp R3 door — two verbs × two scopes:
//   (A) look·public — search scope:'public' turns the SAME verb outward: the forum browse
//       (readForumNetwork + renderForumThreads, F-forum's) rendered to indented thread text.
//       Here we pin the PURE render (renderForumBrowse) against synthetic boards folded by the
//       REAL renderForumThreads — so the wire's presentation is exact, and focus scopes a subtree.
//   (B) write·public — publish now ADMITS `target` (the reply parent's URN): the write door's
//       PUBLISH_ARGS allow-list carries it, so it plans instead of bouncing as an unknown field.
//   (C) the masking catch is OBSERVABLE — a thrown handler LOGS server-side, yet the client still
//       receives the same non-leaky internal-error envelope (no detail crosses the wire).
//
// Run: npx tsx --test src/features/F-mcp/contract/__tests__/search-public-browse.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { planToolCall } from '../../domain/tool-registry'
import { PUBLISH_ARGS } from '../../config/mcp-tools'
import { renderForumBrowse, handleMcpRequest } from '../mcp-contract'
import { renderForumThreads } from '@/features/F-forum/contract/forum-contract'
import type { ForumNode } from '@/features/F-forum/contract/forum-contract'

// ── synthetic public network: a top post + one reply nested under it ──────────────────
// A ForumNode is { node: RawTurn; ref }. renderForumThreads addresses each node at
// urn:liv:${who}.${sc}.${words[0].pos}; the reply's ref points at the top post's URN.
const TOP: ForumNode = {
  node: { sc: 5, who: 'wearer', words: [{ pos: 0, word: 'Hello forum' }] },
  ref: 'root',
}
const REPLY: ForumNode = {
  node: { sc: 8, who: 'llm', words: [{ pos: 0, word: 'A reply' }] },
  ref: { who: 'wearer', sc: 5, pos: 0 },   // targets urn:liv:wearer.5.0 (the top post)
}

// ── (A) look·public: the browse renders boards → indented threads, node words + own URN ──
test('renderForumBrowse: boards render as indented threads (node words + [urn], children +2 spaces)', () => {
  const boards = renderForumThreads([TOP, REPLY])
  const text = renderForumBrowse(boards)
  assert.equal(text, [
    '# urn:liv:forum',
    '- Hello forum  [urn:liv:wearer.5.0]',
    '  - A reply  [urn:liv:llm.8.0]',
  ].join('\n'))
})

test('renderForumBrowse: focus opens ONE thread\'s subtree (the top post + its replies, no board header)', () => {
  const boards = renderForumThreads([TOP, REPLY])
  const text = renderForumBrowse(boards, 'urn:liv:wearer.5.0')
  assert.equal(text, [
    '- Hello forum  [urn:liv:wearer.5.0]',
    '  - A reply  [urn:liv:llm.8.0]',
  ].join('\n'))
})

test('renderForumBrowse: focus on a leaf reply scopes to just that node', () => {
  const boards = renderForumThreads([TOP, REPLY])
  assert.equal(renderForumBrowse(boards, 'urn:liv:llm.8.0'), '- A reply  [urn:liv:llm.8.0]')
})

test('renderForumBrowse: an empty forum is STATED, never blank', () => {
  assert.equal(renderForumBrowse([]), 'The forum is empty — nothing published yet.')
})

test('renderForumBrowse: a focus miss is stated plainly (never thrown)', () => {
  const boards = renderForumThreads([TOP, REPLY])
  assert.equal(renderForumBrowse(boards, 'urn:liv:nobody.9.9'), 'No forum thread found at urn:liv:nobody.9.9.')
})

// ── (A′) the door carries scope/focus through in `raw` (read door — transport, extras ride) ──
test('search: scope/focus ride through the read door in raw (no rejection — a read carries no testimony)', () => {
  const args = { scope: 'public', focus: 'urn:liv:wearer.5.0' }
  const r = planToolCall('search', args)
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'lookup') return
  assert.deepEqual(r.intention, { tool: 'lookup', raw: args })
})

// ── (B) write·public: publish now ADMITS target (previously an unknown-field rejection) ──
test('PUBLISH_ARGS carries target (the write-door allow-list admits the reply parent URN)', () => {
  assert.ok(PUBLISH_ARGS.includes('target'), 'the publish door admits target')
})

test('publish plans with target threaded (a real reply parent URN), not bounced as an extra', () => {
  const r = planToolCall('publish', {
    wearerText: 'hi', reply: 'yo', replyMarks: [], priorMarks: [],
    target: 'urn:liv:wearer.3.0', confirmed: true,
  })
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'publish') return
  assert.equal(r.intention.target, 'urn:liv:wearer.3.0', 'the model-supplied reply target threads through')
  assert.equal(r.intention.confirmed, true)
})

test('publish STILL rejects a truly-foreign field (write-door law preserved — extras demanded)', () => {
  const r = planToolCall('publish', {
    wearerText: 'hi', reply: 'yo', replyMarks: [], priorMarks: [], target: 'urn:liv:forum', bogus: 1,
  })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "bogus"/)
})

// ── (C) the masking catch is OBSERVABLE — logs server-side, non-leaky to the client ──
test('a thrown handler is LOGGED server-side yet returns the same non-leaky internal-error envelope', async () => {
  const calls: unknown[][] = []
  const orig = console.error
  console.error = (...a: unknown[]) => { calls.push(a) }
  try {
    // session=null → the present branch throws on session.userId (no DB touched); the throw is
    // inside the try, so the catch fires: it logs, then returns the generic internal error.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res: any = await handleMcpRequest(
      { jsonrpc: '2.0', id: 7, method: 'tools/call', params: { name: 'summary', arguments: {} } },
      null as never,
    )
    assert.ok(res.error, 'the client receives an error envelope')
    assert.equal(res.error.code, -32603, 'JSON-RPC internal error')
    assert.equal(res.error.message, 'internal error', 'no internal detail leaks to the client')
    assert.equal(calls.length, 1, 'the failure was logged server-side (not swallowed)')
    assert.match(String(calls[0][0]), /handler threw for method "tools\/call"/, 'the log names the method')
  } finally {
    console.error = orig
  }
})
