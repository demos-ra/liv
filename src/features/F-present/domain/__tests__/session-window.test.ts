// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine — BUILD-4 session window)
// [F-present/domain/__tests__/session-window.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-cognition Shot 2 — the session window, exercised through the REAL read
// engine (buildFactTable → resolveDimension → weighDimension → currentFocus). No
// parallel focus, no hand-faked lineage: the window reads the engine's own parent
// chain (M3, chain-ping) and resolve-then-deposit touches.
//
//   line: wearer-core → trip → Kyoto  (Kyoto child of trip; both on the same line)
//   - SAME-LINE DESCENT EXTENDS: the conversation walks trip → Kyoto → deeper-Kyoto;
//     the window spans the whole run.
//   - A FOCUS SHIFT CUTS: a new unrelated thing (budget) becomes the focus; the line
//     re-routes horizontally, so the window cuts to the new run.
//
// Pure (no I/O) → runs under bare `tsx --test`, no warm-up, no DB.
// Run: npx tsx --test src/features/F-present/domain/__tests__/session-window.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { buildFactTable } from '../fact-table'
import { resolveDimension } from '../resolve-dimension'
import { weighDimension } from '../chain-ping'
import { currentFocus, sessionWindow } from '../session-window'
import type { Transcript } from '@/core/types/substrate-raw.types'
import type { PresentStore } from '@/features/F-present/config/mark-types'

// ── the substrate (raw words at coordinates) ────────────────────────────────────
const T1 = { sc: 1, who: 'wearer' as const, words: [{ pos: 1, word: 'trip' }] }
const T2 = { sc: 2, who: 'llm' as const, words: [{ pos: 1, word: 'trip' }, { pos: 2, word: ' ' }, { pos: 3, word: 'Kyoto' }] }
const T3 = { sc: 3, who: 'llm' as const, words: [{ pos: 1, word: 'Kyoto' }] }
const T4 = { sc: 4, who: 'llm' as const, words: [{ pos: 1, word: 'budget' }] }

// ── the lens (marks) — trip & Kyoto on one line; budget a separate top thing ────
const MARKS_ONELINE: PresentStore = [
  { home: { who: 'wearer', sc: 1, pos: 1 }, mark: { op: 'identity' } },          // trip
  { home: { who: 'llm', sc: 2, pos: 1 }, mark: { op: 'identity' } },             // trip
  { home: { who: 'llm', sc: 2, pos: 3 }, mark: { op: 'identity' } },             // Kyoto
  { home: { who: 'llm', sc: 2, pos: 1 }, mark: { op: 'RELATE', peers: ['trip', 'Kyoto'] } },
  { home: { who: 'llm', sc: 3, pos: 1 }, mark: { op: 'identity' } },             // Kyoto (most recent)
]
const MARK_BUDGET: PresentStore = [
  { home: { who: 'llm', sc: 4, pos: 1 }, mark: { op: 'identity' } },             // budget
]

function engine(transcript: Transcript, store: PresentStore) {
  const rows = buildFactTable(transcript, store)
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  return { rows, dim, focus: currentFocus(dim) }
}

// ── same-line descent extends ──────────────────────────────────────────────────
test('same-line descent extends the window across the whole run', () => {
  const transcript: Transcript = [T1, T2, T3]
  const { rows, dim, focus } = engine(transcript, MARKS_ONELINE)
  assert.equal(focus, 'kyoto', 'most-recently-touched thing is the focus (Kyoto at sc3)')

  const window = sessionWindow(transcript, dim, rows, focus)
  assert.deepEqual(window.map(t => t.sc), [1, 2, 3], 'trip → Kyoto → Kyoto is one descending run')
})

// ── a focus shift cuts ──────────────────────────────────────────────────────────
test('a focus shift (horizontal re-route) cuts the window to the new run', () => {
  const transcript: Transcript = [T1, T2, T3, T4]
  const { rows, dim, focus } = engine(transcript, [...MARKS_ONELINE, ...MARK_BUDGET])
  assert.equal(focus, 'budget', 'budget (sc4) is now the focus')

  const window = sessionWindow(transcript, dim, rows, focus)
  assert.deepEqual(window.map(t => t.sc), [4], 'the trip/Kyoto line is off the budget line — window cuts there')
})

// ── degenerate: no structure yet → the whole transcript is the line ─────────────
test('no focus (sparse early) → the whole transcript is the window', () => {
  const transcript: Transcript = [T1, T2, T3]
  const rows = buildFactTable(transcript, [])
  const dim = resolveDimension(rows)
  weighDimension(dim, rows)
  assert.equal(currentFocus(dim), null)
  assert.deepEqual(sessionWindow(transcript, dim, rows, null).map(t => t.sc), [1, 2, 3])
})
