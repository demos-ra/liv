// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (write-engine) + MCP-wire sibling
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/compose/route.ts]
//
// REST POST handler for /api/compose — the write sibling of /api/present, the
// matching REST plug owed to make REST a true sibling of MCP (Blueprint §2.4).
// THE SEAL'S PROOF (§2.3): this route bolts onto the R3 contract alone
// (present-contract: emissionFromStructured / recordScoredTurn / readPresent) —
// it reaches NO engine internal. That it can be written as a thin adapter with no
// reach inside confirms the door's seal holds.
//
// Thin (R4 discipline): consult the perimeter, 401 if absent; narrow the body
// through the SAME gate the native + MCP paths use (emissionFromStructured), record
// BOTH turns (recordScoredTurn — who:'llm', scope = the stamped session.sessionId,
// userId = session.userId, never the body), and return the fresh present. A false
// claim (word-index↔surface mismatch) is rejected loud + atomic as 400 (invalid
// testimony, named) — symmetric with the MCP door's MarkSurfaceError → INVALID_PARAMS.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import {
  emissionFromStructured,
  recordScoredTurn,
  MarkSurfaceError,
  readPresent,
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

  try {
    await recordScoredTurn(emission, 'llm', session.userId, session.sessionId, { text: body?.wearerText })
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
  // The honest sc-acknowledgement (landed/dropped, never a fake coordinate) is the MCP
  // transport's return contract (F-mcp present-or-degraded); REST returns the present that
  // results, unchanged on an honest no-op.
  const present = await readPresent(session.userId, PRESENT_BUNDLES.wire)
  return NextResponse.json({ ok: true, data: { present } })
}
