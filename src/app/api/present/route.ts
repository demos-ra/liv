// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/present/route.ts]
// Sprint 2 — Shot 5; read-engine (repointed to the read surface).
//
// REST POST handler for /api/present. Auth: getPerimeterSession (perimeter-
// validated at the unitary site). The read engine resolves the wearer's present
// from userId alone (per-user wiring later); the v6.0 three-control intent is
// gone with the lens re-derivation. Route KEPT + repointed to readPresent.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession }            from '@/features/F-identity/contract/perimeter-consultation'
import { readPresent }                    from '@/features/F-present/contract/present-contract'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json(
      { ok: false, error: { code: 'PRESENT_AUTH_REJECTED', message: 'unauthenticated' } },
      { status: 401 },
    )
  }

  const present = await readPresent(session.userId)
  return NextResponse.json({ ok: true, data: { present } })
}
