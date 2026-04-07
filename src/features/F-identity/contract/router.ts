// @liv-standard v1.3
// [F-identity/R3]
// Built with LIV · livai.dev
// [F-identity/contract/router.ts]
// R3 — assembles the tRPC app router from all slice routers.
// Owned by F-identity because auth is the first and foundational slice.
// Add new slice routers here as they come online.
// AppRouter type consumed by core/api/trpc-client.ts via this export.

import { createTRPCRouter } from './trpc-procedures'
import { authRouter } from './auth-routes'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  // chat:    chatRouter,    ← Phase B
  // project: projectRouter, ← Phase B
})

export type AppRouter = typeof appRouter
