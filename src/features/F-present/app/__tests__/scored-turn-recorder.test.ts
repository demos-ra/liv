// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-finalization + S1 name-not-count claim+validate)
// [F-present/app/__tests__/scored-turn-recorder.test.ts]
// Built with LIV · livai.dev
//
// The PAIRED scored-turn recorder.
//   (A) SINGLE CUT: cutReply runs EXACTLY ONCE per turn (the "no double work" law). The
//       recorder's I/O + cutters are injected (A4 deps seam); a counting cutReply proves it.
//   (B) NATIVE rail ("feeds it"): wearer = { written } (E1's pre-write) — the recorder writes
//       ONLY the reply and homes priorMarks on the given wearer sc. E1 is never re-written.
//   (C) WIRE rail: wearer = { text } — the recorder cuts + writes BOTH turns, homes priorMarks
//       on the freshly-written wearer turn.
//   (D) VALIDATE BEFORE WRITE: a surface-check failure throws MarkSurfaceError and NOTHING is
//       written or placed (atomic) — the loud rejection precedes every write.
//   (E) empty reply → honest non-write.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first.
// Run: npx tsx --test src/features/F-present/app/__tests__/scored-turn-recorder.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordScoredTurn: any, cutReply: any, emissionFromStructured: any, wordCells: any, MarkSurfaceError: any
let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  await import('@/features/F-present/contract/present-contract')        // warm the graph
  ;({ recordScoredTurn } = await import('@/features/F-present/app/scored-turn-recorder'))
  ;({ cutReply, emissionFromStructured, wordCells, MarkSurfaceError } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// A DB-free deps seam: empty prior state, a capturing store, a COUNTING cutReply delegating
// to the real one, and the real cutCells. writeRawTurn returns wearerSc for a wearer write,
// replySc otherwise, and records every input so the rail is white-box-assertable.
function stubDeps(replySc: number, wearerSc = 0) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writes: any[] = []
  let cutCount = 0
  const deps = {
    readTranscript: async () => [],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    writeRawTurn: async (input: any) => { writes.push(input); return input.who === 'wearer' ? wearerSc : replySc },
    store: {
      read: async () => [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      place: async (_u: string, marks: any[]) => { placed.push(...marks) },
      clear: async () => {},
    },
    cutReply: (reply: string) => { cutCount++; return cutReply(reply) },
    cutCells,
  }
  return { deps, placed, writes, cutCount: () => cutCount }
}

const REPLY = 'Kyoto truly rivals Tokyo.'   // word-cells: 1=Kyoto 2=truly 3=rivals 4=Tokyo
const WEARER = 'I toured Kyoto'             // word-cells: 1=I 2=toured 3=Kyoto

// well-formed emission: identity naming "Kyoto" in the reply and "Kyoto" in the wearer turn.
const goodEmission = () => emissionFromStructured({
  reply: REPLY,
  replyMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
  priorMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
})

// ── (A) one cut per turn ───────────────────────────────────────────────────────
test('cutReply runs exactly once per recorded turn (no double work)', async () => {
  const { deps, cutCount } = stubDeps(5, 3)
  const wearer = { written: { sc: 3, wordCells: wordCells(cutCells(WEARER)) } }
  await recordScoredTurn(goodEmission(), 'llm', 'user-1', 'scope-1', wearer, deps)
  assert.equal(cutCount(), 1, 'the recorder must cut the reply exactly once')
})

// ── (B) native rail — wearer pre-written; only the reply is written ─────────────
test('native ({ written }): writes only the reply, homes priorMarks on the given wearer sc', async () => {
  const { deps, placed, writes } = stubDeps(7, 3)
  const wearer = { written: { sc: 3, wordCells: wordCells(cutCells(WEARER)) } }
  const result = await recordScoredTurn(goodEmission(), 'llm', 'user-1', 'scope-1', wearer, deps)

  assert.equal(result.sc, 7)
  assert.equal(result.text, REPLY)                              // byte-identical render
  assert.equal(writes.length, 1)                               // E1 already wrote the wearer turn
  assert.equal(writes[0].who, 'llm')

  assert.equal(placed.length, 2)
  const reply = placed.find((p: { home: { who: string } }) => p.home.who === 'llm')
  const prior = placed.find((p: { home: { who: string } }) => p.home.who === 'wearer')
  assert.equal(reply.home.sc, 7)
  assert.equal(prior.home.sc, 3)                               // the E1 wearer sc
  assert.equal(prior.home.pos, wordCells(cutCells(WEARER))[2].pos)   // "Kyoto" = 3rd word-cell
})

// ── (C) wire rail — wearer text cut + written here, then the reply ──────────────
test('wire ({ text }): writes BOTH turns, homes priorMarks on the freshly-written wearer turn', async () => {
  const { deps, placed, writes } = stubDeps(12, 11)
  const result = await recordScoredTurn(goodEmission(), 'llm', 'user-1', 'sess-1', { text: WEARER }, deps)

  assert.equal(result.sc, 12)
  assert.equal(writes.length, 2)                               // wearer THEN reply
  assert.equal(writes[0].who, 'wearer')
  assert.equal(writes[1].who, 'llm')
  assert.deepEqual(writes[0].words, cutCells(WEARER))          // full wearer cells written

  const prior = placed.find((p: { home: { who: string } }) => p.home.who === 'wearer')
  assert.equal(prior.home.sc, 11)                             // the freshly-assigned wearer sc
})

// ── (D) validate before write — a named-span-not-present is atomic (nothing persists) ─
test('a surface-check failure throws and writes NOTHING (atomic)', async () => {
  const { deps, placed, writes } = stubDeps(9, 8)
  const bad = emissionFromStructured({
    reply: REPLY,
    replyMarks: [{ surface: 'Osaka', marks: [{ op: 'identity' }] }],   // "Osaka" is not in the reply — named-span-not-present
    priorMarks: [],
  })
  await assert.rejects(
    () => recordScoredTurn(bad, 'llm', 'user-1', 'sess-1', { text: WEARER }, deps),
    (e: unknown) => e instanceof MarkSurfaceError,
  )
  assert.equal(writes.length, 0, 'no turn was written — the rejection precedes every write')
  assert.equal(placed.length, 0, 'no mark was placed')
})

// ── (E) empty reply → honest non-write ─────────────────────────────────────────
test('empty reply records nothing (honest non-write)', async () => {
  const { deps, placed, writes, cutCount } = stubDeps(9, 8)
  const result = await recordScoredTurn(emissionFromStructured({}), 'llm', 'user-1', 'scope-1', { text: WEARER }, deps)
  assert.deepEqual(result, { sc: 0, cells: [], markCount: 0, text: '' })
  assert.equal(placed.length, 0)
  assert.equal(writes.length, 0)
  assert.equal(cutCount(), 0)                                  // no reply → no cut, no write
})
