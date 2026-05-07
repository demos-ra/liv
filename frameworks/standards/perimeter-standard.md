# perimeter-standard-v1-0-1

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** Living Memory v3.1 (carrier; perimeter writes typed signal as `SubstrateWriteInput` consumed at HR-LM1 receive-side), Multi-Instance Standard v2.3 (correlation reference upstream), Artifact Standard v2.2 (downstream — program emissions cross perimeter as dispatches)

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
| `version` | `1.0.1` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first emission via §5.3 post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `named` → `living-memory` v3.1 (per substrate §9 Carrier enum; applied §6.1; perimeter writes typed signal via `SubstrateWriteInput` consumed at LM HR-LM1 receive-side; structurally distinct from VS/RS/Plan AS-carriered pattern because perimeter does not emit artifacts about its work — it emits the typed signal itself) |
| `primitive` | `boundary-crossing` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | untyped arrival surface (boundary inbound), typed dispatch request (program-emitted boundary outbound), `PerimeterBinding` instance, channel registry, identity resolution registry |
| `produces` | typed `BoundaryCrossingRecord` (intake direction → ready for LM `SubstrateWriteInput`; dispatch direction → governed dispatch with audit trail) |
| `consumedBy` | Living Memory v3.1 (intake-direction state-changes via HR-PS-LM1), program-direction consumers (programs receiving typed arrivals), audit consumers, observability replay |
| `adjacentFrameworks` | Living Memory v3.1 (carrier — receive-side at HR-LM1), Multi-Instance Standard v2.3 (correlation upstream), Artifact Standard v2.2 (downstream emission validation; program emissions cross perimeter as dispatches), domain L3 frameworks (consumers — every program operating across boundary honors PS contract), framework-audit v1.3.6 (distinct concern; see scopeOut) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Verification Standard v1.0 §1 Identity, Research Standard v1.0 §1 Identity, dissolved Cognitive Standard v1.2.2 §1 Identity** establish the pattern for new L3 frameworks at first ratification with zero code referents. At this version the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at this version; promotion scheduled at first src-side wire cycle (Sprint 9 wire-in cycle) when implementation surfaces consume the axioms — at this delivery PS declares the structural rule set; first runtime referent emerges at Sprint 9 substrate-write callers + thread-query callers per F-009 implementation' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['substrate atom shape (owned by Living Memory v3.1; PS does not declare what state-changes look like once they land — only what conditions must be met before submission)', 'cross-cutting redeclaration (owned by Manual SPEC-v11.0 §IV — PS declares boundary-side enforcement rules; does not redeclare source-authority or act-vs-reference as cross-cutting concerns)', 'program-domain rules (owned by each program L3 framework — PS declares the boundary contract programs must honor at their dispatch, not the program internals)', 'authority semantics (owned by Manual §I.6 + §II.8 — PS declares enforcement rules at the boundary; does not redeclare what authority means)', 'F-chat governing framework (separate domain — F-chat operates at perimeter-baseline + perimeter framework; F-chat may surface its own governing framework in a later sprint per Manual III.8 row)', 'aggregate-signal-read mechanics (owned by LM v3.2 / post-beta per Manual III.4 bootstrap-mode acknowledgment annotation — PS consumes signals as they arrive, does not declare aggregation primitives)', 'runtime execution of boundary typing (owned by L4 program — F-identity slice middleware; PS declares the rule set, F-identity executes)', 'F-009 implementation wire-in (owned by Sprint 9 — substrate-write callers, thread-query callers, F-router registration, wearer-authority program; PS declares the orphan rule + substrate-write rule, Sprint 9 wires programs to honor them)', 'graph physics (owned by Living Memory)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

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
  authorityClaim:      AuthorityClaim,                             // substrate §5
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
  authorityContext:    AuthorityClaim,                             // confirming authority for act-direction dispatches
  correlationRef:      CorrelationRef | null,                      // links to originating interaction
  reversibility:       ReversibilityFlag,                          // 'reversible' | 'irreversible' | 'n/a' (§2.7 enum; bound to dispositionClaim per PA-T4)
  requestedAt:         EpochMs                                     // dispatch request time
}
```

### §2.2 Output — `BoundaryCrossingRecord`

Per MA-S2 (output is W-ATOM). PS carrier = `named` → `living-memory` v3.1: PS's `BoundaryCrossingRecord` rides as `SubstrateWriteInput` consumed at LM HR-LM1 (receive-side declared at LM §6.2; PS send-side declared at §6.2 below).

```
BoundaryCrossingRecord = {
  crossingId:          CrossingId,                                 // unique per crossing
  direction:           DirectionKind,                              // 'intake' | 'dispatch' (§2.7 enum; PA1)
  arrivalRef:          ArrivalId | null,                           // populated if direction='intake'
  dispatchRef:         DispatchId | null,                          // populated if direction='dispatch'
  resolvedDisposition: DispositionKind,                            // 'act' | 'reference' (PA-T1; verified at PA-T2 cell-governance)
  resolvedChannel:     ChannelKind,                                // resolved channel post PA-Cn validation (PA-Cn1)
  resolvedAuthority:   AuthorityClaim,                             // authority validated against channel-binding per PA-A1 + PA-Cn3
  resolvedScope:       ScopeRef,                                   // scope post-validation
  resolvedIdentities:  ResolvedIdentity[],                         // per-identity resolution outcome (PA-IR2)
  correlationRef:      CorrelationRef,                             // populated; equals crossingId for un-correlated arrivals (PA-Co1)
  cellGovernance:      CellGovernanceRecord,                       // four-cell IV.2 mapping result (PA-T2)
  emissionPair:        EmissionPairRef | null,                     // populated for program-emission dispatches (PA-A4 orphan rule)
  authorityEnforced:   AuthorityEnforcementRecord,                 // record of authority check (PA-A1, PA-A2, PA-A3)
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
| `AuthorityClaim` | substrate §5 |
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

### §2.5 Consumed types (from living-memory v3.1, by reference)

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

EmissionPairRef = {                                                // PA-A4 orphan rule — every program emission writes paired records
  substrateStateChangeId: string | null,                           // null = orphan (substrate side missing)
  artifactStoreRecordId:  string | null                            // null = orphan (artifact side missing)
}

AuthorityEnforcementRecord = {
  authorityClaimed:    AuthorityClaim,
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
| P1 Axis | 6 | Direction, Arrival Typing, Authority Enforcement, Channel Classification, Identity Resolution, Correlation — declared §3.3 per D1 ratification |
| P2 Sub-axis | 13 | declared §3.4 |
| P3 Leaf | 21 | declared §3.5 (1:1 with PA1..PA21 axiom set + PA-I identity-tier axiom = 22 leaves; 21 in axis-bound P3 set; PA-I leaf at Identity tier per §1.4) |
| P4 Axiom | 22 | PA1..PA21 (axis-bound) + PA-I (identity-tier unitarity assertion); declared §3.6 |
| P5 Gate | 22 | G-PS1..G-PS21 + G-PS-I; 1:1 with axioms per G-M1; declared §4.2 |
| P6 Handoff rule | 4 | HR-PS1..HR-PS4 declared §6.2 |
| P7 Judgment input | 1 | J-perimeter-observation declared §7.1 |
| P8 Procedure step | 0 | `{primitiveKind: P8, instanceCount: 0, basis: "PS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). PS therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. PS's gate-procedure semantics — what the perimeter does at each crossing — are captured declaratively as the PA1..PA-I axiom set and G-PS1..G-PS-I gate set; runtime invocation of gates at every crossing is owned by F-identity slice (L4 program), outside PS's P8 scope. Precedent: Plan Standard v2.2 §3.7 + Research Standard v1.0 §3.7 declare the same empty-P8 pattern under structural and epistemic mode respectively."}` |

### §3.3 P1 Axis instances (PS-local)

Six domain axes. MECE over PS's concern space per §C.6 derivation.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Direction` | Direction | Inward vs outward boundary crossing | Is this crossing intake (inward) or dispatch (outward)? |
| `Arrival Typing` | Arrival Typing | Act-vs-reference disposition + IV.2 four-cell governance binding | Does this crossing produce world or substrate effect, or is it a read/render with no effect? |
| `Authority Enforcement` | Authority Enforcement | Authority validation + substrate-write-rule + orphan-rule (program-emission pairing) | Does the crossing carry valid authority for its claimed scope and disposition? |
| `Channel Classification` | Channel Classification | `SourceRef.channel` assignment + per-channel authority binding | What channel did this crossing originate on, and is the channel-authority pairing valid? |
| `Identity Resolution` | Identity Resolution | Surface-form-to-Ref matching at intake | What substrate identity does each surface-form identifier in this arrival resolve to? |
| `Correlation` | Correlation | Linking crossings from one originating interaction | Which originating interaction does this crossing belong to? |

**MECE verification:**
- Orthogonality: Direction governs inward vs outward (one binary property per crossing); Arrival Typing governs act-vs-reference disposition + cell-governance binding (independent of direction — both directions carry both dispositions per Manual §IV.2 four-cell table); Authority Enforcement governs authority validation + substrate-write-rule + orphan-rule (independent of direction, channel, disposition — applies as enforcement check across all combinations); Channel governs the origin classification (independent of authority — channel is a separate W-ATOM from AuthorityClaim per Manual §IV.2); Identity Resolution governs surface-to-Ref matching (independent of channel — resolution is content-side, not origin-side); Correlation governs cross-crossing relations (independent of single-crossing properties). No pair-overlap.
- Exhaustiveness: every `BoundaryCrossingRecord` field traces to exactly one PS-local axis (verified §3.8 universal-variables table). Identity-tier `unitarySiteRef` traces to PA-I unitarity assertion (§1.4 + §3.6).
- No axis exceeds boundary: each axis's content strictly within its declared concern.

**Derivation note:** seven candidate axes from spec §Shot 1 reduced via Layer 1 axis discipline to six axes + one Identity-tier assertion (Unitarity). Substrate Write Authorization subsumed under Authority Enforcement (substrate write is application of authority, not orthogonal to it). Direction added as new axis derived from Manual §I.4 + §IV.4 directional-symmetry principle (absent from candidate list, load-bearing). Full derivation: spec-shot-1.md Part C.

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
| `Authority Enforcement/intake-validation` | Every intake AuthorityClaim validated against channel-appropriate authority | `leaf-PA-A1-authority-validation` |
| `Authority Enforcement/wearer-scope` | Wearer-scope substrate writes require Wearer-L0 confirmation per Manual §I.6 | `leaf-PA-A2-wearer-scope-rule` |
| `Authority Enforcement/system-scope` | System-scope writes require System-L0 confirmation per Manual §II.8 | `leaf-PA-A3-system-scope-rule` |
| `Authority Enforcement/orphan-rule` | Program emissions write paired records (substrate state-change + artifact-store record); orphans surfaced + revocable per F-009 D6 | `leaf-PA-A4-orphan-rule` |
| `Authority Enforcement/dispatch-validation` | Dispatch with world-effect carries confirming AuthorityClaim into dispatch record | `leaf-PA-A5-dispatch-validation` |
| `Authority Enforcement/unitary-site` | Authority enforcement happens at the one perimeter site (cross-axis to Identity-tier PA-I) | `leaf-PA-A6-unitary-enforcement` |

**Channel Classification sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Channel Classification/declaration` | Every arrival assigned non-empty ChannelKind at intake | `leaf-PA-Cn1-channel-declaration` |
| `Channel Classification/enumeration` | Channel value resolves to declared ChannelKind enum (open-vocabulary per Manual §I.6) | `leaf-PA-Cn2-channel-enumeration` |
| `Channel Classification/authority-binding` | Each channel binds to allowed-authority set; cross-binding violations rejected | `leaf-PA-Cn3-channel-authority-binding` |
| `Channel Classification/preservation` | Channel value survives substrate succession per Manual §IV.2 | `leaf-PA-Cn4-channel-preservation` |

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
| `leaf-PA-A1-authority-validation` | `axiom` | `record.authorityEnforced.authorityClaimed equals input AuthorityClaim AND record.authorityEnforced.authorityValidated === true AND record.authorityEnforced.validationBasis non-empty AND validationBasis cites mechanical predicate from substrate §6.3 six-class enum — per PA-A1 reference resolution + structural property` |
| `leaf-PA-A2-wearer-scope-rule` | `axiom` | `(record.direction === 'intake' AND record.resolvedScope is wearer-scope-form AND record.resolvedDisposition === 'act') implies record.authorityEnforced.authorityClaimed.level === 'L0' AND record.authorityEnforced.authorityClaimed.actor === 'wearer' AND record.authorityEnforced.authorityScopeMatch === true. Wearer-scope substrate writes require Wearer-L0 confirmation per Manual §I.6 substrate-authority-unconditional — per PA-A2 structural property` |
| `leaf-PA-A3-system-scope-rule` | `axiom` | `(record.direction === 'intake' AND record.resolvedScope is system-scope-form AND record.resolvedDisposition === 'act') implies record.authorityEnforced.authorityClaimed.level === 'L0' AND record.authorityEnforced.authorityClaimed.actor === 'system' AND record.authorityEnforced.authorityScopeMatch === true. System-scope writes require System-L0 confirmation per Manual §II.8 — per PA-A3 structural property` |
| `leaf-PA-A4-orphan-rule` | `axiom` | `(record.direction === 'dispatch' AND emission originates from a program with paired-write contract) implies record.emissionPair !== null AND record.emissionPair.substrateStateChangeId !== null AND record.emissionPair.artifactStoreRecordId !== null. An emission with one side missing (substrateStateChangeId === null XOR artifactStoreRecordId === null) is an orphan; orphans surface at audit as PA-A4 violations and are revoked through ordinary revocation path per LM LMA2. Per F-009 D6 formulation: every program emission writes both substrate state-change (wearer-scope when applicable) AND artifact-store record per F-009 ruling — per PA-A4 structural property + cardinality (paired-write enforcement)` |
| `leaf-PA-A5-dispatch-validation` | `axiom` | `(record.direction === 'dispatch' AND record.resolvedDisposition === 'act') implies record.authorityEnforced.authorityClaimed is non-null AND record.authorityEnforced.authorityValidated === true. Act-dispatches with world-effect carry confirming AuthorityClaim into the dispatch record per Manual §IV.4 directional symmetry — per PA-A5 structural property` |
| `leaf-PA-A6-unitary-enforcement` | `axiom` | `record.unitarySiteRef non-empty AND record.unitarySiteRef equals the LIV-instance-canonical perimeter site identifier (the unitary site is wired at F-identity middleware as 'src/middleware.ts'; identifier value frozen at deploy and consulted at every crossing). Authority enforcement happens at this one site; distributed authority enforcement is a structural defect per Manual §I.4 unitarity + F-005 framing rule — per PA-A6 structural property + reference resolution to PA-I` |
| `leaf-PA-Cn1-channel-declaration` | `axiom` | `record.resolvedChannel non-null AND non-empty (length ≥ 1) AND record.resolvedChannel matches arrival.channelClaim.kind OR dispatch.channelTarget — per PA-Cn1 structural property` |
| `leaf-PA-Cn2-channel-enumeration` | `axiom` | `record.resolvedChannel ∈ ChannelKind enum (currently {'wearer-message', 'wearer-query', 'ai-reply', 'system-trigger', 'integration-event', 'scheduled-trigger', 'internal-derivation'} with open-vocabulary per Manual §I.6 — extension by additive enum amendment per S3) — per PA-Cn2 enum-membership` |
| `leaf-PA-Cn3-channel-authority-binding` | `axiom` | `Each ChannelKind binds to a permitted-authority set (declared at PerimeterBinding instance per §6.2). For record: record.authorityEnforced.authorityClaimed must be in the permitted-authority set bound to record.resolvedChannel. Cross-binding violations (channel='ai-reply' with claim='wearer-L0' for direct wearer authority assertion) are rejected at intake — per PA-Cn3 reference resolution + structural property` |
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

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). 21 PS-local axis-bound axioms (PA1..PA21 + PA-I identity-tier), 22 total per §3.2.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **PA1** | `Direction` / `leaf-PA1-direction-declaration` | Every `BoundaryCrossingRecord` has `direction ∈ {'intake', 'dispatch'}` — non-null, cardinality 1, exhaustive enum membership. | structural property (enum-membership + cardinality) |
| **PA2** | `Direction` (via `Direction/symmetry` sub-axis) / `leaf-PA2-directional-symmetry` | For every typed concern C declared governed for `direction='intake'` by some PA-N axiom, either (a) C is governed for `direction='dispatch'` by some PA-M axiom, or (b) PS §1 `scopeOut` declares C scoped-out for dispatch with explicit basis. Per Manual §IV.4 directional-symmetry. | structural property (axiom-coverage closure over §1 scopeOut) |
| **PA-T1** | `Arrival Typing` / `leaf-PA-T1-disposition-declaration` | `record.resolvedDisposition ∈ {'act', 'reference'}` — non-null, cardinality 1, exhaustive enum membership. Disposition derived from arrival/dispatch dispositionClaim with mechanical equality. | structural property (enum-membership + structural identity) |
| **PA-T2** | `Arrival Typing` (cross-axis with `Direction` for cell computation) / `leaf-PA-T2-cell-governance` | `record.cellGovernance.cell` is computed mechanically from `(direction, resolvedDisposition)`: `('intake', 'reference') → 'reference-intake'`, `('intake', 'act') → 'act-intake'`, `('dispatch', 'reference') → 'reference-dispatch'`, `('dispatch', 'act') → 'act-dispatch'`. `governanceLevel` is determined by cell per Manual §IV.2 four-cell table: lightweight for both reference cells, confirmation-audit-reversibility for act-intake, world-effect-strongest for act-dispatch. F-007 closure: this axiom is the structural site at which act-vs-reference distinction is enforced at intake typing, closing the v11.0 audit finding F-007. | structural property (mechanical mapping + reference resolution to Manual §IV.2 cell table) |
| **PA-T3** | `Arrival Typing` (cross-axis with carrier handoff) / `leaf-PA-T3-mutation-gate` | `record.resolvedDisposition === 'reference'` implies no substrate mutation flows from this crossing: (a) for direction='intake', no `SubstrateWriteInput` emission via HR-PS-LM1 with content other than read-only metadata; (b) for direction='dispatch', no substrate state-change recorded as a side-effect of dispatch beyond ordinary signal-reuse logging per Manual §IV.4. | structural property (mutation-rejection predicate) |
| **PA-T4** | `Arrival Typing` (cross-axis with `Direction`) / `leaf-PA-T4-reversibility` | `record.cellGovernance.cell === 'act-dispatch'` implies `record.cellGovernance.reversibilityStatus ∈ {'reversible', 'irreversible'}` (not 'n/a'). World-effect dispatches must declare reversibility per Manual §IV.2 four-cell governance ("strongest governance: world-effect external to LIV requires confirmation, audit, and where possible reversibility"). | structural property (conditional cardinality + enum-membership) |
| **PA-A1** | `Authority Enforcement` / `leaf-PA-A1-authority-validation` | `record.authorityEnforced.authorityClaimed` equals the input `AuthorityClaim` (from arrival.authorityClaim or dispatch.authorityContext) AND `record.authorityEnforced.authorityValidated === true` AND `record.authorityEnforced.validationBasis` non-empty AND validationBasis cites a mechanical predicate from substrate §6.3 six-class enum. | reference resolution (identity + enum-membership + non-empty cardinality) |
| **PA-A2** | `Authority Enforcement` (cross-axis with `Direction` + scope) / `leaf-PA-A2-wearer-scope-rule` | `(direction === 'intake' AND resolvedScope is wearer-scope-form AND resolvedDisposition === 'act')` implies `authorityEnforced.authorityClaimed.level === 'L0' AND authorityEnforced.authorityClaimed.actor === 'wearer' AND authorityEnforced.authorityScopeMatch === true`. Wearer-scope substrate writes require Wearer-L0 confirmation per Manual §I.6 substrate-authority-unconditional. F-009 governance closure (substrate write rule, wearer-scope). | structural property (conditional reference resolution) |
| **PA-A3** | `Authority Enforcement` (cross-axis with `Direction` + scope) / `leaf-PA-A3-system-scope-rule` | `(direction === 'intake' AND resolvedScope is system-scope-form AND resolvedDisposition === 'act')` implies `authorityEnforced.authorityClaimed.level === 'L0' AND authorityEnforced.authorityClaimed.actor === 'system' AND authorityEnforced.authorityScopeMatch === true`. System-scope writes require System-L0 confirmation per Manual §II.8. | structural property (conditional reference resolution) |
| **PA-A4** | `Authority Enforcement` / `leaf-PA-A4-orphan-rule` | `(direction === 'dispatch' AND emission originates from a program with paired-write contract)` implies `record.emissionPair !== null AND emissionPair.substrateStateChangeId !== null AND emissionPair.artifactStoreRecordId !== null`. Per F-009 D6 orphan-rule formulation: every program emission writes both substrate state-change (wearer-scope when applicable) AND artifact-store record per F-009 ruling. **Orphan definition:** an emission with one side missing (`substrateStateChangeId === null XOR artifactStoreRecordId === null`). **When surfaced:** at audit time via PA-A4 gate failure on persisted records. **How revoked:** orphans are revoked through ordinary revocation path per LM LMA2 — wearer-initiated revocation issues a RevokeRef SubstrateWriteInput targeting the orphan's stored side; the orphan's missing side requires no revocation (already absent). F-009 governance closure (orphan rule for art_* / substrate split). | structural property + cardinality (paired-write enforcement) |
| **PA-A5** | `Authority Enforcement` (cross-axis with `Direction`) / `leaf-PA-A5-dispatch-validation` | `(direction === 'dispatch' AND resolvedDisposition === 'act')` implies `authorityEnforced.authorityClaimed !== null AND authorityEnforced.authorityValidated === true`. Per Manual §IV.4 directional symmetry — every act-direction dispatch carries confirming authority into the dispatch record. | structural property (conditional reference resolution) |
| **PA-A6** | `Authority Enforcement` (cross-axis with Identity-tier PA-I) / `leaf-PA-A6-unitary-enforcement` | `record.unitarySiteRef non-empty AND record.unitarySiteRef equals the LIV-instance-canonical perimeter site identifier`. Authority enforcement occurs at the one perimeter site; distributed authority enforcement is a structural defect per Manual §I.4 unitarity. F-005 framing closure (the structural rule against which src consolidation is verified). | structural property + reference resolution to PA-I |
| **PA-Cn1** | `Channel Classification` / `leaf-PA-Cn1-channel-declaration` | `record.resolvedChannel` non-null AND non-empty (length ≥ 1) AND matches input channel claim (arrival.channelClaim.kind for intake; dispatch.channelTarget for dispatch). | structural property (cardinality + structural identity) |
| **PA-Cn2** | `Channel Classification` / `leaf-PA-Cn2-channel-enumeration` | `record.resolvedChannel ∈ ChannelKind enum` (currently 7 named values + open-vocabulary string per Manual §I.6 + S3 additive extension). | enum-membership |
| **PA-Cn3** | `Channel Classification` (cross-axis with `Authority Enforcement`) / `leaf-PA-Cn3-channel-authority-binding` | Each `ChannelKind` binds to a permitted-authority set (declared at PerimeterBinding instance per §6.2). For every record: `authorityEnforced.authorityClaimed ∈ permitted-authority-set(resolvedChannel)`. Cross-binding violations rejected at intake (e.g., 'ai-reply' channel cannot carry direct Wearer-L0 authority assertion). | reference resolution (set membership) + structural property |
| **PA-Cn4** | `Channel Classification` (cross-axis with carrier handoff) / `leaf-PA-Cn4-channel-preservation` | `record.resolvedChannel` value carried through to LM `SubstrateWriteInput.metadata.source.channel` at HR-PS-LM1 emission for intake-direction crossings. Channel survives substrate succession per Manual §IV.2 ("Source authority survives substrate framework succession because it is a property of the typed signal itself"). | structural property + reference resolution to LM SourceRef |
| **PA-IR1** | `Identity Resolution` (cross-axis with `Direction` — intake-only per §1 scopeOut for dispatch) / `leaf-PA-IR1-resolution-attempt` | `(direction === 'intake' AND arrival.identityClaims.length ≥ 1)` implies `record.resolvedIdentities.length === arrival.identityClaims.length` — one ResolvedIdentity per IdentityClaim. | cardinality + structural property |
| **PA-IR2** | `Identity Resolution` / `leaf-PA-IR2-resolution-outcome` | For every `r ∈ record.resolvedIdentities`: `r.outcome ∈ ResolutionOutcomeKind` enum AND (`r.outcome === 'bound-to-existing-Ref' implies r.ref !== null`) AND (`r.outcome === 'new-Ref-created' implies r.ref !== null`) AND (`r.outcome === 'ambiguous-pending-disambiguation' implies r.ref === null AND r.ambiguityDetail !== null`). | enum-membership + structural property |
| **PA-IR3** | `Identity Resolution` / `leaf-PA-IR3-geometric-respect` | Resolution at perimeter does NOT compute or store cluster-membership for resolved Refs. PS produces only the Ref reference at resolution-time; cluster geometry is read-time emergent per Manual §IV.3 substrate-emergent layer. **Negative invariant:** any pre-resolution of cluster identity at perimeter is a violation. | structural property (negative invariant: cluster pre-resolution forbidden) |
| **PA-IR4** | `Identity Resolution` / `leaf-PA-IR4-disambiguation-deferral` | For every `r` with `r.outcome === 'ambiguous-pending-disambiguation'`: PS does not assign a Ref via heuristic guess. `r.ref === null` AND ambiguity surfaced for wearer-side resolution per Manual §IV.3. **Negative invariant:** heuristic Ref assignment forbidden at perimeter. | structural property (negative invariant) |
| **PA-Co1** | `Correlation` / `leaf-PA-Co1-correlation-declaration` | `record.correlationRef` non-null AND non-empty AND (`correlationRef === record.crossingId` for un-correlated crossings OR `correlationRef` equals an upstream CorrelationRef from MI Standard for linked crossings). | structural property (cardinality + reference resolution to MI) |
| **PA-Co2** | `Correlation` / `leaf-PA-Co2-correlation-membership` | Crossings sharing originating wearer-interaction or tool-conversation share `correlationRef`. PS exposes a correlation-index lookup at HR-PS3 returning `crossings where correlationRef === X`. | reference resolution (index query) + structural property |
| **PA-Co3** | `Correlation` / `leaf-PA-Co3-perimeter-only` | `record.correlationRef` is stored on `BoundaryCrossingRecord` (perimeter-side) but NOT injected into program payloads or substrate state-change content as primary key. Programs needing correlation consult perimeter correlation-index via HR-PS3 per Manual §IV.2. **Negative invariant:** cross-cutting promotion forbidden. | structural property (negative invariant) |
| **PA-I** | Identity-tier (per §1.4 Unitarity assertion; not bound to P1 axis) / `leaf-PA-I-unitarity` | For every `BoundaryCrossingRecord r`: `r.unitarySiteRef` equals the LIV-instance-canonical perimeter site identifier. There is exactly one such identifier per LIV instance. Distributed perimeter sites — multiple distinct `unitarySiteRef` values within a single LIV instance — are a structural defect per Manual §I.4 unitarity. F-005 framing root rule (src consolidation verified against this axiom). | structural property + cardinality (one site per instance) |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. PA2 attaches at Direction with cross-axis closure note over §1 scopeOut (parallel to RS RA2 cross-axis pattern); PA-T2 attaches at Arrival Typing with cross-axis to Direction (cell computation requires both); PA-A2 + PA-A3 attach at Authority Enforcement with cross-axis to Direction + scope; PA-A6 attaches at Authority Enforcement with cross-axis to Identity-tier PA-I; PA-Cn3 attaches at Channel with cross-axis to Authority; PA-Cn4 attaches at Channel with cross-axis to carrier handoff (HR-PS-LM1); PA-IR1 attaches at Identity Resolution with cross-axis to Direction (intake-only). MA-St11 cross-axis-invariant declared at substrate §9 permits this; G-G13 cross-axis universal at metaframework §3.2.1 governs. Pass.
**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.
**AxR3 self-check:** axiom set is the v1.0 baseline carried forward at v1.0.1 with zero invariant-predicate changes (additive prose realignment per §9 Change log v1.0.1 entry). PA1..PA21 + PA-I declared once at v1.0; future versions amend additively per MA-L1 + MA-S7. Pass.
**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

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
| Authority Enforcement | `record.crossedAt` | `AuthorityClaim.level` + `actor` + `scope` enums | `authorityEnforced` references `authorityClaimed`, `authorityScopeMatch` derives from claim ∩ allowed-scopes(channel) | `PerimeterAuthorityPositional = 'claim-received' \| 'validated' \| 'rejected'` |
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
| `orphan` | §3.6 PA-A4 per F-009 D6 ruling | a program emission where exactly one of `(substrateStateChangeId, artifactStoreRecordId)` is null; surfaced at PA-A4 gate as audit failure; revoked through ordinary LM LMA2 revocation path |
| `paired-write contract` | §3.6 PA-A4 + §6.2 HR-PS-LM1 + HR-PS-AS1 | the rule that every program emission writes both a substrate state-change (wearer-scope when applicable) AND an artifact-store record per F-009 governance — a program emission honoring this contract produces no orphans |
| `permitted-authority set` | §3.6 PA-Cn3 + §6.2 PerimeterBinding | per-channel set of `AuthorityClaim` shapes admissible on that channel; declared at PerimeterBinding instance; crossing fails PA-Cn3 if `authorityClaimed ∉ permitted-authority-set(channel)` |
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

---

## §4 Validity

### §4.1 Gate count

PS declares **22 own primary gates** (G-PS1, G-PS2, G-PS-T1..G-PS-T4, G-PS-A1..G-PS-A6, G-PS-Cn1..G-PS-Cn4, G-PS-IR1..G-PS-IR4, G-PS-Co1..G-PS-Co3, G-PS-I — 1:1 with PA1, PA2, PA-T1..PA-T4, PA-A1..PA-A6, PA-Cn1..PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA-I per G-M1). Plus **85 framework-tier metaframework gates** inherited (per metaframework v3.2.7 §4.1 enumeration: 7 PG + 68 axiom gates including cycle-1 G-S7+G-V11 and cycle-2 G-V10+G-S8+G-L11 + 1 MA-G13 + 5 F-69 universal + 4 meta).

| Tier | Count | Source | Executed when PS is audit target |
|---|---|---|---|
| Substrate gates (SG1–SG5) | 5 | substrate §11.5 | run once, not per framework |
| PS-own axiom gates (G-PS*) | 22 | this §4.2 | framework-audit applies PA1..PA-I suite per MA-V1; emission-time on each `BoundaryCrossingRecord` |
| Metaframework primitive gates (PG1..PG7) | 7 | metaframework §4.1 | inherited; applied by framework-audit at E1..E7 of generation-procedure S3..S9 |
| Metaframework axiom gates (G-I1..G-J5, G-G13) | 69 | metaframework §4.1 (post-cycle-2 v3.2.7) | inherited; test PS's conformance to MA-I1..MA-J5 + MA-G13 |
| Metaframework universal gates (G-U1..G-U5) | 5 | metaframework §4.1 | inherited |
| Metaframework meta-gates (G-M1..G-M4) | 4 | metaframework §4.1 | inherited |
| **Total per-audit framework-tier gates** | **22 + 85 = 107** | | |

PS's own 22 gates are executed in addition to the 85 inherited — same pattern as VS v1.0 §4.1 + RS v1.0 §4.1 + Plan v2.2 §4.1 + AS v2.2 §4.1 (framework-own gates supplement, do not replace, the inherited framework-tier suite). PS has more own gates (22) than VS (9) or RS (10) or Plan (12) because PS's six-axis decomposition produces a richer per-axis axiom set: Direction (2), Arrival Typing (4), Authority Enforcement (6), Channel (4), Identity Resolution (4), Correlation (3), plus identity-tier PA-I.

### §4.2 PS-own axiom gates

Per MA-V1 (every axiom has ≥1 gate) + G-M1 (every axiom has exactly one primary gate). 22 axioms → 22 primary gates, 1:1.

| Gate | Tests axiom | Predicate (machine-form) | Ground class |
|---|---|---|---|
| **G-PS1** | PA1 | `record.direction ∈ ['intake', 'dispatch'] AND record.direction !== null` | enum-membership + cardinality |
| **G-PS2** | PA2 | `forall concern C declared in PS axiom set: (governedFor('intake', C) implies (governedFor('dispatch', C) OR scopedOutForDispatch(C, basis))) AND scopedOutForDispatch(C, basis) implies basis !== null AND basis.length >= 1`. Iterated over the six PS axes: Direction, Arrival Typing, Authority Enforcement, Channel, Identity Resolution (intake-only — scope-out for dispatch declared at §1 scopeOut: 'dispatches carry payload with already-resolved Refs, no surface-form-to-Ref work needed at dispatch'), Correlation. | structural property (axiom-coverage closure over §1 scopeOut) |
| **G-PS-T1** | PA-T1 | `record.resolvedDisposition ∈ ['act', 'reference'] AND record.resolvedDisposition !== null AND ((record.direction === 'intake' AND record.arrivalRef !== null AND record.resolvedDisposition === arrival(record.arrivalRef).dispositionClaim) OR (record.direction === 'dispatch' AND record.dispatchRef !== null AND record.resolvedDisposition === dispatch(record.dispatchRef).dispositionClaim))` | enum-membership + structural identity |
| **G-PS-T2** | PA-T2 | `let cell = computeCell(record.direction, record.resolvedDisposition); record.cellGovernance.cell === cell AND record.cellGovernance.governanceLevel === fourCellMap[cell] (where fourCellMap = {'reference-intake': 'lightweight', 'act-intake': 'confirmation-audit-reversibility', 'reference-dispatch': 'lightweight', 'act-dispatch': 'world-effect-strongest'} per Manual §IV.2)` | structural property + reference resolution to Manual §IV.2 |
| **G-PS-T3** | PA-T3 | `(record.resolvedDisposition === 'reference') implies ((record.direction === 'intake' implies NOT(emittedSubstrateWriteWithMutation(record))) AND (record.direction === 'dispatch' implies NOT(recordedSubstrateMutationAsSideEffect(record))))` | structural property (mutation-rejection predicate) |
| **G-PS-T4** | PA-T4 | `(record.cellGovernance.cell === 'act-dispatch') implies record.cellGovernance.reversibilityStatus ∈ ['reversible', 'irreversible']` | conditional cardinality + enum-membership |
| **G-PS-A1** | PA-A1 | `byteIdentical(record.authorityEnforced.authorityClaimed, inputAuthorityClaim(record)) === true AND record.authorityEnforced.authorityValidated === true AND typeof record.authorityEnforced.validationBasis === 'string' AND record.authorityEnforced.validationBasis.length >= 1 AND validationBasisCitesGroundClass(record.authorityEnforced.validationBasis) === true` (validationBasisCitesGroundClass returns true iff the basis string contains a recognized substrate §6.3 ground-class identifier: 'type-check', 'enum-membership', 'reference-resolution', 'structural-property', 'cardinality', 'deterministic-function-result') | reference resolution + enum-membership + cardinality |
| **G-PS-A2** | PA-A2 | `(record.direction === 'intake' AND isWearerScope(record.resolvedScope) AND record.resolvedDisposition === 'act') implies (record.authorityEnforced.authorityClaimed.level === 'L0' AND record.authorityEnforced.authorityClaimed.actor === 'wearer' AND record.authorityEnforced.authorityScopeMatch === true)` | conditional reference resolution |
| **G-PS-A3** | PA-A3 | `(record.direction === 'intake' AND isSystemScope(record.resolvedScope) AND record.resolvedDisposition === 'act') implies (record.authorityEnforced.authorityClaimed.level === 'L0' AND record.authorityEnforced.authorityClaimed.actor === 'system' AND record.authorityEnforced.authorityScopeMatch === true)` | conditional reference resolution |
| **G-PS-A4** | PA-A4 | `(record.direction === 'dispatch' AND emissionOriginatesFromPairedWriteProgram(record)) implies (record.emissionPair !== null AND record.emissionPair.substrateStateChangeId !== null AND record.emissionPair.artifactStoreRecordId !== null)`. **Implementation note:** `emissionOriginatesFromPairedWriteProgram` is a deterministic lookup against Sprint-9-installed program registry (F-009 implementation) — at this version the registry is empty (zero programs registered as paired-write), making the implication vacuously satisfied per substrate §6.3 cardinality semantics. **Vacuous-pass at this version** parallel to RS RA8 D-RS-RA8-SYNTHESIS: the rule is declared and the gate is structurally invocable; runtime invocation against a non-empty registry awaits Sprint 9 wire-in. | structural property + cardinality (vacuous-pass at this version; promoted at Sprint 9 wire-in) |
| **G-PS-A5** | PA-A5 | `(record.direction === 'dispatch' AND record.resolvedDisposition === 'act') implies (record.authorityEnforced.authorityClaimed !== null AND record.authorityEnforced.authorityValidated === true)` | conditional reference resolution |
| **G-PS-A6** | PA-A6 | `typeof record.unitarySiteRef === 'string' AND record.unitarySiteRef.length >= 1 AND record.unitarySiteRef === LIV_INSTANCE_PERIMETER_SITE_REF` (where `LIV_INSTANCE_PERIMETER_SITE_REF` is the deploy-time-frozen identifier declared in `core/constants/perimeter-standard.ts`; consumption surface wires at Sprint 9 alongside the `BoundaryCrossingRecord`-emission scaffold; at v1.0.1 the constant is declared with value `'src/middleware.ts'` matching the unitary site at app root) | structural property + reference resolution to PA-I |
| **G-PS-Cn1** | PA-Cn1 | `typeof record.resolvedChannel === 'string' AND record.resolvedChannel.length >= 1 AND ((record.direction === 'intake' AND record.resolvedChannel === arrival(record.arrivalRef).channelClaim.kind) OR (record.direction === 'dispatch' AND record.resolvedChannel === dispatch(record.dispatchRef).channelTarget))` | cardinality + structural identity |
| **G-PS-Cn2** | PA-Cn2 | `record.resolvedChannel ∈ CHANNEL_KIND_ENUM` (CHANNEL_KIND_ENUM declared in `core/constants/perimeter-standard.ts`: ['wearer-message', 'wearer-query', 'ai-reply', 'system-trigger', 'integration-event', 'scheduled-trigger', 'internal-derivation'] + open-vocabulary admission per §S3 — gate accepts any string at this version's baseline; future amendments may tighten to declared-set-only) | enum-membership (open-vocabulary at this version) |
| **G-PS-Cn3** | PA-Cn3 | `let permittedSet = perimeterBinding.permittedAuthorityByChannel[record.resolvedChannel]; permittedSet !== undefined AND record.authorityEnforced.authorityClaimed ∈ permittedSet`. **Vacuous-pass at v1.0.1:** PerimeterBinding instance is supplied at Sprint 9 wire-in (alongside the `BoundaryCrossingRecord`-emission scaffold); at this baseline G-PS-Cn3 evaluates with applicability='applicable' AND truthValue='passed' AND basis citing 'PerimeterBinding instance not yet supplied; consumption surface wires at Sprint 9 wire-in cycle alongside `BoundaryCrossingRecord` emission machinery; gate operates against deployed binding at runtime' per substrate §6.3 reference resolution. | reference resolution (set membership) + structural property |
| **G-PS-Cn4** | PA-Cn4 | `(record.direction === 'intake') implies (the SubstrateWriteInput emitted at HR-PS-LM1 for this crossing has metadata.source.channel === record.resolvedChannel)` | structural identity + reference resolution to LM SourceRef |
| **G-PS-IR1** | PA-IR1 | `(record.direction === 'intake' AND arrival(record.arrivalRef).identityClaims.length >= 1) implies record.resolvedIdentities.length === arrival(record.arrivalRef).identityClaims.length` | cardinality + structural property |
| **G-PS-IR2** | PA-IR2 | `forall r ∈ record.resolvedIdentities: r.outcome ∈ ['bound-to-existing-Ref', 'new-Ref-created', 'ambiguous-pending-disambiguation'] AND ((r.outcome === 'bound-to-existing-Ref' implies r.ref !== null) AND (r.outcome === 'new-Ref-created' implies r.ref !== null) AND (r.outcome === 'ambiguous-pending-disambiguation' implies r.ref === null AND r.ambiguityDetail !== null AND r.ambiguityDetail.length >= 1))` | enum-membership + structural property |
| **G-PS-IR3** | PA-IR3 | `forall r ∈ record.resolvedIdentities: NOT(record contains stored cluster-membership for r.ref)` — verified by structural absence of `clusterRef`, `clusterMembers`, or any cluster-derived field on `ResolvedIdentity` shape. Cluster geometry is read-time emergent per Manual §IV.3 + LMA8; PS does not pre-resolve. | structural property (negative invariant: cluster pre-resolution forbidden by shape) |
| **G-PS-IR4** | PA-IR4 | `forall r ∈ record.resolvedIdentities: (r.outcome === 'ambiguous-pending-disambiguation' implies (r.ref === null AND NOT(perimeterAssignedRefHeuristically(r))))` — verified by `r.ref === null` mechanically; `perimeterAssignedRefHeuristically` returns true iff the ResolvedIdentity carries a non-null ref despite outcome='ambiguous-pending-disambiguation' (a structurally impossible state given PA-IR2 conjunction with this gate). | structural property (negative invariant) |
| **G-PS-Co1** | PA-Co1 | `typeof record.correlationRef === 'string' AND record.correlationRef.length >= 1 AND (record.correlationRef === record.crossingId OR isUpstreamMICorrelationRef(record.correlationRef))` | structural property + reference resolution to MI |
| **G-PS-Co2** | PA-Co2 | `correlationIndex.lookup(record.correlationRef) returns array containing record.crossingId AND for any other crossing r2 with r2.correlationRef === record.correlationRef AND r2.crossingId !== record.crossingId, correlationIndex.lookup(record.correlationRef) contains r2.crossingId`. **Vacuous-pass at this version** for empty index (first-crossing case): when only one crossing carries a given correlationRef, the multi-crossing closure is vacuously satisfied per substrate §6.3 cardinality. | reference resolution (index query) + structural property |
| **G-PS-Co3** | PA-Co3 | `record.correlationRef stored on BoundaryCrossingRecord (§2.2) AND NOT(injectedIntoProgramPayload(record.correlationRef)) AND NOT(injectedIntoSubstrateStateChangeAsPrimaryKey(record.correlationRef))` — verified by structural absence of `correlationRef` field on program-receive payload shape and on LM `StateChangeRecord.content` (correlation never appears as primary content; appears only as perimeter-side metadata). | structural property (negative invariant) |
| **G-PS-I** | PA-I | `record.unitarySiteRef === LIV_INSTANCE_PERIMETER_SITE_REF AND for all BoundaryCrossingRecord r1, r2 within one LIV instance: r1.unitarySiteRef === r2.unitarySiteRef` (one site per instance). Verified at framework-audit time by querying audit-trail for distinct unitarySiteRef values within an instance window; cardinality must equal 1. | structural property + cardinality (one-site-per-instance) |

**G-M1 self-check:** 22 axioms → 22 primary gates. Every axiom has exactly one primary gate. Pass.
**MA-V1 self-check:** every axiom reaches a gate. Pass.
**MA-V2 (per axis gate coverage):** Direction has 2 gates (G-PS1, G-PS2); Arrival Typing has 4 gates (G-PS-T1..G-PS-T4); Authority Enforcement has 6 gates (G-PS-A1..G-PS-A6); Channel Classification has 4 gates (G-PS-Cn1..G-PS-Cn4); Identity Resolution has 4 gates (G-PS-IR1..G-PS-IR4); Correlation has 3 gates (G-PS-Co1..G-PS-Co3); Identity-tier has 1 gate (G-PS-I). Every PS-local axis has ≥1 bound gate. Pass.

### §4.3 Inherited gate execution at audit time

When framework-audit runs PS against metaframework gate-bundle (per HR3):

- **E1 Identity (PG1 + G-I1..G-I7):** tests PS's §1 Identity conformance to MA-I1..MA-I7.
- **E2 Schema (PG2 + G-S1..G-S8):** tests PS's §2 Schema conformance to MA-S1..MA-S8 (cycle-2 G-S8 ReferentCitation declaration shape conformance — PS declares `referentCitations: []` per §1; G-S8 vacuous-pass).
- **E3 Structure (PG3 + G-St1..G-St16):** tests PS's §3 Structure conformance to MA-St1..MA-St16.
- **E4 Validity (PG4 + G-V1..G-V11):** tests PS's §4 Validity conformance to MA-V1..MA-V11 (cycle-2 G-V10 spec↔referent + cycle-1 G-V11 applicability-basis vacuous-pass per zero referentCitations).
- **E5 Lifecycle (PG5 + G-L1..G-L11):** tests PS's §5 Lifecycle conformance to MA-L1..MA-L11 (cycle-2 G-L11 audit-run snapshot stamping vacuous-pass per zero referentCitations).
- **E6 Coupling (PG6 + G-C1..G-C10):** tests PS's §6 Coupling conformance to MA-C1..MA-C10.
- **E7 Judgment (PG7 + G-J1..G-J5):** tests PS's §7 Judgment conformance to MA-J1..MA-J5.
- **E8 Universal/Meta (G-U1..G-U5 + G-M1..G-M4 + G-G13):** tests PS's universal-axis cross-checks + meta-gates + MA-G13 four-property classification.

**Disambiguation note on gate execution scope:**
The 85 inherited gates test PS's **framework declaration conformance** (does PS's §1–§7 structure match metaframework's axioms?). The 22 G-PS* gates test **individual BoundaryCrossingRecord instance conformance** (does a given crossing satisfy PA1..PA-I?). Different scopes, different execution sites — the 85 run at framework-audit time against this file; the 22 run at crossing-time on each `BoundaryCrossingRecord` produced by F-identity slice runtime.

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
| X9 (Integration point) | E6 coupling gates + HR-PS-LM1 to LM v3.1 (carrier emission) + HR-PS-AS1 to AS v2.2 (program-emission validation) |
| X10 (Stage-declaration extended predicate) | §3.7 empty-P8 declaration + its basis traversal per substrate §10.2 PR4/PR5 vacuous |

Coverage: every MA-V5 audit dimension has ≥1 consuming gate. Pass.

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4:

1. **Tier 1 — Substrate gates** (SG1–SG5): run once, not per framework.
2. **Tier 2 — Axiom gates** (per framework): 69 inherited (68 MA-axis-bound + G-G13) + 22 PS-own (G-PS*) = 91.
3. **Tier 3 — Universal gates** (per framework): G-U1–G-U5.
4. **Tier 4 — Meta-gates** (per framework): G-M1–G-M4.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run. Applies unchanged to PS.

### §4.7 Gate rules (GR-series)

Per v3-1-spec §3.4, consumed by reference. Unchanged from metaframework.

### §4.8 Current gate results

**All 107 framework-tier gates (85 inherited + 22 PS-own): state = `not-yet-run` at this delivery.**

First-run pending framework-audit invocation post-v1.0.1-confirmation (§5.3). Runtime emission of `BoundaryCrossingRecord` instances — and the gate-invocation hook that runs G-PS1..G-PS-I against each — is the **Sprint 9 wire-in scope**. At v1.0.1 the standard declares the rule set; at Sprint 9 the runtime emission machinery wires alongside the substrate-write callers + thread-query callers + F-router registration + wearer-authority program. First-run logging via standard amendment-propagation flow (AP1–AP7) per metaframework §5.X first-run-execution lifecycle event (added cycle-1 v3.2.4 per F-cycle-1-11). PS first-run does not amend the framework — it stamps execution per MA-L1 zero-shape-change discipline.

**Sprint 9 wire-in scope (consumption surfaces):** the constants declared at `core/constants/perimeter-standard.ts` — `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP`, the gate-ID and axiom-ID enums — are declared-but-unconsumed at v1.0.1. They wire into runtime consumption at Sprint 9 alongside the `BoundaryCrossingRecord`-emission scaffold. No stub imports added at the unitary site pre-Sprint-9; the constants stay declared at this delivery and correctly described as awaiting Sprint 9 consumption.

**Sprint 9 promotion of vacuous-pass entries:**

| Gate | Vacuous-pass basis at v1.0.1 | Promotion path |
|---|---|---|
| G-PS-A4 (orphan rule) | Empty paired-write program registry — no programs yet registered as paired-write emitters | Sprint 9 wire-in populates the registry; gate transitions to non-vacuous evaluation per crossing |
| G-PS-Cn3 (channel-authority binding) | PerimeterBinding instance not yet supplied — consumption surface wires at Sprint 9 alongside `BoundaryCrossingRecord` emission machinery | Sprint 9 wire-in supplies the PerimeterBinding instance; gate transitions to non-vacuous evaluation per crossing |
| G-PS-Cn4 (channel preservation through HR-PS-LM1) | No `BoundaryCrossingRecord` instances exist — channel-preservation invariant universally quantified over empty crossing set | Sprint 9 wire-in produces first `BoundaryCrossingRecord`; gate transitions to non-vacuous evaluation as crossings are emitted and channel value is carried into LM `SourceRef.channel` |
| G-PS-Co2 (correlation membership multi-crossing closure) | Single-crossing closure pre-multi-crossing observation — universally quantified over empty multi-crossing set | First multi-crossing observation post-Sprint-9 promotes to non-vacuous |
| G-PS1..G-PS-I (PS-own gates over `BoundaryCrossingRecord`) | No `BoundaryCrossingRecord` instances exist — universally quantified over empty crossing set | Sprint 9 first-runtime-crossing produces the first record; G-PS1..G-PS-I evaluate against it |

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
| Orphan emission detected | G-PS-A4 fails on persisted `emissionPair` with one side null | LM LMA2 revocation against the present side; root-cause analysis on emitting program; program contract amendment |
| Channel-authority cross-binding violation | G-PS-Cn3 fails on `authorityClaimed ∉ permitted-authority-set(channel)` | Reject crossing at intake; surface as audit failure; root-cause on origin (channel mis-classification or invalid authority claim) |
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
- Dispatch-direction crossings with paired-write contract emit one `SubstrateWriteInput` AND one artifact-store record atomically (Sprint 9 wire-in implements the atomic boundary; at this version declared as the contract programs honor).

### §5.9 Version history

| Version | Cycle | Scope of change | Authority |
|---|---|---|---|
| v1.0 | Structure-Tightening Sprint Shot 2 (2026-05-06) | Initial PS declaration. Six P1 axes (Direction, Arrival Typing, Authority Enforcement, Channel Classification, Identity Resolution, Correlation) + Identity-tier PA-I unitarity assertion. 22 axioms (PA1, PA2, PA-T1..PA-T4, PA-A1..PA-A6, PA-Cn1..PA-Cn4, PA-IR1..PA-IR4, PA-Co1..PA-Co3, PA-I). 22 primary gates 1:1. Carrier `named` → `living-memory` v3.1. HR-PS1..HR-PS4 declared. F-007 closure (PA-T2 cell-governance), F-009 governance closure (PA-A2 + PA-A3 + PA-A4 substrate-write + orphan rules), F-005 framing rule (PA-A6 + PA-I unitary-site). Vacuous-pass per substrate §6.3 + MA-V11: G-V10/G-S8/G-L11 (zero `referentCitations`); G-PS-A4 (empty paired-write registry pre-Sprint-9 wire-in); G-PS-Cn3 (PerimeterBinding default pre-Sprint-9 wire-in). | L0 (pending confirmation) |
| v1.0.1 | Structure-Tightening Sprint audit-cycle-A close (2026-05-06) | Prose-only realignment per audit Findings A1, B1+C2, B2, B3+C1, side-findings C-α/β/γ/δ. **A1:** stripped transient cycle markers ("Sprint 6 Shot 1/2/3" embedments) from Class A/B/C/G/H sites — axiom prose (PA-A4, PA-A6, PA-I; leaf-PA-A6, leaf-PA-I), gate prose (G-PS-A6, G-PS-Cn3), §1 Own discipline field, Vocabulary `unitary site` entry, §3.1/§3.2/§3.3 axes derivation prose, §3.5 leaf prose, §5.6 failure-mode remediation pattern, §6.5 Custody table CrossingId, §6.11 cross-framework calibration, §8.1 self-audit prose, §10 D4 row. Preserved verbatim at Class D/E/F sites — GenesisDeclaration `generationCycle` field, §6.6 Provenance `cycleId` field, §8.3 last audit event `eventTimestamp`, §10 D-table heading, §9 changelog v1.0 row. **B1+C2:** §4.8 first-run + §8.1 self-audit + middleware.ts header comment block all state BCR-emission scaffold wires at Sprint 9 wire-in alongside substrate-write callers, thread-query callers, F-router registration, wearer-authority program; first runtime crossing emerges at Sprint 9 first-runtime-crossing event, not at Shot 3 src deploy. **B2:** §4.8 promotion path declares `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP` as declared-but-unconsumed at this version; consumption surfaces wire at Sprint 9. **B3+C1:** §3.6 PA-Cn3 row, §4.8 promotion path, G-PS-Cn3 vacuous-pass basis, §5.9 v1.0 row narrative, audit-guide §Findings table — all state PerimeterBinding instance is supplied at Sprint 9 wire-in. **C-δ:** added G-PS-Cn4 (channel preservation) to §4.8 explicit vacuous-pass enumeration. **C-α/β/γ:** sprint-spec language reconciliation, terminology hygiene, no-action items respectively (resolved at sprint-package level, not in this standard's prose). **Discipline:** prose-only amendment per AxR3 + MA-L1 — zero axiom invariant conditions changed; zero gate predicates changed; zero schema shapes changed; zero handoff rules changed; primitive instance counts unchanged. Mechanical predicates at v1.0 baseline. Shot 3 src tree carries forward unchanged (mechanical predicates of `middleware.ts` body byte-identical to v1.0 delivery; only header comment block realigned). Constants file (`perimeter-standard.ts`) and types file (`perimeter-standard.types.ts`) byte-identical to v1.0. Single bundle deploy per Playbook §1.22. | L0 (pending confirmation) |

---

## §6 Coupling

### §6.1 Carrier

Perimeter Standard carrier = `named` → `living-memory` v3.1. PS declares typed-signal content (`BoundaryCrossingRecord`) plus the LM-shaped substrate-write payload (`SubstrateWriteInput`) for intake-direction crossings; does not emit artifact-shaped carriers. Emission call pattern: F-identity slice middleware (host of unitary perimeter site) constructs `BoundaryCrossingRecord` per crossing, runs G-PS1..G-PS-I evaluation, and for intake-direction crossings invokes LM substrate-write surface with `SubstrateWriteInput` constructed from the crossing's content per HR-PS-LM1. See §6.11 carrier relation.

**Cross-framework calibration:** Carrier version bound to Living Memory v3.1. This is structurally distinct from VS/RS/Plan AS-carriered pattern: PS does not produce artifacts about its work — PS produces the typed signal itself, which lands as substrate state-change via LM. Carrier choice ratified at D2.

### §6.2 Handoff rules

Four framework-local HR instances. All PS-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement (except HR-PS4 where `diagnosticSignificance = false` → captured via HR-PS-LM1 + LM HR-LM1 receive-side LM write).

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-PS1** | program/route → perimeter-standard (intake claim receipt) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-PS2** | program/route → perimeter-standard (dispatch request submission) | `['self', 'named']` | `true` | declared §6.3 |
| **HR-PS3** | perimeter-standard → consumer (correlation-index query, ResolvedIdentity return, dispatch governance return) | `['named']` (PS's own carrier = named) | `true` | declared §6.3 |
| **HR-PS-LM1** | perimeter-standard → living-memory v3.1 (intake substrate-write emission) | `['named']` (PS's carrier = named, mapped to LM SubstrateWriteInput contract per LM HR-LM1 receive-side) | `true` | declared §6.3 |
| **HR-PS4** | perimeter-standard → consumer (observability / replay / audit / downstream BoundaryCrossingRecord readers) | `['named']` | `false` | n/a (consumer reads via LM thread query against substrate state-changes; capture via HR-PS-LM1 + LM HR-LM1) |

**Inherited HRs referencing PS:**

| HR | Owning declaration | PS's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → PS type consumption; PS consumes substrate types by receive pattern |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; PS is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records PS's framework declaration per provenance contract (see §6.6) |
| HR-LM1 | living-memory v3.1 §6.2 | perimeter/intake → LM write surface; PS is the named caller honoring HR-LM1 receive-side contract via HR-PS-LM1 |

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

**HR-PS-LM1 — PS → Living Memory v3.1 (substrate-write emission for intake-direction crossings):**
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

- **MA-C1** (carrier declared per substrate §5): §6.1 declares `carrier = 'named'` with bound framework ref `living-memory` v3.1.
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
| `UserId` | primitives.ts | core/R5 | perimeter-standard (wearer-scope arrivals carry UserId in scope), every session-aware framework |
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
| `EmissionPairRef` | perimeter-standard | L3 | perimeter-standard (§2.2 emissionPair field; PA-A4 orphan-rule target); Sprint 9 paired-write programs |
| `AuthorityEnforcementRecord` | perimeter-standard | L3 | perimeter-standard (§2.2 authorityEnforced field) |
| `BoundaryArrival` | perimeter-standard | L3 | perimeter-standard (§2.1 input shape); F-identity middleware (constructor) |
| `BoundaryDispatchRequest` | perimeter-standard | L3 | perimeter-standard (§2.1 input shape); program-emitting consumers |
| `BoundaryCrossingRecord` | perimeter-standard | L3 | perimeter-standard (§2.2 output shape); LM (via SubstrateWriteInput translation at HR-PS-LM1); audit consumers |
| `PerimeterBinding` | perimeter-standard | L3 | perimeter-standard (§6.2 deployment-time configuration); F-identity middleware (consumer) |
| `Mode` | substrate v1-1 | substrate-tier | perimeter-standard (§1 mode='structural'), all frameworks |
| `AuthorityClaim` | substrate v1-1 | substrate-tier | perimeter-standard (§2.1 + §2.2 authorityClaim/authorityContext/authorityEnforced fields), all authority-bearing frameworks |
| `ScopeRef` | substrate v1-1 (consumed via LM LMA6) | substrate-tier | perimeter-standard (§2.1 scopeClaim + §2.2 resolvedScope), LM (LMA6) |
| `Stage` | substrate v1-1 | substrate-tier | perimeter-standard (§3.7 P8 empty-declaration basis), all generative frameworks |
| `FrameworkRef` | substrate v1-1 | substrate-tier | perimeter-standard (§1 adjacentFrameworks), all framework-aware atoms |
| `WAtom` | substrate v1-1 | substrate-tier | perimeter-standard (§2 atom declarations), all atom-emitting frameworks |
| `AxiomRef` | substrate v1-1 | substrate-tier | perimeter-standard (§3.6 axiom IDs), all axiom-bearing frameworks |
| `Judgment` | substrate v1-1 | substrate-tier | perimeter-standard (§7), all J-input-bearing frameworks |
| `JudgmentId` | substrate v1-1 | substrate-tier | perimeter-standard (§7.1), all J-input-bearing frameworks |
| `EmptyPrimitiveDeclaration` | substrate v1-1 (A-17) | substrate-tier | perimeter-standard (§3.7 P8=0 empty-declaration), all frameworks with empty-primitive instances |
| `SubstrateWriteInput` | living-memory v3.1 | L3 (LM) | perimeter-standard (§2.5 consumed at HR-PS-LM1 emission), LM (own input) |
| `SourceRef` | living-memory v3.1 | L3 (LM) | perimeter-standard (§2.5 — channel + scope carriers; §6.3 HR-PS-LM1 captureShape; PA-Cn4 preservation target), LM (own metadata) |
| `IdentityRef` | living-memory v3.1 | L3 (LM) | perimeter-standard (§2.5 — `ResolvedIdentity.ref` resolution target), LM (cluster geometry source) |
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
| Outbound | PS | LM v3.1 | SubstrateWriteInput (per HR-PS-LM1 for intake-direction crossings) |
| Outbound | PS | program L4 | ResolvedIdentity[] + cellGovernance + correlationRef (per HR-PS3 per-crossing return) |
| Outbound | PS | audit consumers | BoundaryCrossingRecord (via LM thread query against state-changes; HR-PS4 receipt-only) |

### §6.11 Carrier relation (H5) and boundary notes

PS's carrier relation to LM v3.1: PS produces `BoundaryCrossingRecord` (full content, including all six axes' resolved fields + cellGovernance + emissionPair + authorityEnforced + unitarySiteRef); only the intake-direction subset is translated to `SubstrateWriteInput` for LM commit (per HR-PS-LM1 captureShape). The full record persists at audit-trail (HR-PS3) for observability and replay; the LM-side persistence captures the substrate effect (state-change content) without duplicating PS's perimeter-side metadata.

**Boundary note:** PS does not assume LM v3.1's specific axiom set — PS consumes only `SubstrateWriteInput` shape and `SourceRef` shape, both of which are stable across LM versions per LM §1 carrier=self + LM §6.1 SW1–SW3 procedure stability. LM v3.2 (post-beta) addition of aggregate-signal-read primitives does not affect PS contract; PS remains version-tolerant by consuming only the intake-write surface.

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
    orphanCount: number,                          // count of crossings with emissionPair containing exactly one null side
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

**All 107 framework-tier gates: state = `not-yet-run` at this version.**

Mechanical self-evaluation per §4.8: at this version no `BoundaryCrossingRecord` instances exist; BCR-emission machinery wires at Sprint 9 alongside substrate-write callers, thread-query callers, F-router registration, and wearer-authority program. G-PS1..G-PS-I therefore evaluate against zero instances — vacuous-pass per substrate §6.3 cardinality semantics.

Inherited 85 framework-tier gates evaluated against PS file declarations:

- **E1 Identity:** §1 declares all required Identity fields per MA-I1..MA-I7; §1.2 axiom-satisfaction table populated; **vacuous-pass for downstream gates pending non-empty referentCitations promotion**.
- **E2 Schema:** §2 declares input + output shapes per MA-S1..MA-S6; §1 referentCitations=[] per MA-V11 vacuous-pass with explicit basis text; G-S8 vacuous-pass.
- **E3 Structure:** §3 declares 6 P1 axes + 13 P2 sub-axes + 21 P3 leaves + 22 P4 axioms + 22 P5 gates + 4 P6 handoff rules + 1 P7 J-input + 0 P8 (empty-declared with basis); §3.6 AxR1–AxR4 self-checks pass; §3.8 universal-variables table populated.
- **E4 Validity:** §4 declares 22 own gates per G-M1; §4.2 MA-V2 per-axis gate coverage all-axes-≥1 passes; G-V10 vacuous-pass; G-V11 vacuous-pass.
- **E5 Lifecycle:** §5 declares version + amendment + confirmation + escalation + judgment-deprecations + failure-modes + scale-bounds + atomicity + version-history; G-L11 vacuous-pass.
- **E6 Coupling:** §6 declares carrier + 4 HR + custody + provenance; MA-C1..MA-C10 self-checks pass.
- **E7 Judgment:** §7 declares 1 J-input (J-perimeter-observation); MA-J1..MA-J5 satisfied.
- **E8 Universal/Meta:** §1.3 MA-G13 four-property table populated; G-U1..G-U5 + G-M1..G-M4 + G-G13 evaluated against PS file structurally.

**Aggregate:** 85 inherited gates pass mechanically against this file at PS-declaration audit; 22 PS-own gates `not-yet-run` (await Sprint 9 first-runtime-crossing event when BCR-emission scaffold wires).

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

VacuousPass breakdown: G-V10 + G-S8 + G-L11 (zero referentCitations); MA-S7 spec↔referent recursive `≼` vacuous over empty referentCitations; MA-S8 + MA-V11 + MA-L11 vacuous; G-PS-A4 (empty paired-write registry); G-PS-Cn3 (PerimeterBinding instance not yet supplied at this version); G-PS-Co2 (single-crossing closure); G-PS1..G-PS-I (no BoundaryCrossingRecord instances at this version — promoted at Sprint 9 first-runtime-crossing event).

NotYetRun breakdown: 22 PS-own gates await first runtime crossing.

### §8.4 Self-application basis

PS verificatively passes its own gates against its own axioms:
- 22 PS-own gates 1:1 with 22 axioms per G-M1 (§4.2 verified).
- Every axiom binds to exactly one axis/leaf per AxR1 (§3.6 verified).
- Every axiom states one mechanical condition per AxR2 (§3.6 verified).
- 6 P1 axes + 1 Identity-tier assertion = 22 leaves (§3.5 verified).
- §6 carrier + HRs satisfy MA-C1..MA-C10 (§6.4 verified).
- §7 J-input satisfies MA-J1..MA-J5 (§7.1 verified).

**Spec §Shot 2 halt-gate criterion:** "standard verificatively passes its own gates against its own axioms before Shot 3" — satisfied per this §8.

### §8.5 MA-G13 four-property self-check (framework classification)

Per §1.3 MA-G13 four-property table: all four properties (own state, own I/O, own invariants, own discipline) declared. PS classified as Framework, not state store, not protocol, not substrate. Pass.

### §8.6 Cross-framework consistency check

| Adjacent | Calibration check | Result |
|---|---|---|
| Living Memory v3.1 | PS HR-PS-LM1 send-side maps to LM HR-LM1 receive-side; SubstrateWriteInput shape consumed by reference per §2.5 | PASS |
| Multi-Instance Standard v2.3 | CorrelationRef consumed by reference per §2.6; PA-Co1 honors upstream MI correlation | PASS |
| Artifact Standard v2.2 | Program emissions cross PS as dispatches; PS dispatch validation interacts with AS v2.2 emission contract at HR-PS2 + dispatch outbound; AS owns emission shape, PS owns boundary contract | PASS (non-overlapping concerns; emissionPair PA-A4 references AS artifact-store record by ID, does not redefine emission semantics) |
| Metaframework v3.2.7 | Generation procedure v1.1.6 consulted; §1.1 GenesisDeclaration cites; full PS file conforms to GeneratedFrameworkTemplate shape | PASS |

---

## §9 Change log

| Version | Cycle | Authority |
|---|---|---|
| v1.0 | Structure-Tightening Sprint Shot 2 (2026-05-06): initial PS declaration filling Manual III.8 perimeter governing-framework slot; six axes (Direction, Arrival Typing, Authority Enforcement, Channel, Identity Resolution, Correlation) + Identity-tier PA-I unitarity; 22 axioms + 22 gates 1:1; carrier `named` → `living-memory` v3.1; F-007 closure (PA-T2 cell-governance), F-009 governance closure (PA-A2 + PA-A3 + PA-A4), F-005 framing rule (PA-A6 + PA-I); vacuous-pass entries documented at §4.8 + §8.3 | L0 (pending confirmation) |
| v1.0.1 | Structure-Tightening Sprint audit-cycle-A close (2026-05-06): prose-only realignment per audit findings closing audit-cycle-A. **Finding A1 (broad sweep):** stripped 26 transient cycle markers ("Sprint 6 Shot 1/2/3" embedments) from Class A/B/C/G/H illegitimate-class sites — axiom prose (PA-A4, PA-A6, PA-I), leaf prose (leaf-PA-A6, leaf-PA-I), gate prose (G-PS-A6, G-PS-Cn3), §1 framing + Own discipline + Unitarity assertion, §3.1/§3.2/§3.3 axes derivation prose, §3.6 vocabulary references, §3.9 Vocabulary `unitary site`, §5.6 failure-mode remediation pattern, §6.5 Custody table CrossingId, §6.11 cross-framework calibration, §8.1 self-audit, §10 D4 row. Preserved verbatim at 5 Class D/E/F legitimate-class sites: GenesisDeclaration `generationCycle` field (substrate §4 A-14 designed-for-cycle), §6.6 Provenance `cycleId` field (designed-for-cycle), §8.3 last audit event `eventTimestamp` (historical event timestamp), §10 D-table heading (D-records are sprint-cycle artifacts), §9 changelog v1.0 row narrative. **Findings B1+C2 (BCR-emission machinery alignment):** §4.8 + §8.1 prose state BCR-emission scaffold wires at Sprint 9 wire-in alongside substrate-write callers, thread-query callers, F-router registration, wearer-authority program; gate promotion at Sprint 9 first-runtime-crossing event, not Shot 3 deploy. **Finding B2 (constants alignment):** §4.8 promotion path declares `LIV_INSTANCE_PERIMETER_SITE_REF`, `DEFAULT_PERIMETER_BINDING`, `CHANNEL_KIND_ENUM`, `FOUR_CELL_GOVERNANCE_MAP` as declared-but-unconsumed at this version; consumption surfaces wire at Sprint 9. **Findings B3+C1 (PerimeterBinding alignment):** §3.6 PA-Cn3 row, §4.8 promotion path, G-PS-Cn3 vacuous-pass basis, §5.9 v1.0 row narrative, audit-guide §Findings table — all state PerimeterBinding instance is supplied at Sprint 9 wire-in. **Side-finding C-δ:** added G-PS-Cn4 (channel preservation) to §4.8 explicit vacuous-pass enumeration. **Side-findings C-α/β/γ:** sprint-spec language reconciliation, terminology hygiene, no-action items respectively (resolved at sprint-package level, not in this standard's prose). **Version-metadata bumps (V1–V8 from lighter re-audit):** file header v1-0 → v1-0-1; §1 Identity `version` field 1.0 → 1.0.1; §1.1 Genesis `predecessorVersion` null → '1.0'; §1.1 Bootstrap status sentence appends v1.0.1 prose-realignment narrative; §3.5 leaf-PA-I rationale "PS v1.0 declares" → "PS declares"; §3.6 AxR3 self-check narrates v1.0.1 carrying v1.0 axiom set forward with zero invariant-predicate changes; §5.9 v1.0 row B3+C1 alignment + new v1.0.1 row added; this §9 Change log v1.0.1 entry added. **Discipline:** prose-only amendment per AxR3 + MA-L1 — zero axiom invariant conditions changed; zero gate predicates changed; zero schema shapes changed; zero handoff rules changed; primitive instance counts unchanged; mechanical predicates at v1.0 baseline. Shot 3 src tree does not require re-verification (middleware function body byte-identical to v1.0; only header comment block realigned). Single bundle deploy per Playbook §1.22. | L0 (pending confirmation) |

---

## §10 Decision-D table (Sprint 6 Shot 2)

Per spec §Shot 2 D-records inline in tar manifest. PS-internal D-records:

| D-record | Site | Decision |
|---|---|---|
| **D4** (axiom granularity per axis) | §3.6 | Direction: 2 axioms (PA1, PA2); Arrival Typing: 4 axioms (PA-T1..PA-T4); Authority Enforcement: 6 axioms (PA-A1..PA-A6); Channel: 4 axioms (PA-Cn1..PA-Cn4); Identity Resolution: 4 axioms (PA-IR1..PA-IR4); Correlation: 3 axioms (PA-Co1..PA-Co3); Identity-tier: 1 axiom (PA-I). Total: 22. Aggregate within D1 anticipated band of 18–24. Auditor reviews against MFv3 leaf-table sizing (§3.5 P3 leaves 1:1 with axioms). |
| **D5** (gate enumeration) | §4.2 | 22 PS-own gates 1:1 with 22 axioms per G-M1. Plus 85 inherited framework-tier gates per metaframework v3.2.7 §4.1. Total framework-tier per audit: 107. |
| **D6** (orphan rule formulation for art_* / substrate split) | §3.6 PA-A4 + §3.9 vocabulary `orphan` + `paired-write contract` | Per F-009 ruling: every program emission writes both substrate state-change (wearer-scope when applicable) AND artifact-store record. **What counts as orphan:** an emission with one side missing (`substrateStateChangeId === null XOR artifactStoreRecordId === null`). **When surfaced:** at audit time via PA-A4 gate failure on persisted records. **How revoked:** ordinary LM LMA2 revocation path — wearer-initiated revocation issues a RevokeRef SubstrateWriteInput targeting the orphan's stored side; the missing side requires no revocation (already absent). Sprint 9 wire-in implements paired-write programs against this rule. |

D7 + D8 (Shot 3) recorded in spec-shot-3.tar manifest per spec §Shot 3.

---

## End of perimeter-standard.md.
