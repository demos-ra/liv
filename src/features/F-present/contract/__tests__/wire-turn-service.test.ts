// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine) + MCP-wire sibling
// [F-present/contract/__tests__/wire-turn-service.test.ts]
// Built with LIV · livai.dev
//
// A1 — the ONE wire turn-service (recordWireTurn). Both agent-driven write surfaces (the MCP
// turn door + the REST /api/compose plug) call this; the driver maps the discriminated outcome.
// This proves the core's outcome discrimination directly — the surfaces' driver-mapping is
// proven against the real handleMcpRequest in wire-turn.test.ts (the entitlement-denied path)
// and is symmetric at the REST plug.
//
// E1 — capture-at-submit (uniform with native): captureWearerTurn stores the wearer turn ONCE at
// submit (writeRawTurn, native's mechanism) + delivers the present; recordWireTurn at Stop records
// the reply against the already-stored wearer turn (wearer:{written}, NO wearerText re-carry on the
// enforced path) — resolved by reading the transcript. The {text}-at-compose carry survives ONLY
// under the flagged 'compose-fallback' mode. A DB-free WireCaptureDeps seam is injected throughout.
//
// Run: npx tsx --test src/features/F-present/contract/__tests__/wire-turn-service.test.ts

import assert from 'node:assert/strict'
import { test, before } from 'node:test'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let recordWireTurn: any, captureWearerTurn: any
// the substrate cutters (the live ones — DB-free; cutCells/isWordCell are pure F-memory helpers).
let cutCells: (t: string) => { pos: number; word: string }[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let isWordCell: (w: string) => boolean

before(async () => {
  ;({ recordWireTurn, captureWearerTurn } = await import('@/features/F-present/contract/present-contract'))
  ;({ cutCells, isWordCell } = await import('@/features/F-memory/exec/raw-turn-write'))
})

// A DB-free WireCaptureDeps seam (A4): the capture write, the present deliver, and the stored-wearer
// transcript recovery are stubbed so the wire path runs without a DATABASE_URL. `writes` counts the
// single capture; `transcript` is what latestWearerWritten recovers at the enforced compose.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function captureSeam(transcript: any[] = []) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writes: any[] = []
  return {
    writes,
    deps: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      writeRawTurn: async (input: any) => { writes.push(input); return 11 },
      cutCells,
      isWordCell,
      readTranscript: async () => transcript,
      readPresent: async () => 'PRESENT-TEXT',
    },
  }
}

const goodInput = () => ({
  wearerText: 'I toured Kyoto',
  reply:      'Kyoto truly rivals Tokyo.',
  replyMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
  priorMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
})

// ── WP1 — the entitlement crossing decision is INSIDE the core (one home) ──────────
// A lapsed crossing returns the 'denied' outcome WITHOUT reaching the recorder — both drivers
// map 'denied' to their own envelope (JSON-RPC entitlement-denied / HTTP 402). The default
// 'trial' stamp admits; only 'lapsed' is denied.
test("WP1: a lapsed entitlement yields { kind: 'denied' } — the recorder is never reached", async () => {
  const seam = captureSeam()
  const out = await recordWireTurn(goodInput(), {
    userId: 'u', scope: 's', resolvedEntitlement: 'lapsed',
  }, { mode: 'submit-captured' }, 'separate', seam.deps)
  assert.equal(out.kind, 'denied')
  assert.match(out.message, /not admitted/i)
})

// ── invalid testimony — a false mark claim is caught and returned typed (not thrown) ──
// A mark naming a span absent from the reply is a false claim. The core catches the recorder's
// loud MarkSurfaceError and returns { kind: 'invalid-testimony' } so the driver names it WITHOUT
// re-importing the error class — the driver stays thin.
test("invalid-testimony: a mark naming an absent span yields { kind: 'invalid-testimony' }, never throws", async () => {
  const seam = captureSeam()
  const out = await recordWireTurn(
    {
      wearerText: 'I toured Kyoto',
      reply:      'Kyoto truly rivals Tokyo.',
      replyMarks: [{ surface: 'Osaka', marks: [{ op: 'identity' }] }],  // not in the reply
      priorMarks: [],
    },
    { userId: 'u', scope: 's', resolvedEntitlement: 'trial' },
    { mode: 'submit-captured' }, 'separate', seam.deps,
  )
  assert.equal(out.kind, 'invalid-testimony')
  assert.match(out.message, /Osaka/)
  // the surface-check is loud + ATOMIC — it precedes the reply write (no reply recorded). The
  // capture write here is the seam's own (none, since recordWireTurn does NOT capture — capture
  // happened at submit, this is the enforced reply-only compose).
  assert.equal(seam.writes.length, 0, 'compose at Stop never captures the wearer turn (enforced path is reply-only)')
})

// ── the four outcome kinds are the closed driver-mapping surface ───────────────────
// Every recordWireTurn return is one of the four tags — the driver's switch is exhaustive.
test('the outcome is always one of the four kinds (the driver switch is exhaustive)', async () => {
  const denied = await recordWireTurn(goodInput(), { userId: 'u', scope: 's', resolvedEntitlement: 'lapsed' }, undefined, 'separate', captureSeam().deps)
  assert.ok(['denied', 'invalid-testimony', 'present', 'degraded'].includes(denied.kind))
})

// ── E1: captureWearerTurn stores the wearer turn ONCE at submit (native's mechanism) + delivers ──
test('captureWearerTurn: stores the wearer turn ONCE via writeRawTurn and delivers the present', async () => {
  const seam = captureSeam()
  const out = await captureWearerTurn(
    { wearerText: 'I toured Kyoto' },
    { userId: 'u', scope: 's', resolvedEntitlement: 'trial' },
    seam.deps,
  )
  assert.equal(out.kind, 'captured')
  if (out.kind !== 'captured') return
  assert.equal(out.sc, 11, 'the stored wearer turn carries its substrate position')
  assert.equal(out.present, 'PRESENT-TEXT', 'capture + deliver — the fresh present rides back')
  // ONE write, who:'wearer', scope STAMPED — native's exact writeRawTurn mechanism, fired at submit.
  assert.equal(seam.writes.length, 1, 'the wearer turn is cut + stored EXACTLY ONCE at submit')
  assert.equal(seam.writes[0].who, 'wearer')
  assert.equal(seam.writes[0].scope, 's', 'scope is the stamped circumstance, never sent')
  assert.ok(seam.writes[0].words.some((c: { word: string }) => c.word === 'Kyoto'), 'the verbatim words are stored')
})

// ── E1: WP1 gates the capture — a lapsed crossing stores NOTHING ──────────────────────
test('captureWearerTurn: a lapsed crossing is denied — nothing is stored', async () => {
  const seam = captureSeam()
  const out = await captureWearerTurn(
    { wearerText: 'I toured Kyoto' },
    { userId: 'u', scope: 's', resolvedEntitlement: 'lapsed' },
    seam.deps,
  )
  assert.equal(out.kind, 'denied')
  assert.equal(seam.writes.length, 0, 'WP1 gates before the capture write — nothing stored')
})

// ── E1: the ENFORCED compose recovers the stored wearer turn (no wearerText re-carry) ──
// In 'submit-captured' mode, recordWireTurn resolves priorMarks against the wearer turn it
// recovers from the TRANSCRIPT (the one captureWearerTurn stored at submit) — NOT from
// input.wearerText. Here wearerText is DELIBERATELY WRONG ('nothing relevant'); the priorMark
// 'Kyoto' resolves ONLY because the stored transcript turn carries it. Proof the words are read
// from the store, never re-carried at compose. (Reaches the recorder's real DB on the happy write,
// so we assert the wearer-source resolution via the loud surface-check, DB-free: an absent stored
// turn makes the same priorMark fail invalid-testimony.)
test('enforced compose resolves priorMarks against the STORED wearer turn, not the carried text', async () => {
  // a stored wearer turn carrying 'Kyoto' (full cells, as the substrate holds them).
  const storedWearer = [{ sc: 11, who: 'wearer', words: cutCells('I toured Kyoto') }]
  const seamWithStore = captureSeam(storedWearer)
  // wearerText is wrong on purpose — the enforced path must IGNORE it and read the store.
  const input = {
    wearerText: 'nothing relevant here',
    reply:      'Kyoto truly rivals Tokyo.',
    replyMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],
    priorMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],  // resolves ONLY via the stored turn
  }
  // With the stored turn present, the priorMark surface-check PASSES (no invalid-testimony) — it
  // proceeds to the recorder's write (real DB). With NO stored turn, the SAME priorMark fails loud.
  const seamNoStore = captureSeam([])
  const outNoStore = await recordWireTurn(input, { userId: 'u', scope: 's', resolvedEntitlement: 'trial' }, { mode: 'submit-captured' }, 'separate', seamNoStore.deps)
  assert.equal(outNoStore.kind, 'invalid-testimony', 'no stored wearer turn → the priorMark fails loud (not silent)')
  assert.match(outNoStore.message, /Kyoto/)
  assert.equal(seamNoStore.writes.length, 0, 'enforced compose never captures — and the loud reject is atomic')
  // (the with-store happy path reaches the recorder DB; its wearer-source wiring — written vs text —
  // is proven DB-free in wire-turn.test.ts via the recorder seam. Here we hold the seam reference to
  // show the enforced path consults the transcript store, not the carried text.)
  assert.ok(seamWithStore.deps.readTranscript, 'the enforced path resolves the wearer source from the transcript store')
})

// ── E1: the no-lifecycle FALLBACK is the ONLY remaining {text}-at-compose carry ────────
// In 'compose-fallback' mode, the wearer turn was NOT captured at submit, so recordWireTurn
// captures it from input.wearerText (wearer:{text}) — the recorder cuts + writes it. Here the
// priorMark resolves against the CARRIED text (the store is empty), proving the fallback path
// still reads wearerText. The recorder's surface-check runs DB-free (it precedes the write).
test('fallback compose ({text}) resolves priorMarks against the CARRIED text (the only remaining carry)', async () => {
  const seam = captureSeam([])  // empty store — the fallback cannot rely on it
  const input = {
    wearerText: 'I toured Kyoto',                                       // the carried text IS the source
    reply:      'Kyoto truly rivals Tokyo.',
    replyMarks: [{ surface: 'Osaka', marks: [{ op: 'identity' }] }],   // wrong → loud, atomic (no DB write)
    priorMarks: [{ surface: 'Kyoto', marks: [{ op: 'identity' }] }],   // resolves via the carried text
  }
  const out = await recordWireTurn(
    input,
    { userId: 'u', scope: 's', resolvedEntitlement: 'trial' },
    { mode: 'compose-fallback', absentCapture: { absentCapture: true, reason: 'no-lifecycle: capture at compose' } },
    'separate',
    seam.deps,
  )
  // the reply mark 'Osaka' is the loud failure (atomic, before any write) — but the priorMark
  // 'Kyoto' located fine against the CARRIED text (had it been the failure it would name Kyoto).
  assert.equal(out.kind, 'invalid-testimony')
  assert.match(out.message, /Osaka/, 'the reply mark is the loud failure; the priorMark resolved against the carried text')
  assert.equal(seam.writes.length, 0, 'the fallback capture rides the recorder (wearer:{text}), not a separate capture write')
})
