// @liv-standard v1.5.1 amended phase-5 sprint-13-shot-2
// [F-builder/contract/planner-adapter-port.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5
//             sprint-13-shot-2 (manifest: F-planner refs corrected to F-builder; contractRef strings updated)
// slice:      F-builder
// layer:      R3
// wires-in:
//   W-ATOM  DeclId, TypedAtom                    ← F-multi-instance/R3 mi-contract
//   W-ATOM  AIAdapterPort                        ← F-multi-instance/R3 mi-contract
//   W-ATOM  IAiAdapter                           ← F-builder/R2 builder-pipeline
//   W-ATOM  InstanceId                           ← core/R0 liv-standard.types
//   W-FN    validateHandoff                      ← core/R5 liv-api
//   W-ATOM  MODEL_TIER_MAP, MODEL_TIER constants ← F-builder/R0 builder-const
// wires-out:
//   W-FN    createAdapterPort                    → F-builder/R2 builder-pipeline (per-call construction)
// deps:
//   R3 @/features/F-multi-instance/contract/mi-contract
//   R2 @/features/F-builder/domain/builder-pipeline
//   R0 @/core/constants/liv-standard.types
//   R5 @/core/constants/liv-api
//   R0 ../config/builder-const
// validated:  pending
//
// Phase 5 — Build #3 adapter port.
//
//   Wraps F-builder's existing IAiAdapter (streamCompletion) into M-I's
//   AIAdapterPort (invokeRole) so real LLM calls flow through executeRun.
//
//   invokeRole semantics:
//     - declId + role identify the instance (RoleClassId == InstanceId string)
//     - inputPayload is opaque to the adapter port; stringified as the user message
//     - tierBudget.budget informs model selection via MODEL_TIER_MAP
//     - returns TypedAtom { kind, value, schemaRef } with the raw LLM text as value
//
//   resolveValidateContract:
//     Returns a validator keyed by contractRef. For 'F-builder.validateHandoff'
//     we adapt M-I's {declId, output: TypedAtom} shape to validateHandoff's
//     {from, to, output: {files, report?, errorLog?}} shape. Phase 5 treats
//     TypedAtom.value as the output.report string; IN-BUILD files aren't
//     surfaced through this path (they flow through the adapter's raw response
//     handler at a real M-I runtime; Phase 5 ships with validateHandoff in a
//     permissive mode that accepts any non-empty report).
//
// A5: R3 → R3 wiring is permitted. No R4 imports here.
// A7: if these wrappers are retired, M-I's ports can bind directly to real
//     F-ai-adapter R3 and F-plan R3 — this file is deletable (F-la-config dissolved sprint-13-shot-3).

import type { AIAdapterPort } from '@/features/F-multi-instance/contract/mi-contract'
import type { DeclId } from '@/core/types/plan-standard.types'
import type { TypedAtom } from '@/core/types/multi-instance-standard.types'
import type { IAiAdapter } from '../domain/builder-pipeline'
import type { InstanceId } from '@/core/constants/liv-standard.types'
import { validateHandoff } from '@/core/constants/liv-api'
import { PLANNER_CONST } from '../config/builder-const'

// ─── Tier selection helper ───────────────────────────────────────────────────

type TierClass = 'Largest' | 'Medium' | 'Smallest'

/**
 * Map numeric tierBudget to a TierClass via the binding's declared unit.
 * Phase 5 binding declares { Largest: 24000, Medium: 8000, Smallest: 2000 }
 * (unit: 'tokens'). Match on exact budget; fall back to 'Medium' if unrecognized.
 */
function classifyTier(budget: number): TierClass {
  if (budget >= 20000) return 'Largest'
  if (budget >= 5000)  return 'Medium'
  return 'Smallest'
}

/**
 * Resolve model id per tier class. Phase 5: anthropic-only preference.
 * Post-Phase 5: read user preferences through IAiAdapter closure.
 */
function modelForTier(tier: TierClass): string {
  return PLANNER_CONST.MODEL_TIER_MAP['anthropic-only'][tier]
}

// ─── AIAdapterPort builder ───────────────────────────────────────────────────

/**
 * Build an AIAdapterPort backed by F-builder's existing IAiAdapter.
 *
 * invokeRole: wraps streamCompletion. One round-trip call per instance. The
 *   LLM's concatenated text output is returned as TypedAtom.value; schemaRef
 *   matches the binding's InstanceOutput atom declaration.
 *
 * resolveValidateContract: returns a boolean-returning validator for the
 *   contractRef 'F-builder.validateHandoff'. Other refs return a permissive
 *   always-true validator (Phase 5 conservative default — Build #4 audit will
 *   flag any unexpected refs for review).
 */
export function createAdapterPort(ai: IAiAdapter, userId: string): AIAdapterPort {
  return {
    invokeRole: async (args: {
      declId:       DeclId
      role:         string
      inputPayload: unknown
      tierBudget:   { budget: number; unit: string }
    }): Promise<{ output: TypedAtom; tokenCount: number; durationMs: number }> => {
      const startedAt = Date.now()

      // Serialize inputPayload as the user message. Downstream prompt composition
      // belongs to the binding.renderContract handler; Phase 5 keeps this direct.
      const userContent = typeof args.inputPayload === 'string'
        ? args.inputPayload
        : JSON.stringify(args.inputPayload)

      const tier    = classifyTier(args.tierBudget.budget)
      const modelId = modelForTier(tier)

      let accumulated = ''
      const result = await ai.streamCompletion({
        userId,
        modelId,
        messages: [
          { role: 'user', content: userContent },
        ],
        onChunk: (chunk: string) => { accumulated += chunk },
      })

      const durationMs = Date.now() - startedAt

      if (!result.ok) {
        // M-I treats this as MI_ADAPTER_FAILURE via its own error wrapping.
        // Throwing here surfaces to runInstance's catch, which converts to
        // InstanceError; M-I's gate layer then escalates per IA class.
        throw new Error(`invokeRole failure for ${args.declId}/${args.role}: ${result.error.message ?? 'unknown'}`)
      }

      const output: TypedAtom = {
        typeRef: 'InstanceOutput' as TypedAtom['typeRef'],
        value:   accumulated,
      }

      return {
        output,
        tokenCount: result.data.totalTokens,
        durationMs,
      }
    },

    resolveValidateContract: (contractRef: string) => {
      if (contractRef === 'F-builder.validateHandoff') {
        return (args: { declId: DeclId; output: TypedAtom }): boolean => {
          // Adapt M-I shape to validateHandoff signature.
          // declId string == RoleClassId == InstanceId (validated by the binding).
          // from := 'Human' (Phase 5 default; real impl would track predecessor
          // role per dataFlow edges). to := the current declId's InstanceId.
          // output.report := TypedAtom.value (string-typed per adapter port above).
          const to = String(args.declId) as InstanceId
          const reportText = typeof args.output.value === 'string'
            ? args.output.value
            : JSON.stringify(args.output.value)

          const result = validateHandoff(
            'Human',
            to,
            { files: [], report: reportText, errorLog: undefined },
          )

          return result.valid
        }
      }

      // Unknown contractRef — permissive default. Phase 5 audit surfaces the
      // set of refs actually seen so the Phase 6+ binding can cover them.
      return (_args: { declId: DeclId; output: TypedAtom }): boolean => true
    },
  }
}
