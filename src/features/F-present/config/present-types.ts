// @liv-standard v1.5.2
// @present-standard v2.1
// [F-present/R0]
// Built with LIV · livai.dev
// [F-present/config/present-types.ts]
// Sprint 2 — Shot 1; present-rederive — Shot 2 (v1.0.1 → v2.0 contract re-derivation)
//
// All atom types from Present Standard v2.0 §2.1 + §2.4.
// Governed by: Present Standard v2.0
//
// v2.0 re-derivation (STEP-1-derive-corrected-rev2.md):
//   The v1.0.1 wearer-callable surface — five operations (search-by-identity,
//   search-by-role, default-entry, move-neighborhood, move-trajectory) carried
//   as the five-arm WearerOperation / OperationParameter unions — was re-derived
//   over the WEARER-INTENT domain (Phase two) rather than the substrate-primitive
//   domain. The nine-cell grid (Phase four) collapsed the operation set to ONE
//   parameterized operation: present(standpoint, focus, ordering) → PresentView.
//   The five v1.0.1 operations survive only as PRESETS — named configurations of
//   the one operation — not as a typed enum.
//
//   WearerOperation and OperationParameter are REMOVED. PresentReadIntent is
//   REMOVED. The wearer-callable input is now PresentIntent, carrying the three
//   independent dimensions of wearer-intent space (Phase three):
//     D1 standpoint  — FROM WHERE  — PositionRef | null
//     D2 focus       — LOOKING AT WHAT — FocusSelector (3-arm)
//     D3 ordering    — ARRANGED HOW    — OrderingSelector
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
//     local branded alias. Forward: promote to substrate.types at next MF revision.
//
//   Timestamp ← number (ms epoch), per substrate pattern (SubstrateWriteInput.source.time).

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

// ── FocusSelector — §2.1 — D2 focal selector (LOOKING AT WHAT) ────────────────
// Three-arm discriminated union: the target the view is centred on.
//   identity      — a named identity
//   identity-role — a named identity in a named role
//   density       — no named target; the density-default anchor (optional rule
//                    selects identity-density vs position-density crystallization)

export type FocusSelector =
  | { kind: 'identity';      identity: IdentityRef                       }
  | { kind: 'identity-role'; identity: IdentityRef; role: RoleRef        }
  | { kind: 'density';       rule?: 'identity-density' | 'position-density' }

// ── OrderingSelector — §2.1 — D3 ordering (ARRANGED HOW) ──────────────────────
// The axis the view is projected along, with optional direction.

export type OrderingSelector = {
  axis:       'weight' | 'temporal' | 'categorical' | 'relational'
  direction?: 'forward' | 'backward'
}

// ── ViewBound ─────────────────────────────────────────────────────────────────

export type ViewBound = {
  maxNodes:   number
  maxThreads: number
  walkBudget: number
}

// ── PresentIntent — §2.1 — the one wearer-callable input (v2.0) ───────────────
// Replaces PresentReadIntent. Carries the three independent dimensions of
// wearer-intent space plus the existing envelope fields.
//   standpoint — D1: FROM WHERE. null = the live present (head); non-null = a
//                Reading-A snapshot ceilinged at that chain position.
//   focus      — D2: LOOKING AT WHAT.
//   ordering   — D3: ARRANGED HOW.
// Envelope fields (bound, userId, scopeRef, intentId, consumerRef, provenance)
// carry the same names and types as the v1.0.1 PresentReadIntent envelope.

export type PresentIntent = {
  intentId:    IntentIdRef
  consumerRef: FrameworkRef
  userId:      UserId
  scopeRef:    ScopeRef
  standpoint:  PositionRef | null
  focus:       FocusSelector
  ordering:    OrderingSelector
  bound:       ViewBound
  provenance:  OriginProvenance
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
  axis:       'weight' | 'temporal' | 'categorical' | 'relational'
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
  contentClassFilter?: ContentClass              // declared when ContentClass filter applied per LMA13
  asOfPosition?:       PositionRef               // v2.0: declared when standpoint ceiling applied per LM v3.5
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
// v2.0: PresentView's structural skeleton (composition / provenance /
// reversibility, the node/thread shapes) is preserved from v1.0.1. Two field
// types change as a structural consequence of the operation-set collapse:
//   derivedFromIntent — retyped PresentReadIntent → PresentIntent.
//   provenance.operationApplied — REMOVED. The v1.0.1 field recorded which of
//     five operations ran; under v2.0 the verb layer has one member (`present`),
//     so the field records a dimension with nothing behind it. Each wearer-intent
//     dimension is recorded inside the shape via its own slot — standpoint via
//     provenance + ReadPrimitiveTrace.asOfPosition, focus via anchorDerived,
//     ordering via composition.perspective — leaving no slot for `operation`.

export type PresentView = {
  viewId:            ViewIdRef
  derivedFromIntent: PresentIntent
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
    anchorDerived:        AnchorTrace
    weightingApplied:     WeightingTrace
  }
  reversibility: {
    appealCourtIs:    'substrate-state-change-table'
    replayDiscipline: 'invoke F-present with same PresentIntent → equivalent PresentView per PrA8'
  }
}

// ── PresentViewEmission — §2.1 ≡ SubstrateWriteInput populated per PrA3 ───────
// Alias: a PresentViewEmission IS a SubstrateWriteInput where:
//   source.channel      = 'internal-derivation'
//   source.contentClass = 'system-introspection'
//   carrier             = 'self' (present-standard §2.1)

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
