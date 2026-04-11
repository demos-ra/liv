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
//   W-FN  ingestExternal      F-codec/R3 (codec-contract)
// wires-out:  none (HTTP response)
// deps:
//   R3  @/features/F-codec/contract/codec-contract
//   R3  @/features/F-identity/contract/auth-contract
//   R3  @/features/F-admin/contract/admin-contract
// validated:  pending

// Admin API: POST ingest external source into global graph.
// A4: I/O at R4 only. URL fetching happens here (R4), text passed to R2.

import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { validateSession, isEmailAllowed, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { dbGetUserEmail } from '@/features/F-admin/contract/admin-contract'
import { ingestExternal } from '@/features/F-codec/contract/codec-contract'
import type { IngestionSource } from '@/features/F-codec/contract/codec-contract'

export async function POST(request: Request) {
  try {
    // ── Auth ──
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

    // ── Parse + validate ──
    const body = await request.json()
    const { type, content, label } = body

    if (!type || !content || !label) {
      return NextResponse.json({ error: 'type, content, and label required' }, { status: 400 })
    }

    if (type !== 'url' && type !== 'text') {
      return NextResponse.json({ error: 'type must be url or text' }, { status: 400 })
    }

    // ── URL fetch (R4 I/O) ──
    let resolvedContent = content
    if (type === 'url') {
      try {
        const res = await fetch(content, { signal: AbortSignal.timeout(10000) })
        if (!res.ok) {
          return NextResponse.json({ error: `URL fetch failed: HTTP ${res.status}` }, { status: 400 })
        }
        resolvedContent = await res.text()
      } catch (e) {
        return NextResponse.json(
          { error: `URL fetch failed: ${e instanceof Error ? e.message : 'unknown'}` },
          { status: 400 },
        )
      }
    }

    // ── Ingest ──
    const source: IngestionSource = {
      type: 'text',        // always text by the time it reaches R2
      content: resolvedContent,
      label,
    }

    const result = await ingestExternal(source)
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
