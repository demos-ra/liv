// @liv-standard v1.3
// [core/R5]
// Built with LIV · livai.dev
// [core/api/router.ts]
// R5 — re-export shim only. App router assembly lives in F-identity/contract/router.ts.
// Core never assembles slice routers — that requires knowing which slices exist.

export { appRouter } from '@/features/F-identity/contract/router'
export type { AppRouter } from '@/features/F-identity/contract/router'
