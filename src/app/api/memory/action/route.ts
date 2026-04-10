// @liv-standard v1.3
// [src/app/api/memory/action/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      core/app
// layer:      R4
// wires-in:
//   W-FN   executeMemoryAction()  ←  F-codec/R3 (codec-contract)
//   W-FN   validateSession()      ←  F-identity/R3
//   W-ATOM SESSION_COOKIE_NAME    ←  F-identity/R3
//   W-ATOM MemoryAction           ←  F-codec/R0
// wires-out:  none (HTTP endpoint)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
//   R0  @/features/F-codec/config/codec-memory-types  (type only)
// validated:  pending

// POST /api/memory/action
// Executes a MemoryAction for the authenticated user.
// A4: I/O at R4 only — thin route, delegates to R2 executeMemoryAction().
// A3: typed boundary — accepts MemoryAction atom as JSON body.

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { executeMemoryAction } from '@/features/F-codec/contract/codec-contract'
import type { MemoryAction } from '@/features/F-codec/config/codec-memory-types'

// ─── Runtime validation ──────────────────────────────────────────────────────
// A3: validate shape at the boundary. Reject malformed payloads.

const VALID_TYPES = new Set(['restructure', 'suppress', 'relate', 'reinforce'])

function isValidAction(body: unknown): body is MemoryAction {
  if (!body || typeof body !== 'object') return false
  const obj = body as Record<string, unknown>
  if (typeof obj.type !== 'string' || !VALID_TYPES.has(obj.type)) return false

  switch (obj.type) {
    case 'restructure':
      return typeof obj.nodeId === 'string' && typeof obj.newParentId === 'string'
    case 'suppress':
      return typeof obj.nodeId === 'string'
    case 'relate':
      return typeof obj.fromNodeId === 'string' && typeof obj.toNodeId === 'string'
    case 'reinforce':
      return typeof obj.nodeId === 'string'
    default:
      return false
  }
}

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    if (!isValidAction(body)) {
      return NextResponse.json({ error: 'Invalid action payload' }, { status: 400 })
    }

    const result = await executeMemoryAction(body, session.userId)
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 422 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[api/memory/action] error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
