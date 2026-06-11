// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization)
// [F-present/app/__tests__/scored-turn-recorder.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 1 — the scored-turn recorder.
//   (A) SINGLE CUT: cutReply runs EXACTLY ONCE per turn (the "no double work" law).
//       The recorder's I/O + cutter are injected (A4 deps seam) — a counting cutReply
//       proves the count; the DB is stubbed so the suite runs DB-free.
//   (B) splitEmission HONORS the injected cut (no re-cut): handed a sentinel cut it
//       reads geometry off it, never re-tokenizing — together with (A) this pins the
//       single tokenization end to end.
//   (C) LANDS THE TURN AND ITS MARKS: a well-formed scored turn produces present_marks-
//       bound PlacedMarks at the assigned sc, and returns the canonical cut + count.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/app/__tests__/scored-turn-recorder.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordScoredTurn: any, cutReply: any, splitEmission: any, emissionFromStructured: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  await import('@/features/F-present/contract/present-contract')        // warm the graph
  ;({ recordScoredTurn } = await import('@/features/F-present/app/scored-turn-recorder'))
  ;({ cutReply, splitEmission, emissionFromStructured } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// A DB-free deps seam: empty prior state, a fixed sc, a capturing store, and a
// COUNTING cutReply that delegates to the real one.
function stubDeps(sc: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed: any[] = []
  let cutCount = 0
  const deps = {
    readTranscript: async () => [],
    writeRawTurn: async () => sc,
    store: {
      read: async () => [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      place: async (_u: string, marks: any[]) => { placed.push(...marks) },
      clear: async () => {},
    },
    cutReply: (reply: string) => { cutCount++; return cutReply(reply) },
  }
  return { deps, placed, cutCount: () => cutCount }
}

const REPLY = 'Kyoto truly rivals Tokyo.'   // words: 1=Kyoto 2=truly 3=rivals 4=Tokyo

// ── (A) one cut per turn ───────────────────────────────────────────────────────
test('cutReply runs exactly once per recorded turn (no double work)', async () => {
  const { deps, cutCount } = stubDeps(5)
  const emission = emissionFromStructured({ reply: REPLY, replyMarks: [], priorMarks: [] })
  await recordScoredTurn(emission, 'llm', 'user-1', 'scope-1', deps)
  assert.equal(cutCount(), 1, 'the recorder must cut the reply exactly once')
})

// ── (B) splitEmission honors the injected cut (no re-cut) ──────────────────────
test('splitEmission reads the injected cut, never re-tokenizing', () => {
  const sentinel = [{ pos: 1, word: 'X' }, { pos: 2, word: ' ' }, { pos: 3, word: 'Y' }]
  const cut = { cells: sentinel, wordCellPos: [1, 3] }
  // reply text is deliberately DIFFERENT from the sentinel cells — if splitEmission
  // re-cut the text, rawTurn.words would not be the sentinel.
  const emission = emissionFromStructured({ reply: 'totally different text here', replyMarks: [{ word: 2, marks: [{ op: 'identity' }] }], priorMarks: [] })
  const { rawTurn, placedMarks } = splitEmission(emission, 'llm', 9, cut)
  assert.deepEqual(rawTurn.words, sentinel)                 // used the cut, not a re-cut
  assert.equal(placedMarks[0].home.pos, 3)                  // 2nd word-cell → wordCellPos[1] = 3
})

// ── (C) lands the turn and its marks ───────────────────────────────────────────
test('a scored turn lands present_marks-bound PlacedMarks at the assigned sc', async () => {
  const { deps, placed } = stubDeps(7)
  // identity on words 1 and 4 — no refs, so both survive M4 (universe-trivial).
  const emission = emissionFromStructured({
    reply: REPLY,
    replyMarks: [{ word: 1, marks: [{ op: 'identity' }] }, { word: 4, marks: [{ op: 'identity' }] }],
    priorMarks: [],
  })
  const result = await recordScoredTurn(emission, 'llm', 'user-1', 'scope-1', deps)

  // returns the canonical cut + count + byte-identical text.
  assert.equal(result.sc, 7)
  assert.equal(result.markCount, 2)
  assert.deepEqual(result.cells, cutCells(REPLY))
  assert.equal(result.text, REPLY)

  // the marks are PlacedMarks homed at this turn's coordinate (present_marks-bound).
  assert.equal(placed.length, 2)
  for (const pm of placed) {
    assert.equal(pm.home.who, 'llm')
    assert.equal(pm.home.sc, 7)
    assert.equal(pm.mark.op, 'identity')
    assert.equal(typeof pm.home.pos, 'number')
  }
})

// ── empty reply → honest non-write ─────────────────────────────────────────────
test('empty reply records nothing (honest non-write)', async () => {
  const { deps, placed, cutCount } = stubDeps(9)
  const result = await recordScoredTurn(emissionFromStructured({}), 'llm', 'user-1', 'scope-1', deps)
  assert.deepEqual(result, { sc: 0, cells: [], markCount: 0, text: '' })
  assert.equal(placed.length, 0)
  assert.equal(cutCount(), 0)                               // no reply → no cut, no write
})
