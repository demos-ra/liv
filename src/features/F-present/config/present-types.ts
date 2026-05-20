// @liv-standard v1.5.2
// @present-standard v1.0.1
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-types.ts]
// Sprint 2 — Shot 1
//
// All atom types from Present Standard v1.0.1 §2.1 + §2.4.
// Governed by: Present Standard v1.0.1
// Non-negotiables: 5 WearerOperation arms, 4 ReadPrimitive arms. No additions.
//
// Type-import provenance:
//   IdentityRef, RoleRef, ScopeRef, PositionRef, StateChangeId, ContentClass,
//   Relation, RelationModality, IdentityWithRole, SubstrateSourceRef
//     ← F-memory/contract/substrate-contract (cross-slice R3 per A5)
//
//   UserId (UserIdRef in standard prose) ← core/types/primitives
//     Standard references substrate A-09 UserIdRef; codebase exposes as plain UserId (string).
//     F-present treats UserId as the UserIdRef alias throughout.
//
//   FrameworkRef ← declared locally below per substrate A-12 intent.
//     Not yet a named export in core/types/substrate.types; declared here as a
//     local branded alias. Matches { id: string; version: Semver } FrameworkRef shape
//     comment in other standard types files, but Present Standard uses it as a
//     string identifier (slice name). Local string-brand is the correct resolution.
//     Forward: promote to substrate.types at next MF revision.
//
//   Timestamp ← number (ms epoch), per substrate pattern (SubstrateWriteInput.source.time).
//     Standard references substrate A-09 Timestamp; codebase does not export a named
//     Timestamp type — uses plain number throughout. Local alias declared below.

import type {
  IdentityRef,
  RoleRef,
  ScopeRef,
  PositionRef,
  StateChangeId,
  ContentClass,
  Relation,
  RelationModality,
  IdentityWithRole,
  SubstrateSourceRef,
  SubstrateWriteInput,
} from '@/core/types/substrate.types'

import type { UserId } from '@/core/types/primitives'

// ── Local aliases for substrate atoms not yet exported as named types ──────────

/** Substrate A-12: framework identifier (slice name string). Local alias — promote at next MF revision. */
export type FrameworkRef = string & { readonly _brand: 'FrameworkRef' }

/** Substrate A-09: ms-epoch timestamp. Local alias matching codebase pattern (plain number). */
export type Timestamp = number

// ── Standard-local vocabulary (per §2.4) — tagged-string-id types ─────────────

export type IntentIdRef   = string & { readonly _brand: 'IntentIdRef'   }
export type ViewIdRef     = string & { readonly _brand: 'ViewIdRef'     }
export type ViewNodeRef   = string & { readonly _brand: 'ViewNodeRef'   }
export type ViewThreadRef = string & { readonly _brand: 'ViewThreadRef' }

export type OriginProvenance = {
  consumerSlice: FrameworkRef
  stampedAt:     Timestamp
}

// ── WearerOperation — closed 5-arm discriminated union per §2.1 + spec non-negotiable ─

export type WearerOperation =
  | { kind: 'search-by-identity' }
  | { kind: 'search-by-role'     }
  | { kind: 'default-entry'      }
  | { kind: 'move-neighborhood'  }
  | { kind: 'move-trajectory'    }

// ── OperationParameter — 5-arm discriminated union, kind-matched to WearerOperation ───

export type OperationParameter =
  | { kind: 'search-by-identity'; identity: IdentityRef;                                        scopeOverride?: ScopeRef }
  | { kind: 'search-by-role';     identity: IdentityRef; role: RoleRef                                                   }
  | { kind: 'default-entry';      anchorRule?: 'identity-density' | 'position-density';         scopeOverride?: ScopeRef }
  | { kind: 'move-neighborhood';  window: number;        relationFilter?: IdentityRef                                     }
  | { kind: 'move-trajectory';    direction: 'forward' | 'backward'; count: number; relationFilter?: IdentityRef          }

// ── ViewBound ─────────────────────────────────────────────────────────────────

export type ViewBound = {
  maxNodes:   number
  maxThreads: number
  walkBudget: number
}

// ── PresentReadIntent — §2.1 ───────────────────────────────────────────────────

export type PresentReadIntent = {
  intentId:        IntentIdRef
  consumerRef:     FrameworkRef
  userId:          UserId
  scopeRef:        ScopeRef
  operation:       WearerOperation
  parameter:       OperationParameter
  currentPosition: PositionRef | null
  bound:           ViewBound
  provenance:      OriginProvenance
}

// ── ViewNode, ViewThread ───────────────────────────────────────────────────────

export type ViewNode = {
  identity:            IdentityRef
  dominantSurfaceForm: string
  weight:              number      // [0, 1]
  sourceCount:         number
}

export type ViewThread = {
  source:               IdentityRef
  target:               IdentityRef
  relationType:         IdentityRef
  thickness:            number     // [0, 1]
  sourceStateChangeIds: StateChangeId[]
}

// ── PerspectiveDeclaration ────────────────────────────────────────────────────

export type PerspectiveDeclaration = {
  axis:       'time' | 'identity' | 'role'
  direction?: 'forward' | 'backward'
}

// ── AnchorTrace ───────────────────────────────────────────────────────────────

export type AnchorTrace = {
  source:    'wearer-content' | 'current-position' | 'system-derived'
  derivedAs: { identity?: IdentityRef; role?: RoleRef; position?: PositionRef }
  rule?:     'identity-density' | 'position-density'   // populated iff source = 'system-derived'
}

// ── ReadPrimitiveTrace ────────────────────────────────────────────────────────

export type ReadPrimitiveTrace = {
  primitive:           'identity-recurrence' | 'role-pattern' | 'adjacency' | 'iterate-axis'
  parameters:          Record<string, unknown>   // kind-specific per LMA9
  recordCount:         number
  contentClassFilter?: ContentClass              // v1.0.1: declared when filter applied per LMA13
}

// ── WeightingTrace ────────────────────────────────────────────────────────────

export type WeightingTrace = {
  weightMap:         Record<string, number>
  weightingBasis:    'option-C-v1.0'
  thresholdsApplied: {
    w_recur:   number
    w_density: number
    w_adj:     number
  }
}

// ── PresentView — composed-view atom (per §2.1 ratified shape) ─────────────────

export type PresentView = {
  viewId:            ViewIdRef
  derivedFromIntent: PresentReadIntent
  emittedAt:         Timestamp              // substrate A-09
  composition: {
    nodes:       ViewNode[]
    threads:     ViewThread[]
    focus:       ViewNodeRef
    perspective: PerspectiveDeclaration
  }
  provenance: {
    sourceStateChangeIds: StateChangeId[]
    readPrimitivesUsed:   ReadPrimitiveTrace[]
    operationApplied:     WearerOperation
    anchorDerived:        AnchorTrace
    weightingApplied:     WeightingTrace
  }
  reversibility: {
    appealCourtIs:    'substrate-state-change-table'
    replayDiscipline: 'invoke F-present with same PresentReadIntent → equivalent PresentView per PrA8'
  }
}

// ── PresentViewEmission — §2.1 ≡ SubstrateWriteInput populated per PrA3 ───────
// Alias: a PresentViewEmission IS a SubstrateWriteInput where:
//   source.channel      = 'internal-derivation'
//   source.contentClass = 'system-introspection'
//   carrier             = 'self' (present-standard §2.1)
// Shot 3 populates the concrete shape in emit-view.ts.

export type PresentViewEmission = SubstrateWriteInput

// ── Re-export cross-slice types consumed by this slice ────────────────────────
// These are declared here for use within F-present domain (R0 → R1).
// External consumers always import from F-present/contract/present-contract (R3).

export type {
  IdentityRef,
  RoleRef,
  ScopeRef,
  PositionRef,
  StateChangeId,
  ContentClass,
  Relation,
  RelationModality,
  IdentityWithRole,
  SubstrateSourceRef,
  SubstrateWriteInput,
}

export type { UserId }
