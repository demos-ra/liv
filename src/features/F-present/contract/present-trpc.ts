// @liv-standard v1.5.2
// @present-standard v6.0
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-trpc.ts]
// Sprint 2 — Shot 5; present-rederive-shot-2 (v2.0 Zod mirror);
//   sprint-b3-present-build (v3.0); sprint-b3-present-v5 (v5.0: intent collapse);
//   sprint-b3-present-v6 — Shot 7 (Zod mirrors the three-control PresentIntent);
//   sprint-beta-shot-2 (Item-2 Part A: four navigation routes — readDial /
//     setDial / listWindows / scrubBack — each R3→R2→R4, calling an R2
//     navigation wrapper over an existing v6.0 R4 exec primitive. No new exec,
//     no standard amendment. No route over listArchivedPositions — the
//     present-archive enumeration surface is deliberately withheld.)
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
import {
  navigateSetDial,
  navigateReadDial,
  navigateListWindows,
  navigateScrubBack,
}                         from '../app/present-service'
import { generateId }     from '@/core/types/primitives'

import type {
  PresentIntent,
  FrameworkRef,
  IntentIdRef,
  CameraSetting,
  TemporalSetting,
  GranularityDial,
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

// ── Zod: navigation route inputs — sprint-beta-shot-2 (Item-2 Part A) ─────────
// The navigation routes carry only what their R2 wrapper needs. userId is NOT
// an input on any of them — it is sourced from ctx.session (PS-stamped),
// exactly as `read` does. scopeRef is an input.

// ScopeRef-only — readDial / listWindows (pure reads).
const ScopeOnlyInput = z.object({
  scopeRef: z.string().min(1),
})

// setDial — a new GranularityDial position. cutoff ∈ [0,1] mass-fraction.
const SetDialInput = z.object({
  scopeRef: z.string().min(1),
  dial: z.object({
    cutoff:    z.number().min(0).max(1),
    setBy:     z.enum(['user', 'llm']),
    updatedAt: z.number().int().nonnegative(),
  }),
})

// scrubBack — navigate to a past position the consumer already holds.
// `position` is a standpoint from a prior PresentView (interactive navigation,
// not enumeration — there is no route that lists positions). bound is the
// resource ceiling, same shape as on PresentIntent.
const ScrubBackInput = z.object({
  consumerRef: z.string().min(1),
  scopeRef:    z.string().min(1),
  position:    z.number().int().nonnegative(),
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

  // ── Navigation routes — sprint-beta-shot-2 (Item-2 Part A) ──────────────────
  // A consumer moving through its OWN live present: change the lens, read the
  // lens, list its look-trail, scrub to a past position it already holds. Each
  // route is the R3 leg of the slice's standard R3→R2→R4 path — it calls an R2
  // navigation wrapper (present-service.ts), which awaits an existing v6.0 R4
  // exec primitive. No new exec function, no new capability, no standard
  // amendment. userId is sourced from ctx.session (PS-stamped) on every route,
  // exactly as `read` does. These are navigation primitives, NOT a bulk-export
  // surface: there is no route over listArchivedPositions (the enumeration
  // primitive), so iterate-then-dump over the present-archive is structurally
  // impossible — the present is LIV-proprietary service output, not exportable.

  /**
   * present.readDial — protected, query.
   * The current lens (granularity dial) for the authenticated wearer's scope.
   */
  readDial: protectedProcedure
    .input(ScopeOnlyInput)
    .query(async ({ input, ctx }) => {
      const result = await navigateReadDial(
        ctx.session!.userId,
        input.scopeRef as unknown as ScopeRef,
      )
      if (!result.ok) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: result.error.message })
      }
      return result.data
    }),

  /**
   * present.setDial — protected, mutation.
   * Persist a new lens position. Turning the lens does not recompute the held
   * present; it is a stored-state change ([R10]).
   */
  setDial: protectedProcedure
    .input(SetDialInput)
    .mutation(async ({ input, ctx }) => {
      const result = await navigateSetDial(
        ctx.session!.userId,
        input.scopeRef as unknown as ScopeRef,
        input.dial as GranularityDial,
      )
      if (!result.ok) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: result.error.message })
      }
      return result.data
    }),

  /**
   * present.listWindows — protected, query.
   * The accumulated Window set — the session's look-trail ([R12]/[R13]), in the
   * order opened.
   */
  listWindows: protectedProcedure
    .input(ScopeOnlyInput)
    .query(async ({ input, ctx }) => {
      const result = await navigateListWindows(
        ctx.session!.userId,
        input.scopeRef as unknown as ScopeRef,
      )
      if (!result.ok) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: result.error.message })
      }
      return result.data
    }),

  /**
   * present.scrubBack — protected, mutation.
   * Resolve the present as it was at a past position ([R16]). `position` is a
   * standpoint the consumer already holds (from a prior PresentView) — this is
   * interactive navigation to a known position, not archive enumeration.
   * Delegates to presentService's existing scrub-back routing (non-null
   * standpoint → archive lookup), so the scrub-back opens a Window and is gated
   * and projected like any present() call.
   */
  scrubBack: protectedProcedure
    .input(ScrubBackInput)
    .mutation(async ({ input, ctx }) => {
      const result = await navigateScrubBack(
        ctx.session!.userId,
        input.scopeRef as unknown as ScopeRef,
        input.consumerRef,
        input.position as unknown as PositionRef,
        input.bound,
      )
      if (!result.ok) {
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: result.error.message })
      }
      return result.data
    }),
})
