// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (cognition-turn contract — one core-owned shape, surfaces derive)
// [F-present/domain/__tests__/emission-contract.test.ts]
// Built with LIV · livai.dev
//
// THE EMISSION CONTRACT IS PROJECTED, NOT HAND-DECLARED. coin-score owns ONE shape
// (COORD/REF/MARK_ITEM/SPAN_MARK_ITEM) and projects it per MarkingSituation. This suite pins
// the projector's invariants at the CORE:
//   - NATIVE byte-identical: projectEmissionSchema(NATIVE_SITUATION) is the old hand-written
//     SCORE_SCHEMA, unchanged (containment-proof regression pin) — and SCORE_SCHEMA IS it;
//   - projector mechanics: reply-only vs all-present `required`; wearerText inclusion;
//     descriptions ride only when named; the mark item is the ONE shared geometry;
//   - punctuation boundary against the LIVE cutter: an internal-punctuation word (don't, U.S,
//     well-known) is ONE word-cell; standalone punctuation is not a word-cell.
// The MCP projection's wire-specific pins (all-four required, wearerText, descriptions, item
// === native item) live with the wire that owns its situation — F-mcp/__tests__/wire-turn.
//
// Load note (mirrors surface-check): warm the F-present R3 graph first (db client is lazy).
// Run: npx tsx --test src/features/F-present/domain/__tests__/emission-contract.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cs: any

before(async () => {
  await import('@/features/F-present/contract/present-contract')          // warm the graph
  cs = await import('@/features/F-present/domain/coin-score')
})

// ── NATIVE byte-identical — the projection equals the old hand-written SCORE_SCHEMA ──
test('SCORE_SCHEMA is projectEmissionSchema(NATIVE_SITUATION), byte-identical to the old shape', () => {
  // the exported schema IS the native projection (deterministic — a fresh call deep-equals it).
  assert.deepEqual(cs.SCORE_SCHEMA, cs.projectEmissionSchema(cs.NATIVE_SITUATION))

  const s = cs.SCORE_SCHEMA
  // the old hand-written shape, exactly: object · {reply,replyMarks,priorMarks} · required
  // ['reply'] · additionalProperties false · NO wearerText · NO field descriptions.
  assert.equal(s.type, 'object')
  assert.deepEqual(Object.keys(s.properties), ['reply', 'replyMarks', 'priorMarks'])
  assert.deepEqual(s.required, ['reply'])
  assert.equal(s.additionalProperties, false)
  assert.equal(s.properties.reply.description, undefined, 'native carries no field descriptions')
  assert.equal(s.properties.replyMarks.description, undefined)
  assert.equal(s.properties.priorMarks.description, undefined)
  // the two mark arrays share the ONE mark geometry (the single source).
  assert.equal(s.properties.replyMarks.items, s.properties.priorMarks.items, 'one mark item, shared')
  assert.equal(s.properties.reply.type, 'string')
  assert.equal(s.properties.replyMarks.type, 'array')
})

// ── projector mechanics — demand, wearerText inclusion, descriptions ──────────────
test('reply-only demands only reply; all-present demands every present field', () => {
  const replyOnly = cs.projectEmissionSchema({ includeWearerText: false, demand: 'reply-only' })
  assert.deepEqual(replyOnly.required, ['reply'])

  const allNoWearer = cs.projectEmissionSchema({ includeWearerText: false, demand: 'all-present' })
  assert.deepEqual(allNoWearer.required, ['reply', 'replyMarks', 'priorMarks'])

  const allWithWearer = cs.projectEmissionSchema({ includeWearerText: true, demand: 'all-present' })
  assert.deepEqual(Object.keys(allWithWearer.properties), ['wearerText', 'reply', 'replyMarks', 'priorMarks'])
  assert.deepEqual(allWithWearer.required, ['wearerText', 'reply', 'replyMarks', 'priorMarks'])
  assert.equal(allWithWearer.additionalProperties, false)
})

test('descriptions ride only the fields the situation names; the mark item is unchanged', () => {
  const sit = {
    includeWearerText: true,
    demand: 'all-present',
    descriptions: { wearerText: 'WT', reply: 'R' },   // replyMarks/priorMarks unnamed
  }
  const s = cs.projectEmissionSchema(sit)
  assert.equal(s.properties.wearerText.description, 'WT')
  assert.equal(s.properties.reply.description, 'R')
  assert.equal(s.properties.replyMarks.description, undefined, 'an unnamed field carries no description')
  // a description never reaches into the shared mark geometry.
  assert.equal(s.properties.replyMarks.items, cs.SCORE_SCHEMA.properties.replyMarks.items)
})

// ── punctuation boundary — against the LIVE cutter (cutCells/wordCells/isWordCell) ──
test('an internal-punctuation word is ONE word-cell; standalone punctuation is not', () => {
  for (const w of ["don't", 'U.S', 'well-known']) {
    const wc = cs.wordCells(cs.cutReply(w).cells)
    assert.equal(wc.length, 1, `"${w}" is a single word-cell (internal punctuation does not split it)`)
    assert.equal(wc[0].word, w, `"${w}" surfaces whole`)
  }
  // standalone punctuation is a cell but NOT a word-cell — it is not counted in the index.
  const cells = cs.cutReply('Kyoto .').cells          // "Kyoto" · " " · "."
  const wc = cs.wordCells(cells)
  assert.equal(wc.length, 1, 'only "Kyoto" is a word-cell; the standalone "." is inert')
  assert.equal(wc[0].word, 'Kyoto')
})
