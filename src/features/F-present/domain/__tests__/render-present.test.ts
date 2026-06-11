// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — 3R: coordinates fetched, never rendered)
// [F-present/domain/__tests__/render-present.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 3R.
//   (3R.1) TRANSCRIPT is byte-pure: every turn line is exactly `[sc] (who): ` +
//          joinCells(words) — NO positional markup of any kind, ever, over an
//          adversarial-punctuation corpus.
//   (3R.3) the marks SHEET teaches the coordinate format from REAL marks: each mark
//          renders its home @pos, matching the placed mark's home coordinate.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/render-present.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import type { PresentStore } from '@/features/F-present/config/mark-types'
import type { SheetResult } from '@/features/F-present/config/read-engine-types'
import { buildFactTable } from '../fact-table'
import { resolveDimension } from '../resolve-dimension'
import { weighDimension } from '../chain-ping'
import { currentFocus } from '../session-window'
import { pivot } from '../pivot'

let renderTranscript: (turns: RawTurn[]) => string
let renderSheet: (r: SheetResult) => string
let joinCells: (cells: { pos: number; word: string }[]) => string
let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  ;({ renderTranscript, renderSheet } = await import('@/features/F-present/domain/render-present'))
  ;({ joinCells, cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// ── (3R.1) transcript is byte-pure — no positional markup ───────────────────────
test('the transcript line is exactly `[sc] (who): ` + joinCells(words), no tags', () => {
  const corpus = [
    'hello, world', 'Kyoto truly rivals Tokyo.', 'wait... really?',
    'he said "hi" to U.S. officials', "don't go — it's 3.14 miles",
    'a, b, c.', 'spaces   kept    verbatim',
  ]
  for (const text of corpus) {
    const turn: RawTurn = { sc: 4, who: 'wearer', words: cutCells(text) }
    const line = renderTranscript([turn]).split('\n')[1]    // the one turn line
    const body = line.slice(line.indexOf(': ') + 2)
    assert.equal(body, joinCells(turn.words), `transcript body must be joinCells for: ${JSON.stringify(text)}`)
    assert.equal(body, text, `byte-identical to source for: ${JSON.stringify(text)}`)
    assert.ok(!/[⟨⟩]/.test(line), 'no ⟨pos⟩ markup anywhere')
    assert.ok(!/@\d/.test(body), 'no @pos in the transcript')
  }
})

test('llm turns render who = llm; wearer renders the dash', () => {
  const r = renderTranscript([
    { sc: 1, who: 'wearer', words: cutCells('hi') },
    { sc: 2, who: 'llm', words: cutCells('hello') },
  ]).split('\n')
  assert.equal(r[1], '[1] (—): hi')
  assert.equal(r[2], '[2] (llm): hello')
})

// ── (3R.3) the marks sheet teaches @pos from real marks ─────────────────────────
test('renderSheet shows each mark @home.pos, matching the placed mark', () => {
  // a turn whose pos-3 word "Kyoto" carries identity + a QUALIFY.
  const turn: RawTurn = { sc: 7, who: 'wearer', words: cutCells('I toured Kyoto') } // 1:I 3:toured 5:Kyoto
  const kyotoPos = cutCells('I toured Kyoto').find(c => c.word === 'Kyoto')!.pos
  const store: PresentStore = [
    { home: { who: 'wearer', sc: 7, pos: kyotoPos }, mark: { op: 'identity' } },
    { home: { who: 'wearer', sc: 7, pos: kyotoPos }, mark: { op: 'QUALIFY', coloring: 'ancient', target: 'Kyoto' } },
  ]
  const rows = buildFactTable([turn], store)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  const focus = currentFocus(dim)
  assert.equal(focus, 'kyoto')

  const sheet = pivot({ view: 'sheet', focus: focus!, show: {} }, dim, rows) as SheetResult
  const render = renderSheet(sheet)

  // the @pos appears and matches the placed mark's home position.
  assert.ok(render.includes(`identity(1)@${kyotoPos}`), `expected identity(1)@${kyotoPos} in:\n${render}`)
  assert.ok(render.includes(`QUALIFY[ancient]@${kyotoPos}`), `expected QUALIFY[ancient]@${kyotoPos} in:\n${render}`)
  // the home pos is REAL — equals the placed mark's home.
  assert.equal(kyotoPos, store[0].home.pos)
})
