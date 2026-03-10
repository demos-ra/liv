// @liv-standard v1.0
// [F-identity/contract/auth-middleware.ts]
// Built with LIV · livai.dev
// Next.js middleware — session guard and cookie management.
// A1: Session validation owned by F-identity/contract/auth-contract.
// A4: I/O at R4 only — validateSession calls DB via auth-contract.
// Note: Middleware runs on nodejs runtime (declared in middleware.ts config).

import { NextRequest, NextResponse } from 'next/server'
import { validateSession } from './auth-contract'

// ─── Route Config (O1: explicit public/protected declarations) ────────────────

const PUBLIC_ROUTES = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/verify',
])

const PUBLIC_PREFIXES = [
  '/api/trpc/auth.requestMagicLink',
  '/api/trpc/auth.verifyMagicLink',
  '/api/auth/',
  '/_next/',
  '/favicon.ico',
]

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true
  return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))
}

// ─── Cookie Config ────────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'liv_session'

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30,
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  if (isPublicRoute(pathname)) {
    return NextResponse.next()
  }

  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return redirectToLogin(request)
  }

  try {
    const session = await validateSession(sessionToken)

    if (!session) {
      const response = redirectToLogin(request)
      response.cookies.delete(SESSION_COOKIE_NAME)
      return response
    }

    return NextResponse.next()

  } catch {
    // DB unavailable — fail open to avoid locking users out on transient errors
    return NextResponse.next()
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

// ─── Cookie Setter/Clearer (used by tRPC context) ────────────────────────────

export function setSessionCookie(response: NextResponse, rawToken: string, expiresAt: Date): void {
  response.cookies.set(SESSION_COOKIE_NAME, rawToken, {
    ...SESSION_COOKIE_OPTIONS,
    expires: expiresAt,
  })
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  })
}

// ─── Matcher config (reference only — middleware.ts declares config statically) ─

export const middlewareMatcher = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
