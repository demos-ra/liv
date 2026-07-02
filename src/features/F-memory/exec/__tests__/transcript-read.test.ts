// @liv-standard v1.5.2
// [F-memory/exec/__tests__/transcript-read.test.ts]
// Built with LIV · livai.dev
//
// TH1 / R12 (save-and-flag replaces dropping): the substrate cognition read is TOTAL.
//   - state_flag (migration 029) surfaces onto RawTurn.flag ('pass' | 'fail').
//   - a row whose `words` cannot resolve (unparseable jsonb / not an array) NEVER throws
//     the whole read — it degrades to a SAFE placeholder (empty words) carrying flag='fail',
//     keeping its coordinate so the model can locate and self-correct the capture later.
//
// Pure adapter test: toRawTurn is the row→RawTurn seam, exercised directly with no DB.
// Run: npx tsx --test src/features/F-memory/exec/__tests__/transcript-read.test.ts

import assert from 'node:assert/strict'
import { test } from 'node:test'
import { toRawTurn, type SubstrateRow } from '../transcript-read'

const row = (over: Partial<SubstrateRow>): SubstrateRow => ({
  position: '5', source_channel: 'wearer', source_scope: 'mine',
  words: JSON.stringify([{ pos: 0, word: 'hi' }]), state_flag: 'pass', ...over,
})

test('state_flag=fail surfaces onto RawTurn.flag; the coordinate + words are preserved', () => {
  const t = toRawTurn(row({ state_flag: 'fail' }))
  assert.equal(t.flag, 'fail')
  assert.equal(t.sc, 5)
  assert.equal(t.scope, 'mine')
  assert.deepEqual(t.words, [{ pos: 0, word: 'hi' }])
})

test('a clean pass row surfaces flag=pass; source_channel maps to Who', () => {
  const t = toRawTurn(row({ source_channel: 'ai', state_flag: 'pass', words: [{ pos: 0, word: 'ok' }] }))
  assert.equal(t.flag, 'pass')
  assert.equal(t.who, 'llm')
})

test('an unexpected state_flag value defaults to pass (only the CHECK values are trusted)', () => {
  const t = toRawTurn(row({ state_flag: 'weird' }))
  assert.equal(t.flag, 'pass')
})

test('the read is TOTAL — an unparseable words row degrades to empty + flag=fail, never throws', () => {
  let t!: ReturnType<typeof toRawTurn>
  assert.doesNotThrow(() => { t = toRawTurn(row({ position: '7', words: '{not valid json', state_flag: 'pass' })) })
  assert.deepEqual(t.words, [], 'safe placeholder — empty words')
  assert.equal(t.flag, 'fail', 'reconstructed → flagged fail, not dropped')
  assert.equal(t.sc, 7, 'the coordinate is preserved so the model can self-correct')
})

test('words that are neither string nor array degrade safely (total read)', () => {
  const t = toRawTurn(row({ words: 42 as unknown }))
  assert.deepEqual(t.words, [])
  assert.equal(t.flag, 'fail')
})
