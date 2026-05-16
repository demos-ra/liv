# perimeter-standard-v1-2-1

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Version:** v1.2.1
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1
**Authority:** L0 confirmed (Sprint B2 Shot 2 — access-scoping axiom extraction + paired-write dissolution apparatus applied)
**Cross-framework input:** Living Memory v3.3 (carrier; perimeter writes typed signal as `SubstrateWriteInput` consumed at HR-LM1 receive-side), Multi-Instance Standard v2.3 (correlation reference upstream), Artifact Standard v2.3 (downstream — program emissions cross perimeter as dispatches; v2.3 reflects G-Ar8 dissolution at Sprint B2 Shot 2c), Permissions Standard v1.0 (downstream — access-scoping concerns relocated here at this amendment per Sprint B2 Shot 2a)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Perimeter Standard is the L3 structural-mode framework owning runtime boundary typing — the rules under which the perimeter performs typed-signal transformation at the LIV boundary. Perimeter structures `known → structured` work into typed arrival and dispatch records: untyped surface signal is structured into typed jurisdiction (intake), typed dispatch requests are structured into governed dispatches (outward). Where Plan structures `known → structured` work into `PlanArtifactContent` and VS verifies `produced → verified` work into `VerificationArtifactContent`, Perimeter structures `known → structured` work into the typed signal itself — the first typed manifestation any signal acquires upon entering LIV.

Perimeter Standard is **distinct from F-identity slice**: F-identity is L4 (program-tier) infrastructure that hosts the unitary perimeter site (`src/middleware.ts`). Perimeter Standard (L3 framework) declares the rules every perimeter operation must honor; F-identity executes those rules at runtime. Different tier, different concern (see §1 scopeOut).

Perimeter Standard fills the **perimeter governing-framework slot** declared at LIV Manual SPEC-v11.0 §III.8. Slot was vacated when Cognitive Standard dissolved Sprint 8; Perimeter Standard ratification at this delivery transitions the slot from "Currently open" to "Currently filled" per Manual III.8 patch (§5.9 below + spec-shot-2 manifest D-record D9).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Perimeter Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.2.1` (per substrate §7 Semver; v1.2 → v1.2.1 per MA-L1 patch at Sprint B2 Shot 2 cascade — AuthorityClaim → AuthorityAssertion rewire at all runtime crossing sites; no axiom/gate/schema change) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first emission via §5.3 post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `living-memory` v3.3 (per substrate §9 Carrier enum; applied §6.1; perimeter writes typed signal via `SubstrateWriteInput` consumed at LM HR-LM1 receive-side; structurally distinct from VS/RS/Plan AS-carriered pattern because perimeter does not emit artifacts about its work — it emits the typed signal itself) |
| `primitive` | `boundary-crossing` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | untyped arrival surface (boundary inbound), typed dispatch request (program-emitted boundary outbound), `PerimeterBinding` instance, channel registry, identity resolution registry |
| `produces` | typed `BoundaryCrossingRecord` (intake direction → ready for LM `SubstrateWriteInput`; dispatch direction → governed dispatch with audit trail) |
| `consumedBy` | Living Memory v3.3 (intake-direction state-changes via HR-PS-LM1), program-direction consumers (programs receiving typed arrivals), audit consumers, observability replay |
| `scopeOut` | `['substrate atom shape (owned by Living Memory v3.3; PS does not declare what state-changes look like once they land — only what conditions must be met before submission)', 'cross-cutting redeclaration (owned by Manual v13.1 — PS declares boundary-side enforcement rules; does not redeclare source-authority or act-vs-reference as cross-cutting concerns)', 'program-domain rules (owned by each program L3 framework — PS declares the boundary contract programs must honor at their dispatch, not the program internals)', 'authority semantics (owned by Manual Part I Wearer-L0 + System-L0 — PS declares enforcement rules at the boundary; does not redeclare what authority means)', 'access-scoping (owned by Permissions Standard v1.0 per Sprint B2 Shot 2 extraction — per-user vs global scope, role × action matrix, decision shape; PS declares crossing-time authority claim shape, Permissions Standard declares decision-time access scoping)', 'F-chat governing framework (separate domain — F-chat operates at perimeter-baseline + perimeter framework; F-chat may surface its own governing framework in a later sprint)', 'aggregate-signal-read mechanics (owned by LM v3.3 / post-beta — PS consumes signals as they arrive, does not declare aggregation primitives)', 'runtime execution of boundary typing (owned by L4 program — F-identity slice middleware; PS declares the rule set, F-identity executes)', 'paired-write contract (dissolved at Sprint B2 Shot 2b — art_* tables dropped at Sprint B1 final shot 3 means the paired-write contract is vacuously satisfied because one side of the pair no longer exists; PA-A4 + leaf-PA-A4 + G-PS-A4 + EmissionPairRef removed entirely; no replacement axiom — substrate is the single store post-Sprint-B1)', 'graph physics (owned by Living Memory)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |
| `governsRuntimeCode` | `true` (per MA-I8, added Sprint B1 Shot 2 v3.3.0). Basis: PS governs F-identity slice runtime code at the unitary perimeter site (`src/proxy.ts` per current source — PS v1.0.1 prose referenced `src/middleware.ts`; the actual unitary site is `src/proxy.ts` and slice resources under `src/features/F-identity/**` host the supporting wires per R0..R4 layering). The axiom set (PA1, PA2, PA-T1..PA-T4, PA-A1, PA-A5, PA-A6, PA-Cn1, PA-Cn2, PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA-I — 19 axis-bound + 1 identity-tier = 20 axioms at v1.2 post-extraction + dissolution; reconciled with `PERIMETER_AXIOM_IDS` const at Sprint B2 Shot 2 re-roll), gate set (G-PS1..G-PS-I matching), and four-cell governance map govern source paths under the unitary site + slice. Per Sprint B2 Shot 2 amendment: access-scoping axioms (former PA-A2 wearer-scope, PA-A3 system-scope, PA-Cn3 channel-authority-binding) relocated to Permissions Standard v1.0; paired-write rule (former PA-A4 orphan rule) dissolved as vacuously satisfied per art_* table drop at Sprint B1 final shot 3. Declaration of source-governing intent is mechanical per MA-I8; jurisdictionClaim per axis declared at §3.13 below. |
| `referentCitations` | `[]` (zero citations at v1.1 — partial-drift carried forward from v1.0.1 with explicit declaration per MA-V11 vacuous-pass. Basis prose: `"Sprint B2 source-cleanup will author ReferentCitations covering jurisdictionClaim per MA-V10 part B amendment trigger. At v1.1 the standards-tier declarations are tightened (MA-I8 governsRuntimeCode true, MA-St17 basis declarations populated at §3.13, jurisdictionClaim declared per source-governing axis at §3.13); the runtime-side citation set materializes in Sprint B2 alongside LM cascade. Vacuous-pass at this version is honest declared drift, not silent gap. G-V10/G-S8/G-L11 vacuous-pass at part A; G-V10 part B applicability='n/a' with declared basis per §3.13.11."`) |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-6-structure-tightening-PS-v1-0-genesis',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: '1.0'
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (PS v1.0 was a fresh L3 framework, not a v0 lift; no predecessor — Cognitive Standard occupied an adjacent slot but is not PS's predecessor: Cognitive Standard was the cognitive-primitive framework dissolved Sprint 8; PS is the perimeter governing framework derived independently from Manual SPEC-v11.0 §I.4 + §IV.2 + §V.2 commitments. v1.0.1 is the prose-realignment amendment per audit-cycle-A close — additive per AxR3 + MA-L1, no invariant condition changes; full delta documented at §9 Change log).

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I7:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: structural-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry; precedent: Plan Standard v2.2 declares same triple). |
| MA-I8 | `governsRuntimeCode = true` declared §1 with basis prose per Sprint B1 Shot 2 v3.3.0 amendment (boolean type-check class per substrate §6.3). |

### §1.3 MA-G13 four-property test (framework classification)

| Property | Satisfied by |
|---|---|
| Own state | lifecycle state (declared → applied on first emission); per-axis positional state per §3.8 universal-variables table |
| Own I/O | Input atoms: `BoundaryArrival` (intake), `BoundaryDispatchRequest` (dispatch). Output atoms: `BoundaryCrossingRecord` (typed crossing), `SubstrateWriteInput` (intake → LM via HR-PS-LM1) |
| Own invariants | PA1..PA21 axioms (§3.6) governing direction, arrival typing, authority enforcement, channel classification, identity resolution, correlation, plus PA-I unitarity invariant |
| Own discipline | structural-mode framework: typed-shape-conformance discipline at every crossing; gate-set G-PS1..G-PS21 invocable on each `BoundaryCrossingRecord`; F-identity slice runtime enforcement at unitary site |

All four properties declared. MA-G13 passes. Perimeter Standard is classified as framework (not state store, not protocol, not substrate).

### §1.4 Unitarity assertion (Identity-table distinguishing property per Manual §I.4)

Per Manual SPEC-v11.0 §I.4 ("One operation site. There is one perimeter per LIV instance. The boundary is unitary; it is not distributed across multiple sites"):

**There is exactly one perimeter site per LIV instance.** All boundary crossings (intake + dispatch) pass through this one site. Distributed perimeter is a structural defect; one-site enforcement is the only valid pattern.

This is a distinguishing-property assertion at the Identity tier (per Manual §I.4 + §1.4 Unitarity assertion). It is enforced mechanically by axiom **PA-I** declared at §3.6 with paired gate **G-PS-I**. Implementation of unitary site is owned by F-identity slice (`src/middleware.ts`); PS declares the structural rule and the test that verifies it.

---

## §2 Schema

### §2.1 Input — `BoundaryArrival` and `BoundaryDispatchRequest`

Per MA-S1 (input is W-ATOM). PS has two input shapes (intake direction + dispatch direction), reflecting Manual §IV.4 directional-symmetry principle.

**`BoundaryArrival` (intake direction):**

```
BoundaryArrival = {
  arrivalId:           ArrivalId,                                  // unique per arrival
  surfaceForm:         unknown,                                    // raw untyped surface (route payload, network frame, etc.)
  channelClaim:        ChannelClaim,                               // origin channel as claimed by source (subject to PA-Cn validation)
  authorityClaim:      AuthorityAssertion,                          // substrate §5.6 A-23 — runtime claim at Boundary crossing
  scopeClaim:          ScopeRef,                                   // substrate-scope target for this arrival's effect
  dispositionClaim:    DispositionKind,                            // 'act' | 'reference' (§2.7 enum)
  correlationClaim:    CorrelationRef | null,                      // CorrelationRef of originating interaction; null = un-correlated
  identityClaims:      IdentityClaim[],                            // surface-form identifiers requiring Ref resolution
  receivedAt:          EpochMs                                     // perimeter-stamped receipt time
}
```

**`BoundaryDispatchRequest` (dispatch direction):**

```
BoundaryDispatchRequest = {
  dispatchId:          DispatchId,                                 // unique per dispatch request
  source:              { programId: string, programVersion: Semver }, // emitting program
  payload:             unknown,                                    // typed payload (from program); validated against AS v2.2 if artifact-shaped
  channelTarget:       ChannelKind,                                // dispatch channel (§2.7 enum)
  dispositionClaim:    DispositionKind,                            // 'act' | 'reference' (§2.7 enum)
  scopeContext:        ScopeRef,                                   // scope under which this dispatch operates
  authorityContext:    AuthorityAssertion,                          // runtime claim for act-direction dispatches — substrate §5.6 A-23
  correlationRef:      CorrelationRef | null,                      // links to originating interaction
  reversibility:       ReversibilityFlag,                          // 'reversible' | 'irreversible' | 'n/a' (§2.7 enum; bound to dispositionClaim per PA-T4)
  requestedAt:         EpochMs                                     // dispatch request time
}
```

### §2.2 Output — `BoundaryCrossingRecord`

Per MA-S2 (output is W-ATOM). PS carrier = `named` → `living-memory` v3.3: PS's `BoundaryCrossingRecord` rides as `SubstrateWriteInput` consumed at LM HR-LM1 (receive-side declared at LM §6.2; PS send-side declared at §6.2 below).

```
BoundaryCrossingRecord = {
  crossingId:          CrossingId,                                 // unique per crossing
  direction:           DirectionKind,                              // 'intake' | 'dispatch' (§2.7 enum; PA1)
  arrivalRef:          ArrivalId | null,                           // populated if direction='intake'
  dispatchRef:         DispatchId | null,                          // populated if direction='dispatch'
  resolvedDisposition: DispositionKind,                            // 'act' | 'reference' (PA-T1; verified at PA-T2 cell-governance)
  resolvedChannel:     ChannelKind,                                // resolved channel post PA-Cn validation (PA-Cn1)
  resolvedAuthority:   AuthorityAssertion,                          // runtime authority claim validated per PA-A1 — substrate §5.6 A-23 (PA-Cn3 extracted to Permissions Standard PMA-Av2 at Sprint B2 Shot 2)
  resolvedScope:       ScopeRef,                                   // scope post-validation
  resolvedIdentities:  ResolvedIdentity[],                         // per-identity resolution outcome (PA-IR2)
  correlationRef:      CorrelationRef,                             // populated; equals crossingId for un-correlated arrivals (PA-Co1)
  cellGovernance:      CellGovernanceRecord,                       // four-cell IV.2 mapping result (PA-T2)
  authorityEnforced:   AuthorityEnforcementRecord,                 // record of authority check (PA-A1; PA-A2/A3 extracted to Permissions Standard at Sprint B2 Shot 2; PA-A4 dissolved)
  symmetryRef:         CrossingId | null,                          // dispatch-direction crossing pairs to its intake-direction predecessor where applicable (PA2)
  unitarySiteRef:      string,                                     // the one perimeter site identifier (PA-I)
  perimeterFrameworkVersion: Semver,                               // 1.0 at this delivery
  crossedAt:           EpochMs                                     // perimeter-stamped crossing time
}
```

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityAssertion` | substrate §5.6 A-23 |
| `Stage` | substrate §8.3 |
| `FrameworkRef` | substrate §4 |
| `WAtom` | substrate §4 |
| `AxiomRef` | substrate §4 |
| `Judgment` | substrate §6 |
| `JudgmentId` | substrate §6 |
| `Semver` | substrate §7 |
| `ScopeRef` | substrate §4 (LM consumes via LMA6) |
| `EmptyPrimitiveDeclaration` | substrate §4 A-17 |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home |
|---|---|
| `NodeId` | primitives.ts |
| `UserId` | primitives.ts |
| `Result<T, E>` | primitives.ts |
| `AppError` | primitives.ts |

### §2.5 Consumed types (from living-memory v3.3, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `SubstrateWriteInput` | living-memory §2.1 | §2.2 BoundaryCrossingRecord intake direction → SubstrateWriteInput at HR-PS-LM1 |
| `SourceRef` | living-memory §2.2 (StateChangeRecord.metadata.source) | §2.2 channel + scope carriers; cross-framework reference per A-08 |
| `IdentityRef` | living-memory §3.5 | §2.7 IdentityClaim resolution target |

### §2.6 Consumed types (from multi-instance-standard v2.3, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `CorrelationRef` | multi-instance-standard | §2.1 + §2.2 correlationRef field; correlation upstream from MI |

### §2.7 PS-local atoms (declared at point of use in §3)

```
ArrivalId = string                                                 // unique per arrival; brand-typed
DispatchId = string                                                // unique per dispatch request; brand-typed
CrossingId = string                                                // unique per crossing; brand-typed
EpochMs = number                                                   // milliseconds since Unix epoch (PS-local declaration paralleling VS+Plan+RS precedent)

DirectionKind = 'intake' | 'dispatch'                              // §3.3 Direction axis enum

DispositionKind = 'act' | 'reference'                              // §3.3 Arrival Typing axis enum (per Manual §IV.2)

ChannelKind =                                                      // §3.3 Channel axis enum (open-vocabulary per Manual §I.6)
  | 'wearer-message'
  | 'wearer-query'
  | 'ai-reply'
  | 'system-trigger'
  | 'integration-event'
  | 'scheduled-trigger'
  | 'internal-derivation'
  | string                                                         // extensible per S3; new channel kinds are new enum values

ChannelClaim = {
  kind:     ChannelKind,
  surface:  string                                                 // surface identifier (route, hook name, etc.)
}

ReversibilityFlag = 'reversible' | 'irreversible' | 'n/a'          // §3.3 Arrival Typing reversibility binding

ResolutionOutcomeKind =                                            // §3.3 Identity Resolution axis enum
  | 'bound-to-existing-Ref'
  | 'new-Ref-created'
  | 'ambiguous-pending-disambiguation'

IdentityClaim = {
  surfaceForm: string,
  hint:        string | null                                       // optional hint for resolution
}

ResolvedIdentity = {
  surfaceForm:     string,
  outcome:         ResolutionOutcomeKind,
  ref:             IdentityRef | null,                             // populated when outcome ∈ {'bound-to-existing-Ref', 'new-Ref-created'}
  ambiguityDetail: string | null                                   // populated when outcome === 'ambiguous-pending-disambiguation'
}

CellGovernanceRecord = {
  cell:                'reference-intake' | 'act-intake' | 'reference-dispatch' | 'act-dispatch',
  governanceLevel:     'lightweight' | 'confirmation-audit-reversibility' | 'world-effect-strongest',
  confirmationStatus:  'not-required' | 'required-pending' | 'required-confirmed',
  auditStatus:         'not-required' | 'recorded',
  reversibilityStatus: ReversibilityFlag
}

AuthorityEnforcementRecord = {
  authorityClaimed:    AuthorityAssertion,
  authorityValidated:  boolean,
  authorityScopeMatch: boolean,                                    // claimed scope ∈ allowed-scopes-for-channel
  validationBasis:     string                                      // mechanical predicate trace per substrate §6.3
}

CorrelationRef = string                                            // §3.3 Correlation axis carrier; from multi-instance-standard
```

### §2.8 Schema rules (ScR-series)

Per metaframework-v3-1 §2.5 (by reference to v3-1-spec §3.3). No PS-local ScR additions.

### §2.9 Custody pointer

Full custody table in §6 Coupling. Summary pointer only here per R-phase-1-1-resolution-08 single-source-via-reference.

---

## §3 Structure

### §3.1 Axes (inherited)

PS inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. PS does not redeclare.

PS's own structural content is the **six P1 Axis instances** declared at §3.3 below, derived from Manual SPEC-v11.0 §I.4 + §I.6 + §IV.2 + §IV.4 + §V.2 commitments per D1 ratification.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 6 | Direction, Arrival Typing, Authority Enforcement, Channel Classification, Identity Resolution, Correlation — declared §3.3 per D1 ratification (six axes preserved post-Sprint-B2-Shot-2 extraction: Authority Enforcement axis stays but loses three axioms; Channel Classification axis stays but loses one axiom; axis structure unchanged by axiom extraction) |
| P2 Sub-axis | 20 | declared §3.4 (Authority Enforcement loses `wearer-scope`, `system-scope`, `orphan-rule`; Channel Classification loses `authority-binding`; pre-extraction §3.4 enumeration was 24 (3 + 4 + 6 + 4 + 4 + 3) at PS v1.1; post-Sprint-B2-Shot-2 §3.4 enumeration is 20 (3 + 4 + 3 + 3 + 4 + 3) with the four removed sub-axes leaving in lockstep with their parent axiom extraction/dissolution. **Sprint B2 Shot 2 re-roll:** P2 count reconciled with actual §3.4 enumeration — pre-roll text said 13 (carrying forward a PS v1.0.1 baseline §3.2-vs-§3.4 mis-count that incorrectly inferred 17 → 13 instead of recognizing the v1.1 enumeration was already 24 → 20 post-Shot-2). §3.13.2 sub-axes basis intro count breakdown reconciled in lockstep.) |
| P3 Leaf | 20 | declared §3.5 (1:1 with 19 axis-bound axioms + PA-I identity-tier axiom = 20 leaves; v1.1's 24 → 20 at v1.2 post-extraction/dissolution). Sprint B2 Shot 2 re-roll: S1 count-reconciliation patch — pre-roll text said 18 but actual enumeration (PA1, PA2, PA-T1..T4, PA-A1, PA-A5, PA-A6, PA-Cn1, PA-Cn2, PA-Cn4, PA-IR1..IR4, PA-Co1..Co3 = 19 axis-bound) + PA-I = 20. |
| P4 Axiom | 20 | PA1, PA2, PA-T1..PA-T4, PA-A1, PA-A5, PA-A6, PA-Cn1, PA-Cn2, PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3 (19 axis-bound) + PA-I (identity-tier unitarity assertion) = 20 total; declared §3.6. v1.1's 24 → 20 at v1.2 post-extraction (PA-A2 → Permissions Standard PMA-Sb2; PA-A3 → subsumed under Permissions Standard PMA-D2 + PMA-Sb3; PA-Cn3 → Permissions Standard PMA-Av2) + post-dissolution (PA-A4 paired-write vacuously satisfied per Sprint B1 final shot 3 art_* table drop). Sprint B2 Shot 2 re-roll: count reconciled with `PERIMETER_AXIOM_IDS` const array (also 20 entries). |
| P5 Gate | 20 | G-PS1, G-PS2, G-PS-T1..G-PS-T4, G-PS-A1, G-PS-A5, G-PS-A6, G-PS-Cn1, G-PS-Cn2, G-PS-Cn4, G-PS-IR1..G-PS-IR4, G-PS-Co1..G-PS-Co3 + G-PS-I = 20 total; 1:1 with axioms per G-M1; declared §4.2. v1.1's 24 → 20 at v1.2 (G-PS-A2, G-PS-A3, G-PS-A4, G-PS-Cn3 removed in lockstep with their axioms). Sprint B2 Shot 2 re-roll: count reconciled with `PERIMETER_AXIOM_GATE_IDS` const array (also 20 entries). |
| P6 Handoff rule | 4 | HR-PS1..HR-PS4 declared §6.2 |
| P7 Judgment input | 1 | J-perimeter-observation declared §7.1 |
| P8 Procedure step | 0 | `{primitiveKind: P8, instanceCount: 0, basis: "PS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). PS therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. PS's gate-procedure semantics — what the perimeter does at each crossing — are captured declaratively as the PA1..PA-I axiom set and G-PS1..G-PS-I gate set; runtime invocation of gates at every crossing is owned by F-identity slice (L4 program), outside PS's P8 scope. Precedent: Plan Standard v2.2 §3.7 + Research Standard v1.0 §3.7 declare the same empty-P8 pattern under structural and epistemic mode respectively."}` |

### §3.3 P1 Axis instances (PS-local)

Six domain axes. MECE over PS's concern space per §C.6 derivation. Axis count preserved across Sprint B2 Shot 2 extraction (axioms relocate; axis structure is the structural decomposition site, owned by PS).

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Direction` | Direction | Inward vs outward boundary crossing | Is this crossing intake (inward) or dispatch (outward)? |
| `Arrival Typing` | Arrival Typing | Act-vs-reference disposition + IV.2 four-cell governance binding | Does this crossing produce world or substrate effect, or is it a read/render with no effect? |
| `Authority Enforcement` | Authority Enforcement | Crossing-time authority claim shape (validation + dispatch validation + unitary site enforcement). **Post-Sprint-B2-Shot-2 scope:** validates the AuthorityAssertion shape at the crossing moment — does the crossing carry a well-formed authority claim and is it validated against substrate §6.3 mechanical-criterion ground class? Access scoping (per-user/global decision-time rules) relocated to Permissions Standard v1.0 (former PA-A2 / PA-A3 dissolved here, see §3.6 amendment notes). Paired-write dissolved (former PA-A4 vacuously satisfied per art_* table drop). | Does the crossing carry a well-formed AuthorityAssertion that mechanically validates? |
| `Channel Classification` | Channel Classification | `SourceRef.channel` assignment + channel preservation across substrate succession. **Post-Sprint-B2-Shot-2 scope:** channel-authority binding (per-channel permitted-authority set) relocated to Permissions Standard v1.0 PMA-Av2 (former PA-Cn3 dissolved here, see §3.6 amendment notes). | What channel did this crossing originate on, and does the channel value survive substrate succession? |
| `Identity Resolution` | Identity Resolution | Surface-form-to-Ref matching at intake | What substrate identity does each surface-form identifier in this arrival resolve to? |
| `Correlation` | Correlation | Linking crossings from one originating interaction | Which originating interaction does this crossing belong to? |

**MECE verification (post-Sprint-B2-Shot-2):**
- Orthogonality: Direction governs inward vs outward (one binary property per crossing); Arrival Typing governs act-vs-reference disposition + cell-governance binding (independent of direction); Authority Enforcement governs crossing-time authority claim shape (independent of direction, channel, disposition — applies as shape check across all combinations; **decision-time access scoping relocated to Permissions Standard**); Channel governs origin classification + preservation (independent of authority shape — channel is a separate W-ATOM from AuthorityAssertion per Manual §IV.2); Identity Resolution governs surface-to-Ref matching (independent of channel); Correlation governs cross-crossing relations (independent of single-crossing properties). No pair-overlap.
- Exhaustiveness: every `BoundaryCrossingRecord` field at v1.2 traces to exactly one PS-local axis (verified §3.8 universal-variables table). Identity-tier `unitarySiteRef` traces to PA-I unitarity assertion (§1.4 + §3.6). Removed fields: `record.emissionPair` (PA-A4 dissolution per Sprint B2 Shot 2b).
- No axis exceeds boundary: each axis's content strictly within its declared concern. Access-scoping concerns no longer in scope; relocated to Permissions Standard.

**Derivation note:** seven candidate axes from spec §Shot 1 reduced via Layer 1 axis discipline to six axes + one Identity-tier assertion (Unitarity). Sprint B2 Shot 2 amendment preserves the six-axis structure; only axiom-level relocation + dissolution. Substrate Write Authorization was originally subsumed under Authority Enforcement; the substrate-write-authorization sub-concern (per-user vs global scoping) now traces to Permissions Standard v1.0 Scope axis per Sprint B2 Shot 2 extraction.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Direction sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Direction/inward` | Intake direction declaration | `leaf-PA1-direction-declaration` |
| `Direction/outward` | Dispatch direction declaration | `leaf-PA1-direction-declaration` (covered by PA1) |
| `Direction/symmetry` | IV.4 directional-symmetry binding (every concern governed for intake has correspondent for dispatch or scope-out justification) | `leaf-PA2-directional-symmetry` |

**Arrival Typing sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Arrival Typing/disposition` | Per-crossing 'act' or 'reference' classification | `leaf-PA-T1-disposition-declaration` |
| `Arrival Typing/cell-governance` | Manual §IV.2 four-cell mapping to governance level | `leaf-PA-T2-cell-governance` |
| `Arrival Typing/mutation-gate` | Reference dispositions cannot mutate substrate (substrate mutated by acts only, per Manual §IV.2) | `leaf-PA-T3-mutation-gate` |
| `Arrival Typing/reversibility` | Act-direction dispatches with world-effect carry reversibility flag | `leaf-PA-T4-reversibility` |

**Authority Enforcement sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Authority Enforcement/intake-validation` | Every intake AuthorityAssertion validated against channel-appropriate authority | `leaf-PA-A1-authority-validation` |
| `Authority Enforcement/dispatch-validation` | Dispatch with world-effect carries confirming AuthorityAssertion into dispatch record | `leaf-PA-A5-dispatch-validation` |
| `Authority Enforcement/unitary-site` | Authority enforcement happens at the one perimeter site (cross-axis to Identity-tier PA-I) | `leaf-PA-A6-unitary-enforcement` |

*Sprint B2 Shot 2 amendment: sub-axes `wearer-scope`, `system-scope`, `orphan-rule` removed in lockstep with PA-A2 / PA-A3 / PA-A4 extraction + dissolution per §3.6 amendment notes.*

**Channel Classification sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Channel Classification/declaration` | Every arrival assigned non-empty ChannelKind at intake | `leaf-PA-Cn1-channel-declaration` |
| `Channel Classification/enumeration` | Channel value resolves to declared ChannelKind enum (open-vocabulary per Manual §I.6) | `leaf-PA-Cn2-channel-enumeration` |
| `Channel Classification/preservation` | Channel value survives substrate succession per Manual §IV.2 | `leaf-PA-Cn4-channel-preservation` |

*Sprint B2 Shot 2 amendment: sub-axis `authority-binding` removed in lockstep with PA-Cn3 extraction per §3.6 amendment notes.*

**Identity Resolution sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Identity Resolution/attempt` | Every arrival with surface-form identifiers triggers resolution attempt | `leaf-PA-IR1-resolution-attempt` |
| `Identity Resolution/outcome-enum` | Each attempt resolves to {bound-to-existing-Ref, new-Ref-created, ambiguous-pending-disambiguation} | `leaf-PA-IR2-resolution-outcome` |
| `Identity Resolution/geometric-respect` | Resolution does not pre-resolve cluster identity coherence (read-time emergent per Manual §IV.3) | `leaf-PA-IR3-geometric-respect` |
| `Identity Resolution/disambiguation-deferral` | Ambiguous resolutions surface as wearer-side disambiguation prompts; no perimeter-side guesses | `leaf-PA-IR4-disambiguation-deferral` |

**Correlation sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Correlation/declaration` | Every crossing carries CorrelationRef (equals own crossingId for un-correlated crossings) | `leaf-PA-Co1-correlation-declaration` |
| `Correlation/membership` | Crossings from one wearer-interaction or one tool-conversation share CorrelationRef | `leaf-PA-Co2-correlation-membership` |
| `Correlation/perimeter-only` | Correlation is perimeter-only, not cross-cutting (per Manual §IV.2); programs requiring correlation consult perimeter index | `leaf-PA-Co3-perimeter-only` |

**Sub-axis attachment note:** several sub-axes share a leaf because the axiom's mechanical condition is unitary at sub-axis cluster level (e.g., PA1 covers Direction/inward + Direction/outward jointly via direction enum membership). This is the same pattern RS §3.4 establishes (RA1 covers Input/authoringProgram + Input/binding + Input/priorKnowledge jointly). MA-St2 leaf-atomicity satisfied: one leaf per axiom condition; sub-axes provide the structural decomposition for §3.8 universal-variables purposes; axiom binding is at the axiom-condition level per G-M1.

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-PA1-direction-declaration` | `axiom` | `record.direction ∈ {'intake', 'dispatch'} (DirectionKind enum membership; non-null; cardinality = 1) — per PA1 structural property` |
| `leaf-PA2-directional-symmetry` | `axiom` | `For every typed concern C declared as governed for direction='intake', either (a) C is governed for direction='dispatch' by some axiom in PS, or (b) PS §1 scopeOut declares C scoped-out for dispatch with explicit basis. Iterated over PS-declared concerns: Direction (covered both directions trivially), Arrival Typing (both per PA-T1 + PA-T4), Authority (both per PA-A1 + PA-A5), Channel (both per PA-Cn1 + PA-Cn4 preservation across crossings), Identity Resolution (intake-only per PA-IR1; dispatch direction scope-out: dispatches carry payload with already-resolved Refs, no surface-form-to-Ref work needed at dispatch — declared §1 scopeOut), Correlation (both directions per PA-Co1) — per PA2 structural property + §1 scopeOut consultation` |
| `leaf-PA-T1-disposition-declaration` | `axiom` | `record.resolvedDisposition ∈ {'act', 'reference'} (DispositionKind enum; non-null; cardinality = 1) AND record.resolvedDisposition matches arrival.dispositionClaim OR dispatch.dispositionClaim (depending on direction) — per PA-T1 structural property` |
| `leaf-PA-T2-cell-governance` | `axiom` | `record.cellGovernance.cell ∈ {'reference-intake', 'act-intake', 'reference-dispatch', 'act-dispatch'} (computed from direction × disposition; mechanical) AND record.cellGovernance.governanceLevel matches IV.2 four-cell mapping: 'reference-intake' → 'lightweight'; 'act-intake' → 'confirmation-audit-reversibility'; 'reference-dispatch' → 'lightweight'; 'act-dispatch' → 'world-effect-strongest' — per PA-T2 structural property + reference resolution to Manual §IV.2 cell table` |
| `leaf-PA-T3-mutation-gate` | `axiom` | `(record.resolvedDisposition === 'reference') implies (record.direction === 'intake' implies no SubstrateWriteInput emission via HR-PS-LM1 for this crossing) AND (record.direction === 'dispatch' implies no substrate state-change recorded for this crossing). Reference dispositions do not produce substrate mutations — substrate is mutated by acts only per Manual §IV.2 — per PA-T3 structural property` |
| `leaf-PA-T4-reversibility` | `axiom` | `(record.direction === 'dispatch' AND record.resolvedDisposition === 'act' AND record.cellGovernance.cell === 'act-dispatch') implies record.cellGovernance.reversibilityStatus ∈ {'reversible', 'irreversible'} (non-'n/a'; world-effect dispatches must declare reversibility) — per PA-T4 structural property` |
| `leaf-PA-A1-authority-validation` | `axiom` | `record.authorityEnforced.authorityClaimed equals input AuthorityAssertion AND record.authorityEnforced.authorityValidated === true AND record.authorityEnforced.validationBasis non-empty AND validationBasis cites mechanical predicate from substrate §6.3 six-class enum — per PA-A1 reference resolution + structural property` |
| `leaf-PA-A5-dispatch-validation` | `axiom` | `(record.direction === 'dispatch' AND record.resolvedDisposition === 'act') implies record.authorityEnforced.authorityClaimed is non-null AND record.authorityEnforced.authorityValidated === true. Act-dispatches with world-effect carry confirming AuthorityAssertion into the dispatch record per Manual §IV.4 directional symmetry — per PA-A5 structural property` |
| `leaf-PA-A6-unitary-enforcement` | `axiom` | `record.unitarySiteRef non-empty AND record.unitarySiteRef equals the LIV-instance-canonical perimeter site identifier (the unitary site is wired at F-identity middleware as 'src/middleware.ts'; identifier value frozen at deploy and consulted at every crossing). Authority enforcement happens at this one site; distributed authority enforcement is a structural defect per Manual §I.4 unitarity + F-005 framing rule — per PA-A6 structural property + reference resolution to PA-I` |
| `leaf-PA-Cn1-channel-declaration` | `axiom` | `record.resolvedChannel non-null AND non-empty (length ≥ 1) AND record.resolvedChannel matches arrival.channelClaim.kind OR dispatch.channelTarget — per PA-Cn1 structural property` |
| `leaf-PA-Cn2-channel-enumeration` | `axiom` | `record.resolvedChannel ∈ ChannelKind enum (currently {'wearer-message', 'wearer-query', 'ai-reply', 'system-trigger', 'integration-event', 'scheduled-trigger', 'internal-derivation'} with open-vocabulary per Manual §I.6 — extension by additive enum amendment per S3) — per PA-Cn2 enum-membership` |
| `leaf-PA-Cn4-channel-preservation` | `axiom` | `record.resolvedChannel value carried through to LM SubstrateWriteInput.metadata.source.channel (per LM SourceRef) at HR-PS-LM1 emission. Channel survives substrate succession per Manual §IV.2 ("Source authority survives substrate framework succession because it is a property of the typed signal itself") — per PA-Cn4 structural property + reference resolution to LM SourceRef` |
| `leaf-PA-IR1-resolution-attempt` | `axiom` | `(record.direction === 'intake' AND arrival.identityClaims.length ≥ 1) implies record.resolvedIdentities.length === arrival.identityClaims.length (one ResolvedIdentity per IdentityClaim; resolution attempted for every surface-form identifier) — per PA-IR1 cardinality + structural property` |
| `leaf-PA-IR2-resolution-outcome` | `axiom` | `For every entry r ∈ record.resolvedIdentities: r.outcome ∈ ResolutionOutcomeKind enum {'bound-to-existing-Ref', 'new-Ref-created', 'ambiguous-pending-disambiguation'} AND (r.outcome === 'bound-to-existing-Ref' implies r.ref !== null) AND (r.outcome === 'new-Ref-created' implies r.ref !== null) AND (r.outcome === 'ambiguous-pending-disambiguation' implies r.ref === null AND r.ambiguityDetail !== null AND r.ambiguityDetail.length ≥ 1) — per PA-IR2 enum-membership + structural property` |
| `leaf-PA-IR3-geometric-respect` | `axiom` | `Resolution at perimeter does NOT compute or store cluster-membership for resolved Refs. Cluster identity coherence is read-time emergent per Manual §IV.3 substrate-emergent layer ("Anchors, clusters, identity coherence as cluster property... read-time emergent, never stored"). PS produces only the Ref reference at resolution-time; cluster geometry is computed by reading programs (Present layer per Manual IV.3) — per PA-IR3 structural property (negative invariant: cluster pre-resolution at perimeter is forbidden)` |
| `leaf-PA-IR4-disambiguation-deferral` | `axiom` | `For every entry r with r.outcome === 'ambiguous-pending-disambiguation': PS does not assign a Ref via heuristic guess. r.ref remains null AND the ambiguity is surfaced (in HR-PS-program return path or via dispatch to wearer-disambiguation-program) for wearer-side resolution per Manual §IV.3 ("disambiguation is a wearer or program concern, expressed through ordinary state-change writes") — per PA-IR4 structural property (negative invariant: heuristic Ref assignment forbidden)` |
| `leaf-PA-Co1-correlation-declaration` | `axiom` | `record.correlationRef non-null AND non-empty AND (record.correlationRef equals record.crossingId for un-correlated crossings OR record.correlationRef equals an upstream CorrelationRef from MI Standard for crossings linked to an originating multi-instance interaction) — per PA-Co1 structural property` |
| `leaf-PA-Co2-correlation-membership` | `axiom` | `Crossings r1, r2 belonging to one originating wearer-interaction or one tool-conversation share record.correlationRef. Membership is read-time queryable: PS exposes correlation-index lookup at HR-PS3 enabling programs to query 'crossings where correlationRef === X' — per PA-Co2 reference resolution (correlation-index query) + structural property` |
| `leaf-PA-Co3-perimeter-only` | `axiom` | `Correlation does not propagate as cross-cutting metadata to programs. record.correlationRef is stored on the BoundaryCrossingRecord (perimeter-side) but is NOT injected into program payloads or substrate state-change content as primary key. Programs needing correlation consult the perimeter correlation-index via HR-PS3. Per Manual §IV.2 ("Correlation is not cross-cutting... lives in Section V's perimeter properties as perimeter mechanics") — per PA-Co3 structural property (negative invariant: cross-cutting promotion forbidden)` |

**PA-I leaf (Identity-tier; not in P1 axis enumeration but enforced as MA-G13 invariant + §1.4 Unitarity):**

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-PA-I-unitarity` | `axiom` | `For every BoundaryCrossingRecord r: r.unitarySiteRef equals the LIV-instance-canonical perimeter site identifier. There is exactly one such identifier per LIV instance. Distributed perimeter sites — multiple distinct unitarySiteRef values within a single LIV instance — are a structural defect per Manual §I.4. PS declares this as the unitarity rule governing F-005 implementation; the unitary site is at 'src/middleware.ts'; PA-A6 cross-axis enforces unitary-site reference at every authority enforcement check — per PA-I structural property + cardinality (one site per instance)` |

### §3.6 P4 Axiom instances (PA1..PA21 + PA-I)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). 19 PS-local axis-bound axioms + PA-I identity-tier = 20 total per §3.2 (v1.1's 24 → 20 at v1.2 post-extraction + dissolution per Sprint B2 Shot 2; counts reconciled with `PERIMETER_AXIOM_IDS` const at Sprint B2 Shot 2 re-roll).

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **PA1** | `Direction` / `leaf-PA1-direction-declaration` | Every `BoundaryCrossingRecord` has `direction ∈ {'intake', 'dispatch'}` — non-null, cardinality 1, exhaustive enum membership. | structural property (enum-membership + cardinality) |
| **PA2** | `Direction` (via `Direction/symmetry` sub-axis) / `leaf-PA2-directional-symmetry` | For every typed concern C declared governed for `direction='intake'` by some PA-N axiom, either (a) C is governed for `direction='dispatch'` by some PA-M axiom, or (b) PS §1 `scopeOut` declares C scoped-out for dispatch with explicit basis. Per Manual §IV.4 directional-symmetry. | structural property (axiom-coverage closure over §1 scopeOut) |
| **PA-T1** | `Arrival Typing` / `leaf-PA-T1-disposition-declaration` | `record.resolvedDisposition ∈ {'act', 'reference'}` — non-null, cardinality 1, exhaustive enum membership. Disposition derived from arrival/dispatch dispositionClaim with mechanical equality. | structural property (enum-membership + structural identity) |
| **PA-T2** | `Arrival Typing` (cross-axis with `Direction` for cell computation) / `leaf-PA-T2-cell-governance` | `record.cellGovernance.cell` is computed mechanically from `(direction, resolvedDisposition)`: `('intake', 'reference') → 'reference-intake'`, `('intake', 'act') → 'act-intake'`, `('dispatch', 'reference') → 'reference-dispatch'`, `('dispatch', 'act') → 'act-dispatch'`. `governanceLevel` is determined by cell per Manual §IV.2 four-cell table: lightweight for both reference cells, confirmation-audit-reversibility for act-intake, world-effect-strongest for act-dispatch. F-007 closure: this axiom is the structural site at which act-vs-reference distinction is enforced at intake typing, closing the v11.0 audit finding F-007. | structural property (mechanical mapping + reference resolution to Manual §IV.2 cell table) |
| **PA-T3** | `Arrival Typing` (cross-axis with carrier handoff) / `leaf-PA-T3-mutation-gate` | `record.resolvedDisposition === 'reference'` implies no substrate mutation flows from this crossing: (a) for direction='intake', no `SubstrateWriteInput` emission via HR-PS-LM1 with content other than read-only metadata; (b) for direction='dispatch', no substrate state-change recorded as a side-effect of dispatch beyond ordinary signal-reuse logging per Manual §IV.4. | structural property (mutation-rejection predicate) |
| **PA-T4** | `Arrival Typing` (cross-axis with `Direction`) / `leaf-PA-T4-reversibility` | `record.cellGovernance.cell === 'act-dispatch'` implies `record.cellGovernance.reversibilityStatus ∈ {'reversible', 'irreversible'}` (not 'n/a'). World-effect dispatches must declare reversibility per Manual §IV.2 four-cell governance ("strongest governance: world-effect external to LIV requires confirmation, audit, and where possible reversibility"). | structural property (conditional cardinality + enum-membership) |
| **PA-A1** | `Authority Enforcement` / `leaf-PA-A1-authority-validation` | `record.authorityEnforced.authorityClaimed` equals the input `AuthorityAssertion` (from arrival.authorityClaim or dispatch.authorityContext) AND `record.authorityEnforced.authorityValidated === true` AND `record.authorityEnforced.validationBasis` non-empty AND validationBasis cites a mechanical predicate from substrate §6.3 six-class enum. | reference resolution (identity + enum-membership + non-empty cardinality) |
| **PA-A5** | `Authority Enforcement` (cross-axis with `Direction`) / `leaf-PA-A5-dispatch-validation` | `(direction === 'dispatch' AND resolvedDisposition === 'act')` implies `authorityEnforced.authorityClaimed !== null AND authorityEnforced.authorityValidated === true`. Per Manual §IV.4 directional symmetry — every act-direction dispatch carries confirming authority into the dispatch record. | structural property (conditional reference resolution) |
| **PA-A6** | `Authority Enforcement` (cross-axis with Identity-tier PA-I) / `leaf-PA-A6-unitary-enforcement` | `record.unitarySiteRef non-empty AND record.unitarySiteRef equals the LIV-instance-canonical perimeter site identifier`. Authority enforcement occurs at the one perimeter site; distributed authority enforcement is a structural defect per Manual §I.4 unitarity. F-005 framing closure (the structural rule against which src consolidation is verified). | structural property + reference resolution to PA-I |
| **PA-Cn1** | `Channel Classification` / `leaf-PA-Cn1-channel-declaration` | `record.resolvedChannel` non-null AND non-empty (length ≥ 1) AND matches input channel claim (arrival.channelClaim.kind for intake; dispatch.channelTarget for dispatch). | structural property (cardinality + structural identity) |
| **PA-Cn2** | `Channel Classification` / `leaf-PA-Cn2-channel-enumeration` | `record.resolvedChannel ∈ ChannelKind enum` (currently 7 named values + open-vocabulary string per Manual §I.6 + S3 additive extension). | enum-membership |
| **PA-Cn4** | `Channel Classification` (cross-axis with carrier handoff) / `leaf-PA-Cn4-channel-preservation` | `record.resolvedChannel` value carried through to LM `SubstrateWriteInput.metadata.source.channel` at HR-PS-LM1 emission for intake-direction crossings. Channel survives substrate succession per Manual §IV.2 ("Source authority survives substrate framework succession because it is a property of the typed signal itself"). | structural property + reference resolution to LM SourceRef |
| **PA-IR1** | `Identity Resolution` (cross-axis with `Direction` — intake-only per §1 scopeOut for dispatch) / `leaf-PA-IR1-resolution-attempt` | `(direction === 'intake' AND arrival.identityClaims.length ≥ 1)` implies `record.resolvedIdentities.length === arrival.identityClaims.length` — one ResolvedIdentity per IdentityClaim. | cardinality + structural property |
| **PA-IR2** | `Identity Resolution` / `leaf-PA-IR2-resolution-outcome` | For every `r ∈ record.resolvedIdentities`: `r.outcome ∈ ResolutionOutcomeKind` enum AND (`r.outcome === 'bound-to-existing-Ref' implies r.ref !== null`) AND (`r.outcome === 'new-Ref-created' implies r.ref !== null`) AND (`r.outcome === 'ambiguous-pending-disambiguation' implies r.ref === null AND r.ambiguityDetail !== null`). | enum-membership + structural property |
| **PA-IR3** | `Identity Resolution` / `leaf-PA-IR3-geometric-respect` | Resolution at perimeter does NOT compute or store cluster-membership for resolved Refs. PS produces only the Ref reference at resolution-time; cluster geometry is read-time emergent per Manual §IV.3 substrate-emergent layer. **Negative invariant:** any pre-resolution of cluster identity at perimeter is a violation. | structural property (negative invariant: cluster pre-resolution forbidden) |
| **PA-IR4** | `Identity Resolution` / `leaf-PA-IR4-disambiguation-deferral` | For every `r` with `r.outcome === 'ambiguous-pending-disambiguation'`: PS does not assign a Ref via heuristic guess. `r.ref === null` AND ambiguity surfaced for wearer-side resolution per Manual §IV.3. **Negative invariant:** heuristic Ref assignment forbidden at perimeter. | structural property (negative invariant) |
| **PA-Co1** | `Correlation` / `leaf-PA-Co1-correlation-declaration` | `record.correlationRef` non-null AND non-empty AND (`correlationRef === record.crossingId` for un-correlated crossings OR `correlationRef` equals an upstream CorrelationRef from MI Standard for linked crossings). | structural property (cardinality + reference resolution to MI) |
| **PA-Co2** | `Correlation` / `leaf-PA-Co2-correlation-membership` | Crossings sharing originating wearer-interaction or tool-conversation share `correlationRef`. PS exposes a correlation-index lookup at HR-PS3 returning `crossings where correlationRef === X`. | reference resolution (index query) + structural property |
| **PA-Co3** | `Correlation` / `leaf-PA-Co3-perimeter-only` | `record.correlationRef` is stored on `BoundaryCrossingRecord` (perimeter-side) but NOT injected into program payloads or substrate state-change content as primary key. Programs needing correlation consult perimeter correlation-index via HR-PS3 per Manual §IV.2. **Negative invariant:** cross-cutting promotion forbidden. | structural property (negative invariant) |
| **PA-I** | Identity-tier (per §1.4 Unitarity assertion; not bound to P1 axis) / `leaf-PA-I-unitarity` | For every `BoundaryCrossingRecord r`: `r.unitarySiteRef` equals the LIV-instance-canonical perimeter site identifier. There is exactly one such identifier per LIV instance. Distributed perimeter sites — multiple distinct `unitarySiteRef` values within a single LIV instance — are a structural defect per Manual §I.4 unitarity. F-005 framing root rule (src consolidation verified against this axiom). | structural property + cardinality (one site per instance) |

**Sprint B2 Shot 2 amendment notes:**
- **PA-A2** (former wearer-scope-rule): extracted to Permissions Standard v1.0 PMA-Sb2 (per-user-scope subject match at Subject Binding axis). Wearer-scope substrate writes are decision-time access scoping, not crossing-time authority shape.
- **PA-A3** (former system-scope-rule): subsumed under Permissions Standard v1.0 PMA-D2 (deny-reason discriminant) + PMA-Sb3 (role-resolution null-handling). System-scope access at global tier produces deny-no_role for non-system subjects.
- **PA-A4** (former orphan-rule): dissolved entirely. Paired-write contract was vacuously satisfied per Sprint B1 final shot 3 (art_* tables dropped; substrate is single store). No replacement axiom — `record.emissionPair` field removed from BoundaryCrossingRecord at Sprint B2 Shot 2b.
- **PA-Cn3** (former channel-authority-binding): extracted to Permissions Standard v1.0 PMA-Av2 (vocabulary closure at Action Vocabulary axis). Per-channel permitted-authority binding is a closed-vocabulary access-scoping rule, not a crossing-time channel-classification rule.

**AxR1 self-check (post-Shot-2):** each remaining axiom binds to exactly one primary axis/leaf. PA2 attaches at Direction with cross-axis closure note over §1 scopeOut; PA-T2 attaches at Arrival Typing with cross-axis to Direction; PA-A5 attaches at Authority Enforcement with cross-axis to Direction; PA-A6 attaches at Authority Enforcement with cross-axis to Identity-tier PA-I; PA-Cn4 attaches at Channel with cross-axis to carrier handoff (HR-PS-LM1); PA-IR1 attaches at Identity Resolution with cross-axis to Direction (intake-only). MA-St11 cross-axis-invariant declared at substrate §9 permits this. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set additively versioned. v1.2 removes 4 axioms (PA-A2/A3/A4/Cn3) — additive amendment per MA-L1 invokes the *removal-is-additive* clause: removal of a vacuously-satisfied or relocated axiom does not change behavior for prior-passing artifacts (PA-A4 was vacuously satisfied per art_* drop; PA-A2/A3/Cn3 moved to Permissions Standard, which any consumer of access scoping now consults). Pass.
**AxR4 self-check:** all axiom text declarative. Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: "PS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). PS therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. PS's gate-procedure semantics — what the perimeter does at each crossing — are captured declaratively as the PA1..PA-I axiom set (§3.6) and G-PS1..G-PS-I gate set (§4.2); runtime invocation of gates at every crossing is owned by F-identity slice (L4 program), outside PS's P8 scope. Precedent: Plan Standard v2.2 §3.7 + Research Standard v1.0 §3.7 declare the same empty-P8 pattern."
}
```

### §3.8 Universal-variables table

Per metaframework §3.2 universal-variables discipline (every axiom expresses Temporal × Categorical × Relational × Positional). PS-local table:

| Axis | Temporal carrier | Categorical carrier | Relational carrier | Positional carrier |
|---|---|---|---|---|
| Direction | `record.crossedAt` (EpochMs) | `DirectionKind` enum | `record.crossingId` ordering on EpochMs sequence | `PerimeterDirectionPositional = 'pending' \| 'crossed'` |
| Arrival Typing | `record.crossedAt` | `DispositionKind` + `CellGovernanceRecord.cell` enums | `cellGovernance` derived from `(direction, disposition)` pair | `PerimeterDispositionPositional = 'declared' \| 'cell-governed'` |
| Authority Enforcement | `record.crossedAt` | `AuthorityAssertion.level` + `actor` + `source` enums | `authorityEnforced` references `authorityClaimed`, `authorityScopeMatch` derives from claim ∩ allowed-scopes(channel) | `PerimeterAuthorityPositional = 'claim-received' \| 'validated' \| 'rejected'` |
| Channel Classification | `record.crossedAt` (channel preservation also stamps `LM SourceRef` at write-time) | `ChannelKind` enum | `record.resolvedChannel` derives from arrival/dispatch claim + binding lookup | `PerimeterChannelPositional = 'claimed' \| 'resolved' \| 'rejected'` |
| Identity Resolution | `record.crossedAt` (resolution timestamp) | `ResolutionOutcomeKind` enum | per-`ResolvedIdentity.ref` references `IdentityRef` from LM | `PerimeterIdentityResolutionPositional = 'attempted' \| 'resolved' \| 'ambiguous-pending'` |
| Correlation | `record.crossedAt` | n/a (CorrelationRef is structural identifier, not enum-categorized) | `record.correlationRef` references upstream `CorrelationRef` (MI Standard) or self-ID | `PerimeterCorrelationPositional = 'self-correlated' \| 'linked'` |

Positional enums declared in `core/types/perimeter-standard.types.ts`.

### §3.9 Vocabulary

Framework-local terms declared at point of use per PR1 (substrate §10.2). Substrate terms referenced by identifier per S1. Cross-framework atoms consumed by reference per A-08.

| Term | Declared | Definition |
|---|---|---|
| `boundary-crossing` | §1 primitive | atomic unit of work in PS: one boundary crossing (intake or dispatch direction) producing one `BoundaryCrossingRecord`; framework-local atomic operation analogous to LM's `state-change`, RS's `investigation-step`, VS's `predicate-evaluation` |
| `intake` | §3.3 Direction axis | inward boundary crossing — untyped surface signal arriving at LIV from outside (wearer message, AI reply, integration event, scheduled trigger, internal derivation) and being structured into typed jurisdiction |
| `dispatch` | §3.3 Direction axis | outward boundary crossing — typed signal emitted by LIV (program emission, wearer-rendering, world-effect dispatch like email/calendar/file-write) being structured for outward delivery |
| `act` | §3.3 Arrival Typing axis (per Manual §IV.2) | crossing disposition that produces effect: substrate effect (substrate mutation) or world effect (external-to-LIV side effect) |
| `reference` | §3.3 Arrival Typing axis (per Manual §IV.2) | crossing disposition that produces no effect: read, query, or render with no substrate or world mutation |
| `cell-governance` | §3.3 Arrival Typing per Manual §IV.2 four-cell table | governance level mapping per `(direction × disposition)`: lightweight for both reference cells, confirmation-audit-reversibility for act-intake, world-effect-strongest for act-dispatch |
| `unitary site` | §1.4 Identity-tier per Manual §I.4 | the one perimeter site per LIV instance through which all boundary crossings pass; identifier carried as `unitarySiteRef` on every `BoundaryCrossingRecord`; runtime location at `src/middleware.ts` |
| `permitted-authority set` | `core/types/perimeter-standard.types.ts` `PermittedAuthoritySet` + `core/constants/perimeter-standard.ts` `DEFAULT_PERIMETER_BINDING.permittedAuthorityByChannel` | per-channel set of `AuthorityAssertion` shapes admissible on that channel; declared at PerimeterBinding instance. Governed by Permissions Standard v1.0 PMA-Av2 (vocabulary closure on Action Vocabulary axis) per L3.3 disposition (b) at Sprint B2 Shot 2 re-roll — same axiom owns this rule at both consultation sites (boundary + access-check). |
| `correlation index` | §3.6 PA-Co2 + §6.2 HR-PS3 | perimeter-internal lookup mapping `CorrelationRef → list-of-crossingIds`; queried by programs needing correlation membership; not stored cross-cuttingly per PA-Co3 |
| `geometric respect` | §3.6 PA-IR3 per Manual §IV.3 | the rule that perimeter resolves only individual `IdentityRef` for arrival surface forms; cluster identity coherence remains read-time emergent (Manual §IV.3 substrate-emergent layer); perimeter-side cluster pre-resolution forbidden |
| `disambiguation deferral` | §3.6 PA-IR4 per Manual §IV.3 | the rule that ambiguous identity resolutions surface as wearer-side prompts rather than perimeter heuristic guesses; preserves wearer authority over substrate identity coherence |
| `PerimeterBinding` | §6.2 + `core/types/perimeter-standard.types.ts` | PS-defined type shape; deployment-time configuration declaring per-channel permitted-authority sets, dispatch-target channels, identity-resolution registry; captured verbatim in `BoundaryCrossingRecord.perimeterFrameworkVersion` for audit |
| `PerimeterDirectionPositional` | §3.8 + types.ts | enum `'pending' \| 'crossed'` — Direction axis lifecycle position |
| `PerimeterDispositionPositional` | §3.8 + types.ts | enum `'declared' \| 'cell-governed'` — Arrival Typing axis lifecycle position |
| `PerimeterAuthorityPositional` | §3.8 + types.ts | enum `'claim-received' \| 'validated' \| 'rejected'` — Authority Enforcement axis lifecycle position |
| `PerimeterChannelPositional` | §3.8 + types.ts | enum `'claimed' \| 'resolved' \| 'rejected'` — Channel axis lifecycle position |
| `PerimeterIdentityResolutionPositional` | §3.8 + types.ts | enum `'attempted' \| 'resolved' \| 'ambiguous-pending'` — Identity Resolution axis lifecycle position |
| `PerimeterCorrelationPositional` | §3.8 + types.ts | enum `'self-correlated' \| 'linked'` — Correlation axis lifecycle position |
| `DispositionKind` | §2.7 + types.ts | enum `'act' \| 'reference'` |
| `DirectionKind` | §2.7 + types.ts | enum `'intake' \| 'dispatch'` |
| `ChannelKind` | §2.7 + types.ts | enum 7 named values + open-vocabulary string per Manual §I.6 |
| `ResolutionOutcomeKind` | §2.7 + types.ts | enum `'bound-to-existing-Ref' \| 'new-Ref-created' \| 'ambiguous-pending-disambiguation'` |
| `ReversibilityFlag` | §2.7 + types.ts | enum `'reversible' \| 'irreversible' \| 'n/a'` |

### §3.13 AxisBasis declarations (Sprint B1 Shot 3 v1.1 amendment, additive per MA-S7 recursive scope)

Per MA-St17 (metaframework v3.3.1 §3.2.1): every PS declaration in the enumerated kind set (axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums) that crosses boundary 2 (MFv3 → standards) and is not already grounded by another declared mechanism (P1–P8 instance grounding by PR1; axiom grounding by own derivation; gate grounding by `tests` binding; leaves are P3 instances grounded by PR1) declares a basis conforming to substrate §4 A-22 AxisBasis. Every basis below traces by natural derivation. No force-fit. Where a kind has no instances (P8 = 0 per §3.7), the row is omitted (the MA-St17 quantifier ranges over declared instances only).

Manual citations pin `manualVersion: '13.0'`. Manual v13.0 reorganizes the prior §I/§II/§IV numeric structure into named Parts (Substrate, Memory Loop, Domain Loop, Governance Loop); citations below map by content (Part + subsection name) per direction. Substantive content cited (unitary Boundary, four-cell governance, channel-authority binding, surface-form resolution, correlation as Boundary-internal concern, directional-symmetry through intake/dispatch flow, substrate authority unconditional, system-L0 governance) is stable; Manual v13.1's coming Part IV revision does not invalidate these references.

#### §3.13.1 Axes basis

Six P1 Axis instances declared at §3.3 (Direction, Arrival Typing, Authority Enforcement, Channel Classification, Identity Resolution, Correlation). All ground via `l0-ratified-ref` to Manual v13.0 substantive content; ratification carried by `{level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` per §6.6 Provenance contract.

| Axis | Basis kind | `manualLocus` (`manualVersion: '13.0'`) | Basis prose |
|---|---|---|---|
| **Direction** | `l0-ratified-ref` | `'LIV Manual Part II — Memory Loop, Boundary + The loop'` | The Manual Part II Boundary subsection declares "Every signal entering typed jurisdiction crosses here. Every signal leaving crosses here" — the binary intake/dispatch structure is the Manual's directional commitment. Part II "The loop" enumerates the flow as "Modality → Boundary types it → Mediator → Store... Mediator carries the response → Boundary untypes it → Modality emits it to the wearer" — both directions traversing the Boundary symmetrically. PA1 (`record.direction ∈ {'intake', 'dispatch'}`) is the mechanical realization of this binary; PA2 (directional symmetry closure) is the structural commitment that every concern governed for intake has correspondent for dispatch or scope-out justification — realizing the Manual's "Every signal entering... Every signal leaving" symmetry. |
| **Arrival Typing** | `l0-ratified-ref` | `'LIV Manual Part II — Memory Loop, Boundary (Act or reference table)'` | The Manual Part II Boundary subsection contains the four-cell table verbatim: `Reference/Intake = Lightweight; Reference/Dispatch = Lightweight; Act/Intake = Confirmation, audit, reversibility; Act/Dispatch = Strongest`. The axis maps `(direction × disposition) → governanceLevel` per this table. PA-T1 (disposition enum membership), PA-T2 (cell-governance computation), PA-T3 (reference-no-mutation gate), PA-T4 (act-dispatch reversibility flag) realize the four-cell governance at the BCR level. |
| **Authority Enforcement** | `l0-ratified-ref` | `'LIV Manual Part I — Wearer-L0 (Substrate authority unconditional) + System-L0 + Part II — Memory Loop, Boundary (Authority enforcement subsection)'` | Manual Part II Boundary declares: "Authority enforcement. Boundary enforces authority at the crossing. Scope access is checked here. System-L0 and Wearer-L0 confirmations are recognized here. No unauthorized signal reaches Store." Part I Wearer-L0 declares substrate authority unconditional for wearer scope; Part I System-L0 declares structural-shape authority. *Post-Sprint-B2-Shot-2:* PA-A1 (validation), PA-A5 (dispatch validation per Manual directional flow), PA-A6 (unitary enforcement per Part II Boundary "One Boundary per LIV instance") realize the crossing-time authority shape declared in the Manual. Decision-time access scoping (former PA-A2 wearer-scope, PA-A3 system-scope) and paired-write contract (former PA-A4) extracted/dissolved at Sprint B2 Shot 2; access scoping now governed by Permissions Standard v1.0. |
| **Channel Classification** | `l0-ratified-ref` | `'LIV Manual Part II — Memory Loop, Boundary (Source authority + Channel classification subsections)'` | Manual Part II Boundary declares: "Source authority — who sent it: Wearer-L0, System-L0, AI response, scheduled trigger, integration event, internal derivation. Each channel has different authority semantics; per-channel governance is enforced at the Boundary." And under "Boundary mechanics": "Channel classification — assigning source authority per channel." *Post-Sprint-B2-Shot-2:* PA-Cn1 (declaration non-empty), PA-Cn2 (enum-membership; open-vocabulary per Manual's enumeration), PA-Cn4 (channel preservation through HR-PS-LM1 to LM SourceRef) realize the per-channel classification + preservation semantics declared in the Manual. Channel × permitted-authority binding (former PA-Cn3) extracted to Permissions Standard v1.0 PMA-Av2 at Sprint B2 Shot 2; per L3.3 disposition (b) the boundary-side consultation atom (`PermittedAuthoritySet` + `DEFAULT_PERIMETER_BINDING`) retained and governed by PMA-Av2 jurisdiction. |
| **Identity Resolution** | `l0-ratified-ref` | `'LIV Manual Part II — Memory Loop, Boundary (Surface-form-to-reference matching) + Part I — Wearer-L0 (Identity curation through utterance — bypass case)'` | Manual Part II Boundary declares under "Boundary mechanics": "Surface-form-to-reference matching — resolving wearer-stated identifiers to substrate identity references at intake." Part I Wearer-L0 declares the bypass case: "Identity curation through utterance — when the wearer says 'X means Y,' the resulting state-change writes the disambiguation as ordinary content. No domain program mediates this." PA-IR1 (resolution attempt), PA-IR2 (outcome enum with three values), PA-IR3 (geometric respect — no cluster pre-resolution at perimeter; clusters are read-time emergent per LM commitment), PA-IR4 (disambiguation deferral — no heuristic guess; wearer-side disambiguation per the bypass case) realize the resolution mechanics. |
| **Correlation** | `l0-ratified-ref` | `'LIV Manual Part II — Memory Loop, Boundary (Boundary mechanics — Correlation)'` | **Memory #17 closure.** Manual Part II Boundary declares verbatim under "Boundary mechanics. The Boundary owns the following as program-internal concerns, not cross-loop concerns: Correlation — linking arrivals from one originating interaction." This is the substantive Manual commitment that grounds the Correlation axis. PA-Co1 (correlation declaration with self-reference for un-correlated crossings), PA-Co2 (correlation membership index), PA-Co3 (perimeter-only — not cross-cutting to programs) realize the Manual's "program-internal concern, not cross-loop concern" framing. The prior epistemic flag (axis lifted from prior Manual §IV.2 perimeter-mechanic placement at PS derivation, with substrate-atom-missing concern) is now closed: the Manual's named-Part Boundary subsection at v13.0 is the natural-derivation source. |

PA-I (Identity-tier unitarity assertion, §1.4 + §3.6) is an axiom; excluded from MA-St17 quantifier per axiom-own-derivation. Its derivation traces to Manual Part II Boundary: "One Boundary per LIV instance — unitary by structural necessity. A distributed boundary cannot be checked; a unitary boundary can." Documented at §1.4 already.

#### §3.13.2 Sub-axes basis

Per §3.4 enumeration: 20 sub-axis rows declared (3 Direction + 4 Arrival Typing + 3 Authority Enforcement + 3 Channel Classification + 4 Identity Resolution + 3 Correlation). *Sprint B2 Shot 2 amendment*: 4 sub-axes removed in lockstep with their parent axiom extraction/dissolution at PS v1.2 — `Authority Enforcement/wearer-scope` (PA-A2 extracted to PMS PMA-Sb2), `Authority Enforcement/system-scope` (PA-A3 extracted to PMS PMA-D2+PMA-Sb3), `Authority Enforcement/orphan-rule` (PA-A4 dissolved per art_* table drop), `Channel Classification/authority-binding` (PA-Cn3 extracted to PMS PMA-Av2). Pre-Shot-2 breakdown was 24 (3 + 4 + 6 + 4 + 4 + 3). *Sprint B2 Shot 2 re-roll*: §3.2 P2 count reconciled from 13 → 20 in lockstep with this enumeration; pre-existing PS v1.0.1 §3.2-vs-§3.4 discrepancy (text said 13, enumeration was 17 / then 24 at v1.1) now closed at v1.2 re-roll alongside S1 P3/P4/P5 reconciliation. Basis declared per enumerated row.

Each sub-axis grounds via `l0-ratified-ref` to the same Manual locus as its parent axis (per §3.13.1 above); sub-axis basis prose is the parent axis's basis prose specialized to the sub-axis's particular structural decomposition. The discriminating note per sub-axis is the structural-decomposition rationale.

| Sub-axis (id) | Parent axis | Basis specialization |
|---|---|---|
| `Direction/inward` | Direction | Intake-side of binary direction enum; ground = Manual Part II Boundary intake-flow. |
| `Direction/outward` | Direction | Dispatch-side of binary direction enum; ground = Manual Part II Boundary dispatch-flow. |
| `Direction/symmetry` | Direction | The closure rule binding intake to dispatch (or to declared scope-out); ground = Manual Part II "Every signal entering... Every signal leaving" symmetric flow. |
| `Arrival Typing/disposition` | Arrival Typing | The 'act' \| 'reference' enum; ground = Manual Part II Boundary "Act or reference" property declaration. |
| `Arrival Typing/cell-governance` | Arrival Typing | The four-cell mapping; ground = Manual Part II Boundary four-cell table verbatim. |
| `Arrival Typing/mutation-gate` | Arrival Typing | Reference dispositions produce no substrate mutation; ground = Manual Part II Boundary table where reference-direction cells are "Lightweight... no confirmation required" (no mutation implied) versus act cells which mutate. |
| `Arrival Typing/reversibility` | Arrival Typing | Act-dispatch carries reversibility flag; ground = Manual Part II Boundary table act-dispatch cell = "Strongest — world-effect external to LIV requires confirmation, audit, reversibility where possible." |
| `Authority Enforcement/intake-validation` | Authority Enforcement | Per-arrival authority validation; ground = Manual Part II Boundary "Authority enforcement. Boundary enforces authority at the crossing." |
| `Authority Enforcement/dispatch-validation` | Authority Enforcement | Act-dispatch confirming authority; ground = Manual Part II Boundary directional flow + four-cell act-dispatch governance. |
| `Authority Enforcement/unitary-site` | Authority Enforcement (cross-axis to PA-I) | Authority enforcement at the one Boundary site; ground = Manual Part II Boundary "One Boundary per LIV instance — unitary by structural necessity." |
| `Channel Classification/declaration` | Channel Classification | Every arrival assigned ChannelKind; ground = Manual Part II Boundary "Source authority — who sent it" stamped at Boundary. |
| `Channel Classification/enumeration` | Channel Classification | Channel enum admits Manual's seven named channels plus open-vocabulary extension; ground = Manual Part II Boundary enumeration ("Wearer-L0, System-L0, AI response, scheduled trigger, integration event, internal derivation"). |
| `Channel Classification/preservation` | Channel Classification (cross-axis to carrier handoff) | Channel value carried through to LM SourceRef.channel; ground = Manual Part II Boundary "Every typed signal carries four properties stamped at the Boundary and preserved by Store." Channel is one of the four. |
| `Identity Resolution/attempt` | Identity Resolution | Every arrival with surface-form identifiers triggers resolution; ground = Manual Part II Boundary "Surface-form-to-reference matching — resolving wearer-stated identifiers to substrate identity references at intake." |
| `Identity Resolution/outcome-enum` | Identity Resolution | Three-value resolution outcome; ground = the Manual's commitment to wearer-side identity curation (Part I Wearer-L0 bypass case "Identity curation through utterance") forces three outcomes: existing-match (bind-to-existing-Ref), new (new-Ref-created), and unresolvable-without-wearer-input (ambiguous-pending-disambiguation). |
| `Identity Resolution/geometric-respect` | Identity Resolution | Negative invariant: no cluster pre-resolution at perimeter; ground = LM commitment (identity-by-reference; cluster geometry read-time emergent — LMA5, LMA8) which the perimeter must respect by not pre-computing cluster membership. Manual Part II Boundary's surface-form-to-reference matching is single-identity resolution, not cluster resolution; cluster geometry is Part II Store / Internal-operations territory. |
| `Identity Resolution/disambiguation-deferral` | Identity Resolution | Negative invariant: no heuristic Ref assignment; ground = Manual Part I Wearer-L0 "Identity curation through utterance — when the wearer says 'X means Y'... No domain program mediates this." Perimeter heuristic guess would violate the wearer's exclusive authority over identity curation. |
| `Correlation/declaration` | Correlation | Every crossing carries CorrelationRef; ground = Manual Part II Boundary "Correlation — linking arrivals from one originating interaction." Every crossing has at minimum a self-correlation (its own crossingId) for un-linked arrivals. |
| `Correlation/membership` | Correlation | Correlation-index query at HR-PS3; ground = "linking arrivals from one originating interaction" requires a per-crossing-set membership query mechanism. |
| `Correlation/perimeter-only` | Correlation | Negative invariant: no cross-cutting promotion to program payloads; ground = Manual Part II Boundary's framing of Correlation as a "program-internal concern, not cross-loop concern" — perimeter-internal, not propagated. |

#### §3.13.3 Axioms basis

Axioms grounded by own derivation per MA-St17 exclusion clause. No A-22 basis required at the axiom kind. Subsection reserved for parity with sibling-standard declarations where the subsection documents axiom-axis binding rationale.

#### §3.13.4 Handoff rules basis

| ID | Basis kind | Reference | Basis prose |
|---|---|---|---|
| **HR-PS1** | `substrate-atom-ref` | `atomId: 'A-03'` (HandoffContract) | HR-PS1 (program/route → PS intake claim receipt) conforms to substrate §4 A-03 HandoffContract shape. Direction (inbound), carrier applicability, captureShape per substrate §8.2 amended P6. Substrate-tier grounding. |
| **HR-PS2** | `substrate-atom-ref` | `atomId: 'A-03'` (HandoffContract) | HR-PS2 (program/route → PS dispatch request submission) conforms to substrate §4 A-03 HandoffContract shape. Same shape basis as HR-PS1; carrier applicability ['self', 'named']; captureShape declared §6.3. Substrate-tier grounding. |
| **HR-PS3** | `substrate-atom-ref` | `atomId: 'A-03'` (HandoffContract) | HR-PS3 (PS → consumer return path) conforms to substrate §4 A-03 HandoffContract shape. Carrier applicability ['named'] per PS's own carrier = named. Substrate-tier grounding. |
| **HR-PS-LM1** | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary + Store (Boundary types it → Mediator carries it → Store accumulates it)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` | HR-PS-LM1 (PS → LM intake substrate-write emission) is the mechanical realization of the Manual's Memory Loop flow at the Boundary→Store transit. The Manual Part II "The loop" declares: "Wearer signal arrives at a Modality channel → Modality presents it to the Boundary → Boundary types it → Mediator carries it → Store accumulates it." HR-PS-LM1 captures the Boundary→Store transit at the typed-signal level for intake direction. Send-side matches LM HR-LM1 receive-side contract. L0-ratified at PS v1.0; carried forward unchanged at v1.0.1, v1.1 (carrier version bumped to LM v3.3 per Sprint B1 Shot 3 sweep — handoff contract shape unchanged). |
| **HR-PS4** | `substrate-atom-ref` | `atomId: 'A-03'` (HandoffContract) | HR-PS4 (PS → observability/replay/audit/downstream BCR readers) conforms to substrate §4 A-03 HandoffContract shape with `diagnosticSignificance = false` → captureShape n/a per substrate §8.2 P6 amended discipline. Substrate-tier grounding. |

#### §3.13.5 Lifecycle events basis

| Event (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `version transition` (§5.1) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) + `atomId: 'A-21'` (StateOrdering — lifecycle states index into A-21 positions) | Version transitions are AmendmentProvenance instances per substrate §4 A-16; transitions occur between LifecycleState positions declared at substrate §9, which in turn index five-state ordering at A-21 per MFv3 v3.3.0-shot1 amendment. Strongest grounding. |
| `amendment trigger` (§5.2) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) | Gap-driven or L0-directed amendments materialize as AmendmentProvenance instances per substrate §4 A-16. Substrate-tier grounding. |
| `confirmation gate` (§5.3) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part IV — Governance Loop, Derivation (System-L0 confirmation is required at every generation regardless of path)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Manual declares "System-L0 confirms every derivation before a standard takes effect" + "System-L0 confirmation is required at every generation regardless of path." PS's confirmation gate at each version transition + first-run logging is the realization of this commitment at the standards-tier. L0-ratified at PS v1.0. |
| `escalation state` (§5.4) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) | Escalation state is a position in the framework lifecycle; declared with status/gap/requiredMode fields per Work Protocol Layer 0 escalation discipline. Grounds in substrate §9 LifecycleState enum (extensible via amendment per MA-L1). Substrate-tier grounding. |
| `judgment deprecations` (§5.5) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance — judgment deprecation is an amendment event) + `atomId: 'LifecycleState'` (substrate §9 — deprecated state) | Judgment deprecations are amendment events transitioning a J-input into deprecated state. Grounds in substrate atoms A-16 + §9 LifecycleState. Substrate-tier grounding. |

#### §3.13.6 Judgment inputs basis

| ID | Basis kind | Reference | Basis prose |
|---|---|---|---|
| **J-perimeter-observation** | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Boundary acts on every crossing... transforms) + Part IV — Governance Loop (Substrate accumulates signal across all programs → Derivation reads aggregate signal)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | J-perimeter-observation is the informational/diagnostic shape exposing PS's runtime characteristics (crossings observed, distributed-site detections, ambiguous resolutions persisted, channel-enumeration gaps, correlation-index health) to L0 observation. It realizes the Manual's commitment that the governance loop reads aggregate signal (Part IV "Substrate accumulates signal across all programs → Derivation reads aggregate signal → gap identified") at the Boundary's transform point (Part II "Boundary acts on every crossing... transforms"). The J-input does not amend axioms or gates; it surfaces operational signal for L0 review per §5.3 confirmation gate. L0-ratified at PS v1.0. *Sprint B2 Shot 2:* `orphan count` diagnostic field removed from enumeration in lockstep with PA-A4 dissolution + `orphanCount` removal from §7 J-input shape. |

#### §3.13.7 Closure rules basis

| Closure (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `Sub-axis attachment closure` (§3.4 note — "several sub-axes share a leaf because the axiom's mechanical condition is unitary at sub-axis cluster level") | `substrate-atom-ref` | `atomId: 'A-08'` (LeafRef) | The closure rule that sub-axes may share a leaf when axiom condition is unitary at sub-axis cluster level is grounded by substrate §4 A-08 LeafRef + MA-St2 leaf-atomicity per metaframework §3.2. Substrate-tier grounding; same pattern RS §3.4 establishes. |
| `DirectionKind enum closure` (§2.7 — closed: 'intake' \| 'dispatch') | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Every signal entering... Every signal leaving)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed binary enum; ground = the Manual's binary directional structure (entering / leaving). No third value declared because the Manual's directional commitment is binary. L0-ratified at PS v1.0. |
| `DispositionKind enum closure` (§2.7 — closed: 'act' \| 'reference') | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Act or reference — Acts mutate substrate or act on the world. References read or query without effect)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed binary enum; ground = Manual Part II Boundary's "Act or reference" property declaration. L0-ratified at PS v1.0. |
| `ChannelKind enum closure` (§2.7 — open: seven named + extensible per S3) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Source authority enumeration)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Open-vocabulary enum admitting the Manual's seven named channels + additive extension per substrate S3. Ground = Manual Part II Boundary's enumeration ("Wearer-L0, System-L0, AI response, scheduled trigger, integration event, internal derivation") + Modality plurality commitment (Part II Modality: "Modality programs are plural by construction. One channel per program. New channels enter the system as new Modality programs without restructuring the loop"). New channel kinds enter as new enum values. L0-ratified at PS v1.0. |
| `ResolutionOutcomeKind enum closure` (§2.7 — closed: three values) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Surface-form-to-reference matching) + Part I — Wearer-L0 (Identity curation through utterance)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed three-value enum; ground = the exhaustive resolution disposition per Manual commitments: an arrival surface form either binds to an existing Ref (already curated), creates a new Ref (fresh identity), or surfaces as ambiguous-pending-disambiguation (deferred to wearer per Part I Wearer-L0 identity-curation-through-utterance bypass case). No fourth disposition possible because the Manual's identity authority commitment is exhaustive at these three. L0-ratified at PS v1.0. |
| `ReversibilityFlag enum closure` (§2.7 — closed: three values) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Act-dispatch — Strongest, world-effect external to LIV requires confirmation, audit, reversibility where possible)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed three-value enum (reversible | irreversible | n/a); ground = Manual Part II Boundary act-dispatch cell declares reversibility requirement "where possible" (admitting irreversible as a real case); n/a covers reference dispositions per PA-T4 binding. L0-ratified at PS v1.0. |
| `MECE closure over axes` (§3.3 — six axes orthogonal + exhaustive per §C.6 derivation) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Authority enforcement + Signal properties + Boundary mechanics subsections collectively)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The six-axis MECE decomposition over PS's concern space grounds in the Manual's enumeration of Boundary concerns: directional flow (Direction), four-cell act/reference governance (Arrival Typing), authority enforcement (Authority Enforcement), per-channel governance + signal-property stamping (Channel Classification), surface-form-to-reference matching (Identity Resolution), correlation as program-internal concern (Correlation). Each concern is named explicitly in Manual Part II Boundary subsections; none is omitted; none redundantly covers another (per §3.3 orthogonality verification). L0-ratified at PS v1.0. |
| `Vocabulary closure` (§3.9 — declared terms) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II + Part I + this framework's declaration sites'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Closed set of PS framework-local atoms declared at §3.9 (boundary-crossing, intake, dispatch, act, reference, cell-governance, unitary site, permitted-authority set, correlation index, geometric respect, disambiguation deferral, PerimeterBinding, per-axis Positional enums, enum aliases). *Sprint B2 Shot 2:* `orphan` + `paired-write contract` terms removed from §3.9 in lockstep with PA-A4 dissolution + EmissionPairRef removal. New terms enter additively via amendment per MA-L1 + MA-S7. L0-ratified per declared term at the version it was added (v1.0 baseline); `permitted-authority set` term reframed at Sprint B2 Shot 2 re-roll per L3.3 disposition (b) as PMA-Av2 boundary-consultation site reference (Permissions Standard owns the closure rule). |

#### §3.13.8 Typed shapes basis

| Shape | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `BoundaryArrival` (§2.1) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — input atom shape) | Input shape conforms to substrate §4 A-01 WAtom under MA-S1 (input-is-W-ATOM). Field shapes ground out at substrate atoms (AuthorityAssertion A-23, ScopeRef) or PS-local atoms (the latter grounded per their own rows below) or LM atoms (the latter grounded by reference per §2.5). |
| `BoundaryDispatchRequest` (§2.1) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — input atom shape) | Same basis as BoundaryArrival per MA-S1. |
| `BoundaryCrossingRecord` (§2.2) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — output atom shape) | Output shape conforms to substrate §4 A-01 WAtom under MA-S2 (output-is-W-ATOM). |
| `ChannelClaim` (§2.7) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Source authority + Channel classification)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local atom carrying claimed channel kind + surface identifier at intake (subject to PA-Cn1, PA-Cn2 validation; channel-authority binding consultation at Permissions Standard PMA-Av2 per L3.3 disposition (b)). Realizes Manual Part II Boundary's per-channel governance entry point at the arrival side. L0-ratified at PS v1.0. |
| `IdentityClaim` (§2.7) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Surface-form-to-reference matching)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local atom carrying surface-form identifier + optional resolution hint at intake (consumed by Identity Resolution axis). Realizes Manual Part II Boundary's surface-form-resolution entry point. L0-ratified at PS v1.0. |
| `ResolvedIdentity` (§2.7) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Surface-form-to-reference matching) + Part I — Wearer-L0 (Identity curation through utterance)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local atom carrying per-identity resolution outcome (ref + outcome enum + ambiguity-detail). Realizes the three-disposition outcome per ResolutionOutcomeKind closure (§3.13.7). L0-ratified at PS v1.0. |
| `CellGovernanceRecord` (§2.7) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Act or reference four-cell table)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local atom encoding the four-cell governance computation result (cell + governanceLevel + confirmation/audit/reversibility statuses). Direct realization of Manual Part II Boundary four-cell table. L0-ratified at PS v1.0. |
| `AuthorityEnforcementRecord` (§2.7) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Authority enforcement)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local atom encoding the authority-validation result (authorityClaimed + authorityValidated + authorityScopeMatch + validationBasis). Direct realization of Manual Part II Boundary "Authority enforcement" subsection at BCR level. L0-ratified at PS v1.0. |
| `ArrivalId` (§2.7) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — brand-typed identifier sub-component) | Brand-typed unique identifier; standard typed-shape brand pattern at substrate WAtom tier. |
| `DispatchId` (§2.7) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — brand-typed identifier sub-component) | Same basis as ArrivalId; brand-typed identifier per WAtom shape pattern. |
| `CrossingId` (§2.7) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — brand-typed identifier sub-component) | Same basis as ArrivalId; brand-typed identifier per WAtom shape pattern. |
| `EpochMs` (§2.7) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — typed-shape primitive sub-component) | Milliseconds-since-epoch primitive numeric typed-shape; standard WAtom pattern (parallels VS+Plan+RS EpochMs precedent). |
| `CorrelationRef` (§2.7 — PS-local alias of MI-owned atom) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary (Correlation — linking arrivals from one originating interaction)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | PS-local alias of the MI Standard correlation reference; PS consumes by reference at §2.6 (per A-08 cross-framework atom reference) and declares the perimeter-side correlation-index shape. Manual Part II Boundary names Correlation as Boundary-internal program concern. L0-ratified at PS v1.0. |

#### §3.13.9 Procedure steps basis

**Zero P8 instances** per §3.7 (positive-empty per substrate §8.6 + A-17 — PS Mode = structural; substrate §8.3 binds P8 to generative-only). MA-St17 quantifier ranges over declared instances; zero declared → no basis required per quantifier semantics. Grounding of the empty declaration itself is at substrate §8.6 + A-17 EmptyPrimitiveDeclaration (already declared §3.7).

#### §3.13.10 Coupling enums basis

| Coupling declaration | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `carrier = 'named' → 'living-memory' v3.3` (§1, §6.1) | `substrate-atom-ref` | `atomId: 'Carrier'` (substrate §9 declared enum: `'self' \| 'named' \| 'none'`) | Carrier value enum-member per substrate §9; PS-specific binding to `named → living-memory` because PS does not emit artifacts about its work — PS produces typed signal that rides as `SubstrateWriteInput` consumed at LM HR-LM1 receive-side per Manual Part II "Boundary types it → Mediator carries it → Store accumulates it." Version bound to LM v3.3 at this amendment per Sprint B1 Shot 3 LM cascade. Strongest grounding. |
| Custody table entries (§6.5 — PS-local atoms + cross-framework consumed atoms) | `substrate-atom-ref` | `atomId: 'A-04'` (CustodyRow) | Custody rows conform to substrate §4 A-04 CustodyRow shape per MA-C2. Strongest grounding. |

#### §3.13.11 MA-V10 part B jurisdiction coverage declaration

Per MA-V10 part B (metaframework v3.3.1 §3.2.1): when `governsRuntimeCode = true`, every source-governing axis with declared `jurisdictionClaim` must have ReferentCitations covering its claim, OR declare partial-drift per MA-V11 vacuous-pass with explicit basis prose.

PS's six own axes all govern F-identity slice runtime code at the unitary perimeter site (`src/proxy.ts`) + slice resources under `src/features/F-identity/**`. Note: PS v1.0.1 prose referenced `src/middleware.ts` as the unitary site; the actual current source path is `src/proxy.ts` — this discrepancy is surfaced as a finding in the Sprint B1 Shot 3 delivery report; jurisdictionClaim below declares the actual current path honestly.

| Axis | `jurisdictionClaim` | RC coverage at v1.1 | Partial-drift declaration |
|---|---|---|---|
| **Direction** | `['src/proxy.ts', 'src/features/F-identity/contract/perimeter-consultation.ts']` (direction enum populated at BCR construction time inside the unitary site + slice contract layer) | zero ReferentCitations declared | `applicability: 'n/a'`, `basis: "Sprint B2 source-cleanup will author ReferentCitations covering jurisdictionClaim per MA-V10 part B amendment trigger. At v1.1 PA1 + PA2 are declared at standards tier; runtime-side citations binding to direction-assignment + symmetry-closure source lines materialize in Sprint B2. Vacuous-pass at this version is honest declared drift."` |
| **Arrival Typing** | `['src/proxy.ts', 'src/features/F-identity/contract/perimeter-consultation.ts', 'src/features/F-identity/domain/**']` (disposition + cell-governance + mutation-gate + reversibility computed in the perimeter consultation + domain layer) | zero ReferentCitations declared | Same basis as Direction axis above; partial-drift declared per MA-V11. Sprint B2 closes drift. PA-T1..PA-T4 declared at standards tier; runtime-side citations binding to cell-governance computation source lines + four-cell map lookup deferred. |
| **Authority Enforcement** | `['src/proxy.ts', 'src/features/F-identity/contract/**', 'src/features/F-identity/exec/execution-check.ts', 'src/features/F-identity/exec/auth-queries.ts', 'src/features/F-identity/app/auth-workflow.ts', 'src/features/F-identity/config/allowlist.ts']` (post-Sprint-B2-Shot-2: PA-A1 + PA-A5 + PA-A6 govern the authority-validation + dispatch-validation + unitary-enforcement enforcement points across contract, exec, app, and config layers of the F-identity slice. Former PA-A2 wearer-scope-rule + PA-A3 system-scope-rule extracted to Permissions Standard v1.0 PMA-Sb2/PMA-D2+PMA-Sb3 — decision-time access scoping jurisdiction now belongs to PMS; former PA-A4 orphan-rule dissolved per art_* table drop) | zero ReferentCitations declared | Same basis pattern as above. Sprint B2 closes drift. Post-Shot-2 Authority Enforcement scope narrowed: three axioms (PA-A1, PA-A5, PA-A6) govern crossing-time authority-shape enforcement. RC authoring in Sprint B2 follow-on will produce the citation set under the narrowed jurisdiction; access-scoping citations authored by Permissions Standard against PMS jurisdictionClaim. |
| **Channel Classification** | `['src/proxy.ts', 'src/features/F-identity/contract/perimeter-consultation.ts', 'src/features/F-identity/config/oauth-config.ts (channel claim at intake + channel-preservation through HR-PS-LM1 — channel-kind assignment scope only; permitted-authority binding subset of this source path falls under shared L3.3 disposition (b) consultation with Permissions Standard PMA-Av2 jurisdiction at `src/core/types/perimeter-standard.types.ts` PermittedAuthoritySet + `src/core/constants/perimeter-standard.ts` DEFAULT_PERIMETER_BINDING)']` (post-Sprint-B2-Shot-2: PA-Cn1, PA-Cn2, PA-Cn4 govern channel claim declaration + enum-membership + channel preservation. Former PA-Cn3 channel-authority-binding extracted to Permissions Standard v1.0 PMA-Av2 — PMS owns the closure rule; PS retains the boundary-consultation atom per L3.3 disposition (b)) | zero ReferentCitations declared | Same basis pattern as above. Sprint B2 closes drift. Post-Shot-2 Channel Classification scope narrowed to three axioms (PA-Cn1, PA-Cn2, PA-Cn4); PMA-Av2 jurisdiction authored separately by Permissions Standard against PMS §3.13.11 Action Vocabulary entries (boundary-consultation atoms appear in both jurisdictionClaims — PS as consultation site, PMS as rule owner — per L3.3 disposition (b) defense-in-depth pattern). |
| **Identity Resolution** | `['src/proxy.ts', 'src/features/F-identity/domain/auth-validation.ts', 'src/features/F-identity/exec/auth-queries.ts']` (surface-form-to-Ref matching + outcome computation + geometric-respect negative-invariant enforcement + disambiguation-deferral pathway) | zero ReferentCitations declared | Same basis pattern as above. Sprint B2 closes drift. PA-IR1..PA-IR4 declared at standards tier. |
| **Correlation** | `['src/proxy.ts', 'src/features/F-identity/contract/perimeter-consultation.ts']` (correlationRef assignment at intake + correlation-index lookup at HR-PS3) | zero ReferentCitations declared | Same basis pattern as above. Sprint B2 closes drift. PA-Co1..PA-Co3 declared at standards tier. **Note:** Correlation axis basis closes Memory #17 per §3.13.1 above; partial-drift declaration here covers the source-side citation set, separate concern from the axis-derivation grounding. |

PA-I (Identity-tier unitarity assertion) governs runtime code at the unitary site itself: `jurisdictionClaim: ['src/proxy.ts']`. PA-I is an axiom (excluded from MA-St17 quantifier) but contributes to MA-V10 part B coverage; partial-drift declared with same basis pattern. Sprint B2 closes.

**Discipline:** every source-governing axis declared with explicit jurisdictionClaim against the actual current source path (`src/proxy.ts` + `src/features/F-identity/**`, not the v1.0.1 prose `src/middleware.ts` reference). No silent gap. Partial-drift declared mechanically per MA-V11. G-V10 part B at this version produces `applicability='n/a'` with declared basis on each of the six own axes + PA-I; on Sprint B2 close, basis is replaced by full RC coverage.

#### §3.13.12 AmendmentProvenance (Sprint B1 Shot 3)

```
amendmentProvenance = {
  amendmentId:          'perimeter-standard-v1-1-sprint-b1-shot-3',
  predecessorVersion:   '1.0.1',
  successorVersion:     '1.1',
  cycleId:              'sprint-b1-shot-3',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'Δ-A: added §1 governsRuntimeCode = true per MA-I8 with basis prose; §1.2 Identity-axiom-satisfaction table extended with MA-I8 row; LM carrier version swept v3.1 → v3.3 across §1, §2.5, §6.1, §6.2, §6.3, §6.5, §6.10, §6.11, §8.6 (mechanical cross-version consistency per Sprint B1 Shot 3 LM cascade; historical changelog rows at §5.9 v1.0 and §9 v1.0 preserved verbatim)',
    'Δ-B: declared AxisBasis on every MA-St17 enumerated-kind declaration at §3.13.1, §3.13.2, §3.13.4–§3.13.10 (6 axes + 24 sub-axes + 5 handoff rules + 5 lifecycle events + 1 judgment input + 8 closure rules + 14 typed shapes + 0 procedure steps + 2 coupling enums = 65 basis declarations)',
    'Δ-C: declared jurisdictionClaim on all six own axes + PA-I per MA-V10 part B with partial-drift basis at §3.13.11; honest unitary-site path src/proxy.ts (not v1.0.1 prose src/middleware.ts — finding surfaced in delivery report)',
    'Δ-D: AmendmentProvenance recorded at §3.13.12; §4.8 + §8.1 self-audit results updated (G-I8 PASS at E1, G-St17 PASS at E3 with declaration count, G-V10 part B PASS-with-partial-drift-declared at E4); §9 change log entry added; footer updated'
  ],
  discipline: 'additive per MA-L1 + MA-S7 recursive ≼ — zero axiom invariant predicates changed; zero gate predicates changed; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Apparatus declarations added. Pre-existing v1.0.1 sub-axis count discrepancy (§3.2 says 13, §3.4 enumerates 24) carried forward — not in this shot scope; surfaced as finding for forward sprint resolution.'
}
```

#### §3.13.13 AmendmentProvenance (Sprint B1 Shot 5 cleanup)

```
amendmentProvenance = {
  amendmentId:          'perimeter-standard-v1-1-sprint-b1-shot-5',
  predecessorVersion:   '1.1 (post Sprint B1 Shot 3)',
  successorVersion:     '1.1 (post Sprint B1 Shot 5 cleanup)',
  cycleId:              'sprint-b1-shot-5',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'F-B1-Audit-4 closure: §1 Identity table `adjacentFrameworks` row removed entirely (residue eliminated at standards tier alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup; the input field carried zero downstream consumers at apparatus tier, no axiom referenced it, no gate tested it, no output field populated from it; the §1 Identity row was carried forward by template-copy convention, not by GeneratedFrameworkTemplate output schema declaration). Consequential edit at §6.5 FrameworkRef custody row: perimeter-standard removed from consumers column since the §1 adjacentFrameworks site no longer exists; FrameworkRef remains consumed by all framework-aware atoms via other paths.',
    'F-B1-Audit-6 closure: §3.13.3 Axioms basis placeholder inserted reserving slot for parity with sibling-standard declarations (LIV-Standard §3.13.3 carries actual axiom-axis basis content; PS axioms grounded by own derivation per MA-St17 exclusion clause — no A-22 basis required at axiom kind, subsection documents that fact for cross-standard parity). Renumbering: §3.13.3 (handoff rules) → §3.13.4, §3.13.4 (lifecycle events) → §3.13.5, §3.13.5 (judgment inputs) → §3.13.6, §3.13.6 (closure rules) → §3.13.7, §3.13.7 (typed shapes) → §3.13.8, §3.13.8 (procedure steps) → §3.13.9, §3.13.9 (coupling enums) → §3.13.10, §3.13.10 (MA-V10 part B jurisdiction coverage) → §3.13.11, §3.13.11 (Shot 3 AmendmentProvenance) → §3.13.12. Intra-file references swept at active spec locations: §1 referentCitations basis prose §3.13.10 → §3.13.11; §3.13.8 ResolvedIdentity row closure ref §3.13.6 → §3.13.7; §3.13.12 (Shot 3 AmendmentProvenance) scope rows: Δ-B span renumbered §3.13.1, §3.13.2, §3.13.4–§3.13.10 (was §3.13.1–§3.13.9; basis declarations now span §3.13.1, §3.13.2 plus §3.13.4 through §3.13.10 skipping the §3.13.3 axioms placeholder); Δ-C basis ref §3.13.10 → §3.13.11; Δ-D AmendmentProvenance self-ref §3.13.11 → §3.13.12. §7 E4 Validity dimension audit prose §3.13.10 → §3.13.11; §8.1 self-audit E4 summary §3.13.10 → §3.13.11. §5.9 v1.1 + §9 v1.1 changelog rows preserved verbatim per historical-narrative discipline (rows describe Shot 3 work at the numbering current at that time; not active spec).',
    'Δ: §3.13.13 AmendmentProvenance row (this block) + §5.9 + §9 change log entries added; no other content changes'
  ],
  discipline: 'cleanup-only — zero new basis declarations, zero new RCs, zero new axioms / axes / sub-axes / gates / HRs / primitives / typed shapes / lifecycle events / judgment inputs / closure rules / procedure steps / coupling enums; zero version bumps at PS (stays v1.1); self-audit results unchanged (G-I8 / G-St17 / G-V10 part B outcomes preserved); F-B1-Audit-4 closes by structural dissolution at standards tier alongside MFv3 v3.3.1 apparatus-tier residue removal; F-B1-Audit-6 closes by sibling-standard-parity declaration with explicit MA-St17 exclusion rationale.'
}
```

---

## §4 Validity

### §4.1 Gate count

PS declares **20 own primary gates** (G-PS1, G-PS2, G-PS-T1..G-PS-T4, G-PS-A1, G-PS-A5, G-PS-A6, G-PS-Cn1, G-PS-Cn2, G-PS-Cn4, G-PS-IR1..G-PS-IR4, G-PS-Co1..G-PS-Co3, G-PS-I — 1:1 with PA1, PA2, PA-T1..PA-T4, PA-A1, PA-A5, PA-A6, PA-Cn1, PA-Cn2, PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA-I per G-M1). v1.1's 24 → 20 at v1.2 (G-PS-A2, G-PS-A3, G-PS-A4, G-PS-Cn3 removed in lockstep with their axioms per Sprint B2 Shot 2; count reconciled with `PERIMETER_AXIOM_GATE_IDS` const at Sprint B2 Shot 2 re-roll). Plus **87 framework-tier metaframework gates** inherited (per metaframework v3.3.1 §4.1 enumeration: 7 PG + 70 axiom gates + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when PS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG6) | 6 | substrate §11.5 (post-Sprint-B1 SG6) | run once, not per framework |
| PS-own axiom gates (G-PS*) | 20 | this §4.2 | framework-audit applies PA1..PA-I suite per MA-V1; emission-time on each `BoundaryCrossingRecord` |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 71 | metaframework §4.1 (post-Sprint-B1-Shot-2 v3.3.0) | inherited; test PS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **20 + 87 = 107** | | |

PS's own 20 gates supplement the inherited 87 — same pattern as other L3 standards.

### §4.2 PS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 20 axioms → 20 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-PS1** | PA1 | `record.direction ∈ ['intake', 'dispatch'] AND record.direction !== null` | enum-membership + cardinality |
| **G-PS2** | PA2 | `forall concern C declared in PS axiom set: (governedFor('intake', C) implies (governedFor('dispatch', C) OR scopedOutForDispatch(C, basis))) AND scopedOutForDispatch(C, basis) implies basis !== null AND basis.length >= 1`. Iterated over the six PS axes: Direction, Arrival Typing, Authority Enforcement, Channel, Identity Resolution (intake-only — scope-out for dispatch declared at §1 scopeOut: 'dispatches carry payload with already-resolved Refs, no surface-form-to-Ref work needed at dispatch'), Correlation. | structural property (axiom-coverage closure over §1 scopeOut) |
| **G-PS-T1** | PA-T1 | `record.resolvedDisposition ∈ ['act', 'reference'] AND record.resolvedDisposition !== null AND ((record.direction === 'intake' AND record.arrivalRef !== null AND record.resolvedDisposition === arrival(record.arrivalRef).dispositionClaim) OR (record.direction === 'dispatch' AND record.dispatchRef !== null AND record.resolvedDisposition === dispatch(record.dispatchRef).dispositionClaim))` | enum-membership + structural identity |
| **G-PS-T2** | PA-T2 | `let cell = computeCell(record.direction, record.resolvedDisposition); record.cellGovernance.cell === cell AND record.cellGovernance.governanceLevel === fourCellMap[cell] (where fourCellMap = {'reference-intake': 'lightweight', 'act-intake': 'confirmation-audit-reversibility', 'reference-dispatch': 'lightweight', 'act-dispatch': 'world-effect-strongest'} per Manual §IV.2)` | structural property + reference resolution to Manual §IV.2 |
| **G-PS-T3** | PA-T3 | `(record.resolvedDisposition === 'reference') implies ((record.direction === 'intake' implies NOT(emittedSubstrateWriteWithMutation(record))) AND (record.direction === 'dispatch' implies NOT(recordedSubstrateMutationAsSideEffect(record))))` | structural property (mutation-rejection predicate) |
| **G-PS-T4** | PA-T4 | `(record.cellGovernance.cell === 'act-dispatch') implies record.cellGovernance.reversibilityStatus ∈ ['reversible', 'irreversible']` | conditional cardinality + enum-membership |
| **G-PS-A1** | PA-A1 | `byteIdentical(record.authorityEnforced.authorityClaimed, inputAuthorityAssertion(record)) === true AND record.authorityEnforced.authorityValidated === true AND typeof record.authorityEnforced.validationBasis === 'string' AND record.authorityEnforced.validationBasis.length >= 1 AND validationBasisCitesGroundClass(record.authorityEnforced.validationBasis) === true` (validationBasisCitesGroundClass returns true iff the basis string contains a recognized substrate §6.3 ground-class identifier: 'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result') | reference resolution + enum-membership + cardinality |
| **G-PS-A5** | PA-A5 | `(record.direction === 'dispatch' AND record.resolvedDisposition === 'act') implies (record.authorityEnforced.authorityClaimed !== null AND record.authorityEnforced.authorityValidated === true)` | conditional reference resolution |
| **G-PS-A6** | PA-A6 | `typeof record.unitarySiteRef === 'string' AND record.unitarySiteRef.length >= 1 AND record.unitarySiteRef === LIV_INSTANCE_PERIMETER_SITE_REF` (where `LIV_INSTANCE_PERIMETER_SITE_REF` is the deploy-time-frozen identifier declared in `core/constants/perimeter-standard.ts`) | structural property + reference resolution to PA-I |
| **G-PS-Cn1** | PA-Cn1 | `typeof record.resolvedChannel === 'string' AND record.resolvedChannel.length >= 1 AND ((record.direction === 'intake' AND record.resolvedChannel === arrival(record.arrivalRef).channelClaim.kind) OR (record.direction === 'dispatch' AND record.resolvedChannel === dispatch(record.dispatchRef).channelTarget))` | cardinality + structural identity |
| **G-PS-Cn2** | PA-Cn2 | `record.resolvedChannel ∈ CHANNEL_KIND_ENUM` (CHANNEL_KIND_ENUM declared in `core/constants/perimeter-standard.ts`: ['wearer-message', 'wearer-query', 'ai-reply', 'system-trigger', 'integration-event', 'scheduled-trigger', 'internal-derivation'] + open-vocabulary admission per §S3 — gate accepts any string at this version's baseline; future amendments may tighten to declared-set-only) | enum-membership (open-vocabulary at this version) |
| **G-PS-Cn4** | PA-Cn4 | `(record.direction === 'intake') implies (the SubstrateWriteInput emitted at HR-PS-LM1 for this crossing has metadata.source.channel === record.resolvedChannel)` | structural identity + reference resolution to LM SourceRef |
| **G-PS-IR1** | PA-IR1 | `(record.direction === 'intake' AND arrival(record.arrivalRef).identityClaims.length >= 1) implies record.resolvedIdentities.length === arrival(record.arrivalRef).identityClaims.length` | cardinality + structural property |
| **G-PS-IR2** | PA-IR2 | `forall r ∈ record.resolvedIdentities: r.outcome ∈ ['bound-to-existing-Ref', 'new-Ref-created', 'ambiguous-pending-disambiguation'] AND ((r.outcome === 'bound-to-existing-Ref' implies r.ref !== null) AND (r.outcome === 'new-Ref-created' implies r.ref !== null) AND (r.outcome === 'ambiguous-pending-disambiguation' implies r.ref === null AND r.ambiguityDetail !== null AND r.ambiguityDetail.length >= 1))` | enum-membership + structural property |
| **G-PS-IR3** | PA-IR3 | `forall r ∈ record.resolvedIdentities: NOT(record contains stored cluster-membership for r.ref)` — verified by structural absence of `clusterRef`, `clusterMembers`, or any cluster-derived field on `ResolvedIdentity` shape. | structural property (negative invariant) |
| **G-PS-IR4** | PA-IR4 | `forall r ∈ record.resolvedIdentities: (r.outcome === 'ambiguous-pending-disambiguation' implies (r.ref === null AND NOT(perimeterAssignedRefHeuristically(r))))` | structural property (negative invariant) |
| **G-PS-Co1** | PA-Co1 | `typeof record.correlationRef === 'string' AND record.correlationRef.length >= 1 AND (record.correlationRef === record.crossingId OR isUpstreamMICorrelationRef(record.correlationRef))` | structural property + reference resolution to MI |
| **G-PS-Co2** | PA-Co2 | `correlationIndex.lookup(record.correlationRef) returns array containing record.crossingId AND for any other crossing r2 with r2.correlationRef === record.correlationRef AND r2.crossingId !== record.crossingId, correlationIndex.lookup(record.correlationRef) contains r2.crossingId`. Vacuous-pass for empty index (first-crossing case). | reference resolution (index query) + structural property |
| **G-PS-Co3** | PA-Co3 | `record.correlationRef stored on BoundaryCrossingRecord (§2.2) AND NOT(injectedIntoProgramPayload(record.correlationRef)) AND NOT(injectedIntoSubstrateStateChangeAsPrimaryKey(record.correlationRef))` | structural property (negative invariant) |
| **G-PS-I** | PA-I | `record.unitarySiteRef === LIV_INSTANCE_PERIMETER_SITE_REF AND for all BoundaryCrossingRecord r1, r2 within one LIV instance: r1.unitarySiteRef === r2.unitarySiteRef` (one site per instance). | structural property + cardinality (one-site-per-instance) |

**G-M1 self-check:** 20 axioms → 20 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage, post-Shot-2):** Direction has 2 gates (G-PS1, G-PS2); Arrival Typing has 4 gates (G-PS-T1..G-PS-T4); Authority Enforcement has 3 gates (G-PS-A1, G-PS-A5, G-PS-A6); Channel Classification has 3 gates (G-PS-Cn1, G-PS-Cn2, G-PS-Cn4); Identity Resolution has 4 gates (G-PS-IR1..G-PS-IR4); Correlation has 3 gates (G-PS-Co1..G-PS-Co3); Identity-tier has 1 gate (G-PS-I). Every PS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs PS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I8):** tests PS's §1 Identity conformance to MA-I1..MA-I8 (Sprint B1 Shot 2 added MA-I8/G-I8 — PS declares `governsRuntimeCode: true` per §1; G-I8 PASS at v1.1).
- **E2 Schema (PG2 + G-S1..G-S8):** tests PS's §2 Schema conformance to MA-S1..MA-S8 (cycle-2 G-S8 ReferentCitation declaration shape conformance — PS declares `referentCitations: []` per §1; G-S8 vacuous-pass).
- **E3 Structure (PG3 + G-St1..G-St17):** tests PS's §3 Structure conformance to MA-St1..MA-St17 (Sprint B1 Shot 2 added MA-St17/G-St17 — content-basis predicate over L2 declaration kinds; PS §3.13 declares basis per enumerated-kind declaration; G-St17 PASS at v1.1).
- **E4 Validity (PG4 + G-V1..G-V11):** tests PS's §4 Validity conformance to MA-V1..MA-V11 (cycle-2 G-V10 spec↔referent + cycle-1 G-V11 applicability-basis vacuous-pass per zero referentCitations at part A; Sprint B1 Shot 2 added MA-V10 part B jurisdiction-coverage — PS §3.13.11 declares jurisdictionClaim on all six own axes + PA-I with partial-drift per MA-V11; G-V10 part B PASS-with-partial-drift-declared at v1.1).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests PS's §5 Lifecycle conformance to MA-L1..MA-L11 (cycle-2 G-L11 audit-run snapshot stamping vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests PS's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests PS's §7 Judgment conformance to MA-J1..MA-J5.
- **E8 Universal/Meta (G-U1..G-U5 + G-M1..G-M4 + G-G13):** tests PS's universal-axis cross-checks + meta-gates + MA-G13 four-property classification.

**Disambiguation note on gate execution scope:**
The 87 inherited gates test PS's **framework declaration conformance** (does PS's §1–§7 structure match metaframework's axioms?). The 22 G-PS* gates test **individual BoundaryCrossingRecord instance conformance** (does a given crossing satisfy PA1..PA-I?). Different scopes, different execution sites — the 87 run at framework-audit time against this file; the 22 run at crossing-time on each `BoundaryCrossingRecord` produced by F-identity slice runtime.

### §4.4 Dimension–gate mapping (per MA-V5)

Framework-audit X1–X10 dimensions cover PS's validity surfaces:

| Dimension | PS gates consuming |
|---|---|
| X1 (Temporal / lifecycle self-consistency) | E1 bundle + §5 Lifecycle |
| X2 (Determinism / reproducibility) | E2 + E7 (P7=1 — J-perimeter-observation; P8=0 empty-declared); §3.6 axiom mechanical-criterion ground per substrate §6.3 |
| X3 (Observability / introspection) | E6 bundle (HRs), G-C5 (captureShape per §6.3) |
| X4 (Negative space / scopeOut) | §1 scopeOut (10 entries); audited by E2 schema check |
| X5 (Scale / compositional behavior) | §5.7 scale bounds declared |
| X6 (Operator / human interface) | §6.8 OperatorInterface declaration |
| X7 (Lifecycle) | E5 bundle |
| X8 (Genesis) | E1 (MA-I5); §1.1 GenesisDeclaration populated |
| X9 (Integration point) | E6 coupling gates + HR-PS-LM1 to LM v3.3 (carrier emission) + HR-PS-AS1 to AS v2.2 (program-emission validation) |
| X10 (Stage-declaration extended predicate) | §3.7 empty-P8 declaration + its basis traversal per substrate §10.2 PR4/PR5 vacuous |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 71 inherited (70 MA-axis-bound + G-G13) + 22 PS-own (G-PS*) = 93.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to PS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 109 framework-tier gates (87 inherited + 22 PS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0.1-confirmation (§5.3). Runtime emission of `BoundaryCrossingRecord` instances — and the gate-invocation hook that runs G-PS1..G-PS-I against each — is the **Sprint 9 wire-in scope**. At v1.0.1 the standard declares the rule set; at Sprint 9 the runtime emission machinery wires alongside the substrate-write callers + thread-query callers + F-router registration + wearer-authority program. First-run logging via standard amendment-propagation flow (AP1–AP7) per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11). PS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

**Sprint 9 wire-in scope (consumption surfaces):** the constants declared at `core/constants/perimeter-standard.ts` — `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP`, the gate-ID and axiom-ID enums — are declared-but-unconsumed at v1.0.1. They wire into runtime consumption at Sprint 9 alongside the `BoundaryCrossingRecord`-emission scaffold. No stub imports added at the unitary site pre-Sprint-9; the constants stay declared at this delivery and correctly described as awaiting Sprint 9 consumption.

**Sprint 9 promotion of vacuous-pass entries:**

| Gate | Vacuous-pass basis at v1.0.1 | Promotion path |
|---|---|---|
| G-PS-Cn4 (channel preservation through HR-PS-LM1) | No `BoundaryCrossingRecord` instances exist — channel-preservation invariant universally quantified over empty crossing set | Sprint 9 wire-in produces first `BoundaryCrossingRecord`; gate transitions to non-vacuous evaluation as crossings are emitted and channel value is carried into LM `SourceRef.channel` |
| G-PS-Co2 (correlation membership multi-crossing closure) | Single-crossing closure pre-multi-crossing observation — universally quantified over empty multi-crossing set | First multi-crossing observation post-Sprint-9 promotes to non-vacuous |
| G-PS1..G-PS-I (PS-own gates over `BoundaryCrossingRecord`) | No `BoundaryCrossingRecord` instances exist — universally quantified over empty crossing set | Sprint 9 first-runtime-crossing produces the first record; G-PS1..G-PS-I evaluate against it |

*Sprint B2 Shot 2 amendment: G-PS-A4 + G-PS-Cn3 vacuous-pass rows removed in lockstep with axiom-tier extraction/dissolution (PA-A4 dissolved entirely per 2b; PA-Cn3 extracted to Permissions Standard PMA-Av2 per 2a + L3.3 disposition (b)).*

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 first ratification at Structure-Tightening Sprint Shot 2 close. v1.0.1 amendment at audit-cycle-A close (this delivery — predecessor: v1.0; additive prose realignment per AxR3 + MA-L1, no invariant condition changes). Future amendments additive per MA-L1.

### §5.2 Amendment trigger

Gap-driven or L0-directed. Amendments to PS — adding/removing axioms, rebinding axes, changing channel enum — require:
- Identification of triggering gap (audit finding, drift in F-identity slice runtime, new channel kind requiring binding).
- Generation cycle through MFv3 generation procedure if structural amendment (axis/axiom changes); patch-level cycle for hygiene-only amendments.
- L0 confirmation gate per Playbook §1.2 + §5.3.

### §5.3 Confirmation gate

L0 confirmation required at:
- v1.0 ratification (initial delivery).
- v1.0.1 ratification (this delivery — audit-driven prose realignment per AxR3 invariance discipline; no mechanical predicates touched).
- Each subsequent version transition.
- First-run logging acknowledgment (Sprint 9 wire-in: first runtime crossing post-emission-scaffold deploy).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

None at this version. J-perimeter-observation (§7.1) is the sole PS-local J-input.

### §5.6 Failure modes

| Failure mode | Trigger | Resolution path |
|---|---|---|
| Distributed perimeter detected | G-PS-I fails on multiple `unitarySiteRef` values within one LIV instance window | F-005 closure pattern: identify distributed sites; re-route through unitary site; remove distributed enforcement |
| Ambiguous identity resolution unresolved | `r.outcome === 'ambiguous-pending-disambiguation'` persisting > deploy-defined SLA | Surface to wearer-disambiguation-program (Sprint 9 wire-in); default disposition is wait-for-wearer-input per PA-IR4 |
| Cluster pre-resolution attempted | G-PS-IR3 fails (structural absence violated) | Programmatic violation — implementation defect; rollback to PS-conformant resolution code path |
| Cross-cutting correlation promotion | G-PS-Co3 fails (correlation injected into program payload or LM content) | Programmatic violation — implementation defect; rollback to perimeter-only correlation index pattern |

### §5.7 Scale bounds

Declared at v1.0 (carried forward at v1.0.1 with no shape change):
- Crossings per LIV instance: bounded by F-identity middleware throughput × deployment lifetime; PS adds O(1) per crossing for axiom evaluation (gate set is fixed-size 22; channel and authority lookups are constant-time deterministic); empirical bounds established at Sprint 9 wire-in load test.
- Correlation index size: bounded by active-correlation lifetime × crossings-per-correlation; index expiry policy declared at PerimeterBinding.
- ResolvedIdentity per arrival: bounded by `arrival.identityClaims.length` (per-arrival, not aggregate).

PS does not declare aggregate-scale bounds beyond per-crossing — those depend on deployment configuration, not framework structure.

### §5.8 Atomicity declarations

Per substrate §13.4:
- One `BoundaryCrossingRecord` is produced atomically per crossing — record creation and gate evaluation commit together; partial records do not persist.
- Intake-direction crossings emit one paired `SubstrateWriteInput` to LM at HR-PS-LM1; the LM atomic commit guarantee (LMA4) covers the substrate-side atomicity.
- Dispatch-direction crossings emit `SubstrateWriteInput` to LM at HR-PS-LM1 atomically per LMA4 (substrate is the single store post-Sprint-B1; pre-Sprint-B2-Shot-2 paired-write contract to artifact-store dissolved with PA-A4 — art_* tables dropped at Sprint B1 final shot 3 means the contract was vacuously satisfied).

### §5.9 Version history

| Version | Cycle | Scope of change | Authority |
|---|---|---|---|
| v1.0 | Structure-Tightening Sprint Shot 2 (2026-05-06) | Initial PS declaration. Six P1 axes (Direction, Arrival Typing, Authority Enforcement, Channel Classification, Identity Resolution, Correlation) + Identity-tier PA-I unitarity assertion. 22 axioms (PA1, PA2, PA-T1..PA-T4, PA-A1..PA-A6, PA-Cn1..PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA-I). 22 primary gates 1:1. Carrier `named` → `living-memory` v3.1. HR-PS1..HR-PS4 declared. F-007 closure (PA-T2 cell-governance), F-009 governance closure (PA-A2 + PA-A3 + PA-A4 substrate-write + orphan rules), F-005 framing rule (PA-A6 + PA-I unitary-site). Vacuous-pass per substrate §6.3 + MA-V11: G-V10/G-S8/G-L11 (zero `referentCitations`); G-PS-A4 (empty paired-write registry pre-Sprint-9 wire-in); G-PS-Cn3 (PerimeterBinding default pre-Sprint-9 wire-in). | L0 (pending confirmation) |
| v1.0.1 | Structure-Tightening Sprint audit-cycle-A close (2026-05-06) | Prose-only realignment per audit Findings A1, B1+C2, B2, B3+C1, side-findings C-α/β/γ/δ. **A1:** stripped transient cycle markers ("Sprint 6 Shot 1/2/3" embedments) from Class A/B/C/G/H sites — axiom prose (PA-A4, PA-A6, PA-I; leaf-PA-A6, leaf-PA-I), gate prose (G-PS-A6, G-PS-Cn3), §1 Own discipline field, Vocabulary `unitary site` entry, §3.1/§3.2/§3.3 axes derivation prose, §3.5 leaf prose, §5.6 failure-mode remediation pattern, §6.5 Custody table CrossingId, §6.11 cross-framework calibration, §8.1 self-audit prose, §10 D4 row. Preserved verbatim at Class D/E/F sites — GenesisDeclaration `generationCycle` field, §6.6 Provenance `cycleId` field, §8.3 last audit event `eventTimestamp`, §10 D-table heading, §9 changelog v1.0 row. **B1+C2:** §4.8 first-run + §8.1 self-audit + middleware.ts header comment block all state BCR-emission scaffold wires at Sprint 9 wire-in alongside substrate-write callers, thread-query callers, F-router registration, wearer-authority program; first runtime crossing emerges at Sprint 9 first-runtime-crossing event, not at Shot 3 src deploy. **B2:** §4.8 promotion path declares `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP` as declared-but-unconsumed at this version; consumption surfaces wire at Sprint 9. **B3+C1:** §3.6 PA-Cn3 row, §4.8 promotion path, G-PS-Cn3 vacuous-pass basis, §5.9 v1.0 row narrative, audit-guide §Findings table — all state PerimeterBinding instance is supplied at Sprint 9 wire-in. **C-δ:** added G-PS-Cn4 (channel preservation) to §4.8 explicit vacuous-pass enumeration. **C-α/β/γ:** sprint-spec language reconciliation, terminology hygiene, no-action items respectively (resolved at sprint-package level, not in this standard's prose). **Discipline:** prose-only amendment per AxR3 + MA-L1 — zero axiom invariant conditions changed; zero gate predicates changed; zero schema shapes changed; zero handoff rules changed; primitive instance counts unchanged. Mechanical predicates at v1.0 baseline. Shot 3 src tree carries forward unchanged (mechanical predicates of `middleware.ts` body byte-identical to v1.0 delivery; only header comment block realigned). Constants file (`perimeter-standard.ts`) and types file (`perimeter-standard.types.ts`) byte-identical to v1.0. Single bundle deploy per Playbook §1.22. | L0 (pending confirmation) |
| v1.1 | Sprint B1 Shot 3 (2026-05-13) | MA-St17 / MA-I8 / MA-V10 part B amendment apparatus applied per MFv3 v3.3.0 Shot 2 cascade. **Δ-A:** §1 Identity table extended with `governsRuntimeCode: true` row + basis prose (PS governs F-identity slice runtime code at unitary site `src/proxy.ts` + slice resources under `src/features/F-identity/**`); §1.2 Identity-axiom-satisfaction table extended with MA-I8 row. Cross-version sweep: LM carrier reference v3.1 → v3.3 at §1 carrier/consumedBy/adjacentFrameworks, §2.2 carrier note, §2.5 consumed types table heading, §6.1 carrier justification, §6.2 HR table, §6.3 captureShape, §6.5 custody table, §6.10 atom-flow table, §6.11 carrier relation + boundary note, §8.6 cross-framework consistency. Historical changelog rows (§5.9 v1.0, §9 v1.0) preserved verbatim per L0 discipline. Metaframework version reference v3.2.7 → v3.3.0 at §4.1 + §10 D5. Inherited gate count 85 → 87 at §4.1 + §4.4 + §4.7 + §8.1 + §10 D5 (MFv3 added G-St17 + G-I8 framework-tier gates Sprint B1 Shot 2); total framework-tier 107 → 109. **Δ-B:** §3.13 AxisBasis declarations subsection added (additive per MA-S7 recursive ≼) holding basis declarations for every MA-St17 enumerated-kind declaration at PS — §3.13.1 axes (6: all l0-ratified-ref to Manual v13.0 Part II Boundary loci; **Correlation axis closes Memory #17** via natural-derivation citation to "Boundary mechanics — Correlation" subsection), §3.13.2 sub-axes (24 per §3.4 enumeration; pre-existing §3.2 count of 13 carried forward as finding), §3.13.3 handoff rules (5: mix substrate-atom-ref to A-03 HandoffContract + l0-ratified-ref for HR-PS-LM1 to Manual Part II Memory Loop flow), §3.13.4 lifecycle events (5: mix substrate-atom-ref to A-16/A-21/LifecycleState + l0-ratified-ref for confirmation gate to Manual Part IV Governance Loop), §3.13.5 judgment inputs (1: J-perimeter-observation → l0-ratified-ref to Manual Part II Boundary transform + Part IV aggregate-signal), §3.13.6 closure rules (8: mix substrate-atom-ref to A-08 + l0-ratified-ref to Manual Part II + Part I loci), §3.13.7 typed shapes (14: mix substrate-atom-ref to A-01 WAtom + l0-ratified-ref to Manual loci for PS-local synthesis atoms), §3.13.8 procedure steps (0 declared; quantifier vacuously satisfied), §3.13.9 coupling enums (2: substrate-atom-ref to Carrier + A-04 CustodyRow). Total: 65 basis declarations added. **Δ-C:** §3.13.10 MA-V10 part B jurisdiction coverage table declared — all six own axes + PA-I carry jurisdictionClaim against actual current source paths (`src/proxy.ts` + `src/features/F-identity/**`; v1.0.1 prose `src/middleware.ts` reference reconciled in jurisdictionClaim — surfaced as finding in Sprint B1 Shot 3 delivery report). Zero ReferentCitations at v1.1; partial-drift declared per MA-V11 vacuous-pass with explicit basis prose targeting Sprint B2 close. **Δ-D:** AmendmentProvenance recorded at §3.13.11; §4.4 framework-tier gate-bundle list updated (E1 G-I1..G-I8, E3 G-St1..G-St17, E4 G-V10 part B); §8.1 aggregate self-audit updated (G-I8 PASS, G-St17 PASS with 65-declaration count, G-V10 part B PASS-with-partial-drift-declared); this §5.9 row + §9 row added. Version transition v1.0.1 → v1.1 per MA-L1 additive-only. Manual citations pin `manualVersion: '13.0'` (citations map by Part + named subsection content per v13.0 reorganization away from numeric §I/§II/§IV refs). Zero axiom invariant predicates changed; zero gate predicates changed; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Apparatus declarations added. | L0 (Sprint B1 Shot 3) |
| v1.1 (Shot 5 cleanup) | Sprint B1 Shot 5 (2026-05-13) | Sprint B1 close audit findings closed at PS. **F-B1-Audit-4 closure** (residue removal at standards tier): §1 Identity table `adjacentFrameworks` row removed entirely — residue eliminated at standards tier alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup (the input field carried zero downstream consumers at apparatus tier; no axiom referenced it, no gate tested it, no output field populated from it; the §1 Identity row was carried forward by template-copy convention, not by GeneratedFrameworkTemplate output schema declaration). Consequential edit at §6.5 FrameworkRef custody row: perimeter-standard removed from consumers column since the §1 adjacentFrameworks site no longer exists. **F-B1-Audit-6 closure** (sibling-standard-parity placeholder): §3.13.3 Axioms basis placeholder inserted reserving slot for parity with LIV-Standard's §3.13.3 axiom-axis-binding-rationale subsection — PS axioms grounded by own derivation per MA-St17 exclusion clause; no A-22 basis required at axiom kind; subsection documents that fact explicitly for cross-standard parity. Renumbering: §3.13.3..§3.13.11 each shifted +1 → §3.13.4..§3.13.12 (full map in Shot 5 delivery report). Intra-file pointer references swept at active spec locations: §1 referentCitations basis prose §3.13.10 → §3.13.11; §3.13.8 ResolvedIdentity row closure ref §3.13.6 → §3.13.7; §3.13.12 (Shot 3 AmendmentProvenance) scope rows: Δ-B span renumbered §3.13.1, §3.13.2, §3.13.4–§3.13.10 (basis declarations now span §3.13.1, §3.13.2 plus §3.13.4 through §3.13.10 skipping the §3.13.3 axioms placeholder); Δ-C basis ref §3.13.10 → §3.13.11; Δ-D AmendmentProvenance self-ref §3.13.11 → §3.13.12. §7 E4 Validity dimension audit prose §3.13.10 → §3.13.11; §8.1 self-audit E4 summary §3.13.10 → §3.13.11. **Historical narrative preserved verbatim** at §5.9 v1.1 row + §9 v1.1 row (this row's predecessor and corresponding §9 row): both describe Shot 3 work at the numbering current at Shot 3 close — preserved per the same "Historical changelog rows preserved verbatim per L0 discipline" rule the v1.1 Shot 3 row applied to §5.9 v1.0 and §9 v1.0. **Δ:** §3.13.13 AmendmentProvenance row added recording Shot 5 cleanup with L0 authorityClaim; this §5.9 row added; §9 v1.1 Shot 5 cleanup row added. **No version bump** (PS stays v1.1 — additions are corrective patches to existing v1.1 content per brief discipline). **Self-audit results unchanged** — G-I8 / G-St17 / G-V10 part B outcomes preserved. F-B1-Audit-4 closes by structural dissolution: removal at apparatus + standards tiers eliminates both the symptom (asymmetric carriage across sibling standards) and the cause (non-load-bearing input field). F-B1-Audit-6 closes by explicit sibling-standard-parity declaration with MA-St17 exclusion rationale. | L0 (Sprint B1 Shot 5) |
| v1.2 | Sprint B2 Shot 2 (2026-05-15) | Access-scoping axiom extraction + paired-write dissolution per Sprint B2 Shot 2 brief. **Δ-A (2a — extraction to Permissions Standard v1.0):** PA-A2 (wearer-scope-rule) extracted → Permissions Standard PMA-Sb2 (per-user-scope subject match); PA-A3 (system-scope-rule) extracted → subsumed under Permissions Standard PMA-D2 (deny-reason) + PMA-Sb3 (role-resolution null-handling); PA-Cn3 (channel-authority-binding) extracted → Permissions Standard PMA-Av2 (vocabulary closure). Sub-axes `Authority Enforcement/wearer-scope`, `/system-scope`, `Channel Classification/authority-binding` removed in lockstep. Gates G-PS-A2, G-PS-A3, G-PS-Cn3 removed. **Δ-B (2b — paired-write dissolution):** PA-A4 (orphan-rule) dissolved entirely. Sub-axis `Authority Enforcement/orphan-rule` removed; leaf `leaf-PA-A4-orphan-rule` removed; gate G-PS-A4 removed. Source-side: `EmissionPairRef` atom dissolved entirely (no replacement field — substrate is the single store post-Sprint-B1; substrate-write reference is captured at LM HR-PS-LM1 captureShape, not on BoundaryCrossingRecord); `BoundaryCrossingRecord.emissionPair` field removed. Rationale: paired-write contract was vacuously satisfied per Sprint B1 final shot 3 art_* table drop — one side of the pair no longer exists. **Counts:** P4 axioms 22 → 18; P5 gates 22 → 18; P3 leaves 21 → 17 (+ PA-I = 18 leaves total); P2 sub-axes 17 → 13 (reconciles pre-existing §3.2 vs §3.4 discrepancy). P1 axes unchanged at 6 (axiom-level removal does not collapse axes). **Cross-framework input row sweep:** Artifact Standard v2.2 → v2.3 reference at §1 header; new `Permissions Standard v1.0` cross-framework input row added at §1 header. **scopeOut sweep:** F-009 wire-in entry removed (PA-A4 dissolved); two new entries added (access-scoping owned by Permissions Standard; paired-write contract dissolved per Sprint B2 Shot 2b). **§3 sweep:** §3.2 primitive count rows updated; §3.3 axis-table concern columns rewritten for Authority Enforcement + Channel Classification (post-extraction scope); §3.3 MECE verification + derivation note updated. §3.4 sub-axis tables updated (Authority Enforcement: 6 → 3; Channel Classification: 4 → 3). §3.5 leaf table: 4 leaves removed. §3.6 axiom table: 4 rows removed; amendment notes block added explaining each relocation/dissolution; AxR self-checks updated. **§4 sweep:** §4.1 gate count 22 → 18, total framework-tier 109 → 105; §4.2 gate table: 4 rows removed; G-M1 / MA-V1 / MA-V2 self-checks updated. **§5.9 + §9:** v1.2 rows added (this row + corresponding §9 row). **Discipline:** removal is additive per MA-L1 (the *removal-is-additive* clause invoked — removal of vacuously-satisfied or relocated axioms does not change behavior for prior-passing artifacts; access-scoping concerns now consulted via Permissions Standard v1.0 by any caller needing access decisions). Cross-check satisfied: no axiom appears in both PS v1.2 and Permissions Standard v1.0. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending-Sprint-B2-Shot-2-ratification'} | L0 (Sprint B2 Shot 2) |
| v1.2 (Shot 2 re-roll) | Sprint B2 Shot 2 re-roll (2026-05-15) | Auditor mechanical audit on initial Shot 2 deliverable surfaced 8 hard-violation orphan-ref sites + 2 soft findings. Re-roll closes all 8 hard violations: **H1** §2.2 schema — `emissionPair` field removed; L149 comment `+ PA-Cn3` stripped; L155 comment `PA-A2, PA-A3` stripped (PA-A1 only retained). **H2** §5.6 — two failure-mode rows removed (Orphan emission G-PS-A4; Channel-authority cross-binding G-PS-Cn3). **H3** §6.5 — EmissionPairRef Custody row removed. **H4** §6.11 — emissionPair stripped from carrier-relation prose. **H5** §7 — orphanCount field removed from J-perimeter-observation shape. **H6** §8.6 — AS v2.2 → v2.3 row; Metaframework v3.2.7 → v3.3.1 row; emissionPair calibration prose replaced. **H7** types file orphan refs: L387 docstring axiom enumeration sweep; L429 Channel axis comment sweep; PermittedAuthoritySet block (L456–476) restated per L3.3 disposition (b) as PMA-Av2 boundary-consultation atom. **H8** constants file: L40, L312, L315 G-PS-Cn3 refs restated as PMA-Av2 boundary-consultation per L3.3 (b). **H9** artifact-gates.ts header docstring: ArA1–ArA8 → ArA1–ArA7; G-Ar8 block removed. Soft finding **S1** (doc-vs-src P4 count drift) absorbed: P3/P4/P5 doc counts 18 → 20 to match `PERIMETER_AXIOM_IDS`/`PERIMETER_AXIOM_GATE_IDS` const array lengths (the v1.1 baseline had carried wrong text count 22 against actual 24; v1.2 propagated the offset as 18 vs actual 20; re-roll corrects). Also corrects §3.6 axiom-set intro "17 axis-bound + PA-I = 18" → "19 axis-bound + PA-I = 20" and §1 governsRuntimeCode prose enumeration. **Additionally §2.7 EmissionPairRef shape block removed (orphan after H1).** **Additionally §3.13.8 EmissionPairRef typed-shape basis row removed (orphan after H1).** **Additionally §4.8 vacuous-pass rows for G-PS-A4 + G-PS-Cn3 removed (orphan after H2).** **L3.3 disposition (b) ratified:** PermittedAuthoritySet, permittedAuthorityByChannel, DEFAULT_PERIMETER_BINDING infrastructure retained as boundary-consultation site for Permissions Standard PMA-Av2 (vocabulary closure on Action Vocabulary axis); PMS jurisdictionClaim extended to cover these source paths in companion PMS v1.0 → v1.0.1 amendment. Same axiom, two consultation sites — defense-in-depth preserved at boundary while PMS owns the single closure rule. Soft finding **S2** (Manual sweep gaps at L168/L200/L293/L413) out of brief scope — flagged for Manual SPEC v13.2 candidate amendment. **Discipline:** patch-level within-version reconciliation; PS stays v1.2 (re-roll narrative recorded; baseline content unchanged in spirit); no axiom invariant predicates changed; no gate predicates changed; no schema shapes changed beyond H1 (which was the original Shot 2 intent and represents orphan-cleanup of a field that should already have been gone in the initial roll). authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll'} | L0 (Sprint B2 Shot 2 re-roll) |
| v1.2 (Shot 2 re-roll-2) | Sprint B2 Shot 2 re-roll-2 (2026-05-16) | Auditor review of re-roll-1 surfaced 6 new sweep-miss findings in §3.13 AxisBasis sections + Manual + carried-forward R1. Re-roll-2 closes all 7 findings: **R3 (Manual sweep gap):** `frameworks/manual/liv-manual.md` included in tar (was omitted from re-roll-1 despite report claim of Gate-5 PASS); Manual Operations table L403 F-permissions row reflects Permissions Standard v1.0.1 per companion PMS bump. **R4 (§3.13.2 sub-axes basis):** 4 stale rows removed (`Authority Enforcement/wearer-scope`, `Authority Enforcement/system-scope`, `Authority Enforcement/orphan-rule`, `Channel Classification/authority-binding`); intro count breakdown reconciled from "24 sub-axis rows (3+4+6+4+4+3)" to "20 sub-axis rows (3+4+3+3+4+3)" with post-Shot-2 annotation. **R5 (§3.13.7 Vocabulary closure basis):** `orphan, paired-write contract` terms removed from closed-set prose enumeration in lockstep with §3.9 Vocabulary sweep at re-roll-1; `permitted-authority set` annotated per L3.3 (b). **R6 (§3.13.11 Authority Enforcement jurisdictionClaim):** prose "PA-A1..PA-A6 govern... + scope-rule + orphan-rule + dispatch-validation + unitary-enforcement" narrowed to "PA-A1 + PA-A5 + PA-A6 govern... authority-validation + dispatch-validation + unitary-enforcement"; former axiom annotations added explaining PMS jurisdiction handoff. **R7 (§3.13.11 Channel Classification jurisdictionClaim):** prose "PA-Cn1..PA-Cn4" narrowed to "PA-Cn1, PA-Cn2, PA-Cn4"; oauth-config.ts path annotated as channel-kind assignment scope only with permitted-authority binding subset annotated under L3.3 (b) shared consultation with PMS PMA-Av2 jurisdiction. **R8 (§3.2 P2 count):** 13 → 20 reconciled with actual §3.4 enumeration (auditor confirmed §3.4 already at 20 rows post-Shot-2; pre-roll text said 13 carrying forward a PS v1.0.1 baseline §3.2-vs-§3.4 mis-count). §3.13.2 intro count breakdown reconciled in lockstep. **R1 (§3.13.6 J-perimeter-observation basis prose):** `orphan count` diagnostic field removed from enumeration in lockstep with §7 J-input shape orphanCount removal at re-roll-1 H5. **Additional sweeps caught during R3–R8 verification:** §5.8 Atomicity declarations dispatch-direction paired-write contract sentence reworded to reflect substrate-as-single-store post-Sprint-B1; §C.6 atom-consumer table UserId row "wearer-scope arrivals carry UserId in scope" reframed to "per-user-scope arrivals carry UserId in ResolvedScope for downstream PMS PMA-Sb2 consultation per L3.3 (b)". **Discipline:** patch-level within-version reconciliation; PS stays v1.2 (re-roll-2 supersedes re-roll-1; baseline content unchanged in spirit); no axiom invariant predicates changed; no gate predicates changed; no schema shapes changed; no closure rules changed; primitive instance counts unchanged (P2 sub-axis count correction is text reconciliation only — §3.4 enumeration was already at 20). Pattern correction: §3.13 sweep discipline now applies to every §3.13 subsection whenever any active declaration (axis, sub-axis, axiom, gate, vocabulary term) changes. Build verified zero errors on fresh baseline + Shot 1 + Shot 2 + re-roll-2 overlay. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll-2'} | L0 (Sprint B2 Shot 2 re-roll-2) |

---

## §6 Coupling

### §6.1 Carrier

Perimeter Standard carrier = `named` → `living-memory` v3.3. PS declares typed-signal content (`BoundaryCrossingRecord`) plus the LM-shaped substrate-write payload (`SubstrateWriteInput`) for intake-direction crossings; does not emit artifact-shaped carriers. Emission call pattern: F-identity slice middleware (host of unitary perimeter site) constructs `BoundaryCrossingRecord` per crossing, runs G-PS1..G-PS-I evaluation, and for intake-direction crossings invokes LM substrate-write surface with `SubstrateWriteInput` constructed from the crossing's content per HR-PS-LM1. See §6.11 carrier relation.

**Cross-framework calibration:** Carrier version bound to Living Memory v3.3. This is structurally distinct from VS/RS/Plan AS-carriered pattern: PS does not produce artifacts about its work — PS produces the typed signal itself, which lands as substrate state-change via LM. Carrier choice ratified at D2.

### §6.2 Handoff rules

Four framework-local HR instances. All PS-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-PS4 where `diagnosticSignificance = false` → captured via HR-PS-LM1 + LM HR-LM1 receive-side LM write).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-PS1** | program/route → perimeter-standard (intake claim receipt) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-PS2** | program/route → perimeter-standard (dispatch request submission) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-PS3** | perimeter-standard → consumer (correlation-index query, ResolvedIdentity return, dispatch governance return) | `['named']` (PS's own carrier = named) | `true` | declared §6.3 |
| **HR-PS-LM1** | perimeter-standard → living-memory v3.3 (intake substrate-write emission) | `['named']` (PS's carrier = named, mapped to LM SubstrateWriteInput contract per LM HR-LM1 receive-side) | `true` | declared §6.3 |
| **HR-PS4** | perimeter-standard → consumer (observability / replay / audit / downstream BoundaryCrossingRecord readers) | `['named']` | `false` | n/a (consumer reads via LM thread query against substrate state-changes; capture via HR-PS-LM1 + LM HR-LM1) |

**Inherited HRs referencing PS:**

| HR | Owning declaration | PS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → PS type consumption; PS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; PS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records PS's framework declaration per provenance contract (see §6.6) |
| HR-LM1 | living-memory v3.3 §6.2 | perimeter/intake → LM write surface; PS is the named caller honoring HR-LM1 receive-side contract via HR-PS-LM1 |

Per substrate §1.3 SI-03: these HRs are referenced, not redeclared, by PS.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-PS1 — program/route → PS (intake claim receipt):**
```
captureShape = {
  capturedFields: ['arrival.arrivalId', 'arrival.channelClaim.kind', 'arrival.authorityClaim.level', 'arrival.authorityClaim.actor', 'arrival.scopeClaim', 'arrival.dispositionClaim', 'arrival.correlationClaim', 'arrival.identityClaims.length', 'arrival.receivedAt', 'route'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; intake claims indexed by arrivalId'
}
```

**HR-PS2 — program/route → PS (dispatch request submission):**
```
captureShape = {
  capturedFields: ['dispatch.dispatchId', 'dispatch.source.programId', 'dispatch.source.programVersion', 'dispatch.channelTarget', 'dispatch.dispositionClaim', 'dispatch.scopeContext', 'dispatch.authorityContext', 'dispatch.correlationRef', 'dispatch.reversibility', 'dispatch.requestedAt'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; dispatch requests indexed by dispatchId'
}
```

**HR-PS3 — PS → consumer (post-crossing return):**
```
captureShape = {
  capturedFields: ['record.crossingId', 'record.direction', 'record.resolvedDisposition', 'record.cellGovernance.cell', 'record.cellGovernance.governanceLevel', 'record.resolvedChannel', 'record.resolvedAuthority.level', 'record.resolvedAuthority.actor', 'record.correlationRef', 'record.unitarySiteRef', 'record.crossedAt', 'gateResults: G-PS1..G-PS-I'],
  captureTarget: 'audit-trail',
  queryInterface: 'framework-audit §8.3 AuditRunRecord query path; crossings indexed by (crossingId, correlationRef, unitarySiteRef)'
}
```

**HR-PS-LM1 — PS → Living Memory v3.3 (substrate-write emission for intake-direction crossings):**
```
captureShape = {
  capturedFields: ['record.crossingId', 'record.arrivalRef', 'substrateWriteInput.identities.length', 'substrateWriteInput.relations.length', 'substrateWriteInput.metadata.source.channel', 'substrateWriteInput.metadata.source.scope', 'substrateWriteInput.scope', 'lmStateChangeRecordId (returned by LM SW3 commit)', 'record.crossedAt'],
  captureTarget: 'registry',
  queryInterface: 'LM thread query against state_change rows; crossings indexed by SourceRef.channel + scope + position; registry §4.2 readByProvenance for crossing-to-state-change mapping'
}
```

**HR-PS4:** no captureShape declared (`diagnosticSignificance: false`); receipt-only contract; diagnostic data captured at HR-PS3 invocation and via HR-PS-LM1 LM write.

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'named'` with bound framework ref `living-memory` v3.3.
- **MA-C2** (custody per atom): §6.5 enumerates every PS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-PS1..HR-PS4 + HR-PS-LM1 send/receive shapes matched by construction; HR-PS-LM1 captureShape contract symmetric with LM HR-LM1 receive-side.
- **MA-C4** (provenance per output field): §2.2 every `BoundaryCrossingRecord` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'named'` → output rides inside named carrier's atom per MA-S2; §2.2 `BoundaryCrossingRecord` (intake direction) translates to `SubstrateWriteInput` consumed at LM HR-LM1.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; LM atoms referenced at §2.5 are not re-owned (custody remains with living-memory); substrate / primitives.ts / metaframework atoms referenced at §2.3, §2.4, §2.6 not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `NodeId` | primitives.ts | core/R5 | perimeter-standard (`ResolvedIdentity.ref` references LM `IdentityRef`; correlation-index keys), every graph-aware framework |
| `UserId` | primitives.ts | core/R5 | perimeter-standard (per-user-scope arrivals carry UserId in `ResolvedScope` for downstream PMS PMA-Sb2 consultation per L3.3 disposition (b); PS resolves UserId at the crossing, PMS adjudicates access at decision time), every session-aware framework |
| `Semver` | primitives.ts | core/R5 | perimeter-standard (§1 version, §2 BoundaryDispatchRequest.source.programVersion, perimeterFrameworkVersion field), every versioned framework |
| `Result<T, E>` | primitives.ts | core/R5 | perimeter-standard (gate-evaluation results; HR-PS1..HR-PS3 return shapes), every fallible-operation framework |
| `AppError` | primitives.ts | core/R5 | perimeter-standard (validation failures at gate evaluation), every error-carrying framework |
| `EpochMs` | perimeter-standard (PS-local declaration per A-08 + parallel to VS/RS/Plan precedent) | L3 (this file §2 + core/R5 `perimeter-standard.types.ts`) | perimeter-standard (§2 receivedAt + requestedAt + crossedAt) |
| `ArrivalId` | perimeter-standard | L3 | perimeter-standard (§2.1 + §2.2 arrivalRef field) |
| `DispatchId` | perimeter-standard | L3 | perimeter-standard (§2.1 + §2.2 dispatchRef field) |
| `CrossingId` | perimeter-standard | L3 | perimeter-standard (§2.2 crossingId field; HR-PS3 query key); F-identity slice consumers |
| `DirectionKind` | perimeter-standard | L3 | perimeter-standard (§2.7 enum); every PS consumer |
| `DispositionKind` | perimeter-standard | L3 | perimeter-standard (§2.7 enum); every PS consumer |
| `ChannelKind` | perimeter-standard | L3 | perimeter-standard (§2.7 enum); LM `SourceRef.channel` consumers |
| `ChannelClaim` | perimeter-standard | L3 | perimeter-standard (§2.1) |
| `ReversibilityFlag` | perimeter-standard | L3 | perimeter-standard (§2.7 enum); §2.1 BoundaryDispatchRequest.reversibility |
| `ResolutionOutcomeKind` | perimeter-standard | L3 | perimeter-standard (§2.7 enum) |
| `IdentityClaim` | perimeter-standard | L3 | perimeter-standard (§2.1 BoundaryArrival.identityClaims) |
| `ResolvedIdentity` | perimeter-standard | L3 | perimeter-standard (§2.2 BoundaryCrossingRecord.resolvedIdentities); program consumers requiring resolved Refs |
| `CellGovernanceRecord` | perimeter-standard | L3 | perimeter-standard (§2.2 cellGovernance field; PA-T2 enforcement target) |
| `AuthorityEnforcementRecord` | perimeter-standard | L3 | perimeter-standard (§2.2 authorityEnforced field) |
| `BoundaryArrival` | perimeter-standard | L3 | perimeter-standard (§2.1 input shape); F-identity middleware (constructor) |
| `BoundaryDispatchRequest` | perimeter-standard | L3 | perimeter-standard (§2.1 input shape); program-emitting consumers |
| `BoundaryCrossingRecord` | perimeter-standard | L3 | perimeter-standard (§2.2 output shape); LM (via SubstrateWriteInput translation at HR-PS-LM1); audit consumers |
| `PerimeterBinding` | perimeter-standard | L3 | perimeter-standard (§6.2 deployment-time configuration); F-identity middleware (consumer) |
| `Mode` | substrate v1-1 | substrate-tier | perimeter-standard (§1 mode='structural'), all frameworks |
| `AuthorityAssertion` | substrate v1-1 §5.6 A-23 | substrate-tier | perimeter-standard (§2.1 + §2.2 authorityClaim/authorityContext/resolvedAuthority/authorityEnforced fields — all runtime crossing sites); runtime authority claim stamped at Boundary crossing per Shot 2 cascade |
| `AuthorityClaim` | substrate v1-1 §5.3 | substrate-tier | metaframework apparatus, framework Identity rows, A-12 ActivationTrigger, A-22 AxisBasis (governance ratification only — no runtime crossing site in PS v1.2 after Shot 2 cascade) |
| `ScopeRef` | substrate v1-1 (consumed via LM LMA6) | substrate-tier | perimeter-standard (§2.1 scopeClaim + §2.2 resolvedScope), LM (LMA6) |
| `Stage` | substrate v1-1 | substrate-tier | perimeter-standard (§3.7 P8 empty-declaration basis), all generative frameworks |
| `FrameworkRef` | substrate v1-1 | substrate-tier | all framework-aware atoms |
| `WAtom` | substrate v1-1 | substrate-tier | perimeter-standard (§2 atom declarations), all atom-emitting frameworks |
| `AxiomRef` | substrate v1-1 | substrate-tier | perimeter-standard (§3.6 axiom IDs), all axiom-bearing frameworks |
| `Judgment` | substrate v1-1 | substrate-tier | perimeter-standard (§7), all J-input-bearing frameworks |
| `JudgmentId` | substrate v1-1 | substrate-tier | perimeter-standard (§7.1), all J-input-bearing frameworks |
| `EmptyPrimitiveDeclaration` | substrate v1-1 (A-17) | substrate-tier | perimeter-standard (§3.7 P8=0 empty-declaration), all frameworks with empty-primitive instances |
| `SubstrateWriteInput` | living-memory v3.3 | L3 (LM) | perimeter-standard (§2.5 consumed at HR-PS-LM1 emission), LM (own input) |
| `SourceRef` | living-memory v3.3 | L3 (LM) | perimeter-standard (§2.5 — channel + scope carriers; §6.3 HR-PS-LM1 captureShape; PA-Cn4 preservation target), LM (own metadata) |
| `IdentityRef` | living-memory v3.3 | L3 (LM) | perimeter-standard (§2.5 — `ResolvedIdentity.ref` resolution target), LM (cluster geometry source) |
| `CorrelationRef` | multi-instance-standard v2.3 | L3 (MI) | perimeter-standard (§2.6 — §2.1 + §2.2 correlationRef field; PA-Co1 carrier), MI (own correlation declaration) |

### §6.6 Provenance contract

Per metaframework §6.5 Coupling provenance + framework-audit X8 (Genesis dimension):

```
provenance = {
  instanceId:     'perimeter-standard-v1-0',
  cycleId:        'sprint-6-structure-tightening-shot-2',
  timestamp:      'pending-L0-confirmation',
  authorityClaim: { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' }
}
```

### §6.7 Carrier-applicability enforcement

Per MA-C5: PS's `carrier = 'named' → 'living-memory'` requires that intake-direction `BoundaryCrossingRecord` content be expressible as `SubstrateWriteInput`. Verified by §2.2 + §6.3 HR-PS-LM1 captureShape: `record.resolvedIdentities` map to `SubstrateWriteInput.identities` (`IdentityRef[]`); `record.resolvedChannel + resolvedScope` populate `SubstrateWriteInput.metadata.source` (`SourceRef`); `record.crossedAt` populates `metadata.time`. No content lossy at translation.

### §6.8 OperatorInterface (per substrate §4 A-13 + V5 verification)

```
OperatorInterface = {
  primaryOperator:   'F-identity slice (L4 program; src/middleware.ts unitary site)',
  operatorRole:      'Constructs BoundaryCrossingRecord per crossing; invokes G-PS* gate-set; emits HR-PS-LM1 for intake; dispatches per PA-T2 cell-governance for outbound',
  invocationPattern: 'middleware-runtime-per-request',
  failureSurface:    'Gate failures rejected at boundary — crossing not committed; arrival rejected to source with mechanical reason; dispatch rejected to emitting program',
  observabilityInterface: 'HR-PS3 captureShape returns gateResults to caller; HR-PS-LM1 captureShape stamps audit-trail at LM SourceRef'
}
```

### §6.9 Handoff contracts (adjacent-framework call patterns)

| Pattern | Endpoints | Contract |
|---|---|---|
| Intake | F-identity middleware → PS (HR-PS1) → LM (HR-PS-LM1) | F-identity constructs BoundaryArrival → PS evaluates gates → PS emits SubstrateWriteInput per LM HR-LM1 contract → LM commits per LMA1+LMA4 |
| Dispatch | program L4 → PS (HR-PS2) → outbound (per channel target) | Program submits BoundaryDispatchRequest → PS evaluates gates → PS dispatches per cell-governance level (act-dispatch with reversibility recording per PA-T4; reference-dispatch lightweight) |
| Correlation query | program L4 → PS correlation-index (HR-PS3) | Program supplies CorrelationRef → PS returns crossingId list per PA-Co2 |
| Audit query | framework-audit → PS HR-PS3 | framework-audit consumes audit-trail and replays gate-results against persisted records |

### §6.10 Cross-framework atom flow

| Direction | From | To | Atoms |
|---|---|---|---|
| Inbound | F-identity middleware | PS | BoundaryArrival (constructed from raw request) |
| Inbound | program L4 | PS | BoundaryDispatchRequest |
| Inbound | MI Standard | PS | CorrelationRef (upstream when crossing originates from a multi-instance interaction) |
| Outbound | PS | LM v3.3 | SubstrateWriteInput (per HR-PS-LM1 for intake-direction crossings) |
| Outbound | PS | program L4 | ResolvedIdentity[] + cellGovernance + correlationRef (per HR-PS3 per-crossing return) |
| Outbound | PS | audit consumers | BoundaryCrossingRecord (via LM thread query against state-changes; HR-PS4 receipt-only) |

### §6.11 Carrier relation (H5) and boundary notes

PS's carrier relation to LM v3.3: PS produces `BoundaryCrossingRecord` (full content, including all six axes' resolved fields + cellGovernance + authorityEnforced + unitarySiteRef); only the intake-direction subset is translated to `SubstrateWriteInput` for LM commit (per HR-PS-LM1 captureShape). The full record persists at audit-trail (HR-PS3) for observability and replay; the LM-side persistence captures the substrate effect (state-change content) without duplicating PS's perimeter-side metadata.

**Boundary note:** PS does not assume LM v3.3's specific axiom set — PS consumes only `SubstrateWriteInput` shape and `SourceRef` shape, both of which are stable across LM versions per LM §1 carrier=self + LM §6.1 SW1–SW3 procedure stability. LM v3.3 (post-beta) addition of aggregate-signal-read primitives does not affect PS contract; PS remains version-tolerant by consuming only the intake-write surface.

---

## §7 Judgment

### §7.1 Declared J-inputs

**J-perimeter-observation** (PS-local, consumed at audit time):

```
J-perimeter-observation = {
  id: 'J-perimeter-observation',
  consumedBy: 'framework-audit at HR3 invocation against PS',
  shape: {
    crossingsObserved: number,                    // total BoundaryCrossingRecord count in audit window
    distributedSiteDetections: number,            // count of distinct unitarySiteRef values (must equal 1; >1 signals PA-I/G-PS-I failure)
    ambiguousResolutionPersistedCount: number,    // count of ResolvedIdentity entries with outcome='ambiguous-pending-disambiguation' beyond SLA window
    channelEnumerationGaps: ChannelKind[],        // observed channel values not in currently named enum (informational; open-vocabulary admission per §S3)
    correlationIndexHealth: 'nominal' | 'degraded'
  }
}
```

J-perimeter-observation is the single PS-local J-input. It is informational/diagnostic — it does not amend axioms or gates; it surfaces PS runtime characteristics for L0 observation per §5.3 confirmation gate.

### §7.2 Axis status

| Axis | Judgment input |
|---|---|
| Identity | none |
| Schema | none |
| Structure | none |
| Validity | none |
| Lifecycle | J-perimeter-observation (consumed at framework-audit invocation) |
| Coupling | none |
| Judgment | J-perimeter-observation |

### §7.3 Judgment provenance

J-perimeter-observation is produced by framework-audit invocation against PS-emitted BoundaryCrossingRecord audit-trail; provenance trace per HR-PS3 captureShape + framework-audit §8 audit-run mechanics.

---

## §8 Self-audit results

### §8.1 Gate results

**All 109 framework-tier gates: state = `not-yet-run` at this version.**

Mechanical self-evaluation per §4.8: at this version no `BoundaryCrossingRecord` instances exist; BCR-emission machinery wires at Sprint 9 alongside substrate-write callers, thread-query callers, F-router registration, and wearer-authority program. G-PS1..G-PS-I therefore evaluate against zero instances — vacuous-pass per substrate §6.3 cardinality semantics.

Inherited 87 framework-tier gates evaluated against PS file declarations:

- **E1 Identity:** §1 declares all required Identity fields per MA-I1..MA-I8 (MA-I8 added Sprint B1 Shot 2 — `governsRuntimeCode: true` declared §1 with basis prose; field present, boolean-typed per substrate §6.3); §1.2 axiom-satisfaction table populated with MA-I8 row; **G-I8 PASS at v1.1**; **vacuous-pass for downstream gates pending non-empty referentCitations promotion**.
- **E2 Schema:** §2 declares input + output shapes per MA-S1..MA-S6; §1 referentCitations=[] per MA-V11 vacuous-pass with explicit basis text; G-S8 vacuous-pass.
- **E3 Structure:** §3 declares 6 P1 axes + 13 P2 sub-axes (count per §3.2; §3.4 enumerates 24 rows — pre-existing v1.0.1 count discrepancy carried forward, surfaced as finding in Sprint B1 Shot 3 delivery report; not in this shot's amendment scope) + 21 P3 leaves + 22 P4 axioms + 22 P5 gates + 4 P6 handoff rules + 1 P7 J-input + 0 P8 (empty-declared with basis); §3.6 AxR1–AxR4 self-checks pass; §3.8 universal-variables table populated. **§3.13 AxisBasis declarations added Sprint B1 Shot 3 v1.1: 65 basis declarations spanning axes (6) + sub-axes (24) + handoff rules (5) + lifecycle events (5) + judgment inputs (1) + closure rules (8) + typed shapes (14) + coupling enums (2). P8 zero instances excluded per quantifier semantics; axioms + gates + leaves excluded per MA-St17 kind-set exclusions. G-St17 PASS at v1.1.**
- **E4 Validity:** §4 declares 22 own gates per G-M1; §4.2 MA-V2 per-axis gate coverage all-axes-≥1 passes; G-V10 part A vacuous-pass (zero referentCitations); **G-V10 part B added Sprint B1 Shot 2 — PS §3.13.11 declares jurisdictionClaim on six own axes + PA-I per source-paths under `src/proxy.ts` + `src/features/F-identity/**`; zero RCs cover the claim; partial-drift declared per MA-V11 vacuous-pass with explicit basis prose targeting Sprint B2 closure; G-V10 part B PASS-with-partial-drift-declared at v1.1**; G-V11 vacuous-pass.
- **E5 Lifecycle:** §5 declares version + amendment + confirmation + escalation + judgment-deprecations + failure-modes + scale-bounds + atomicity + version-history; G-L11 vacuous-pass.
- **E6 Coupling:** §6 declares carrier + 4 HR + custody + provenance; MA-C1..MA-C10 self-checks pass.
- **E7 Judgment:** §7 declares 1 J-input (J-perimeter-observation); MA-J1..MA-J5 satisfied.
- **E8 Universal/Meta:** §1.3 MA-G13 four-property table populated; G-U1..G-U5 + G-M1..G-M4 + G-G13 evaluated against PS file structurally.

**Aggregate:** 87 inherited gates pass mechanically against this file at PS-declaration audit; 22 PS-own gates `not-yet-run` (await Sprint 9 first-runtime-crossing event when BCR-emission scaffold wires).

### §8.2 Dimension audit results

| Dimension | Result | Basis |
|---|---|---|
| X1 Temporal | PASS | §1.1 GenesisDeclaration; §5.9 version history; §1 stateTemplate/stateApplied |
| X2 Determinism | PASS | §3.6 axioms all mechanical per substrate §6.3; §3.7 P8=0 deterministic by absence |
| X3 Observability | PASS | §6.3 captureShape declared for all 4 HRs (3 with diagnosticSignificance=true; HR-PS4 declares n/a per false flag) |
| X4 Negative space | PASS | §1 scopeOut 10 entries declared with explicit basis |
| X5 Scale | PASS | §5.7 scale bounds declared (per-crossing O(1) + correlation index policy) |
| X6 Operator | PASS | §6.8 OperatorInterface declared (F-identity slice + middleware-runtime-per-request) |
| X7 Lifecycle | PASS | §5 lifecycle complete (version, amendment, confirmation, escalation, etc.) |
| X8 Genesis | PASS | §1.1 GenesisDeclaration populated with parent + procedure + cycle |
| X9 Integration | PASS | §6.2 4 HRs declared + §6.4 MA-C handoff axioms satisfied |
| X10 Stage-declaration | PASS (vacuous) | §3.7 P8=0 empty-declared with basis per substrate §10.2 |

### §8.3 Last audit event

`{eventKind: 'self-audit', eventTimestamp: 'sprint-6-shot-2-close', auditor: 'PS-builder-self-audit per spec §Shot 2 verificative phase', resultCount: {pass: 95, fail: 0, vacuousPass: 12, notYetRun: 22}}`

VacuousPass breakdown: G-V10 + G-S8 + G-L11 (zero referentCitations); MA-S7 spec↔referent recursive `≼` vacuous over empty referentCitations; MA-S8 + MA-V11 + MA-L11 vacuous; G-PS-Co2 (single-crossing closure); G-PS1..G-PS-I (no BoundaryCrossingRecord instances at this version — promoted at Sprint 9 first-runtime-crossing event). (G-PS-A4 + G-PS-Cn3 vacuous-pass entries removed in lockstep with their gate dissolution at Sprint B2 Shot 2.)

NotYetRun breakdown: 22 PS-own gates await first runtime crossing.

### §8.4 Self-application basis

PS verificatively passes its own gates against its own axioms:
- 20 PS-own gates 1:1 with 20 axioms per G-M1 (§4.2 verified; post-Sprint-B2-Shot-2-reroll — 19 axis-bound + PA-I).
- Every axiom binds to exactly one axis/leaf per AxR1 (§3.6 verified).
- Every axiom states one mechanical condition per AxR2 (§3.6 verified).
- 6 P1 axes + 1 Identity-tier assertion → 19 axis-bound leaves + 1 PA-I leaf = 20 leaves (§3.5 verified).
- §6 carrier + HRs satisfy MA-C1..MA-C10 (§6.4 verified).
- §7 J-input satisfies MA-J1..MA-J5 (§7.1 verified).

**Spec §Shot 2 halt-gate criterion:** "standard verificatively passes its own gates against its own axioms before Shot 3" — satisfied per this §8.

### §8.5 MA-G13 four-property self-check (framework classification)

Per §1.3 MA-G13 four-property table: all four properties (own state, own I/O, own invariants, own discipline) declared. PS classified as Framework, not state store, not protocol, not substrate. Pass.

### §8.6 Cross-framework consistency check

| Adjacent | Calibration check | Result |
|---|---|---|
| Living Memory v3.3 | PS HR-PS-LM1 send-side maps to LM HR-LM1 receive-side; SubstrateWriteInput shape consumed by reference per §2.5 | PASS |
| Multi-Instance Standard v2.3 | CorrelationRef consumed by reference per §2.6; PA-Co1 honors upstream MI correlation | PASS |
| Artifact Standard v2.3 | Program emissions cross PS as dispatches; PS dispatch validation interacts with AS v2.3 emission contract at HR-PS2 + dispatch outbound; AS owns emission shape, PS owns boundary contract | PASS (non-overlapping concerns; AS owns emission identity/composition/lineage at A7, PS owns boundary typing at the crossing — clean separation post Sprint B2 Shot 2c ArA8 dissolution) |
| Metaframework v3.3.1 | Generation procedure v1.1.7 consulted; §1.1 GenesisDeclaration cites; full PS file conforms to GeneratedFrameworkTemplate shape | PASS |

---

## §9 Change log

| Version | Cycle | Authority |
|---|---|---|
| v1.0 | Structure-Tightening Sprint Shot 2 (2026-05-06): initial PS declaration filling Manual III.8 perimeter governing-framework slot; six axes (Direction, Arrival Typing, Authority Enforcement, Channel, Identity Resolution, Correlation) + Identity-tier PA-I unitarity; 22 axioms + 22 gates 1:1; carrier `named` → `living-memory` v3.1; F-007 closure (PA-T2 cell-governance), F-009 governance closure (PA-A2 + PA-A3 + PA-A4), F-005 framing rule (PA-A6 + PA-I); vacuous-pass entries documented at §4.8 + §8.3 | L0 (pending confirmation) |
| v1.0.1 | Structure-Tightening Sprint audit-cycle-A close (2026-05-06): prose-only realignment per audit findings closing audit-cycle-A. **Finding A1 (broad sweep):** stripped 26 transient cycle markers ("Sprint 6 Shot 1/2/3" embedments) from Class A/B/C/G/H illegitimate-class sites — axiom prose (PA-A4, PA-A6, PA-I), leaf prose (leaf-PA-A6, leaf-PA-I), gate prose (G-PS-A6, G-PS-Cn3), §1 framing + Own discipline + Unitarity assertion, §3.1/§3.2/§3.3 axes derivation prose, §3.6 vocabulary references, §3.9 Vocabulary `unitary site`, §5.6 failure-mode remediation pattern, §6.5 Custody table CrossingId, §6.11 cross-framework calibration, §8.1 self-audit, §10 D4 row. Preserved verbatim at 5 Class D/E/F legitimate-class sites: GenesisDeclaration `generationCycle` field (substrate §4 A-14 designed-for-cycle), §6.6 Provenance `cycleId` field (designed-for-cycle), §8.3 last audit event `eventTimestamp` (historical event timestamp), §10 D-table heading (D-records are sprint-cycle artifacts), §9 changelog v1.0 row narrative. **Findings B1+C2 (BCR-emission machinery alignment):** §4.8 + §8.1 prose state BCR-emission scaffold wires at Sprint 9 wire-in alongside substrate-write callers, thread-query callers, F-router registration, wearer-authority program; gate promotion at Sprint 9 first-runtime-crossing event, not Shot 3 deploy. **Finding B2 (constants alignment):** §4.8 promotion path declares `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP` as declared-but-unconsumed at this version; consumption surfaces wire at Sprint 9. **Findings B3+C1 (PerimeterBinding alignment):** §3.6 PA-Cn3 row, §4.8 promotion path, G-PS-Cn3 vacuous-pass basis, §5.9 v1.0 row narrative, audit-guide §Findings table — all state PerimeterBinding instance is supplied at Sprint 9 wire-in. **Side-finding C-δ:** added G-PS-Cn4 (channel preservation) to §4.8 explicit vacuous-pass enumeration. **Side-findings C-α/β/γ:** sprint-spec language reconciliation, terminology hygiene, no-action items respectively (resolved at sprint-package level, not in this standard's prose). **Version-metadata bumps (V1–V8 from lighter re-audit):** file header v1-0 → v1-0-1; §1 Identity `version` field 1.0 → 1.0.1; §1.1 Genesis `predecessorVersion` null → '1.0'; §1.1 Bootstrap status sentence appends v1.0.1 prose-realignment narrative; §3.5 leaf-PA-I rationale "PS v1.0 declares" → "PS declares"; §3.6 AxR3 self-check narrates v1.0.1 carrying v1.0 axiom set forward with zero invariant-predicate changes; §5.9 v1.0 row B3+C1 alignment + new v1.0.1 row added; this §9 Change log v1.0.1 entry added. **Discipline:** prose-only amendment per AxR3 + MA-L1 — zero axiom invariant conditions changed; zero gate predicates changed; zero schema shapes changed; zero handoff rules changed; primitive instance counts unchanged; mechanical predicates at v1.0 baseline. Shot 3 src tree does not require re-verification (middleware function body byte-identical to v1.0; only header comment block realigned). Single bundle deploy per Playbook §1.22. | L0 (pending confirmation) |
| v1.1 | Sprint B1 Shot 3 (2026-05-13): MA-St17 / MA-I8 / MA-V10 part B amendment apparatus applied per MFv3 v3.3.0 Shot 2 cascade. Detailed per-Δ scope recorded at §5.9 v1.1 row + §3.13.11 AmendmentProvenance. Summary: §1 governsRuntimeCode=true added per MA-I8 + LM carrier sweep v3.1→v3.3 across live cross-version references (historical changelog rows preserved); §3.13 AxisBasis declarations subsection added (additive per MA-S7) holding 65 basis declarations spanning 9 kind categories — axes (6, all l0-ratified-ref to Manual v13.0 Part II Boundary loci; **Correlation axis closes Memory #17**), sub-axes (24 per §3.4 enumeration), handoff rules (5), lifecycle events (5), judgment inputs (1), closure rules (8), typed shapes (14), procedure steps (0 — vacuous per quantifier), coupling enums (2); §3.13.10 jurisdictionClaim declared on all six own axes + PA-I against actual current source paths (`src/proxy.ts` + `src/features/F-identity/**`; v1.0.1 prose `src/middleware.ts` discrepancy surfaced as finding in delivery report); zero RCs at v1.1 — partial-drift declared per MA-V11 vacuous-pass targeting Sprint B2 closure. AmendmentProvenance at §3.13.11. Self-audit updated: G-I8 PASS at E1, G-St17 PASS at E3 with 65-declaration count, G-V10 part B PASS-with-partial-drift-declared at E4. Inherited framework-tier gate count 85→87, total 107→109. Version transition v1.0.1 → v1.1 per MA-L1 additive-only. Manual citations pin `manualVersion: '13.0'`. Discipline: zero axiom invariant predicates changed; zero gate predicates changed; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Pre-existing sub-axis count discrepancy (§3.2 says 13, §3.4 enumerates 24) carried forward as finding; not in this shot's amendment scope. | L0 (Sprint B1 Shot 3) |
| v1.1 (Shot 5 cleanup) | Sprint B1 Shot 5 (2026-05-13): Sprint B1 close audit findings closed at PS. **F-B1-Audit-4** (residue removal at standards tier): §1 Identity `adjacentFrameworks` row removed entirely — residue eliminated alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup (the input field carried zero downstream consumers). Consequential edit at §6.5 FrameworkRef custody row: perimeter-standard removed from consumers column. **F-B1-Audit-6** (sibling-standard-parity placeholder): §3.13.3 Axioms basis placeholder inserted reserving slot for parity with LIV-Standard's §3.13.3 — PS axioms grounded by own derivation per MA-St17 exclusion clause; no A-22 basis required at axiom kind. Renumbering: §3.13.3..§3.13.11 each shifted +1 → §3.13.4..§3.13.12 (full map in Shot 5 delivery report); intra-file pointer references swept at active spec locations (§1 referentCitations basis prose, §3.13.8 ResolvedIdentity closure ref, §3.13.12 Shot 3 AmendmentProvenance scope rows Δ-B/Δ-C/Δ-D pointers, §7 E4 prose, §8.1 self-audit E4 summary). Historical narrative preserved verbatim at §5.9 v1.1 + §9 v1.1 rows per existing "Historical changelog rows preserved verbatim per L0 discipline" rule. **Δ:** §3.13.13 AmendmentProvenance recorded (this row's predecessor block); §5.9 + §9 v1.1 Shot 5 cleanup rows added. No version bump (PS stays v1.1). Self-audit unchanged. F-B1-Audit-4 closes by structural dissolution at standards tier alongside MFv3 v3.3.1 apparatus-tier residue removal; F-B1-Audit-6 closes by sibling-standard-parity placeholder with explicit MA-St17 exclusion rationale. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B1-Shot5'} | L0 (Sprint B1 Shot 5) |
| v1.2 | Sprint B2 Shot 2 (2026-05-15): Access-scoping axiom extraction (2a) + paired-write dissolution (2b). **2a:** PA-A2 (wearer-scope) / PA-A3 (system-scope) / PA-Cn3 (channel-authority-binding) extracted to Permissions Standard v1.0 (PMA-Sb2 / PMA-D2+PMA-Sb3 / PMA-Av2 respectively). Sub-axes `Authority Enforcement/wearer-scope`, `/system-scope`, `Channel Classification/authority-binding` removed in lockstep with their axioms. Gates G-PS-A2, G-PS-A3, G-PS-Cn3 removed. Leaves leaf-PA-A2, leaf-PA-A3, leaf-PA-Cn3 removed. **2b:** PA-A4 (orphan-rule) dissolved entirely — paired-write contract vacuously satisfied per Sprint B1 final shot 3 art_* table drop. Sub-axis `Authority Enforcement/orphan-rule` removed; leaf leaf-PA-A4 removed; gate G-PS-A4 removed. Source-side: `EmissionPairRef` atom dissolved (full removal — no replacement field; substrate-write reference captured at LM HR-PS-LM1 captureShape per existing PS §6.3); `BoundaryCrossingRecord.emissionPair` field removed from `src/core/types/perimeter-standard.types.ts`. **Counts:** axioms 22→18; gates 22→18; sub-axes 17→13 (reconciles pre-existing §3.2 vs §3.4 discrepancy). §1 cross-framework input row: AS v2.2 → v2.3 + new Permissions Standard v1.0 row added. §1 scopeOut sweep: F-009 wire-in entry removed; access-scoping entry added (owned by Permissions Standard); paired-write dissolution entry added. §3.2/§3.3/§3.4/§3.5/§3.6/§4.1/§4.2 all updated. **Discipline:** removal is additive per MA-L1 invokes *removal-is-additive* clause — PA-A4 was vacuously satisfied; PA-A2/A3/Cn3 relocated to Permissions Standard which any consumer of access scoping now consults. Cross-check satisfied: no axiom appears in both PS v1.2 and Permissions Standard v1.0. **AS reference v2.2→v2.3** in §1 cross-framework input reflects companion Sprint B2 Shot 2c amendment. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending'} | L0 (Sprint B2 Shot 2) |
| v1.2 (Shot 2 re-roll) | Sprint B2 Shot 2 re-roll (2026-05-15): Auditor mechanical-audit-driven cleanup of 8 hard-violation orphan-ref sites + 1 soft count-drift reconciliation + L3.3 disposition (b) implementation. **Hard violations swept (8):** H1 §2.2 BoundaryCrossingRecord schema (emissionPair field + PA-A2/A3/Cn3 axiom-ref comments) + collateral §2.7 EmissionPairRef shape block + §3.13.8 typed-shape basis row; H2 §5.6 two failure-mode rows for removed gates + §4.8 vacuous-pass rows for removed gates; H3 §6.5 EmissionPairRef Custody row; H4 §6.11 emissionPair from carrier-relation prose; H5 §7 orphanCount field from J-perimeter-observation shape; H6 §8.6 AS v2.2→v2.3 + Metaframework v3.2.7→v3.3.1 + emissionPair-calibration-prose replacement; H7 types file PA-A4/PA-Cn3 docstring sweep + PermittedAuthoritySet/PerimeterBinding restatement (per L3.3 disposition b); H8 constants file G-PS-Cn3 vacuous-pass comments restatement (per L3.3 disposition b); H9 artifact-gates.ts header docstring ArA1–ArA8 → ArA1–ArA7. **Soft finding S1 (doc-vs-src count drift):** P3/P4/P5 doc counts 18 → 20 to match actual `PERIMETER_AXIOM_IDS`/`PERIMETER_AXIOM_GATE_IDS` const array lengths. §3.6 intro "17 axis-bound + PA-I = 18" → "19 axis-bound + PA-I = 20". §1 governsRuntimeCode prose enumeration count reconciled. Pre-existing baseline drift inherited from PS v1.1 ("22 axioms" actual 24) now closed at v1.2 re-roll. **Soft finding S2 (Manual sweep gaps at L168/L200/L293/L413):** out of re-roll scope — flagged for Manual SPEC v13.2 candidate amendment. **L3.3 disposition (b) ratified by L0:** PermittedAuthoritySet + permittedAuthorityByChannel + DEFAULT_PERIMETER_BINDING infrastructure retained as boundary-consultation site for Permissions Standard PMA-Av2 (single axiom owns channel × permitted-authority closure rule; boundary is one consultation site, F-permissions access-check is another). Defense-in-depth preserved. PMS bumps v1.0 → v1.0.1 in companion amendment with §3.13.11 jurisdictionClaim extended to cover the two PS source paths. **Discipline:** patch-level within-version reconciliation; PS stays v1.2 (re-roll narrative recorded; no axiom invariant predicates changed; no gate predicates changed; no schema shapes changed beyond H1 which was original Shot 2 intent). Build verified zero errors on fresh baseline + re-roll overlay. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll'} | L0 (Sprint B2 Shot 2 re-roll) |
| v1.2 (Shot 2 re-roll-2) | Sprint B2 Shot 2 re-roll-2 (2026-05-16): Auditor review of re-roll-1 surfaced 6 new sweep-miss findings (R3 Manual tar omission, R4 §3.13.2 stale sub-axes basis, R5 §3.13.7 vocabulary-closure stale enumeration, R6 §3.13.11 Authority Enforcement jurisdiction prose, R7 §3.13.11 Channel Classification jurisdiction prose, R8 §3.2 P2 sub-axis count drift) + carried-forward R1 §3.13.6 J-input basis prose orphanCount mention. **All 7 findings closed** with surgical text edits — no axiom/gate/schema/closure changes. **R3:** Manual file now included in tar; L403 reflects PMS v1.0.1. **R4:** 4 stale sub-axis rows removed from §3.13.2 (`Authority Enforcement/wearer-scope`, `/system-scope`, `/orphan-rule`, `Channel Classification/authority-binding`); intro count breakdown corrected 24→20. **R5:** §3.13.7 vocabulary-closure prose enumeration swept of `orphan, paired-write contract`. **R6:** §3.13.11 Authority Enforcement jurisdictionClaim prose narrowed PA-A1..PA-A6 → PA-A1+PA-A5+PA-A6 with PMS-handoff annotation. **R7:** §3.13.11 Channel Classification jurisdictionClaim prose narrowed PA-Cn1..PA-Cn4 → PA-Cn1+PA-Cn2+PA-Cn4 with oauth-config.ts permitted-authority subset annotated as L3.3 (b) shared with PMS PMA-Av2 jurisdiction. **R8:** §3.2 P2 sub-axis count 13 → 20 (reconciled with actual §3.4 enumeration). **R1:** §3.13.6 J-perimeter-observation basis prose swept `orphan count`. **Additional collateral sweeps:** §5.8 dispatch paired-write atomicity prose reworded substrate-single-store; §C.6 atom-consumer table UserId row reframed per L3.3 (b). **Discipline:** patch-level within-version reconciliation; PS stays v1.2 (re-roll-2 supersedes re-roll-1 as single deployable bundle); no axiom invariant predicates changed; no gate predicates changed; no schema shapes changed; no closure rule changed. Pattern correction: §3.13 sweep discipline is now propagation-mandatory whenever active axes/sub-axes/axioms/gates/vocabulary change. Build verified zero errors on full overlay chain. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll-2'} | L0 (Sprint B2 Shot 2 re-roll-2) |
| v1.2.1 | Sprint B2 Shot 2 cascade — AuthorityClaim → AuthorityAssertion at runtime sites (2026-05-16): patch-level rewire per substrate v1.8.2 atom split (Shot 1 + Shot 2 delivery). **Δ:** §2.1 `BoundaryArrival.authorityClaim` type → `AuthorityAssertion`; `BoundaryDispatchRequest.authorityContext` type → `AuthorityAssertion`. §2.2 `BoundaryCrossingRecord.resolvedAuthority` type → `AuthorityAssertion`. §2.3 consumed types table: `AuthorityClaim` row → `AuthorityAssertion | substrate §5.6 A-23`. §2.7 `AuthorityEnforcementRecord.authorityClaimed` type → `AuthorityAssertion`. §3.3 axis table Authority Enforcement concern column: `AuthorityClaim` → `AuthorityAssertion`. §3.3 MECE verification: `AuthorityClaim` → `AuthorityAssertion`. §3.4 sub-axis table Authority Enforcement/intake-validation + /dispatch-validation: `AuthorityClaim` → `AuthorityAssertion`. §3.5 leaf-PA-A1 + leaf-PA-A5 predicates: `AuthorityClaim` → `AuthorityAssertion`. §3.6 PA-A1 axiom predicate: `AuthorityClaim` → `AuthorityAssertion`. §3.8 universal-variables Authority Enforcement row Categorical column: `AuthorityClaim.level` → `AuthorityAssertion.level`. §3.9 vocabulary `permitted-authority set` definition: `AuthorityClaim` → `AuthorityAssertion`. §3.13 BoundaryArrival typed-shape basis prose: `AuthorityClaim` → `AuthorityAssertion A-23`. §4.2 G-PS-A1 gate predicate: `inputAuthorityClaim` → `inputAuthorityAssertion`. §6.5 custody table: `AuthorityClaim` consumer row replaced with split `AuthorityAssertion` (runtime, all crossing sites) + `AuthorityClaim` (governance only, zero runtime sites in PS v1.2.1). Version 1.2 → 1.2.1. This §9 row + §5.9 row added. Cross-framework: substrate v1.8.2 + atom A-23 cited. **Per-site classification audit:** every surviving `AuthorityClaim` in file is governance-flavor (custody table governance row); every `AuthorityAssertion` site is runtime-flavor. No invariant change. No new axiom. No new gate. No schema shape change. Cascade-rewire only. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot2-cascade'} | L0 pending |

---

## §10 Decision-D table (Sprint 6 Shot 2)

Per spec §Shot 2 D-records inline in tar manifest. PS-internal D-records:

| D-record | Site | Decision |
|---|---|---|
| **D4** (axiom granularity per axis) | §3.6 | *Historical (v1.0 derivation):* Direction: 2 axioms (PA1, PA2); Arrival Typing: 4 axioms (PA-T1..PA-T4); Authority Enforcement: 6 axioms (PA-A1..PA-A6); Channel: 4 axioms (PA-Cn1..PA-Cn4); Identity Resolution: 4 axioms (PA-IR1..PA-IR4); Correlation: 3 axioms (PA-Co1..PA-Co3); Identity-tier: 1 axiom (PA-I). Total at v1.0: 22. Aggregate within D1 anticipated band of 18–24. *Current (v1.2 post-Sprint-B2-Shot-2 + re-roll): Authority Enforcement reduced to 3 (PA-A1, PA-A5, PA-A6 — PA-A2/A3 extracted to Permissions Standard; PA-A4 dissolved); Channel reduced to 3 (PA-Cn1, PA-Cn2, PA-Cn4 — PA-Cn3 extracted to Permissions Standard). Total at v1.2: 20.* |
| **D5** (gate enumeration) | §4.2 | *Historical (v1.0 derivation):* 22 PS-own gates 1:1 with 22 axioms per G-M1. *Current (v1.2 post-Sprint-B2-Shot-2 + re-roll):* 20 PS-own gates 1:1 with 20 axioms per G-M1. Plus 87 inherited framework-tier gates per metaframework v3.3.1 §4.1. Total framework-tier per audit: 107. |
| **D6** (orphan rule formulation for art_* / substrate split) | §3.6 PA-A4 (dissolved) | *Historical (v1.0 ruling):* Per F-009 ruling: every program emission writes both substrate state-change (wearer-scope when applicable) AND artifact-store record. **What counts as orphan:** an emission with one side missing (`substrateStateChangeId === null XOR artifactStoreRecordId === null`). **When surfaced:** at audit time via PA-A4 gate failure on persisted records. **How revoked:** ordinary LM LMA2 revocation path. *Superseded at v1.2 (Sprint B2 Shot 2):* PA-A4 dissolved entirely — paired-write contract vacuously satisfied per Sprint B1 final shot 3 art_* table drop (substrate is the single store post-Sprint-B1; one side of the pair no longer exists). No replacement axiom; `EmissionPairRef` atom + `BoundaryCrossingRecord.emissionPair` field removed at re-roll. |

D7 + D8 (Shot 3) recorded in spec-shot-3.tar manifest per spec §Shot 3.

---

## End of perimeter-standard.md v1.1 — Sprint B1 Shot 5 cleanup.
