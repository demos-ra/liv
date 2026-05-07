// @liv-standard v1.5.1
// @perimeter-standard v1.0
// [middleware.ts]
// Built with LIV · livai.dev
//
// UNITARY PERIMETER SITE — Manual SPEC-v11.0 §I.4 + Perimeter Standard v1.0
// ==========================================================================
// This is the one perimeter site per LIV instance per Manual §I.4 unitarity.
// Every HTTP-routed crossing into LIV passes through this single file.
// Authority enforcement (PA-A1..PA-A6) and unitary-site invariant (PA-I)
// resolve here and only here.
//
// Wire-in:
// - Replaces the dormant authMiddleware function previously exported from
//   F-identity/contract/auth-middleware.ts (file deleted at this delivery).
// - Replaces the distributed validateSession-per-contract pattern (F-005
//   audit finding) — distributed validateSession calls in 7 contract files
//   removed; contracts now consult the perimeter via getPerimeterSession()
//   reading middleware-set request headers.
//
// Perimeter Standard axioms wired at this site (this version):
// - PA-A1 (authority validation): session token validated via validateSession()
//   (F-identity contract); on success authority resolves to {level:'L0',
//   actor:'wearer'} and is communicated to downstream consumers via the
//   perimeter-internal request headers set below.
// - PA-A6 + PA-I (unitary site): this file IS the unitary perimeter site;
//   LIV_INSTANCE_PERIMETER_SITE_REF = 'src/middleware.ts' per
//   perimeter-standard.ts constants. By Next.js convention, middleware lives
//   at exactly one path per app; there is no second site that could
//   resolve at runtime.
//
// Perimeter Standard axioms NOT yet wired at this site (deferred to Sprint 9
// BCR-emission scaffold per Perimeter Standard v1.0.1 §4.8 promotion path):
// - PA1 (direction declaration), PA-T1/PA-T2 (disposition + cell governance),
//   PA-T3/PA-T4 (mutation gate, reversibility), PA-Cn1..PA-Cn4 (channel
//   classification + per-channel authority binding + channel preservation),
//   PA-IR1..PA-IR4 (identity resolution), PA-Co1..PA-Co3 (correlation),
//   PA2 (directional symmetry), PA-A2..PA-A5 (scope rules + orphan rule +
//   dispatch validation). These require BoundaryCrossingRecord emission +
//   gate-invocation hook, which is the Sprint 9 wire-in scaffold target.
// - At this version the unitary site enforces session validity only; full
//   BCR-emission machinery and the 22 PS-own gate invocations promote at
//   Sprint 9 first-runtime-crossing event per PS v1.0.1 §4.8.
//
// Bypass-route scopeOut (D8):
// PUBLIC_PREFIXES below enumerate routes that legitimately bypass session
// validation. These are NOT perimeter bypasses — they are distinct perimeter
// crossings whose authority requirement is "no-session-required" (intake-time
// public access). Per Perimeter Standard §1 scopeOut: "F-chat governing
// framework" and route-specific public-access policies live outside PS.
// The public-prefix list is preserved verbatim from the dormant
// authMiddleware — exact same bypass set, but now governed at the unitary site.
//
// A1: Session validation owned by F-identity/contract/auth-contract.
// A4: I/O at R4 only — validateSession calls DB via auth-contract.
// A6: SESSION_COOKIE_NAME imported from F-identity canonical source.
// Note: Middleware runs on nodejs runtime (declared in config below).

import { NextRequest, NextResponse } from 'next/server'
import { validateSession, SESSION_COOKIE_NAME } from '@/features/F-identity/contract/auth-contract'
import { PERIMETER_HEADER_USER_ID, PERIMETER_HEADER_SESSION_ID } from '@/core/constants/perimeter-headers'

// ─── Route Config (preserved from dormant auth-middleware.ts) ────────────────
// PUBLIC_ROUTES: pages reachable without a session.
// PUBLIC_PREFIXES: route prefixes reachable without a session.
//
// D8 rationale (recorded in spec-shot-3-manifest.md): these routes are
// legitimate perimeter bypasses for session validation specifically — they are
// the routes through which a wearer establishes a session in the first place
// (login, magic-link callbacks) plus framework infrastructure (Next.js _next
// asset paths, favicon). They still cross the perimeter; they simply do not
// require a pre-existing session. Their authority is intrinsic to the route
// (auth endpoints accept unauthenticated arrivals because that IS their
// purpose; _next paths serve framework assets with no authority requirement).

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

// ─── Middleware (the unitary perimeter site) ──────────────────────────────────

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // Public routes pass through with no perimeter headers set.
  // (Perimeter-internal headers are absent → getPerimeterSession returns null,
  //  which is the correct state for routes that do not require a session.)
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

    // PA-A1 satisfied: session validated. Set perimeter-internal headers for
    // downstream consultation via F-identity/contract/perimeter-consultation.ts.
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set(PERIMETER_HEADER_USER_ID,    session.userId)
    requestHeaders.set(PERIMETER_HEADER_SESSION_ID, session.sessionId)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })

  } catch {
    // DB unavailable — fail open to avoid locking users out on transient errors.
    // (Same fail-open posture as dormant authMiddleware. Distributed contracts
    //  that previously called validateSession themselves had the same posture
    //  per F-identity/auth-validation.ts; preserved here for behavior-parity.)
    return NextResponse.next()
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/login', request.url)
  loginUrl.searchParams.set('next', request.nextUrl.pathname)
  return NextResponse.redirect(loginUrl)
}

// ─── Matcher config ───────────────────────────────────────────────────────────
// Per Next.js convention: middleware applies to all routes except static
// assets. The unitary-site invariant (PA-I) requires that EVERY routed crossing
// passes through this matcher. Static asset paths (_next/static, _next/image,
// favicon, public/) are excluded as they are framework infrastructure, not
// LIV crossings.

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
  runtime: 'nodejs',
}
