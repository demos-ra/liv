// @liv-standard v1.3
// [F-identity/contract/oauth-contract.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// slice:      F-identity
// layer:      R3
// wires-in:
//   W-FN    completeVerifiedResolution / emailKeyedResolve / oauthVerifiedCompletion  ../app/oauth-workflow
//   W-FN    generateOAuthState   ../domain/oauth-logic
//   W-FN    verifyOAuthState     ../domain/oauth-logic
//   W-FN    exchangeCodeForToken ../exec/oauth-io
//   W-FN    fetchOAuthEmail      ../exec/oauth-io
//   W-ATOM  isOAuthConfigured    ../config/oauth-config
//   W-ATOM  OAUTH_PROVIDERS      ../config/oauth-config
//   W-ATOM  OAuthProviderId      ../config/oauth-config
//   W-ATOM  SESSION_COOKIE_NAME  ../config/auth-types
//   W-ATOM  AUTH_CONFIG           ../domain/auth-session
//   W-FN    createAuthDb         ../exec/auth-db
// wires-out:
//   W-FN  handleOAuthRedirect     → route handlers (src/app/api/auth/*)
//   W-FN  handleOAuthCallback     → route handlers (src/app/api/auth/*/callback)
//   W-FN  getConfiguredProviders  → route handler (src/app/api/auth/providers)
// deps:
//   R0  ../config/oauth-config
//   R0  ../config/auth-types
//   R1  ../domain/oauth-logic
//   R1  ../domain/auth-session (AUTH_CONFIG)
//   R2  ../app/oauth-workflow
//   R4  ../exec/oauth-io
//   R4  ../exec/auth-db
//   R5  next/server, @/core/db/client
//
// A2: R3 owns IAuthDb factory instantiation — R2 depends on interface only.
// A5: Route handlers import through this contract, not directly from R2/R4.
// Same pattern as auth-contract.ts for session validation.

import { NextRequest, NextResponse } from 'next/server'
import type { OAuthProviderId } from '../config/oauth-config'
import { OAUTH_PROVIDERS, isOAuthConfigured } from '../config/oauth-config'
import { SESSION_COOKIE_NAME } from '../config/auth-types'
import { AUTH_CONFIG } from '../domain/auth-session'
import { generateOAuthState, verifyOAuthState } from '../domain/oauth-logic'
import { completeVerifiedResolution, emailKeyedResolve, oauthVerifiedCompletion } from '../app/oauth-workflow'
import { exchangeCodeForToken, fetchOAuthEmail } from '../exec/oauth-io'
import { createAuthDb } from '../exec/auth-db'
import { db, taggedDb } from '@/core/db/client'

// ─── Constants ────────────────────────────────────────────────────────────────

const IS_PROD      = process.env.NODE_ENV === 'production'
const SESSION_MAX_AGE = 60 * 60 * 24 * AUTH_CONFIG.SESSION_TTL_DAYS // matches trpc-context.ts
const STATE_COOKIE_NAME = 'liv_oauth_state'
const STATE_COOKIE_MAX_AGE = 60 * 5 // 5 minutes

// ─── Structured Logger ────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({
    level,
    event,
    slice: 'F-identity',
    layer: 'R3/oauth',
    timestamp: new Date().toISOString(),
    ...data,
  }))
}

// ─── Helper: error redirect ───────────────────────────────────────────────────

function errorRedirect(req: NextRequest, errorCode: string): NextResponse {
  const url = new URL('/auth/login', req.url)
  url.searchParams.set('error', errorCode)
  return NextResponse.redirect(url)
}

// ─── Helper: base URL ─────────────────────────────────────────────────────────

function getBaseUrl(req: NextRequest): string {
  return process.env.NEXT_PUBLIC_BASE_URL ?? new URL('/', req.url).origin
}

// ─── 1. OAuth Redirect ───────────────────────────────────────────────────────
// Called by GET /api/auth/{provider}. Builds auth URL and redirects to provider.

export async function handleOAuthRedirect(
  provider: OAuthProviderId,
  req: NextRequest
): Promise<NextResponse> {
  // Guard: provider not configured → 404
  if (!isOAuthConfigured(provider)) {
    return NextResponse.json({ error: 'OAuth provider not configured' }, { status: 404 })
  }

  const config  = OAUTH_PROVIDERS[provider]
  const baseUrl = getBaseUrl(req)
  const state   = generateOAuthState()

  // Build provider auth URL
  const params = new URLSearchParams({
    client_id:     process.env[config.clientIdEnv] ?? '',
    redirect_uri:  `${baseUrl}/api/auth/${provider}/callback`,
    response_type: 'code',
    scope:         config.scopes,
    state,
  })

  // Google-specific: request offline access for potential refresh token
  if (provider === 'google') {
    params.set('access_type', 'offline')
  }

  const authUrl = `${config.authUrl}?${params.toString()}`

  // Build response with state cookie
  const response = NextResponse.redirect(authUrl)
  response.cookies.set(STATE_COOKIE_NAME, state, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax',
    path:     '/',
    maxAge:   STATE_COOKIE_MAX_AGE,
  })

  log('info', 'auth.oauth.redirect', { provider })

  return response
}

// ─── 2. OAuth Callback ───────────────────────────────────────────────────────
// Called by GET /api/auth/{provider}/callback. Full flow: verify state → exchange
// code → fetch email → complete login → set session cookie → redirect home.

export async function handleOAuthCallback(
  provider: OAuthProviderId,
  req: NextRequest
): Promise<NextResponse> {
  const baseUrl = getBaseUrl(req)

  // Guard: provider not configured
  if (!isOAuthConfigured(provider)) {
    return NextResponse.json({ error: 'OAuth provider not configured' }, { status: 404 })
  }

  // 1. Extract code and state from query params
  const url       = new URL(req.url)
  const code      = url.searchParams.get('code')
  const stateParam = url.searchParams.get('state')

  if (!code || !stateParam) {
    log('warn', 'auth.oauth.callback.missing-params', { provider, hasCode: !!code, hasState: !!stateParam })
    return errorRedirect(req, 'invalid_state')
  }

  // 2. Verify state against cookie (CSRF protection — timing-safe)
  const stateCookie = req.cookies.get(STATE_COOKIE_NAME)?.value
  if (!stateCookie || !verifyOAuthState(stateCookie, stateParam)) {
    log('warn', 'auth.oauth.callback.state-mismatch', { provider })
    return errorRedirect(req, 'invalid_state')
  }

  // 3. Exchange code for access token (R4 — external HTTP)
  const redirectUri = `${baseUrl}/api/auth/${provider}/callback`
  const tokenResult = await exchangeCodeForToken(provider, code, redirectUri)
  if (!tokenResult.success) {
    log('error', 'auth.oauth.callback.token-exchange-failed', { provider, error: tokenResult.error.code })
    return errorRedirect(req, 'oauth_failed')
  }

  // 4. Fetch email from provider (R4 — external HTTP)
  const emailResult = await fetchOAuthEmail(provider, tokenResult.data.accessToken)
  if (!emailResult.success) {
    log('error', 'auth.oauth.callback.email-fetch-failed', { provider, error: emailResult.error.code })
    const errorCode = emailResult.error.code === 'OAUTH_EMAIL_NOT_VERIFIED'
      ? 'email_not_verified'
      : 'email_unavailable'
    return errorRedirect(req, errorCode)
  }

  const email = emailResult.data

  // 5. Verified resolution (R2 — proof-gate → resolve-via-port → session). The email is already
  //    proven (step 4 enforces verified_email / a verified GitHub address); the adapter marks it
  //    verified and the workflow asserts it. STAY: email-keyed resolve (find-or-create).
  const authDb = createAuthDb(taggedDb(db))
  const completion = oauthVerifiedCompletion(provider, email)
  const loginResult = await completeVerifiedResolution(completion, { resolve: emailKeyedResolve(authDb), db: authDb })
  if (!loginResult.success) {
    log('error', 'auth.oauth.callback.login-failed', { provider, email, error: loginResult.error.code })
    return errorRedirect(req, 'server_error')
  }

  // 6. Set session cookie on response (MUST match tRPC cookie attributes exactly)
  const response = NextResponse.redirect(new URL('/', req.url))

  response.cookies.set(SESSION_COOKIE_NAME, loginResult.data.rawToken, {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax',
    path:     '/',
    maxAge:   SESSION_MAX_AGE,
  })

  // 7. Clear state cookie
  response.cookies.set(STATE_COOKIE_NAME, '', {
    httpOnly: true,
    secure:   IS_PROD,
    sameSite: 'lax',
    path:     '/',
    maxAge:   0,
  })

  log('info', 'auth.oauth.callback.success', { provider, email })

  return response
}

// ─── 3. Configured Providers ──────────────────────────────────────────────────
// Called by GET /api/auth/providers. Public endpoint (no auth needed).

export function getConfiguredProviders(): { google: boolean; github: boolean } {
  return {
    google: isOAuthConfigured('google'),
    github: isOAuthConfigured('github'),
  }
}
