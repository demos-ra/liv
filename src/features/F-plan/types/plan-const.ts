// @liv-standard v1.5.1
// [F-plan/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    phase-6-sprint-a (slice introduction)
// slice:      F-plan
// layer:      R0
// wires-in:
//   W-ATOM  Semver                          ←  core/R5 primitives
//   W-ATOM  Milliseconds                    ←  core/R5 plan-standard.types
//   W-ATOM  DomainBinding                   ←  core/R5 plan-standard.types
// wires-out:
//   W-ATOM  PLAN_CONST                       →  F-plan/R1, F-plan/R2
//   W-ATOM  PLAN_DOMAIN_BINDING              →  F-plan/R1
//   W-ATOM  PLAN_AUTHORING_PROGRAM_VERSION   →  F-plan/R1, F-plan/R2
//   W-ATOM  PLAN_CONFIRM_KEYWORDS            →  F-plan/R2
//   W-ATOM  PLAN_PROGRAM_ID                  →  F-plan/R1, F-plan/R2
//   W-ATOM  PLAN_STANDARD_ID                 →  F-plan/R2 (AS carrier framework.id, payload.domain)
//   W-ATOM  PLAN_STANDARD_VERSION            →  F-plan/R2 (AS carrier framework.version, payload.domainVersion)
//   W-ATOM  PLAN_SCHEMA_REF                  →  F-plan/R2 (AS payload.schemaRef)
// deps:
//   R0  core/R5 primitives
//   R0  core/R5 plan-standard.types
// validated:  pending
//
// F-plan R0 — instance values (binding, constants, decision-D row seeds).
// A1: F-plan owns these instance values for the user-objective domain. This
//     is NOT the LIV-Standard build-pipeline binding (that lives in F-plan/contract/liv-standard-binding.ts).
// A6: every magic number used by R1+ originates here. R1 imports; never inlines.
//
// Decision rows seeded:
//   D-BINDING        — PLAN_DOMAIN_BINDING shape + numerics
//   D-CONFIRM-PATTERN— PLAN_CONFIRM_KEYWORDS

import type { Semver } from '@/core/types/primitives'
import type {
  Milliseconds,
  DomainBinding,
  TypedAtomRef,
  TierClass,
} from '@/core/types/plan-standard.types'

// ─── Authoring program identity ───────────────────────────────────────────────
// Carried into every emitted PlanArtifactContent.producedBy (PA9). This is
// "who built the plan" — the program. Strictly distinct from AS carrier
// identity below (which is "what content framework defines this artifact").

/**
 * F-plan program identifier. Stable; used ONLY as
 * PlanArtifactContent.producedBy.programId. Never used at AS carrier site.
 */
export const PLAN_PROGRAM_ID = 'F-plan' as const

/**
 * F-plan authoring program version. Bumped by F-plan major-spec changes
 * (not per emission). Sprint A landing version. Used ONLY as
 * PlanArtifactContent.producedBy.programVersion.
 */
export const PLAN_AUTHORING_PROGRAM_VERSION: Semver = '1.0.0' as Semver

// ─── AS carrier identity ─────────────────────────────────────────────────────
// Per Plan Standard v2.2 §6.11 + §10:
//   framework            = { id: 'plan',     version: '2.2' }
//   payload.domain       =   'plan'
//   payload.domainVersion =  '2.2'
//   payload.schemaRef    =   'PlanArtifactContent'
//
// These identify the content framework (Plan Standard) at AS carrier level —
// distinct from the authoring program identity above. Two layers:
//   Carrier (Plan Standard) → 'plan' / '2.2'
//   Authoring (F-plan)      → 'F-plan' / '1.0.0' (producedBy only)

/** Plan Standard content framework id at AS carrier (`framework.id`, `payload.domain`). */
export const PLAN_STANDARD_ID = 'plan' as const

/** Plan Standard content framework version at AS carrier (`framework.version`, `payload.domainVersion`). */
export const PLAN_STANDARD_VERSION: Semver = '2.2' as Semver

/** AS payload schema identifier — names the payload.content shape (PlanArtifactContent). */
export const PLAN_SCHEMA_REF = 'PlanArtifactContent' as const

// ─── PLAN_CONST — retry + failsafe constants ─────────────────────────────────
// D-BINDING manifest values. R1 plan-compose reads these into:
//   PerDeclLimit.retryBudget    (PA4a, every declaration)
//   PerSetLimit.maxTime         (PA4b)
//   PerSetLimit.maxTransitions  (PA4b)
//   PerSetLimit.maxReentries    (PA4b)
//
// Rationale (per Manager dispatch):
//   RETRY_LIMITS.OBJECTIVE = 1   — single retry per objective declaration
//   FAILSAFE.MAX_TIME      = 5min (300_000 ms) — half F-planner build time;
//                                  plans don't run pipelines, only emit
//   FAILSAFE.MAX_TRANSITIONS = 10
//   FAILSAFE.MAX_REENTRIES   = 0  — Sprint A has no diagnose loop;
//                                   PA5 re-plan uses fresh emission, not in-plan re-entry

export const PLAN_CONST = {
  RETRY_LIMITS: {
    OBJECTIVE: 1,
  },
  FAILSAFE: {
    MAX_TIME:        300_000 as Milliseconds,
    MAX_TRANSITIONS: 10,
    MAX_REENTRIES:   0,
    PARTIAL_SUCCESS: { allowed: false } as const,
  },
} as const

// ─── PLAN_CONFIRM_KEYWORDS — D-CONFIRM-PATTERN ────────────────────────────────
// R2 plan-emit reads. Match: lowercase, trim, exact-token (whole message
// equals one of these). Substring matches DO NOT count.

export const PLAN_CONFIRM_KEYWORDS: readonly string[] = [
  'yes',
  'confirm',
  'go',
  'proceed',
] as const

// ─── PLAN_DOMAIN_BINDING — D-BINDING manifest ────────────────────────────────
// F-plan's instance values for the user-objective domain. Captured verbatim
// in PlanArtifactContent.binding at every emission (PA9, frozen).
//
// Shape conformance: typed against DomainBinding (Plan Standard v2.2). Sprint A
// scope: OBJECTIVE-only role class, sequence topology default.
//
// Multi-role binding (DEPENDENCY, CHECKPOINT, etc.) deferred to next iteration
// per spec §3.3.1.
//
// splitAxis is declared (shape requires it) but Sprint A composer never emits
// splitLineage — PA10a/b enforced by defensive non-emission, not by axis use.
//
// renderContract / validateContract — minimal stubs. Audit confirms shape
// conformance only this sprint. M-I runtime consumers (downstream) treat
// these descriptors per IA6 pass-through.

export const PLAN_DOMAIN_BINDING: DomainBinding = {
  domainId:      'plan',
  domainVersion: '1.0.0' as Semver,

  roleClasses: {
    OBJECTIVE: {
      inputType: {
        ref:      'objective-input' as TypedAtomRef,
        shapeRef: 'plan/objective-input/v1',
      },
      outputType: {
        ref:      'objective-output' as TypedAtomRef,
        shapeRef: 'plan/objective-output/v1',
      },
      tierHint: 'objective' as TierClass,
    },
  },

  tierLimits: {
    objective: {
      budget: 2048,                          // tokens per objective
      unit:   'tokens',
    },
  },

  // Sprint A: declared (shape requires it), not exercised. Composer never
  // emits splitLineage so axisId/splitFnRef are placeholders.
  splitAxis: {
    axisId:     'objective-split',
    splitFnRef: 'token-budget',
  },

  // Empty failsafes — domain-specific. Plan Standard v2.2 permits empty.
  domainFailsafes: {},

  // Stub descriptors — M-I downstream pass-through. Shape conformance only.
  renderContract: {
    contractRef: 'plan-render-stub-v1',
  },
  validateContract: {
    contractRef: 'plan-validate-stub-v1',
  },
}

// ─── End of plan-const.ts ────────────────────────────────────────────────────
