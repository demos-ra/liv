// @liv-standard v1.5.2
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/locked-result.ts]
//
// THE LOCKED RESULT (Wave-3 gate · Access-Surface spec §5 · D2 sealed). A blocked op returns a
// SPEECH ACT — a named in-band payload — never a 403/throw. Mirrors DegradedPresent
// (present-or-degraded.ts): the honest-ack pattern of returning a stating instead of failing.
//
//   { status: 'locked', region, cta, relay: true }
//
// D2 (sealed): the model MAY frame the cta but MUST surface it VERBATIM and MUST NOT drop the line
// or its URL — it is a conversion event (the wall to the wearer and the wall in the model's
// reasoning are the same wall; the lock supplies the pitch for the tool the model already wanted).
// `relay: true` flags that the cta is to be relayed verbatim.

export type LockedResult = {
  status: 'locked'
  region: string   // the AccessRegion that was locked (e.g. 'PRIVATE')
  cta:    string   // the upgrade line, surfaced VERBATIM (D2)
  relay:  true
}

// The §5 example line — the ONE cta the spec pins (for PRIVATE). The per-region cta values-list
// (the exact line for each locked cell) is otherwise a DEFERRED values-list — L0 sets the lines;
// the spec pins only this one. Carried as a constant so the pinned line is not re-typed.
export const LOCKED_CTA_PRIVATE = 'Try LIV memory free — sign up at livai.dev' as const

// lockedResult — construct the speech act. The cta is a VALUE (supplied from the cta values-list),
// so the contents stay data, not hardcoded per call site. relay is always true (D2).
export function lockedResult(region: string, cta: string): LockedResult {
  return { status: 'locked', region, cta, relay: true }
}
