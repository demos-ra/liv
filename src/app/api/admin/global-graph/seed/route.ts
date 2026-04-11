// @liv-standard v1.3
// [app/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      app (API route)
// layer:      R4
// wires-in:
//   W-FN  validateSession     F-identity/R3
//   W-FN  isEmailAllowed      F-identity/R3
//   W-ATOM SESSION_COOKIE_NAME F-identity/R3
//   W-FN  dbGetUserEmail      F-admin/R3
//   W-FN  seedGlobalNode      F-codec/R3 (codec-contract)
//   W-FN  removeNode          F-codec/R3 (codec-contract)
// wires-out:  none (HTTP response)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-admin/contract/admin-contract
// validated:  pending

// Admin API: POST seed node, DELETE remove node.
// A4: I/O at R4 only. Session + isAdmin validation.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, isEmailAllowed, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { dbGetUserEmail } from '@/features/F-admin/contract/admin-contract'
import { seedGlobalNode, removeNode } from '@/features/F-codec/contract/codec-contract'
import type { GlobalSeedInput } from '@/features/F-codec/contract/codec-contract'

// ── Shared auth helper ──
async function validateAdmin(): Promise<{ userId: string } | NextResponse> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)
  if (!sessionCookie?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const session = await validateSession(sessionCookie.value)
  if (!session) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401 })
  }

  // isAdmin check: typed query via F-admin/R3 + F-identity/R3
  const emailResult = await dbGetUserEmail(session.userId)
  if (!emailResult.ok) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
  const email = emailResult.data
  if (!email || !isEmailAllowed(email)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return { userId: session.userId }
}

// ── POST: Seed a global node ──
export async function POST(request: Request) {
  try {
    const auth = await validateAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const input: GlobalSeedInput = {
      label:     body.label,
      content:   body.content,
      relatedTo: body.relatedTo || undefined,
    }

    if (!input.label || !input.content) {
      return NextResponse.json({ error: 'label and content required' }, { status: 400 })
    }

    const result = await seedGlobalNode(input)
    if (!result.ok) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 },
    )
  }
}

// ── DELETE: Remove a global node ──
export async function DELETE(request: Request) {
  try {
    const auth = await validateAdmin()
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    const { nodeId } = body

    if (!nodeId) {
      return NextResponse.json({ error: 'nodeId required' }, { status: 400 })
    }

    const result = await removeNode(nodeId)
    if (!result.ok) {
      return NextResponse.json({ error: result.error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Internal error' },
      { status: 500 },
    )
  }
}
