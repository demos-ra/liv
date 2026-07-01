// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — 3R: coordinates fetched, never rendered)
// [F-present/domain/__tests__/render-present.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 3R.
//   (3R.1) TRANSCRIPT is byte-pure: every turn line is exactly `[sc] (who): ` +
//          joinCells(words) — NO positional markup of any kind, ever, over an
//          adversarial-punctuation corpus.
//   (3R.3) the marks STATE GRID teaches the coordinate format from REAL marks: each mark
//          renders its home @pos, matching the placed mark's home coordinate.
//
// Load note (mirrors reply-render-fidelity): warm the F-present R3 graph first so the
// F-memory R3 barrel resolves cleanly under bare `tsx` (db client is lazy).
//
// Run: npx tsx --test src/features/F-present/domain/__tests__/render-present.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { RawTurn } from '@/core/types/substrate-raw.types'
import type { PresentStore } from '@/features/F-present/config/mark-types'
import { buildFactTable } from '../fact-table'
import { resolveDimension } from '../resolve-dimension'
import { weighDimension } from '../chain-ping'
import { currentFocus } from '../session-window'
import { pivot, lineageView, timelineView } from '../pivot'
import { transcript as travelTranscript, store as travelStore } from '../__fixtures__/travel-store'
import { renderTranscript, renderGrid } from '@/features/F-present/domain/render-present'
import { joinCells, cutCells } from '@/features/F-memory/exec/raw-turn-write'

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

// ── (3R.3) the state grid teaches @pos from real marks ──────────────────────────
test('renderGrid (state) shows each mark @home.pos, matching the placed mark', () => {
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

  const tv = timelineView(focus!)
  const render = renderGrid(pivot(tv.assignment, dim, rows), tv.render)

  // the @pos appears and matches the placed mark's home position — in the MUSICAL register
  // (R9): identity→note, QUALIFY→expression.
  assert.ok(render.includes(`note(1)@${kyotoPos}`), `expected note(1)@${kyotoPos} in:\n${render}`)
  assert.ok(render.includes(`expression[ancient]@${kyotoPos}`), `expected expression[ancient]@${kyotoPos} in:\n${render}`)
  // the home pos is REAL — equals the placed mark's home.
  assert.equal(kyotoPos, store[0].home.pos)
})

// ── §B0 equivalence golden — the rich travel-store, rendered through the ONE engine ─────
// The committed referent (advisor finding 6 / §B0): captured from HEAD's two render bodies
// before the unification, now reproduced by renderGrid over the composing engine. Equivalence
// is of the BODY (the lineage outline + the state grid) — byte-for-byte; only the two baked
// titles became the terse, token-free header (mandated by §2.4).
// The lineage rows are emitted DFS pre-order so render-time indent reproduces the nested walk.
test('§B0 — travel-store STRUCTURE renders byte-equal to the HEAD lineage outline', () => {
  const rows = buildFactTable(travelTranscript, travelStore)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  const golden =
`structure — lineage by weight; root = wearer:
— [w=53]
  Japan [w=38]
    Kyoto [w=19]
      ryokan [w=9]
    Q3 [w=5]
    Tokyo [w=3]
  Bangkok [w=12]
    Osaka [w=4]
  dentist [w=3]
chord (lateral threads):
  flew: japan ↔ tokyo
  toured: japan ↔ kyoto
  itinerary: japan ↔ q3
  stayed: kyoto ↔ ryokan
  landed: japan ↔ tokyo
  deadline: kyoto ↔ q3
  loved: japan ↔ kyoto
  trip: bangkok ↔ osaka`
  assert.equal(renderGrid(pivot(lineageView.assignment, dim, rows), lineageView.render), golden)
})

test('§B0 — travel-store STATE renders byte-equal to the HEAD timeline grid', () => {
  const rows = buildFactTable(travelTranscript, travelStore)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  const focus = currentFocus(dim)
  assert.equal(focus, 'dentist')                     // most-recent touch (sc21)
  const golden =
`state — columns = the focus's direct line:
columns: dentist
sc20:
  dentist: note(1)@0 expression[anxious]@1
sc21:
  dentist: expression[monday]@0`
  const tv = timelineView(focus!)
  assert.equal(renderGrid(pivot(tv.assignment, dim, rows), tv.render), golden)
})
