// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (§FORK-A) + sprint-wire-economy R1
// [F-mcp/domain/__tests__/wire-turn.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-economy — the demanded `turn` door (one call, BOTH turns).
//   (A) THE DOOR (planToolCall, R1 pure, fail-closed):
//       - a malformed turn (missing replyMarks/priorMarks, or reply, or wearerText) is
//         rejected with a LAW-NAMING error;
//       - a well-formed turn plans the { wearerText, reply, replyMarks, priorMarks } intention.
//   (B) EXECUTION (the mcp-contract turn path, replicated with a DB-free recorder seam):
//       a well-formed turn LANDS BOTH turns AND its marks (present_marks-bound PlacedMarks);
//       scope is the STAMPED session.sessionId; a surface mismatch is rejected loud + atomic.
//   (A2.2) FAILURE-ORDERING: a committed write survives a post-write present-render failure
//         — the turn STILL STANDS and the response states the degradation truthfully.
//   (D) the lookup read control (R8) is unchanged — door + execution.
//   (F) SCOPE-SYMMETRY: a sent `scope` is rejected as an unknown field.
//   (G) READ-DOOR LAW: present + lookup ignore extras (no testimony to protect).
//
// Run: npx tsx --test src/features/F-mcp/domain/__tests__/wire-turn.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import { planToolCall } from '../tool-registry'

// R3-surface pieces (warmed so the F-memory R3 barrel resolves cleanly under tsx).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordScoredTurn: any, emissionFromStructured: any, MarkSurfaceError: any, wordCells: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let presentOrDegraded: any
let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  ;({ recordScoredTurn, emissionFromStructured, MarkSurfaceError } = await import('@/features/F-present/contract/present-contract'))
  ;({ wordCells } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
  ;({ presentOrDegraded } = await import('@/features/F-mcp/app/present-or-degraded'))
})

const WEARER = 'I toured Kyoto'
const REPLY = 'Kyoto truly rivals Tokyo.'
const goodArgs = () => ({
  wearerText: WEARER,
  reply: REPLY,
  replyMarks: [{ word: 1, surface: 'Kyoto', marks: [{ op: 'identity' }] }],
  priorMarks: [{ word: 3, surface: 'Kyoto', marks: [{ op: 'identity' }] }],
})

// ── (A) the demanded door ────────────────────────────────────────────────────────
test('malformed turn (no replyMarks/priorMarks) is rejected, law named', () => {
  const r = planToolCall('turn', { wearerText: 'hi', reply: 'yo' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /replyMarks and priorMarks/)
})

test('turn missing reply is rejected, §FORK-A named', () => {
  const r = planToolCall('turn', { wearerText: 'hi', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /requires reply/)
  assert.match(r.message, /§FORK-A/)
})

test('turn missing wearerText is rejected (one call carries both turns)', () => {
  const r = planToolCall('turn', { reply: 'yo', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /requires wearerText/)
})

test('well-formed turn plans the intention (mark arrays present, may be empty)', () => {
  const r = planToolCall('turn', { wearerText: 'hi there', reply: 'hello', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'turn', wearerText: 'hi there', reply: 'hello', replyMarks: [], priorMarks: [] })
})

// a DB-free recorder seam (mirrors the scored-turn-recorder test).
function stubDeps(replySc: number, wearerSc: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writes: any[] = []
  return {
    deps: {
      readTranscript: async () => [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeRawTurn: async (input: any) => { writes.push(input); return input.who === 'wearer' ? wearerSc : replySc },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store: { read: async () => [], place: async (_u: string, m: any[]) => { placed.push(...m) }, clear: async () => {} },
      cutReply: (r: string) => { const cells = cutCells(r); return { cells, wordCellPos: wordCells(cells).map((c: { pos: number }) => c.pos) } },
      cutCells,
    },
    placed,
    writes,
  }
}

// ── (B) execution — the turn path lands BOTH turns AND its marks ─────────────────
test('a well-formed turn lands both turns and its marks; scope is the stamped sessionId', async () => {
  const plan = planToolCall('turn', goodArgs())
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'turn') return

  // mirror the mcp-contract turn path: narrow through the gate, record with wearer={text}.
  const emission = emissionFromStructured({
    reply: plan.intention.reply, replyMarks: plan.intention.replyMarks, priorMarks: plan.intention.priorMarks,
  })
  const seam = stubDeps(12, 11)
  const recorded = await recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', { text: plan.intention.wearerText }, seam.deps)

  assert.equal(recorded.sc, 12)
  // both turns written: wearer THEN reply; scope stamped = sessionId, never sent.
  assert.equal(seam.writes.length, 2)
  assert.equal(seam.writes[0].who, 'wearer')
  assert.equal(seam.writes[0].scope, 'sess-1')
  assert.equal(seam.writes[1].who, 'llm')
  assert.equal(seam.writes[1].scope, 'sess-1')

  // both turns scored → 2 PlacedMarks (reply identity on llm:12 + prior identity on wearer:11).
  assert.equal(seam.placed.length, 2)
  const homes = seam.placed.map((p: { home: { who: string; sc: number } }) => `${p.home.who}:${p.home.sc}`)
  assert.ok(homes.includes('llm:12'), 'the reply mark homes on this turn (sc 12)')
  assert.ok(homes.includes('wearer:11'), 'the prior mark homes on the freshly-written wearer turn (sc 11)')
})

test('a turn whose mark surface mismatches is rejected loud + atomic (nothing written)', async () => {
  const plan = planToolCall('turn', {
    wearerText: WEARER, reply: REPLY,
    replyMarks: [{ word: 2, surface: 'rivals', marks: [{ op: 'identity' }] }],   // word 2 is "truly"
    priorMarks: [],
  })
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'turn') return
  const { wearerText, reply, replyMarks, priorMarks } = plan.intention
  const emission = emissionFromStructured({ reply, replyMarks, priorMarks })
  const seam = stubDeps(12, 11)
  await assert.rejects(
    () => recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', { text: wearerText }, seam.deps),
    (e: unknown) => e instanceof MarkSurfaceError,
  )
  assert.equal(seam.writes.length, 0, 'atomic — the loud rejection precedes every write')
})

// ── (A2.2) failure-ordering — drives the REAL R2 unit (present-or-degraded) ────────
// The turn door commits BOTH turns (proven above), THEN renders the present for its
// response. Failure-ordering is owned by the R2 unit presentOrDegraded: a present-render
// failure does NOT mask the committed write — the unit returns the named degraded payload.
// Here we drive that real unit with an injected readPresent seam (success then throw) and
// assert its actual returned value — no inline twin of the contract's logic.
const WIRE_BUNDLE = { transcript: false, forest: true, sheet: true } as const
test('A2.2: presentOrDegraded passes the present through on success; on render failure returns the named degraded payload', async () => {
  // success → the render passes straight through (no envelope).
  const ok = await presentOrDegraded('user-1', WIRE_BUNDLE, 12, { readPresent: async () => 'PRESENT-TEXT' })
  assert.equal(ok, 'PRESENT-TEXT', 'a successful render passes straight through')

  // failure → the committed turn STILL STANDS; the unit returns the named degraded payload.
  const out = await presentOrDegraded('user-1', WIRE_BUNDLE, 12, {
    readPresent: async () => { throw new Error('store offline') },
  })
  assert.ok(typeof out !== 'string', 'a render failure yields the degraded payload, not a present string')
  if (typeof out === 'string') return
  assert.equal(out.ok, true, 'the committed turn is reported as success, not failure')
  assert.equal(out.sc, 12, 'the committed turn position is carried back')
  assert.equal(out.present, null, 'present is null — render unavailable, stated not masked')
  assert.match(out.note, /turn recorded; present unavailable: store offline/)
})

// ── (E) extras gate — the turn is a WRITE door (FIX-2, carried) ───────────────────
test('turn: an unknown field is rejected, law named', () => {
  const r = planToolCall('turn', { ...goodArgs(), bogus: true })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "bogus"/)
  assert.match(r.message, /additionalProperties:false/)
})

// ── (F) scope-symmetry — scope is circumstance, not testimony ────────────────────
test('turn: a sent scope is rejected as an unknown field', () => {
  const r = planToolCall('turn', { ...goodArgs(), scope: 'proj-1' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "scope"/)
})

// ── (D) the lookup read control (R8) — the door (grid generalized) ────────────────
test('lookup turn: valid (who, sc) plans the selector intention', () => {
  const r = planToolCall('lookup', { kind: 'turn', who: 'wearer', sc: 7 })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'lookup', selector: { kind: 'turn', who: 'wearer', sc: 7 } })
})

test('lookup span / thing plan their selectors', () => {
  const span = planToolCall('lookup', { kind: 'span', from: 1, to: 9 })
  assert.equal(span.ok, true)
  if (span.ok) assert.deepEqual(span.intention, { tool: 'lookup', selector: { kind: 'span', from: 1, to: 9, who: undefined } })
  const thing = planToolCall('lookup', { kind: 'thing', name: 'Kyoto' })
  assert.equal(thing.ok, true)
  if (thing.ok) assert.deepEqual(thing.intention, { tool: 'lookup', selector: { kind: 'thing', name: 'Kyoto' } })
})

test('lookup: bad selectors are rejected, named', () => {
  assert.match((planToolCall('lookup', { kind: 'turn', who: 'program', sc: 7 }) as { message: string }).message, /who must be wearer \| llm/)
  assert.match((planToolCall('lookup', { kind: 'turn', who: 'llm', sc: 'x' }) as { message: string }).message, /sc must be a number/)
  assert.match((planToolCall('lookup', { kind: 'bogus' }) as { message: string }).message, /kind must be turn \| span \| thing/)
})

// ── (G) read-door law (RD) — reads ignore extras ──────────────────────────────────
test('present: extra lifecycle-envelope fields are ignored (read door succeeds)', () => {
  const r = planToolCall('present', { source: 'startup', session_id: 'x' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'present' })
})

test('lookup: selectors plus extra envelope fields succeed (read door ignores extras)', () => {
  const r = planToolCall('lookup', { kind: 'turn', who: 'wearer', sc: 7, source: 'startup', session_id: 'x' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'lookup', selector: { kind: 'turn', who: 'wearer', sc: 7 } })
})
