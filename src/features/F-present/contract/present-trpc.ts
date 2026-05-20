// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R3]
// Built with LIV · livai.dev
// [F-present/contract/present-trpc.ts]
// Sprint 2 — Shot 5
//
// R3 — tRPC router for F-present.
// Mirrors F-identity/contract/auth-routes.ts pattern (createTRPCRouter + protectedProcedure + zod input).
//
// Zod schema mirrors PresentReadIntent at the API boundary.
// TypeScript types remain the source of truth; zod is for runtime validation at boundary.
// WearerOperation + OperationParameter use discriminatedUnion on `kind`.
//
// ctx provides userId from the PS-stamped session (protectedProcedure guarantees session non-null).
// scopeRef sourced from input.scopeRef (caller supplies project/workspace scope).

import { z }              from 'zod'
import { TRPCError }      from '@trpc/server'
import { createTRPCRouter, protectedProcedure } from '@/features/F-identity/contract/trpc-procedures'
import { presentService } from '../app/present-service'
import { generateId }     from '@/core/types/primitives'

import type {
  PresentReadIntent,
  WearerOperation,
  OperationParameter,
  FrameworkRef,
  IntentIdRef,
} from '../config/present-types'

import type { ScopeRef } from '@/core/types/substrate.types'

// ── Zod: WearerOperation discriminated union ──────────────────────────────────

const WearerOperationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('search-by-identity') }),
  z.object({ kind: z.literal('search-by-role')     }),
  z.object({ kind: z.literal('default-entry')      }),
  z.object({ kind: z.literal('move-neighborhood')  }),
  z.object({ kind: z.literal('move-trajectory')    }),
])

// ── Zod: OperationParameter discriminated union ───────────────────────────────

const OperationParameterSchema = z.discriminatedUnion('kind', [
  z.object({
    kind:          z.literal('search-by-identity'),
    identity:      z.string().min(1),
    scopeOverride: z.string().min(1).optional(),
  }),
  z.object({
    kind:     z.literal('search-by-role'),
    identity: z.string().min(1),
    role:     z.string().min(1),
  }),
  z.object({
    kind:          z.literal('default-entry'),
    anchorRule:    z.enum(['identity-density', 'position-density']).optional(),
    scopeOverride: z.string().min(1).optional(),
  }),
  z.object({
    kind:           z.literal('move-neighborhood'),
    window:         z.number().int().positive(),
    relationFilter: z.string().min(1).optional(),
  }),
  z.object({
    kind:           z.literal('move-trajectory'),
    direction:      z.enum(['forward', 'backward']),
    count:          z.number().int().positive(),
    relationFilter: z.string().min(1).optional(),
  }),
])

// ── Zod: PresentReadIntent (without userId — sourced from ctx) ────────────────

const PresentReadIntentInput = z.object({
  consumerRef:     z.string().min(1),
  scopeRef:        z.string().min(1),
  operation:       WearerOperationSchema,
  parameter:       OperationParameterSchema,
  currentPosition: z.number().int().nullable(),
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
    .input(PresentReadIntentInput)
    .mutation(async ({ input, ctx }) => {
      const intent: PresentReadIntent = {
        intentId:        generateId('intent') as unknown as IntentIdRef,
        consumerRef:     input.consumerRef    as unknown as FrameworkRef,
        userId:          ctx.session!.userId,
        scopeRef:        input.scopeRef       as unknown as ScopeRef,
        operation:       input.operation      as WearerOperation,
        parameter:       input.parameter      as OperationParameter,
        currentPosition: input.currentPosition as any,
        bound:           input.bound,
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
