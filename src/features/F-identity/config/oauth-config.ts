// @liv-standard v1.3
// [F-identity/config/oauth-config.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// slice:      F-identity
// layer:      R0
// wires-out:
//   W-ATOM  OAuthProviderId     → F-identity/exec/oauth-io, F-identity/contract/oauth-contract
//   W-ATOM  OAuthProviderConfig → F-identity/exec/oauth-io
//   W-ATOM  OAUTH_PROVIDERS     → F-identity/exec/oauth-io, F-identity/contract/oauth-contract
//   W-FN    isOAuthConfigured   → F-identity/contract/oauth-contract
// deps:      none (R0 — pure declarations + config detection)
//
// A6: Declare at R0. A1: F-identity owns all auth config.
// isOAuthConfigured reads process.env — same pattern as allowlist.ts (R0 config detection).

// ─── Types ────────────────────────────────────────────────────────────────────

export type OAuthProviderId = 'google' | 'github'

export interface OAuthProviderConfig {
  authUrl:         string
  tokenUrl:        string
  profileUrl:      string
  scopes:          string
  clientIdEnv:     string
  clientSecretEnv: string
}

// ─── Provider Registry ────────────────────────────────────────────────────────

export const OAUTH_PROVIDERS: Record<OAuthProviderId, OAuthProviderConfig> = {
  google: {
    authUrl:         'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl:        'https://oauth2.googleapis.com/token',
    profileUrl:      'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes:          'email profile',
    clientIdEnv:     'GOOGLE_CLIENT_ID',
    clientSecretEnv: 'GOOGLE_CLIENT_SECRET',
  },
  github: {
    authUrl:         'https://github.com/login/oauth/authorize',
    tokenUrl:        'https://github.com/login/oauth/access_token',
    profileUrl:      'https://api.github.com/user',
    scopes:          'read:user user:email',
    clientIdEnv:     'GITHUB_CLIENT_ID',
    clientSecretEnv: 'GITHUB_CLIENT_SECRET',
  },
} as const

// ─── Config Detection ─────────────────────────────────────────────────────────
// Same pattern as allowlist.ts — process.env read at R0 for config detection.

export function isOAuthConfigured(provider: OAuthProviderId): boolean {
  const config = OAUTH_PROVIDERS[provider]
  const clientId     = process.env[config.clientIdEnv]
  const clientSecret = process.env[config.clientSecretEnv]
  return Boolean(clientId && clientId.trim() !== '' && clientSecret && clientSecret.trim() !== '')
}
