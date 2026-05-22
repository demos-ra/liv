// @liv-standard v1.5.2
// @present-standard v2.1
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-trpc.ts]
// Sprint 2 — Shot 5
// amended: present-rederive-shot-2 (v2.0 contract: Zod schema re-derived to mirror
//   PresentIntent / FocusSelector / OrderingSelector; WearerOperation +
//   OperationParameter discriminated-union schemas removed)
//
// R3 — tRPC router for F-present.
// Mirrors F-identity/contract/auth-routes.ts pattern (createTRPCRouter + protectedProcedure + zod input).
//
// Zod schema mirrors PresentIntent at the API boundary.
// TypeScript types remain the source of truth; zod is for runtime validation at boundary.
// FocusSelector uses discriminatedUnion on `kind`; OrderingSelector is a plain object.
//
// ctx provides userId from the PS-stamped session (protectedProcedure guarantees session non-null).
// scopeRef sourced from input.scopeRef (caller supplies project/workspace scope).

import { z }              from 'zod'
import { TRPCError }      from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/features/F-identity/contract/trpc-procedures'
import { presentService } from '../app/present-service'
import { generateId }     from '@/core/types/primitives'

import type {
  PresentIntent,
  FocusSelector,
  OrderingSelector,
  FrameworkRef,
  IntentIdRef,
} from '../config/present-types'

import type { ScopeRef, PositionRef } from '@/core/types/substrate.types'

// ── Zod: FocusSelector discriminated union (D2 — LOOKING AT WHAT) ──────────────

const FocusSelectorSchema = z.discriminatedUnion('kind', [
  z.object({
    kind:     z.literal('identity'),
    identity: z.string().min(1),
  }),
  z.object({
    kind:     z.literal('identity-role'),
    identity: z.string().min(1),
    role:     z.string().min(1),
  }),
  z.object({
    kind: z.literal('density'),
    rule: z.enum(['identity-density', 'position-density']).optional(),
  }),
])

// ── Zod: OrderingSelector (D3 — ARRANGED HOW) ─────────────────────────────────

const OrderingSelectorSchema = z.object({
  axis:      z.enum(['weight', 'temporal', 'categorical', 'relational']),
  direction: z.enum(['forward', 'backward']).optional(),
})

// ── Zod: PresentIntent (without userId — sourced from ctx) ────────────────────

const PresentIntentInput = z.object({
  consumerRef: z.string().min(1),
  scopeRef:    z.string().min(1),
  standpoint:  z.number().int().nullable(),
  focus:       FocusSelectorSchema,
  ordering:    OrderingSelectorSchema,
  bound: z.object({
    maxNodes:   z.number().int().positive(),
    maxThreads: z.number().int().positive(),
    walkBudget: z.number().int().positive(),
  }),
})

// ── Router ────────────────────────────────────────────────────────────────────

export const presentRouter = createTRPCRouter({

  /**
   * present.read — protected
   * Derives a PresentView for the authenticated wearer.
   * userId is sourced from ctx.session (PS-stamped); scopeRef from input.
   */
  read: protectedProcedure
    .input(PresentIntentInput)
    .mutation(async ({ input, ctx }) => {
      const intent: PresentIntent = {
        intentId:    generateId('intent') as unknown as IntentIdRef,
        consumerRef: input.consumerRef    as unknown as FrameworkRef,
        userId:      ctx.session!.userId,
        scopeRef:    input.scopeRef       as unknown as ScopeRef,
        standpoint:  input.standpoint as PositionRef | null,
        focus:       input.focus    as FocusSelector,
        ordering:    input.ordering as OrderingSelector,
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
