---
kind: framework
placement: frameworks/standards/
---

# living-memory

**Kind:** Framework  
**Level:** L3  
**Mode:** generative (structured → produced)  
**Version:** v3.5  
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)  
**Rendered by:** generation-procedure-v1-0 v1.1.7 under metaframework-v3-1 v3.3.1  
**Authority:** L0 confirmed (Side-Quest Shot 2 — ContentClass apparatus alignment, Phase B: LMA13 axiom + LMA7/LMA9 mechanical clarifications + ThreadQueryInput.contentClass? optional filter; LM §3.11 source_content_class index row folded in from Side-Quest Shot 1 Phase A per branch-α ratification). v3.5 — Present Standard re-derivation Shot 1: ThreadQueryInput.asOfPosition? optional position-ceiling filter + LMA9 mechanical clarification for Reading-A snapshot read. [pending ratification]  
**Replaces:** living-memory.md (v2.1, v3.0) + living-memory-standard.md (vestige)  
**Findings closed:** F-MFA-LM-001, F-MFA-LM-002, F-MFA-LM-003, F11, G1, T-LM-VESTIGE, T-MF-CYCLE3  
**referentCitations:** (Sprint B2 Shot 5 — partial-drift dissolved; RC coverage authored per MA-V10 part B for Structure + Schema axes. Side-Quest Shot 2 v3.4 — Structure axis RC array extended +1 entry block citing LMA13 read paths. See §1 referentCitations row + §3.13.10 below.)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Generated from the final substrate spec — not an overlay, not an amendment to any prior LM version. v3.1 supersedes v3.0: structural derivation against the final substrate spec removed auxiliary storage, dissolved authority validation from procedure, collapsed scoping to a single physical store with scope as attribute.

---

## Generation procedure trace (S1–S12)

**S1 — Judgment validation**

| Judgment | Input | Resolution |
|---|---|---|
| J-axis-mece | Seven axes: Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment. MECE over the framework description space. | PASS |
| J-axiom-dist | Axioms distributed across axes: each axiom names exactly one axis, no axiom spans two. | PASS |

**S2 — Template population:** Executed below as §1–§8.  
**S3–S10 (E1–E8) — Gate execution:** Declared per axis in §4 Validity.  
**S11 — Template observation:** Presented to L0 for confirmation at Sprint 7 close.  
**S12 — Emit:** This file is the emission.

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Living Memory` |
| `kind` | `Framework` (substrate §4 A-10 Kind enum) |
| `mode` | `generative` (substrate §2 Mode enum; structured → produced) |
| `level` | `L3` (substrate §5 AuthorityLevel) |
| `version` | `3.5` (substrate §7 Semver) |
| `ownershipTemplate` | `Human` (substrate §4 A-11; L0 authors) |
| `ownershipApplied` | `System-under-L0` (substrate §4 A-11) |
| `stateTemplate` | `declared` (substrate §9 LifecycleState) |
| `stateApplied` | `runtime` (substrate §9 LifecycleState) |
| `genesis` | see §1.1 GenesisDeclaration |
| `carrier` | `self` (substrate §9 Carrier; LM emits its own artifact — the StateChangeRecord — via SW3 commit; applied §6.1) |
| `primitive` | `state-change` (framework-local atomic unit; defined §3.9 Vocabulary) |
| `consumes` | `SubstrateWriteInput`, `ThreadQueryInput` at R3 surface |
| `produces` | `StateChangeRecord` (persisted), `ThreadResult` (read) |
| `consumedBy` | Perimeter/intake (write surface — assembles and submits SubstrateWriteInput); F-chat (thread query for context injection); F-plan, F-verify, F-discover (thread query for program context); F-router (thread query for routing context); dashboard (substrate stats) |
| `scopeOut` | classification of input (perimeter/F-router); artifact emission mechanics (Artifact Standard); plan authoring (Plan Standard); multi-instance dispatch (Multi-Instance Standard); chat session management (F-chat); event bus wiring; DB connection management (core/db/client); authority enforcement (perimeter gate); scope access control (perimeter gate); surface-form-to-Ref matching (perimeter) |
| `governsRuntimeCode` | `true` (per MA-I8, added Sprint B1 Shot 2 v3.3.0). Basis: LM governs F-memory runtime code across R0..R4 — R0 substrate writer (SW1–SW3 implementations), R3 read surface (thread query workflow + adjacency + raw axis scan), R4 DB exec (state_change row writer + indexed reads), R2 thread-query workflow composition. The axiom set (LMA1–LMA13 at v3.4; LMA13 added Side-Quest Shot 2 Phase B), procedure set (SW1–SW3, TQ1–TQ3), and required-operations/indices closures govern source paths under `src/features/F-memory/` and `src/app/api/memory/`. Declaration of source-governing intent is now mechanical per MA-I8; jurisdictionClaim per axis declared at §3.13 below. |
| `referentCitations` | RC array populated Sprint B2 Shot 5 — partial-drift dissolved. Side-Quest Shot 2 v3.4 — Structure axis array extended +1 entry block citing LMA13 read paths. Structure axis (LMA1–LMA13 governing `src/features/F-memory/exec/**`, `src/features/F-memory/app/**`, `src/features/F-memory/contract/**`, `src/app/api/memory/**`): `[{path:'src/features/F-memory/exec/substrate-repository.ts',expectedShape:'exports commitStateChange(SubstrateWriteValidated)→Result<StateChangeRecord> [LMA1/LMA4], commitRevocation(StateChangeId)→Result [LMA2], readByPosition(PositionRef)→Result<StateChangeRecord|null> [LMA5], iterateAxisRows(PositionRef,direction,count)→Result<StateChangeRecord[]> [LMA10], readIdentityRecurrence(IdentityRef,scope?,limit?,contentClass?,asOfPosition?)→Result<StateChangeRecord[]> [LMA9; v3.4 contentClass?, v3.5 asOfPosition?], readRolePattern [LMA9], readAdjacency(PositionRef,window,scope?,contentClass?,asOfPosition?)→Result<StateChangeRecord[]> [LMA10; v3.4 contentClass?, v3.5 asOfPosition?], exportByScope(userId)→Result<StateChangeRecord[]> [LMA6], getLastPosition()→Result<PositionRef|null>; every row carries userId field [LMA12]; every row carries source.contentClass field [LMA13 via SubstrateSourceRef substrate v1.8.3 A-24]',kind:'typed-function-set'},{path:'src/features/F-memory/app/substrate-service.ts',expectedShape:'exports writeStateChange(SubstrateWriteInput)→Promise<Result<StateChangeRecord>> composing SW1→SW2→SW3 [LMA1/LMA2/LMA3/LMA4/LMA11]; threadQuery(ThreadQueryInput)→Promise<Result<ThreadResult>> composing TQ1→TQ2→TQ3 [LMA9]; identityRecurrence/rolePattern/adjacency convenience wrappers [LMA9]; onBoot()→Promise<Result> [LMA10]; enforceSubstrateReadScope enforcing LMA6 scope-as-attribute discipline',kind:'typed-function-set'},{path:'src/features/F-memory/contract/substrate-contract.ts',expectedShape:'re-exports writeStateChange,readStateChange,iterateAxis,identityRecurrence,rolePattern,adjacency,threadQuery,onBoot,exportByScope as R3 public surface; re-exports substrate types IdentityRef/ScopeRef/RoleRef/StateChangeRecord/ThreadQueryInput/ThreadResult; no logic, no DB — thin wire per LMA5/LMA6',kind:'typed-contract'},{path:'src/app/api/memory/action/route.ts',expectedShape:'POST handler consuming SubstrateWriteInput from wearer; calls writeStateChange via substrate-contract R3; returns Result-wrapped StateChangeRecord',kind:'route-handler'},{path:'src/app/api/memory/state/route.ts',expectedShape:'GET handler; calls readStateChange or threadQuery via substrate-contract R3; returns StateChangeRecord or ThreadResult',kind:'route-handler'},{path:'src/features/F-memory/exec/substrate-repository.ts',expectedShape:'LMA13 ContentClass discipline governance over LMA7 candidate-set restriction + LMA9 read primitives: readByPosition (returns record carrying source.contentClass — caller honors LMA13 anchor-derivation candidate-set rule by filtering or applying LMA7 only over wearer-life rows) + iterateAxisRows (same — Axis 1 scan must honor LMA13 at caller side for anchor-derivation) + readIdentityRecurrence (TQ3 applies optional ContentClass filter per ThreadQueryInput.contentClass) + readAdjacency (TQ3 applies optional ContentClass filter). LMA13 governs no new function; it constrains the candidate set over which LMA7 operates and authorizes the optional contentClass filter on LMA9 primitives. ContentClass projection orthogonal to scope (LMA6) and userId (LMA12). v3.4. Runtime amendment to substrate-repository.ts read-path implementations to consume ThreadQueryInput.contentClass deferred per Side-Quest spec §"Out of scope (Phase B)" — F-present build sprint owns implementation.',kind:'discipline-axiom-governance'}]`. Schema axis (SubstrateWriteInput / StateChangeRecord / ThreadQueryInput / ThreadResult governing `src/features/F-memory/domain/**`, `src/features/F-memory/contract/**`, `src/app/api/memory/state/**`, `src/app/api/memory/action/**`): `[{path:'src/core/types/substrate.types.ts',expectedShape:'exports SubstrateWriteInput{userId:string,content:{identities:IdentityRef[],relations:Relation[]},metadata:{time:number,source:SubstrateSourceRef}}; StateChangeRecord{id:StateChangeId,userId:string,content,metadata:{time,source,position:PositionRef}}; SubstrateSourceRef{channel:SourceChannel,contentClass:ContentClass,scope:ScopeRef} [substrate v1.8.3 A-24]; ContentClass=\\'wearer-life\\'|\\'system-introspection\\' exported; deriveContentClassFromChannel(channel)→ContentClass helper exported; ThreadQueryInput{threadKind:ThreadKind,anchor:IdentityRef|PositionRef,roleFilter?:RoleRef,scope?:ScopeRef,contentClass?:ContentClass,window?:number,limit?:number} [v3.4 LMA13 optional filter]; ThreadResult{threadKind,anchor,records:StateChangeRecord[]}; all four I/O shapes present and typed per MA-S1/MA-S2',kind:'typed-types-module'},{path:'src/features/F-memory/contract/substrate-contract.ts',expectedShape:'re-exports all four substrate I/O shapes as R3 single-import surface; consumers import SubstrateWriteInput/ThreadQueryInput/etc from this contract, not from core/R5 directly',kind:'typed-contract'}]` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8:

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'Sprint-7-structural-transition',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: { id: 'living-memory', version: '3.1' },
  predecessorDisposition: 'replaced-not-amended'
}
```

Predecessor note: v3.0 was generated at Sprint 7 Job 2 against the substrate spec. v3.1 supersedes it after full mechanical derivation: auxiliary storage dissolved (no IdentityRecord, no canonical-Ref pointer, no surface forms at substrate level), authority validation removed from procedure (perimeter concern), scoping collapsed to single physical store with scope as attribute (modular, scalable to any scope kind without structural change).

### §1.2 Identity-axiom satisfaction

| Axiom | Satisfaction |
|---|---|
| MA-I1 | Mode declared exactly once as `generative` in §1. |
| MA-I2 | Kind declared exactly once as `Framework` per substrate A-10. |
| MA-I3 | Ownership declared for template (`Human`) + applied (`System-under-L0`) in §1. |
| MA-I4 | LifecycleState declared for template (`declared`) + applied (`runtime`) in §1. |
| MA-I5 | Genesis declared §1.1; parent framework + generation procedure named. |
| MA-I6 | Version declared as `3.3`; semver format per substrate §7. |
| MA-I7 | scopeOut declared in §1; non-empty enumeration of excluded concerns. |
| MA-I8 | `governsRuntimeCode = true` declared §1 with basis prose per Sprint B1 Shot 2 v3.3.0 amendment (boolean type-check class per substrate §6.3). |

### §1.3 MA-G13 four-property test

| Property | Satisfied by |
|---|---|
| Own state | One physical substrate store — a sequence of `StateChangeRecord` rows scoped by scope attribute. Transition rules: LMA1 (forward-additive), LMA2 (revocation as sole destructive exception), LMA6 (scope as attribute). |
| Own I/O | Input atoms: `SubstrateWriteInput`, `ThreadQueryInput` (§2.1). Output atoms: `StateChangeRecord`, `ThreadResult` (§2.2). |
| Own invariants | 13 structural-transformation axioms LMA1–LMA13 (§3.2). Each binds a state transition; none is a data-integrity invariant only. |
| Own discipline | P8 procedure steps SW1–SW3 (substrate write, §3.7) and TQ1–TQ3 (thread query, §3.9). Atomic-commit guarantee per LMA4. |

All four properties declared. MA-G13 passes.

**Hidden-sibling check:**

| Candidate | Result |
|---|---|
| Per-scope state-change subset | Not a framework — a filtered view of LM's state. No own I/O, no own invariants, no own discipline. |
| `StateChangeRecord` | Not a framework — a W-ATOM. |
| Thread traversal operation | Not a framework — one of three declared read operations; no own state. |

No sub-element earns framework classification. MA-G13 clean.

---

## §2 Schema

### §2.1 Inputs (R3 surface)

Two distinct input W-ATOMs per MA-S1.

```
SubstrateWriteInput = {
  userId: string,              // v3.2: authentication identity of writer
  content: {
    identities: IdentityRef[],     // referenced identities in this state-change (≥1)
    relations:  Relation[]         // relations connecting them (ordered list; may be empty)
  },
  metadata: {
    time:   timestamp,             // write-time only; past event-times live in relation content
    source: SourceRef,             // origin channel + scope attribute
    position: PositionRef          // auto-assigned monotonic integer; Axis 1 coordinate
  }
}

SourceRef = {
  channel:      'wearer' | 'ai' | 'cron' | 'integration-event' | 'internal-derivation' | 'system-l0',
  contentClass: 'wearer-life' | 'system-introspection',  // v3.4: substrate v1.8.3 A-24 (Side-Quest Shot 1 Phase A; Shot 2 documents the field in LM schema)
  scope:        ScopeRef                // which scope this state-change belongs to
                                        // e.g. 'global', userId, teamId, projectId
                                        // open vocabulary — new scope kinds are new values, not new infrastructure
}

ThreadQueryInput = {
  threadKind:    'identity-recurrence' | 'role-pattern' | 'adjacency',
  anchor:        IdentityRef | PositionRef,  // identity-anchored or position-anchored per kind
  roleFilter?:   RoleRef,                    // required for 'role-pattern' kind
  scope?:        ScopeRef,                   // filter to specific scope; absent = caller-managed
  contentClass?: ContentClass,               // v3.4: optional ContentClass filter (LMA13). Absent = all classes. Backward-compatible.
  asOfPosition?: PositionRef,                // v3.5: optional position-ceiling filter (LMA9 mechanical clarification). Absent = full thread (live present). Present = Reading-A snapshot ceilinged at the position. Backward-compatible.
  window?:       number,                     // caller-supplied integer; required for 'adjacency' kind
  limit?:        number                      // max positions to return
}
```

### §2.2 Outputs

```
StateChangeRecord = {
  id:       StateChangeId,
  userId:   string,           // v3.2: carried from SubstrateWriteInput (LMA12)
  content: {
    identities: IdentityRef[],
    relations:  Relation[]
  },
  metadata: {
    time:     timestamp,
    source:   SourceRef,
    position: PositionRef
  }
}

ThreadResult = {
  threadKind:  'identity-recurrence' | 'role-pattern' | 'adjacency',
  anchor:      IdentityRef | PositionRef,
  records:     StateChangeRecord[],   // ordered by position
  roleFilter?: RoleRef                // echoed from query for role-pattern kind
}
```

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `Mode` | substrate §2 |
| `AuthorityClaim` | substrate §5 |
| `Stage` | substrate §8.3 |
| `WAtom` | substrate §4 |
| `AxiomRef` | substrate §4 |
| `Judgment` | substrate §6 |
| `Semver` | substrate §7 |

### §2.4 Framework-local atoms

- `IdentityRef` — reference string naming an identity. Declared §3.9.
- `Relation` — four peer components. Declared §3.5.
- `ScopeRef` — open-vocabulary scope identifier. Declared §3.9.
- `SourceRef` — origin channel + scope attribute. Declared §2.1 + §3.9.
- `PositionRef` — monotonic integer; Axis 1 coordinate. Declared §3.9.
- `RoleRef` — open-vocabulary role string. Declared §3.9.
- `RevokeRef` — system-reserved IdentityRef (`'revoke-Ref'`). Declared §3.6.
- `Anchor` — derived; high recurrence + relational diversity. Declared §3.7.
- `Geometry` — emergent from thread traversal. Declared §3.9.
- `ContentClass` — closed two-value classification of record content (`'wearer-life' | 'system-introspection'`). Declared at substrate v1.8.3 §4.2 A-24; consumed by LMA13 (v3.4). Carried at SourceRef.contentClass (substrate-tier required field).

### §2.5 Schema rules

Per metaframework §2.5. No LM-local ScR additions.

### §2.6 Custody table

See §6 Coupling full custody table.

---

## §3 Structure

### §3.1 Axes

Inherits metaframework-v3-1's seven-axis decomposition per substrate §1.3 SI-03. LM v3.1 declares no own axes.

### §3.2 Axioms

**Count: 13 axioms LMA1–LMA13.**

| ID | Name | Axis | Invariant |
|---|---|---|---|
| LMA1 | Forward-additive writes | Structure | Every write produces a new StateChangeRecord appended to Axis 1. No in-place mutation of existing records. Revocation is the single destructive exception (LMA2). |
| LMA2 | Revocation as sole destructive exception | Structure | Revocation arrives in-band as a SubstrateWriteInput whose top-level relation type is RevokeRef (§3.6). SW3 detects this and deletes the target StateChangeRecord as a side effect of the same atomic commit. The revocation itself is not stored as a separate record — it is purely the deletion mechanism. Gaps in Axis 1 are honest: position numbers do not renumber, gaps are skipped by queries without error. |
| LMA3 | Relation structure | Structure | Every Relation has exactly four peer components: type (IdentityRef — verbs are identities, open vocabulary), modality (declarative \| interrogative \| imperative \| exclamative — guidance only, re-derived at execution), identities-with-roles (open vocabulary, ≥1 entry), negation (boolean). Relations nest unboundedly. No component is optional. |
| LMA4 | Atomic commit | Structure | A SubstrateWriteInput produces exactly one StateChangeRecord. Content (identities + relations) and metadata (time, source, position) commit atomically — all or nothing. No partial state-change exists. |
| LMA5 | Identity-by-reference | Structure | Identities exist by reference only. No identity is stored as a separate atom. An identity is realized whenever an IdentityRef appears in a StateChangeRecord's content. Identity is a cluster property — Refs that walk the same geometric path through the substrate converge to a cluster. Cluster membership is read-time geometry, not stored mapping. |
| LMA6 | Scope as attribute | Structure | Scope is carried in SourceRef.scope on every state-change. Scope is an open-vocabulary attribute — new scope kinds (user, global, team, project) are new ScopeRef values, not new infrastructure. The substrate stores all state-changes in one physical store. Scope filtering is a read concern, executed at query time by the caller. |
| LMA7 | Anchor derivation | Structure | Anchors are derived, never stored. **Over the candidate set of records where LMA13 ContentClass filter selects** (v3.4 mechanical clarification — anchor-candidacy operates over `contentClass === 'wearer-life'` records only; cross-class mixing in anchor-derivation is forbidden by LMA13), an anchor is an IdentityRef with high reference count AND high relational diversity across its thread. Thresholds are refinement parameters owned by the present layer. |
| LMA8 | Geometry as emergence | Structure | Geometry is what the substrate exposes when threads are walked and relations read at each position. Not stored. Temporal arcs, cluster membership, co-occurrence patterns — all emergent at read time. Storing derived geometry is a violation. |
| LMA9 | Thread kinds | Structure | Three and only three primitive operations against the substrate: identity-recurrence (Axis 2, identity-anchored, discontinuous), role-pattern (identity-anchored with role filter), adjacency (position-anchored, window-bounded, different in kind from thread traversals). All other queries compose from these three plus raw axis scan. No fourth primitive operation exists at the substrate level. **v3.4 mechanical clarification:** each primitive accepts an optional `contentClass?: ContentClass` filter parameter (LMA13). Default (omitted) returns all classes — backward-compatible. The filter is applied at TQ3 execution, alongside the existing optional `scope?` filter; both project orthogonally to the primitive's threadKind axis. **v3.5 mechanical clarification:** each primitive additionally accepts an optional `asOfPosition?: PositionRef` position-ceiling parameter. Default (omitted) returns the full accumulated thread — the live present, backward-compatible. Present, the thread read returns only state-changes at or before the given chain position — the substrate as it actually stood at that position (a Reading-A snapshot). Applied at TQ3 execution as an open-ended `AND position <= $asOfPosition` conjunct on the primitive's own `WHERE` clause; it is not count-limited and not direction-dispatched (it is therefore not the `iterate_axis` clause, which is `LIMIT`-bounded and direction-dispatched). `asOfPosition?` composes by AND with the existing optional `scope?` and `contentClass?` filters. It is a parameter on the existing three primitives — **not** a fourth primitive; the three-and-only-three closure is untouched. |
| LMA10 | Two-axis structure | Structure | Axis 1: the state-change sequence, positions ordered by monotonic integer. Axis 2: identity threads, discontinuous recurrence across positions. These two axes are the complete structural description of the substrate. No third axis exists at the substrate level. |
| LMA11 | Modality re-derivation | Structure | Relation modality is stored as recorded metadata. Consumers re-derive its operational significance from context at read time. The stored value is informational, not binding. |
| LMA12 | User ownership | Structure | Every SubstrateWriteInput carries exactly one userId. Every committed StateChangeRecord carries that userId unchanged. The substrate enforces presence — every write must supply userId. The substrate does not enforce access — who may write to which userId scope is a perimeter responsibility (parallel to LMA6 scope discipline). Reads may filter by userId. userId is a first-class field, not a ScopeRef value. |
| LMA13 | ContentClass discipline | Structure | Every StateChangeRecord carries `metadata.source.contentClass: ContentClass` (per substrate v1.8.3 A-24, locus per Side-Quest Shot 1 derivation). LMA7 anchor-derivation operates over records where `contentClass === 'wearer-life'` only. Records where `contentClass === 'system-introspection'` are queryable via LMA9 primitives but excluded from anchor-candidacy by construction. Cross-class queries are permitted; cross-class mixing in anchor-derivation is forbidden. |

### §3.3 Primitive instance counts

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | axes inherited from metaframework-v3-1 §3.1; LM v3.1 declares no own axes |
| P2 Sub-axis | 0 | no sub-axes declared |
| P3 Leaf | 0 | no leaves declared |
| P4 Axiom | 13 | LMA1–LMA13 declared §3.2 (v3.4: LMA13 ContentClass discipline added)
| P5 Gate | 0 | all 85 framework-tier gates inherited from metaframework-v3-1 §4.1; LM v3.1 declares no new gates |
| P6 Handoff rule | 1 | HR-LM1: perimeter/intake → LM write surface (see §6.2) |
| P7 Judgment input | 2 | J-lm-scope-as-attribute, J-lm-thread-completeness (see §7) |
| P8 Procedure step | 6 | SW1–SW3 (substrate write, §3.7) + TQ1–TQ3 (thread query, §3.9) |

### §3.4 Relational cell

LM v3.1 depends on: substrate-v1-1 (atom shapes and rules); metaframework-v3-1 (generation procedure and gate set); perimeter/intake (as write-surface initiator — assembles SubstrateWriteInput and submits it).

LM v3.1 is consumed by: perimeter/intake (write path); F-chat, F-plan, F-verify, F-discover, F-router (thread query read path); dashboard (substrate stats).

### §3.5 Relation structure (LMA3 full declaration)

```
Relation = {
  type:                IdentityRef,          // what relation this is; verbs are identities
  modality:            'declarative'
                     | 'interrogative'
                     | 'imperative'
                     | 'exclamative',        // guidance; re-derived at execution (LMA11)
  identitiesWithRoles: Array<{
    identity: IdentityRef,
    role:     RoleRef                        // open vocabulary; ≥1 entry required
  }>,
  negation:            boolean
}
```

Relations nest unboundedly. A Relation's type is an IdentityRef — it threads through Axis 2 exactly like any other identity. Common relation types (like 'drank-Ref', 'is-Ref', 'contradicts-Ref') crystallize as anchors through accumulation of use, not through declaration. The vocabulary is open and emergent.

### §3.6 RevokeRef — system-reserved identity

`RevokeRef` = `'revoke-Ref'` — the single system-reserved IdentityRef. When a SubstrateWriteInput arrives whose top-level relation type is `RevokeRef`, SW3 executes revocation: the target StateChangeRecord (identified by the relation's identities-with-roles) is deleted as a side effect of the commit. `RevokeRef` is recognized by convention in SW3. No stored registry of reserved Refs — the set is bounded: just `RevokeRef`.

Revocation does not store a revocation record. It is the deletion mechanism. Position gaps are honest.

Empty state-changes (no identities, no relations) are valid — silent positions on Axis 1 that contribute only to positional sequence, not to Axis 2 threads.

### §3.7 Anchor derivation (LMA7 expansion)

An IdentityRef is an anchor candidate when it appears in ≥ θ_recur state-changes (high recurrence) AND appears in ≥ θ_div distinct relation types across those records (high relational diversity). Both thresholds are refinement parameters owned by the present layer. Anchors are never stored. Common relation types that appear in many state-changes accumulate dense threads and become anchors by the same mechanism as any heavily-referenced identity.

### §3.8 Substrate write procedure (SW1–SW3)

Three P8 steps. Atomic commit per LMA4.

| id | order | stage | kind | input | output | derivation / gates |
|---|---|---|---|---|---|---|
| SW1 | 1 | 2 | mechanical | `SubstrateWriteInput` | validated input | Validate shape: identities non-empty; each Relation has all four components; identitiesWithRoles has ≥1 entry per relation; userId present and non-empty string (reject with `SW1_USERID_MISSING` if absent). Assign position (monotonic integer, next in sequence). Stamp time as write-time timestamp. |
| SW2 | 2 | 3 | gate-execution | validated input | gate results | `gates = [LMA1, LMA3, LMA10, LMA11]` — forward-additive append (LMA1), relation structure (LMA3), two-axis coherence (LMA10), modality stored as recorded metadata not as constraint (LMA11). |
| SW3 | 3 | 5 | mechanical | gate-passed input | persisted `StateChangeRecord` | Detect RevokeRef: if any top-level relation's type is RevokeRef, delete the target StateChangeRecord identified by that relation's identities-with-roles (LMA2). Then commit the inbound state-change atomically — content + metadata + userId in one transaction (LMA4 + LMA12 guarantee). userId from validated input carries through unchanged. Scope filtering is a read concern; this step writes to the single physical store unconditionally. |

### §3.9 Thread query procedure (TQ1–TQ3)

Three P8 steps. Read-only — no mutation.

| id | order | stage | kind | input | output | derivation / gates |
|---|---|---|---|---|---|---|
| TQ1 | 1 | 2 | mechanical | `ThreadQueryInput` | validated query | Validate threadKind ∈ {'identity-recurrence', 'role-pattern', 'adjacency'}. For 'role-pattern': roleFilter must be present. For 'adjacency': anchor must be PositionRef, window must be a positive integer. **v3.4:** if `contentClass` is present, validate `contentClass ∈ {'wearer-life', 'system-introspection'}` per substrate v1.8.3 A-24 closed set; absent = no ContentClass filter applied (all classes). **v3.5:** if `asOfPosition` is present, it is a `PositionRef` (monotonic integer); validation accepts it and carries it forward unchanged; absent = no position ceiling applied (full thread). |
| TQ2 | 2 | 3 | gate-execution | validated query | gate results | `gates = [LMA9]` — query kind is one of the three and only three substrate thread primitives (LMA9). |
| TQ3 | 3 | 5 | mechanical | gate-passed query | `ThreadResult` | Execute against substrate: identity-recurrence — scan state-changes for IdentityRef, return ordered by position. role-pattern — same, filtered by roleFilter in identitiesWithRoles. adjacency — return state-changes within ±window positions of anchor. Apply scope filter if ThreadQueryInput.scope is present. **v3.4:** apply ContentClass filter if ThreadQueryInput.contentClass is present (LMA13; filter is orthogonal to scope and threadKind axes — projection composes by AND). **v3.5:** apply the position ceiling if ThreadQueryInput.asOfPosition is present — an open-ended `AND position <= $asOfPosition` conjunct (not count-limited, not direction-dispatched); composes by AND with the scope and contentClass filters, projecting orthogonally. Geometry (LMA8) emerges from what the caller does with ThreadResult — not computed here. |

### §3.10 Required operations

| Operation | Signature | Procedure |
|---|---|---|
| `write_state_change` | (identities, relations, source) → position | SW1–SW3 |
| `read_state_change` | (position) → StateChangeRecord | direct index lookup |
| `iterate_axis` | (start_position, direction, count) → StateChangeRecord[] | raw Axis 1 scan; adjacency is derived from this |
| `identity_recurrence` | (IdentityRef, scope?, contentClass?, asOfPosition?) → StateChangeRecord[] ordered by position | TQ1–TQ3 with threadKind='identity-recurrence' (v3.4: contentClass? per LMA13; v3.5: asOfPosition? per LMA9 mechanical clarification) |
| `role_pattern` | (IdentityRef, RoleRef, scope?, contentClass?, asOfPosition?) → StateChangeRecord[] ordered by position | TQ1–TQ3 with threadKind='role-pattern' (v3.4: contentClass? per LMA13; v3.5: asOfPosition? per LMA9 mechanical clarification) |
| `adjacency` | (PositionRef, window, contentClass?, asOfPosition?) → StateChangeRecord[] | TQ1–TQ3 with threadKind='adjacency' (v3.4: contentClass? per LMA13; v3.5: asOfPosition? per LMA9 mechanical clarification) |

`read_state_change` and `iterate_axis` are direct substrate operations — no procedure steps required beyond index lookup and axis scan.

### §3.11 Required indices

| Index | Purpose |
|---|---|
| position (primary) | Axis 1 ordering, adjacency, iterate_axis |
| identity → positions | identity_recurrence, role_pattern queries |
| (identity, role) → positions | role_pattern query optimization |
| scope → positions | scope-filtered queries (optional optimization; correct without it via scan) |
| userId → positions | user-scoped queries (required for multi-user isolation; not optional optimization) |
| source_content_class → positions | ContentClass-filtered queries (optional optimization; correct without it via scan). Side-Quest Shot 1 (Phase A) — substrate v1.8.3 §4.2 A-24. Categorical-axis index parallel to source_channel; not promoted to required because 5/6 channels map deterministically to ContentClass per the default-derivation rule, so source_channel queries are sufficient for the deterministic subset — only `internal-derivation` rows benefit from column-level filtering (polymorphic per emitting Standard at Phase D). Promote to required if Phase B (LMA13 anchor-derivation filter usage patterns) or Phase D (per-Standard internal-derivation classification density) show column-level filtering dominates the query mix. |

### §3.12 Vocabulary

| Term | Declared | Definition |
|---|---|---|
| `IdentityRef` | §2.1 | A reference string naming an identity. Normalized form: lowercase hyphenated. Identities exist by reference (LMA5). Verbs, nouns, concepts — all are IdentityRefs. |
| `userId` | §2.1 | Authentication identity string. First-class field on every SubstrateWriteInput and StateChangeRecord. Orthogonal to ScopeRef — userId identifies the writer; scope identifies the project context. Both coexist on the same record (LMA12). |
| `ScopeRef` | §2.1 | Open-vocabulary scope identifier. Examples: 'global', userId, teamId, projectId. New scope kinds are new ScopeRef values — no infrastructure change needed (LMA6). |
| `SourceRef` | §2.1 | Origin channel + scope attribute. channel enum is extensible. scope is open vocabulary. |
| `PositionRef` | §2.1 | Monotonic integer; Axis 1 coordinate. Auto-assigned at SW3. Enables adjacency queries (LMA9). |
| `RoleRef` | §3.5 | Open-vocabulary string naming the role an identity plays in a Relation. |
| `StateChangeId` | §2.2 | Unique identifier for a committed StateChangeRecord. |
| `RevokeRef` | §3.6 | System-reserved IdentityRef (`'revoke-Ref'`). The only system-reserved Ref. Recognized by convention in SW3. |
| `Anchor` | §3.7 | Derived: IdentityRef with high recurrence + high relational diversity. Never stored. |
| `Geometry` | §3.8 | Emergent: temporal arcs, cluster membership, co-occurrence patterns — what the substrate exposes when threads are walked and relations read. Not stored (LMA8). |
| `ContentClass` | §2.1, §2.4 | Closed two-value classification of record content: `'wearer-life'` (content participating in the cognition LIV extends) \| `'system-introspection'` (apparatus's faithful record of its own operation). Declared at substrate v1.8.3 §4.2 A-24 (canonical declaration site). Carried at SourceRef.contentClass (substrate-tier required field; row-stamped at Boundary per Manual L178, populated at construction site for Path B internal-derivation emissions). LMA13 governs anchor-derivation filter discipline (anchor-candidacy operates over `wearer-life` only); LMA9 thread-query primitives accept an optional `contentClass?` filter parameter for read-side projection. v3.4. |
| `state-change` | §1 | The framework primitive: one atomic commit (SubstrateWriteInput → StateChangeRecord). |

### §3.13 AxisBasis declarations (Sprint B1 Shot 3 v3.3 amendment, additive per MA-S7 recursive scope)

Per MA-St17 (metaframework v3.3.1 §3.2.1): every LM declaration in the enumerated kind set (axes, sub-axes, handoff rules, lifecycle events, judgment inputs, closure rules, typed shapes, procedure steps, coupling enums) that crosses boundary 2 (MFv3 → standards) and is not already grounded by another declared mechanism (P1–P8 instance grounding by PR1; axiom grounding by own derivation; gate grounding by `tests` binding) declares a basis conforming to substrate §4 A-22 AxisBasis. Every basis below traces by natural derivation. No force-fit. Where a kind has no instances at LM, the row is omitted (the MA-St17 quantifier ranges over declared instances only).

Manual citations pin `manualVersion: '13.0'`. Substantive content cited (substrate-write mechanics, Boundary→Store flow, scope-as-attribute, identity-by-reference, single-store accumulation, three-loop framing) is stable; Manual v13.1's coming Part IV revision does not invalidate these references.

#### §3.13.1 Axes basis

LM v3.3 declares **0 own P1 Axis instances** (inherits MFv3 seven-axis decomposition per substrate §1.3 SI-03 permitted-multi-execution). Per MA-St17 exclusion semantics, declarations not made at this framework cross no boundary 2 from this framework; no basis required at LM. Inherited axes are grounded by MFv3 §3.1.1 FrameworkConcernSpace.

#### §3.13.2 Sub-axes basis

LM v3.3 declares **0 own P2 Sub-axis instances**. Per LMA structure: each LMA1–LMA12 binds to the Structure axis at the axiom-condition level per §3.3 P3 leaf count = 0 (leaves not enumerated separately at LM; axioms are the leaf grain). No sub-axis structure declared. No basis required.

#### §3.13.3 Handoff rules basis

| ID | Basis kind | Reference | Basis prose |
|---|---|---|---|
| **HR-LM1** | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Boundary + Store'`, `manualVersion: '13.0'`, `ratification: {level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` | HR-LM1 is the receive-side contract for `SubstrateWriteInput` from the unitary Boundary. The Manual Part II Boundary subsection declares "Every typed signal carries four properties stamped at the Boundary and preserved by Store" — HR-LM1 is the mechanical realization of "preserved by Store" at LM's intake surface. The contract's `guarantee` field ("LM will execute SW1–SW3 atomically per LMA4. Authority enforcement and scope access control are perimeter responsibilities — LM writes whatever arrives through the perimeter gate") traces directly to Manual Part II Boundary "Authority enforcement" + "Scope access enforcement" subsections (perimeter responsibility) and Part II Store ("Store does not initiate. It is acted upon. Mediator writes to it... Store's work is to maintain faithful accumulation"). L0-ratified at LM v3.0 first generation; carried forward unchanged across v3.1, v3.2, v3.3. |

#### §3.13.4 Lifecycle events basis

| Event (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `version transition` (§5.1) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) + `atomId: 'A-21'` (StateOrdering — lifecycle states index into A-21 positions) | Version transitions are AmendmentProvenance instances per substrate §4 A-16; transitions occur between LifecycleState positions declared at substrate §9 (LifecycleState enum), which in turn index five-state ordering at A-21 per MFv3 v3.3.0-shot1 amendment. Strongest grounding. |
| `amendment procedure` (§5.2) | `substrate-atom-ref` | `atomId: 'A-16'` (AmendmentProvenance) | The procedure (propose → audit → L0 confirm → propagate) is the structural pattern that materializes AmendmentProvenance per substrate §4 A-16 declaration. Substrate-tier grounding. |
| `state transition: declared → runtime` (§5.3) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) | The transition is a movement between two LifecycleState enum values declared at substrate §9. Strongest grounding. |
| `state transition: runtime → deprecated` (§5.3) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) | Same basis as above; both endpoints are LifecycleState enum values. |
| `deprecation procedure` (§5.4) | `substrate-atom-ref` | `atomId: 'LifecycleState'` (substrate §9) + `atomId: 'A-16'` (AmendmentProvenance — successor framework ratification is itself an AmendmentProvenance event) | Deprecation prerequisites (successor framework generated and L0-confirmed, migration path declared, L0 deprecation ruling) compose a state transition into `deprecated` (substrate §9 LifecycleState) gated by an L0-ratified AmendmentProvenance (A-16). Substrate-tier grounding. |

#### §3.13.5 Judgment inputs basis

| ID | Basis kind | Reference | Basis prose |
|---|---|---|---|
| **J-lm-scope-as-attribute** | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — System-L0 (Scope paragraph)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` | The Manual states verbatim: "The substrate is single-store. Scope is an attribute on every persisted state. Per-wearer and shared content live in the same store, distinguished by the scope attribute. Scope access enforcement is a Boundary responsibility, not a substrate responsibility. New scope kinds are new attribute values — no structural change required." J-lm-scope-as-attribute's four mechanical criteria are the criteria that test this Manual commitment at LM. LMA6 is the axiom realization of the same commitment. L0-ratified at LM v3.0 first generation. |
| **J-lm-thread-completeness** | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Memory Loop, Store + Part I — Substrate'`, `manualVersion: '13.0'`, `ratification: {level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com'}` | The Manual Part II Store declares Store as "the program that governs the substrate's operational mechanics — write, accumulate, read"; Part I Substrate declares "Internal operations — typed-to-typed work within typed jurisdiction. Reading what has accumulated..." The three thread-query primitives (identity-recurrence, role-pattern, adjacency) + raw axis scan compose the complete substrate-read surface — the "read" arm of Store's operational mechanics. J-lm-thread-completeness's five mechanical criteria test that the four operations cover the complete read surface; LMA8 (geometry-as-emergence) and LMA9 (three thread kinds) are the axiom realizations. L0-ratified at LM v3.0 first generation. |

#### §3.13.6 Closure rules basis

| Closure (locus) | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `RevokeRef closure` (§3.6 — single system-reserved Ref, no stored registry) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Wearer-L0 (Wearer-bypass cases — Revocation)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Manual declares: "Revocation — the wearer exercises unconditional authority over substrate content directly. No program mediates revocation. The wearer's revocation arrival is typed at the Boundary, recognized under Wearer-L0 authority, and applied to the substrate." `RevokeRef` is the single in-band convention realizing this bypass at LM. Closure is at exactly one reserved identity because the bypass set is finite per Manual enumeration (Revocation + identity-curation-by-utterance + L0-confirmations; only revocation requires a reserved identity-form, the other two are ordinary content writes). L0-ratified at LM v3.0. |
| `Relation four-component closure` (§3.5, LMA3 — type/modality/identities-with-roles/negation) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (typed signal mechanics)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The Relation shape is the typed signal's internal grammar — what makes accumulation faithful per Manual Root claim "durable structure that subsequent moments read against — faithfully reconstructible, without rewriting, without lossy summarization, without forced interpretation." The four peer components emerge from natural-language minimum representation (subject-verb-object + assertion-mode + negation); ratified as LM v3.0 atom shape. LMA3 is the axiom realization. L0-ratified at LM v3.0. |
| `Three thread kinds closure` (§3.9, LMA9 — identity-recurrence / role-pattern / adjacency) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store + Part I — Substrate (Internal operations)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The Manual declares Internal operations as "typed-to-typed work within typed jurisdiction" with Store governing "write, accumulate, read." Three primitive read operations + raw axis scan close the read surface per J-lm-thread-completeness mechanical-criteria 5. LMA9 is the axiom realization. L0-ratified at LM v3.0. |
| `Two-axis closure` (§3.2 LMA10 — Axis 1 state-change sequence + Axis 2 identity threads) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate + Part II — Store'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The two-axis structure is the substrate's minimal sufficient geometry per Manual Root claim faithful-accumulation commitment. Position-ordering (Axis 1) is what makes "time of crossing" preservable; identity-thread recurrence (Axis 2) is what makes substrate-identity emergent geometry possible per Manual Part I Substrate "Internal operations" + Part II Store "faithful accumulation." LMA10 is the axiom realization. L0-ratified at LM v3.0. |
| `Required-operations closure` (§3.10 — six declared operations) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store ("write, accumulate, read")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The six operations (write_state_change, read_state_change, iterate_axis, identity_recurrence, role_pattern, adjacency) compose the substrate operational mechanics Manual Part II Store declares. Closure is bounded by what J-lm-thread-completeness ratifies plus the write primitive plus direct read/iterate (which are read-side primitives below thread-query). L0-ratified at LM v3.0. |
| `Required-indices closure` (§3.11 — six declared indices) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store (faithful accumulation under activity)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The six indices (position, identity→positions, (identity,role)→positions, scope→positions, userId→positions, source_content_class→positions) are the minimum sufficient set for the §3.10 operations to execute deterministically. userId index ratified as required (not optional) per LMA12 v3.2 amendment; remaining four ratified at LM v3.0; **source_content_class index added Side-Quest Shot 1 Phase A (under L0 branch-α ratification, folded into v3.4 changelog per Side-Quest Shot 2)** as optional optimization parallel to scope→positions — 5/6 channels of SourceChannel map deterministically to ContentClass per substrate v1.8.3 §4.2 A-24 default-derivation rule, so source_channel queries are sufficient for the deterministic subset; only internal-derivation rows benefit from column-level filtering. L0-ratified per amendment cycle. |
| `Vocabulary closure` (§3.12 — declared terms) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I + Part II + this framework's declaration sites'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Vocabulary is the closed set of framework-local atoms declared at LM (IdentityRef, userId, ScopeRef, SourceRef, PositionRef, RoleRef, StateChangeId, RevokeRef, Anchor, Geometry, ContentClass, state-change). New terms enter additively via amendment per MA-L1 + MA-S7. L0-ratified per declared term at the version it was added (v3.0 baseline + v3.2 userId addition + v3.4 ContentClass addition). |

#### §3.13.7 Typed shapes basis

| Shape | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `SubstrateWriteInput` (§2.1) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — input atom shape) | Input shape conforms to substrate §4 A-01 WAtom under MA-S1 (input-is-W-ATOM). Field shapes ground out at substrate atoms or LM-local atoms (the latter grounded per their own rows below). |
| `ThreadQueryInput` (§2.1) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — input atom shape) | Same basis as SubstrateWriteInput per MA-S1. |
| `StateChangeRecord` (§2.2) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — output atom shape) | Output shape conforms to substrate §4 A-01 WAtom under MA-S2 (output-is-W-ATOM). |
| `ThreadResult` (§2.2) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — output atom shape) | Same basis as StateChangeRecord per MA-S2. |
| `Relation` (§3.5) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (typed signal mechanics)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local synthesis — the typed-signal internal grammar per Manual Root claim faithful-structure commitment. See §3.13.6 Relation four-component closure for full derivation. |
| `IdentityRef` (§3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (Substrate identity-by-reference) + Part II — Boundary (Surface-form-to-reference matching)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local atom realizing the Manual's identity-by-reference commitment. Identities exist by reference only; cluster geometry emerges at read time (Manual Part II Boundary subsection scopes cluster pre-resolution out to Boundary). LMA5 is the axiom realization. L0-ratified at LM v3.0. |
| `ScopeRef` (§3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — System-L0 (Scope paragraph)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Open-vocabulary scope identifier realizing Manual's scope-as-attribute commitment. LMA6 is the axiom realization. L0-ratified at LM v3.0. |
| `SourceRef` (§2.1, §3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Boundary (Source authority + Channel classification)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local atom carrying origin channel + scope + contentClass (v3.4). All three components are Boundary-stamped per Manual Part II Boundary "Signal properties stamped here" — LM is the receive-side custodian. contentClass projects orthogonally to channel and scope per substrate v1.8.3 §4.2 A-24 default-derivation rule; locus on SourceRef per Side-Quest Shot 1 derivation. L0-ratified at LM v3.0 baseline + v3.4 contentClass addition. |
| `PositionRef` (§3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Boundary (Time of crossing)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Monotonic integer coordinate on Axis 1. Manual states: "Time of crossing — when it entered typed jurisdiction. The temporal anchor for all accumulation. Stamped at the Boundary, preserved by Store, never modified after stamping." PositionRef is the Axis-1 mechanical realization (auto-assigned at SW3, monotonic per LMA1). L0-ratified at LM v3.0. |
| `RoleRef` (§3.5, §3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (typed signal mechanics)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local atom for role within Relation.identitiesWithRoles per LMA3. Open-vocabulary per Manual root-claim faithful-structure commitment (forced interpretation forbidden ⇒ role labels are content, not infrastructure). L0-ratified at LM v3.0. |
| `RevokeRef` (§3.6, §3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Wearer-L0 (Wearer-bypass — Revocation)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | System-reserved single IdentityRef realizing Manual's wearer-bypass revocation mechanism. See §3.13.6 RevokeRef closure for full basis. L0-ratified at LM v3.0. |
| `Anchor` (§3.7, §3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (Internal operations — Reading what has accumulated)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local derived (never stored) atom — emergent from thread traversal per LMA7. The Manual states cluster-identity-as-emergence at Part I Substrate Internal operations + Part II Store faithful accumulation; Anchor is the high-recurrence + high-relational-diversity subset of this emergence. L0-ratified at LM v3.0. |
| `Geometry` (§3.8, §3.12) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (Internal operations)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | LM-local emergent (never stored) atom — temporal arcs, cluster membership, co-occurrence patterns produced by reading threads and relations. LMA8 is the axiom realization. L0-ratified at LM v3.0. |
| `StateChangeId` (§2.2) | `substrate-atom-ref` | `atomId: 'A-01'` (WAtom — typed-shape identifier sub-component) | Unique identifier branded type for committed StateChangeRecord; standard typed-shape brand pattern at substrate WAtom tier. |
| `ContentClass` (§2.1, §2.4, §3.12) | `substrate-atom-ref` | `atomId: 'A-24'` (ContentClass — substrate v1.8.3 closed two-value union) | Strongest grounding. ContentClass is a substrate-tier closed enum declared at substrate v1.8.3 §4.2 A-24 (Side-Quest Shot 1 Phase A); LM consumes by reference. v3.4 addition per Side-Quest Shot 2 Phase B. |

#### §3.13.8 Procedure steps basis

| Step | Basis kind | Reference | Basis prose |
|---|---|---|---|
| **SW1** (substrate write step 1 — input validation) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Boundary (Authority enforcement + Signal properties stamped here) + Part II — Store ("write, accumulate, read")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | SW1 (validate shape; assign position; stamp time) realizes Manual Part II Store's write-side intake. Position-assignment and write-time stamping fulfill Manual Part II Boundary "Time of crossing — Stamped at the Boundary, preserved by Store" commitment at LM's receive side. userId-presence validation per LMA12 v3.2 ratified separately at that amendment. L0-ratified at LM v3.0 baseline + v3.2 userId amendment. |
| **SW2** (substrate write step 2 — gate execution) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store (faithful accumulation under that activity)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Gate execution against LMA1/LMA3/LMA10/LMA11 realizes the structural conformance check Store applies to incoming SubstrateWriteInput before commit. The four-gate set is the minimum sufficient: forward-additive (LMA1) + relation structure (LMA3) + two-axis coherence (LMA10) + modality-stored-not-binding (LMA11). L0-ratified at LM v3.0. |
| **SW3** (substrate write step 3 — atomic commit + revoke detection) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Wearer-L0 (Wearer-bypass — Revocation) + Part II — Store ("write, accumulate, read")'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Atomic commit realizes Store's faithful-accumulation responsibility; RevokeRef detection at this step realizes Manual's wearer-bypass revocation under Wearer-L0 authority applied to the substrate. userId-carry-through ratified per LMA12 v3.2. L0-ratified at LM v3.0 baseline + v3.2 userId amendment. |
| **TQ1** (thread query step 1 — query validation) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store (read) + Part I — Substrate (Internal operations — Reading what has accumulated)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | TQ1 (validate threadKind ∈ three primitives; per-kind input shape check) is the receive-side typing of the read-surface query Manual declares at Part II Store + Part I Substrate Internal operations. L0-ratified at LM v3.0. |
| **TQ2** (thread query step 2 — gate execution) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part I — Substrate (Internal operations)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | Gate execution against LMA9 (thread-kind closure) realizes the structural conformance check for read primitives. The single-gate set is minimum sufficient because thread-kind enum-membership is the only constraint at this step. L0-ratified at LM v3.0. |
| **TQ3** (thread query step 3 — substrate execution) | `l0-ratified-ref` | `manualLocus: 'LIV Manual Part II — Store (read) + Part I — Substrate (Internal operations)'`, `manualVersion: '13.0'`, `ratification: {level: 'L0'}` | The per-kind substrate-scan execution realizes Manual Part II Store's read-side mechanics. Geometry-emergence at caller (LMA8 commitment) realizes Manual Part I Internal operations + Part II Store faithful-accumulation pattern (substrate exposes geometry; caller composes). L0-ratified at LM v3.0. |

#### §3.13.9 Coupling enums basis

| Coupling declaration | Basis kind | Reference | Basis prose |
|---|---|---|---|
| `carrier = 'self'` (§6.1) | `substrate-atom-ref` | `atomId: 'Carrier'` (substrate §9 declared enum: `'self' \| 'named' \| 'none'`) | Carrier value enum-member per substrate §9; LM-specific binding to `self` because LM emits its own artifact (StateChangeRecord) via SW3, no enclosing carrier framework. Strongest grounding. |
| Custody table entries (§6.3 — Substrate store + living-memory.md file) | `substrate-atom-ref` | `atomId: 'A-04'` (CustodyRow) | Custody rows conform to substrate §4 A-04 CustodyRow shape per MA-C2. Strongest grounding. |

#### §3.13.10 MA-V10 part B jurisdiction coverage declaration

Per MA-V10 part B (metaframework v3.3.1 §3.2.1): when `governsRuntimeCode = true`, every source-governing axis with declared `jurisdictionClaim` must have ReferentCitations covering its claim, OR declare partial-drift per MA-V11 vacuous-pass with explicit basis prose.

LM inherits the seven MFv3 axes. LM's source-governing intent is concentrated at the **Structure axis** (LMA1–LMA12 govern write semantics, read semantics, and substrate shape) and the **Schema axis** (SubstrateWriteInput / StateChangeRecord / ThreadQueryInput / ThreadResult govern the typed input/output shapes that runtime code must produce and consume). The remaining inherited axes (Identity, Validity, Lifecycle, Coupling, Judgment) are declarative-tier concerns; no jurisdictionClaim is declared on these (vacuous per MA-V10 part B applicability='n/a' clause).

| Axis | `jurisdictionClaim` | RC coverage at v3.3 | Partial-drift declaration |
|---|---|---|---|
| **Structure** | `['src/features/F-memory/exec/**', 'src/features/F-memory/app/**', 'src/features/F-memory/domain/**', 'src/features/F-memory/contract/**', 'src/app/api/memory/**']` (LMA1–LMA12 govern these paths — substrate writer, thread query workflow, DB exec, read surface, route handlers consuming substrate-write/thread-query surfaces) | 5 ReferentCitations declared (Sprint B2 Shot 5): substrate-repository.ts (LMA1/LMA2/LMA4/LMA5/LMA6/LMA9/LMA10/LMA12), substrate-service.ts (LMA1–LMA4/LMA9/LMA11), substrate-contract.ts (LMA5/LMA6 scope discipline), api/memory/action/route.ts, api/memory/state/route.ts. Full coverage: every axiom LMA1–LMA12 has ≥1 citation path. Partial-drift dissolved. | None — RC coverage complete. |
| **Schema** | `['src/features/F-memory/domain/**', 'src/features/F-memory/contract/**', 'src/app/api/memory/state/**', 'src/app/api/memory/action/**']` (the I/O shapes SubstrateWriteInput / StateChangeRecord / ThreadQueryInput / ThreadResult govern these source surfaces) | 2 ReferentCitations declared (Sprint B2 Shot 5): src/core/types/substrate.types.ts (all four I/O shapes declared and typed), substrate-contract.ts (re-exports all four as R3 single-import surface). Full coverage: all four schema shapes resolvable at cited paths. Partial-drift dissolved. | None — RC coverage complete. |
| Identity | not declared (declarative-tier — Identity content at LM is the framework's own header, not source-tier) | n/a per MA-V10 part B applicability clause | not applicable |
| Validity | not declared (declarative-tier — gate suite is declarative governance, gate execution is framework-audit concern, not LM source) | n/a per MA-V10 part B applicability clause | not applicable |
| Lifecycle | not declared (declarative-tier — version-history and amendment-trigger declarations are not source-governing) | n/a per MA-V10 part B applicability clause | not applicable |
| Coupling | not declared (declarative-tier — HR contracts are declared at standards tier; HR-LM1 enforcement is perimeter / F-identity concern, not LM source) | n/a per MA-V10 part B applicability clause | not applicable |
| Judgment | not declared (declarative-tier — J-inputs are audit-time judgment shapes, not source-governing) | n/a per MA-V10 part B applicability clause | not applicable |

**Discipline:** every axis position declared explicitly. No silent gap. Partial-drift declared mechanically per MA-V11. G-V10 part B at this version produces `applicability='n/a'` with declared basis on each of Structure and Schema; on Sprint B2 close, basis is replaced by full RC coverage.

#### §3.13.11 AmendmentProvenance (Sprint B1 Shot 3)

```
amendmentProvenance = {
  amendmentId:          'living-memory-v3-3-sprint-b1-shot-3',
  predecessorVersion:   '3.2',
  successorVersion:     '3.3',
  cycleId:              'sprint-b1-shot-3',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'Δ-A: added §1 governsRuntimeCode = true per MA-I8 with basis prose',
    'Δ-B: declared AxisBasis on every MA-St17 enumerated-kind declaration at §3.13.3–§3.13.9',
    'Δ-C: declared jurisdictionClaim on Structure + Schema axes per MA-V10 part B with partial-drift basis at §3.13.10',
    'Δ-D: AmendmentProvenance + §8 change log entry + §4.1 self-audit results updated'
  ],
  discipline: 'additive per MA-L1 + MA-S7 recursive ≼ — zero axiom invariant predicates changed; zero gate predicates changed; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Apparatus declarations added.'
}
```

#### §3.13.12 AmendmentProvenance (Sprint B1 Shot 5 cleanup)

```
amendmentProvenance = {
  amendmentId:          'living-memory-v3-3-sprint-b1-shot-5',
  predecessorVersion:   '3.3 (post Sprint B1 Shot 3)',
  successorVersion:     '3.3 (post Sprint B1 Shot 5 cleanup)',
  cycleId:              'sprint-b1-shot-5',
  timestamp:            '2026-05-13',
  authorityClaim:       { level: 'L0', actor: 'wearer', source: 'demos_ra@hotmail.com' },
  scope: [
    'F-B1-Audit-1 closure: §1 Identity table version field 3.2 → 3.3 (stale post-amendment value corrected to post-Shot-3 sprint version)',
    'F-B1-Audit-2 closure: §6.2 HR-LM1 `to:` field `Living Memory v3.2` → `Living Memory v3.3` (carrier-version reference brought in line with own framework version)',
    'F-B1-Audit-4 closure: §1 Identity table `adjacentFrameworks` row removed entirely (residue eliminated at standards tier; aligns with MFv3 v3.3.1 §2.1 MetaframeworkInput residue cleanup — the input field no longer exists at apparatus tier, so generated standards do not carry the field; the row in §1 Identity was carried forward by template-copy convention, not by GeneratedFrameworkTemplate output schema declaration)',
    'F-B1-Audit-5 closure: §3.13.11 AmendmentProvenance scope row 4 stray `§4.5` reference removed (LM has no §4.5 — Validity section runs §4.1 through §4.4; stray reference was authoring residue from a template that included a §4.5 lifecycle row not applicable here)',
    'Δ: §3.13.12 AmendmentProvenance row (this block) + §8 change log entry added; no other content changes'
  ],
  discipline: 'cleanup-only — zero new basis declarations, zero new RCs, zero new axioms / axes / sub-axes / gates / HRs / primitives / typed shapes / lifecycle events / judgment inputs / closure rules / procedure steps / coupling enums; zero version bumps at LM (stays v3.3); self-audit results unchanged (G-I8 / G-St17 / G-V10 part B outcomes preserved); F-B1-Audit-4 closes by structural dissolution at standards tier alongside MFv3 v3.3.1 apparatus-tier residue removal.'
}
```

---

## §4 Validity

### §4.1 Gate execution (E1–E8)

**E1 — Identity-axis gates (PG1, G-I1–G-I8): PASS**

All nine pass. PG1: §3.3 declares all P1–P8 with basis strings. G-I1–G-I7: mode, kind, ownership, lifecycle, genesis, version, scopeOut all declared in §1. **G-I8 (Sprint B1 Shot 3 v3.3 added):** `governsRuntimeCode = true` declared in §1 Identity table with basis prose; field present, boolean-typed per substrate §6.3 type-check class. PASS.

**E2 — Schema-axis gates (PG2, G-S1–G-S8): PASS**

| Gate | Result |
|---|---|
| PG2 | PASS — §2.1/§2.2 declare all atoms as typed shapes |
| G-S1 | PASS — `SubstrateWriteInput`, `ThreadQueryInput` declared §2.1 |
| G-S2 | PASS — `StateChangeRecord`, `ThreadResult` declared §2.2 |
| G-S3 | PASS — §2.5 positive-empty-declared |
| G-S4 | PASS — §2.6 → §6 |
| G-S5 | PASS — all types declared §2.4 (incl. v3.4 ContentClass row) or referenced §2.3; no undeclared types. `MutationInput` dissolved; union removed. |
| G-S6 | PASS — §2.3 table cites all consumed types by home |
| G-S7 | PASS — Relation nesting (LMA3) declared; no ambiguous discriminated unions. v3.4: ThreadQueryInput.contentClass? optional addition is shape-preserving per MA-S7 recursive ≼ — existing callers omit the parameter, behavior unchanged; ContentClass closed-union sub-shape grounds at substrate v1.8.3 §4.2 A-24. |
| G-S8 | PASS — `referentCitations` array populated (Sprint B2 Shot 5 RC closure; Side-Quest Shot 2 v3.4 LMA13 entry block added). §1 Identity table carries 6 RC entries on Structure axis (5 typed-function-set/typed-contract/route-handler + 1 discipline-axiom-governance for LMA13) and 2 entries on Schema axis (typed-types-module + typed-contract). MA-V10 part B set-coverage holds at amended state. |

**E3 — Structure-axis gates (PG3, G-St1–G-St17): PASS**

| Gate | Result |
|---|---|
| PG3 | PASS — §3.1 positive-empty via inheritance |
| G-St1 | PASS — LMA1–LMA13, 13 unique IDs |
| G-St2 | PASS — axis column in §3.2, each LMA names exactly one |
| G-St3 | PASS — all LMAs declarative invariants |
| G-St4 | PASS — SW: stages 2,3,5 non-decreasing; TQ: stages 2,3,5 non-decreasing |
| G-St5 | PASS — SW1 stage 2 mechanical ✓; SW2 stage 3 gate-execution ✓; SW3 stage 5 mechanical ✓; TQ1 stage 2 mechanical ✓; TQ2 stage 3 gate-execution ✓; TQ3 stage 5 mechanical ✓ |
| G-St6 | PASS — §3.12 vocabulary declared |
| G-St7 | PASS — no circular structural dependency |
| G-St8 | PASS — all counts ≥ 0 |
| G-St9 | PASS — 13 axioms |
| G-St10 | PASS — SW: orders 1,2,3 no gaps; TQ: orders 1,2 no gaps |
| G-St11 | PASS — all 6 P8 steps have kind-specific field: SW1/TQ1 mechanical → derivation; SW2/TQ2 gate-execution → gates; SW3/TQ3 mechanical → derivation |
| G-St12 | PASS — `state-change` declared §1 + §3.12 |
| G-St13 | PASS — §3.12 cross-references declaration sites |
| G-St14 | PASS — §3.4 relational cell declared |
| G-St15 | PASS — 13 unique IDs, no duplicates |
| G-St16 | PASS — SW2 `gates = [LMA1, LMA3, LMA10, LMA11]`; TQ2 `gates = [LMA9]`; axiom/invariant refs per generation-procedure per-row note S3–S10 ("tested axiom or invariant refs"). v3.4: LMA13 is a discipline axiom over LMA7 candidate set + LMA9 optional-filter parameter — structurally verified at TQ1 (contentClass enum validation) and TQ3 (filter application); no new gate added. |
| G-St17 | PASS (Sprint B1 Shot 3 v3.3; v3.4 typed-shape count incremented Side-Quest Shot 2 Phase B) — every MA-St17 enumerated-kind declaration carries `basis` per §3.13 subsections: 1 handoff rule (HR-LM1) + 5 lifecycle events (§5.1 version transition, §5.2 amendment procedure, §5.3 declared→runtime, §5.3 runtime→deprecated, §5.4 deprecation procedure) + 2 judgment inputs + 7 closure rules + 15 typed shapes (v3.4: +1 ContentClass) + 6 procedure steps + 2 coupling enums = 38 declarations, each declares basis with `basis.kind ∈ {substrate-atom-ref, substrate-amendment-ref, l0-ratified-ref}`, reference resolution succeeds per substrate §6.3 classes. Axes count = 0 (inherited), sub-axes count = 0 (none declared) — vacuously satisfied. Axioms, leaves, gates excluded per MA-St17 kind-set exclusions. |

**E4 — Validity-axis gates (PG4, G-V1–G-V11): PASS (with partial-drift declared on G-V10 part B per MA-V11)**

PG4: zero new gates declared; inherited 87 framework-tier gates (MFv3 v3.3.1). G-V1–G-V9: inherited, pass. G-V10 part A: vacuous-pass — zero ReferentCitations at v3.3, applicability='n/a' per MA-V11. **G-V10 part B (Sprint B1 Shot 2 added; first evaluated against amended LM v3.3):** `governsRuntimeCode = true` triggers jurisdiction-coverage check. Structure + Schema axes carry declared `jurisdictionClaim` per §3.13.10. Zero ReferentCitations cover the claimed source paths at this version; partial-drift declared per MA-V11 vacuous-pass with explicit basis prose at §3.13.10 ("Sprint B2 source-cleanup will author ReferentCitations covering jurisdictionClaim per MA-V10 part B amendment trigger"). PASS-with-partial-drift-declared. G-V11: vacuous pass (zero citations; `referentSnapshotRef = null` permitted).

**E5 — Lifecycle-axis gates (PG5, G-L1–G-L11): PASS**

All pass. G-L11: vacuous pass — zero ReferentCitations; stated basis is vacuous (MA-V11), not artifact-grounded.

**E6 — Coupling-axis gates (PG6, G-C1–G-C10): PASS**

| Gate | Result |
|---|---|
| PG6 | PASS — HR-LM1 declared §6.2 |
| G-C1 | PASS — carrier = `self`, §6.1 |
| G-C2 | PASS — carrier justification §6.1 |
| G-C3 | PASS — custody table §6.3 |
| G-C4 | PASS — adjacent frameworks §1 |
| G-C5 | PASS — §3.4 relational cell names all dependencies |
| G-C6 | n/a — basis: scope isolation in the single-store model is a perimeter responsibility. The substrate stores whatever the perimeter submits; it does not enforce access boundaries between scopes. Isolation is not absent — it is enforced at the perimeter gate, which is the correct architectural layer for it. No LM-internal scope isolation invariant exists by design (LMA6). |
| G-C7 | n/a — basis: upward-flow prohibition does not apply in the single-store model. The concept of upward flow presupposes two structurally distinct instances (per-user → global) that could be confused. With scope as attribute on a single store, there is no directional boundary to violate. Write authority preventing wearer-scoped state-changes from being written to global scope is a perimeter gate concern, not a substrate invariant. |
| G-C8 | PASS — HR-LM1 typed at §6.2 with input, guarantee fields |
| G-C9 | PASS — §1.1 genesis + §6.4 provenance |
| G-C10 | PASS — LM → substrate (no loop); perimeter → LM (one-way) |

**E7 — Judgment-axis gates (PG7, G-J1–G-J5): PASS**

J-lm-scope-as-attribute and J-lm-thread-completeness declared §7. Both have mechanical criteria. Both closed at generation time. Deprecation procedure declared §7.3. Neither substitutes for a mechanical gate.

**E8 — Universal + meta-tier gates (G-G13, G-U1–G-U5, G-M1–G-M4): PASS**

G-G13: §1.3 four-property test passes. G-U1: §5.3 state transition declared. G-U2: LMA1–LMA12 are structural-transformation invariants. G-U3: §1.3 hidden-sibling check passes. G-U4: §1 scopeOut non-empty. G-U5: §1.1 genesis all fields present. G-M1: 12 axioms; LMA1/LMA3/LMA10/LMA11 in SW2 gates; LMA9 in TQ2 gates; LMA2/LMA4/LMA5/LMA6/LMA7/LMA8 covered by inherited MF framework-tier gates or structurally verified in procedure derivations; LMA12 covered by inherited framework-tier gates (parallel to LMA2/LMA4–LMA8); no axiom gate-orphaned. G-M2: zero new gates. G-M3: two J-inputs, distinct concerns. G-M4: one HR, no duplication.

**Overall: all E1–E8 PASS. Template advances to S11.**

---

## §5 Lifecycle

### §5.1 Versioning discipline

Additive-only per MA-L1. Patch for editorial corrections. Minor for axiom additions. Major for structural rederivations. v3.1 is a major correction to v3.0 — auxiliary storage dissolved, procedure restructured, scoping model replaced.

### §5.2 Amendment procedure

Amendments follow MF amendment-propagation-v1-0: propose → audit → L0 confirm → propagate. Amendments that dissolve an axiom require a new generation run. No amendment may reintroduce auxiliary storage, authority validation at substrate level, or multi-instance scoping without a new generation run under a revised substrate spec.

### §5.3 State transitions

```
declared → runtime:   Sprint 8 deploy — first activation of write and thread query procedures
runtime → deprecated: when a successor framework (v4.0+) is generated and confirmed by L0
```

### §5.4 Deprecation procedure

Requires: (a) successor framework generated and L0-confirmed, (b) migration path declared, (c) L0 deprecation ruling.

---

## §6 Coupling

### §6.1 Carrier justification

Carrier = `self`. LM emits its own artifact — the StateChangeRecord — via the substrate write procedure (SW3 commit). The artifact is the persisted state-change. No enclosing carrier framework required.

### §6.2 Handoff rules

**HR-LM1 — Perimeter/intake → LM write surface.**

```
HR-LM1 = {
  direction: 'inbound',
  from:      'Perimeter/intake',
  to:        'Living Memory v3.3',
  contract: {
    input:     SubstrateWriteInput,
    guarantee: 'LM will execute SW1–SW3 atomically per LMA4.
                Authority enforcement and scope access control are
                perimeter responsibilities — LM writes whatever
                arrives through the perimeter gate.'
  }
}
```

The perimeter/intake layer is the write-surface initiator. It assembles SubstrateWriteInput from arriving signals (wearer utterances, AI responses, system events), enforces authority, and submits to LM. LM stores honestly. The perimeter decides what to submit; LM decides nothing about what arrives.

### §6.3 Custody table

| Artifact | Owner | Custodian | Access |
|---|---|---|---|
| Substrate store (state_change rows, all scopes) | Scope-specific (global = System-L0; per-user = Wearer-L0) | F-memory (new substrate service, Sprint 8) | Perimeter gate enforces scope access; LM itself is scope-agnostic |
| living-memory.md (this file) | L0 | src/core/standards/ | Read: all; Write: L0-confirmed amendment or regeneration only |

### §6.4 Provenance

```
provenance = {
  instanceId:     'living-memory-v3-1-sprint7-close',
  cycleId:        'Sprint-7-structural-transition',
  timestamp:      'Sprint 7 close',
  authorityClaim: 'L0-confirmed pending Sprint 7 gate close'
}
```

---

## §7 Judgment

### §7.1 J-lm-scope-as-attribute

**Question:** Is scope-as-attribute sufficient — does a single physical store with scope carried in SourceRef.scope correctly isolate state-changes across wearers, teams, and global without requiring multiple substrate instances?

**Mechanical criteria:**
1. ScopeRef is an open-vocabulary attribute on SourceRef — new scope kinds require no structural change (LMA6).
2. Scope filtering is a read concern — thread queries accept an optional scope parameter; the substrate does not enforce it.
3. Authority enforcement (who may write to which scope, who may revoke) is a perimeter responsibility — not declared in any LM axiom.
4. Cross-scope queries are possible when the perimeter permits them — the substrate does not prevent them.

**Resolution:** PASS. LMA6 declares scope as attribute. The single-store model is more modular than two-instance: new scope kinds (team, project) are new ScopeRef values with no infrastructure change. Authority and access control sit entirely at the perimeter, where they belong.

### §7.2 J-lm-thread-completeness

**Question:** Are the three declared thread operations (identity-recurrence, role-pattern, adjacency) plus raw axis scan (iterate_axis) complete?

**Mechanical criteria:**
1. Identity-recurrence: when and where has this identity appeared?
2. Role-pattern: when and where has this identity appeared in this role?
3. Adjacency: what appears near this position?
4. Iterate_axis: raw scan from a position in a direction for N records.
5. Geometry (temporal arcs, cluster membership, co-occurrence) composes from these four — no fifth operation required.

**Resolution:** PASS. The four operations cover the complete read surface. Geometry is emergence (LMA8), not a fifth primitive.

### §7.3 Judgment deprecation

Both J-inputs deprecated when the framework is deprecated (§5.4). No judgment is deprecated independently.

---

## §8 Change log

| Version | Event | Summary | Authority |
|---|---|---|---|
| 3.0 | Sprint 7 Job 2 | First generation under substrate spec v3. Replaced LM v2.1 entirely. | L0 pending |
| 3.1 | Sprint 7 close | Full mechanical derivation against final substrate spec. Dissolved: IdentityRecord, canonical-Ref pointer, surface forms at substrate level (LMA12 dissolved, LMA4 trimmed → LMA5); MutationInput; authority validation in procedure (SW1 dissolved); two-instance scoping model replaced by single store with scope as attribute (LMA6); revoke as separate operation (now in-band via RevokeRef in SW3). Restructured: procedures now SW1–SW3 + TQ1–TQ3; axiom count 14 → 11; P8 count 7 → 6. Added: §3.10 required operations table, §3.11 indices, RevokeRef declaration (§3.6), SourceRef with scope attribute. Closed: F-LM-001 (MutationInput dissolved), F-LM-002 (referentCitations declared), F-LM-003 (LMA IDs confirmed correct for runtime procedure), F-LM-004 (G-L11 vacuous-pass basis corrected). | L0 pending |
| 3.2 | Sprint 12 / Phase 4 | Additive amendment per L0-directive (path-to-beta-spec §8 multi-user realization). Added: LMA12 (user ownership axiom); userId field on SubstrateWriteInput + StateChangeRecord; userId presence validation in SW1 (SW1_USERID_MISSING error); userId atomic commit note in SW3 (LMA4 + LMA12); userId index in §3.11 (required, not optional); vocabulary entry §3.12. Axiom count 11 → 12. Minor version bump per §5.1. | L0 pending |
| 3.3 | Sprint B1 Shot 3 (2026-05-13) | MA-St17 / MA-I8 / MA-V10 part B amendment apparatus applied per MFv3 v3.3.0 Shot 2. **Δ-A:** §1 Identity table extended with `governsRuntimeCode: true` row + basis prose (LM governs F-memory R0..R4 runtime code); §1.2 Identity-axiom-satisfaction table extended with MA-I8 row. **Δ-B:** §3.13 AxisBasis declarations subsection added (additive per MA-S7 recursive ≼) holding basis declarations for every MA-St17 enumerated-kind declaration at LM — §3.13.3 handoff rules (1: HR-LM1 → l0-ratified-ref to Manual Part II Boundary+Store), §3.13.4 lifecycle events (5: substrate-atom-ref to A-16/A-21/LifecycleState), §3.13.5 judgment inputs (2: J-lm-scope-as-attribute + J-lm-thread-completeness → l0-ratified-ref to Manual loci), §3.13.6 closure rules (7: l0-ratified-ref per closure to Manual loci), §3.13.7 typed shapes (14: mix of substrate-atom-ref to A-01 WAtom + l0-ratified-ref to Manual loci), §3.13.8 procedure steps (6: SW1–SW3 + TQ1–TQ3 → l0-ratified-ref to Manual Part II Store + Part I Substrate loci), §3.13.9 coupling enums (2: substrate-atom-ref to Carrier + A-04 CustodyRow). Total: 37 basis declarations added. **Δ-C:** §3.13.10 MA-V10 part B jurisdiction coverage table declared — Structure axis jurisdictionClaim over `src/features/F-memory/**` + `src/app/api/memory/**` paths; Schema axis jurisdictionClaim over domain + contract + route paths; remaining axes declared n/a per applicability clause. Zero ReferentCitations at v3.3; partial-drift declared per MA-V11 vacuous-pass with explicit basis prose targeting Sprint B2 close. **Δ-D:** AmendmentProvenance recorded at §3.13.11; §4.1 E1 updated to G-I1–G-I8 (PASS); §4.3 E3 updated to G-St1–G-St17 with explicit G-St17 declaration count (PASS); §4.4 E4 updated to G-V10 part B PASS-with-partial-drift-declared; this change log entry added. Version transition v3.2 → v3.3 per MA-L1 additive-only. Manual citations pin `manualVersion: '13.0'`. Zero axiom invariant predicates changed; zero gate predicates changed; zero schema shapes changed; zero handoff rule contracts changed; primitive instance counts unchanged. Apparatus declarations added. | L0 (Sprint B1 Shot 3) |
| 3.3 (Shot 5 cleanup) | Sprint B1 Shot 5 (2026-05-13) | Sprint B1 close audit findings closed. **F-B1-Audit-1:** §1 Identity table version field 3.2 → 3.3 (post-amendment value brought in line with own framework version). **F-B1-Audit-2:** §6.2 HR-LM1 `to:` field `Living Memory v3.2` → `Living Memory v3.3` (carrier-version reference corrected). **F-B1-Audit-4:** §1 Identity table `adjacentFrameworks` row removed entirely — residue eliminated at standards tier alongside MFv3 v3.3.0 → v3.3.1 §2.1 MetaframeworkInput residue cleanup; the input field carried zero downstream consumers at apparatus tier (no axiom referenced it, no gate tested it, no output field populated from it, no consumer in framework-audit / registry / amendment-propagation); the §1 Identity row was carried forward by template-copy convention, not by GeneratedFrameworkTemplate output schema declaration. **F-B1-Audit-5:** §3.13.11 AmendmentProvenance scope row 4 stray `§4.5` reference removed (LM has no §4.5 — Validity section runs §4.1 through §4.4). **Δ:** §3.13.12 AmendmentProvenance row added recording Shot 5 cleanup with L0 authorityClaim; this §8 row added. No content changes outside the enumerated edits. No version bump (LM stays v3.3 — additions are corrective patches to existing v3.3 content). Self-audit results unchanged — G-I8 / G-St17 / G-V10 part B outcomes preserved. F-B1-Audit-4 closes by structural dissolution: removal at apparatus + standards tiers eliminates both the symptom (asymmetric carriage across sibling standards) and the cause (non-load-bearing input field). | L0 (Sprint B1 Shot 5) |
| 3.4 | Side-Quest Shot 2 (2026-05-19) | **ContentClass apparatus alignment, Phase B.** Predecessor: LM v3.3.1 (MANIFEST baseline at B2 Shot 5 RC closure; file body stamp v3.3 stale-header — closed as side-effect of v3.4 bump per Side-Quest spec §SHOT 2 W7). **Δ-LMA13.** New axiom LMA13 ContentClass discipline added to §3.2 (Structure axis): "Every StateChangeRecord carries `metadata.source.contentClass: ContentClass` (per substrate v1.8.3 A-24). LMA7 anchor-derivation operates over records where `contentClass === 'wearer-life'` only. Records where `contentClass === 'system-introspection'` are queryable via LMA9 primitives but excluded from anchor-candidacy by construction. Cross-class queries are permitted; cross-class mixing in anchor-derivation is forbidden." Axiom count 12 → 13. §3.3 P4 count updated 12 → 13. §1.3 own-invariants count updated 12 → 13. §1 governsRuntimeCode basis updated LMA1–12 → LMA1–13. **Δ-LMA7.** Mechanical clarification (in-place clause amendment per Q1=(i) at Shot 2 entry): LMA7 body extended with candidate-set restriction clause "Over the candidate set of records where LMA13 ContentClass filter selects" — no semantic change to identity-density / position-density rules; only candidate-set is now ContentClass-filtered. **Δ-LMA9.** Mechanical clarification: each thread-kind primitive accepts optional `contentClass?: ContentClass` filter (LMA13). Default (omitted) returns all classes — backward-compatible. Filter applied at TQ3 alongside existing optional scope filter; projection composes by AND. **Δ-SCHEMA.** §2.1 ThreadQueryInput shape extended with `contentClass?: ContentClass` optional field; §2.1 SourceRef shape extended with `contentClass: ContentClass` required field (substrate v1.8.3 reflection — Shot 1 substrate-tier addition reflected at LM schema documentation site). §2.1 SourceRef channel union opportunistically extended with `'system-l0'` (Sprint B2 Shot 5 stale-channel-list drift closed as same-line touch). §2.4 framework-local atoms list extended with ContentClass row. **Δ-PROCEDURE.** §3.9 TQ1 validation extended with optional contentClass enum check; §3.9 TQ3 execution extended with optional ContentClass filter application; §3.10 required-operations table identity_recurrence / role_pattern / adjacency signatures extended with optional contentClass parameter. SW1–SW3 unchanged. **Δ-INDICES.** §3.11 amended: `source_content_class → positions` row added as optional optimization (folded from Side-Quest Shot 1 Phase A under L0 branch-α ratification — Shot 1's row was pre-version-bump amendment; v3.4 is its first formal version home per Q3=(I) at Shot 2 entry). §3.13.6 Required-indices closure-rule basis updated five → six declared indices. **Δ-VOCAB.** §3.12 vocabulary extended with ContentClass row pointing to substrate v1.8.3 §4.2 A-24 as canonical declaration site. §3.13.6 vocabulary-closure declared-terms list extended. **Δ-BASIS (MA-St17).** §3.13.7 typed-shapes table extended +1 ContentClass row (substrate-atom-ref to A-24); §3.13.7 SourceRef row prose extended to mention contentClass sub-field. G-St17 declaration count 37 → 38 (typed-shapes 14 → 15). **Δ-RC.** §1 referentCitations row Structure-axis array extended +1 entry block citing LMA13 read paths (substrate-repository.ts readByPosition / iterateAxisRows / readIdentityRecurrence / readAdjacency — LMA13 governs no new function but constrains the candidate set over which LMA7 operates and authorizes the optional contentClass filter on LMA9 primitives); existing substrate-repository.ts entry's expectedShape extended with `every row carries source.contentClass field [LMA13 via SubstrateSourceRef substrate v1.8.3 A-24]` line; Schema-axis substrate.types.ts entry's expectedShape extended to reflect SubstrateSourceRef.contentClass + ContentClass exported type + deriveContentClassFromChannel helper + ThreadQueryInput.contentClass? optional filter (v3.4 RC truth sync — stale ThreadQueryInput shape string in Schema-axis RC was opportunistically corrected as same-line touch). **Δ-GATES.** §4.1 E2: G-S5 prose mentions ContentClass row in §2.4; G-S7 prose mentions ThreadQueryInput.contentClass? shape-preserving per MA-S7 recursive ≼. §4.1 E3: G-St1 / G-St9 / G-St15 / G-St16 / G-St17 axiom-count restatements (12 → 13 / 37 → 38). All gate pass results preserved. **Δ-RUNTIME.** `src/core/types/substrate.types.ts` ThreadQueryInput extended with `contentClass?: ContentClass` optional field per Q2=(β) at Shot 2 entry (type-level field add is backward-compatible; no callsite sweep needed — optional addition; `npx tsc --noEmit` returns exit 0 with zero errors verified at Shot 2 close). Implementation amendment to substrate-repository.ts thread-query read paths to consume the filter parameter deferred per Side-Quest spec §"Out of scope (Phase B)" — F-present build sprint owns implementation. Version transition v3.3.1 → v3.4 per MA-L1 additive-only (LMA addition is minor-class). Manual citations pin `manualVersion: '13.0'`. Zero axiom invariant predicates reduced; zero gate predicates changed; zero schema shapes contracted; zero handoff rule contracts changed. Substrate gate count unchanged at 6; framework-tier gate count unchanged at 87; metaframework axiom count unchanged at 69; substrate atom count unchanged at 24 (Shot 1 added A-24). authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'Side-Quest-Shot2-pending'} | L0 pending |
| 3.5 | Present Standard re-derivation Shot 1 (2026-05-21) | **Reading-A snapshot read primitive — `asOfPosition?` position ceiling.** Predecessor: LM v3.4 (Side-Quest Shot 2). Derived in the Present Standard re-derivation (STEP-1-derive-corrected-rev2.md Phase one, re-derived against Reading A): composing a `PresentView` as the substrate stood at a chain position requires position-ceilinged thread reads; LM v3.4's three LMA9 thread primitives had no position ceiling. **Δ-LMA9.** Mechanical clarification (additive clause, no semantic change to the three-and-only-three closure): each thread-kind primitive accepts an optional `asOfPosition?: PositionRef` position-ceiling parameter. Default (omitted) returns the full accumulated thread — the live present, backward-compatible. Present, the read returns only state-changes at or before the given chain position (a Reading-A snapshot). Applied at TQ3 as an open-ended `AND position <= $asOfPosition` conjunct on each primitive's own `WHERE` clause — not count-limited, not direction-dispatched; it is therefore not the `iterate_axis` clause. Composes by AND with the existing optional `scope?` and `contentClass?` filters. `asOfPosition?` is a parameter on the existing three primitives — not a fourth primitive (LMA9 closure untouched) and not a third axis (LMA10 untouched — it filters the existing Axis-1 position coordinate). **Δ-SCHEMA.** §2.1 `ThreadQueryInput` shape extended with `asOfPosition?: PositionRef` optional field. **Δ-PROCEDURE.** §3.9 TQ1 validation extended to accept and carry forward the optional `asOfPosition`; §3.9 TQ3 execution extended with optional position-ceiling application; §3.10 required-operations table `identity_recurrence` / `role_pattern` / `adjacency` signatures extended with the optional `asOfPosition?` parameter. SW1–SW3 unchanged. **Δ-RUNTIME.** `src/core/types/substrate.types.ts` `ThreadQueryInput` extended with `asOfPosition?: PositionRef` optional field; `src/features/F-memory/config/substrate-config.ts` `ThreadQueryValidated` extended with `asOfPosition?` + `contentClass?` (the latter forced — `tq1Validate` spreads the input and TQ3 reads both, so the validated shape must carry both); `src/features/F-memory/exec/substrate-repository.ts` `readIdentityRecurrence` / `readRolePattern` / `readAdjacency` gain the `asOfPosition?` WHERE conjunct; `src/features/F-memory/app/substrate-service.ts` TQ3 threads the parameter through and the `identityRecurrence` / `rolePattern` / `adjacency` convenience wrappers gain it. Same pass also lands the v3.4-deferred `contentClass?` repository read-path plumbing (LM v3.4 §8 recorded the `substrate-repository.ts` `contentClass` implementation as deferred to "the F-present build sprint"; this is that sprint — the three thread reads gain the `AND source_content_class = $n` conjunct alongside `asOfPosition`, and the service-layer TQ3 + wrappers thread it). Type-level additions are backward-compatible — optional fields, no callsite sweep. Version transition v3.4 → v3.5 per MA-L1 additive-only (LMA mechanical clarification is minor-class; field-additive on `ThreadQueryInput` shape-preserving under MA-S7). Manual citations pin `manualVersion: '13.0'`. Zero axiom invariant predicates reduced; zero gate predicates changed; zero schema shapes contracted; zero handoff rule contracts changed; axiom count unchanged at 13. authorityClaim: {level:'L0', confirmedBy:'Demos', timestamp:'present-rederive-shot1-pending'} | L0 pending |

---

*End of living-memory.md v3.4 — Side-Quest Shot 2 (ContentClass apparatus alignment, Phase B).*
