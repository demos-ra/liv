// @liv-standard v1.5.1 amended sprint-b1-shot-1 sprint-13b-shot-1
// [F-identity/R3]
// Built with LIV · livai.dev
// @manifest-delta sprint-13b-shot-1
//   emitEvent imported from F-event-system/contract (R3→R3, same layer — A2 compliant).
//   realEventBus adapter declared inline: implements IEventBus, wraps emitEvent, drops eventKind.
//   createAuthDeps call updated to pass realEventBus as third arg.
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-b1-shot-1 (setSessionCookie + clearSessionCookie hoisted before try block;
//                               setSessionCookie called on validateAndRefreshSession refresh signal)
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-FN      validateAndRefreshSession  ../app/auth-workflow
//   W-FN      createAuthDeps            ../app/auth-workflow
//   W-ATOM    AuthWorkflowDeps          ../app/auth-workflow
//   W-ATOM    AuthUser                  ../config/auth-types
//   W-ATOM    SessionPayload            ../config/auth-types
//   W-ATOM    SESSION_COOKIE_NAME       ../config/auth-types
//   W-FN      createAuthDb              ../exec/auth-db
//   W-FN      emitEvent                 @/features/F-event-system/contract/event-bus
//   W-FN      db                        @/core/db/client
//   W-FN      taggedDb                  @/core/db/client
//   W-ATOM    FetchCreateContextFnOptions  @trpc/server/adapters/fetch
//   W-FN      cookies                   next/headers
// wires-out:
//   W-ATOM    TRPCContext               → trpc-setup (context factory consumer)
//   W-FN      createContext             → trpc-setup
// validated:  pending
// R3 — tRPC context factory. Wires auth workflow deps for every request.
// A2: R3 owns IAuthDb factory instantiation. R2 depends on interface only.
// A4: Cookie written to resHeaders (Set-Cookie) — cookies().set() does not
//     work inside tRPC Route Handlers which return plain Response, not NextResponse.

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { cookies } from 'next/headers'
import { validateAndRefreshSession, createAuthDeps } from '../app/auth-workflow'
import type { AuthWorkflowDeps } from '../app/auth-workflow'
import type { AuthUser, SessionPayload } from '../config/auth-types'
import { SESSION_COOKIE_NAME } from '../config/auth-types'
import { createAuthDb } from '../exec/auth-db'
import { db, taggedDb } from '@/core/db/client'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'

const SESSION_COOKIE = SESSION_COOKIE_NAME
const IS_PROD        = process.env.NODE_ENV === 'production'
const MAX_AGE        = 60 * 60 * 24 * 30 // 30 days

export interface TRPCContext {
  authDeps:           AuthWorkflowDeps
  ipAddress:          string
  session:            SessionPayload | null
  user:               AuthUser | null
  setSessionCookie:   (token: string) => void
  clearSessionCookie: () => void
  resHeaders:         Headers
}

// ─── Cookie serialiser ────────────────────────────────────────────────────────
// cookies().set() is not supported inside Route Handlers (plain Response).
// Must write Set-Cookie header directly onto resHeaders.

function buildSetCookieHeader(name: string, value: string, options: {
  maxAge: number
  httpOnly: boolean
  secure: boolean
  sameSite: 'lax' | 'strict' | 'none'
  path: string
}): string {
  const parts = [`${name}=${encodeURIComponent(value)}`]
  parts.push(`Max-Age=${options.maxAge}`)
  parts.push(`Path=${options.path}`)
  parts.push(`SameSite=${options.sameSite}`)
  if (options.httpOnly) parts.push('HttpOnly')
  if (options.secure)   parts.push('Secure')
  return parts.join('; ')
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

  const authDb   = createAuthDb(taggedDb(db))
  const realEventBus = {
    async emit(event: { type: string; payload: Record<string, unknown>; eventKind?: string }): Promise<void> {
      await emitEvent({ type: event.type, payload: event.payload })
    },
  }
  const authDeps = createAuthDeps(ipAddress, authDb, realEventBus)

  let session: SessionPayload | null = null
  let user: AuthUser | null = null

  // ── Cookie writers — write directly to resHeaders (A4) ───────────────────
  // Defined before try block: called inside try on session refresh (sprint-b1-shot-1).
  const setSessionCookie = (token: string) => {
    resHeaders.append('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE, token, {
      maxAge:   MAX_AGE,
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: 'lax',
      path:     '/',
    }))
  }

  const clearSessionCookie = () => {
    resHeaders.append('Set-Cookie', buildSetCookieHeader(SESSION_COOKIE, '', {
      maxAge:   0,
      httpOnly: true,
      secure:   IS_PROD,
      sameSite: 'lax',
      path:     '/',
    }))
  }

  try {
    const cookieStore = await cookies()
    const rawToken = cookieStore.get(SESSION_COOKIE)?.value
    if (rawToken) {
      const result = await validateAndRefreshSession(rawToken, authDeps)
      if (result.success) {
        session = result.data.session
        user    = result.data.user
        // Part A — sprint-b1-shot-1: re-set cookie when DB expiry was refreshed.
        // Same token string; new Max-Age re-anchors browser expiry to match DB.
        if (result.data.sessionRefreshed && result.data.newToken) {
          setSessionCookie(result.data.newToken)
        }
      }
    }
  } catch {
    // Non-blocking — unauthenticated context
  }

  return { authDeps, ipAddress, session, user, setSessionCookie, clearSessionCookie, resHeaders }
}
