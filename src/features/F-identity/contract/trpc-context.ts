// [F-identity/contract/trpc-context.ts]
// R3 — tRPC context factory. Wires auth workflow deps for every request.
// Pure tRPC init lives in core/api/trpc-setup.ts (R5).
// R3 rule: never imports exec/. Uses createAuthDeps() from R2 auth-workflow.

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { cookies } from 'next/headers'
import { validateAndRefreshSession, createAuthDeps } from '../app/auth-workflow'
import type { AuthWorkflowDeps } from '../app/auth-workflow'
import type { AuthUser } from '../config/auth-types'
import type { SessionPayload } from '@/core/types/session'

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'liv_session'
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

  // R3 calls R2 factory — never imports exec/ directly
  const authDeps = createAuthDeps(ipAddress)

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
