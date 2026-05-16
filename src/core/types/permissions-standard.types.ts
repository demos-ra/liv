// @liv-standard v1.5.2
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.2
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM UserId               ← core/R5 primitives
//   W-ATOM ProjectId            ← core/R5 primitives
//   W-ATOM Semver               ← core/R5 primitives
//   W-ATOM Result               ← core/R5 primitives
//   W-ATOM AppError             ← core/R5 primitives
// wires-out:
//   W-ATOM RequestId                                   → F-permissions/R2 + R3 callsites (AK-REF branded)
//   W-ATOM EpochMs                                     → F-permissions consumers (AK-REF branded; PMS-local declaration paralleling PS+VS+RS+Plan precedent)
//   W-ATOM ScopeKind                                   → F-permissions consumers
//   W-ATOM ActionAtom                                  → F-permissions consumers (structural type alias for Action enum declared at F-permissions/R0)
//   W-ATOM RoleAtom                                    → F-permissions consumers (structural type alias for Role enum declared at F-permissions/R0)
//   W-ATOM DecisionOutcome                             → F-permissions consumers
//   W-ATOM DenyReasonKind                              → F-permissions consumers
//   W-ATOM PermissionMatrixShape                       → F-permissions consumers (structural shape of PERMISSION_MATRIX)
//   W-ATOM ResourceScope                               → F-permissions consumers
//   W-ATOM AccessDecisionRequest                       → F-permissions consumers
//   W-ATOM AccessDecisionRecord                        → F-permissions consumers, audit consumers
//   W-ATOM PermissionsValidityError                    → F-permissions error surface
//   W-ATOM ScopePositional                             → F-permissions internal state
//   W-ATOM SubjectBindingPositional                    → F-permissions internal state
//   W-ATOM ActionVocabularyPositional                  → F-permissions internal state
//   W-ATOM DecisionPositional                          → F-permissions internal state
// deps:
//   R5 ./primitives
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PERMISSIONS STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Permissions Standard v1.0 landing: generated against metaframework-v3-1 v3.3.1
// via generation-procedure-v1-0 v1.1.7. Mode = structural (known → structured).
// Carrier = self (per spec §6.1; PMS emits decisions inline via R3 contract surface;
// no enclosing framework carries the decision atom).
// Canonical spec: frameworks/standards/permissions-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.
//
// Concerns: decision-time access scoping (per-user vs global; subject identity +
// role binding; closed Action vocabulary + role × action matrix; decision shape).
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in permissions-standard.md §6.5 Custody.
//
// EpochMs note (parallel to PS / VS / RS / Plan precedent):
// PMS spec §2.4 cites EpochMs in the substrate consumption table; primitives.ts
// does not declare EpochMs; PS, VS v1.0, RS v1.0, and Plan v2.2 each declare
// EpochMs locally per per-framework single-source-via-reference discipline (A-08).
// PMS follows the same precedent: declared locally below.

import type {
  UserId,
  ProjectId,
  Semver,
  Result,
  AppError,
} from './primitives'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * RequestId — unique identifier per AccessDecisionRequest.
 * Scope: one per decision request at the F-permissions R3 contract surface.
 */
export type RequestId = string & { readonly _brand: 'RequestId' }

/**
 * Epoch milliseconds.
 * PMS-local declaration paralleling perimeter-standard.types.ts EpochMs,
 * verification-standard.types.ts EpochMs, research-standard.types.ts EpochMs,
 * and plan-standard.types.ts EpochMs (same shape, declared at this framework's
 * R5 boundary per A-08 single-source-via-reference per-framework declaration
 * discipline).
 */
export type EpochMs = number & { readonly _brand: 'EpochMs' }

// ─── Scope enum (Scope axis, §3.5 PMA-Sc1) ───────────────────────────────────

/**
 * ScopeKind — per-user vs global access scoping per Sprint B2 Shot 1 L0 ruling.
 * Closed enum: every AccessDecisionRequest.resourceScope.kind takes one of these
 * values. Closure rule additive per MA-S7 + S3.
 *
 * - 'per-user': scope owned by a specific UserId (possibly within a ProjectId)
 * - 'global':   system-wide scope (no per-user binding required at the scope itself)
 */
export type ScopeKind = 'per-user' | 'global'

// ─── Action / Role structural aliases ────────────────────────────────────────
// Action and Role enums are *declared* at F-permissions/R0 permissions-config.ts
// (the runtime config wire-out). Permissions Standard v1.0 references the enum
// content by structural alias here for cross-slice consumers that need the type
// without coupling to F-permissions/R0 directly. Per LIV-Standard A1 single
// ownership: declared once at F-permissions/R0; aliased here as a structural
// pass-through. PMA-Av2 vocabulary closure rule governs both declaration sites.

/**
 * ActionAtom — structural alias for the Action enum at F-permissions/R0.
 * Permissions Standard §3.5 PMA-Av2 closes the vocabulary at the 20 declared
 * v1.0 values. Cross-slice consumers may import this alias for type narrowing
 * without importing from F-permissions/R0 (the canonical declaration site).
 *
 * Discipline: keep this alias as `string` at the R5 boundary; runtime narrowing
 * happens at F-permissions/R0 import site where the ACTIONS keyof typeof
 * narrows to the closed set.
 */
export type ActionAtom = string

/**
 * RoleAtom — structural alias for the Role enum at F-permissions/R0.
 * Permissions Standard §3.9 vocabulary declares closed enum {'owner', 'member',
 * 'viewer'} at v1.0. Same A1 single-ownership pattern as ActionAtom.
 */
export type RoleAtom = string

// ─── PermissionMatrix structural shape ───────────────────────────────────────

/**
 * PermissionMatrixShape — structural shape of PERMISSION_MATRIX at F-permissions/R0.
 * Permissions Standard PMA-Av3 (matrix exhaustiveness): every (Role, Action)
 * cell explicitly declared. This type is the structural shape; the values live
 * at F-permissions/R0 per A1.
 */
export type PermissionMatrixShape = Readonly<Record<string, ReadonlyArray<string>>>

// ─── Decision enums (Decision axis, §3.5 PMA-D1 / PMA-D2) ────────────────────

/**
 * DecisionOutcome — closed binary outcome per Permissions Standard §3.5 PMA-D1.
 * Exhaustive: every AccessDecisionRecord.decision.outcome takes one of these
 * values. Cardinality = 1 per record (unitary-record per §1.4).
 */
export type DecisionOutcome = 'permit' | 'deny'

/**
 * DenyReasonKind — closed enum populated iff outcome='deny' per §3.5 PMA-D2.
 *
 * - 'no_role':           project_members lookup returned null for (subject, project);
 *                        OR global-scope action requested by non-system subject
 * - 'insufficient_role': role resolved but PERMISSION_MATRIX[role] does not
 *                        include the requested action
 * - 'scope_mismatch':    per-user-scope request where subject.userId !==
 *                        resourceScope.userId (PMA-Sb2 failure)
 * - 'unknown_action':    request.action not in declared Action enum (PMA-Av1 fail)
 */
export type DenyReasonKind =
  | 'no_role'
  | 'insufficient_role'
  | 'scope_mismatch'
  | 'unknown_action'

// ─── ResourceScope (Scope axis, §2.1) ────────────────────────────────────────

/**
 * ResourceScope — typed scope claim on AccessDecisionRequest per §2.1.
 *
 * Discriminant: `kind` ∈ {'per-user', 'global'}. Field cardinality per kind
 * enforced by PMA-Sc2:
 * - kind='per-user' → userId !== null; projectId nullable (null when scope is
 *                     per-user but not project-bound, e.g., system-wide-per-user
 *                     reads of own data)
 * - kind='global'   → userId === null AND projectId === null
 */
export interface ResourceScope {
  readonly kind: ScopeKind
  readonly userId: UserId | null
  readonly projectId: ProjectId | null
}

// ─── AccessDecisionRequest (input, §2.1) ─────────────────────────────────────

/**
 * AccessDecisionRequest — typed input per request per §2.1.
 *
 * Per spec §2.1: every field declared with type + cardinality.
 *
 * Provenance:
 * - requestId       — R0-generated stable identifier; one per request
 * - subject.userId  — F-identity-supplied authenticated UserId; required non-null
 * - subject.sessionRef — opaque session reference from F-identity; nullable
 *                        for system-initiated decisions
 * - action          — exactly one Action enum value per PMA-Av1
 * - resourceScope   — typed scope claim per ResourceScope above
 * - requestedAt     — F-permissions-stamped at request construction
 * - correlationRef  — upstream PS correlation when available; null otherwise
 */
export interface AccessDecisionRequest {
  readonly requestId: RequestId
  readonly subject: {
    readonly userId: UserId
    readonly sessionRef: string | null
  }
  readonly action: ActionAtom
  readonly resourceScope: ResourceScope
  readonly requestedAt: EpochMs
  readonly correlationRef: string | null
}

// ─── AccessDecisionRecord (output, §2.2) ─────────────────────────────────────

/**
 * AccessDecisionRecord — typed decision output per §2.2.
 *
 * Per spec §2.2: every field traces to exactly one Permissions Standard axis
 * or to the Identity-tier unitary-record rule.
 *
 * Carrier: 'self' per §6.1. PMS emits AccessDecisionRecord directly via the
 * F-permissions R3 contract surface; consumers branch on outcome inline.
 *
 * Decision composition (R2 resolveAndCheck):
 * - role resolved via R4 getMemberRole(subject.userId, resourceScope.projectId)
 *   when scope.kind='per-user' AND scope.projectId !== null
 * - role null when scope.kind='global' OR when project_members returns null
 * - outcome 'permit' iff role !== null AND PERMISSION_MATRIX[role].includes(action)
 * - outcome 'deny'   otherwise; denyReason populated per PMA-D2
 * - basis populated per PMA-D3 citing substrate §6.3 mechanical-criterion class
 */
export interface AccessDecisionRecord {
  readonly requestId: RequestId

  // Decision axis (PMA-D1, PMA-D2, PMA-D3)
  readonly decision: {
    readonly outcome: DecisionOutcome
    readonly role: RoleAtom | null
    readonly denyReason: DenyReasonKind | null
    readonly basis: string
  }

  // Scope axis (PMA-Sc1, PMA-Sc2)
  readonly resolvedScope: ResourceScope

  // Subject Binding axis (PMA-Sb1) — preserved through decision
  readonly subject: {
    readonly userId: UserId
  }

  // Action Vocabulary axis (PMA-Av1) — preserved through decision
  readonly action: ActionAtom

  // Provenance
  readonly permissionsFrameworkVersion: Semver
  readonly decidedAt: EpochMs
}

// ─── RoleBindingResult (R4 internal, §6.5 custody) ───────────────────────────

/**
 * RoleBindingResult — F-permissions/R4 getMemberRole return shape per §6.5.
 *
 * Alias of Result<RoleAtom | null>: null indicates no row in project_members
 * for the (userId, projectId) key — handled per PMA-Sb3 negative invariant
 * (heuristic Role assignment forbidden).
 */
export type RoleBindingResult = Result<RoleAtom | null>

// ─── PermissionsValidityError (error surface, §5.6) ──────────────────────────

/**
 * PermissionsValidityError — F-permissions error shape per §5.6 failure modes.
 *
 * Distinct from PermissionDeniedError (runtime deny on a well-formed request).
 * PermissionsValidityError indicates a malformed request that fails Permissions
 * Standard's axiom set at intake (e.g., null subject, null scope kind, internal
 * contract violation).
 */
export interface PermissionsValidityError extends AppError {
  readonly code:
    | 'PERMISSIONS_INVALID_SCOPE'
    | 'PERMISSIONS_INVALID_SUBJECT'
    | 'PERMISSIONS_INVALID_ACTION'
    | 'PERMISSIONS_INVALID_DECISION'
  readonly axiom:
    | 'PMA-Sc1' | 'PMA-Sc2' | 'PMA-Sc3'
    | 'PMA-Sb1' | 'PMA-Sb2' | 'PMA-Sb3'
    | 'PMA-Av1' | 'PMA-Av2' | 'PMA-Av3'
    | 'PMA-D1'  | 'PMA-D2'  | 'PMA-D3'
}

// ─── Positional state enums (per axis, §3.8 universal-variables table) ──────

/**
 * ScopePositional — Scope axis lifecycle position per §3.8.
 *
 * Transitions:
 *   unresolved → resolved-per-user  (when request.resourceScope.kind='per-user')
 *   unresolved → resolved-global    (when request.resourceScope.kind='global')
 */
export type ScopePositional =
  | 'unresolved'
  | 'resolved-per-user'
  | 'resolved-global'

/**
 * SubjectBindingPositional — Subject Binding axis lifecycle position per §3.8.
 *
 * Transitions:
 *   unresolved → identity-only        (subject.userId resolved, role not yet looked up)
 *   identity-only → role-resolved     (project_members returned non-null Role)
 *   identity-only → role-resolution-failed (project_members returned null OR DB error)
 */
export type SubjectBindingPositional =
  | 'unresolved'
  | 'identity-only'
  | 'role-resolved'
  | 'role-resolution-failed'

/**
 * ActionVocabularyPositional — Action Vocabulary axis lifecycle position per §3.8.
 *
 * Transitions:
 *   unresolved → declared            (request.action ∈ Action enum)
 *   declared → matrix-evaluated      (PERMISSION_MATRIX[role].includes(action) evaluated)
 */
export type ActionVocabularyPositional =
  | 'unresolved'
  | 'declared'
  | 'matrix-evaluated'

/**
 * DecisionPositional — Decision axis lifecycle position per §3.8.
 *
 * Transitions:
 *   pending → permitted              (outcome='permit')
 *   pending → denied                 (outcome='deny')
 *
 * Decision is terminal axis — resolves only after Scope + Subject Binding +
 * Action Vocabulary positional state = resolved.
 */
export type DecisionPositional =
  | 'pending'
  | 'permitted'
  | 'denied'
