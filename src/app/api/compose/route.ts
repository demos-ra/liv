// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine) + MCP-wire sibling
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/compose/route.ts]
//
// REST POST handler for /api/compose — the write sibling of /api/present, the
// matching REST plug owed to make REST a true sibling of MCP (Blueprint §2.4).
// THE SEAL'S PROOF (§2.3): this route bolts onto the R3 contract alone
// (present-contract: emissionFromStructured / recordScoredTurn / presentOrDegraded) —
// it reaches NO engine internal. That it can be written as a thin adapter with no
// reach inside confirms the door's seal holds.
//
// Thin (R4 discipline): consult the perimeter, 401 if absent; narrow the body
// through the SAME gate the native + MCP paths use (emissionFromStructured), record
// BOTH turns (recordScoredTurn — who:'llm', scope = the stamped session.sessionId,
// userId = session.userId, never the body), and derive the post-write present-or-degraded
// ack (§1b — REST now owns the SAME guard as MCP: a committed write whose present-render
// throws STILL STANDS, no longer masked as a 500). A false claim (word-index↔surface
// mismatch) is rejected loud + atomic as 400 (invalid testimony, named) — symmetric with
// the MCP door's MarkSurfaceError → INVALID_PARAMS.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import {
  emissionFromStructured,
  recordScoredTurn,
  MarkSurfaceError,
  presentOrDegraded,
  PRESENT_BUNDLES,
} from '@/features/F-present/contract/present-contract'

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

  // The core contract is the sole validator (the door is transport): narrow reply/marks
  // through the same gate, absorb a non-string wearerText gracefully at the recorder.
  const emission = emissionFromStructured({
    reply: body?.reply, replyMarks: body?.replyMarks, priorMarks: body?.priorMarks,
  })

  let ack
  try {
    ack = await recordScoredTurn(emission, 'llm', session.userId, session.sessionId, { text: body?.wearerText })
  } catch (err) {
    if (err instanceof MarkSurfaceError) {
      return NextResponse.json(
        { ok: false, error: { code: 'COMPOSE_INVALID_TESTIMONY', message: err.message } },
        { status: 400 },
      )
    }
    throw err
  }

  // The response carries the fresh present (the resulting memory) — the read sibling's shape.
  // REST derives the SAME post-write present-or-degraded guard as MCP (§1b): the honest write-ack
  // (landed/dropped, never a fake coordinate) and the failure-ordering (A2.2). A pass-through
  // present (string) is the happy path → { ok:true, data:{ present } }; otherwise the honest ack —
  // a committed write whose render threw stays { ok:true, present:null, sc } at 200 (no longer a
  // masked 500), and a dropped no-op is { ok:false, present (unchanged), sc:null }.
  const out = await presentOrDegraded(session.userId, PRESENT_BUNDLES.wire, ack)
  return typeof out === 'string'
    ? NextResponse.json({ ok: true, data: { present: out } })
    : NextResponse.json({ ok: out.ok, data: { present: out.present, sc: out.sc, note: out.note } })
}
