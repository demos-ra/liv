// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-trpc.ts]
// Sprint 2 — Shot 5; present-rederive-shot-2 (v2.0 Zod mirror);
//   sprint-b3-present-build (v3.0); sprint-b3-present-v5 (v5.0: intent collapse);
//   sprint-b3-present-v6 — Shot 7 (Zod mirrors the three-control PresentIntent)
//
// R3 — tRPC router for F-present.
// Mirrors F-identity/contract/auth-routes.ts pattern.
//
// Zod schema mirrors the v6.0 PresentIntent at the API boundary ([R9]): the
// envelope carries `camera` (a CameraSetting discriminated union — 'derived'
// or 'set' with an anchor), `temporal` (a TemporalSetting discriminated union —
// 'surface' or 'span' with optional bounds), and `standpoint` (which position).
// The lens is NOT a boundary input — it is stored dial state ([R10]/[R2]).
// TypeScript types remain the source of truth; Zod is runtime boundary validation.
//
// ctx provides userId from the PS-stamped session (protectedProcedure guarantees
// session non-null). scopeRef sourced from input.

import { z }              from 'zod'
import { TRPCError }      from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/features/F-identity/contract/trpc-procedures'
import { presentService } from '../app/present-service'
import { generateId }     from '@/core/types/primitives'

import type {
  PresentIntent,
  FrameworkRef,
  IntentIdRef,
  CameraSetting,
  TemporalSetting,
} from '../config/present-types'

import type { ScopeRef, PositionRef } from '@/core/types/substrate.types'

// ── Zod: the three controls (v6.0, [R9]/[R10]) ────────────────────────────────
// CameraSetting — 'derived' (user path) | 'set' (LLM look, carries an anchor).
const CameraSettingInput = z.discriminatedUnion('mode', [
  z.object({ mode: z.literal('derived') }),
  z.object({ mode: z.literal('set'), anchor: z.string().min(1) }),
])

// TemporalSetting — 'surface' (a still) | 'span' (history/motion, optional bounds).
const TemporalSettingInput = z.discriminatedUnion('depth', [
  z.object({ depth: z.literal('surface') }),
  z.object({
    depth: z.literal('span'),
    from:  z.number().int().nonnegative().optional(),
    to:    z.number().int().nonnegative().optional(),
  }),
])

// ── Zod: PresentIntent input (the three-control envelope) ─────────────────────
const PresentIntentInput = z.object({
  consumerRef: z.string().min(1),
  scopeRef:    z.string().min(1),
  camera:      CameraSettingInput,
  temporal:    TemporalSettingInput,
  standpoint:  z.number().int().nonnegative().nullable(),
  bound: z.object({
    maxNodes:   z.number().int().positive(),
    maxEdges:   z.number().int().positive(),
    walkBudget: z.number().int().positive(),
  }),
})

// ── Router ────────────────────────────────────────────────────────────────────

export const presentRouter = createTRPCRouter({

  /**
   * present.read — protected
   * Resolves a PresentView for the authenticated wearer.
   * userId is sourced from ctx.session (PS-stamped); scopeRef from input.
   * v6.0: the intent carries the three controls — camera + temporal + standpoint.
   */
  read: protectedProcedure
    .input(PresentIntentInput)
    .mutation(async ({ input, ctx }) => {
      const intent: PresentIntent = {
        intentId:    generateId('intent') as unknown as IntentIdRef,
        consumerRef: input.consumerRef    as unknown as FrameworkRef,
        userId:      ctx.session!.userId,
        scopeRef:    input.scopeRef       as unknown as ScopeRef,
        camera:      input.camera   as CameraSetting,
        temporal:    input.temporal as TemporalSetting,
        standpoint:  input.standpoint as PositionRef | null,
        bound:       input.bound,
        provenance: {
          consumerSlice: input.consumerRef as unknown as FrameworkRef,
          stampedAt:     Date.now(),
        },
      }

      const result = await presentService(intent)

      if (!result.ok) {
        throw new TRPCError({
          code:    'INTERNAL_SERVER_ERROR',
          message: result.error.message,
        })
      }

      return result.data
    }),
})
