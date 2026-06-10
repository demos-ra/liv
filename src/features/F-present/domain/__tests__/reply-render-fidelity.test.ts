// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (G1 cutter inverse + §FORK-A reassembly)
// [F-present/domain/__tests__/reply-render-fidelity.test.ts]
// Built with LIV · livai.dev
//
// 2-B VERIFICATION — reply-render fidelity (space-before-punctuation), FIXED.
//
// Exercises the REAL write pipeline at the new seam:
//   emissionFromStructured(reply text) → splitEmission → cutReply → river cells →
//   joinCells → byte-identical render. The model's reply text is authoritative; there
//   is no token space-join, so a standalone-punctuation token can no longer inject a
//   space before punctuation. replyMarks key to word cells by 1-based word index.
//
// Load note: the F-memory R3 barrel trips a circular-import artifact when imported as
// the entry under bare `tsx` (not under Next). We warm the module graph via the
// F-present R3 contract first (its full graph loads cleanly — db client is lazy), then
// import coin-score. This exercises the SHIPPING code, no reimplementation.
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/reply-render-fidelity.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cs: any, joinCells: (cells: { pos: number; word: string }[]) => string

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  cs = await import('@/features/F-present/domain/coin-score')
  ;({ joinCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// the river render of a model reply, through the real pipeline
const renderReply = (reply: string): string => {
  const emission = cs.emissionFromStructured({ reply, replyMarks: [], priorMarks: [] })
  const { rawTurn } = cs.splitEmission(emission, 'llm', 1)
  return joinCells(rawTurn.words)
}

// ── L0 scope #3: reply string → cutCells → river → joinCells → byte-identical ──────
test('seam fidelity — adversarial punctuation renders byte-identical to the model reply', () => {
  const corpus = [
    'hello, world',                          // the original symptom — comma
    'Kyoto truly rivals Tokyo.',             // trailing period
    'wait... really?',                       // ellipsis + question mark
    'he said "hi" to U.S. officials',        // quotes + dotted abbreviation
    "don't go — it's 3.14 miles",            // contraction, em-dash, decimal
    'Kyoto (see Tokyo), truly',              // comma-after-paren
    'a, b, c.',                              // multiple punctuation
    'ends with quote: "done."',              // quote-after-period nesting
    'spaces   kept    verbatim',             // multi-space runs
  ]
  for (const reply of corpus) {
    assert.equal(renderReply(reply), reply, `seam drift for: ${JSON.stringify(reply)}`)
  }
})

// ── the 2-B defect is gone: no space injected before punctuation ───────────────────
test('no space-before-punctuation — the reply renders exactly as written', () => {
  assert.equal(renderReply('hello, world'), 'hello, world')      // NOT "hello , world"
  assert.equal(renderReply('really?'), 'really?')                // NOT "really ?"
  assert.ok(!renderReply('a, b, c.').includes(' ,'))             // no orphaned-space-before-comma anywhere
})

// ── replyMarks key to word cells by 1-based index ─────────────────────────────────
test('replyMarks home on the canonical word-cell named by their word index', () => {
  const reply = 'Kyoto truly rivals Tokyo.'                      // words: 1=Kyoto 2=truly 3=rivals 4=Tokyo
  const emission = cs.emissionFromStructured({
    reply,
    replyMarks: [
      { word: 1, marks: [{ op: 'identity' }] },
      { word: 4, marks: [{ op: 'identity' }] },
    ],
    priorMarks: [],
  })
  const { rawTurn, placedMarks } = cs.splitEmission(emission, 'llm', 1)
  const { wordCellPos } = cs.cutReply(reply)
  const wordAt = (pos: number) => rawTurn.words.find((c: { pos: number }) => c.pos === pos)?.word

  assert.equal(placedMarks.length, 2)
  // word 1 → first word-cell ("Kyoto"); word 4 → fourth word-cell ("Tokyo")
  assert.equal(placedMarks[0].home.pos, wordCellPos[0])
  assert.equal(wordAt(placedMarks[0].home.pos), 'Kyoto')
  assert.equal(placedMarks[1].home.pos, wordCellPos[3])
  assert.equal(wordAt(placedMarks[1].home.pos), 'Tokyo')
})

test('out-of-range word index is dropped (model miscount → fail-closed)', () => {
  const emission = cs.emissionFromStructured({
    reply: 'two words',
    replyMarks: [{ word: 99, marks: [{ op: 'identity' }] }],
    priorMarks: [],
  })
  const { placedMarks } = cs.splitEmission(emission, 'llm', 1)
  assert.equal(placedMarks.length, 0)
})

// ── priorMarks unchanged; empty reply is an honest non-write ───────────────────────
test('priorMarks home on their given coordinate (unchanged path)', () => {
  const emission = cs.emissionFromStructured({
    reply: 'ok',
    replyMarks: [],
    priorMarks: [{ home: { who: 'wearer', sc: 7, pos: 3 }, marks: [{ op: 'identity' }] }],
  })
  const { placedMarks } = cs.splitEmission(emission, 'llm', 1)
  assert.equal(placedMarks.length, 1)
  assert.deepEqual(placedMarks[0].home, { who: 'wearer', sc: 7, pos: 3 })
})

test('empty / missing reply → empty emission (no write)', () => {
  assert.equal(cs.emissionFromStructured({}).reply, '')
  assert.equal(cs.emissionFromStructured({ reply: 42 }).reply, '')      // non-string → empty
  assert.equal(cs.emissionFromStructured(null).reply, '')
})
