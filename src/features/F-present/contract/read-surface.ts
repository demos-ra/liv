// @liv-standard v1.5.2
// @governing-spec COIN v1.0 (read-engine)
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/read-surface.ts]
//
// The external read surface for F-present's read engine. The engine itself runs
// through the live read-front (presentContext, R2) — one path, no duplicate
// plumbing — so external readers get exactly the computed present the LLM wakes
// with. /api/present (REST) and the tRPC present route both resolve here. No
// stored geometry, no new shape: this surface emits the engine's rendered present.

import { presentContext } from '../app/cognition-orchestrator'
import { createTRPCRouter, protectedProcedure } from '@/features/F-identity/contract/trpc-procedures'

// readPresent — resolve the wearer's current present (transcript + forest@ALL +
// sheet@focus@ALL), rendered to context text by the engine.
export async function readPresent(userId: string): Promise<string> {
  return presentContext(userId)
}

// tRPC router — the kept `present` route (F-identity/router.ts slots this as
// `present:`). userId is sourced from the PS-stamped session, never an input.
export const presentRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx }) => ({
    present: await readPresent(ctx.session!.userId),
  })),
})
