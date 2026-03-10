// [F-identity/contract/trpc-procedures.ts]
// R3 — tRPC procedures typed against TRPCContext. Owned by F-identity.
// Core (R5) cannot import TRPCContext — procedures that depend on context live here.
// All slice routers import from this file, not from core/api/trpc-setup.

import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { TRPCContext } from './trpc-context'

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
