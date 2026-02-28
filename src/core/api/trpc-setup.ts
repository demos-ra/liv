// [core/api/trpc-setup.ts]
// R5 — pure tRPC framework initialization. Zero business logic.
// Context type and factory live in F-identity/contract/trpc-context.ts (R3).
// Route assembly lives in F-identity/contract/auth-routes.ts (R3).

import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { TRPCContext } from '@/features/F-identity/contract/trpc-context'

const t = initTRPC.context<TRPCContext>().create({
  transformer: superjson,
})

export const createTRPCRouter   = t.router
export const publicProcedure    = t.procedure

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.user) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({ ctx: { ...ctx, session: ctx.session, user: ctx.user } })
})
