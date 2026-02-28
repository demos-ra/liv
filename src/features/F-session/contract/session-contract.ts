// [F-session/R3/C2] Session contract — API routes + middleware hook
// R3: interface boundary, depends R0 + R1 + R2

import { NextRequest, NextResponse } from 'next/server'
import { SESSION_CONFIG } from '../config/session-config'
import { resolveSession, refreshSession, terminateSession } from '../app/session-workflow'
import { sessionNeedsRefresh } from '../domain/session-logic'

// --- Middleware: resolve session on every request ---

export async function withSession(
  req: NextRequest,
  handler: (req: NextRequest, session: Awaited<ReturnType<typeof resolveSession>>) => Promise<NextResponse>
): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_CONFIG.cookieName)?.value

  if (!accessToken) {
    return handler(req, null)
  }

  const session = await resolveSession(accessToken)

  if (!session) {
    // attempt refresh
    const refreshToken = req.cookies.get(SESSION_CONFIG.refreshCookieName)?.value
    if (!refreshToken) return handler(req, null)

    const refreshed = await refreshSession(refreshToken)
    if (!refreshed) return handler(req, null)

    const res = await handler(req, await resolveSession(refreshed.accessToken))
    setSessionCookies(res, refreshed.accessToken, refreshed.refreshToken)
    return res
  }

  const res = await handler(req, session)

  if (sessionNeedsRefresh(session)) {
    const refreshToken = req.cookies.get(SESSION_CONFIG.refreshCookieName)?.value
    if (refreshToken) {
      const refreshed = await refreshSession(refreshToken)
      if (refreshed) setSessionCookies(res, refreshed.accessToken, refreshed.refreshToken)
    }
  }

  return res
}

// --- Route: POST /api/session/refresh ---

export async function POST_refresh(req: NextRequest): Promise<NextResponse> {
  const refreshToken = req.cookies.get(SESSION_CONFIG.refreshCookieName)?.value
  if (!refreshToken) return NextResponse.json({ error: 'no_refresh_token' }, { status: 401 })

  const result = await refreshSession(refreshToken)
  if (!result) return NextResponse.json({ error: 'invalid_refresh_token' }, { status: 401 })

  const res = NextResponse.json({ ok: true })
  setSessionCookies(res, result.accessToken, result.refreshToken)
  return res
}

// --- Route: POST /api/session/logout ---

export async function POST_logout(req: NextRequest): Promise<NextResponse> {
  const accessToken = req.cookies.get(SESSION_CONFIG.cookieName)?.value
  const session = accessToken ? await resolveSession(accessToken) : null

  if (session) await terminateSession(session.sessionId)

  const res = NextResponse.json({ ok: true })
  clearSessionCookies(res)
  return res
}

// --- Cookie helpers (internal to contract layer) ---

function setSessionCookies(res: NextResponse, accessToken: string, refreshToken: string) {
  res.cookies.set(SESSION_CONFIG.cookieName, accessToken, {
    ...SESSION_CONFIG.cookieOptions,
    maxAge: SESSION_CONFIG.accessTokenTTL,
  })
  res.cookies.set(SESSION_CONFIG.refreshCookieName, refreshToken, {
    ...SESSION_CONFIG.cookieOptions,
    maxAge: SESSION_CONFIG.refreshTokenTTL,
  })
}

function clearSessionCookies(res: NextResponse) {
  res.cookies.delete(SESSION_CONFIG.cookieName)
  res.cookies.delete(SESSION_CONFIG.refreshCookieName)
}

// --- React hook: useSession (client) ---
// Reads session state from F-state-registry session:: namespace

export { useSession } from './session-hook'

export { createSessionForUser, destroySessionForUser, resolveSession } from "../app/session-workflow"
