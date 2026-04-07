// @liv-standard v1.3
// [F-identity/exec/oauth-io.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// slice:      F-identity
// layer:      R4
// wires-in:
//   W-ATOM  OAuthProviderId     ../config/oauth-config
//   W-ATOM  OAUTH_PROVIDERS     ../config/oauth-config
//   W-ATOM  AuthResult          ../config/auth-types
// wires-out:
//   W-FN  exchangeCodeForToken  → F-identity/contract/oauth-contract
//   W-FN  fetchOAuthEmail       → F-identity/contract/oauth-contract
// deps:
//   R0  ../config/oauth-config
//   R0  ../config/auth-types (AuthResult)
//   R0  ../config/auth-error-factory (AuthErrors)
//
// A4: I/O at R4 only. All external HTTP calls live here.
// Result<T> for all fallible operations.

import type { OAuthProviderId } from '../config/oauth-config'
import { OAUTH_PROVIDERS } from '../config/oauth-config'
import type { AuthResult } from '../config/auth-types'
import { AuthErrors } from '../config/auth-error-factory'

// ─── Code Exchange ────────────────────────────────────────────────────────────
// A4: External HTTP — provider token endpoint.

export async function exchangeCodeForToken(
  provider: OAuthProviderId,
  code: string,
  redirectUri: string
): Promise<AuthResult<{ accessToken: string }>> {
  const config = OAUTH_PROVIDERS[provider]

  const clientId     = process.env[config.clientIdEnv] ?? ''
  const clientSecret = process.env[config.clientSecretEnv] ?? ''

  try {
    const body = new URLSearchParams({
      client_id:     clientId,
      client_secret: clientSecret,
      code,
      redirect_uri:  redirectUri,
      grant_type:    'authorization_code',
    })

    const res = await fetch(config.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        // GitHub quirk: without Accept: application/json, returns form-encoded
        'Accept':       'application/json',
      },
      body: body.toString(),
    })

    if (!res.ok) {
      const text = await res.text()
      return {
        success: false,
        error: AuthErrors.oauthCodeExchangeFailed({ provider, status: res.status, body: text }),
      }
    }

    const data = await res.json() as { access_token?: string; error?: string }

    if (data.error || !data.access_token) {
      return {
        success: false,
        error: AuthErrors.oauthCodeExchangeFailed({ provider, oauthError: data.error }),
      }
    }

    return { success: true, data: { accessToken: data.access_token } }
  } catch (err) {
    return {
      success: false,
      error: AuthErrors.oauthCodeExchangeFailed({ provider, cause: err instanceof Error ? err.message : String(err) }),
    }
  }
}

// ─── Email Fetch ──────────────────────────────────────────────────────────────
// A4: External HTTP — provider profile/email endpoint.

export async function fetchOAuthEmail(
  provider: OAuthProviderId,
  accessToken: string
): Promise<AuthResult<string>> {
  try {
    if (provider === 'google') {
      return fetchGoogleEmail(accessToken)
    }
    if (provider === 'github') {
      return fetchGitHubEmail(accessToken)
    }
    return { success: false, error: AuthErrors.oauthEmailUnavailable({ provider, reason: 'unknown provider' }) }
  } catch (err) {
    return {
      success: false,
      error: AuthErrors.oauthEmailUnavailable({ provider, cause: err instanceof Error ? err.message : String(err) }),
    }
  }
}

// ─── Google: GET /oauth2/v2/userinfo ──────────────────────────────────────────

async function fetchGoogleEmail(accessToken: string): Promise<AuthResult<string>> {
  const config = OAUTH_PROVIDERS.google

  const res = await fetch(config.profileUrl, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })

  if (!res.ok) {
    return {
      success: false,
      error: AuthErrors.oauthEmailUnavailable({ provider: 'google', status: res.status }),
    }
  }

  const data = await res.json() as { email?: string; verified_email?: boolean }

  if (!data.email) {
    return {
      success: false,
      error: AuthErrors.oauthEmailUnavailable({ provider: 'google', reason: 'no email in profile' }),
    }
  }

  return { success: true, data: data.email }
}

// ─── GitHub: GET /user/emails → find primary + verified ───────────────────────

interface GitHubEmailEntry {
  email:    string
  primary:  boolean
  verified: boolean
}

async function fetchGitHubEmail(accessToken: string): Promise<AuthResult<string>> {
  const res = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept:        'application/vnd.github+json',
    },
  })

  if (!res.ok) {
    return {
      success: false,
      error: AuthErrors.oauthEmailUnavailable({ provider: 'github', status: res.status }),
    }
  }

  const emails = await res.json() as GitHubEmailEntry[]

  // Find primary + verified email
  const primary = emails.find(e => e.primary && e.verified)
  if (primary) {
    return { success: true, data: primary.email }
  }

  // Fallback: any verified email
  const verified = emails.find(e => e.verified)
  if (verified) {
    return { success: true, data: verified.email }
  }

  // No verified email — user must verify on GitHub first
  return {
    success: false,
    error: AuthErrors.oauthEmailNotVerified({ provider: 'github' }),
  }
}
