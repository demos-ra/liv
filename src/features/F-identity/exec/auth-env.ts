// @liv-standard v1.5.1
// [F-identity/R4]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    foundation-group3a (new — env resolution lifted from R2 auth-workflow to R4 per A4/T2.3-R4)
// slice:      F-identity
// layer:      R4
// wires-in:   none (reads process.env — external I/O)
// wires-out:
//   W-INJECT  readAuthEnv  →  F-identity/R2 auth-workflow (injected via createAuthDeps)
// deps:       none
// validated:  pending

// ─────────────────────────────────────────────────────────────────────────────
// A4 / T2.3-R4: env reads are external I/O and belong at R4.
// auth-workflow (R2) previously read NEXT_PUBLIC_BASE_URL, NODE_ENV, and the
// three EMAIL_* vars directly. This file is the single R4 locus; R2 injects
// the resolved config via createAuthDeps.
// ─────────────────────────────────────────────────────────────────────────────

export type AuthEnvConfig = {
  baseUrl:      string
  isDev:        boolean
  emailApiKey:  string | undefined
  emailFrom:    string
  emailFromName: string
}

// Returns the resolved env config. Never throws — missing optional vars degrade
// to defaults (same behaviour as the prior inline reads).
export function readAuthEnv(): AuthEnvConfig {
  return {
    baseUrl:       process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000',
    isDev:         process.env.NODE_ENV !== 'production',
    emailApiKey:   process.env.EMAIL_API_KEY,
    emailFrom:     process.env.EMAIL_FROM_ADDRESS ?? 'onboarding@resend.dev',
    emailFromName: process.env.EMAIL_FROM_NAME    ?? 'LIV',
  }
}
