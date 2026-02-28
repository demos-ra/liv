// [core/api/router.ts]
// R5 — assembles all slice tRPC routers into the app router.
// Add new slice routers here as they come online.

import { createTRPCRouter } from './trpc-setup'
import { authRouter } from '@/features/F-identity/contract/auth-routes'

export const appRouter = createTRPCRouter({
  auth: authRouter,
  // chat:    chatRouter,    ← Phase B
  // project: projectRouter, ← Phase B
})

export type AppRouter = typeof appRouter
