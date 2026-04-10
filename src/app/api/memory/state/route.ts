// @liv-standard v1.3
// [src/app/api/memory/state/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core/app
// layer:      R4
// wires-in:
//   W-FN   getDecodedState()  ←  F-codec/R3 (codec-contract)
//   W-FN   validateSession()  ←  F-identity/R3
//   W-ATOM SESSION_COOKIE_NAME ← F-identity/R3
// wires-out:  none (HTTP endpoint)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
// validated:  pending

// GET /api/memory/state
// Returns DecodeOutput for the authenticated user.
// A4: I/O at R4 only — thin route, delegates to R2 getDecodedState().
// A3: typed boundary — returns DecodeOutput atom as JSON.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { getDecodedState } from '@/features/F-codec/contract/codec-contract'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const session = await validateSession(token)
    if (!session) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
    }

    const decoded = getDecodedState(session.userId)
    return NextResponse.json(decoded)
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/memory/state] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
