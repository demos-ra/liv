// @liv-standard v1.5.1
// [src/app/api/substrate/export/route.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b2-shot-3 (new file)
// slice:      F-memory
// layer:      R5
// wires-in:
//   W-FN      getPerimeterSession   @/features/F-identity/contract/perimeter-consultation
//   W-FN      readScope             @/features/F-memory/contract/substrate-contract  (F10: was exportByScope)
//   W-ATOM    NextRequest           next/server
//   W-ATOM    NextResponse          next/server
// wires-out:
//   W-RESPONSE  text/plain JSONL download  → wearer client
// deps:
//   R3  @/features/F-identity/contract/perimeter-consultation
//   R3  @/features/F-memory/contract/substrate-contract
//   R5  next/server
// validated:  pending
//
// POST /api/substrate/export
// ===========================
// Wearer-L0 substrate export. Parameters in body (not URL — privacy).
// Auth: getPerimeterSession — perimeter-validated at unitary site.
// Scope gate: session.userId must match requested userId — no cross-user export.
//
// Response: JSONL download (text/plain, Content-Disposition: attachment).
//   Line 0: schema envelope { schema, version, exportedAt, userId }
//   Lines 1..N: one StateChangeRecord per line, position-ordered ASC.
//
// Decision-D-EXPORT-SCOPE: session.userId is the only accepted scope. Body
//   userId field (if present) must match — otherwise 403. Prevents accidental
//   cross-user export even if caller supplies a different id.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import { readScope } from '@/features/F-memory/contract/substrate-contract'
import { aliasesOf } from '@/features/F-identity/contract/auth-contract'

const EXPORT_SCHEMA    = 'liv-substrate-export'
const EXPORT_VERSION   = '1.0'
const CONTENT_FILENAME = 'substrate-export.jsonl'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth — perimeter-validated session required.
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  // Scope gate — parse body if present; enforce userId match.
  let bodyUserId: string | undefined
  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>
    if (typeof body.userId === 'string') {
      bodyUserId = body.userId
    }
  } catch {
    // No body or non-JSON — proceed without body userId check.
  }

  if (bodyUserId !== undefined && bodyUserId !== session.userId) {
    return NextResponse.json(
      { error: 'forbidden', detail: 'userId in body does not match authenticated session' },
      { status: 403 },
    )
  }

  // Execute export.
  const result = await readScope(await aliasesOf(session.userId))
  if (!result.ok) {
    return NextResponse.json(
      { error: 'export_failed', detail: result.error.message },
      { status: 500 },
    )
  }

  // Serialize as JSONL.
  // Line 0: schema envelope.
  const envelope = {
    schema:     EXPORT_SCHEMA,
    version:    EXPORT_VERSION,
    exportedAt: Date.now(),
    userId:     session.userId,
  }

  const lines: string[] = [JSON.stringify(envelope)]
  for (const record of result.data) {
    lines.push(JSON.stringify(record))
  }
  const jsonl = lines.join('\n')

  return new NextResponse(jsonl, {
    status: 200,
    headers: {
      'Content-Type':        'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${CONTENT_FILENAME}"`,
    },
  })
}

// ─── End ──────────────────────────────────────────────────────────────────────
