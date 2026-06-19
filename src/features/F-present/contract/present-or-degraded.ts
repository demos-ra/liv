// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine) + the honest write-ack (§0/§2.3)
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-or-degraded.ts]
//
// @manifest
// standard:   LIV-Standard v1.5.2
// slice:      F-present
// layer:      R3
// wires-in:
//   W-FN      readPresent       ./read-surface (in-layer R3 — the rendered present; default dep)
//   W-ATOM    WriteAck          ../config/write-ack-types (R0 — the honest acknowledgement)
// wires-out:
//   W-FN      presentOrDegraded  →  surfaced via present-contract → F-mcp turn door + /api/compose (REST)
//   W-ATOM    DegradedPresent    →  surfaced via present-contract (the single named degraded payload — one home)
// deps:
//   R3  ./read-surface              (in-layer — dodges the R3↔R2 cycle a naive app/ move would create)
//   R0  ../config/write-ack-types
//
// ─────────────────────────────────────────────────────────────────────────────
// POST-WRITE PRESENT-OR-DEGRADED (R3 read-door). RAIL-AGNOSTIC (§1b, F4→a): BOTH write
// rails — the MCP turn door and the REST /api/compose route — commit the turn(s) at the
// door, THEN render the fresh present for the response. This unit owns the FAILURE-ORDERING
// (A2.2): the write has ALREADY committed — so if the present render throws, the turn STILL
// STANDS. It homes in F-present's READ-DOOR (beside read-surface), NOT app/, NOT F-mcp: that
// lets it import readPresent IN-LAYER (dodging the R3↔R2 cycle a naive app/ move would create)
// and lets BOTH rails derive the ONE shared honest ack. It never masks a committed write as a
// failure — the §2.3 dishonesty REST used to commit as a 500 (its post-write readPresent throw)
// is closed here: REST now derives this same guard.
//
// It reads the honest WriteAck (§1a) — persistence from `landed`, the write evidence, NEVER
// from sc. The named degraded value lives HERE and nowhere else; the door stays thin (it calls
// this unit, it does not carry the try/catch). A4 (isolated execution): readPresent is INJECTED
// — default-bound to the in-layer read surface; the test drives a throwing seam to exercise the
// degraded branch against the REAL unit.
// ─────────────────────────────────────────────────────────────────────────────

import { readPresent } from './read-surface'
import type { WriteAck } from '../config/write-ack-types'

// The ONE named honest-acknowledgement payload — returned when a bare present would lie.
// `ok` is the SOLE landed/dropped signal (true = the turn stands, false = nothing landed); a
// reader infers persistence from `ok` alone, NEVER from `sc`. `sc` is purely the state-change
// coordinate — a real position when one exists, `null` when there is none (no state-change = no
// coordinate; never 0, which would be a fake coordinate colliding with a real first turn if the
// store ever numbered from 0). Two truths share the shape: a committed turn whose present render
// failed (`ok` true, `sc` its position, `present` null — the only thing unavailable), and an
// honest no-write (`ok` false, `sc` null, `present` carried intact — it recomputed unchanged).
// The door JSON-serializes it into the response — a result + view, never projection structure
// (the seal holds: `present` is rendered text, never a grid).
export type DegradedPresent = { ok: boolean; sc: number | null; present: string | null; note: string }

// readPresent is the only ambient dep; default-bound to the in-layer read surface (read-surface,
// same R3). The bundle type is readPresent's own 2nd parameter — no reach past the surface.
type PresentBundle = NonNullable<Parameters<typeof readPresent>[1]>
export type PresentOrDegradedDeps = {
  readPresent: (userId: string, bundle: PresentBundle) => Promise<string>
}
function defaultDeps(): PresentOrDegradedDeps {
  return { readPresent }
}

// Render the wearer's present for a write door's response and acknowledge HONESTLY from the
// WriteAck — persistence is `ack.landed`, NEVER sc's value (a coordinate is not a signal):
//   - dropped (`ack.landed` false — the recorder no-op'd an empty reply): nothing landed →
//     { ok:false, sc:null, … }. The present recomputed unchanged and is carried back intact;
//     soft on incompleteness (no throw, no reject) — only the acknowledgement is made honest, so
//     the caller's context finally gets the signal the write dropped. `sc` is null: no coordinate.
//   - render throws on a LANDED write: the write already committed (`ack.sc` is its position) →
//     the turn STILL STANDS → { ok:true, sc, present:null, … }; a committed write is never
//     masked. (If a dropped turn's render also throws, stay honest: ok:false, sc:null.)
//   - otherwise: pass the rendered present straight through (a landed write, a view out).
export async function presentOrDegraded(
  userId: string,
  bundle: PresentBundle,
  ack: WriteAck,
  deps: PresentOrDegradedDeps = defaultDeps(),
): Promise<string | DegradedPresent> {
  try {
    const present = await deps.readPresent(userId, bundle)
    if (!ack.landed) return { ok: false, sc: null, present, note: 'no testimony recorded (empty reply); present unchanged' }
    return present
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    if (!ack.landed) return { ok: false, sc: null, present: null, note: `no testimony recorded (empty reply); present unavailable: ${reason}` }
    return { ok: true, sc: ack.sc, present: null, note: `turn recorded; present unavailable: ${reason}` }
  }
}
