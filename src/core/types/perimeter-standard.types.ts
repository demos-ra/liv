// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId               ← core/R5 primitives
//   W-ATOM UserId               ← core/R5 primitives
//   W-ATOM Semver               ← core/R5 primitives
//   W-ATOM Result               ← core/R5 primitives
//   W-ATOM AppError             ← core/R5 primitives
// wires-out:
//   W-ATOM ArrivalId                                  → all PS consumers, F-identity middleware (AK-REF branded)
//   W-ATOM DispatchId                                 → all PS consumers, F-identity middleware (AK-REF branded)
//   W-ATOM CrossingId                                 → all PS consumers (AK-REF branded)
//   W-ATOM EpochMs                                    → all PS consumers (AK-REF branded; PS-local declaration paralleling VS+Plan+RS precedent)
//   W-ATOM CorrelationRefBrand                        → cross-framework calibration with multi-instance-standard
//   W-ATOM DirectionKind                              → all PS consumers
//   W-ATOM DispositionKind                            → all PS consumers
//   W-ATOM ChannelKind                                → all PS consumers, F-identity middleware
//   W-ATOM ResolutionOutcomeKind                      → all PS consumers
//   W-ATOM ReversibilityFlag                          → all PS consumers
//   W-ATOM PerimeterDirectionPositional               → all PS consumers
//   W-ATOM PerimeterDispositionPositional             → all PS consumers
//   W-ATOM PerimeterAuthorityPositional               → all PS consumers
//   W-ATOM PerimeterChannelPositional                 → all PS consumers
//   W-ATOM PerimeterIdentityResolutionPositional      → all PS consumers
//   W-ATOM PerimeterCorrelationPositional             → all PS consumers
//   W-ATOM CellKind                                   → all PS consumers
//   W-ATOM GovernanceLevel                            → all PS consumers
//   W-ATOM ConfirmationStatus                         → all PS consumers
//   W-ATOM AuditStatus                                → all PS consumers
//   W-ATOM ChannelClaim                               → all PS consumers
//   W-ATOM IdentityClaim                              → all PS consumers
//   W-ATOM ResolvedIdentity                           → all PS consumers
//   W-ATOM CellGovernanceRecord                       → all PS consumers
//   W-ATOM EmissionPairRef                            → all PS consumers, Sprint 9 paired-write programs
//   W-ATOM AuthorityEnforcementRecord                 → all PS consumers
//   W-ATOM BoundaryArrival                            → F-identity middleware (intake constructor)
//   W-ATOM BoundaryDispatchRequest                    → program L4 (dispatch submitters)
//   W-ATOM BoundaryCrossingRecord                     → all PS consumers, audit consumers, LM (via SubstrateWriteInput translation)
//   W-ATOM PerimeterBinding                           → F-identity middleware, deployment configuration
//   W-ATOM PermittedAuthoritySet                      → PerimeterBinding instance authors
//   W-ATOM PerimeterValidityError                     → PS callers (error surface)
//   W-ATOM PerimeterCrossingResult                    → PS callers (Result-wrapped)
// deps:
//   R5 ./primitives
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PERIMETER STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// PS v1.0 landing: generated against metaframework-v3-1 v3.2.7 via
// generation-procedure-v1-0 v1.1.6. Mode = structural (known → structured).
// Carrier = named → living-memory v3.1 (per spec §6.1; structurally distinct
// from VS/RS/Plan AS-carriered pattern — PS produces typed signal that lands
// in LM as substrate state-change, not artifacts about the work).
// Canonical spec: F-FORWARD-1 (governance doc not yet authored; see PLACEMENT_REGISTRY change log)
// A1: declared once, at R5 core. Slices import — never redeclare.

// perimeter-standard.types.ts
// R5 type atoms for Perimeter Standard v1.0
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Living Memory v3.1 (frozen carrier input)
//
// Consumes: primitives.ts (NodeId, UserId, Semver, Result, AppError)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in perimeter-standard.md §6.5 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per spec §Constraints).
//
// EpochMs note (parallel to VS/RS/Plan precedent):
// PS spec §2.4 cites EpochMs in the substrate consumption table; primitives.ts
// does not declare EpochMs; VS v1.0, RS v1.0, and Plan v2.2 each declare EpochMs
// locally per per-framework single-source-via-reference discipline (A-08).
// PS follows the same precedent: declared locally below.

import type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
} from './primitives'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * ArrivalId — unique identifier per BoundaryArrival.
 * Scope: F-identity middleware-bound; one per intake-direction crossing claim.
 */
export type ArrivalId = string & { readonly _brand: 'ArrivalId' }

/**
 * DispatchId — unique identifier per BoundaryDispatchRequest.
 * Scope: per program-emitted dispatch request.
 */
export type DispatchId = string & { readonly _brand: 'DispatchId' }

/**
 * CrossingId — unique identifier per BoundaryCrossingRecord.
 * Scope: all crossings in audit-trail; pins to LM SubstrateWriteInput (intake)
 * or to dispatch outbound (dispatch direction) per §6.11.
 */
export type CrossingId = string & { readonly _brand: 'CrossingId' }

/**
 * Epoch milliseconds.
 * PS-local declaration paralleling verification-standard.types.ts EpochMs,
 * research-standard.types.ts EpochMs, and plan-standard.types.ts EpochMs
 * (same shape, declared at this framework's R5 boundary per A-08
 * single-source-via-reference per-framework declaration discipline).
 */
export type EpochMs = number & { readonly _brand: 'EpochMs' }

/**
 * CorrelationRef — branded reference to a multi-instance correlation.
 * Cross-framework calibration: shape derived from MI Standard v2.3 CorrelationRef;
 * PS consumes by reference per §2.6 + §6.5 custody. Brand here is informational
 * for type-resolution clarity at the PS R5 boundary.
 */
export type CorrelationRefBrand = string & { readonly _brand: 'CorrelationRef' }

// ─── Direction enum (Direction axis, §3.3 PA1) ───────────────────────────────

/**
 * DirectionKind — boundary crossing direction per Manual §I.4 + §IV.4.
 * Exhaustive: every BoundaryCrossingRecord.direction takes one of these values.
 */
export type DirectionKind = 'intake' | 'dispatch'

// ─── Disposition enum (Arrival Typing axis, §3.3 PA-T1) ──────────────────────

/**
 * DispositionKind — act vs reference disposition per Manual §IV.2.
 * Exhaustive: every BoundaryCrossingRecord.resolvedDisposition takes one of
 * these values. Reference dispositions produce no effect; act dispositions
 * produce substrate or world effect.
 */
export type DispositionKind = 'act' | 'reference'

// ─── Channel enum (Channel Classification axis, §3.3 PA-Cn1..PA-Cn4) ────────
// Open-vocabulary per Manual §I.6: new channel kinds are new enum values,
// added by additive amendment per S3. v1.0 declares 7 named values; the
// `string` admission permits forward extension prior to amendment ratification.

/**
 * ChannelKind — origin channel classification per Manual §IV.2 SourceRef.channel.
 * Open-vocabulary per Manual §I.6 + §S3 additive extension discipline.
 *
 * v1.0 named values:
 * - 'wearer-message': direct wearer assertion via chat or input surface
 * - 'wearer-query': wearer-initiated read/render query
 * - 'ai-reply': LLM-emitted response (System-L0 originated, scope-bound)
 * - 'system-trigger': system-internal scheduled or event-driven trigger
 * - 'integration-event': external system integration event (webhook, etc.)
 * - 'scheduled-trigger': time-scheduled internal trigger
 * - 'internal-derivation': framework-derived signal (cross-framework consultation)
 *
 * The trailing `string` admits open-vocabulary extension; G-PS-Cn2 at v1.0
 * accepts any string per declared baseline (gate may tighten in future amendments).
 */
export type ChannelKind =
  | 'wearer-message'
  | 'wearer-query'
  | 'ai-reply'
  | 'system-trigger'
  | 'integration-event'
  | 'scheduled-trigger'
  | 'internal-derivation'
  | (string & { readonly _channelOpenVocab?: never })

/**
 * ChannelClaim — incoming channel claim from arrival source.
 * Subject to PA-Cn1..PA-Cn4 validation at intake.
 */
export interface ChannelClaim {
  readonly kind: ChannelKind
  readonly surface: string
}

// ─── Resolution outcome enum (Identity Resolution axis, §3.3 PA-IR2) ────────

/**
 * ResolutionOutcomeKind — outcome enum for surface-form-to-Ref matching at
 * intake per Manual §V.2. Exhaustive: every ResolvedIdentity.outcome takes
 * one of these values.
 */
export type ResolutionOutcomeKind =
  | 'bound-to-existing-Ref'
  | 'new-Ref-created'
  | 'ambiguous-pending-disambiguation'

/**
 * IdentityClaim — surface-form identifier requiring Ref resolution.
 * Carried in BoundaryArrival.identityClaims; resolved at intake to
 * ResolvedIdentity per PA-IR1..PA-IR4.
 */
export interface IdentityClaim {
  readonly surfaceForm: string
  readonly hint: string | null
}

/**
 * ResolvedIdentity — per-claim resolution outcome.
 *
 * Invariants (enforced by G-PS-IR2):
 * - outcome === 'bound-to-existing-Ref' implies ref !== null
 * - outcome === 'new-Ref-created' implies ref !== null
 * - outcome === 'ambiguous-pending-disambiguation' implies ref === null AND
 *   ambiguityDetail !== null AND ambiguityDetail.length >= 1
 *
 * Per PA-IR3 (geometric respect): no clusterRef or clusterMembers field —
 * cluster identity coherence is read-time emergent per Manual §IV.3.
 *
 * Per PA-IR4 (disambiguation deferral): no heuristic Ref assignment — when
 * ambiguous, ref remains null until wearer-side resolution.
 */
export interface ResolvedIdentity {
  readonly surfaceForm: string
  readonly outcome: ResolutionOutcomeKind
  readonly ref: NodeId | null
  readonly ambiguityDetail: string | null
}

// ─── Reversibility enum (Arrival Typing reversibility binding, §3.3 PA-T4) ──

/**
 * ReversibilityFlag — reversibility declaration for act-dispatches per
 * Manual §IV.2 four-cell governance. World-effect dispatches must declare
 * 'reversible' or 'irreversible'; non-act-dispatches use 'n/a'.
 */
export type ReversibilityFlag = 'reversible' | 'irreversible' | 'n/a'

// ─── Cell governance shapes (Arrival Typing axis, §3.3 PA-T2) ────────────────

/**
 * CellKind — Manual §IV.2 four-cell mapping per (direction × disposition).
 * Computed mechanically per PA-T2 from BoundaryCrossingRecord.direction and
 * BoundaryCrossingRecord.resolvedDisposition.
 */
export type CellKind =
  | 'reference-intake'
  | 'act-intake'
  | 'reference-dispatch'
  | 'act-dispatch'

/**
 * GovernanceLevel — Manual §IV.2 four-cell governance level.
 * Determined by CellKind:
 * - 'reference-intake', 'reference-dispatch' → 'lightweight'
 * - 'act-intake' → 'confirmation-audit-reversibility'
 * - 'act-dispatch' → 'world-effect-strongest'
 */
export type GovernanceLevel =
  | 'lightweight'
  | 'confirmation-audit-reversibility'
  | 'world-effect-strongest'

/**
 * ConfirmationStatus — confirmation tracking per cell governance.
 * Reference cells use 'not-required'; act-intake uses 'required-pending' /
 * 'required-confirmed' lifecycle; act-dispatch likewise.
 */
export type ConfirmationStatus =
  | 'not-required'
  | 'required-pending'
  | 'required-confirmed'

/**
 * AuditStatus — audit-trail recording per cell governance.
 * Reference cells use 'not-required'; act cells use 'recorded'.
 */
export type AuditStatus = 'not-required' | 'recorded'

/**
 * CellGovernanceRecord — composite governance record per crossing.
 * Computed at PA-T2 enforcement; carried on BoundaryCrossingRecord per §2.2.
 */
export interface CellGovernanceRecord {
  readonly cell: CellKind
  readonly governanceLevel: GovernanceLevel
  readonly confirmationStatus: ConfirmationStatus
  readonly auditStatus: AuditStatus
  readonly reversibilityStatus: ReversibilityFlag
}

// ─── Emission pair (Authority Enforcement axis, §3.3 PA-A4 orphan rule) ─────

/**
 * EmissionPairRef — paired-write reference per F-009 D6 ruling.
 *
 * PA-A4 orphan rule: every program emission with paired-write contract writes
 * BOTH a substrate state-change AND an artifact-store record. An emission with
 * exactly one side null is an orphan.
 *
 * Invariant (enforced by G-PS-A4):
 * - For dispatches from paired-write programs:
 *   substrateStateChangeId !== null AND artifactStoreRecordId !== null
 *
 * Orphan revocation: per LMA2, wearer-initiated revocation issues a RevokeRef
 * SubstrateWriteInput targeting the present side; the missing side requires no
 * revocation (already absent).
 *
 * v1.0 vacuous-pass: at this delivery the paired-write program registry is
 * empty; G-PS-A4 vacuously satisfied. Sprint 9 wire-in populates the registry.
 */
export interface EmissionPairRef {
  readonly substrateStateChangeId: string | null
  readonly artifactStoreRecordId: string | null
}

// ─── Authority enforcement record (Authority Enforcement axis, §3.3 PA-A1) ──

/**
 * AuthorityClaim — substrate §5 type, consumed by PS via reference per §2.3.
 * Re-declared structurally here for type composition; runtime values come from
 * substrate-tier discipline.
 */
export interface AuthorityClaim {
  readonly level: 'L0' | string
  readonly actor: 'wearer' | 'system' | string
  readonly source: string | null
}

/**
 * ScopeRef — substrate §4 type, consumed via LM LMA6.
 * Carried in arrival.scopeClaim and record.resolvedScope.
 */
export type ScopeRef = string

/**
 * AuthorityEnforcementRecord — per-crossing authority validation outcome.
 * Populated at PA-A1 enforcement; carried on BoundaryCrossingRecord per §2.2.
 */
export interface AuthorityEnforcementRecord {
  readonly authorityClaimed: AuthorityClaim
  readonly authorityValidated: boolean
  readonly authorityScopeMatch: boolean
  readonly validationBasis: string
}

// ─── Positional state enums (per axis, §3.8 universal-variables table) ──────

/**
 * PerimeterDirectionPositional — Direction axis lifecycle position.
 */
export type PerimeterDirectionPositional = 'pending' | 'crossed'

/**
 * PerimeterDispositionPositional — Arrival Typing axis lifecycle position.
 */
export type PerimeterDispositionPositional = 'declared' | 'cell-governed'

/**
 * PerimeterAuthorityPositional — Authority Enforcement axis lifecycle position.
 */
export type PerimeterAuthorityPositional =
  | 'claim-received'
  | 'validated'
  | 'rejected'

/**
 * PerimeterChannelPositional — Channel Classification axis lifecycle position.
 */
export type PerimeterChannelPositional = 'claimed' | 'resolved' | 'rejected'

/**
 * PerimeterIdentityResolutionPositional — Identity Resolution axis lifecycle
 * position. Ambiguous-pending state is the wearer-side disambiguation deferral
 * per PA-IR4.
 */
export type PerimeterIdentityResolutionPositional =
  | 'attempted'
  | 'resolved'
  | 'ambiguous-pending'

/**
 * PerimeterCorrelationPositional — Correlation axis lifecycle position.
 * Self-correlated = correlationRef === own crossingId (un-correlated arrival).
 * Linked = correlationRef references an upstream MI CorrelationRef.
 */
export type PerimeterCorrelationPositional = 'self-correlated' | 'linked'

// ─── Boundary arrival shape (intake-direction input, §2.1) ───────────────────

/**
 * BoundaryArrival — intake-direction input to PS.
 * Constructed by F-identity middleware from raw network/route surface.
 * Fields are claims; PS validates them per PA1..PA-IR4 + PA-Co1..PA-Co3 + PA-I.
 */
export interface BoundaryArrival {
  readonly arrivalId: ArrivalId
  readonly surfaceForm: unknown
  readonly channelClaim: ChannelClaim
  readonly authorityClaim: AuthorityClaim
  readonly scopeClaim: ScopeRef
  readonly dispositionClaim: DispositionKind
  readonly correlationClaim: CorrelationRefBrand | null
  readonly identityClaims: ReadonlyArray<IdentityClaim>
  readonly receivedAt: EpochMs
}

// ─── Boundary dispatch request shape (dispatch-direction input, §2.1) ───────

/**
 * BoundaryDispatchRequest — dispatch-direction input to PS.
 * Submitted by program L4 emitters; PS validates per PA1, PA2, PA-T1..PA-T4,
 * PA-A1, PA-A4, PA-A5, PA-A6, PA-Cn1..PA-Cn4, PA-Co1, PA-Co3, PA-I.
 */
export interface BoundaryDispatchRequest {
  readonly dispatchId: DispatchId
  readonly source: {
    readonly programId: string
    readonly programVersion: Semver
  }
  readonly payload: unknown
  readonly channelTarget: ChannelKind
  readonly dispositionClaim: DispositionKind
  readonly scopeContext: ScopeRef
  readonly authorityContext: AuthorityClaim
  readonly correlationRef: CorrelationRefBrand | null
  readonly reversibility: ReversibilityFlag
  readonly requestedAt: EpochMs
}

// ─── Boundary crossing record (output, §2.2) ─────────────────────────────────

/**
 * BoundaryCrossingRecord — typed output per crossing.
 *
 * Per spec §2.2: every field traces to exactly one PS axis or to the
 * Identity-tier Unitarity assertion (unitarySiteRef → PA-I).
 *
 * Carrier: `named` → `living-memory` v3.1. Intake-direction records translate
 * to LM SubstrateWriteInput via HR-PS-LM1; full record persists at
 * audit-trail per HR-PS3 captureShape.
 */
export interface BoundaryCrossingRecord {
  readonly crossingId: CrossingId

  // Direction axis (PA1, PA2)
  readonly direction: DirectionKind
  readonly arrivalRef: ArrivalId | null
  readonly dispatchRef: DispatchId | null

  // Arrival Typing axis (PA-T1, PA-T2, PA-T3, PA-T4)
  readonly resolvedDisposition: DispositionKind
  readonly cellGovernance: CellGovernanceRecord

  // Channel Classification axis (PA-Cn1, PA-Cn2, PA-Cn3, PA-Cn4)
  readonly resolvedChannel: ChannelKind

  // Authority Enforcement axis (PA-A1, PA-A2, PA-A3, PA-A4, PA-A5, PA-A6)
  readonly resolvedAuthority: AuthorityClaim
  readonly resolvedScope: ScopeRef
  readonly authorityEnforced: AuthorityEnforcementRecord
  readonly emissionPair: EmissionPairRef | null

  // Identity Resolution axis (PA-IR1, PA-IR2, PA-IR3, PA-IR4) — intake-only
  readonly resolvedIdentities: ReadonlyArray<ResolvedIdentity>

  // Correlation axis (PA-Co1, PA-Co2, PA-Co3)
  readonly correlationRef: CorrelationRefBrand

  // Direction symmetry pairing (PA2)
  readonly symmetryRef: CrossingId | null

  // Identity-tier Unitarity (PA-I, PA-A6)
  readonly unitarySiteRef: string

  // Provenance
  readonly perimeterFrameworkVersion: Semver
  readonly crossedAt: EpochMs
}

// ─── Permitted-authority set (Channel × Authority cross-axis, PA-Cn3) ───────

/**
 * PermittedAuthoritySet — per-channel authority admissibility set declared at
 * PerimeterBinding instance. PA-Cn3 verifies authorityClaimed ∈ this set.
 */
export type PermittedAuthoritySet = ReadonlyArray<AuthorityClaim>

// ─── PerimeterBinding (deployment configuration, §6.2) ──────────────────────

/**
 * PerimeterBinding — deployment-time configuration consumed by F-identity
 * middleware. Declares per-channel permitted authorities, dispatch-target
 * channel set, identity-resolution registry, and correlation-index policy.
 *
 * Captured verbatim in BoundaryCrossingRecord.perimeterFrameworkVersion at
 * audit-time per spec §6.7.
 *
 * v1.0 vacuous-pass: pre-Sprint-6-Shot-3 deploy uses default binding;
 * G-PS-Cn3 vacuously satisfied per spec §4.8.
 */
export interface PerimeterBinding {
  readonly bindingId: string
  readonly bindingVersion: Semver
  readonly permittedAuthorityByChannel: Readonly<{
    readonly [K in ChannelKind & string]?: PermittedAuthoritySet
  }>
  readonly dispatchTargetChannels: ReadonlyArray<ChannelKind>
  readonly correlationIndexPolicy: {
    readonly expirySeconds: number | null
    readonly maxIndexSize: number | null
  }
  readonly unitarySiteRef: string
}

// ─── Error and result types ──────────────────────────────────────────────────

/**
 * PerimeterValidityError — thrown / returned when crossing fails any G-PS gate.
 * Extends AppError shape per primitives.ts AppError contract.
 */
export interface PerimeterValidityError extends AppError {
  readonly errorKind: 'perimeter-validity-error'
  readonly failedGateId: string
  readonly failedAxiomId: string
  readonly crossingIdAtFailure: CrossingId | null
  readonly mechanicalReason: string
}

/**
 * PerimeterCrossingResult — Result-wrapped output of one crossing evaluation.
 * Success returns BoundaryCrossingRecord; failure returns PerimeterValidityError.
 */
export type PerimeterCrossingResult = Result<
  BoundaryCrossingRecord,
  PerimeterValidityError
>

// ─── Re-exports for convenience (slice import surface) ──────────────────────

export type {
  NodeId,
  UserId,
  Semver,
  Result,
  AppError,
}
