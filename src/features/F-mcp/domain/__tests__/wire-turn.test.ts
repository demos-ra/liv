// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (§FORK-A) + S1 name-not-count R1
// [F-mcp/domain/__tests__/wire-turn.test.ts]
// Built with LIV · livai.dev
//
// sprint-wire-economy — the demanded `turn` door (one call, BOTH turns).
//   (A) THE DOOR (planToolCall, R1 pure, fail-closed):
//       - a malformed turn (missing replyMarks/priorMarks, or reply, or wearerText) is
//         rejected with a LAW-NAMING error;
//       - a well-formed turn plans the { wearerText, reply, replyMarks, priorMarks } intention.
//   (B) EXECUTION (the mcp-contract turn path, replicated with a DB-free recorder seam):
//       a well-formed turn LANDS BOTH turns AND its marks (present_marks-bound PlacedMarks);
//       scope is the STAMPED session.sessionId; a surface mismatch is rejected loud + atomic.
//   (A2.2) FAILURE-ORDERING: a committed write survives a post-write present-render failure
//         — the turn STILL STANDS and the response states the degradation truthfully.
//   (D) the lookup read control (R8) is unchanged — door + execution.
//   (F) SCOPE-SYMMETRY: a sent `scope` is rejected as an unknown field.
//   (G) READ-DOOR LAW: present + lookup ignore extras (no testimony to protect).
//
// Run: npx tsx --test src/features/F-mcp/domain/__tests__/wire-turn.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'
import { planToolCall } from '../tool-registry'
import { TURN_ARGS } from '../../config/mcp-tools'

// R3-surface pieces (warmed so the F-memory R3 barrel resolves cleanly under tsx).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordScoredTurn: any, emissionFromStructured: any, MarkSurfaceError: any, wordCells: any
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let presentOrDegraded: any, projectEmissionSchema: any, MCP_SITUATION: any
let cutCells: (t: string) => { pos: number; word: string }[]

before(async () => {
  ;({ recordScoredTurn, emissionFromStructured, MarkSurfaceError, projectEmissionSchema, presentOrDegraded } = await import('@/features/F-present/contract/present-contract'))
  ;({ wordCells } = await import('@/features/F-present/domain/coin-score'))
  ;({ cutCells } = await import('@/features/F-memory/exec/raw-turn-write'))
  ;({ MCP_SITUATION } = await import('@/features/F-mcp/contract/mcp-contract'))
})

const WEARER = 'I toured Kyoto'
const REPLY = 'Kyoto truly rivals Tokyo.'
const goodArgs = () => ({
  wearerText: WEARER,
  reply: REPLY,
  replyMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
  priorMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
})

// ── (A) the door is TRANSPORT (cognition-turn contract) ──────────────────────────
// The door no longer validates the emission SHAPE — that concern moved to the CORE contract
// (F-present), the sole validator. The door owns wire-hygiene only: arguments-is-object +
// foreign-field rejection. A structurally-incomplete turn is NOT rejected at the door; it
// PLANS, and the core narrows/validates it (graceful for absences, loud for false claims).
test('a structurally-incomplete turn is NOT rejected at the door — it plans (the core validates)', () => {
  // missing reply, marks, wearerText: the door (transport) admits it; absent fields pass as undefined.
  const r = planToolCall('compose', { reply: 'yo' })
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'turn') return
  assert.equal(r.intention.reply, 'yo')
  assert.equal(r.intention.wearerText, undefined)
  assert.equal(r.intention.replyMarks, undefined)
  assert.equal(r.intention.priorMarks, undefined)
})

test('a non-object arguments is rejected (wire-hygiene — the one structural door check)', () => {
  const r = planToolCall('compose', 'not-an-object')
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /arguments object required/)
})

test('well-formed turn plans the intention (fields pass through unchanged)', () => {
  const r = planToolCall('compose', { wearerText: 'hi there', reply: 'hello', replyMarks: [], priorMarks: [] })
  assert.equal(r.ok, true)
  if (!r.ok) return
  assert.deepEqual(r.intention, { tool: 'turn', wearerText: 'hi there', reply: 'hello', replyMarks: [], priorMarks: [] })
})

// ── (A′) the projected wire schema — DERIVED from the one core contract ───────────
// The `turn`/compose inputSchema is projectEmissionSchema(MCP_SITUATION). It demands all four,
// carries ZERO field hints (§2.4-text 4b — structure is the schema's; the manual teaches), and
// shares the native projection's mark item (the bare-`array` drift is gone). TURN_ARGS (the
// door's extras allow-list) IS its property keys.
test('projectEmissionSchema(MCP_SITUATION): all-four required, wearerText, zero field hints, shared mark item', async () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { SCORE_SCHEMA } = await import('@/features/F-present/domain/coin-score') as any
  const s = projectEmissionSchema(MCP_SITUATION)
  assert.equal(s.type, 'object')
  assert.deepEqual(Object.keys(s.properties), ['wearerText', 'reply', 'replyMarks', 'priorMarks'])
  assert.deepEqual(s.required, ['wearerText', 'reply', 'replyMarks', 'priorMarks'])
  assert.equal(s.additionalProperties, false)
  // FIELD HINTS ARE ZERO: the schema enforces structure silently; no per-field description rides.
  for (const f of ['wearerText', 'reply', 'replyMarks', 'priorMarks']) {
    assert.equal(s.properties[f].description, undefined, `${f} carries no field hint (zero — the manual teaches)`)
  }
  // DRIFT GONE: the wire's mark item is the SAME geometry the native projection advertises.
  assert.deepEqual(s.properties.replyMarks.items, SCORE_SCHEMA.properties.replyMarks.items)
  assert.deepEqual(s.properties.priorMarks.items, s.properties.replyMarks.items)
})

test('transport-safe: the projected turn schema is a flat object, no top-level oneOf/anyOf/allOf', () => {
  const s = projectEmissionSchema(MCP_SITUATION) as Record<string, unknown>
  assert.equal(s.type, 'object')                                   // C1
  for (const k of ['oneOf', 'anyOf', 'allOf']) assert.ok(!(k in s), `no top-level ${k}`)   // C2
  assert.equal(typeof s.properties, 'object')                      // C3
})

test('TURN_ARGS === the projected schema property keys (the door cannot diverge from the advertisement)', () => {
  assert.deepEqual([...TURN_ARGS], Object.keys(projectEmissionSchema(MCP_SITUATION).properties))
})

// the R3 WIRING end-to-end: tools/list injects the PROJECTED inputSchema (not a config copy)
// AND the fill manual onto the turn tool — the two derived views crossing the wire once.
test('tools/list injects the projected inputSchema and the manual on the turn tool (R3 wiring)', async () => {
  const { handleMcpRequest } = await import('@/features/F-mcp/contract/mcp-contract')
  // tools/list does not touch identity — a minimal session stub suffices.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await handleMcpRequest(
    { jsonrpc: '2.0', id: 1, method: 'tools/list' },
    { userId: 'u', sessionId: 's' } as never,
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const turn = res.result.tools.find((t: any) => t.name === 'compose')
  assert.ok(turn, 'the compose tool is listed (public name; internal token stays "turn")')
  assert.deepEqual(turn.inputSchema, projectEmissionSchema(MCP_SITUATION), 'compose advertises the projected emission schema')
  assert.ok(turn.description.includes('FILL MANUAL'), 'the fill manual rides the compose description (once-channel)')
})

// a DB-free recorder seam (mirrors the scored-turn-recorder test).
function stubDeps(replySc: number, wearerSc: number) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const placed: any[] = []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writes: any[] = []
  return {
    deps: {
      readTranscript: async () => [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeRawTurn: async (input: any) => { writes.push(input); return input.who === 'wearer' ? wearerSc : replySc },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store: { read: async () => [], place: async (_u: string, m: any[]) => { placed.push(...m) }, clear: async () => {} },
      cutReply: (r: string) => { const cells = cutCells(r); return { cells, wordCellPos: wordCells(cells).map((c: { pos: number }) => c.pos) } },
      cutCells,
    },
    placed,
    writes,
  }
}

// ── (B) execution — the turn path lands BOTH turns AND its marks ─────────────────
test('a well-formed turn lands both turns and its marks; scope is the stamped sessionId', async () => {
  const plan = planToolCall('compose', goodArgs())
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'turn') return

  // mirror the mcp-contract turn path: narrow through the gate, record with wearer={text}.
  const emission = emissionFromStructured({
    reply: plan.intention.reply, replyMarks: plan.intention.replyMarks, priorMarks: plan.intention.priorMarks,
  })
  const seam = stubDeps(12, 11)
  const recorded = await recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', { text: plan.intention.wearerText }, seam.deps)

  assert.equal(recorded.sc, 12)
  // both turns written: wearer THEN reply; scope stamped = sessionId, never sent.
  assert.equal(seam.writes.length, 2)
  assert.equal(seam.writes[0].who, 'wearer')
  assert.equal(seam.writes[0].scope, 'sess-1')
  assert.equal(seam.writes[1].who, 'llm')
  assert.equal(seam.writes[1].scope, 'sess-1')

  // both turns scored → 2 PlacedMarks (reply identity on llm:12 + prior identity on wearer:11).
  assert.equal(seam.placed.length, 2)
  const homes = seam.placed.map((p: { home: { who: string; sc: number } }) => `${p.home.who}:${p.home.sc}`)
  assert.ok(homes.includes('llm:12'), 'the reply mark homes on this turn (sc 12)')
  assert.ok(homes.includes('wearer:11'), 'the prior mark homes on the freshly-written wearer turn (sc 11)')
})

test('a turn whose mark names a span not in the reply is rejected loud + atomic (nothing written)', async () => {
  const plan = planToolCall('compose', {
    wearerText: WEARER, reply: REPLY,
    replyMarks: [{ surface: 'Osaka', marks: [{ op: 'identity' }] }],   // "Osaka" is not in the reply
    priorMarks: [],
  })
  assert.equal(plan.ok, true)
  if (!plan.ok || plan.intention.tool !== 'turn') return
  const { wearerText, reply, replyMarks, priorMarks } = plan.intention
  const emission = emissionFromStructured({ reply, replyMarks, priorMarks })
  const seam = stubDeps(12, 11)
  await assert.rejects(
    () => recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', { text: wearerText }, seam.deps),
    (e: unknown) => e instanceof MarkSurfaceError,
  )
  assert.equal(seam.writes.length, 0, 'atomic — the loud rejection precedes every write')
})

// the door admits a non-string wearerText (it sheds shape-validation); the CORE absorbs it
// gracefully — empty wearer turn, the reply still records, nothing masked or thrown.
test('a non-string wearerText is absorbed at the core (empty wearer; reply records; not masked)', async () => {
  const plan = planToolCall('compose', {
    wearerText: 123,                                              // not a string — the door admits it
    reply: REPLY,
    replyMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
    priorMarks: [],
  })
  assert.equal(plan.ok, true, 'the door (transport) admits it — shape is the core\'s concern')
  if (!plan.ok || plan.intention.tool !== 'turn') return
  const emission = emissionFromStructured({
    reply: plan.intention.reply, replyMarks: plan.intention.replyMarks, priorMarks: plan.intention.priorMarks,
  })
  const seam = stubDeps(12, 11)
  const recorded = await recordScoredTurn(emission, 'llm', 'user-1', 'sess-1', { text: plan.intention.wearerText }, seam.deps)
  assert.equal(recorded.sc, 12, 'the reply still records — the non-string wearerText did not throw')
  assert.equal(seam.placed.length, 1, 'only the reply mark lands; the wearer turn is empty (graceful)')
  assert.equal(seam.placed[0].home.who, 'llm')
})

// ── (WP1) entitlement gate — the write-door crossing decision ──────────────────────
// A turn is a write crossing; the door admits it only if the perimeter-stamped attribute
// admits (paid|trial). A lapsed crossing is denied AT THE DOOR — before the recorder is
// reached (no DB touched). The default stamp is 'trial' (no provider) → admit, so the gate
// is dormant until a provider feeds 'lapsed' (entitlementAdmits is unit-tested for the
// paid/trial/lapsed logic in F-entitlement; here we prove the door is wired to it).
test('WP1: a lapsed crossing is denied at the turn door (entitlement), the write never reached', async () => {
  const { handleMcpRequest } = await import('@/features/F-mcp/contract/mcp-contract')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await handleMcpRequest(
    { jsonrpc: '2.0', id: 9, method: 'tools/call', params: { name: 'compose', arguments: goodArgs() } },
    { userId: 'u', sessionId: 's', resolvedEntitlement: 'lapsed' } as never,
  )
  assert.ok(res.error, 'the lapsed crossing is denied (a JSON-RPC error, not a result)')
  assert.equal(res.error.code, -32002, 'denied with the entitlement-denied code (write never reached)')
  assert.match(res.error.message, /not admitted/i)
})

// ── (A2.2) failure-ordering — drives the REAL R3 read-door unit (present-or-degraded) ──
// The turn door commits BOTH turns (proven above), THEN renders the present for its response.
// Failure-ordering is owned by the rehomed F-present R3 unit presentOrDegraded (§1b): a present-
// render failure does NOT mask the committed write — the unit returns the named degraded payload.
// Here we drive that real unit with an injected readPresent seam (success then throw) and assert
// its actual returned value — no inline twin of the contract's logic.
const WIRE_BUNDLE = { transcript: false, structure: true, state: true } as const
// the WriteAck handed to the unit (§1a): a LANDED turn carries { landed:true, sc, text }; a dropped
// no-op is { landed:false }. Persistence is read from `landed`, never from `sc`'s value.
const PERSISTED = { landed: true, sc: 12, text: 'x' }
const NO_WRITE = { landed: false }
test('A2.2: presentOrDegraded passes the present through on success; on render failure returns the named degraded payload', async () => {
  // success → the render passes straight through (no envelope).
  const ok = await presentOrDegraded('user-1', WIRE_BUNDLE, PERSISTED, { readPresent: async () => 'PRESENT-TEXT' })
  assert.equal(ok, 'PRESENT-TEXT', 'a successful render passes straight through')

  // failure → the committed turn STILL STANDS; the unit returns the named degraded payload.
  const out = await presentOrDegraded('user-1', WIRE_BUNDLE, PERSISTED, {
    readPresent: async () => { throw new Error('store offline') },
  })
  assert.ok(typeof out !== 'string', 'a render failure yields the degraded payload, not a present string')
  if (typeof out === 'string') return
  assert.equal(out.ok, true, 'the committed turn is reported as success, not failure')
  assert.equal(out.sc, 12, 'the committed turn position is carried back as its coordinate')
  assert.equal(out.present, null, 'present is null — render unavailable, stated not masked')
  assert.match(out.note, /turn recorded; present unavailable: store offline/)
})

// ── HONEST WRITE-ACK — the no-write case (§0 acknowledgement value) ────────────────
// The recorder honestly no-ops on an empty reply (EMPTY → zero rows → toWriteAck → landed:false).
// The present recomputes fine, but a bare present string would read as a persisted write. The unit
// surfaces the truth via `ok` (the SOLE landed/dropped signal): ok false, the intact present
// carried back — soft on incompleteness (no throw). `sc` is null — no state-change, no
// coordinate; NEVER 0 (a fake coordinate). Persistence is read from `ok`, not from `sc`.
test('honest no-write: an empty no-op yields { ok:false, sc:null } carrying the intact present', async () => {
  const out = await presentOrDegraded('user-1', WIRE_BUNDLE, NO_WRITE, { readPresent: async () => 'PRESENT-TEXT' })
  assert.ok(typeof out !== 'string', 'a no-write turn does NOT pass a bare present through — it is acknowledged honestly')
  if (typeof out === 'string') return
  assert.equal(out.ok, false, 'ok is the signal — nothing landed, reported as not-persisted')
  assert.equal(out.sc, null, 'sc is null — no state-change, no coordinate (never 0, a fake coordinate)')
  assert.equal(out.present, 'PRESENT-TEXT', 'the present recomputed unchanged and is carried back intact')
  assert.match(out.note, /no testimony recorded \(empty reply\); present unchanged/)
})

// sc is a COORDINATE, never a persistence signal: ok carries persistence even when a real
// store numbers a turn at position 0 — a landed turn at sc 0 is still ok:true (not a no-op).
test('sc never doubles as the persistence signal: a persisted turn at sc 0 is ok (not read as a no-write)', async () => {
  const out = await presentOrDegraded('user-1', WIRE_BUNDLE, { landed: true, sc: 0, text: 'x' }, {
    readPresent: async () => { throw new Error('x') },
  })
  assert.ok(typeof out !== 'string')
  if (typeof out === 'string') return
  assert.equal(out.ok, true, 'landed ⇒ persisted ⇒ ok true, even at coordinate 0 — sc value is not the signal')
  assert.equal(out.sc, 0, 'the real coordinate (0) is carried back as the coordinate, not as a not-persisted marker')
})

// ── SEAL VERIFY — compose returns a result + view, never projection structure ──────
// Both non-pass-through acks (render-failure, no-write) cross the door as { ok, sc, present,
// note }: `present` is rendered text or null — never a grid, pivot, or PlacedMark. The pass-
// through is a plain view string. No projection internals leak through compose's return.
test('seal: every compose return is a view string or a {ok,sc,present,note} ack — never projection structure', async () => {
  const SEAL_KEYS = ['ok', 'sc', 'present', 'note']
  const noWrite = await presentOrDegraded('user-1', WIRE_BUNDLE, NO_WRITE, { readPresent: async () => 'VIEW' })
  const degraded = await presentOrDegraded('user-1', WIRE_BUNDLE, PERSISTED, { readPresent: async () => { throw new Error('x') } })
  for (const out of [noWrite, degraded]) {
    assert.ok(typeof out !== 'string')
    if (typeof out === 'string') continue
    assert.deepEqual(Object.keys(out).sort(), [...SEAL_KEYS].sort(), 'the ack carries exactly the named shape — no engine internals')
    assert.ok(out.present === null || typeof out.present === 'string', 'present is rendered text or null — never a grid/projection')
  }
  const passThrough = await presentOrDegraded('user-1', WIRE_BUNDLE, PERSISTED, { readPresent: async () => 'VIEW' })
  assert.equal(passThrough, 'VIEW', 'a persisted write passes the view straight through')
})

// ── (E) extras gate — the turn is a WRITE door (FIX-2, carried) ───────────────────
test('turn: an unknown field is rejected, law named', () => {
  const r = planToolCall('compose', { ...goodArgs(), bogus: true })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "bogus"/)
  assert.match(r.message, /additionalProperties:false/)
})

// ── (F) scope-symmetry — scope is circumstance, not testimony ────────────────────
test('turn: a sent scope is rejected as an unknown field', () => {
  const r = planToolCall('compose', { ...goodArgs(), scope: 'proj-1' })
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /unknown field "scope"/)
})

// ── (D) the search read door is TRANSPORT (region × lens) ─────────────────────────
// The door no longer validates the selector — search is region × lens and the CORE
// (parseSearchSpec, exercised in search-text-pivot.test) is the sole validator. The door
// owns wire-hygiene only: arguments-is-object, then the raw payload rides through unchanged.
test('a search payload plans the raw intention (the core validates region × lens)', () => {
  const args = { region: { kind: 'thing', name: 'Kyoto' }, lens: { view: 'table', rows: 'time', focus: 'Kyoto' } }
  const r = planToolCall('search', args)
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'lookup') return
  assert.deepEqual(r.intention, { tool: 'lookup', raw: args })
})

test('search: a non-object arguments is rejected (the one structural door check)', () => {
  const r = planToolCall('search', 'not-an-object')
  assert.equal(r.ok, false)
  if (r.ok) return
  assert.match(r.message, /arguments object required/)
})

// ── (G) read-door law (RD) — reads ignore extras ──────────────────────────────────
// E1: present (summary) carries ONE optional capture payload (wearerText, the submitted prompt);
// every OTHER extra is still ignored. A bare summary (no wearerText) plans wearerText:undefined —
// the R3 door reads it as a pure read (no capture); a summary WITH wearerText plans the capture.
test('present: extra lifecycle-envelope fields are ignored; a bare summary is a pure read (wearerText undefined)', () => {
  const r = planToolCall('summary', { source: 'startup', session_id: 'x' })
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'present') return
  assert.equal(r.intention.wearerText, undefined, 'no wearerText carried → pure read at R3 (no capture)')
})

// E1: summary at the turn's ENTRY carries the submitted wearer prompt — the door plans it as the
// capture payload; R3 fires captureWearerTurn (writeRawTurn) then delivers the present.
test('present: a summary carrying wearerText plans the capture payload (E1 capture-at-submit)', () => {
  const r = planToolCall('summary', { wearerText: 'I toured Kyoto', source: 'UserPromptSubmit' })
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'present') return
  assert.equal(r.intention.wearerText, 'I toured Kyoto', 'the submitted prompt rides as the capture payload')
})

test('search: a raw payload plus extra envelope fields rides through (read door ignores extras)', () => {
  const args = { lens: { view: 'raw' }, source: 'startup', session_id: 'x' }
  const r = planToolCall('search', args)
  assert.equal(r.ok, true)
  if (!r.ok || r.intention.tool !== 'lookup') return
  assert.deepEqual(r.intention, { tool: 'lookup', raw: args })
})
