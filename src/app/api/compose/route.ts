// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine) + MCP-wire sibling
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/compose/route.ts]
//
// REST POST handler for /api/compose — the write sibling of /api/present, the
// matching REST plug owed to make REST a true sibling of MCP (Blueprint §2.4).
// THE SEAL'S PROOF (§2.3): this route bolts onto the R3 contract alone
// (present-contract: recordWireTurn) — it reaches NO engine internal. That it can be
// written as a thin adapter with no reach inside confirms the door's seal holds.
//
// A1 (turn-services → one core) + E1 (capture-at-submit): the wire write turn-service —
// the WP1 entitlement crossing decision, deliver/narrow through the SAME gate the native +
// MCP paths use, record the reply + both mark sets (who:'llm', scope = the stamped
// session.sessionId, userId = session.userId, never the body), and the honest post-write
// present-or-degraded ack (§1b) — is the ONE core recordWireTurn (F-present R3). REST has no
// lifecycle submit phase, so it cannot capture at submit: it carries wearerText inline and
// captures at compose under the honest 'compose-fallback' mode (an AbsentCaptureFlag — the only
// remaining {text}-at-compose carry; the MCP rail captures at submit, reply-only at Stop). This
// route is the per-surface DRIVER
// (Mechanics §F): consult the perimeter (401 if absent), call the core, and MAP the typed
// WireTurnOutcome to HTTP codes. The MCP door derives the same core and maps the same outcome
// to JSON-RPC codes — one home, two thin drivers. A committed write whose present-render throws
// STILL STANDS (no masked 500); a false mark claim is a named 400 (invalid testimony), symmetric
// with the MCP door's INVALID_PARAMS.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import { recordWireTurn } from '@/features/F-present/contract/present-contract'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json(
      { ok: false, error: { code: 'COMPOSE_AUTH_REJECTED', message: 'unauthenticated' } },
      { status: 401 },
    )
  }

  const body = (await req.json().catch(() => null)) as
    | { wearerText?: unknown; reply?: unknown; replyMarks?: unknown; priorMarks?: unknown }
    | null

  // A1/E1 — the wire write turn-service (the WP1 entitlement crossing decision, deliver/narrow
  // through the SAME gate the native + MCP paths use, record the reply + both mark sets, the honest
  // post-write present-or-degraded ack) is the ONE core recordWireTurn (F-present R3). userId/scope
  // come from the stamped session (never the body). This REST plug is the per-surface DRIVER
  // (Mechanics §F): it maps the typed WireTurnOutcome to HTTP codes — symmetric with the MCP door.
  //
  // E1 CAPTURE MODE — REST is a SINGLE POST with no lifecycle submit phase: it cannot capture the
  // wearer turn at submit, so it carries wearerText INLINE and captures at compose. That is the
  // honest NO-LIFECYCLE FALLBACK ('compose-fallback' + an AbsentCaptureFlag) — the only remaining
  // {text}-at-compose carry. The MCP rail (with its UserPromptSubmit hook) captures at submit and
  // records reply-only; REST, lacking that hook, is the flagged degraded-but-named path.
  const outcome = await recordWireTurn(
    {
      wearerText: body?.wearerText,
      reply:      body?.reply,
      replyMarks: body?.replyMarks,
      priorMarks: body?.priorMarks,
    },
    {
      userId:              session.userId,
      scope:               session.sessionId,
      resolvedEntitlement: session.resolvedEntitlement,
    },
    {
      mode: 'compose-fallback',
      absentCapture: {
        absentCapture: true,
        reason: 'REST /api/compose: no lifecycle submit phase — capture(M1) is not enforced at submit; the wearer turn is captured at compose from inline wearerText (flagged, not silent)',
      },
    },
  )

  switch (outcome.kind) {
    // WP1: a not-admitted crossing — denied before the recorder, mapped to HTTP 402.
    case 'denied':
      return NextResponse.json(
        { ok: false, error: { code: 'COMPOSE_ENTITLEMENT_DENIED', message: outcome.message } },
        { status: 402 },
      )
    // A false mark claim (word-index↔surface mismatch) — loud + atomic, nothing persisted. Named
    // (law-named) so the caller re-emits — invalid testimony, not an internal error (HTTP 400).
    case 'invalid-testimony':
      return NextResponse.json(
        { ok: false, error: { code: 'COMPOSE_INVALID_TESTIMONY', message: outcome.message } },
        { status: 400 },
      )
    // The happy path — the fresh present (the resulting memory) straight through, the read sibling's shape.
    case 'present':
      return NextResponse.json({ ok: true, data: { present: outcome.present } })
    // The honest ack (§1b / A2.2): a committed write whose render threw STILL STANDS (ok:true,
    // present:null, sc) at 200 — no longer a masked 500; a dropped no-op is ok:false, present
    // (unchanged), sc:null. Never a value that looks persisted when it wasn't.
    case 'degraded':
      return NextResponse.json({
        ok:   outcome.degraded.ok,
        data: { present: outcome.degraded.present, sc: outcome.degraded.sc, note: outcome.degraded.note },
      })
  }
}
