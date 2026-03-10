// @liv-standard v1.0
// [middleware.ts]
// Built with LIV · livai.dev
// Next.js middleware entrypoint — delegates to F-identity auth guard.
// A4: I/O at R4 only. Edge registration is pure delegation — no logic here.
// Note: config must be a static literal — Turbopack cannot re-export it.

export { authMiddleware as middleware } from '@/features/F-identity/contract/auth-middleware'

export const config = {
  runtime: 'nodejs',
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
