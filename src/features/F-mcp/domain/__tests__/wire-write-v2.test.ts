// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (§FORK-A)
// [F-mcp/domain/__tests__/wire-write-v2.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 4 — wire write v2 (the demanded door).
//   (A) THE DOOR (planToolCall, R1 pure, fail-closed):
//       - a malformed llm write (missing replyMarks/priorMarks) is rejected with a
//         LAW-NAMING error (§FORK-A);
//       - a program write is rejected with a law-naming error (§no-server-side-marking);
//       - a well-formed llm write plans the §FORK-A intention;
//       - a wearer write plans the words-only intention.
//   (B) EXECUTION (the mcp-contract llm path, replicated with a DB-free recorder seam):
//       a well-formed llm write LANDS the turn AND its marks (present_marks-bound
//       PlacedMarks), and the response carries cells matching cutCells.
//   (C) the wearer path is words-only; its response cells match cutCells(text).
//   (F) SCOPE-SYMMETRY: scope is circumstance, not testimony — a turn that sends scope
//       is rejected as an unknown field (both shapes); the door stamps scope =
//       session.sessionId (white-box via the recorder seam).
//
// Run: npx tsx --test src/features/F-mcp/domain/__tests__/wire-write-v2.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import { planToolCall } from '../tool-registry'

// R3-surface pieces (warmed so the F-memory R3 barrel resolves cleanly under tsx).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordScoredTurn: any, emissionFromStructured: any
let cutCells: (t: string) => { pos: number; word: string }[]
let cutReply: (r: string) => { cells: { pos: number; word: string }[]; wordCellPos: number[] }

before(async () => {
  ;({ recordScoredTurn, emissionFromStructured } = await import('@/features/F-present/contract/present-contract'))
  ;({ cutReply } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// ── (A) the demanded door ────────────────────────────────────────────────────────
test('malformed llm write (no replyMarks/priorMarks) is rejected, law named', () => {
  const r = planToolCall('write', { who: 'llm', reply: 'hi' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /replyMarks and priorMarks/)
  assert.match(r.message, /§FORK-A/)
})

test('llm write missing reply is rejected, §FORK-A named', () => {
  const r = planToolCall('write', { who: 'llm', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /requires reply/)
  assert.match(r.message, /§FORK-A/)
})

test('program write is rejected at v2 with a law-naming message', () => {
  const r = planToolCall('write', { who: 'program', text: 'x' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /no program writer over the wire/)
  assert.match(r.message, /§no-server-side-marking/)
})

test('well-formed llm write plans the §FORK-A intention (arrays present, may be empty)', () => {
  const r = planToolCall('write', { who: 'llm', reply: 'hello', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'write', who: 'llm', reply: 'hello', replyMarks: [], priorMarks: [] })
})

test('wearer write plans the words-only intention', () => {
  const r = planToolCall('write', { who: 'wearer', text: 'I toured Kyoto' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'write', who: 'wearer', text: 'I toured Kyoto' })
})

// a DB-free recorder seam (mirrors the scored-turn-recorder test). `writes` captures the
// writeRawTurn input so the stamped-scope path is white-box-assertable.
function stubDeps(sc: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writes: any[] = []
  return {
    deps: {
      readTranscript: async () => [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeRawTurn: async (input: any) => { writes.push(input); return sc },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store: { read: async () => [], place: async (_u: string, m: any[]) => { placed.push(...m) }, clear: async () => {} },
      cutReply,                                            // the real canonical cutter
    },
    placed,
    writes,
  }
}

// ── (B) execution — the llm path lands the turn AND its marks ───────────────────
test('a well-formed llm write lands the turn and its marks; response cells match cutCells', async () => {
  const reply = 'Kyoto truly rivals Tokyo.'
  const args = {
    who: 'llm', reply,
    replyMarks: [{ word: 1, marks: [{ op: 'identity' }] }],          // mark on the reply
    priorMarks: [{ home: { who: 'wearer', sc: 3, pos: 1 }, marks: [{ op: 'identity' }] }], // mark on the person
  }
  const plan = planToolCall('write', args)
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'write' || plan.intention.who !== 'llm') return

  // the mcp-contract llm path: narrow through emissionFromStructured (the gate), record.
  // scope is the STAMPED session.sessionId, never a sent field.
  const emission = emissionFromStructured({
    reply: plan.intention.reply, replyMarks: plan.intention.replyMarks, priorMarks: plan.intention.priorMarks,
  })
  const seam = stubDeps(11)
  const recorded = await recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', seam.deps)

  // response shape the wire returns: { ok, sc, cells:[{pos,word}] }
  const response = { ok: true, sc: recorded.sc, cells: recorded.cells.map((c: { pos: number; word: string }) => ({ pos: c.pos, word: c.word })) }
  assert.equal(response.sc, 11)
  assert.deepEqual(response.cells, cutCells(reply).map(c => ({ pos: c.pos, word: c.word })))

  // both turns scored → 2 present_marks-bound PlacedMarks (reply identity + prior identity).
  assert.equal(seam.placed.length, 2)
  const homes = seam.placed.map((p: { home: { who: string; sc: number } }) => `${p.home.who}:${p.home.sc}`)
  assert.ok(homes.includes('llm:11'), 'the reply mark homes on this turn (sc 11)')
  assert.ok(homes.includes('wearer:3'), 'the prior mark homes on the person’s existing cell')
})

// ── (C) execution — the wearer path is words-only ───────────────────────────────
test('the wearer path is words-only; response cells match cutCells(text)', () => {
  const text = 'I toured Kyoto'
  const plan = planToolCall('write', { who: 'wearer', text })
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'write' || plan.intention.who !== 'wearer') return
  const words = cutCells(plan.intention.text)              // the mcp-contract wearer path
  const cells = words.map(c => ({ pos: c.pos, word: c.word }))
  assert.deepEqual(cells, cutCells(text).map(c => ({ pos: c.pos, word: c.word })))
})

// ── (D) the grid tool (3R.2) — the door ──────────────────────────────────────────
test('grid: valid (who, sc) plans the fetch intention', () => {
  const r = planToolCall('grid', { who: 'wearer', sc: 7 })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'grid', who: 'wearer', sc: 7 })
})

test('grid: program who is rejected (only cognition turns have a grid)', () => {
  const r = planToolCall('grid', { who: 'program', sc: 7 })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /who must be wearer \| llm/)
})

test('grid: non-numeric sc is rejected', () => {
  const r = planToolCall('grid', { who: 'llm', sc: 'x' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /sc must be a number/)
})

// ── (D) the grid tool — execution (the mcp-contract handler core, replicated) ─────
// readTranscript → find (who, sc) → ALL cells, the cutter's truth. Replicated verbatim
// over a stub transcript so it runs DB-free.
function gridOver(transcript: { who: string; sc: number; words: { pos: number; word: string }[] }[], who: string, sc: number) {
  const turn = transcript.find(t => t.who === who && t.sc === sc)
  if (!turn) return { ok: false, who, sc, message: 'no such turn (who, sc) in your substrate' }
  return { ok: true, who: turn.who, sc: turn.sc, cells: turn.words.map(c => ({ pos: c.pos, word: c.word })) }
}

test('grid output for a written turn ≡ cutCells ground truth (all cells, punct/space present)', () => {
  const text = "don't go, U.S. now"                       // contraction, comma, abbreviation, spaces
  const transcript = [{ who: 'wearer', sc: 12, words: cutCells(text) }]
  const res = gridOver(transcript, 'wearer', 12) as { ok: true; cells: { pos: number; word: string }[] }
  assert.equal(res.ok, true)
  // ALL cells — word, punctuation AND space slots — with identical positions.
  assert.deepEqual(res.cells, cutCells(text).map(c => ({ pos: c.pos, word: c.word })))
  assert.ok(res.cells.some(c => c.word === ' '), 'space slots present')
  assert.ok(res.cells.some(c => c.word === ','), 'punctuation slots present')
})

test('grid: a turn not found returns a stating { ok: false }, never throws', () => {
  const res = gridOver([{ who: 'wearer', sc: 1, words: cutCells('hi') }], 'llm', 99)
  assert.equal(res.ok, false)
  assert.match((res as { message: string }).message, /no such turn/)
})

// ── (E) extras gate is the WRITE door's only (FIX-2 + read-door law RD) ───────────
// Write doors demand: unknown top-level fields are rejected fail-closed with a law-naming
// message (both write shapes). Read doors (present, grid) ignore extras — they carry no
// testimony — so clients may attach lifecycle envelopes freely (tested in (G)).
test('write (wearer): an unknown field is rejected, law named', () => {
  const r = planToolCall('write', { who: 'wearer', text: 'hi', extra: 1 })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "extra"/)
  assert.match(r.message, /additionalProperties:false/)
})

test('write (llm): an unknown field is rejected, law named', () => {
  const r = planToolCall('write', { who: 'llm', reply: 'hi', replyMarks: [], priorMarks: [], bogus: true })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "bogus"/)
  assert.match(r.message, /additionalProperties:false/)
})

// ── (F) scope-symmetry — scope is circumstance, not testimony ────────────────────
// A speaker that sends `scope` is rejected as an unknown field (it left the schema);
// the door stamps scope = session.sessionId. Same rejection path as any extra, zero
// added code — the symmetry is enforced by the demanded allow-list itself.
test('write (wearer): a sent scope is rejected as an unknown field', () => {
  const r = planToolCall('write', { who: 'wearer', text: 'hi', scope: 'proj-1' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "scope"/)
  assert.match(r.message, /additionalProperties:false/)
})

test('write (llm): a sent scope is rejected as an unknown field', () => {
  const r = planToolCall('write', { who: 'llm', reply: 'hi', replyMarks: [], priorMarks: [], scope: 'proj-1' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "scope"/)
  assert.match(r.message, /additionalProperties:false/)
})

test('the door stamps scope = session.sessionId (circumstance, not a sent field)', async () => {
  const session = { userId: 'u-7', sessionId: 'conn-abc' }
  const plan = planToolCall('write', { who: 'llm', reply: 'hi there', replyMarks: [], priorMarks: [] })
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'write' || plan.intention.who !== 'llm') return
  // mirror the mcp-contract llm path: scope is session.sessionId, NOT from the call.
  const emission = emissionFromStructured({
    reply: plan.intention.reply, replyMarks: plan.intention.replyMarks, priorMarks: plan.intention.priorMarks,
  })
  const seam = stubDeps(21)
  await recordScoredTurn(emission, 'llm', session.userId, session.sessionId, seam.deps)
  assert.equal(seam.writes.length, 1)
  assert.equal(seam.writes[0].userId, 'u-7')
  assert.equal(seam.writes[0].scope, 'conn-abc')          // the stamped writing connection
})

// ── (G) read-door law (RD) — reads ignore extras (no testimony to protect) ────────
// A read carries no testimony, so extras-rejection protects nothing and breaks clients
// whose lifecycle attaches envelope baggage (a SessionStart hook passing its event
// envelope as tool arguments bounced the wake at MCP -32602). present + grid now ignore
// extras; grid still validates its (who, sc) selectors.
test('present: extra lifecycle-envelope fields are ignored (read door succeeds)', () => {
  const r = planToolCall('present', { source: 'startup', session_id: 'x' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'present' })
})

test('present: no arguments is still accepted', () => {
  assert.equal(planToolCall('present', undefined).ok, true)
  assert.equal(planToolCall('present', {}).ok, true)
})

test('grid: selectors plus extra envelope fields succeed (read door ignores extras)', () => {
  const r = planToolCall('grid', { who: 'wearer', sc: 7, source: 'startup', session_id: 'x' })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'grid', who: 'wearer', sc: 7 })   // extras dropped, selectors kept
})

test('grid: a missing selector still rejects (selector validation enforced)', () => {
  assert.equal(planToolCall('grid', { who: 'wearer' }).ok, false)         // missing sc
  assert.equal(planToolCall('grid', { sc: 7 }).ok, false)                 // missing/invalid who
})
