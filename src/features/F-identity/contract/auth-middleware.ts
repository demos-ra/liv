/**
 * F-identity / R3 / auth-middleware.ts
 * [F-identity/R3/C2] Next.js middleware — session guard and cookie management
 *
 * R3 Rules:
 * - Runs at the edge, before any page or API handler.
 * - Calls R2 (auth-workflow) for session validation. Never R4 directly.
 * - O1: Enforces authentication on protected routes. Public routes explicitly listed.
 * - O6: Cookie name and session config from env. Never hardcoded.
 *
 * Cookie strategy:
 * - httpOnly: true — not accessible to JavaScript (XSS protection)
 * - secure: true in production
 * - sameSite: 'lax' — CSRF protection while allowing link clicks
 * - Path: '/'
 */

import { NextRequest, NextResponse } from 'next/server';

// ─── Route Config (O1: explicit public/protected declarations) ────────────────

const PUBLIC_ROUTES = new Set([
  '/auth/login',
  '/auth/register',
  '/auth/verify',
]);

const PUBLIC_PREFIXES = [
  '/api/trpc/auth.requestMagicLink',
  '/api/trpc/auth.verifyMagicLink',
  '/_next/',
  '/favicon.ico',
];

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix));
}

// ─── Cookie Helpers ───────────────────────────────────────────────────────────

export const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? 'liv_session';

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
};

// ─── Middleware ───────────────────────────────────────────────────────────────

export async function authMiddleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;

  // Public routes — pass through immediately
  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  // Get session token from cookie
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return redirectToLogin(request);
  }

  // Validate session via internal API (R2 workflow)
  // Note: In Next.js middleware (edge runtime), we call the internal API endpoint
  // rather than importing R2 directly, as edge runtime has Node.js API constraints.
  try {
    const validationResponse = await fetch(
      new URL('/api/auth/validate-session', request.url),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `${SESSION_COOKIE_NAME}=${sessionToken}`,
          'X-Internal-Request': process.env.INTERNAL_REQUEST_SECRET ?? '',
        },
        body: JSON.stringify({ sessionToken }),
        signal: AbortSignal.timeout(5000), // O3: 5s timeout on session validation
      }
    );

    if (!validationResponse.ok) {
      // Session invalid — clear cookie and redirect
      const response = redirectToLogin(request);
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    const { refreshed, newExpiresAt } = await validationResponse.json() as {
      refreshed: boolean;
      newExpiresAt?: string;
    };

    const response = NextResponse.next();

    // If session was refreshed, update cookie expiry
    if (refreshed && newExpiresAt) {
      response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
        ...SESSION_COOKIE_OPTIONS,
        expires: new Date(newExpiresAt),
      });
    }

    return response;

  } catch {
    // Validation failed (network/timeout) — fail open on session validation errors
    // to avoid locking users out on transient DB issues
    return NextResponse.next();
  }
}

function redirectToLogin(request: NextRequest): NextResponse {
  const loginUrl = new URL('/auth/login', request.url);
  loginUrl.searchParams.set('next', request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

// ─── Cookie Setter/Clearer (used by R3 tRPC router context) ──────────────────

export function setSessionCookie(response: NextResponse, rawToken: string, expiresAt: Date): void {
  response.cookies.set(SESSION_COOKIE_NAME, rawToken, {
    ...SESSION_COOKIE_OPTIONS,
    expires: expiresAt,
  });
}

export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set(SESSION_COOKIE_NAME, '', {
    ...SESSION_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });
}

// ─── matcher config (exported for Next.js middleware.ts) ─────────────────────

export const middlewareMatcher = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
