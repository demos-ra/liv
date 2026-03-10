// @liv-standard v1.0
// [middleware.ts]
// Built with LIV · livai.dev
// Next.js edge middleware entrypoint — delegates to F-identity auth guard.
// A4: I/O at R4 only. Edge registration is pure delegation — no logic here.

export { authMiddleware as middleware } from '@/features/F-identity/contract/auth-middleware'
export { middlewareMatcher as config } from '@/features/F-identity/contract/auth-middleware'
