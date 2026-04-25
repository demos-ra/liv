// @liv-standard v1.5.1
// [F-la-config/contract/liv-standard-binding.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5
// slice:      F-la-config
// layer:      R3
// wires-in:
//   W-ATOM  Semver                      ← core/R5 primitives
//   W-ATOM  DomainBinding               ← core/R5 plan-standard.types
//   W-ATOM  RoleClassInstance           ← core/R5 plan-standard.types
//   W-ATOM  TypedAtomSchema             ← core/R5 plan-standard.types
//   W-ATOM  TierClass                   ← core/R5 plan-standard.types
//   W-ATOM  CapacityBudget              ← core/R5 plan-standard.types
//   W-ATOM  SplitAxisDescriptor         ← core/R5 plan-standard.types
//   W-ATOM  FailsafeRule                ← core/R5 plan-standard.types
//   W-ATOM  RenderContractDescriptor    ← core/R5 plan-standard.types
//   W-ATOM  ValidateContractDescriptor  ← core/R5 plan-standard.types
//   W-ATOM  PLANNER_CONST               ← F-planner/R0 planner-const
// wires-out:
//   W-ATOM  LIV_STANDARD_DOMAIN_BINDING → F-planner/R2 (planner-plan-emit), F-planner/R3 (planner-inject)
//   W-ATOM  TierComputeContext          → future calibration consumers (post-Phase 5 seam)
//   W-ATOM  computeTierLimits           → binding composer + future calibration path
// deps:
//   R5 @/core/types/plan-standard.types
//   R5 @/core/types/primitives
//   R0 @/features/F-planner/types/planner-const
// validated:  pending
//
// Phase 5 — Build #1:
//   First DomainBinding instance to land post-4b withdrawal. Composed verbatim by
//   authoring program (F-planner R2 emission path) and carried into PlanArtifactContent
//   per Plan v2.2 PA9 (frozen at emission).
//
//   tierLimits ships as a computation-function seam, not a frozen per-tier const.
//   Phase 5 body returns static first-principles defaults; later phases read
//   TierComputeContext (user tier / job budget / model ctx / historical consumption)
//   and calibrate. The shape is what ships — numbers are policy output, not domain truth.
//
//   Ratio 1:4:12 matches reasoning-load step across tiers.
//     Largest  24000 — covers IN-DIAGNOSE worst case (8–12K in + 8–12K out)
//     Medium    8000 — standard IN-AUDIT / IN-COMPILE emission
//     Smallest  2000 — integrity check; anything over is misclassified
//     unit 'tokens' — M-I measures tokenCount natively; other units require conversion
//
//   Axiom cite:
//     A6 — declared once at F-la-config R3 (consumed by F-planner R2/R3, lower-to-lower via contract)
//     PA9 (Plan) — binding captured verbatim at emission; this module is the source of truth for that capture

import type { Semver } from '@/core/types/primitives'
import type {
  DomainBinding,
  RoleClassInstance,
  TypedAtomSchema,
  TypedAtomRef,
  TierClass,
  CapacityBudget,
  SplitAxisDescriptor,
  FailsafeRule,
  RenderContractDescriptor,
  ValidateContractDescriptor,
} from '@/core/types/plan-standard.types'
import { PLANNER_CONST } from '@/features/F-planner/types/planner-const'

// ─── Tier computation seam ───────────────────────────────────────────────────
// Phase 5 ships static defaults. Post-Phase 5 phases read TierComputeContext and
// calibrate per-user / per-job / per-model. Shape is stable; body evolves.

/**
 * Calibration inputs for per-context tier-budget computation.
 * Phase 5: unused — computeTierLimits returns static defaults.
 * Post-Phase 5: populated by caller (F-planner R2 emission path) with runtime signals.
 */
export type TierComputeContext = {
  // TODO (post-Phase 5): userTier, jobBudget, modelCtx, historicalTokenConsumption
  // Kept empty deliberately — declaring fields here before their sources exist
  // would freeze the seam prematurely. The type itself is the seam.
}

/**
 * Per-tier CapacityBudget map keyed by TierClass labels used in this binding.
 * Phase 5: static first-principles defaults. Post-Phase 5: computed from ctx.
 */
export type TierLimits = {
  readonly [tier: string]: CapacityBudget
}

/**
 * Compute per-tier capacity budgets.
 * Phase 5: returns static defaults. Caller may omit ctx.
 * Post-Phase 5: reads ctx to calibrate — signature unchanged.
 */
export function computeTierLimits(_ctx?: TierComputeContext): TierLimits {
  // Phase 5: static defaults. Seam for future per-context computation.
  // Post-Phase 5: read _ctx.userTier / _ctx.jobBudget / _ctx.modelCtx → calibrate.
  return {
    Largest:  { budget: 24000, unit: 'tokens' },
    Medium:   { budget:  8000, unit: 'tokens' },
    Smallest: { budget:  2000, unit: 'tokens' },
  }
}

// ─── Typed-atom schema refs (binding-local; resolved against domain R5 types) ─

const INSTANCE_INPUT_ATOM:  TypedAtomSchema = {
  ref:      'InstanceInput'  as TypedAtomRef,
  shapeRef: 'liv-standard.InstanceInput',
}
const INSTANCE_OUTPUT_ATOM: TypedAtomSchema = {
  ref:      'InstanceOutput' as TypedAtomRef,
  shapeRef: 'liv-standard.InstanceOutput',
}

// ─── RoleClass map — LIV-Standard domain role declarations ───────────────────
// Keys match PLANNER_CONST.STAGE_ORDER plus IN-DIAGNOSE (side-routed from IN-COMPILE).
// tierHint per role reflects domain reasoning-load policy at Phase 5.

const ROLE_CLASSES: { [id: string]: RoleClassInstance } = {
  'IN-MAIN': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Largest' as TierClass,
  },
  'IN-BUILD': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Largest' as TierClass,
  },
  'IN-RESOLVE': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Medium' as TierClass,
  },
  'IN-AUDIT': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Medium' as TierClass,
  },
  'IN-COMPILE': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Medium' as TierClass,
  },
  'IN-QA': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Medium' as TierClass,
  },
  'IN-DIAGNOSE': {
    inputType:  INSTANCE_INPUT_ATOM,
    outputType: INSTANCE_OUTPUT_ATOM,
    tierHint:   'Largest' as TierClass,
  },
}

// ─── SplitAxis ───────────────────────────────────────────────────────────────
// LIV-Standard decomposes bundles by R-layer (pre-emission policy).

const SPLIT_AXIS: SplitAxisDescriptor = {
  axisId:     'r-layer',
  splitFnRef: 'liv-standard.splitByRLayer',
}

// ─── DomainFailsafes — lifted from PLANNER_CONST.FAILSAFE into FailsafeRule shape ──
// Each entry names a threshold kind, its numeric value, and the action identifier
// the domain invokes when the threshold is breached.

const DOMAIN_FAILSAFES: { [key: string]: FailsafeRule } = {
  maxTransitions: {
    thresholdKind:  'transitions-per-build',
    thresholdValue: PLANNER_CONST.FAILSAFE.MAX_TRANSITIONS,
    actionRef:      'liv-standard.abortBuild',
  },
  maxReentries: {
    thresholdKind:  'reentries-per-build',
    thresholdValue: PLANNER_CONST.FAILSAFE.MAX_REENTRIES,
    actionRef:      'liv-standard.abortBuild',
  },
  maxBuildTimeMs: {
    thresholdKind:  'wall-clock-ms',
    thresholdValue: PLANNER_CONST.FAILSAFE.MAX_BUILD_TIME_MS,
    actionRef:      'liv-standard.abortBuild',
  },
  aiRetryLimit: {
    thresholdKind:  'infra-retries-per-call',
    thresholdValue: PLANNER_CONST.FAILSAFE.AI_RETRY_LIMIT,
    actionRef:      'liv-standard.escalateClass3',
  },
}

// ─── Render / Validate contract descriptors (M-I runtime slot pass-through) ──

const RENDER_CONTRACT:   RenderContractDescriptor   = {
  contractRef: 'F-planner.buildInstancePrompt',
}
const VALIDATE_CONTRACT: ValidateContractDescriptor = {
  contractRef: 'F-planner.validateHandoff',
}

// ─── LIV_STANDARD_DOMAIN_BINDING — frozen composition ───────────────────────
// Initialization invokes computeTierLimits() at module load per L0 directive.
// Frozen at module scope; captured verbatim by authoring program per PA9.

export const LIV_STANDARD_DOMAIN_BINDING: DomainBinding = Object.freeze({
  domainId:         'liv-standard',
  domainVersion:    'v1.5.1' as Semver,
  roleClasses:      ROLE_CLASSES,
  tierLimits:       computeTierLimits(),
  splitAxis:        SPLIT_AXIS,
  domainFailsafes:  DOMAIN_FAILSAFES,
  renderContract:   RENDER_CONTRACT,
  validateContract: VALIDATE_CONTRACT,
}) as DomainBinding
