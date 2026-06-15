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
// ─────────────────────────────────────────────────────────────────────────────

import { readPresent } from '@/features/F-present/contract/present-contract'

// The ONE named degraded payload — a committed turn whose present render failed. `ok`
// stays true (the write stands); `present` is null (the only thing unavailable); `note`
// states the degradation in plain words. The R3 door JSON-serializes it into the tool text.
export type DegradedPresent = { ok: true; sc: number; present: null; note: string }

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

// Render the wearer's present for the turn door's response; on render failure return the
// named degraded payload (the write has already committed — `sc` is its substrate position).
export async function presentOrDegraded(
  userId: string,
  bundle: PresentBundle,
  sc: number,
  deps: PresentOrDegradedDeps = defaultDeps(),
): Promise<string | DegradedPresent> {
  try {
    return await deps.readPresent(userId, bundle)
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err)
    return { ok: true, sc, present: null, note: `turn recorded; present unavailable: ${reason}` }
  }
}
