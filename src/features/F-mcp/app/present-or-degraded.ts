// @liv-standard v1.5.2
// @governing-spec MCP-wire (connector) + COIN v1.0 (read-engine)
// [F-mcp/R2]
// Built with LIV · livai.dev
// [F-mcp/app/present-or-degraded.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-mcp
// category:   Modality
// layer:      R2
// wires-in:
//   W-INJECT  readPresent       F-present/R3 present-contract   (the rendered present — default dep)
// wires-out:
//   W-FN      presentOrDegraded  →  F-mcp/R3 contract (the turn door's post-write response)
//   W-ATOM    DegradedPresent    →  F-mcp/R3 contract (the single named degraded payload — one home)
// deps:
//   R3  @/features/F-present/contract/present-contract
// validated:  2026-06-15
//
// ─────────────────────────────────────────────────────────────────────────────
// POST-WRITE PRESENT-OR-DEGRADED (R2). The turn door (R3) commits BOTH turns, THEN
// renders the fresh present for its response. FAILURE-ORDERING (A2.2): the write has
// ALREADY committed — so if the present render throws, the turn STILL STANDS. This unit
// owns that ordering: try the render → return it; on failure → return the ONE named
// degraded payload, which states the truth (the turn WAS recorded; the present is the
// only thing unavailable). It never masks a committed write as a failure.
//
// The named degraded value lives HERE and nowhere else; the R3 door stays thin (it calls
// this unit, it does not carry the try/catch). A4 (isolated execution): readPresent is
// INJECTED — default-bound to the live F-present R3 surface; the test drives a throwing
// seam to exercise the degraded branch against the REAL unit.
//
// HONEST WRITE-ACK (§0): see body.
// ─────────────────────────────────────────────────────────────────────────────

import { readPresent } from '@/features/F-present/contract/present-contract'

// The ONE named honest-acknowledgement payload — returned when a bare present would lie.
// `ok` is the SOLE landed/dropped signal (true = the turn stands, false = nothing landed);
// a reader infers persistence from `ok` alone, NEVER from `sc`. `sc` is purely the
// state-change coordinate — a real position when one exists, `null` when there is none (no
// state-change = no coordinate; never 0, which would be a fake coordinate colliding with a
// real first turn if the store ever numbered from 0). Two truths share the shape: a committed
// turn whose present render failed (`ok` true, `sc` its position, `present` null — the only
// thing unavailable), and an honest no-write (`ok` false, `sc` null, `present` carried intact —
// it recomputed unchanged). The R3 door JSON-serializes it into the tool text — a result +
// view, never projection structure (the seal holds: `present` is rendered text, never a grid).
export type DegradedPresent = { ok: boolean; sc: number | null; present: string | null; note: string }

// readPresent is the only ambient dep; default-bound to the live F-present R3 surface. The
// bundle type is readPresent's own 2nd parameter — sourced through the R3 surface, with no
// reach into F-present's config (the slice boundary holds).
type PresentBundle = NonNullable<Parameters<typeof readPresent>[1]>
export type PresentOrDegradedDeps = {
  readPresent: (userId: string, bundle: PresentBundle) => Promise<string>
}
function defaultDeps(): PresentOrDegradedDeps {
  return { readPresent }
}

// The recorder's outcome, narrowed to what the ack needs: `cells` is the written reply grid
// (empty ⇔ the recorder honestly no-op'd — an empty reply wrote zero rows) and `sc` is the
// reply's substrate position when one was assigned. PERSISTENCE IS READ FROM `cells`, the write
// evidence — NEVER from `sc`'s value (a coordinate is not a signal). Structural, so the door
// hands its RecordedTurn straight in with no cross-slice type reach.
type Recorded = { sc: number; cells: unknown[] }

// Render the wearer's present for the turn door's response and acknowledge HONESTLY:
//   - no-write (recorder no-op'd — `cells` empty): nothing landed → { ok:false, sc:null, … }.
//     The present recomputed unchanged and is carried back intact; soft on incompleteness
//     (no throw, no reject) — only the acknowledgement is made honest, so the model's context
//     finally gets the signal the write dropped. `sc` is null: no state-change, no coordinate.
//   - render throws: the write already committed (`recorded.sc` is its position) → the turn
//     STILL STANDS → { ok:true, sc, present:null, … }; a committed write is never masked. (If
//     a no-op's render also throws, stay honest: ok:false, sc:null — never claim "recorded".)
//   - otherwise: pass the rendered present straight through (a persisted write, a view out).
export async function presentOrDegraded(
  userId: string,
  bundle: PresentBundle,
  recorded: Recorded,
  deps: PresentOrDegradedDeps = defaultDeps(),
): Promise<string | DegradedPresent> {
  const persisted = recorded.cells.length > 0
  try {
    const present = await deps.readPresent(userId, bundle)
    if (!persisted) return { ok: false, sc: null, present, note: 'no testimony recorded (empty reply); present unchanged' }
    return present
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    if (!persisted) return { ok: false, sc: null, present: null, note: `no testimony recorded (empty reply); present unavailable: ${reason}` }
    return { ok: true, sc: recorded.sc, present: null, note: `turn recorded; present unavailable: ${reason}` }
  }
}
