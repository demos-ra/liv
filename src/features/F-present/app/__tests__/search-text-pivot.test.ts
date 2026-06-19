// @liv-standard v1.5.2
// [F-present/R2]
// Built with LIV · livai.dev
// [F-present/app/__tests__/search-text-pivot.test.ts]
//
// Run: npx tsx --test src/features/F-present/app/__tests__/search-text-pivot.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

/* eslint-disable @typescript-eslint/no-explicit-any */
let search: any, parseSearchSpec: any, recordScoredTurn: any, emissionFromStructured: any, COIN_MANUAL: any
let handleMcpRequest: any
let cutCells: (t: string) => { pos: number; word: string }[]
let wordCells: (cells: any[]) => { pos: number }[]

before(async () => {
  ;({ search, parseSearchSpec, recordScoredTurn, emissionFromStructured, COIN_MANUAL } =
    await import('@/features/F-present/contract/present-contract'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
  ;({ wordCells } = await import('@/features/F-present/domain/coin-score'))
  ;({ handleMcpRequest } = await import('@/features/F-mcp/contract/mcp-contract'))
})

// ── an in-memory substrate (DB-free): the recorder writes here; search reads here ──
function harness() {
  const turns: any[] = []
  const placed: any[] = []
  let nextSc = 0
  const store = {
    read: async () => placed,
    place: async (_u: string, ms: any[]) => { placed.push(...ms) },
    clear: async () => { placed.length = 0 },
  }
  const recDeps = {
    readTranscript: async () => turns,
    writeRawTurn: async ({ who, words }: any) => { const sc = ++nextSc; turns.push({ who, sc, words }); return sc },
    store,
    cutReply: (r: string) => { const cells = cutCells(r); return { cells, wordCellPos: wordCells(cells).map(c => c.pos) } },
    cutCells,
  }
  const lookDeps = { readTranscript: async () => turns, store }
  return { turns, placed, recDeps, lookDeps }
}

// seed the COIN worked example (proven to validate): "I toured Kyoto" / "Kyoto truly rivals Tokyo."
async function seedKyoto(h: ReturnType<typeof harness>) {
  await recordScoredTurn(
    emissionFromStructured({
      reply: 'Kyoto truly rivals Tokyo.',
      replyMarks: [
        { word: 1, surface: 'Kyoto',  marks: [{ op: 'note' }] },
        { word: 2, surface: 'truly',  marks: [{ op: 'expression', coloring: 'truly', target: 'Kyoto' }] },
        { word: 3, surface: 'rivals', marks: [{ op: 'chord', peers: ['Kyoto', 'Tokyo'] }] },
        { word: 4, surface: 'Tokyo',  marks: [{ op: 'note' }] },
      ],
      priorMarks: [{ word: 3, surface: 'Kyoto', marks: [{ op: 'note' }] }],
    }),
    'llm', 'u', 'sess', { text: 'I toured Kyoto' }, h.recDeps,
  )
}

// ── parseSearchSpec — the one validator (region × lens) ────────────────────────────
test('parseSearchSpec: region defaults to all; lens is required; bad zones are named', () => {
  assert.deepEqual(parseSearchSpec({ lens: { view: 'raw' } }).spec.region, { kind: 'all' })
  assert.equal(parseSearchSpec({}).ok, false)                                   // lens required
  assert.match(parseSearchSpec({ lens: { view: 'bogus' } }).message, /view must be raw \| pivot/)
  assert.match(parseSearchSpec({ lens: { view: 'pivot', rows: 'xyz' } }).message, /rows: lineage \| time/)
  assert.match(parseSearchSpec({ region: { kind: 'turn', who: 'nope', sc: 1 }, lens: { view: 'raw' } }).message, /who must be wearer \| llm/)
  // a full pivot spec round-trips to a typed spec.
  const ok = parseSearchSpec({ region: { kind: 'thing', name: 'Kyoto' }, lens: { view: 'pivot', rows: 'time', focus: 'Kyoto', sort: 'id', filter: { colorings: { hide: ['truly'] } } } })
  assert.equal(ok.ok, true)
  assert.equal(ok.spec.lens.view, 'pivot')
})

// ── region × lens orthogonality (compose; neither is a second way to do the other) ──
test('region × lens: raw selects cells; pivot renders a grid; turn|span|thing are regions', async () => {
  const h = harness(); await seedKyoto(h)
  // raw × all → every cell
  const rawAll = await search('u', { region: { kind: 'all' }, lens: { view: 'raw' } }, h.lookDeps)
  assert.equal(rawAll.ok && rawAll.view === 'raw', true)
  assert.ok(rawAll.cells.length >= 4)
  // raw × thing → the thing's cells (turn|span|thing are REGION shorthands, not a parallel path)
  const rawThing = await search('u', { region: { kind: 'thing', name: 'Kyoto' }, lens: { view: 'raw' } }, h.lookDeps)
  assert.equal(rawThing.ok, true)
  assert.ok(rawThing.cells.every((c: any) => c.word === 'Kyoto'))
  // pivot × all (lineage) → the structure grid (the summary default table)
  const piv = await search('u', { region: { kind: 'all' }, lens: { view: 'pivot', rows: 'lineage' } }, h.lookDeps)
  assert.equal(piv.ok && piv.view === 'pivot', true)
  assert.match(piv.text, /Kyoto/)
})

// ════════════════════════════════════════════════════════════════════════════════
// THE WALK — a model drives the loop from the MODEL-VISIBLE TEXT alone:
//   (a) read the default present  (b) search to a different table (focus, lineage→time,
//   hide a coloring, sort)  (c) search raw to read a coordinate off a cell  (d) pin it
//   into a mark  (e) compose. Every call/return is printed; each step is asserted.
// ════════════════════════════════════════════════════════════════════════════════
test('WALK: a model navigates to a new table and uses it through compose, from the tool text alone', async () => {
  const h = harness(); await seedKyoto(h)
  const log = (...a: any[]) => console.log(...a)

  // ── MODEL-VISIBLE TEXT — the real tools/list (search region×lens schema; compose's manual) ──
  const listed: any = await handleMcpRequest({ jsonrpc: '2.0', id: 1, method: 'tools/list' }, { userId: 'u', sessionId: 'sess' } as any)
  const tool = (n: string) => listed.result.tools.find((t: any) => t.name === n)
  log('\n=========== MODEL-VISIBLE TOOL TEXT (tools/list) ===========')
  for (const n of ['summary', 'search', 'compose']) {
    const t = tool(n)
    log(`\n### ${t.name}\n${t.description}`)
    if (t.inputSchema) log(`inputSchema: ${JSON.stringify(t.inputSchema)}`)
  }
  log('\n--- compose rides the fill manual (excerpt) ---\n' + String(COIN_MANUAL).split('\n').slice(0, 6).join('\n') + '\n…')
  // the search description names its two axes — where (region) × how (lens), the Part 4 voice;
  // the SCHEMA still carries both as `region` and `lens` (the structural axes are unchanged).
  assert.match(tool('search').description, /where[\s\S]*how|how[\s\S]*where/i)
  assert.deepEqual(Object.keys(tool('search').inputSchema.properties).sort(), ['lens', 'region'])

  // ── (a) read the default present  ≡ search(all, pivot lineage) — the structure table ──
  const aSpec = parseSearchSpec({ lens: { view: 'pivot', rows: 'lineage' } })       // region defaults to all
  assert.equal(aSpec.ok, true)
  const present = await search('u', aSpec.spec, h.lookDeps)
  assert.equal(present.ok && present.view === 'pivot', true)
  log('\n=========== (a) default present — search { lens:{view:pivot,rows:lineage} } ===========\n' + present.text)
  assert.match(present.text, /Kyoto/)

  // ── (b) call up a DIFFERENT table — focus Kyoto, lineage→time, hide a coloring, sort ──
  const bSpec = parseSearchSpec({ lens: { view: 'pivot', rows: 'time', focus: 'Kyoto' } })
  const timeline = await search('u', bSpec.spec, h.lookDeps)
  assert.equal(timeline.ok && timeline.view === 'pivot', true)
  log('\n=========== (b) focus Kyoto, lineage→time — search { lens:{view:pivot,rows:time,focus:Kyoto} } ===========\n' + timeline.text)
  const bHide = parseSearchSpec({ lens: { view: 'pivot', rows: 'time', focus: 'Kyoto', filter: { colorings: { hide: ['truly'] } }, sort: 'id' } })
  const hidden = await search('u', bHide.spec, h.lookDeps)
  assert.equal(hidden.ok, true)
  log('\n=========== (b′) hide a coloring + sort — filter:{colorings:{hide:[truly]}}, sort:id ===========\n' + hidden.text)
  assert.notEqual(hidden.text, timeline.text)   // hiding a coloring changed the table

  // ── (c) search RAW to read a coordinate off a cell ──
  const cSpec = parseSearchSpec({ region: { kind: 'thing', name: 'Kyoto' }, lens: { view: 'raw' } })
  const raw = await search('u', cSpec.spec, h.lookDeps)
  assert.equal(raw.ok && raw.view === 'raw', true)
  log('\n=========== (c) raw cells — search { region:{kind:thing,name:Kyoto}, lens:{view:raw} } ===========\n' + JSON.stringify(raw.cells))
  const cell = raw.cells.find((c: any) => c.who === 'wearer' && c.word === 'Kyoto')
  assert.ok(cell, 'a Kyoto coordinate is readable off a raw cell')
  const pin = { who: cell.who, sc: cell.sc, pos: cell.pos }
  log(`\npicked coordinate to pin → ${JSON.stringify(pin)}`)

  // ── (d) pin the coordinate into a mark + (e) compose ──
  const before = h.placed.length
  const recorded = await recordScoredTurn(
    emissionFromStructured({
      reply: 'Kyoto stays central.',
      replyMarks: [{ word: 1, surface: 'Kyoto', marks: [{ op: 'note' }, { op: 'tie', target: pin }] }],
      priorMarks: [],
    }),
    'llm', 'u', 'sess', { text: 'more on Kyoto' }, h.recDeps,
  )
  log('\n=========== (d+e) compose — pin the coordinate in a tie mark ===========')
  // the R3 door returns the WriteAck (§1a): landed → { landed:true, sc, text } (markCount dropped).
  log(`compose recorded: landed=${recorded.landed}, sc=${recorded.sc}, text=${JSON.stringify(recorded.text)}`)
  assert.ok(recorded.sc > 0, 'the turn recorded')
  // the pinned coordinate survived M4 — a tie (IDENTIFY) homed this turn, targeting the pinned coord.
  const newMarks = h.placed.slice(before)
  const pinned = newMarks.find((p: any) => p.mark.op === 'IDENTIFY' && p.mark.target
    && p.mark.target.who === pin.who && p.mark.target.sc === pin.sc && p.mark.target.pos === pin.pos)
  assert.ok(pinned, 'the pinned coordinate landed as a mark (navigation → coordinate-fetch → pin → compose)')
  log('\nWALK COMPLETE — present → navigate → raw coordinate → pin → compose, all from the tool text.\n')
})
