// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (G1 cutter inverse + §FORK-A reassembly)
// [F-present/domain/__tests__/reply-render-fidelity.test.ts]
// Built with LIV · livai.dev
//
// 2-B VERIFICATION — reply-render fidelity (space-before-punctuation), FIXED, and held
// byte-identical through sprint-wire-economy. The model's reply text is AUTHORITATIVE:
//   cutReply(reply).cells → joinCells → byte-identical render.
// There is no token space-join, so a standalone-punctuation token can never inject a space
// before punctuation. This is the §4 render gate — it does not change under claim+validate.
//
// The CLAIM + VALIDATE mark path (word-index + surface, both turns) is exercised here at the
// happy path (index → canonical pos, surface verified); the adversarial LOUD-failure matrix
// (miscount, cell-pos-as-index, out-of-range, duplicate-word) lives in surface-check.test.ts.
//
// Load note: warm the F-present R3 graph first (db client is lazy), then import coin-score.
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

// the river render of a model reply, through the real pipeline (§FORK-A: the reply is the text)
const renderReply = (reply: string): string => joinCells(cs.cutReply(reply).cells)

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

// ── replyMarks resolve word-index → canonical word-cell, surface verified ─────────
test('replyMarks home on the canonical word-cell named by their word index (surface verified)', () => {
  const reply = 'Kyoto truly rivals Tokyo.'                      // words: 1=Kyoto 2=truly 3=rivals 4=Tokyo
  const emission = cs.emissionFromStructured({
    reply,
    replyMarks: [
      { word: 1, surface: 'Kyoto', marks: [{ op: 'identity' }] },
      { word: 4, surface: 'Tokyo', marks: [{ op: 'identity' }] },
    ],
    priorMarks: [],
  })
  const cut = cs.cutReply(reply)
  const located = cs.locateWordMarks(emission.replyMarks, cut.cells, 'reply')
  const placed = cs.homeMarks(located, 'llm', 1)
  const wordAt = (pos: number) => cut.cells.find((c: { pos: number }) => c.pos === pos)?.word

  assert.equal(placed.length, 2)
  // word 1 → first word-cell ("Kyoto"); word 4 → fourth word-cell ("Tokyo")
  assert.equal(placed[0].home.pos, cut.wordCellPos[0])
  assert.equal(wordAt(placed[0].home.pos), 'Kyoto')
  assert.equal(placed[1].home.pos, cut.wordCellPos[3])
  assert.equal(wordAt(placed[1].home.pos), 'Tokyo')
})

// ── empty reply is an honest non-write (narrowing never throws) ────────────────────
test('empty / missing reply → empty emission (no write)', () => {
  assert.equal(cs.emissionFromStructured({}).reply, '')
  assert.equal(cs.emissionFromStructured({ reply: 42 }).reply, '')      // non-string → empty
  assert.equal(cs.emissionFromStructured(null).reply, '')
})
