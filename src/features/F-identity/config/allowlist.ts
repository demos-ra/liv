// @liv-standard v1.0
// [F-identity/config/allowlist.ts]
// Built with LIV · livai.dev
// R0: pure config, zero dependencies.
// A6: declared at R0 — callers import this interface, never raw env.
// Modular: swap isEmailAllowed implementation without touching any caller.
// To disable allowlist: remove ALLOWED_EMAILS from .env.local — no code change needed.

export interface IAllowlist {
  isEmailAllowed: (email: string) => boolean
}

// ── Default implementation — env-driven ──────────────────────────────────────
// ALLOWED_EMAILS=a@b.com,c@d.com in .env.local
// If var is absent → open signup (returns true for all)
// If var is present → only listed emails pass

function buildEnvAllowlist(): IAllowlist {
  return {
    isEmailAllowed(email: string): boolean {
      const raw = process.env.ALLOWED_EMAILS
      if (!raw || raw.trim() === '') return true
      const allowed = raw.split(',').map(e => e.trim().toLowerCase())
      return allowed.includes(email.trim().toLowerCase())
    }
  }
}

// Single export — callers import this, not the factory
// A1: F-identity owns this. No other slice imports except via auth-validation.ts
export const allowlist: IAllowlist = buildEnvAllowlist()

// Convenience re-export for direct call sites (auth-validation.ts)
// A3: typed boundary — string in, boolean out
export function isEmailAllowed(email: string): boolean {
  return allowlist.isEmailAllowed(email)
}
