// @liv-standard v1.5.1 amended phase-5 sprint-13-shot-2 sprint-13-shot-3
// [F-plan/contract/liv-standard-binding.ts]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-5
//             sprint-13-shot-2 (import: F-planner/types/planner-const → F-builder/config/builder-const;
//                               contractRef strings: F-planner.* → F-builder.*;
//                               wires-in/wires-out/deps corrected)
//             sprint-13-shot-3 (moved: F-la-config/contract/ → F-plan/contract/R3;
//                               slice updated to F-plan; layer R3)
// slice:      F-plan
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
//   W-ATOM  PLANNER_CONST               ← F-builder/R0 builder-const
// wires-out:
//   W-ATOM  LIV_STANDARD_DOMAIN_BINDING → F-builder/R2 (builder-plan-emit), F-builder/R2 (builder-pipeline)
//   W-ATOM  TierComputeContext          → future calibration consumers (post-Phase 5 seam)
//   W-ATOM  computeTierLimits           → binding composer + future calibration path
// deps:
//   R5 @/core/types/plan-standard.types
//   R5 @/core/types/primitives
//   R0 @/features/F-builder/config/builder-const
// validated:  pending

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
import { PLANNER_CONST } from '@/features/F-builder/config/builder-const'

// ─── Tier computation seam ───────────────────────────────────────────────────

export type TierComputeContext = {
  // TODO (post-Phase 5): userTier, jobBudget, modelCtx, historicalTokenConsumption
}

export type TierLimits = {
  readonly [tier: string]: CapacityBudget
}

export function computeTierLimits(_ctx?: TierComputeContext): TierLimits {
  return {
    Largest:  { budget: 24000, unit: 'tokens' },
    Medium:   { budget:  8000, unit: 'tokens' },
    Smallest: { budget:  2000, unit: 'tokens' },
  }
}

// ─── Typed-atom schema refs ──────────────────────────────────────────────────

const INSTANCE_INPUT_ATOM:  TypedAtomSchema = {
  ref:      'InstanceInput'  as TypedAtomRef,
  shapeRef: 'liv-standard.InstanceInput',
}
const INSTANCE_OUTPUT_ATOM: TypedAtomSchema = {
  ref:      'InstanceOutput' as TypedAtomRef,
  shapeRef: 'liv-standard.InstanceOutput',
}

// ─── RoleClass map ───────────────────────────────────────────────────────────

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

const SPLIT_AXIS: SplitAxisDescriptor = {
  axisId:     'r-layer',
  splitFnRef: 'liv-standard.splitByRLayer',
}

// ─── DomainFailsafes ─────────────────────────────────────────────────────────

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

// ─── Render / Validate contract descriptors ──────────────────────────────────

const RENDER_CONTRACT:   RenderContractDescriptor   = {
  contractRef: 'F-builder.buildInstancePrompt',
}
const VALIDATE_CONTRACT: ValidateContractDescriptor = {
  contractRef: 'F-builder.validateHandoff',
}

// ─── LIV_STANDARD_DOMAIN_BINDING ─────────────────────────────────────────────

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
