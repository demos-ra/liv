// @liv-standard v1.3
// [src/app/api/admin/builds/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step5b-corrective
// slice:      F-admin
// layer:      R4
// wires-in:
//   W-ATOM  SESSION_COOKIE_NAME  @/features/F-identity/contract/auth-contract
//   W-ATOM  validateSession      @/features/F-identity/contract/auth-contract
//   W-ATOM  isEmailAllowed       @/features/F-identity/contract/auth-contract
//   W-FN    dbGetBuilds          @/features/F-admin/exec/admin-db
//   W-FN    dbGetUserEmail       @/features/F-admin/exec/admin-db
// wires-out:  none  (external HTTP surface)
// deps:
//   R3  @/features/F-identity/contract/auth-contract  (A5)
//   R4  @/features/F-admin/exec/admin-db              (A4 — I/O at R4)
//   R5  next/server
// validated: pending
//
// step5b-phaseE (A1, A4): (see prior history)
//
// step5b-corrective (A1, A4):
//   Root error: session.email does not exist on ValidatedSession ({ sessionId, userId } only).
//   Fix: after validateSession, call dbGetUserEmail(session.userId) to resolve email.
//   If null (user deleted between session issue and this request) → 403.
//   isEmailAllowed(email) then proceeds as before.
//   Axiom cite: A4 — email resolution is I/O, lives at R4. A1 — F-admin owns this route.

import { type NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, validateSession, isEmailAllowed } from '@/features/F-identity/contract/auth-contract'
import { dbGetBuilds, dbGetUserEmail } from '@/features/F-admin/exec/admin-db'

export async function GET(req: NextRequest): Promise<NextResponse> {
  // ── Session auth ──────────────────────────────────────────────────────────
  const accessToken = req.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!accessToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await validateSession(accessToken)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Admin gate ────────────────────────────────────────────────────────────
  // ValidatedSession has no email field (Gap 1 — intentionally minimal).
  // Resolve email from auth_users via R4. Null → user not found → 403.
  const emailResult = await dbGetUserEmail(session.userId)
  if (!emailResult.ok) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
  const email = emailResult.data
  if (!email || !isEmailAllowed(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Query params ──────────────────────────────────────────────────────────
  const { searchParams } = req.nextUrl
  const statusParam = searchParams.get('status')
  const limitParam  = searchParams.get('limit')

  const status = statusParam
    ? statusParam.split(',').map(s => s.trim()).filter(Boolean)
    : undefined

  const limit = limitParam ? parseInt(limitParam, 10) : undefined

  // ── DB query ──────────────────────────────────────────────────────────────
  try {
    const buildsResult = await dbGetBuilds({ status, limit })
    if (!buildsResult.ok) {
      return NextResponse.json({ error: buildsResult.error.message }, { status: 500 })
    }
    return NextResponse.json(buildsResult.data)
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
