// [F-identity/contract/trpc-context.ts]
// R3 — tRPC context factory. Wires auth workflow deps for every request.
// Pure tRPC init lives in core/api/trpc-setup.ts (R5).

import { type FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'
import { cookies } from 'next/headers'
import { db, taggedDb } from '@/core/db/client'
import { createAuthDb } from '../exec/auth-db'
import { validateAndRefreshSession } from '../app/auth-workflow'
import type { AuthWorkflowDeps } from '../app/auth-workflow'
import type { AuthUser, SessionPayload, MagicLinkEmailContent } from '../config/auth-types'

const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? 'liv_session'
const IS_PROD        = process.env.NODE_ENV === 'production'
const IS_DEV         = process.env.NODE_ENV !== 'production'

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

  const authDeps: AuthWorkflowDeps = {
    db:             createAuthDb(taggedDb(db)),
    email:          IS_DEV ? devEmailService : devEmailService,
    eventBus:       noopEventBus,
    baseUrl:        process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    checkRateLimit: async (_type, _value, _action) => ({
      allowed: true,
      remainingAttempts: 99,
    }),
    ipAddress,
  }

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

  const maxAge   = 60 * 60 * 24 * 30
  const cookieJar = await cookies()

  const setSessionCookie = (token: string) => {
    try {
      cookieJar.set(SESSION_COOKIE, token, { httpOnly: true, sameSite: 'lax', path: '/', maxAge, secure: IS_PROD })
    } catch {}
  }

  const clearSessionCookie = () => {
    try {
      cookieJar.set(SESSION_COOKIE, '', { httpOnly: true, sameSite: 'lax', path: '/', maxAge: 0 })
    } catch {}
  }

  return { authDeps, ipAddress, session, user, setSessionCookie, clearSessionCookie, resHeaders }
}

// ─── Dev email service ────────────────────────────────────────────────────────

const devEmailService = {
  async sendMagicLink(to: string, content: MagicLinkEmailContent) {
    const urlMatch = content.text.match(/https?:\/\/\S+/)
    const link = urlMatch?.[0] ?? content.text
    console.log(JSON.stringify({
      level: 'info',
      event: 'dev.magic-link',
      to,
      link,
      timestamp: new Date().toISOString(),
      note: 'Copy this link to sign in — no email sent in dev',
    }))
    return { success: true as const }
  },
}

// ─── No-op event bus ──────────────────────────────────────────────────────────

const noopEventBus = { async emit(_event: unknown) {} }
