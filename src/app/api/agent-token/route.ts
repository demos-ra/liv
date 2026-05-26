// @liv-standard v1.5.1
// @perimeter-standard v1.3
// [app/R4]
// Built with LIV · livai.dev
// [src/app/api/agent-token/route.ts]
// sprint-beta-shot-3 — the wearer-facing delegated-token issuance route (the
//   connector door's issuance entry point).
//
// POST /api/agent-token
// ─────────────────────
// An authenticated wearer mints a delegated agent token — an ordinary session
// row created under the wearer's own userId (a Wearer-L0 admission act). The
// external agent then presents this token as a bearer credential; proxy.ts's
// token-auth branch validates it via lookupSession and stamps the
// 'external-agent' channel. See F-identity/app/auth-workflow.issueDelegatedAgentToken.
//
// Placement rationale: this route is NOT under /api/auth/. /api/auth/* is the
// PUBLIC_PREFIXES pre-authentication zone (proxy.ts bypasses the perimeter for
// it, startsWith-matched) — routes there receive no PerimeterSession. This
// route REQUIRES an authenticated wearer, so it lives at /api/agent-token, a
// non-public /api/* path: proxy.ts validates the wearer's cookie session at the
// unitary site and stamps the perimeter headers, and getPerimeterSession reads
// them here. No change to proxy.ts — its existing routing handles a non-public
// /api/* path correctly.
//
// Auth: getPerimeterSession — perimeter-validated at the unitary site (proxy.ts).
//
// Wearer-cookie-only guard: a delegated token must be minted by the WEARER, on
// the cookie path — never by another agent-token (no token minting tokens; that
// would let a delegate escalate by self-issuing further tokens). The cookie-vs-
// token discriminator is the channel stamp: proxy.ts stamps resolvedChannel=
// 'wearer-message' for a cookie crossing and 'external-agent' for a token
// crossing. The guard rejects any crossing stamped 'external-agent'.

import { type NextRequest, NextResponse } from 'next/server'
import { getPerimeterSession }            from '@/features/F-identity/contract/perimeter-consultation'
import { issueDelegatedAgentToken }       from '@/features/F-identity/app/auth-workflow'
import { createAuthDb }                   from '@/features/F-identity/exec/auth-db'
import { db, taggedDb }                   from '@/core/db/client'

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Auth — perimeter-validated wearer session required.
  const session = getPerimeterSession(req)
  if (!session) {
    return NextResponse.json({ error: 'unauthenticated' }, { status: 401 })
  }

  // Wearer-cookie-only guard. A delegated token may be minted only by the
  // wearer on the cookie path. An agent-token crossing is stamped
  // resolvedChannel='external-agent' at proxy.ts; reject it — a delegate
  // cannot self-issue further tokens (no token minting tokens).
  if (session.resolvedChannel === 'external-agent') {
    return NextResponse.json(
      { error: { code: 'FORBIDDEN', message: 'a delegated agent token cannot issue further tokens; mint from a wearer session' } },
      { status: 403 },
    )
  }

  // Mint the delegated token under the WEARER'S OWN userId — the Wearer-L0
  // admission act. issueDelegatedAgentToken reuses the existing session
  // machinery (createSession); the token is a session row, not a new
  // credential kind.
  const authDb = createAuthDb(taggedDb(db))
  const issued = await issueDelegatedAgentToken(session.userId, authDb)

  if (!issued) {
    return NextResponse.json(
      { error: { code: 'ISSUANCE_FAILED', message: 'could not issue delegated agent token' } },
      { status: 500 },
    )
  }

  // Return the raw token to the wearer. After this point the raw token exists
  // only in the wearer's (and the agent's) possession — only its hash is in
  // the DB, per createSession discipline.
  return NextResponse.json({
    token:     issued.rawToken,
    sessionId: issued.sessionId,
    expiresAt: issued.expiresAt.toISOString(),
  })
}
