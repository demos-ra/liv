---
kind: framework
placement: frameworks/standards/
---

# permissions-standard-v1-0-2

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Version:** v1.0.2
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1
**Authority:** L0 confirmed (Sprint B2 Shot 2 re-roll — genesis-completion patch: Action Vocabulary jurisdictionClaim extended to cover boundary-side consultation atoms per L3.3 disposition (b))
**Cross-framework input:** Perimeter Standard v1.2 (upstream — crossing-time authority shape; PS v1.2 hands resolved authority + scope to F-permissions consumers for access decision), Living Memory v3.3 (downstream — substrate-read scoping consults Permissions Standard before issuing thread queries), LIV-Standard v1.5.2 (slice-discipline governance for the F-permissions slice)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Permissions Standard is the L3 structural-mode framework owning **access scoping** — the rules under which an access decision is structured. Permissions structures `known → structured` work into typed access decisions: a request consisting of (subject, action, resource-scope) is structured into a decision record consisting of (outcome, basis, role). Where Perimeter Standard structures crossing-time typing (the typed signal itself), Permissions Standard structures **decision-time scoping** (what the typed signal is permitted to do at the scope it claims).

Permissions Standard is **distinct from Perimeter Standard v1.2**: PS v1.2 owns *crossing-time* authority shape (authority claim validity at the moment a signal crosses the boundary — PA-A1, PA-A5, PA-A6 + PA-I after Shot 2 extraction). Permissions Standard owns *decision-time* access scoping (per-user vs global scope, role × action matrix, decision record shape). Both consume substrate's `AuthorityClaim` (§5.3); both honor Manual v13.1 Part IV authority chain; concerns do not overlap. Different timing, different mechanism (see §1 scopeOut + §6.11 cross-framework calibration).

Permissions Standard is **distinct from F-admin** (acknowledged-vacant slot per Manual Operations table): F-admin owns L0 operational surface (system administration actions, build orchestration, deploy artifacts). Permissions Standard owns the *vocabulary and matrix* by which any program — including F-admin — evaluates a per-user or global access claim. Permissions Standard does not adjudicate L0 operations directly; it adjudicates per-user role-scoped access against a declared role × action matrix.

Permissions Standard fills the **F-permissions governing-framework slot** declared at LIV Manual SPEC-v13.1 Operations table L422. Slot was acknowledged-vacant with note "Pending derivation"; Permissions Standard ratification at this delivery transitions the slot from "Acknowledged vacant" to "Filled" per Manual Operations table sweep at §5.9 below.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Permissions Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0.2` (per substrate §7 Semver; v1.0.1 → v1.0.2 per MA-L1 patch at Sprint B2 Shot 2 cascade — AuthorityClaim → AuthorityAssertion rewire at consumed-types + custody sites; no axiom/gate/schema change) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first decision via §5.3 post-L0-confirmation) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (per substrate §9 Carrier enum; Permissions Standard emits own atom `AccessDecisionRecord` — no enclosing carrier; consumers read decisions directly from the F-permissions slice contract surface) |
| `primitive` | `access-decision` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | `AccessDecisionRequest` (subject, action, resource-scope claim); `ScopeKind` enum; role × action `PermissionMatrix`; per-user role binding (project_members table) |
| `produces` | `AccessDecisionRecord` (typed decision with outcome, basis, role, scope) |
| `consumedBy` | F-permissions slice runtime (R2 workflow + R3 contract surface; F-identity middleware via R3 `requirePermission` + `withPermission` guards); every slice making cross-slice permission-gated calls (consumes via F-permissions/R3 `requirePermission` per LIV-Standard A5); F-verify state registry (substrate-read scoping per `enforceSubstrateReadScope`); audit consumers via emitted `permissions.access-denied` / `permissions.permissions-loaded` event records |
| `scopeOut` | `['crossing-time authority shape (owned by Perimeter Standard v1.2 — PS v1.2 declares whether an AuthorityClaim is well-formed at the boundary; Permissions Standard reads the resolved authority + scope and decides access at decision time, not at crossing)', 'L0 operational surface (owned by F-admin once F-admin is derived — F-admin operates under Wearer-L0 / System-L0 authority direct; Permissions Standard adjudicates per-user role-scoped access only, not L0 direct operations)', 'authority semantics (owned by Manual v13.1 Part I Wearer-L0 + System-L0 + Part IV Governance Loop — Permissions Standard declares decision-time mapping from (subject, scope) to permitted action set; does not redeclare what authority means)', 'session validation (owned by F-identity slice — F-identity establishes the authenticated UserId; Permissions Standard consumes the resolved subject identity, does not re-validate session)', 'identity resolution (owned by Perimeter Standard v1.2 Identity Resolution axis — surface-form-to-Ref matching is a perimeter concern; Permissions Standard consumes resolved Refs)', 'project lifecycle (owned by F-project — project create/delete/update are program-tier concerns; Permissions Standard reads project_members table for per-user role within an existing project; does not own project state)', 'role-assignment lifecycle UI (owned by F-admin / F-dashboard — admin programs invoke F-permissions/R2 setMemberRole; Permissions Standard owns the rule, not the operator interface)', 'event emission infrastructure (owned by F-event-system — Permissions Standard emits permissions.* events via the event bus per LIV-Standard A5; does not own bus mechanics)', 'runtime execution of access checks (owned by F-permissions L4 slice — Permissions Standard declares the rule set, the F-permissions slice executes via permissions-workflow.ts)', 'substrate-read primitive shape (owned by Living Memory v3.3 — Permissions Standard scopes who may read which substrate slice; LM owns the thread-query primitive itself)', 'aggregate-signal-read governance (owned by Living Memory v3.3 / post-beta)']` |
| `governsRuntimeCode` | `true` (per MA-I8, added Sprint B1 Shot 2 v3.3.0). Basis: Permissions Standard governs F-permissions slice runtime code at `src/features/F-permissions/**` — five R-layer files (R0 permissions-config.ts + permissions-events.ts + wires.ts; R1 permissions-logic.ts; R2 permissions-workflow.ts; R3 permissions-contract.ts + permissions-hook.ts; R4 permissions-db.ts). The axiom set (PMA-Sc1..PMA-D3), gate set (G-PMS-Sc1..G-PMS-D3), four-axis structure (Scope, Subject Binding, Action Vocabulary, Decision), and role × action matrix govern source paths under the slice. Declaration of source-governing intent is mechanical per MA-I8; jurisdictionClaim per axis declared at §3.13 below. |
| `referentCitations` | `[]` (zero citations at v1.0.1 — declared partial-drift per MA-V11 vacuous-pass clause carried forward from v1.0. Basis prose: `"Sprint B2 follow-on source-cleanup will author ReferentCitations covering jurisdictionClaim per MA-V10 part B amendment trigger. At v1.0.1 the standards-tier declarations are populated (MA-I8 governsRuntimeCode true with basis prose, MA-St17 basis declarations populated at §3.13, jurisdictionClaim declared per source-governing axis at §3.13 with v1.0.1 genesis-completion patch extending Action Vocabulary axis coverage to boundary-side consultation atoms per L3.3 disposition (b)); the runtime-side citation set materializes in the same follow-on covering all 4 Action Vocabulary jurisdiction sites + Scope/Subject Binding/Decision sites. Vacuous-pass at this version is honest declared drift, not silent gap. G-V10/G-S8/G-L11 vacuous-pass at part A; G-V10 part B applicability='n/a' with declared basis per §3.13.11. Precedent: PS v1.1 §1 declares the same vacuous-pass pattern with identical Sprint B2 closure plan."`) |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.3.1' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.7' },
  generationCycle: 'sprint-b2-shot-1-F-permissions-derivation; sprint-b2-shot-2-reroll-genesis-completion-patch',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: '1.0'
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (Permissions Standard v1.0 is a fresh L3 framework, not a v0 lift; no predecessor framework — the F-permissions slot was acknowledged-vacant per Manual Operations table at SPEC-v13.1, and the access-scoping concern was over-absorbed into PS v1.1's PA-A2 / PA-A3 / PA-Cn3 axioms which now relocate here per Sprint B2 Shot 2 extraction. Permissions Standard v1.0 derivation runs independently from Manual SPEC-v13.1 Part IV authority-chain commitments and Operations table L422 vacant-slot declaration. The pre-existing F-permissions slice runtime code under `src/features/F-permissions/**` predates the standard but conforms to LIV-Standard A1–A7 slice discipline; this delivery declares the standard against which the existing slice is mechanically verified. v1.0.1 genesis-completion patch: Action Vocabulary axis jurisdictionClaim extended at §3.13.11 to cover two boundary-side consultation source paths (`src/core/types/perimeter-standard.types.ts` PermittedAuthoritySet block + `src/core/constants/perimeter-standard.ts` DEFAULT_PERIMETER_BINDING) per L3.3 disposition (b) — original v1.0 intent of full PMA-Av2 jurisdiction made explicit at re-roll).

### §1.2 Identity-axiom satisfaction

Per metaframework §3.2 Identity-axis axioms MA-I1..MA-I8:

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `structural` in §1 row. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10 enum. |
| MA-I3 | Ownership declared for template + applied in §1 rows per substrate A-11. |
| MA-I4 | LifecycleState declared for template + applied in §1 rows per substrate §9. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named per substrate A-14. |
| MA-I6 | Authority source classified per Phase 1.2 J-authority-source-classification: L0 authority for template ownership; system-under-L0 for applied. |
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: structural-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry; precedent: PS v1.2 + Plan Standard v2.2 declare same triple). |
| MA-I8 | `governsRuntimeCode = true` declared §1 with basis prose per Sprint B1 Shot 2 v3.3.0 amendment (boolean type-check class per substrate §6.3). |

### §1.3 MA-G13 four-property test (framework classification)

| Property | Satisfied by |
|---|---|
| Own state | lifecycle state (declared → applied on first decision); per-axis positional state per §3.8 universal-variables table; in-memory PERMISSION_MATRIX (R0 config) as declarative state; per-user role binding state at R4 (project_members table) — read at decision time, not owned by Permissions Standard |
| Own I/O | Input atom: `AccessDecisionRequest` (subject + action + resource-scope claim). Output atom: `AccessDecisionRecord` (outcome + basis + role + scope) |
| Own invariants | PMA-Sc1..PMA-D3 axioms (§3.6) governing scope vocabulary, subject binding, action vocabulary, decision shape |
| Own discipline | structural-mode framework: typed-shape-conformance discipline at every decision; gate-set G-PMS-Sc1..G-PMS-D3 invocable on each `AccessDecisionRecord`; F-permissions slice runtime enforcement at R2/R3 contract surface |

All four properties declared. MA-G13 passes. Permissions Standard is classified as framework (not state store, not protocol, not substrate).

### §1.4 Decision-record unitarity assertion (Identity-table distinguishing property)

Per Manual v13.1 Part IV Governance Loop ("authority terminates where confirmation terminates"; L0 confirms, L1 mechanically executes L0's apparatus, L2 is what L1 produces, L3 is what L2 governs):

**Every access check produces exactly one `AccessDecisionRecord`.** Multiple parallel decisions for the same `(subject, action, scope)` triple within a single request are forbidden — the decision is unitary at the request. Distributed decision-record emission (multiple records for one request) is a structural defect; one-record-per-request enforcement is the only valid pattern.

This is a distinguishing-property assertion at the Identity tier (parallel to PS §1.4 Unitarity assertion structural pattern). The unitary-record rule is enforced mechanically by axiom **PMA-D1** declared at §3.6 (decision outcome ∈ {permit, deny}, non-null, cardinality 1) with paired gate **G-PMS-D1**. Implementation of unitary-record discipline is owned by F-permissions/R2 `resolveAndCheck` (which returns a single `{allowed, role}` shape per call); Permissions Standard declares the structural rule and the test that verifies it.

---

## §2 Schema

### §2.1 Input — `AccessDecisionRequest`

Permissions Standard consumes one input atom shape:

```
AccessDecisionRequest = {
  requestId: RequestId,
  subject: {
    userId: UserId,
    sessionRef: string | null      // F-identity-supplied session ref; null for system-initiated decisions
  },
  action: Action,                  // closed enum per §3.3 Action Vocabulary axis; Action is the R0-declared ACTIONS union
  resourceScope: {
    kind: ScopeKind,               // 'per-user' | 'global'
    userId: UserId | null,         // populated when kind='per-user'; null when kind='global'
    projectId: ProjectId | null    // populated when kind='per-user' AND request targets a project-scoped resource; null otherwise
  },
  requestedAt: EpochMs,
  correlationRef: string | null    // upstream PS correlation; null when decision is not crossing-correlated
}
```

**Field-by-field provenance:**

- `requestId` — R0-generated stable identifier; one per request. Consumed by §2.2 output as `record.requestId`.
- `subject.userId` — F-identity-supplied authenticated UserId per substrate UserId type; required non-null for every request (system-initiated decisions carry the canonical system-UserId per F-admin / F-event-system convention).
- `subject.sessionRef` — opaque session reference from F-identity; nullable for system-initiated decisions.
- `action` — exactly one Action enum value per request (PMA-Av1).
- `resourceScope.kind` — exactly one ScopeKind enum value per request (PMA-Sc1).
- `resourceScope.userId` / `resourceScope.projectId` — populated per kind discriminant (PMA-Sb2).
- `requestedAt` — F-permissions-stamped at request construction; EpochMs scalar.
- `correlationRef` — upstream PS correlation reference when available; null otherwise.

### §2.2 Output — `AccessDecisionRecord`

Permissions Standard emits one output atom shape per request:

```
AccessDecisionRecord = {
  requestId: RequestId,                  // mirrors input
  decision: {
    outcome: DecisionOutcome,            // 'permit' | 'deny'; non-null
    role: Role | null,                   // populated when subject has resolved role; null when subject has no role binding
    denyReason: DenyReasonKind | null,   // populated iff outcome='deny'; null otherwise
    basis: string                        // non-empty; cites mechanical predicate from substrate §6.3 six-class enum
  },
  resolvedScope: {
    kind: ScopeKind,                     // mirrors input
    userId: UserId | null,
    projectId: ProjectId | null
  },
  subject: {
    userId: UserId
  },
  action: Action,
  permissionsFrameworkVersion: Semver,   // 'v1.0' at this delivery
  decidedAt: EpochMs
}
```

Per spec §2.2: every field traces to exactly one Permissions Standard axis or to the Identity-tier unitary-record rule:

- `requestId` — request identity (Identity tier, §1.4)
- `decision.outcome` — Decision axis (PMA-D1)
- `decision.role` — Subject Binding axis (PMA-Sb3)
- `decision.denyReason` — Decision axis (PMA-D2)
- `decision.basis` — Decision axis (PMA-D3)
- `resolvedScope.*` — Scope axis (PMA-Sc1, PMA-Sc2)
- `subject.userId` — Subject Binding axis (PMA-Sb1)
- `action` — Action Vocabulary axis (PMA-Av1)
- `permissionsFrameworkVersion` — provenance
- `decidedAt` — temporal provenance

### §2.3 Consumed types (from substrate-v1-1, by reference)

Per substrate §1.3 SI-03 + R-phase-1-1-resolution-08 single-source-via-reference:

| Type | Home | Consumed at |
|---|---|---|
| `AuthorityAssertion` | substrate §5.6 A-23 | upstream PS hands resolved authority on the BoundaryCrossingRecord; Permissions Standard reads it when decisions chain off a crossing — runtime shape `{level, actor, source}` per crossing semantics |
| `AuthorityClaim` | substrate §5.3 | governance ratification stamps; consumed by reference where governance-flavor authority carries `{level, confirmedBy, timestamp}` (zero such sites in PMS v1.0.2 body) |
| `AuthorityLevel` | substrate §5 | nested in `AuthorityClaim`; consumed by reference |
| `Semver` | substrate §7 | §1 version, §2.2 `permissionsFrameworkVersion` |
| `Kind` | substrate §4 A-10 | §1 Identity row |
| `Ownership` | substrate §4 A-11 | §1 Identity rows |
| `LifecycleState` | substrate §9 | §1 Identity stateTemplate / stateApplied |
| `Carrier` | substrate §9 | §1 Identity carrier ('self') |
| `AxisBasis` | substrate §4 A-22 | §3.13 basis declarations per MA-St17 |
| `ReferentCitation` | substrate §4 A-18 | §1 Identity referentCitations (currently empty per declared partial-drift) |

### §2.4 Consumed types (from primitives.ts core/R5, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `UserId` | primitives.ts | subject.userId, resourceScope.userId, AccessDecisionRecord.subject |
| `ProjectId` | primitives.ts | resourceScope.projectId |
| `Result<T>` | primitives.ts | R4 db calls (`getMemberRole`, `setMemberRole`) return Result-wrapped |
| `AppError` | primitives.ts | R4 db error shape |

EpochMs is declared locally below (parallel to PS / Plan / VS / RS precedent — primitives.ts does not declare EpochMs).

### §2.5 Consumed types (from perimeter-standard v1.2, by reference)

| Type | Home | Consumed at |
|---|---|---|
| `BoundaryCrossingRecord` | perimeter-standard v1.2 §2.2 | upstream PS produces this; Permissions Standard reads `resolvedAuthority`, `resolvedScope`, `correlationRef` when decisions chain off a crossing |
| `CrossingId` | perimeter-standard v1.2 §2.7 | correlationRef nested type |

### §2.6 Permissions-Standard-local atoms (declared at point of use in §3)

PMS-local atoms:
`RequestId`, `EpochMs`, `ScopeKind`, `Action`, `Role`, `DecisionOutcome`, `DenyReasonKind`, `PermissionMatrix`, `ResourceScope`, `AccessDecisionRequest`, `AccessDecisionRecord`, `RoleBindingResult`, `PermissionsValidityError`, `ScopePositional`, `SubjectBindingPositional`, `ActionVocabularyPositional`, `DecisionPositional`.

Substrate-referenced atoms (consumed from substrate per S1 single-source declaration): see §2.3.

Each PMS-local atom declared at first use in §3 Structure with shape block. Substrate-referenced atoms consumed by identifier per S1.

### §2.7 Schema rules (ScR-series)

Per metaframework §2.5. No Permissions-Standard-local ScR additions beyond the substrate-tier rules (S1 single-source-of-truth, S3 additive versioning) which Permissions Standard honors at its own scope (axiom text frozen at v1.0; new amendments additive per MA-L1).

### §2.8 Custody pointer

Full custody table in §6.5. Summary pointer only at this section per single-source-via-reference (R-phase-1-1-resolution-08).

---

## §3 Structure

### §3.1 Axes (inherited)

Permissions Standard inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. Permissions Standard does not redeclare.

Permissions Standard's own structural content is the **four P1 Axis instances** declared at §3.3 below, derived from L0 domain ruling (this session) per §C.6 derivation: per-user / global access scoping, with closure rule per L0 ruling.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation:

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 4 | Scope, Subject Binding, Action Vocabulary, Decision — declared §3.3 per L0 domain ruling (Sprint B2 Shot 1 brief: "access scoping — per-user and global"). MECE over Permissions Standard's concern space per §C.6 derivation. |
| P2 Sub-axis | 12 | declared §3.4 (3 per axis) |
| P3 Leaf | 12 | declared §3.5 (1:1 with PMA-Sc1..PMA-D3 axiom set) |
| P4 Axiom | 12 | PMA-Sc1..PMA-D3 declared §3.6 |
| P5 Gate | 12 | G-PMS-Sc1..G-PMS-D3 declared §4.2 (1:1 with axioms per G-M1) |
| P6 Handoff rule | 3 | HR-PMS1..HR-PMS3 declared §6.2 |
| P7 Judgment input | 1 | J-permissions-observation declared §7.1 |
| P8 Procedure step | 0 | `{primitiveKind: P8, instanceCount: 0, basis: "Permissions Standard Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only ('P8 — Procedure step. Mode = generative only.'; 'Non-generative frameworks have no P8 instances. P8 is absent, not empty.'). Permissions Standard therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. Decision-time procedure semantics — what F-permissions/R2 does at each request — are captured declaratively as the PMA-Sc1..PMA-D3 axiom set and G-PMS-Sc1..G-PMS-D3 gate set; runtime invocation of gates at every decision is owned by F-permissions slice (L4 program), outside Permissions Standard's P8 scope. Precedent: PS v1.2 §3.7, Plan Standard v2.2 §3.7, Research Standard v1.0 §3.7 all declare the same empty-P8 pattern under structural / epistemic / generative modes."}` |

### §3.3 P1 Axis instances (Permissions-Standard-local)

Four domain axes. MECE over Permissions Standard's concern space per §C.6 derivation. Each axis isolates one orthogonal concern of decision-time access scoping.

| id | Axis | Concern | Atomic question |
|---|---|---|---|
| `Scope` | Scope | Per-user vs global access scoping; scope-kind vocabulary; scope-resolution determinism | What scope does this request target, and does the request resolve unambiguously to a declared ScopeKind? |
| `Subject Binding` | Subject Binding | Subject identity; per-user role binding (project_members lookup); negative invariant against heuristic fallback | Who is the subject, and what role (if any) do they hold at the requested scope? |
| `Action Vocabulary` | Action Vocabulary | Closed Action enum; role × action matrix exhaustiveness; additive amendment discipline | What action is requested, and is the action × role mapping declared for every (Role, Action) pair? |
| `Decision` | Decision | Decision outcome shape (permit/deny + denyReason); basis citation | What outcome did the decision resolve to, and on what mechanical predicate basis? |

**MECE basis:** the four axes partition decision-time access scoping orthogonally. Scope answers *where* (which scope-kind). Subject Binding answers *who* (subject + role). Action Vocabulary answers *what* (action enum). Decision answers *outcome* (permit/deny + basis). No two axes overlap; together they exhaust decision-time scoping per L0 domain ruling.

**Closure rule:** Permissions Standard's axis set is closed at four entries at v1.0 baseline. Additive per MA-S7 recursive scope; new axes enter via amendment when a new decision-time scoping concern is identified that the four-axis set does not cover.

**§C.6 derivation trace:** L0 brief Sprint B2 Shot 1 ratified "access scoping — per-user and global. Not authority enforcement at the crossing (PS owns that). Not L0 operational surface (F-admin owns that as L0-tier Tool post-reshape). F-permissions enforces *who can access what* at scope granularity." From this:
- "What kinds of scope exist" → Scope axis (per-user, global enumeration).
- "Who" → Subject Binding axis (subject identity + role resolution).
- "Can access what" → Action Vocabulary axis (action enum + role × action matrix).
- Decision shape forced by structural-mode I/O contract → Decision axis.

Four axes, MECE, exhaustive over L0 domain ruling. AxR1: every PMA-* axiom binds to exactly one of these four (see §3.6). Pass.

### §3.4 P2 Sub-axis instances

Per P1 axis per substrate §8.2:

**Scope sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Scope/enumeration` | ScopeKind closed enum (`'per-user' \| 'global'`) declaration + cardinality | `leaf-PMA-Sc1-scope-enumeration` |
| `Scope/resolution` | Per-request resolution to exactly one ScopeKind via mechanical discriminant on `resourceScope.kind` | `leaf-PMA-Sc2-scope-resolution` |
| `Scope/nesting` | Scope-nesting rule: global subsumes per-user for read; per-user does NOT subsume global (negative invariant) | `leaf-PMA-Sc3-scope-nesting` |

**Subject Binding sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Subject Binding/identity` | Every request carries non-null subject.userId | `leaf-PMA-Sb1-subject-identity` |
| `Subject Binding/per-user-match` | Per-user scope requires `subject.userId === resourceScope.userId` | `leaf-PMA-Sb2-per-user-match` |
| `Subject Binding/role-resolution` | Per-user-scope role binding resolved via project_members lookup only (no heuristic fallback) | `leaf-PMA-Sb3-role-resolution` |

**Action Vocabulary sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Action Vocabulary/declaration` | Every request carries exactly one Action enum value | `leaf-PMA-Av1-action-declaration` |
| `Action Vocabulary/closure` | Closed-vocabulary rule: Action enum closed at v1.0 baseline; additive amendment per MA-L1 / S3 | `leaf-PMA-Av2-vocabulary-closure` |
| `Action Vocabulary/matrix-exhaustiveness` | role × action matrix exhaustive over (Role × Action) — every cell declared | `leaf-PMA-Av3-matrix-exhaustiveness` |

**Decision sub-axes:**

| id | Sub-axis | Leaf set |
|---|---|---|
| `Decision/outcome` | DecisionOutcome closed enum (`'permit' \| 'deny'`); non-null per decision | `leaf-PMA-D1-decision-outcome` |
| `Decision/deny-reason` | DenyReasonKind enum populated iff outcome='deny' | `leaf-PMA-D2-deny-reason` |
| `Decision/basis` | Decision basis cites mechanical predicate from substrate §6.3 six-class enum | `leaf-PMA-D3-decision-basis` |

**Sub-axis attachment note:** twelve sub-axes 1:1 with twelve axioms / twelve leaves. Each axiom occupies exactly one sub-axis (no sub-axis sharing). This contrasts with PS §3.4 where several sub-axes share a leaf because the axiom's mechanical condition is unitary at sub-axis cluster level; Permissions Standard's decomposition is finer-grained because the decision-time decomposition produces atomic predicates per sub-axis.

### §3.5 P3 Leaf instances

Per MA-St2 (every leaf atomic per substrate leaf primitive shape):

| Leaf id | atomicity | shape |
|---|---|---|
| `leaf-PMA-Sc1-scope-enumeration` | `axiom` | `request.resourceScope.kind ∈ {'per-user', 'global'} (ScopeKind enum membership; non-null; cardinality = 1) — per PMA-Sc1 structural property` |
| `leaf-PMA-Sc2-scope-resolution` | `axiom` | `record.resolvedScope.kind === request.resourceScope.kind (mechanical equality — no transformation between request scope kind and resolved scope kind) AND (record.resolvedScope.kind === 'per-user' implies record.resolvedScope.userId !== null) AND (record.resolvedScope.kind === 'global' implies record.resolvedScope.userId === null AND record.resolvedScope.projectId === null) — per PMA-Sc2 structural property (mechanical discriminant)` |
| `leaf-PMA-Sc3-scope-nesting` | `axiom` | `For action ∈ {project_read, constitution_read, topography_read, git_read, substrate_read}: (record.resolvedScope.kind === 'global' AND action requested at global scope) does NOT imply automatic permit at per-user scope — global-scope read permission does not carry forward as per-user-scope permission for the same action without an explicit per-user role binding. Negative invariant: per-user scope is NOT automatically derived from global-scope role; per-user role binding must exist independently in project_members (PMA-Sb3) — per PMA-Sc3 structural property (negative invariant: implicit-scope-derivation forbidden)` |
| `leaf-PMA-Sb1-subject-identity` | `axiom` | `request.subject.userId !== null AND request.subject.userId is non-empty string (cardinality = 1; non-null) AND record.subject.userId === request.subject.userId (preservation through decision) — per PMA-Sb1 cardinality + structural property` |
| `leaf-PMA-Sb2-per-user-match` | `axiom` | `(request.resourceScope.kind === 'per-user' AND request.resourceScope.userId !== null) implies request.subject.userId === request.resourceScope.userId. A per-user-scope request whose subject is not the scope owner is a structural defect — per-user scope is owner-only by construction. Cross-user per-user-scope access is denied at PMA-Sb2; per PMA-Sb2 structural property (conditional equality)` |
| `leaf-PMA-Sb3-role-resolution` | `axiom` | `(request.resourceScope.kind === 'per-user' AND request.resourceScope.projectId !== null) implies record.decision.role !== null AND record.decision.role is resolved by mechanical lookup against project_members table (R4 getMemberRole) with discriminant (subject.userId, resourceScope.projectId). Heuristic Role assignment forbidden: when project_members returns null, record.decision.role MUST remain null and record.decision.outcome === 'deny' with denyReason = 'no_role'. Negative invariant: no fallback Role inference (e.g., \"if user owns the org assume owner role at project scope\") — per PMA-Sb3 structural property + reference resolution to project_members + negative invariant (heuristic fallback forbidden)` |
| `leaf-PMA-Av1-action-declaration` | `axiom` | `request.action ∈ Action enum (cardinality = 1; non-null; closed enum membership) AND record.action === request.action — per PMA-Av1 enum-membership + preservation` |
| `leaf-PMA-Av2-vocabulary-closure` | `axiom` | `Action enum is closed at the declared set at v1.0 baseline: {'project_create', 'project_read', 'project_update', 'project_delete', 'constitution_read', 'constitution_write', 'constitution_confirm', 'build_trigger', 'commit_confirm', 'git_connect', 'git_read', 'terminal_connect', 'topography_read', 'la_run', 'substrate_write', 'substrate_read', 'program_invoke_plan', 'program_invoke_discover', 'program_invoke_verify', 'program_invoke_build'}. Extension by additive amendment per MA-L1 + S3 only; no runtime addition (no \"action = whateverString\" pattern) — per PMA-Av2 enum-membership + structural property (vocabulary closure)` |
| `leaf-PMA-Av3-matrix-exhaustiveness` | `axiom` | `For every (Role r, Action a) ∈ (Role × Action): PERMISSION_MATRIX[r] declares whether a ∈ PERMISSION_MATRIX[r] (boolean inclusion). No undeclared cell — every Role explicitly enumerates which Actions are permitted; absent enumeration is interpreted as deny (closure-by-omission with explicit basis: \"a ∉ PERMISSION_MATRIX[r] implies role r is not permitted to perform action a\"). Per AxR2 the predicate is one mechanical condition: |Role × Action| === sum over r ∈ Role of (|PERMISSION_MATRIX[r]| + |Action \\ PERMISSION_MATRIX[r]|), trivially true by set algebra over finite domains — per PMA-Av3 cardinality + structural property` |
| `leaf-PMA-D1-decision-outcome` | `axiom` | `record.decision.outcome ∈ {'permit', 'deny'} (DecisionOutcome enum; non-null; cardinality = 1; closed enum) — per PMA-D1 enum-membership + cardinality (unitary-record per §1.4)` |
| `leaf-PMA-D2-deny-reason` | `axiom` | `(record.decision.outcome === 'deny') implies record.decision.denyReason !== null AND record.decision.denyReason ∈ DenyReasonKind enum {'no_role', 'insufficient_role', 'scope_mismatch', 'unknown_action'}. (record.decision.outcome === 'permit') implies record.decision.denyReason === null — per PMA-D2 conditional cardinality + enum-membership` |
| `leaf-PMA-D3-decision-basis` | `axiom` | `record.decision.basis is non-null AND non-empty (length ≥ 1) AND record.decision.basis cites a mechanical predicate from substrate §6.3 six-class enum (type-check, enum-membership, reference-resolution, structural-property, cardinality, deterministic-function-result). Required examples: permit decisions cite \"PERMISSION_MATRIX[role].includes(action) === true\" (reference-resolution); deny-no-role decisions cite \"project_members lookup returned null\" (reference-resolution); deny-insufficient-role decisions cite \"PERMISSION_MATRIX[role].includes(action) === false\" (reference-resolution); deny-scope-mismatch decisions cite \"PMA-Sb2 conditional equality failed\" (structural-property) — per PMA-D3 reference resolution + structural property + non-empty cardinality` |

### §3.6 P4 Axiom instances (PMA-Sc1..PMA-D3)

Per AxR1 (every axiom binds to exactly one axis) + AxR2 (one mechanical condition directly) + MA-St4 (primitive-atomicity) + MA-V1 (every axiom has ≥1 gate). 12 Permissions-Standard-local axis-bound axioms.

| Axiom | Attached to | Mechanical condition | Ground class (per substrate §6.3) |
|---|---|---|---|
| **PMA-Sc1** | `Scope` (via `Scope/enumeration` sub-axis) / `leaf-PMA-Sc1-scope-enumeration` | `request.resourceScope.kind ∈ {'per-user', 'global'}` — non-null, cardinality 1, exhaustive ScopeKind enum membership. ScopeKind is the closed enum declared at PMS-local atom inventory; closure rule additive per MA-S7. Per L0 ruling: per-user and global only. | enum-membership + cardinality |
| **PMA-Sc2** | `Scope` (via `Scope/resolution` sub-axis) / `leaf-PMA-Sc2-scope-resolution` | `record.resolvedScope.kind === request.resourceScope.kind` (mechanical equality) AND `(record.resolvedScope.kind === 'per-user' implies record.resolvedScope.userId !== null)` AND `(record.resolvedScope.kind === 'global' implies record.resolvedScope.userId === null AND record.resolvedScope.projectId === null)`. Scope discriminant determines field cardinality per kind. | structural property (mechanical discriminant + conditional cardinality) |
| **PMA-Sc3** | `Scope` (via `Scope/nesting` sub-axis) / `leaf-PMA-Sc3-scope-nesting` | For read-class actions: global-scope role does NOT automatically imply per-user-scope permission for the same action. Per-user-scope permission requires independent per-user role binding via project_members (PMA-Sb3). **Negative invariant:** implicit scope derivation from global to per-user is forbidden. | structural property (negative invariant: implicit-derivation forbidden) |
| **PMA-Sb1** | `Subject Binding` (via `Subject Binding/identity` sub-axis) / `leaf-PMA-Sb1-subject-identity` | `request.subject.userId !== null AND request.subject.userId is non-empty string (cardinality = 1)` AND `record.subject.userId === request.subject.userId` (subject identity preserved through decision). | cardinality + structural property |
| **PMA-Sb2** | `Subject Binding` (via `Subject Binding/per-user-match` sub-axis; cross-axis with `Scope`) / `leaf-PMA-Sb2-per-user-match` | `(request.resourceScope.kind === 'per-user' AND request.resourceScope.userId !== null)` implies `request.subject.userId === request.resourceScope.userId`. Per-user scope is owner-only by construction; cross-user per-user-scope access denied at PMA-Sb2. **Replaces former PS PA-A2 wearer-scope-rule** (relocated from PS v1.1 to Permissions Standard v1.0 per Sprint B2 Shot 2 extraction). | structural property (conditional equality) |
| **PMA-Sb3** | `Subject Binding` (via `Subject Binding/role-resolution` sub-axis) / `leaf-PMA-Sb3-role-resolution` | `(request.resourceScope.kind === 'per-user' AND request.resourceScope.projectId !== null)` implies `record.decision.role` is resolved by mechanical lookup against project_members table with discriminant `(subject.userId, resourceScope.projectId)`. **Negative invariant:** heuristic Role assignment forbidden — when project_members returns null, `record.decision.role` MUST remain null AND `record.decision.outcome === 'deny'` with `denyReason = 'no_role'`. | reference resolution (project_members lookup) + structural property (negative invariant) |
| **PMA-Av1** | `Action Vocabulary` (via `Action Vocabulary/declaration` sub-axis) / `leaf-PMA-Av1-action-declaration` | `request.action ∈ Action enum` (non-null, cardinality 1, closed enum membership) AND `record.action === request.action`. | enum-membership + cardinality |
| **PMA-Av2** | `Action Vocabulary` (via `Action Vocabulary/closure` sub-axis) / `leaf-PMA-Av2-vocabulary-closure` | Action enum is closed at v1.0 baseline; the 20 declared values (project_*, constitution_*, build_*, git_*, terminal_*, topography_*, la_*, substrate_*, program_invoke_*) form the closed set. Runtime extension forbidden; amendment additive per MA-L1 + S3. **Replaces former PS PA-Cn3 channel-authority-binding** (relocated from PS v1.1 to Permissions Standard v1.0 per Sprint B2 Shot 2 extraction — the channel × permitted-authority binding was structurally an access-scoping concern: which channels may carry which authority claims; Permissions Standard generalizes this to closed vocabularies under additive-amendment discipline; channel binding becomes a special case of Action Vocabulary closure at the channel-emitting program tier). | enum-membership + structural property (vocabulary closure) |
| **PMA-Av3** | `Action Vocabulary` (via `Action Vocabulary/matrix-exhaustiveness` sub-axis) / `leaf-PMA-Av3-matrix-exhaustiveness` | For every `(Role r, Action a) ∈ (Role × Action)`: PERMISSION_MATRIX declares boolean inclusion explicitly. Closure-by-omission (a ∉ PERMISSION_MATRIX[r]) interpreted as deny per declared rule. Matrix exhaustive over finite (Role × Action) domain. | cardinality + structural property (closure-by-omission with declared basis) |
| **PMA-D1** | `Decision` (via `Decision/outcome` sub-axis) / `leaf-PMA-D1-decision-outcome` | `record.decision.outcome ∈ {'permit', 'deny'}` (non-null, cardinality 1, closed enum). Unitary-record per §1.4 (one decision outcome per request). | enum-membership + cardinality |
| **PMA-D2** | `Decision` (via `Decision/deny-reason` sub-axis) / `leaf-PMA-D2-deny-reason` | `(record.decision.outcome === 'deny')` implies `record.decision.denyReason !== null AND record.decision.denyReason ∈ DenyReasonKind enum {'no_role', 'insufficient_role', 'scope_mismatch', 'unknown_action'}`. `(record.decision.outcome === 'permit')` implies `record.decision.denyReason === null`. **Subsumes the global-scope rule formerly at PS PA-A3** (relocated from PS v1.1 to Permissions Standard v1.0 per Sprint B2 Shot 2 extraction — PA-A3's system-scope-rule was structurally a deny-reason discriminant at decision time: when scope/authority binding doesn't match, the denial carries a typed reason; PMA-D2 carries the structured denial vocabulary; global-scope-access enforcement happens via PMA-Sb3 role lookup which returns null at global scope for non-system subjects, producing deny-no_role). | conditional cardinality + enum-membership |
| **PMA-D3** | `Decision` (via `Decision/basis` sub-axis) / `leaf-PMA-D3-decision-basis` | `record.decision.basis !== null AND length ≥ 1 AND record.decision.basis cites a mechanical predicate from substrate §6.3 six-class enum`. Every decision is traceable to a mechanical predicate. | reference resolution (substrate §6.3 enum citation) + structural property + non-empty cardinality |

**AxR1 self-check:** each axiom binds to exactly one primary axis/leaf per attachment column. PMA-Sb2 attaches at Subject Binding with cross-axis closure note over Scope (parallel to PS PA-A2 cross-axis pattern); PMA-Sb3 attaches at Subject Binding (project_members lookup is Subject Binding's role-resolution sub-axis, not Scope). MA-St11 cross-axis-invariant declared at substrate permits this; G-G13 cross-axis universal at metaframework §3.2.1 governs. Pass.

**AxR2 self-check:** each condition is one mechanical predicate stated directly. No "X passes gate Y" form. Pass.

**AxR3 self-check:** axiom set is the v1.0 baseline. PMA-Sc1..PMA-D3 declared once at v1.0; future versions amend additively per MA-L1 + MA-S7. Pass.

**AxR4 self-check:** all axiom text declarative (no imperative mood, no "should/must" — stated as invariant conditions). Pass.

### §3.7 P8 Procedure step instances

**Zero instances.** Positive empty-declaration per substrate §8.6 + A-17:

```
{
  primitiveKind: 'P8',
  instanceCount: 0,
  basis: 'Permissions Standard Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only. Permissions Standard therefore has zero P8 instances per substrate §8.6 empty-declaration derivation. Decision-time procedure semantics captured declaratively as PMA-Sc1..PMA-D3 axiom set + G-PMS-Sc1..G-PMS-D3 gate set; runtime invocation owned by F-permissions slice (L4 program). Precedent: PS v1.2 §3.7, Plan Standard v2.2 §3.7, Research Standard v1.0 §3.7 declare same empty-P8 pattern.'
}
```

### §3.8 Universal-variables table

Per substrate §3 + metaframework §3.4 universal-variables expression: every axis expresses all four universal variables (Temporal, Categorical, Relational, Positional).

| Axis | Temporal (version) | Categorical (kind) | Relational (depends-on) | Positional (state) |
|---|---|---|---|---|
| `Scope` | v1.0 | ScopeKind enum (per-user, global) | depends on: Permissions-Standard-v1.0 §1; no upstream framework dependency (closed enum local to PMS) | ScopePositional ∈ {'unresolved', 'resolved-per-user', 'resolved-global'} |
| `Subject Binding` | v1.0 | subject identity + role binding | depends on: F-identity slice R3 (subject.userId source); F-permissions R4 (project_members table); upstream PS v1.2 BoundaryCrossingRecord.resolvedScope when decision chains off crossing | SubjectBindingPositional ∈ {'unresolved', 'identity-only', 'role-resolved', 'role-resolution-failed'} |
| `Action Vocabulary` | v1.0 | Action enum + PERMISSION_MATRIX | depends on: F-permissions R0 permissions-config (Action enum + matrix as data) | ActionVocabularyPositional ∈ {'unresolved', 'declared', 'matrix-evaluated'} |
| `Decision` | v1.0 | DecisionOutcome enum + DenyReasonKind enum + basis citation | depends on: all three preceding axes (Decision is the terminal axis; resolves only after Scope + Subject Binding + Action Vocabulary positional state = resolved) | DecisionPositional ∈ {'pending', 'permitted', 'denied'} |

### §3.9 Vocabulary

Framework-local terms declared inline at point of use (per PR1, substrate §10.2). Substrate / metaframework / upstream-framework terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `access-decision` | §1 primitive | The framework-local atomic unit: a structured `AccessDecisionRecord` produced from an `AccessDecisionRequest` per the four-axis structure |
| `ScopeKind` | §3.5 + §2.6 | Closed enum: `'per-user' \| 'global'` |
| `Action` | §3.5 + R0 wire-out | Closed enum from `src/features/F-permissions/config/permissions-config.ts` ACTIONS table |
| `Role` | R0 wire-out | Closed enum from same: `'owner' \| 'member' \| 'viewer'` |
| `DecisionOutcome` | §3.5 + §2.6 | Closed enum: `'permit' \| 'deny'` |
| `DenyReasonKind` | §3.5 + §2.6 | Closed enum: `'no_role' \| 'insufficient_role' \| 'scope_mismatch' \| 'unknown_action'` |
| `PERMISSION_MATRIX` | R0 wire-out | The declared `Record<Role, Action[]>` mapping at `src/features/F-permissions/config/permissions-config.ts` |
| `AccessDecisionRequest` | §2.1 | Input atom shape |
| `AccessDecisionRecord` | §2.2 | Output atom shape |
| `RequestId` | §2.6 | Branded string scalar; one per request |
| `EpochMs` | §2.6 + §2.4 | Branded number scalar for millisecond timestamps (parallel to PS / Plan / VS / RS precedent — declared locally because primitives.ts does not declare EpochMs) |
| `unitary-record` | §1.4 | The distinguishing-property assertion: exactly one AccessDecisionRecord per AccessDecisionRequest |

### §3.13 AxisBasis declarations (per MA-St17, substrate §4 A-22)

Per MA-St17 (added Sprint B1 Shot 2 v3.3.0 per brief Δ-3): every L2 declaration of a kind in the enumerated set that crosses boundary 2 must declare a basis conforming to substrate §4 A-22 AxisBasis. Enumerated kind set: axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums.

#### §3.13.1 Axes basis

| Axis | Basis kind | Basis content |
|---|---|---|
| `Scope` | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'LIV Manual Part IV Governance Loop + Sprint B2 Shot 1 brief domain ruling', manualVersion: '13.1', basis: 'L0 brief Sprint B2 Shot 1 ratified: access scoping — per-user and global. Scope axis is the structural-decomposition site at which per-user vs global discrimination is enforced.'}` |
| `Subject Binding` | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'LIV Manual Part IV Governance Loop + Sprint B2 Shot 1 brief domain ruling', manualVersion: '13.1', basis: 'L0 brief: F-permissions enforces who can access what at scope granularity. Subject Binding axis is the structural-decomposition site at which subject identity + role resolution are enforced.'}` |
| `Action Vocabulary` | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'LIV Manual Part IV Governance Loop + Sprint B2 Shot 1 brief domain ruling', manualVersion: '13.1', basis: 'L0 brief: F-permissions enforces who can access what — what is the action vocabulary. Closed vocabulary discipline per MA-L1 / S3.'}` |
| `Decision` | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — Decision axis output (AccessDecisionRecord) is a WAtom per substrate §4.2 A-01; the structural-mode I/O contract forces a Decision axis to terminate the four-axis decomposition. |

#### §3.13.2 Sub-axes basis

Twelve sub-axes 1:1 with twelve axioms (§3.4). Each sub-axis carries the same `l0-ratified-ref` basis as its parent axis (no separate L0 ratification at sub-axis tier per §3.13.1 + MA-St17 quantifier).

| Sub-axis | Basis kind | Basis content (compact) |
|---|---|---|
| `Scope/enumeration`, `Scope/resolution`, `Scope/nesting` | `l0-ratified-ref` | Parent Scope axis basis (Sprint B2 Shot 1 ratification) |
| `Subject Binding/identity`, `/per-user-match`, `/role-resolution` | `l0-ratified-ref` | Parent Subject Binding axis basis (Sprint B2 Shot 1 ratification) |
| `Action Vocabulary/declaration`, `/closure`, `/matrix-exhaustiveness` | `l0-ratified-ref` | Parent Action Vocabulary axis basis (Sprint B2 Shot 1 ratification) |
| `Decision/outcome`, `/deny-reason`, `/basis` | `substrate-atom-ref` | Parent Decision axis basis (A-01 WAtom) |

#### §3.13.3 Axioms basis

Per LIV-Standard v1.5.2 §3.13.3 sibling-standard-parity declaration: axioms are grounded by their own derivation per MA-St17 exclusion clause ("axiom grounding is handled by the axiom's own derivation"); no A-22 basis required at axiom kind. Permissions Standard's 12 axioms (PMA-Sc1..PMA-D3) are derived from the four-axis decomposition (§3.13.1) which itself is L0-ratified; axiom-tier derivation traces are documented at §3.6 column "Ground class". This subsection documents that fact explicitly for cross-standard parity with LIV-Standard and PS v1.2.

#### §3.13.4 Handoff rules basis

| HR | Basis kind | Basis content |
|---|---|---|
| `HR-PMS1` (consumer → Permissions Standard intake of AccessDecisionRequest) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-03'}` — HandoffContract |
| `HR-PMS2` (Permissions Standard → consumer return of AccessDecisionRecord) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-03'}` |
| `HR-PMS3` (Permissions Standard → F-event-system emission of permissions.* events) | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'LIV Manual Part IV Governance Loop event-emission discipline (LIV-Standard A5 cross-slice notification via event bus only)', manualVersion: '13.1', basis: 'Permissions Standard emits permissions-loaded and access-denied events per LIV-Standard A5; basis traces to A5 (event-bus-only cross-slice notification) ratified at LIV-Standard v1.5.2.'}` |

#### §3.13.5 Lifecycle events basis

| Event | Basis kind | Basis content |
|---|---|---|
| First-run-execution event | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-16'}` — AmendmentProvenance (with extended enum `'first-run'` per metaframework v3.2.4 §5.X) |
| Confirmation gate at §5.3 | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'pending'}, manualLocus: 'LIV Manual Part IV Governance Loop confirmation gate discipline', manualVersion: '13.1', basis: 'Permissions Standard v1.0 confirmation pending L0 confirmation per §5.3.'}` |
| LifecycleState transition (declared → applied) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'LifecycleState'}` (substrate §9 enum) |

#### §3.13.6 Judgment inputs basis

| J-input | Basis kind | Basis content |
|---|---|---|
| `J-permissions-observation` (§7.1) | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'LIV Manual Part IV aggregate-signal-read (post-beta) + Sprint B2 Shot 1 brief observation-input discipline', manualVersion: '13.1', basis: 'L0 ratified judgment input J-permissions-observation as the post-decision-emission observation surface; three mechanical criteria declared at §7.1 per MA-J2 mechanical-criterion ground.'}` |

#### §3.13.7 Closure rules basis

| Closure rule | Basis kind | Basis content |
|---|---|---|
| Axis set closed at 4 entries (§3.3) | `l0-ratified-ref` | Sprint B2 Shot 1 ratification (parent Scope/Subject Binding/Action Vocabulary/Decision basis) |
| ScopeKind enum closed at 2 values (§3.5 PMA-Sc1) | `l0-ratified-ref` | `{kind: 'l0-ratified-ref', ratification: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-1'}, manualLocus: 'Sprint B2 Shot 1 brief domain ruling', manualVersion: '13.1', basis: 'L0 ruling: per-user and global only. Closure rule additive per MA-S7.'}` |
| Action enum closed at 20 values (§3.5 PMA-Av2) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — Action enum is a WAtom shape declared at F-permissions R0; closure rule additive per S3. |
| DecisionOutcome enum closed at 2 values (§3.5 PMA-D1) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — WAtom pattern; structural-mode I/O contract forces binary outcome at the decision tier. |
| DenyReasonKind enum closed at 4 values (§3.5 PMA-D2) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — WAtom pattern; additive per S3. |
| Role enum closed at 3 values | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — Role enum is a WAtom at F-permissions R0 ROLES; closure rule additive. |

#### §3.13.8 Typed shapes basis

| Shape | Basis kind | Basis content |
|---|---|---|
| `AccessDecisionRequest` (§2.1) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — WAtom |
| `AccessDecisionRecord` (§2.2) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` |
| `ResourceScope` (§2.1 nested) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` |
| `PermissionMatrix` | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` |
| `RequestId` | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` |
| `EpochMs` (PMS-local declaration) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` — primitive scalar; same pattern as PS / Plan / VS / RS local EpochMs declarations |
| `RoleBindingResult` (R2 internal) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-01'}` |
| Positional enums (Scope/SubjectBinding/ActionVocabulary/Decision Positional) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-21'}` — StateOrdering (per §3.8 universal-variables) |

#### §3.13.9 Procedure steps basis

Zero declared (P8 instance count = 0 per §3.2 + §3.7). MA-St17 quantifier vacuously satisfied — no procedure-step declarations cross boundary 2.

#### §3.13.10 Coupling enums basis

| Enum | Basis kind | Basis content |
|---|---|---|
| `Carrier` value 'self' (§1) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'Carrier'}` — substrate §9 Carrier enum |
| Custody table rows (§6.5) | `substrate-atom-ref` | `{kind: 'substrate-atom-ref', atomId: 'A-04'}` — CustodyRow |

#### §3.13.11 MA-V10 part B jurisdiction coverage declaration

Per MA-V10 part B (added Sprint B1 Shot 2 v3.3.0): when `framework.governsRuntimeCode = true`, every source-governing axis must have jurisdiction coverage — for every axis with declared `jurisdictionClaim`, the set of ReferentCitations bound to that axis covers every source path under `jurisdictionClaim`.

`governsRuntimeCode = true` declared §1. Per-axis jurisdictionClaim:

| Axis | jurisdictionClaim | ReferentCitations bound | G-V10 part B status |
|---|---|---|---|
| `Scope` | `['src/features/F-permissions/config/permissions-config.ts (ScopeKind-equivalent vocabulary embedded in resourceScope discriminant; presently inline at request callsites)', 'src/features/F-permissions/app/permissions-workflow.ts (resolveAndCheck reads request scope kind)']` | 0 | applicability='n/a' with basis: "Sprint B2 follow-on source-cleanup will author ReferentCitations per MA-V10 part B amendment trigger. v1.0 declares jurisdictionClaim against actual current source paths; runtime-side citation set materializes in same follow-on. Vacuous-pass per MA-V11 with explicit declared drift." |
| `Subject Binding` | `['src/features/F-permissions/exec/permissions-db.ts (getMemberRole)', 'src/features/F-permissions/app/permissions-workflow.ts (resolveAndCheck role resolution + enforceSubstrateReadScope per-user-match)']` | 0 | applicability='n/a' with same basis |
| `Action Vocabulary` | `['src/features/F-permissions/config/permissions-config.ts (ACTIONS enum + PERMISSION_MATRIX)', 'src/features/F-permissions/domain/permissions-logic.ts (can, canAll, canAny matrix lookup)', 'src/core/types/perimeter-standard.types.ts (PermittedAuthoritySet type declaration + PerimeterBinding.permittedAuthorityByChannel field declaration — boundary-side consultation atom for PMA-Av2 vocabulary closure rule per L3.3 disposition (b))', 'src/core/constants/perimeter-standard.ts (DEFAULT_PERIMETER_BINDING.permittedAuthorityByChannel default literal — boundary-side consultation default value for PMA-Av2 vocabulary closure rule per L3.3 disposition (b); deployment default consumed by F-identity middleware)']` | 0 | applicability='n/a' with same basis. Sprint B2 Shot 2 re-roll v1.0.1 genesis-completion patch: jurisdictionClaim extended from 2 to 4 entries — F-permissions runtime sites + PS boundary consultation sites — capturing PMA-Av2 as the single closure rule consulted at two sites (defense-in-depth at boundary, decision-time at access-check). |
| `Decision` | `['src/features/F-permissions/domain/permissions-logic.ts (PermissionDeniedError shape)', 'src/features/F-permissions/app/permissions-workflow.ts (resolveAndCheck decision composition + emitEvent payload shapes)', 'src/features/F-permissions/contract/permissions-contract.ts (requirePermission throw discipline + withPermission HTTP 403 mapping)']` | 0 | applicability='n/a' with same basis |

Zero ReferentCitations at v1.0; partial-drift declared per MA-V11 vacuous-pass with explicit basis prose. Sprint B2 follow-on closes ReferentCitation gap.

#### §3.13.12 AmendmentProvenance (Sprint B2 Shot 1 — v1.0 genesis; Sprint B2 Shot 2 re-roll — v1.0.1 genesis-completion)

```
amendmentProvenance = [
  {
    amendmentId: 'permissions-standard-v1-0-genesis',
    fieldPath: 'entire file (v1.0 genesis)',
    amendedAt: '2026-05-15',
    prevValueRef: null,
    basis: 'Permissions Standard v1.0 genesis under MFv3 v3.3.1 / generation-procedure v1.1.7 / substrate v1.8.1. Fills F-permissions vacant slot per Manual SPEC-v13.1 Operations table L422. Four-axis access-scoping decomposition (Scope, Subject Binding, Action Vocabulary, Decision) ratified L0 per Sprint B2 Shot 1 brief domain ruling. Subsumes PS v1.1 PA-A2 / PA-A3 / PA-Cn3 access-scoping axioms (extraction in companion Shot 2 PS v1.2 amendment). 12 axioms, 12 gates 1:1, three handoff rules, one judgment input, zero procedure steps (Mode=structural per substrate §8.3). MA-I8 governsRuntimeCode=true declared with basis. MA-St17 basis declarations populated across 9 kind categories. MA-V10 part B partial-drift declared per MA-V11 vacuous-pass at zero ReferentCitations (Sprint B2 follow-on closes).',
    amendmentTrigger: 'L0-directive'
  },
  {
    amendmentId: 'permissions-standard-v1-0-1-genesis-completion',
    fieldPath: '§3.13.11 Action Vocabulary jurisdictionClaim',
    amendedAt: '2026-05-15',
    prevValueRef: 'permissions-standard-v1-0 §3.13.11 Action Vocabulary row (2 entries)',
    basis: 'Per L3.3 disposition (b) ratified by L0 at Sprint B2 Shot 2 re-roll: PMA-Av2 owns channel × permitted-authority vocabulary closure as a single concern with two consultation sites — F-permissions runtime access-check site, and PS boundary consultation site. Same axiom, two sites. Defense-in-depth at boundary preserved while PMS owns the single closure rule. v1.0.1 extends Action Vocabulary jurisdictionClaim from 2 entries to 4 entries to make boundary-site jurisdiction explicit: added (a) src/core/types/perimeter-standard.types.ts PermittedAuthoritySet type declaration + PerimeterBinding.permittedAuthorityByChannel field declaration, and (b) src/core/constants/perimeter-standard.ts DEFAULT_PERIMETER_BINDING.permittedAuthorityByChannel default literal. Patch class: genesis-completion (not structural amendment). Original v1.0 intent was always full PMA-Av2 jurisdiction over the channel × permitted-authority closure rule; the boundary-side source-path claim was implicit at v1.0 and is now explicit at v1.0.1. No axiom invariant predicates changed; no gate predicates changed; no schema shapes changed; no closure rule changed; primitive instance counts unchanged. Mechanical predicate at v1.0 baseline.',
    amendmentTrigger: 'L0-directive (Sprint B2 Shot 2 re-roll L3.3 disposition ratification)'
  }
]
```

---

## §4 Validity

### §4.1 Gate count

**12 framework-tier axiom gates** declared Permissions-Standard-local (1:1 with PMA-Sc1..PMA-D3 axioms per G-M1). Plus inherited 87 framework-tier metaframework gates (per metaframework v3.3.1 §4.7) executed at audit time. **Total framework-tier gates: 99** (12 + 87).

| Category | Count | ID range |
|---|---|---|
| Permissions-Standard-own axiom gates | 12 | G-PMS-Sc1, G-PMS-Sc2, G-PMS-Sc3, G-PMS-Sb1, G-PMS-Sb2, G-PMS-Sb3, G-PMS-Av1, G-PMS-Av2, G-PMS-Av3, G-PMS-D1, G-PMS-D2, G-PMS-D3 |
| Inherited framework-tier gates | 87 | per metaframework v3.3.1 §4.7 MetaframeworkGateIdSet |
| **Total framework-tier** | **99** | |

### §4.2 Permissions-Standard-own axiom gates

Per G-M1 (axiom-gate 1:1 mapping) + MA-V1 (every axiom has ≥1 gate):

| Gate | Tests axiom | Mechanical test body |
|---|---|---|
| **G-PMS-Sc1** | PMA-Sc1 | enum-membership check: `request.resourceScope.kind ∈ {'per-user', 'global'}`; non-null check; cardinality = 1 |
| **G-PMS-Sc2** | PMA-Sc2 | mechanical equality check `record.resolvedScope.kind === request.resourceScope.kind`; conditional cardinality per kind discriminant |
| **G-PMS-Sc3** | PMA-Sc3 | negative invariant: across decision records, no record where `(record.resolvedScope.kind === 'per-user')` and `(record.decision.role !== null)` and `(no project_members row resolves for (subject.userId, resourceScope.projectId))` — closure-by-iteration over emitted decisions |
| **G-PMS-Sb1** | PMA-Sb1 | non-null + non-empty string check on `request.subject.userId`; equality preservation to `record.subject.userId` |
| **G-PMS-Sb2** | PMA-Sb2 | conditional equality: `request.resourceScope.kind === 'per-user' AND request.resourceScope.userId !== null` → `request.subject.userId === request.resourceScope.userId` |
| **G-PMS-Sb3** | PMA-Sb3 | reference resolution: when `request.resourceScope.kind === 'per-user' AND request.resourceScope.projectId !== null` then `record.decision.role` is the value returned by R4 getMemberRole(subject.userId, resourceScope.projectId); null-handling: getMemberRole null → record.decision.role null AND record.decision.outcome === 'deny' AND record.decision.denyReason === 'no_role' |
| **G-PMS-Av1** | PMA-Av1 | enum-membership check: `request.action ∈ Action enum`; preservation `record.action === request.action` |
| **G-PMS-Av2** | PMA-Av2 | static enum-closure check: Action enum cardinality and content at audit time match the v1.0 declared set; no runtime additions present |
| **G-PMS-Av3** | PMA-Av3 | cardinality: for every `(r, a) ∈ (Role × Action)`, PERMISSION_MATRIX[r] is non-undefined; matrix exhaustiveness verified by iteration |
| **G-PMS-D1** | PMA-D1 | enum-membership check: `record.decision.outcome ∈ {'permit', 'deny'}`; non-null; cardinality = 1 (one decision per request) |
| **G-PMS-D2** | PMA-D2 | conditional cardinality + enum-membership: `outcome === 'deny'` → `denyReason ∈ DenyReasonKind`; `outcome === 'permit'` → `denyReason === null` |
| **G-PMS-D3** | PMA-D3 | non-null + non-empty string check on `record.decision.basis`; reference-resolution check that basis prose cites substrate §6.3 six-class enum identifier |

**Gate-result-shape consistency:** every G-PMS-* gate produces a GateResult per framework-audit §8.1 schema (binary truthValue, orthogonal applicability + executionState fields per cycle-1 F-cycle-1-3 GateResult decomposition).

### §4.3 Inherited gate execution at audit time

Per metaframework §4.4 + framework-audit §3.3: when an audit runs against Permissions Standard, the 87 inherited framework-tier gates execute over Permissions Standard's GeneratedFrameworkTemplate fields per E1–E8 partition (generation-procedure v1.1.7 §3.3).

### §4.4 Dimension–gate mapping (per MA-V5)

Per metaframework MA-V5 + framework-audit §3.3 ten audit dimensions X1–X10:

| Dimension | Tests | Permissions-Standard sites |
|---|---|---|
| X1 Identity | MA-I1..MA-I8 | §1 identity table; §1.2 axiom-satisfaction table |
| X2 Schema | MA-S1..MA-S8 | §2 schema; §2.3..§2.6 type-import tables |
| X3 Structure | MA-St1..MA-St17 | §3.3..§3.13 structure declarations |
| X4 Validity | MA-V1..MA-V11 | §4 validity tables; §4.2 G-PMS-* gates |
| X5 Lifecycle | MA-L1..MA-L11 | §5 lifecycle; §5.9 change log |
| X6 Coupling | MA-C1..MA-C10 | §6 coupling; §6.5 custody table |
| X7 Judgment | MA-J1..MA-J5 | §7 judgment; §7.1 J-permissions-observation |
| X8 Bootstrap | MA-I5 + MA-L7 | §1.1 GenesisDeclaration |
| X9 LifecycleState extensions | substrate §9 + framework-audit §3.3 | §1 LifecycleState declarations |
| X10 Procedure-step | substrate §8.3 + PR4 + PR5 | §3.7 P8 empty-declaration |

### §4.5 Gate execution order

Per substrate §11.5 + metaframework §4.4: substrate → axiom → universal → meta.

### §4.6 Meta-gate backward-invalidation

Per metaframework §4.5: G-M failure → universal gates re-run; tier-1 failure terminal.

### §4.7 Gate rules (GR-series)

Per metaframework §4.6. Unchanged from spec; consumed by reference.

### §4.8 Current gate results

**Permissions-Standard-own gates G-PMS-Sc1..G-PMS-D3:** state = `not-yet-run` at v1.0 delivery. First-run pending framework-audit per §5 first-run-execution lifecycle event.

**Vacuous-pass enumeration at v1.0 (declared per MA-V11 + R-phase-1-1-resolution-12 mechanical-criterion ground class):**

| Gate | Vacuous-pass condition at v1.0 | Promotion trigger |
|---|---|---|
| G-PMS-Sc1, G-PMS-Sc2, G-PMS-Av1, G-PMS-Av2, G-PMS-D1, G-PMS-D2, G-PMS-D3 | Apply to runtime `AccessDecisionRecord` instances; F-permissions slice runtime constructs records via `resolveAndCheck` which inherently satisfies these by construction (mechanical equality preservation + enum-typed return shape). First-run validates against emitted records. | Sprint B2 follow-on first-runtime-decision event populates AuditRunRecord. |
| G-PMS-Sc3 | Negative invariant across the set of emitted decisions; vacuously satisfied while emitted set is empty. | Sprint B2 follow-on first-runtime-decision event. |
| G-PMS-Sb1, G-PMS-Sb2, G-PMS-Sb3 | F-permissions runtime resolves subject.userId from F-identity perimeter session (PA-A1 upstream); G-PMS-Sb3 lookup at R4 returns deterministic Role-or-null. | Sprint B2 follow-on first-runtime-decision event. |
| G-PMS-Av3 | Static check on PERMISSION_MATRIX cardinality; runs against the in-memory matrix at startup. Vacuously pass at v1.0 because the matrix is declared with all (Role, Action) cells explicit at `src/features/F-permissions/config/permissions-config.ts`. | Sprint B2 follow-on first-runtime-decision event re-validates after any matrix amendment. |
| Inherited framework-tier gates (87 from MFv3 v3.3.1) | Apply at first framework-audit run against Permissions Standard. | First framework-audit run on Permissions Standard. |

**Referent-citation gates** (G-V10 part A, G-S8, G-L11): vacuous-pass per MA-V11 + substrate §10.1 S4. Basis: zero ReferentCitations at v1.0; partial-drift declared per §1 referentCitations. Sprint B2 follow-on populates ReferentCitations.

**G-V10 part B** (jurisdiction coverage per MA-I8 governsRuntimeCode=true): applicability='n/a' with declared basis per §3.13.11. Sprint B2 follow-on closes jurisdiction-coverage gap by populating ReferentCitations.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 — initial Permissions Standard declaration filling Manual SPEC-v13.1 Operations table L422 vacant slot. Four axes (Scope, Subject Binding, Action Vocabulary, Decision); 12 axioms + 12 gates 1:1; carrier `self`; subsumes PS v1.1 PA-A2 / PA-A3 / PA-Cn3 access-scoping (extracted in companion Sprint B2 Shot 2 PS v1.2 amendment).

### §5.2 Amendment trigger

Vision-driven. Sprint B2 Shot 1 brief L0 ruling on F-permissions domain. No amendment active at delivery.

### §5.3 Confirmation gate

Pending L0 confirmation at v1.0 delivery. Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` — no active escalation at delivery.

### §5.5 Judgment deprecations

Empty at delivery. No MA-L5 events at v1.0.

### §5.6 Failure modes

Per metaframework MA-L8 declared failure-mode enumeration:

| Failure mode | Detection | Remediation |
|---|---|---|
| Scope discriminant absent / null `request.resourceScope.kind` | G-PMS-Sc1 fail | Reject request at R3 contract surface; emit `permissions.access-denied` with `denyReason='unknown_action'` (treated as malformed request); throw `PermissionsValidityError` to caller |
| Subject userId null | G-PMS-Sb1 fail | Same as above; F-identity is upstream; null subject at F-permissions indicates F-identity perimeter break |
| Per-user-scope subject mismatch (request.subject.userId !== request.resourceScope.userId) | G-PMS-Sb2 fail | Deny with `denyReason='scope_mismatch'`; emit `permissions.access-denied`; throw PermissionDeniedError to caller |
| project_members lookup fails (DB error vs null result) | G-PMS-Sb3 evaluation + R4 Result error path | DB error → propagate R4 Result error to caller (R2 throws); null result → deny with `denyReason='no_role'`; emit `permissions.access-denied` |
| Unknown action enum value | G-PMS-Av1 fail | Deny with `denyReason='unknown_action'`; emit `permissions.access-denied` |
| Matrix non-exhaustive at startup | G-PMS-Av3 fail (static check) | Build-time / startup error; F-permissions slice fails to initialize; deploy block |
| Decision outcome null | G-PMS-D1 fail | Internal contract violation at R2; throw PermissionsValidityError; propagate to caller |

### §5.7 Scale bounds

Permissions Standard v1.0: 12 axioms × 12 own gates = 144 own gate-axiom pairs. Plus 87 inherited framework-tier gates × 12 dimensions = scope of audit. PERMISSION_MATRIX: O(|Role| × |Action|) = O(3 × 20) = O(60) cells (cardinality finite at v1.0). project_members table lookup: O(1) keyed by (userId, projectId).

### §5.8 Atomicity declarations

Per substrate §13.4: one `AccessDecisionRecord` per `AccessDecisionRequest` is atomic. Resolve-and-check is a single R2 transaction: matrix lookup is in-memory pure; project_members lookup is a single SELECT; decision composition is pure; event emission is post-decision (per LIV-Standard A5 — events do not gate the decision). No partial-decision state.

### §5.9 Manual Operations table sweep

Per Sprint B2 Shot 1 brief: Manual `frameworks/manual/liv-manual.md` Operations table L422 — F-permissions row transitions from "Acknowledged vacant" to "Filled" with standard Permissions Standard v1.0. Change recorded in Manual sweep at Shot 2 delivery (companion amendment in same sprint).

| Version | Cycle | Authority |
|---|---|---|
| v1.0 | Sprint B2 Shot 1 (2026-05-15): initial Permissions Standard declaration filling Manual SPEC-v13.1 Operations table L422 F-permissions vacant slot. Four axes (Scope, Subject Binding, Action Vocabulary, Decision) ratified L0 per brief domain ruling. 12 axioms + 12 gates 1:1; carrier `self`; subsumes former PS v1.1 PA-A2 / PA-A3 / PA-Cn3 access-scoping axioms (extracted to here in companion Shot 2 PS v1.2 amendment). MA-I8 governsRuntimeCode=true with basis prose covering F-permissions slice (`src/features/F-permissions/**`). MA-St17 basis declarations populated across 9 kind categories at §3.13. MA-V10 part B partial-drift declared per MA-V11 vacuous-pass at zero ReferentCitations (Sprint B2 follow-on closes). Pre-existing F-permissions slice runtime code (5 R-layer files: R0 config + events + wires; R1 logic; R2 workflow; R3 contract + hook; R4 db) predates the standard but conforms to LIV-Standard A1–A7 slice discipline; this delivery declares the standard against which the existing slice is mechanically verified. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending-Sprint-B2-Shot-1-ratification'} | L0 (pending confirmation) |
| v1.0.1 | Sprint B2 Shot 2 re-roll (2026-05-15): genesis-completion patch per L3.3 disposition (b) ratified by L0. **Δ:** §3.13.11 Action Vocabulary axis jurisdictionClaim extended from 2 entries to 4 entries — added `src/core/types/perimeter-standard.types.ts` PermittedAuthoritySet block + `src/core/constants/perimeter-standard.ts` DEFAULT_PERIMETER_BINDING as boundary-side consultation atoms for PMA-Av2 vocabulary closure rule. **Rationale:** PMA-Av2 owns channel × permitted-authority closure as a single concern with two consultation sites (boundary + access-check); v1.0 declared the rule but left the boundary-site source-path claim implicit. v1.0.1 makes it explicit. **Discipline:** patch class genesis-completion (not structural amendment) — original v1.0 intent was always full jurisdiction; this just makes the claim explicit. No axiom invariant predicates changed; no gate predicates changed; no schema shapes changed; no closure rule changed; primitive instance counts unchanged. §1 version row 1.0 → 1.0.1; §1 referentCitations basis prose updated; §1.1 GenesisDeclaration `predecessorVersion: null` → `'1.0'` + cycle annotation + Bootstrap status appended with v1.0.1 narrative; §3.13.12 AmendmentProvenance now array with 2 entries (v1.0 genesis + v1.0.1 genesis-completion); this §5.9 + §9 row appended. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll'} | L0 (Sprint B2 Shot 2 re-roll) |

---

## §6 Coupling

### §6.1 Carrier

Permissions Standard carrier = `self`. Permissions Standard emits its own atom `AccessDecisionRecord` directly to consumers via the F-permissions slice R3 contract surface. Distinct from PS v1.2 (carrier=named→living-memory) and Plan/VS/RS (carrier=named→artifact-standard): Permissions Standard does not produce artifacts about its decisions, nor does it write decisions as substrate state-changes. Decisions are ephemeral per-request structures consumed inline by callers. Event emission (`permissions.permissions-loaded`, `permissions.access-denied`) is a post-decision side-effect via F-event-system per LIV-Standard A5, not a primary carrier.

**Carrier=self ratification:** per substrate §9 Carrier semantics ("self: framework emits own artifact; owns emission mechanics"). F-permissions slice R2 + R3 own the emission mechanics; decisions ride inline in R2 / R3 return shapes. Ratified L0 at Sprint B2 Shot 1.

### §6.2 Handoff rules

Three framework-local HR instances. All Permissions-Standard-owned handoffs have declared `captureShape` per substrate §8.2 amended P6 + X3 C5 requirement.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| **HR-PMS1** | consumer (R3 callsite) → Permissions Standard (AccessDecisionRequest intake) | `['self']` | `true` | declared §6.3 |
| **HR-PMS2** | Permissions Standard → consumer (AccessDecisionRecord return; throws PermissionDeniedError on outcome='deny' per `requirePermission` discipline) | `['self']` | `true` | declared §6.3 |
| **HR-PMS3** | Permissions Standard → F-event-system (permissions.* event emission per LIV-Standard A5) | `['self']` | `true` | declared §6.3 |

**Inherited HRs referencing Permissions Standard:**

| HR | Owning declaration | Permissions Standard's role |
|---|---|---|
| HR1 | metaframework §6.2 | substrate → Permissions Standard type consumption (UserId, Semver, AuthorityAssertion A-23, AuthorityClaim §5.3, etc.) |
| HR6 | metaframework §6.2 | metaframework → generated L3 frameworks; Permissions Standard is the generated L3 template output contract |
| HR5 | metaframework §6.2 | metaframework → registry; registry records Permissions Standard's framework declaration per provenance contract (see §6.6) |

Per substrate §1.3 SI-03: these HRs are referenced, not redeclared.

### §6.3 Capture shapes (per P6 amended shape, substrate §8.2)

**HR-PMS1 — consumer → Permissions Standard (AccessDecisionRequest intake):**
```
captureShape = {
  capturedFields: ['request.requestId', 'request.subject.userId', 'request.action', 'request.resourceScope.kind', 'request.resourceScope.userId', 'request.resourceScope.projectId', 'request.requestedAt', 'request.correlationRef'],
  captureTarget: 'audit-trail',
  queryInterface: 'event-store query against permissions.* event records emitted at HR-PMS3'
}
```

**HR-PMS2 — Permissions Standard → consumer (AccessDecisionRecord return):**
```
captureShape = {
  capturedFields: ['record.requestId', 'record.decision.outcome', 'record.decision.role', 'record.decision.denyReason', 'record.decision.basis', 'record.resolvedScope.kind', 'record.subject.userId', 'record.action', 'record.permissionsFrameworkVersion', 'record.decidedAt'],
  captureTarget: 'audit-trail',
  queryInterface: 'event-store query against permissions.* event records emitted at HR-PMS3; decisions indexed by requestId'
}
```

**HR-PMS3 — Permissions Standard → F-event-system (event emission):**
```
captureShape = {
  capturedFields: ['eventType (permissions-loaded | access-denied)', 'payload.userId', 'payload.projectId', 'payload.action', 'payload.role', 'payload.reason'],
  captureTarget: 'event-store',
  queryInterface: 'F-event-system event-bus / event-store query per F-event-system convention'
}
```

### §6.4 Handoff axioms satisfaction

Per MA-C1..MA-C10 (metaframework §3.2 Coupling axis):

- **MA-C1** (carrier declared per substrate §9): §6.1 declares `carrier = 'self'`.
- **MA-C2** (custody per atom): §6.5 enumerates every PMS-local atom with owner + layer + consumers.
- **MA-C3** (handoff-invariant symmetry): HR-PMS1..HR-PMS3 send/receive shapes matched by construction.
- **MA-C4** (provenance per output field): §2.2 every `AccessDecisionRecord` field has declared provenance trace; §6.5 custody; §6.6 top-level provenance.
- **MA-C5** (carrier-consistent emission): `carrier = 'self'` → output emitted directly without enclosing carrier per MA-S2.
- **MA-C6** (no re-ownership): custody table §6.5 declares single owner per atom; substrate / primitives.ts / metaframework / PS atoms referenced at §2.3..§2.5 are not re-owned.
- **MA-C7..MA-C10** (cycle-2 + earlier extensions): cross-framework ID coherence + substrate-version-pin uniformity + diagnostic-significance per HR + capture-target completeness — satisfied per §6.2 + §6.3 declarations.

### §6.5 Custody table

Every atom consumed or declared, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `UserId` | primitives.ts | core/R5 | permissions-standard (subject.userId, resourceScope.userId), every session-aware framework |
| `ProjectId` | primitives.ts | core/R5 | permissions-standard (resourceScope.projectId), F-project, F-chat, F-builder |
| `Semver` | primitives.ts | core/R5 | permissions-standard (§1 version, §2.2 permissionsFrameworkVersion) |
| `Result<T>` | primitives.ts | core/R5 | permissions-standard R4 db calls |
| `AppError` | primitives.ts | core/R5 | permissions-standard R4 db error shape |
| `AuthorityAssertion` | substrate §5.6 A-23 | substrate-tier | permissions-standard (when decision chains off PS BoundaryCrossingRecord.resolvedAuthority; runtime shape `{level, actor, source}` consumed by reference per Shot 2 cascade) |
| `AuthorityClaim` | substrate §5.3 | substrate-tier | metaframework apparatus (governance stamps); zero runtime crossing sites in PMS v1.0.2 body after cascade |
| `LifecycleState` | substrate §9 | substrate | permissions-standard (§1 stateTemplate/stateApplied) |
| `Carrier` | substrate §9 | substrate | permissions-standard (§1 carrier='self') |
| `Kind` | substrate §4 A-10 | substrate | permissions-standard (§1 Identity) |
| `Ownership` | substrate §4 A-11 | substrate | permissions-standard (§1 Identity) |
| `GenesisDeclaration` | substrate §4 A-14 | substrate | permissions-standard (§1.1) |
| `AxisBasis` | substrate §4 A-22 | substrate | permissions-standard (§3.13 basis declarations) |
| `ReferentCitation` | substrate §4 A-18 | substrate | permissions-standard (§1 referentCitations, empty at v1.0) |
| `BoundaryCrossingRecord` | perimeter-standard v1.2 | L3 standards | permissions-standard (consumed when decisions chain off crossing; reference only) |
| `RequestId` | permissions-standard | core/R5 (post-merge to types file) | F-permissions/R0 R0 callsites; R2 resolveAndCheck |
| `EpochMs` | permissions-standard | core/R5 (post-merge to types file) | F-permissions/R2 resolveAndCheck timestamp |
| `ScopeKind` | permissions-standard | core/R5 (post-merge to types file) | F-permissions/R0 R0 + R2; F-identity middleware (scope-claim emission) |
| `Action` | permissions-standard (declared as Action enum at F-permissions/R0 permissions-config.ts; type aliased at core/R5 post-merge) | core/R5 + F-permissions/R0 | F-permissions R1 (can / canAll / canAny matrix lookup); all R3 caller slices via requirePermission |
| `Role` | permissions-standard (declared as Role enum at F-permissions/R0 permissions-config.ts; type aliased at core/R5 post-merge) | core/R5 + F-permissions/R0 | F-permissions R1 + R2 + R3 + R4 |
| `DecisionOutcome` | permissions-standard | core/R5 (post-merge to types file) | F-permissions R2 (decision composition); audit consumers |
| `DenyReasonKind` | permissions-standard | core/R5 (post-merge to types file) | F-permissions R2 (deny composition); event payload; audit consumers |
| `PermissionMatrix` | permissions-standard (PERMISSION_MATRIX declared at F-permissions/R0; structural type at core/R5) | core/R5 + F-permissions/R0 | F-permissions R1 matrix lookup |
| `ResourceScope` | permissions-standard | core/R5 (post-merge to types file) | F-permissions R2 + R3 callsites |
| `AccessDecisionRequest` | permissions-standard | core/R5 (post-merge to types file) | R3 callsites; R2 resolveAndCheck input |
| `AccessDecisionRecord` | permissions-standard | core/R5 (post-merge to types file) | R3 callsites; R2 resolveAndCheck output; audit consumers |
| `RoleBindingResult` | permissions-standard | F-permissions/R4 internal | F-permissions/R4 getMemberRole return shape (alias of `Result<Role \| null>`) |
| `PermissionsValidityError` | permissions-standard | core/R5 (post-merge to types file) | F-permissions error surface |
| `ScopePositional`, `SubjectBindingPositional`, `ActionVocabularyPositional`, `DecisionPositional` | permissions-standard | core/R5 (post-merge to types file) | F-permissions R2 internal state machine; not exposed across R3 boundary at v1.0 |

### §6.6 Provenance (top-level GeneratedFrameworkTemplate field)

```
provenance = {
  generatedByMetaframework: {id: 'metaframework', version: '3.3.1'},
  generationProcedureRef: {id: 'generation-procedure', version: '1.1.7'},
  generationTimestamp: '2026-05-15T00:00:00Z',
  sourceInputRef: {atomId: 'MetaframeworkInput', version: 'sprint-b2-shot-1', registryRef: 'pending-registry-write'},
  sourceInputValue: null
}
```

### §6.7 OperatorInterface

Per substrate §4 A-13:

```
operatorInterface = {
  invocationEntry: 'HR-PMS1 (R3 contract surface — F-permissions/contract/permissions-contract.ts requirePermission / withPermission / enforceSubstrateReadScope)',
  outputRetrieval: 'HR-PMS2 (return shape of requirePermission, resolveAndCheck) + HR-PMS3 event-store query',
  auditQuery: 'framework-audit §8.3 AuditRunRecord query path; decisions indexed by requestId at event-store',
  runtimeState: 'implemented'
}
```

Runtime state = `implemented`: F-permissions slice runtime code exists at HEAD `4955ac0` (pre-dates Permissions Standard v1.0 derivation; slice was wired during Sprint 6 / Sprint 11 / Sprint 12 prior to standard ratification).

### §6.8 Atom flow

| Atom | Origin | Destination |
|---|---|---|
| `AccessDecisionRequest` | R3 callsite (consumer) | R2 resolveAndCheck (input) |
| `AccessDecisionRecord` | R2 resolveAndCheck | R3 caller (return); HR-PMS3 emission payload component |
| permissions.permissions-loaded event | R2 (post-permit) | F-event-system event-bus |
| permissions.access-denied event | R2 (post-deny) | F-event-system event-bus |

### §6.9 Carrier relation

Carrier = `self`. Permissions Standard's "carrier" is its own contract surface: R3 (`requirePermission`, `withPermission`, `enforceSubstrateReadScope`) is the consumer-facing entry. No external carrier framework consumes the decision atom — decisions are ephemeral per-request structures that callers branch on inline. Event-bus emission is a post-decision side-effect, not the primary delivery channel.

### §6.10 Cross-framework calibration

| Adjacent | Calibration check | Result |
|---|---|---|
| Perimeter Standard v1.2 | PS hands resolved authority + scope on BoundaryCrossingRecord; Permissions Standard reads these for decisions chained off crossings; no shape contract between PS and PMS at v1.0 (PMS reads PS-produced records, doesn't proxy through PS) | PASS (read-side consumer of PS output) |
| Living Memory v3.3 | Permissions Standard scopes substrate-read access via PMA-Sb2 + PMA-Sb3; LM owns thread-query primitive; no shape contract between PMS and LM (PMS gates read calls; LM executes them under the PMS-cleared scope) | PASS (gate-and-clear pattern) |
| LIV-Standard v1.5.2 | F-permissions slice governed by LIV-Standard A1–A7; Permissions Standard governs decision-time content; complementary tiers (slice discipline vs framework content) | PASS (orthogonal concerns) |
| F-event-system | HR-PMS3 emits permissions.* events via the event-bus per LIV-Standard A5 cross-slice notification rule; F-event-system owns event-bus mechanics; PMS owns event payload shape | PASS (A5-compliant emission) |
| F-identity | F-identity establishes the authenticated subject identity at the perimeter session; PMS consumes the resolved UserId; no shape contract beyond UserId reference | PASS (upstream-consumer) |

---

## §7 Judgment

### §7.1 J-permissions-observation

Permissions-Standard-local judgment input. Per metaframework §7 + MA-J1..MA-J5 + substrate §6.

```
J-permissions-observation = {
  id: 'J-permissions-observation',
  declared: 'permissions-standard §7.1',
  consumedAt: 'post-decision-emission observation surface (Sprint B2 follow-on aggregate-signal-read site)',
  criteria: [
    {
      id: 'C1',
      predicate: 'count of access-denied events emitted with denyReason ∈ {no_role, scope_mismatch} over an observation window resolves to a finite cardinality',
      groundClass: 'cardinality',
      groundCitation: 'substrate §6.3 cardinality class'
    },
    {
      id: 'C2',
      predicate: 'every emitted permissions.access-denied event payload conforms to the declared shape (userId, projectId, action, reason) — type-check per primitives.ts + R0 wire-out',
      groundClass: 'type-check',
      groundCitation: 'substrate §6.3 type-check class'
    },
    {
      id: 'C3',
      predicate: 'every emitted permissions.permissions-loaded event references a Role enum value present in F-permissions/R0 ROLES constant — enum-membership check',
      groundClass: 'enum-membership',
      groundCitation: 'substrate §6.3 enum-membership class'
    }
  ],
  provenance: {
    declaredBy: 'L0 ratification at Sprint B2 Shot 1 brief',
    timestamp: 'Sprint-B2-Shot-1'
  }
}
```

Per MA-J2: all three criteria are mechanical per substrate §6.3 six-class enum. Per MA-J3: provenance declared. Per MA-J4: lifecycle declared (consumed post-decision-emission, observation-window-bounded). Per MA-J5: no anonymous judgment.

---

## §8 Self-audit

### §8.1 Aggregate self-audit at v1.0

Per framework-audit §8.1 SelfAuditRecord schema.

| Dimension | Bundle | Result |
|---|---|---|
| X1 Identity (E1) | PG1 + G-I1..G-I8 | PASS (§1 identity table populated; §1.2 axiom-satisfaction table populated; MA-I8 governsRuntimeCode=true with basis prose) |
| X2 Schema (E2) | PG2 + G-S1..G-S8 | PASS at part A (typed shape declarations populated §2); part-A vacuous for ReferentCitation conformance (zero RCs at v1.0; MA-V11 vacuous-pass) |
| X3 Structure (E3) | PG3 + G-St1..G-St17 | PASS — including G-St17 with basis declarations at §3.13 (1 axis + 12 sub-axes + 3 HRs + 3 lifecycle events + 1 J-input + 6 closure rules + 8 typed shapes + 0 procedure steps + 2 coupling enums = 36 basis declarations) |
| X4 Validity (E4) | PG4 + G-V1..G-V11 | PASS at part A (gate set declared §4.2; MA-V1 1:1 with axioms); G-V10 part B applicability='n/a' with declared basis per §3.13.11 (partial-drift declared per MA-V11 vacuous-pass) |
| X5 Lifecycle (E5) | PG5 + G-L1..G-L11 | PASS at part A (lifecycle declared §5; MA-L1 additive monotonic; first-run-execution event declared); G-L11 vacuous-pass at zero RCs |
| X6 Coupling (E6) | PG6 + G-C1..G-C10 | PASS (carrier='self' declared §6.1; HRs declared §6.2; custody table §6.5 enumerates every atom) |
| X7 Judgment (E7) | PG7 + G-J1..G-J5 | PASS (J-permissions-observation declared §7.1; all three criteria mechanical per substrate §6.3; provenance declared) |
| X8 Bootstrap (G-G13 + G-U1..G-U5) | universal tier | PASS (§1.1 GenesisDeclaration; bootstrapped=false; predecessorVersion=null; MA-G13 four-property test §1.3 pass) |
| Meta-tier (G-M1..G-M4) | meta-gate tier | PASS (G-M1 axiom-gate 1:1 §4.2; G-M2 exhaustive over axioms; G-M3 tier order respected; G-M4 escalation path declared §5.6) |

**Overall result:** PASS-with-declared-partial-drift. Partial drift at ReferentCitations (zero RCs at v1.0; targeted at Sprint B2 follow-on per §1 referentCitations basis). No structural failures.

### §8.2 Cross-framework consistency check

| Adjacent | Calibration check | Result |
|---|---|---|
| Perimeter Standard v1.2 | PS v1.2 (post-Shot-2 amendment) no longer declares PA-A2, PA-A3, PA-Cn3 — those access-scoping axioms relocate to Permissions Standard v1.0 (PMA-Sb2, PMA-D2, PMA-Av2 respectively per §3.6 relocation rationale). No axiom in both standards. | PASS (per Sprint B2 Shot 2 extraction discipline) |
| Living Memory v3.3 | Permissions Standard's PMA-Sb2 + PMA-Sb3 gate substrate-read calls at the F-permissions R3 surface (`enforceSubstrateReadScope`); LM thread-query primitive consumes the cleared scope. No shape contract between standards. | PASS |
| LIV-Standard v1.5.2 | F-permissions slice conforms to A1–A7 slice discipline (single ownership R0–R4; directional dependency; typed boundaries; isolated R4 I/O; event-only cross-slice notification per A5; declaration at origin R0; deletability per A7) — verified mechanically at IN-COMPILE / IN-AUDIT pipeline instances against existing slice code at HEAD `4955ac0`. | PASS |
| F-event-system | HR-PMS3 emits via event-bus per A5; F-event-system owns event-bus mechanics; PMS owns payload shape per §6.3 captureShape. | PASS |
| Metaframework v3.3.1 | Generation procedure v1.1.7 consulted; §1.1 GenesisDeclaration cites; full Permissions Standard file conforms to GeneratedFrameworkTemplate shape per §2.2 metaframework output schema. | PASS |

### §8.3 Last audit event

| Field | Value |
|---|---|
| Audit run kind | self-audit-at-declaration (v1.0 genesis) |
| Audit timestamp | 2026-05-15T00:00:00Z |
| Audit result | PASS-with-declared-partial-drift |
| Audit-record reference | this §8.1 + §8.2 |
| Next scheduled audit | first framework-audit run post-L0-confirmation |

---

## §9 Change log

| Version | Cycle | Authority |
|---|---|---|
| v1.0 | Sprint B2 Shot 1 (2026-05-15): initial Permissions Standard declaration filling Manual SPEC-v13.1 Operations table L422 F-permissions vacant slot. Four axes (Scope, Subject Binding, Action Vocabulary, Decision) ratified L0 per brief domain ruling. 12 axioms + 12 gates 1:1; carrier `self`; subsumes former PS v1.1 PA-A2 / PA-A3 / PA-Cn3 access-scoping axioms (extracted in companion Sprint B2 Shot 2 PS v1.2 amendment). MA-I8 governsRuntimeCode=true with basis prose. MA-St17 basis declarations populated. MA-V10 part B partial-drift declared per MA-V11 vacuous-pass. Pre-existing F-permissions slice runtime code (5 R-layer files) verified against LIV-Standard A1–A7. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'pending'} | L0 (pending confirmation) |
| v1.0.1 | Sprint B2 Shot 2 re-roll (2026-05-15): genesis-completion patch per L3.3 disposition (b) ratified by L0. Action Vocabulary axis jurisdictionClaim extended from 2 → 4 entries (PMS adopts boundary-side consultation sites for PMA-Av2 vocabulary closure rule — same axiom, two sites; defense-in-depth at boundary preserved). Patch class: genesis-completion (not structural amendment); no axiom/gate/schema/closure changes. Detailed Δ at §5.9 v1.0.1 row + §3.13.12 AmendmentProvenance v1.0.1 entry. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot-2-reroll'} | L0 (Sprint B2 Shot 2 re-roll) |
| v1.0.2 | Sprint B2 Shot 2 cascade — AuthorityClaim → AuthorityAssertion at runtime sites (2026-05-16): patch-level rewire per substrate v1.8.2 atom split. **Δ:** §2.3 consumed types table: `AuthorityClaim` row replaced with `AuthorityAssertion` (substrate §5.6 A-23) as the runtime authority shape consumed when decisions chain off PS BoundaryCrossingRecord; `AuthorityClaim` retained with zero-sites note (governance only). §6.5 custody table: `AuthorityClaim` row updated to `AuthorityAssertion` (runtime) + `AuthorityClaim` (governance zero-sites). §1 version 1.0.1 → 1.0.2; this §9 row added. Cross-framework: substrate v1.8.2 + atom A-23 cited. No axiom invariant predicates changed; no gate predicates changed; no schema shapes changed; cascade-rewire only. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Sprint-B2-Shot2-cascade'} | L0 pending |

---

## §10 Decision-D table (Sprint B2 Shot 1)

Per spec D-records inline in tar manifest. Permissions-Standard-internal D-records:

| D-record | Site | Decision |
|---|---|---|
| D1 | §3.3 axis derivation | Four-axis decomposition (Scope, Subject Binding, Action Vocabulary, Decision) MECE over L0 domain ruling. L0-ratified. |
| D2 | §6.1 carrier | Carrier=self. Permissions Standard emits decisions inline via R3 contract surface; no enclosing framework carries the decision atom. |
| D3 | §3.6 PMA-Sb2 / PMA-Av2 / PMA-D2 relocation | PA-A2 / PA-Cn3 / PA-A3 (former PS axioms) extracted to Permissions Standard with same structural concerns but re-decomposed under Permissions Standard's four-axis structure. No PS-original wording preserved; relocation is a re-derivation in the new domain. |
| D4 | §1.1 GenesisDeclaration bootstrapped=false | Permissions Standard is a fresh L3 framework; pre-existing F-permissions slice code does not constitute predecessor framework. |
| D5 | §1 governsRuntimeCode=true | F-permissions slice runtime code under `src/features/F-permissions/**` is the source-governing site. jurisdictionClaim per axis declared §3.13.11. |

---

## §C.6 Derivation trace appendix

L0 brief Sprint B2 Shot 1: "access scoping — per-user and global. Not authority enforcement at the crossing (PS owns that). Not L0 operational surface (F-admin owns that as L0-tier Tool post-reshape). F-permissions enforces *who can access what* at scope granularity."

Decomposition:

1. **What kinds of scope exist** → Scope axis (per-user, global).
2. **Who** → Subject Binding axis (subject identity + role resolution).
3. **Can access** → bridging between Subject Binding and Action Vocabulary; the matrix lookup itself is at PMA-Av3.
4. **What** → Action Vocabulary axis (Action enum + PERMISSION_MATRIX).
5. Decision shape forced by structural-mode I/O contract → Decision axis (terminal axis; resolves only after the three preceding axes positional state reaches `resolved`).

MECE verification: every concern in L0 brief maps to exactly one axis. No overlap. Exhaustive over L0 domain ruling.

Relocation from PS v1.1:
- PA-A2 (wearer-scope-rule) → PMA-Sb2 (per-user-scope subject match) at Subject Binding axis.
- PA-A3 (system-scope-rule) → subsumed under PMA-D2 (deny-reason) + PMA-Sb3 (role-resolution null-handling). System-scope access at global tier produces deny-no_role for non-system subjects.
- PA-Cn3 (channel-authority-binding) → generalizes to PMA-Av2 (vocabulary closure). Channel × permitted-authority binding becomes a special case of Action Vocabulary closure at the channel-emitting program tier.

No axiom appears in both PS v1.2 and Permissions Standard v1.0 (cross-check satisfied per Shot 2 brief).

---

**End of file. Permissions Standard v1.0.**
