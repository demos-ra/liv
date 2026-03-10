// [F-identity/contract/trpc-context.ts]
// R3 — tRPC context factory. Wires auth workflow deps for every request.
// Pure tRPC init lives in core/api/trpc-setup.ts (R5).
// R3 owns IAuthDb factory instantiation (A2). R2 depends on the interface only.

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { cookies } from 'next/headers'
import { validateAndRefreshSession, createAuthDeps } from '../app/auth-workflow'
import type { AuthWorkflowDeps } from '../app/auth-workflow'
import type { AuthUser, SessionPayload } from '../config/auth-types'
import { SESSION_COOKIE_NAME } from '../config/auth-types'
import { createAuthDb } from '../exec/auth-db'
import { db, taggedDb } from '@/core/db/client'
// A2: R3 owns factory instantiation. R2 depends on IAuthDb interface only.

const SESSION_COOKIE = SESSION_COOKIE_NAME
const IS_PROD        = process.env.NODE_ENV === 'production'

export interface TRPCContext {
  authDeps:           AuthWorkflowDeps
  ipAddress:          string
  session:            SessionPayload | null
  user:               AuthUser | null
  setSessionCookie:   (sessionId: string) => void
  clearSessionCookie: () => void
  resHeaders:         Headers
}

export async function createContext(
  opts: FetchCreateContextFnOptions
): Promise<TRPCContext> {
  const req        = opts.req
  const resHeaders = opts.resHeaders ?? new Headers()

  const ipAddress =
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  // R3 builds concrete IAuthDb instance (A2: factory at R3, not R2)
  const authDb  = createAuthDb(taggedDb(db))
  const authDeps = createAuthDeps(ipAddress, authDb)

  let session: SessionPayload | null = null
  let user: AuthUser | null = null

  try {
    const cookieStore = await cookies()
    const rawToken = cookieStore.get(SESSION_COOKIE)?.value
    if (rawToken) {
      const result = await validateAndRefreshSession(rawToken, authDeps)
      if (result.success) {
        session = result.data.session
        user    = result.data.user
      }
    }
  } catch {
    // Non-blocking — unauthenticated context
  }

  const maxAge    = 60 * 60 * 24 * 30
  const cookieJar = await cookies()

  const setSessionCookie = (token: string) => {
    try {
      cookieJar.set(SESSION_COOKIE, token, {
        httpOnly: true, sameSite: 'lax', path: '/', maxAge, secure: IS_PROD,
      })
    } catch {}
  }

  const clearSessionCookie = () => {
    try {
      cookieJar.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
    } catch {}
  }

  return { authDeps, ipAddress, session, user, setSessionCookie, clearSessionCookie, resHeaders }
}
