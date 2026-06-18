// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine) + MCP-wire sibling
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/search/route.ts]
//
// REST POST handler for /api/search — the navigation read sibling of /api/compose
// (Blueprint §2.4). THE SEAL'S PROOF (§2.3): it bolts onto the R3 contract alone
// (present-contract: parseSearchSpec + search) — no engine reach. search is region ×
// lens (the text-pivot): region (where) × lens (how) compose; a raw lens returns numbered
// cells, a pivot lens returns the rendered grid (its zones exposed as fields).
//
// Thin (R4 discipline): consult the perimeter, 401 if absent; the body is the raw region ×
// lens payload — parseSearchSpec (the core, the sole validator, shared with the wire) turns it
// into a typed spec or a named 400; search composes pivot/cellsOf. userId is ALWAYS the
// session's, never the body. A read door — no testimony.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession } from '@/features/F-identity/contract/perimeter-consultation'
import { search, parseSearchSpec } from '@/features/F-present/contract/present-contract'

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json(
      { ok: false, error: { code: 'SEARCH_AUTH_REJECTED', message: 'unauthenticated' } },
      { status: 401 },
    )
  }

  const body = await req.json().catch(() => null)
  const parsed = parseSearchSpec(body)
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: { code: 'SEARCH_INVALID_SPEC', message: parsed.message } },
      { status: 400 },
    )
  }

  const result = await search(session.userId, parsed.spec)
  return NextResponse.json({ ok: true, data: result })
}
