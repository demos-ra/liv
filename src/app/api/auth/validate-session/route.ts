// @liv-standard v1.0
// [app/api/auth/validate-session/route.ts]
// Built with LIV · livai.dev
// Internal API route — called by edge middleware to validate session.
// A1: Session validation logic owned exclusively by F-identity.
// A2: Imports SESSION_COOKIE_NAME via auth-contract (R3 surface), not config directly.
// A4: I/O at R4 only — this is the R4 HTTP boundary for session validation.

import { NextRequest, NextResponse } from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const internalSecret = process.env.INTERNAL_REQUEST_SECRET ?? ''
    const requestSecret  = req.headers.get('X-Internal-Request') ?? ''

    if (internalSecret && requestSecret !== internalSecret) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const rawToken = req.cookies.get(SESSION_COOKIE_NAME)?.value
    if (!rawToken) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    const session = await validateSession(rawToken)
    if (!session) {
      return NextResponse.json({ valid: false }, { status: 401 })
    }

    return NextResponse.json({ valid: true, refreshed: false })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
