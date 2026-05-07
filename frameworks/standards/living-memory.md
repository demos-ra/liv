# living-memory

**Kind:** Framework  
**Level:** L3  
**Mode:** generative (structured → produced)  
**Version:** v3.1  
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)  
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7  
**Authority:** pending L0 confirmation (Sprint 7 close)  
**Replaces:** living-memory.md (v2.1, v3.0) + living-memory-standard.md (vestige)  
**Findings closed:** F-MFA-LM-001, F-MFA-LM-002, F-MFA-LM-003, F11, G1, T-LM-VESTIGE, T-MF-CYCLE3  
**referentCitations:** [] (zero citations; vacuous pass per MA-V11)

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
| `version` | `3.1` (substrate §7 Semver) |
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
| `adjacentFrameworks` | Artifact Standard v2.2, Plan Standard v2.2, Verification Standard v1.0, Research Standard v1.0, Multi-Instance Standard v2.3, LIV-Standard v1.5.1 |
| `scopeOut` | classification of input (perimeter/F-router); artifact emission mechanics (Artifact Standard); plan authoring (Plan Standard); multi-instance dispatch (Multi-Instance Standard); chat session management (F-chat); event bus wiring; DB connection management (core/db/client); authority enforcement (perimeter gate); scope access control (perimeter gate); surface-form-to-Ref matching (perimeter) |
| `referentCitations` | [] |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8:

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'Sprint-7-structural-transition',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: { id: 'living-memory', version: '3.0' },
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
| MA-I6 | Version declared as `3.1`; semver format per substrate §7. |
| MA-I7 | scopeOut declared in §1; non-empty enumeration of excluded concerns. |

### §1.3 MA-G13 four-property test

| Property | Satisfied by |
|---|---|
| Own state | One physical substrate store — a sequence of `StateChangeRecord` rows scoped by scope attribute. Transition rules: LMA1 (forward-additive), LMA2 (revocation as sole destructive exception), LMA6 (scope as attribute). |
| Own I/O | Input atoms: `SubstrateWriteInput`, `ThreadQueryInput` (§2.1). Output atoms: `StateChangeRecord`, `ThreadResult` (§2.2). |
| Own invariants | 11 structural-transformation axioms LMA1–LMA11 (§3.2). Each binds a state transition; none is a data-integrity invariant only. |
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
  channel: 'wearer' | 'ai' | 'cron' | 'integration-event' | 'internal-derivation',
  scope:   ScopeRef                // which scope this state-change belongs to
                                   // e.g. 'global', userId, teamId, projectId
                                   // open vocabulary — new scope kinds are new values, not new infrastructure
}

ThreadQueryInput = {
  threadKind:  'identity-recurrence' | 'role-pattern' | 'adjacency',
  anchor:      IdentityRef | PositionRef,  // identity-anchored or position-anchored per kind
  roleFilter?: RoleRef,                    // required for 'role-pattern' kind
  scope?:      ScopeRef,                   // filter to specific scope; absent = caller-managed
  window?:     number,                     // caller-supplied integer; required for 'adjacency' kind
  limit?:      number                      // max positions to return
}
```

### §2.2 Outputs

```
StateChangeRecord = {
  id:       StateChangeId,
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

### §2.5 Schema rules

Per metaframework §2.5. No LM-local ScR additions.

### §2.6 Custody table

See §6 Coupling full custody table.

---

## §3 Structure

### §3.1 Axes

Inherits metaframework-v3-1's seven-axis decomposition per substrate §1.3 SI-03. LM v3.1 declares no own axes.

### §3.2 Axioms

**Count: 11 axioms LMA1–LMA11.**

| ID | Name | Axis | Invariant |
|---|---|---|---|
| LMA1 | Forward-additive writes | Structure | Every write produces a new StateChangeRecord appended to Axis 1. No in-place mutation of existing records. Revocation is the single destructive exception (LMA2). |
| LMA2 | Revocation as sole destructive exception | Structure | Revocation arrives in-band as a SubstrateWriteInput whose top-level relation type is RevokeRef (§3.6). SW3 detects this and deletes the target StateChangeRecord as a side effect of the same atomic commit. The revocation itself is not stored as a separate record — it is purely the deletion mechanism. Gaps in Axis 1 are honest: position numbers do not renumber, gaps are skipped by queries without error. |
| LMA3 | Relation structure | Structure | Every Relation has exactly four peer components: type (IdentityRef — verbs are identities, open vocabulary), modality (declarative \| interrogative \| imperative \| exclamative — guidance only, re-derived at execution), identities-with-roles (open vocabulary, ≥1 entry), negation (boolean). Relations nest unboundedly. No component is optional. |
| LMA4 | Atomic commit | Structure | A SubstrateWriteInput produces exactly one StateChangeRecord. Content (identities + relations) and metadata (time, source, position) commit atomically — all or nothing. No partial state-change exists. |
| LMA5 | Identity-by-reference | Structure | Identities exist by reference only. No identity is stored as a separate atom. An identity is realized whenever an IdentityRef appears in a StateChangeRecord's content. Identity is a cluster property — Refs that walk the same geometric path through the substrate converge to a cluster. Cluster membership is read-time geometry, not stored mapping. |
| LMA6 | Scope as attribute | Structure | Scope is carried in SourceRef.scope on every state-change. Scope is an open-vocabulary attribute — new scope kinds (user, global, team, project) are new ScopeRef values, not new infrastructure. The substrate stores all state-changes in one physical store. Scope filtering is a read concern, executed at query time by the caller. |
| LMA7 | Anchor derivation | Structure | Anchors are derived, never stored. An anchor is an IdentityRef with high reference count AND high relational diversity across its thread. Thresholds are refinement parameters owned by the present layer. |
| LMA8 | Geometry as emergence | Structure | Geometry is what the substrate exposes when threads are walked and relations read at each position. Not stored. Temporal arcs, cluster membership, co-occurrence patterns — all emergent at read time. Storing derived geometry is a violation. |
| LMA9 | Thread kinds | Structure | Three and only three primitive operations against the substrate: identity-recurrence (Axis 2, identity-anchored, discontinuous), role-pattern (identity-anchored with role filter), adjacency (position-anchored, window-bounded, different in kind from thread traversals). All other queries compose from these three plus raw axis scan. No fourth primitive operation exists at the substrate level. |
| LMA10 | Two-axis structure | Structure | Axis 1: the state-change sequence, positions ordered by monotonic integer. Axis 2: identity threads, discontinuous recurrence across positions. These two axes are the complete structural description of the substrate. No third axis exists at the substrate level. |
| LMA11 | Modality re-derivation | Structure | Relation modality is stored as recorded metadata. Consumers re-derive its operational significance from context at read time. The stored value is informational, not binding. |

### §3.3 Primitive instance counts

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | axes inherited from metaframework-v3-1 §3.1; LM v3.1 declares no own axes |
| P2 Sub-axis | 0 | no sub-axes declared |
| P3 Leaf | 0 | no leaves declared |
| P4 Axiom | 11 | LMA1–LMA11 declared §3.2 |
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
| SW1 | 1 | 2 | mechanical | `SubstrateWriteInput` | validated input | Validate shape: identities non-empty; each Relation has all four components; identitiesWithRoles has ≥1 entry per relation. Assign position (monotonic integer, next in sequence). Stamp time as write-time timestamp. |
| SW2 | 2 | 3 | gate-execution | validated input | gate results | `gates = [LMA1, LMA3, LMA10, LMA11]` — forward-additive append (LMA1), relation structure (LMA3), two-axis coherence (LMA10), modality stored as recorded metadata not as constraint (LMA11). |
| SW3 | 3 | 5 | mechanical | gate-passed input | persisted `StateChangeRecord` | Detect RevokeRef: if any top-level relation's type is RevokeRef, delete the target StateChangeRecord identified by that relation's identities-with-roles (LMA2). Then commit the inbound state-change atomically — content + metadata in one transaction (LMA4 guarantee). Scope filtering is a read concern; this step writes to the single physical store unconditionally. |

### §3.9 Thread query procedure (TQ1–TQ3)

Three P8 steps. Read-only — no mutation.

| id | order | stage | kind | input | output | derivation / gates |
|---|---|---|---|---|---|---|
| TQ1 | 1 | 2 | mechanical | `ThreadQueryInput` | validated query | Validate threadKind ∈ {'identity-recurrence', 'role-pattern', 'adjacency'}. For 'role-pattern': roleFilter must be present. For 'adjacency': anchor must be PositionRef, window must be a positive integer. |
| TQ2 | 2 | 3 | gate-execution | validated query | gate results | `gates = [LMA9]` — query kind is one of the three and only three substrate thread primitives (LMA9). |
| TQ3 | 3 | 5 | mechanical | gate-passed query | `ThreadResult` | Execute against substrate: identity-recurrence — scan state-changes for IdentityRef, return ordered by position. role-pattern — same, filtered by roleFilter in identitiesWithRoles. adjacency — return state-changes within ±window positions of anchor. Apply scope filter if ThreadQueryInput.scope is present. Geometry (LMA8) emerges from what the caller does with ThreadResult — not computed here. |

### §3.10 Required operations

| Operation | Signature | Procedure |
|---|---|---|
| `write_state_change` | (identities, relations, source) → position | SW1–SW3 |
| `read_state_change` | (position) → StateChangeRecord | direct index lookup |
| `iterate_axis` | (start_position, direction, count) → StateChangeRecord[] | raw Axis 1 scan; adjacency is derived from this |
| `identity_recurrence` | (IdentityRef, scope?) → StateChangeRecord[] ordered by position | TQ1–TQ3 with threadKind='identity-recurrence' |
| `role_pattern` | (IdentityRef, RoleRef, scope?) → StateChangeRecord[] ordered by position | TQ1–TQ3 with threadKind='role-pattern' |
| `adjacency` | (PositionRef, window) → StateChangeRecord[] | TQ1–TQ3 with threadKind='adjacency' |

`read_state_change` and `iterate_axis` are direct substrate operations — no procedure steps required beyond index lookup and axis scan.

### §3.11 Required indices

| Index | Purpose |
|---|---|
| position (primary) | Axis 1 ordering, adjacency, iterate_axis |
| identity → positions | identity_recurrence, role_pattern queries |
| (identity, role) → positions | role_pattern query optimization |
| scope → positions | scope-filtered queries (optional optimization; correct without it via scan) |

### §3.12 Vocabulary

| Term | Declared | Definition |
|---|---|---|
| `IdentityRef` | §2.1 | A reference string naming an identity. Normalized form: lowercase hyphenated. Identities exist by reference (LMA5). Verbs, nouns, concepts — all are IdentityRefs. |
| `ScopeRef` | §2.1 | Open-vocabulary scope identifier. Examples: 'global', userId, teamId, projectId. New scope kinds are new ScopeRef values — no infrastructure change needed (LMA6). |
| `SourceRef` | §2.1 | Origin channel + scope attribute. channel enum is extensible. scope is open vocabulary. |
| `PositionRef` | §2.1 | Monotonic integer; Axis 1 coordinate. Auto-assigned at SW3. Enables adjacency queries (LMA9). |
| `RoleRef` | §3.5 | Open-vocabulary string naming the role an identity plays in a Relation. |
| `StateChangeId` | §2.2 | Unique identifier for a committed StateChangeRecord. |
| `RevokeRef` | §3.6 | System-reserved IdentityRef (`'revoke-Ref'`). The only system-reserved Ref. Recognized by convention in SW3. |
| `Anchor` | §3.7 | Derived: IdentityRef with high recurrence + high relational diversity. Never stored. |
| `Geometry` | §3.8 | Emergent: temporal arcs, cluster membership, co-occurrence patterns — what the substrate exposes when threads are walked and relations read. Not stored (LMA8). |
| `state-change` | §1 | The framework primitive: one atomic commit (SubstrateWriteInput → StateChangeRecord). |

---

## §4 Validity

### §4.1 Gate execution (E1–E8)

**E1 — Identity-axis gates (PG1, G-I1–G-I7): PASS**

All eight pass. PG1: §3.3 declares all P1–P8 with basis strings. G-I1–G-I7: mode, kind, ownership, lifecycle, genesis, version, scopeOut all declared in §1.

**E2 — Schema-axis gates (PG2, G-S1–G-S8): PASS**

| Gate | Result |
|---|---|
| PG2 | PASS — §2.1/§2.2 declare all atoms as typed shapes |
| G-S1 | PASS — `SubstrateWriteInput`, `ThreadQueryInput` declared §2.1 |
| G-S2 | PASS — `StateChangeRecord`, `ThreadResult` declared §2.2 |
| G-S3 | PASS — §2.5 positive-empty-declared |
| G-S4 | PASS — §2.6 → §6 |
| G-S5 | PASS — all types declared §2.4 or referenced §2.3; no undeclared types. `MutationInput` dissolved; union removed. |
| G-S6 | PASS — §2.3 table cites all consumed types by home |
| G-S7 | PASS — Relation nesting (LMA3) declared; no ambiguous discriminated unions |
| G-S8 | PASS (vacuous) — `referentCitations: []`; zero citations; MA-V11 vacuous-pass applies |

**E3 — Structure-axis gates (PG3, G-St1–G-St16): PASS**

| Gate | Result |
|---|---|
| PG3 | PASS — §3.1 positive-empty via inheritance |
| G-St1 | PASS — LMA1–LMA11, 11 unique IDs |
| G-St2 | PASS — axis column in §3.2, each LMA names exactly one |
| G-St3 | PASS — all LMAs declarative invariants |
| G-St4 | PASS — SW: stages 2,3,5 non-decreasing; TQ: stages 2,3,5 non-decreasing |
| G-St5 | PASS — SW1 stage 2 mechanical ✓; SW2 stage 3 gate-execution ✓; SW3 stage 5 mechanical ✓; TQ1 stage 2 mechanical ✓; TQ2 stage 3 gate-execution ✓; TQ3 stage 5 mechanical ✓ |
| G-St6 | PASS — §3.12 vocabulary declared |
| G-St7 | PASS — no circular structural dependency |
| G-St8 | PASS — all counts ≥ 0 |
| G-St9 | PASS — 11 axioms |
| G-St10 | PASS — SW: orders 1,2,3 no gaps; TQ: orders 1,2 no gaps |
| G-St11 | PASS — all 6 P8 steps have kind-specific field: SW1/TQ1 mechanical → derivation; SW2/TQ2 gate-execution → gates; SW3/TQ3 mechanical → derivation |
| G-St12 | PASS — `state-change` declared §1 + §3.12 |
| G-St13 | PASS — §3.12 cross-references declaration sites |
| G-St14 | PASS — §3.4 relational cell declared |
| G-St15 | PASS — 11 unique IDs, no duplicates |
| G-St16 | PASS — SW2 `gates = [LMA1, LMA3, LMA10, LMA11]`; TQ2 `gates = [LMA9]`; axiom/invariant refs per generation-procedure per-row note S3–S10 ("tested axiom or invariant refs") |

**E4 — Validity-axis gates (PG4, G-V1–G-V11): PASS**

PG4: zero new gates declared; inherited 85 framework-tier gates. G-V1–G-V9: inherited, pass. G-V10: no implementation referents exist yet (Sprint 8 future); applicability=n/a per MA-V11. G-V11: vacuous pass (zero citations; `referentSnapshotRef = null` permitted).

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

G-G13: §1.3 four-property test passes. G-U1: §5.3 state transition declared. G-U2: LMA1–LMA11 are structural-transformation invariants. G-U3: §1.3 hidden-sibling check passes. G-U4: §1 scopeOut non-empty. G-U5: §1.1 genesis all fields present. G-M1: 11 axioms; LMA1/LMA3/LMA10/LMA11 in SW2 gates; LMA9 in TQ2 gates; LMA2/LMA4/LMA5/LMA6/LMA7/LMA8 covered by inherited MF framework-tier gates or structurally verified in procedure derivations; no axiom gate-orphaned. G-M2: zero new gates. G-M3: two J-inputs, distinct concerns. G-M4: one HR, no duplication.

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
  to:        'Living Memory v3.1',
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

---

*End of living-memory.md v3.1 — Sprint 7 close.*
