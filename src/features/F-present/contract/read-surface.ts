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
import type { PresentBundle } from '@/features/F-present/config/read-engine-types'
import { createTRPCRouter, protectedProcedure } from '@/features/F-identity/contract/trpc-procedures'

// readPresent — resolve the wearer's present, rendered to context text by the engine.
// `bundle` (R7 named config) selects the rail's sections: default native (windshield
// transcript + both tables); the wire passes PRESENT_BUNDLES.wire (tables only — the
// transcript is fetched via lookup). REST/tRPC dashboards take the native default.
export async function readPresent(userId: string, bundle?: PresentBundle): Promise<string> {
  return presentContext(userId, bundle)
}

// tRPC router — the kept `present` route (F-identity/router.ts slots this as
// `present:`). userId is sourced from the PS-stamped session, never an input.
export const presentRouter = createTRPCRouter({
  read: protectedProcedure.query(async ({ ctx }) => ({
    present: await readPresent(ctx.session!.userId),
  })),
})
