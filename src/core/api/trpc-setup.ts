// [core/api/trpc-setup.ts]
// R5 — raw tRPC initialization only. Zero slice dependencies, zero context.
// Procedures (createTRPCRouter, publicProcedure, protectedProcedure) live in
// F-identity/contract/trpc-procedures.ts — they depend on TRPCContext (R3).

import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export const t = initTRPC.create({
  transformer: superjson,
})
