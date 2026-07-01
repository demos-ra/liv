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
// The CLAIM + VALIDATE mark path (name-not-count, both turns) is exercised here at the happy
// path (named span → canonical pos); the adversarial LOUD-failure matrix (named-span-not-present,
// empty-of-words, duplicate-word first-occurrence) lives in surface-check.test.ts.
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/reply-render-fidelity.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import * as cs from '@/features/F-present/domain/coin-score'
import { joinCells } from '@/features/F-memory/exec/raw-turn-write'

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

// ── replyMarks locate their NAMED span → canonical word-cell (S1 name-not-count) ──
test('replyMarks home on the canonical word-cell of the span they name', () => {
  const reply = 'Kyoto truly rivals Tokyo.'                      // word-cells: Kyoto truly rivals Tokyo
  const emission = cs.emissionFromStructured({
    reply,
    replyMarks: [
      { surface: 'Kyoto', marks: [{ op: 'identity' }] },
      { surface: 'Tokyo', marks: [{ op: 'identity' }] },
    ],
    priorMarks: [],
  })
  const cut = cs.cutReply(reply)
  const located = cs.locateWordMarks(emission.replyMarks, cut.cells, 'reply')
  const placed = cs.homeMarks(located, 'llm', 1)
  const wordAt = (pos: number) => cut.cells.find((c: { pos: number }) => c.pos === pos)?.word

  assert.equal(placed.length, 2)
  // "Kyoto" → first word-cell; "Tokyo" → fourth word-cell — located by name, not by count.
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
