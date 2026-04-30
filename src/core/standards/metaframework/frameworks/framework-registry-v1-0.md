# framework-registry-v1-0

**Kind:** non-framework (state store)
**Version:** v1.4
**Authority:** L0 confirmed (MF-Cycle-1 Foundation Closure delivery)
**Consumes:** substrate-v1-1 (by reference, per HR1)
**Consumed by:** metaframework-v3.1 (HR5 write path), amendment-propagation (HR4 return path), framework-audit (HR3 provenance lookup)
**Dependencies:** substrate-v1-1 only
**Versioning discipline:** additive only

Registry is the state store of per-framework provenance, lifecycle, and amendment history. It is not a framework: its invariants are data-integrity (write-once, consistency, uniqueness, referential integrity) per substrate §1.2 kind-of-invariants distinction. MA-G13 framework test does not apply; registry is classified as non-framework state store on this declared basis. Cycle-1 v1.1 (MF-Cycle-1 Foundation Closure) extends RegistryEntry schema with `entryKind` field (F-cycle-1-15/Q-cycle-1-4) + `amendmentProvenance` field (F-cycle-1-12); adds `readSystemState()` fourth read path supporting AP6.5 cross-framework consistency check (F-cycle-1-9/Q-cycle-1-3); registers spec as 7th entry (F-cycle-1-15); declares AmendmentLogEntry as typedef alias of substrate §4 A-16 AmendmentProvenance (F-cycle-1-3 audit fix).

---

## §1 Registry identity

| Field | Value |
|---|---|
| Name | Framework Registry |
| Kind | non-framework state store |
| Level | L2 |
| Version | v1.1 |
| Consumes | substrate-v1-1 (by reference, per HR1) |
| Consumed by | metaframework-v3.1 (HR5 write path); amendment-propagation (HR4 return path + AP6.5 readSystemState consumer per cycle-1 v1.1 F-cycle-1-9/Q-cycle-1-3); framework-audit (HR3 provenance lookup) |
| Authority | L0 confirmed (MF-Cycle-1 Foundation Closure delivery) |
| MA-G13 exemption basis | data-integrity invariants (not structural-transformation) per substrate §1.2 kind-of-invariants distinction |

**Self-audit omitted** — data-integrity state stores test themselves via IG-series, not axiom self-application. MA-V5 N/A for non-frameworks.

---

## §2 Record schema

### §2.1 RegistryEntry

```
RegistryEntry = {
  frameworkRef: FrameworkRef,
  generationProvenance: OriginProvenance | null,            // Renamed cycle-1 v1.1 from `GenerationProvenance` to substrate §4 A-05 OriginProvenance per F-cycle-1-12 (in-place rename; shape preserved). Null permitted only for grandfathered pre-MF artifacts.
  amendmentProvenance: AmendmentProvenance[],               // Added cycle-1 v1.1 per F-cycle-1-12; substrate §4 A-16. List, empty at origin, appended on each amendment via W3.
  currentLifecycleState: LifecycleState,
  amendmentLog: AmendmentLogEntry[],                        // Typedef alias of AmendmentProvenance[] per §2.4 (cycle-1 F-cycle-1-3 audit fix). Equivalent to amendmentProvenance; both names point to the same A-16 substrate atom shape.
  grandfathered: boolean,
  authorityClaim: AuthorityClaim,
  writeTimestamp: string,
  entryKind: 'framework' | 'spec'                           // Added cycle-1 v1.1 per F-cycle-1-15/Q-cycle-1-4. Distinguishes spec RegistryEntry rows from framework rows. A-10 Kind enum (substrate §4) untouched per Q-cycle-1-4 amended.
}
```

**Cycle-1 schema notes (F-cycle-1-12 + F-cycle-1-15):**
- A-05 in-place rename `ProvenanceRow` → `OriginProvenance` is shape-preserving per substrate §4.2 (only field-name semantic clarification). Existing OriginProvenance values on prior RegistryEntry rows remain valid.
- `amendmentProvenance` field is additive per MA-S7 (Schema-axis additive amendment, declared metaframework v3.2.4); existing RegistryEntry rows pre-cycle-1 carry empty list at first read post-cycle-1.
- `entryKind` field is additive per MA-S7; existing 6 framework rows default to `'framework'` at first read post-cycle-1; spec entry (§5 row 7) declared with `entryKind: 'spec'`.

**Cycle-1.5 invariants (added v1.2):**

- **RE1 — entryKind/grandfathered cross-field invariant.** For the canonical spec RegistryEntry row (`entryKind = 'spec'`), `grandfathered = true` (spec predates MF generation procedure; declared basis at §5). Future spec entries created cycle-2+ via MF generation procedure declare `grandfathered = false`. For all `entryKind = 'framework'` rows, `grandfathered` is independent (per-row declared basis at §5). Mechanical: per substrate §6.3 enum-membership + cross-field equality on the canonical row.
- **RE2 — Referential integrity of AmendmentLogEntry.target.** For every `AmendmentLogEntry` instance written post-cycle-1.5 v1.2 (when this invariant was declared), `target` value resolves to an existing RegistryEntry row's `frameworkRef` value. Forward-references prohibited. Pre-cycle-1.5-v1.2 AmendmentLogEntry rows are grandfathered (RE2 did not exist at the amendment event time; their `target` field reflects the registry state as of the amendment event time, not current state). RE2 binds AmendmentLogEntry instances whose amendment event occurs post-cycle-1.5 v1.2. Mechanical: per substrate §6.3 reference-resolution class; enumerate AmendmentLogEntry instances whose amendment event occurs post-cycle-1.5 v1.2, verify each `target` ∈ {row.frameworkRef | row ∈ §5}.

### §2.2 OriginProvenance (cycle-1 v1.1: in-place rename from `GenerationProvenance` per F-cycle-1-12)

OriginProvenance shape declared at substrate §4 A-05 (in-place rename cycle-1; shape unchanged). Consumed by reference; not redeclared here per substrate S1 single-source rule.

For local readability, the shape is reproduced inline (declarative restatement, not a redeclaration):

```
OriginProvenance = {
  fieldPath: string,                  // for registry consumption: fieldPath = '<frameworkRef>.generationProvenance'
  derivedFromStep?: string,           // generation-procedure step ref OR null at bootstrap-grandfathered entries
  judgmentId?: JudgmentId,
  derivedFromSubstrate?: string       // substrate §-ref OR null
  // Pre-cycle-1 GenerationProvenance fields (`generatedByMetaframework`, `generationProcedureRef`,
  // `generationTimestamp`, `sourceInputRef`) collapse into the canonical OriginProvenance schema:
  // - generatedByMetaframework / generationProcedureRef → derivedFromStep (FrameworkRef-encoded step ref)
  // - generationTimestamp → carried at writeTimestamp on the parent RegistryEntry per §2.1
  // - sourceInputRef → derivedFromSubstrate or derivedFromStep per actual provenance source
  // Existing grandfathered RegistryEntry rows (currently 6) carry generationProvenance = null per §8.4 IG4.
}
```

Exactly one of the three `derivedFrom*` fields populated per row. Null permitted only for grandfathered pre-MF artifacts (with explicit grandfathering basis recorded at §5 row).

### §2.3 LifecycleState

```
LifecycleState = 'declared' | 'applied' | 'terminated' | 'deprecated'
```

### §2.4 AmendmentLogEntry (typedef alias of substrate §4 A-16 AmendmentProvenance, cycle-1 v1.1 per F-cycle-1-3 audit fix)

```
// Cycle-1 v1.1: AmendmentLogEntry is a typedef alias of substrate §4 A-16 AmendmentProvenance.
// Single-source declaration at substrate (A-16); registry declares the alias for backward-readability.
// All 14 prior AmendmentLogEntry citation sites (registry 9, AP 3, framework-audit 2) remain valid;
// alias resolves to A-16 transparently. Zero citation sweep required per F-cycle-1-3 audit fix.

AmendmentLogEntry = AmendmentProvenance
```

Equivalent shape (per substrate §4 A-16):
```
AmendmentLogEntry = {
  amendmentId: string,
  fieldPath: string,
  amendedAt: string,
  prevValueRef?: string,
  basis: string,
  amendmentTrigger: 'vision' | 'gap' | 'L0-directive' | 'first-run'   // cycle-1 enum extension per F-cycle-1-6/F-cycle-1-11
}
```

Pre-cycle-1 AmendmentLogEntry shape (`amendmentId`, `amendmentTrigger`, `versionFrom`, `versionTo`, `amendmentTimestamp`, `authorityClaim`) maps to A-16 fields: `amendmentId` → `amendmentId`; `amendmentTrigger` → `amendmentTrigger`; `versionFrom`/`versionTo` carried at parent RegistryEntry.frameworkRef.version per write transition; `amendmentTimestamp` → `amendedAt`; `authorityClaim` carried at parent RegistryEntry.authorityClaim per W1. Pre-cycle-1 AmendmentLogEntry rows in §5.1 remain valid (alias resolves; field-mapping is type-equivalent under MA-S7 additive).

### §2.5 SystemStateSnapshot (cycle-1 v1.1 per F-cycle-1-9/Q-cycle-1-3)

Output shape of `readSystemState()` (declared §4.2). Aggregate registry-state view supporting cross-framework consistency check at amendment-propagation §3.3 AP6.5 (per F-cycle-1-10).

```
SystemStateSnapshot = {
  entries: RegistryEntry[],                   // all registered artifacts (currently 7 post-cycle-1: 6 frameworks + spec)
  aggregateCounts: {
    frameworkCount: number,                   // entries with entryKind = 'framework'
    specCount: number,                        // entries with entryKind = 'spec'
    activeAmendments: number                  // sum across entries of (amendmentProvenance.length where currentLifecycleState ≠ 'terminated' and ≠ 'deprecated')
  },
  snapshotTimestamp: string                   // ISO 8601 at snapshot generation
}
```

Mechanical implementation per §4.2: read all RegistryEntries, aggregate counts via entryKind partitioning + amendmentProvenance length sum, populate snapshot. Single mechanical operation per substrate §6.3 (cardinality + reference resolution); composition pushed to registry, not L0. Per metaframework G12 boundary: L0 confirms snapshot disposition; no longer composes from per-framework reads.

### §2.6 Consumed types

From substrate-v1-1 by reference (no redeclaration):
- `FrameworkRef` (substrate §4 A-09)
- `Semver` (substrate §7)
- `AuthorityClaim` (substrate §5)
- `OriginProvenance` (substrate §4 A-05; in-place rename cycle-1 per F-cycle-1-12)
- `AmendmentProvenance` (substrate §4 A-16; added cycle-1 per F-cycle-1-12)

---

## §3 Write discipline

- **W1.** All writes require `AuthorityClaim` per substrate §13 activation flow. Writes without AuthorityClaim rejected.
- **W2.** Writes are append-only. No overwrites. No deletes.
- **W3.** Amendment to an existing RegistryEntry produces a new `AmendmentLogEntry` appended to `amendmentLog[]`. Fields `currentLifecycleState` and `versionTo` update to reflect the amendment. Prior field values on the RegistryEntry remain retrievable through the amendment log.
- **W4.** Atomicity: single-entry writes atomic per substrate §13.4. Multi-entry writes (e.g., amendment-propagation touching N frameworks) are a sequence of atomic writes, not a single transaction.
- **W5.** Concurrent write resolution: serialization per substrate §13.5 registry-lock protocol.
- **W6.** L0 unavailability: write suspends; state persists; resumes per substrate §13.6.

---

## §4 Read discipline

Four declared read paths (cycle-1 v1.1 added `readSystemState()` per F-cycle-1-9/Q-cycle-1-3 — fourth read path supporting AP6.5 cross-framework consistency check). Reads are non-blocking, not lock-gated. Stale reads permitted under write concurrency; read consumers declare their own staleness tolerance.

### §4.1 Read paths

- By `FrameworkRef` (primary key): returns a single `RegistryEntry`.
- By `LifecycleState`: returns `RegistryEntry[]` filtered by state.
- By generation-provenance: returns `RegistryEntry[]` filtered by `OriginProvenance.derivedFromStep` field (renamed from `generatedByMetaframework` / `generationProcedureRef` per cycle-1 F-cycle-1-12 in-place rename).
- *(cycle-1 v1.1)* `readSystemState()`: returns `SystemStateSnapshot` (§2.5) — aggregate view over all RegistryEntries with entryKind partitioning + amendmentProvenance counting. Supports amendment-propagation §3.3 AP6.5 cross-framework consistency check (F-cycle-1-10).

### §4.2 Query interface (function signatures)

```
readByFrameworkRef(ref: FrameworkRef): RegistryEntry | null
readByLifecycleState(state: LifecycleState): RegistryEntry[]
readByProvenance(metaframeworkRef?: FrameworkRef, procedureRef?: FrameworkRef): RegistryEntry[]
readSystemState(): SystemStateSnapshot                                 // added cycle-1 v1.1 per F-cycle-1-9/Q-cycle-1-3
```

`readByProvenance` signature preserved (legacy field names accepted as input; resolves to OriginProvenance.derivedFromStep at read time).

`readSystemState()` is mechanical per substrate §6.3: enumerate all RegistryEntries (cardinality + reference-resolution classes); partition by `entryKind`; sum `amendmentProvenance.length` filtered by `currentLifecycleState ∉ {terminated, deprecated}`; assemble SystemStateSnapshot per §2.5 with current ISO 8601 timestamp.

Runtime implementation deferred per Phase 9c scope guard. Signatures only at this delivery.

---

## §5 Current entries

**Bootstrap-event write executed at Phase 9h terminal cross-file gate (2026-04-23T00:00:00Z). Cycle-1 v1.1 (2026-04-29) extends entries with `entryKind` field (defaults to `'framework'` for all 6 pre-existing rows) and adds spec entry as 7th row (per F-cycle-1-15/Q-cycle-1-4 — spec is the canonical declared text from which metaframework renders; classified as `kind: 'Protocol'` per spec §3.11 rationale; A-10 enum untouched per Q-cycle-1-4 amended). Cycle-1.5 v1.2 (2026-04-29) brought rows to v3.2.5 cycle-1.5 versions (deferred at cycle-1.5 delivery; closed as cycle-1.5 self-amendment gap by cycle-1.6). Cycle-1.6 v1.3 (2026-04-29) brought rows to v3.2.6 cycle-1.6 versions per identifier-discipline-corrective closure. Cycle-2 v1.4 (2026-04-30) brings rows to v3.2.7 cycle-2 versions per spec↔referent alignment closure.**

| frameworkRef | entryKind | kind (A-10) | generationProvenance (OriginProvenance) | currentLifecycleState | amendmentLog (recent) | grandfathered | writeTimestamp |
|---|---|---|---|---|---|---|---|
| substrate-v1.6 | framework | Substrate | null (L0 hand-authored; bootstrap substrate) | applied | [v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| framework-registry-v1.4 | framework | State-store | null (L0 hand-authored; bootstrap state store) | applied | [v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| metaframework-v3.2.7 | framework | Framework | null (L0 hand-authored + Phase 1.2/1.2-fix/hygiene amendments + v3.2.3 + cycle-1 v3.2.4 + cycle-1.5 v3.2.5 + cycle-1.6 v3.2.6 + cycle-2 v3.2.7; bootstrap framework) | applied | [v3.2.3; v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| generation-procedure-v1.1.6 | framework | Framework | null at bootstrap (no prior metaframework pre-bootstrap); post-bootstrap amendments per Phase 1.2-fix/hygiene/v3.2.3/cycle-1 v1.1.3/cycle-1.5 v1.1.4/cycle-1.6 v1.1.5/cycle-2 v1.1.6 | applied | [v3.2.3; v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| framework-audit-v1.3.6 | framework | Framework | null at bootstrap; post-bootstrap amendments per Phase 1.2-fix/hygiene/v3.2.3/cycle-1 v1.3.3/cycle-1.5 v1.3.4/cycle-1.6 v1.3.5/cycle-2 v1.3.6 | applied | [v3.2.3; v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| amendment-propagation-v1.3.3 | framework | Framework | null at bootstrap; post-bootstrap amendments per Phase 1.2-fix/v3.2.3/cycle-1 v1.3/cycle-1.5 v1.3.1/cycle-1.6 v1.3.2/cycle-2 v1.3.3 | applied | [v3.2.3; v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-23T00:00:00Z |
| metaframework-spec-v3.2.7 | spec | Protocol | null (cycle-1 v1.1 first registration of spec per F-cycle-1-15/Q-cycle-1-4; spec was 7th tracked artifact pre-cycle-1 but absent from RegistryEntry table) | applied | [v3.2.4-cycle-1; v3.2.5-cycle-1.5; v3.2.6-cycle-1.6; v3.2.7-cycle-2 entries; see §5.1] | true | 2026-04-29T00:00:00Z |

**Per F-cycle-1-15 / Q-cycle-1-4 closure (cycle-1 v1.1):**
- Spec row added; resolves "spec is 7th tracked artifact but absent from RegistryEntry table" gap.
- `entryKind` column added (additive per MA-S7); pre-existing 6 rows default to `'framework'`; spec row declares `'spec'`.
- Spec `kind: 'Protocol'` per spec §3.11 rationale: A-10 enum is `'Framework' | 'State-store' | 'Protocol' | 'Substrate'`; spec is declared rule set governing how metaframework renders → fits Protocol semantics. `'Substrate'` would mis-classify spec as substrate-tier; new kinds would extend A-10, contradicting Q-cycle-1-4 (A-10 untouched).

**Bootstrap-event integrity:** MA-L7 non-re-entrancy holds. Single bootstrap write; subsequent amendments proceed via declared procedure (amendment-propagation HR-AP3 emit) not via re-bootstrap.

### §5.1 Cycle AmendmentLogEntries

#### v3.2.3 cycle (preserved)

Single AmendmentLogEntry appended to `amendmentLog[]` field of metaframework, generation-procedure, framework-audit, amendment-propagation, and spec RegistryEntries per registry §2.4 + W3 + Finding 2 disposition (per-entry append, honoring §2.1 schema).

```
AmendmentLogEntry = {
  amendmentId: 'v3.2.3-declaration-tier-additive',
  amendmentTrigger: 'gap',
  versionFrom: 'v3.2.1',
  versionTo: 'v3.2.3',
  amendmentTimestamp: '2026-04-27T00:00:00Z',
  authorityClaim: {
    level: 'L0',
    source: 'L0-confirmation',
    target: ['metaframework-v3.2.3', 'generation-procedure-v1.1.2', 'framework-audit-v1.3.2', 'amendment-propagation-v1.2', 'v3-1-spec-v3.2.3']
  }
}
```

**v3.2.3 cycle scope:** 28 axioms + 28 paired gates + 4 J-inputs + 1 GR-series rule set added. Substrate v1.2 unchanged. Per AP §5.7 single-batched cycle; one AmendmentEvent processed.

#### v3.2.4 cycle-1 (MF-Cycle-1 Foundation Closure, added cycle-1 v1.1)

Single AmendmentLogEntry appended to `amendmentProvenance[]` field of substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation, and spec RegistryEntries per registry §2.4 + W3.

```
AmendmentLogEntry = {                                       // alias of substrate §4 A-16 AmendmentProvenance
  amendmentId: 'v3.2.4-mf-cycle-1-foundation-closure',
  fieldPath: '<frameworkRef>.amendmentProvenance',
  amendedAt: '2026-04-29T00:00:00Z',
  prevValueRef: 'pre-cycle-1 RegistryEntry rows per §5 (6 framework rows; spec absent)',
  basis: 'MF-Cycle-1 Foundation Closure spec rev-2 (15 friction findings F-cycle-1-1..F-cycle-1-15 + Cluster E hygiene + 3 MF-amendment-1 carries closed-by-rebuild per Q-cycle-1-1 + Q-cycle-1-2/Q-cycle-1-3/Q-cycle-1-4 resolutions). Foundation friction closed before Cycle 2 (referent layer) entry.',
  amendmentTrigger: 'gap',
  authorityClaim: {                                         // carried at parent RegistryEntry per W1; reproduced for traceability
    level: 'L0',
    source: 'L0-confirmation',
    target: [
      'substrate-v1.3', 'framework-registry-v1.1',
      'metaframework-v3.2.4', 'generation-procedure-v1.1.3',
      'framework-audit-v1.3.3', 'amendment-propagation-v1.3',
      'metaframework-spec-v3.2.4'
    ]
  }
}
```

**Cycle-1 scope:** 2 axioms (MA-S7 Schema, MA-V11 Validity) + 2 paired gates (G-S7, G-V11); 3 atom additions + 1 in-place rename at substrate (A-15 GateIdSet, A-16 AmendmentProvenance, A-17 EmptyPrimitiveDeclaration; A-05 ProvenanceRow → OriginProvenance); 1 substrate rule pair added (S4 binary truth-value, S5 filename opacity); 1 lifecycle event declared (metaframework §5.X first-run-execution); 1 procedure step added (amendment-propagation AP6.5 cross-framework consistency); RegistryEntry schema extended with `entryKind` field + `amendmentProvenance` field; spec registered as 7th RegistryEntry per F-cycle-1-15/Q-cycle-1-4. Counts: substrate atoms 14→17; metaframework axioms 64→66; framework-tier gates 80→82; total all-gates 84→86; AP procedure steps 7→8. Per AP §5.7 single-batched cycle; one AmendmentEvent processed under MA-S7 additive.

#### v3.2.5 cycle-1.5 (MF-Cycle-1.5 Identifier Discipline Closure, added cycle-1.6 v1.3 — closes cycle-1.5 self-amendment gap)

Single AmendmentLogEntry appended to `amendmentProvenance[]` field of substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation, and spec RegistryEntries per registry §2.4 + W3. Block written at cycle-1.6 in fulfillment of the cycle-1.5 self-amendment gap (cycle-1.5 installed identifier discipline but did not self-amend the registry).

```
AmendmentLogEntry = {                                       // alias of substrate §4 A-16 AmendmentProvenance
  amendmentId: 'v3.2.5-mf-cycle-1-5-identifier-discipline-closure',
  fieldPath: '<frameworkRef>.amendmentProvenance',
  amendedAt: '2026-04-29T00:00:00Z',
  prevValueRef: 'pre-cycle-1.5 RegistryEntry rows per §5 (post-cycle-1 v1.1 state: 7 rows at cycle-1 versions)',
  basis: 'MF-Cycle-1.5 Identifier Discipline Closure: substrate v1.3→v1.4 (S6 identifier naming function + SG5 paired gate + §1.5 canonical kind registry); A-17 primitiveKind genericized to PrimitiveKindRef; identifier sweep across §1–§16 substrate body; gate count 4→5, all-gates 86→87, framework-tier 82 unchanged. Cluster D MA-S7 + MA-V11 amendments single-mechanical-condition tightening + vacuous-pass clause.',
  amendmentTrigger: 'gap',
  authorityClaim: {                                         // carried at parent RegistryEntry per W1; reproduced for traceability
    level: 'L0',
    source: 'L0-confirmation',
    target: [
      'substrate-v1.4', 'framework-registry-v1.2',
      'metaframework-v3.2.5', 'generation-procedure-v1.1.4',
      'framework-audit-v1.3.4', 'amendment-propagation-v1.3.1',
      'metaframework-spec-v3.2.5'
    ]
  }
}
```

**Cycle-1.5 scope:** 1 substrate rule added (S6 identifier naming function); 1 substrate gate added (SG5 paired with S6); §1.5 canonical kind registry added; A-17 `primitiveKind` field genericized to `PrimitiveKindRef` reference type (shape-preserving per MA-S7); identifier sweep across substrate body; MA-S7 single-mechanical-condition tightening (subset-with-type-stability per AxR2); MA-V11 vacuous-pass clause (empty `applicability='n/a'` set vacuously satisfied per substrate §6.3 cardinality semantics). Counts: substrate atoms 17→17 (shape-preserving); substrate rules S5→S6; substrate gates 4→5; total all-gates 86→87; framework-tier 82 unchanged. Per AP §5.7 single-batched cycle; one AmendmentEvent processed under MA-S7 additive.

#### v3.2.6 cycle-1.6 (MF-Cycle-1.6 Identifier Discipline Corrective)

Single AmendmentLogEntry appended to `amendmentProvenance[]` field of substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation, and spec RegistryEntries per registry §2.4 + W3.

```
AmendmentLogEntry = {                                       // alias of substrate §4 A-16 AmendmentProvenance
  amendmentId: 'v3.2.6-mf-cycle-1-6-identifier-discipline-corrective',
  fieldPath: '<frameworkRef>.amendmentProvenance',
  amendedAt: '2026-04-29T00:00:00Z',
  prevValueRef: 'pre-cycle-1.6 RegistryEntry rows per §5 (post-cycle-1.5 v1.2 state: 7 rows at cycle-1 versions; cycle-1.5 self-amendment gap unclosed)',
  basis: 'MF-Cycle-1.6 Identifier Discipline Corrective: §1.5 R-row Loci amended (phase-1-1-resolution locus added; F-row Loci extended with phase-1-2/cycle-1-6/future cycles; locus-ID table additions); §4.1 sweep applied across 116 occurrences of F-phase-1-1-A-NN in 7 canonical files (16 atom / 14 finding kept / 86 resolution per classification table); §4.2 F-1.2 sweep (4 sites F-1.2-NN → F-phase-1-2-NN); §4.3 cascade extended to 15 sites for substrate gate count 4→5 propagation (12 spec-listed + 3 additional via comprehensive grep per L0 directive); §4.4 registry self-amendment (entries table to cycle-1.6 versions; v3.2.5 + v3.2.6 AmendmentLogEntry blocks added; RE2 amended with grandfathering clause); §4.5 SG5 first-run executed as exit gate.',
  amendmentTrigger: 'gap',
  authorityClaim: {                                         // carried at parent RegistryEntry per W1; reproduced for traceability
    level: 'L0',
    source: 'L0-confirmation',
    target: [
      'substrate-v1.5', 'framework-registry-v1.3',
      'metaframework-v3.2.6', 'generation-procedure-v1.1.5',
      'framework-audit-v1.3.5', 'amendment-propagation-v1.3.2',
      'metaframework-spec-v3.2.6'
    ]
  }
}
```

**Cycle-1.6 scope:** §1.5 amended (R-row Loci adds phase-1-1-resolution; F-row Loci extends; locus-ID table additions; bare-form rule clarified); 116-occurrence sweep classified and applied (16 substrate atoms bare A-NN; 14 Phase 1.1 findings kept F-phase-1-1-A-NN; 86 Phase 1.1 resolutions R-phase-1-1-resolution-NN); F-1.2-NN renamed F-phase-1-2-NN (4 sites); SG1–SG4 → SG1–SG5 cascade and total 86 → 87 propagation across 15 sites; registry §5 entries table to cycle-1.6 versions; §5.1 v3.2.5 cycle-1.5 + v3.2.6 cycle-1.6 AmendmentLogEntry blocks; RE2 grandfathering clause amended. Counts: no substrate atom / axiom / gate count changes (cycle-1.6 is corrective; counts unchanged from cycle-1.5: atoms 17, rules S6, substrate gates 5, framework-tier gates 82, total all-gates 87). Per AP §5.7 single-batched cycle; one AmendmentEvent processed under MA-S7 additive (terminology + reference-form amendments are shape-preserving per MA-S7).

#### v3.2.7 cycle-2 (MF-Cycle-2 Spec↔Referent Alignment Closure, added cycle-2 v1.4)

Single AmendmentLogEntry appended to `amendmentProvenance[]` field of substrate, registry, metaframework, generation-procedure, framework-audit, amendment-propagation, and spec RegistryEntries per registry §2.4 + W3.

```
AmendmentLogEntry = {                                       // alias of substrate §4 A-16 AmendmentProvenance
  amendmentId: 'v3.2.7-mf-cycle-2-spec-referent-alignment-closure',
  fieldPath: '<frameworkRef>.amendmentProvenance',
  amendedAt: '2026-04-30T00:00:00Z',
  prevValueRef: 'pre-cycle-2 RegistryEntry rows per §5 (post-cycle-1.6 v1.3 state: 7 rows at cycle-1.6 versions)',
  basis: 'MF-Cycle-2 Spec↔Referent Alignment Closure: closes the three uncovered cells (Categorical, Schema, Lifecycle) of the spec↔referent column with one column-coherent amendment. Substrate v1.5→v1.6: 3 new atoms (A-18 ReferentCitation with inline ExpectedShape sub-shape + ReferentResolver interface, A-19 ReferentAlignmentState, A-20 ReferentSnapshot); §1.5 cycle-2 locus row added. Metaframework v3.2.6→v3.2.7: MA-S7 predicate tightened in-place to recursive `≼` (governs discriminated-union sub-shapes; A-18.ExpectedShape is the first such sub-shape; cycle-1 atom set re-validated zero-regression); MA-V10 + G-V10 (Validity, spec↔referent Categorical alignment); MA-S8 + G-S8 (Schema, ReferentCitation declaration shape conformance); MA-L11 + G-L11 (Lifecycle, audit-run snapshot stamping); §2.2 GeneratedFrameworkTemplate `schema:` block extended with `referentCitations: ReferentCitation[]` field per L0 ratification on cycle-2 §13 item 3 (extend `schema:` placement). Framework-audit v1.3.5→v1.3.6: §2.1 AuditRequest `referentSnapshotRef?` + §5.9 AuditRunRecord `referentSnapshotRef` + `referentAlignmentStatesRef` + §8.1 SelfAuditRecord `referentAlignmentStates` (4-site schema cluster); §4.8.2.4 G-S7 predicate amended in-place (recursive `≼`); §4.8.2.5 G-S8 + §4.8.4.6 G-V10 + §4.8.5.4 G-L11 paired-gate predicates authored. Amendment-propagation v1.3.2→v1.3.3: §3.5 drift-disposition flow declared per spec §3.6 (closes outer loop on cycle-1 G9 finding; drift state propagates as AmendmentEvent of kind `gap`; routing to referent owner per L0 ratification on cycle-2 §13 item 1; citation-update fallback when G-S8 fails). Counts: substrate atoms 17→20; metaframework axioms 66→69 (Schema 7→8, Validity 10→11, Lifecycle 10→11); framework-tier gates 82→85; total all-gates 87→90; substrate gates SG1–SG5 unchanged at 5.',
  amendmentTrigger: 'gap',
  authorityClaim: {                                         // carried at parent RegistryEntry per W1; reproduced for traceability
    level: 'L0',
    source: 'L0-confirmation',
    target: [
      'substrate-v1.6', 'framework-registry-v1.4',
      'metaframework-v3.2.7', 'generation-procedure-v1.1.6',
      'framework-audit-v1.3.6', 'amendment-propagation-v1.3.3',
      'metaframework-spec-v3.2.7'
    ]
  }
}
```

**Cycle-2 scope:** 3 new atoms (A-18 ReferentCitation with inline ExpectedShape sub-shape + ReferentResolver interface, A-19 ReferentAlignmentState, A-20 ReferentSnapshot); 3 new axioms (MA-V10 Validity, MA-S8 Schema, MA-L11 Lifecycle) + 3 paired gates (G-V10, G-S8, G-L11); MA-S7 predicate tightened in-place to recursive `≼` + G-S7 predicate amended in-place to evaluate the recursive relation; 4 schema-field amendment sites (metaframework §2.2 GeneratedFrameworkTemplate.schema.referentCitations + framework-audit §2.1 AuditRequest.referentSnapshotRef + §5.9 AuditRunRecord.referentSnapshotRef + .referentAlignmentStatesRef + §8.1 SelfAuditRecord.referentAlignmentStates); drift-disposition flow declared at amendment-propagation §3.5; substrate §1.5 cycle-2 locus row added. G-V10 first-run scheduled against Cognitive v1.2.2 per cycle-2 spec §11.1; G-V10 second-run target selected by L0 at cycle-2 step 10. Counts: substrate atoms 17→20; metaframework axioms 66→69; framework-tier gates 82→85; total all-gates 87→90; AP procedure steps unchanged at 8 (drift-disposition is a routing rule expressed as procedural prose, not a new step). Per AP §5.7 single-batched cycle; one AmendmentEvent processed under MA-S7 (recursive scope) additive.

---

## §6 Provenance index

Query-optimized mirror of §5 for generation-provenance lookup. Derived view, not authoritative. Refreshed on §5 write.

### §6.1 Index views

- **By metaframework version:** groups `RegistryEntry[]` per `generatedByMetaframework` value.
- **By generation-procedure version:** groups `RegistryEntry[]` per `generationProcedureRef` value.

### §6.2 Grandfathered exclusion

Grandfathered entries (null generation-provenance) excluded from both index views.

### §6.3 Current contents

Empty at Phase 9c delivery (mirrors empty §5).

---

## §7 Lifecycle state index

Query-optimized mirror of §5 for state lookup. Derived view, not authoritative. Refreshed on §5 write.

### §7.1 Index buckets

Four buckets, one per `LifecycleState` enum value:

- `declared`
- `applied`
- `terminated`
- `deprecated`

### §7.2 Current contents

All four buckets empty at Phase 9c delivery (mirrors empty §5).

---

## §8 Integrity gates

Five gates declared. Kind: data-integrity per MA-G13 distinction. Naming: IG-series. All mechanical. No judgment inputs.

### §8.1 IG1 — AuthorityClaim-signed writes

Every write declares an `AuthorityClaim` conforming to substrate §5 shape. Writes without AuthorityClaim rejected.

### §8.2 IG2 — Append-only

No overwrite, no delete. Existing `RegistryEntry` may append `AmendmentLogEntry`; existing fields on prior entries immutable.

### §8.3 IG3 — FrameworkRef uniqueness

Per `frameworkRef = {id, version}` tuple, exactly one `RegistryEntry`. Re-registering existing `{id, version}` rejected (use amendment instead).

### §8.4 IG4 — Generation-provenance required unless grandfathered

Every `RegistryEntry` with `grandfathered: false` requires non-null `generationProvenance` field (typed `OriginProvenance` per substrate §4 A-05; cycle-1 v1.1 in-place rename per F-cycle-1-12). Grandfathered entries permit null generationProvenance.

### §8.5 IG5 — Lifecycle state ∈ enum

`currentLifecycleState` ∈ `LifecycleState` enum. Out-of-enum values rejected.

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9c delivery | Initial registry declaration (§1–§8). Non-framework state store. Consumes substrate-v1-1. IG1–IG5 declared. §5/§6/§7 empty pending bootstrap. | L0 |
| v1.0 (content) | Phase 9h delivery | Bootstrap-event write at 2026-04-23T00:00:00Z: §5 Current entries populated with 6 framework rows (substrate-v1.2, framework-registry-v1.0, metaframework-v3.2.1, generation-procedure-v1.1.1, framework-audit-v1.3.1, amendment-propagation-v1.1); all `grandfathered: true`; all `currentLifecycleState: applied`. MA-L7 non-re-entrancy invariant held. No schema amendment; data-only write per §3 Write discipline + IG1-IG5. Version unchanged — registry schema is v1.0 at Phase 9c; content populated at 9h is the first data transition. | L0 |
| v1.0 (content) | Phase v3.2.3 delivery (2026-04-27) | Single-batched amendment cycle landed: AmendmentLogEntry appended to `amendmentLog[]` field of metaframework, generation-procedure, framework-audit, amendment-propagation, spec entries per W3. §5 table extended with `amendmentLog (recent)` column. §5.1 cycle AmendmentLogEntry rendered. Versions advanced: metaframework v3.2.1→v3.2.3, generation-procedure v1.1.1→v1.1.2, framework-audit v1.3.1→v1.3.2, amendment-propagation v1.1→v1.2, spec v3.2.1→v3.2.3. IG1–IG5 integrity: pass (AuthorityClaim signed; append-only honored; FrameworkRef updates per amendment path not re-registration; generation-provenance unchanged grandfathered=true; lifecycle state unchanged). Registry schema v1.0 unchanged. | L0 |
| v1.1 | MF-Cycle-1 Foundation Closure (2026-04-29) | Schema amendment per F-cycle-1-9, F-cycle-1-12, F-cycle-1-15, F-cycle-1-3 audit fix. **§2.1 RegistryEntry shape extended:** added `entryKind: 'framework' | 'spec'` field per F-cycle-1-15/Q-cycle-1-4 (resolves "spec is 7th tracked artifact but absent from RegistryEntry table" gap; A-10 Kind enum untouched per Q-cycle-1-4 amended); added `amendmentProvenance: AmendmentProvenance[]` field per F-cycle-1-12 (two-tier provenance separation; substrate §4 A-16); `generationProvenance` field type updated from local `GenerationProvenance` to substrate §4 A-05 `OriginProvenance | null` (in-place rename per F-cycle-1-12; shape preserved). **§2.2 OriginProvenance** declared inline as substrate-reference; pre-cycle-1 GenerationProvenance fields collapsed into canonical OriginProvenance schema with field-mapping documentation. **§2.4 AmendmentLogEntry** declared as typedef alias of substrate §4 A-16 AmendmentProvenance per F-cycle-1-3 audit fix (zero citation sweep required — single-source declared at substrate). **§2.5 SystemStateSnapshot** new typed shape declared per F-cycle-1-9/Q-cycle-1-3 (output of `readSystemState()`). **§4 read discipline** extended: fourth read path `readSystemState(): SystemStateSnapshot` added (mechanical aggregate per substrate §6.3; supports AP6.5 cross-framework consistency check at amendment-propagation v1.3 per F-cycle-1-10). **§5 current entries** extended: `entryKind` column added (defaults to `'framework'` for 6 pre-existing rows; spec row added as 7th entry with `entryKind: 'spec'` and `kind: 'Protocol'` per spec §3.11 rationale); versions advanced (substrate v1.2→v1.3, registry v1.0→v1.1, metaframework v3.2.3→v3.2.4, generation-procedure v1.1.2→v1.1.3, framework-audit v1.3.2→v1.3.3, amendment-propagation v1.2→v1.3, spec v3.2.3→v3.2.4). **§5.1** v3.2.4 cycle-1 AmendmentLogEntry rendered alongside preserved v3.2.3 entry. §8.4 IG4 narrative refers to OriginProvenance. IG1–IG5 integrity: pass (AuthorityClaim signed; append-only honored — 7th row append; FrameworkRef updates per amendment path; generation-provenance unchanged grandfathered=true; lifecycle state unchanged; entryKind enum well-formed). Schema amendment is additive per MA-S7 (Schema-axis additive amendment, declared metaframework v3.2.4 cycle-1; G-S7 verifies). | L0 |
| v1.2 | MF-Cycle-1.5 Identifier Discipline Closure (2026-04-29) | Schema invariants added per audit gaps. **§2.1 RE1** declared (entryKind/grandfathered cross-field invariant: spec row `entryKind='spec' ∧ grandfathered=true`; future spec entries cycle-2+ declare `grandfathered=false`). **§2.1 RE2** declared (referential integrity: every AmendmentLogEntry.target resolves to an existing RegistryEntry frameworkRef; forward-references prohibited). Identifier sweep applied: every multi-locus identifier in canonical S6 form (declarations and citations alike) per substrate v1.4 §1.5. Additive per MA-S7. | L0 |
| v1.3 | MF-Cycle-1.6 Identifier Discipline Corrective (2026-04-29) | Self-amendment closure for cycle-1.5 omissions. **§5 entries table** advanced to cycle-1.6 versions (substrate v1.4→v1.5, registry v1.2→v1.3, metaframework v3.2.5→v3.2.6, generation-procedure v1.1.4→v1.1.5, framework-audit v1.3.4→v1.3.5, amendment-propagation v1.3.1→v1.3.2, spec v3.2.5→v3.2.6); cycle-1.5 entries-table omission closed simultaneously by including v3.2.5 cycle-1.5 AmendmentLogEntry block at §5.1. **§5.1** v3.2.5 cycle-1.5 AmendmentLogEntry block added (closes cycle-1.5 self-amendment gap; RE2-grandfathered per amendment-event time pre-RE2-declaration); v3.2.6 cycle-1.6 AmendmentLogEntry block added (RE2-bound; targets resolve to current §5). **§2.1 RE2 amended** with grandfathering clause keyed on amendment-event time, not block-write time: pre-cycle-1.5-v1.2 amendment-event AmendmentLogEntry rows grandfathered with target-fields reflecting amendment-event-time registry state; RE2 binds AmendmentLogEntry instances whose amendment event occurs post-cycle-1.5 v1.2 (Block 5 v3.2.6 cycle-1.6 is first RE2-binding block). Identifier-sweep companion: 8 registry body sites swept per substrate §1.5 amended (Phase 1.1 references reclassified — atom shape A-NN bare, finding F-phase-1-1-A-NN kept, resolution R-phase-1-1-resolution-NN). IG1–IG5 integrity: pass (AuthorityClaim signed; append-only honored — block 4 + block 5 appends; entryKind enum well-formed; lifecycle state unchanged). RE1 + RE2 integrity: pass (RE2 amended, mechanical verification yields block 5 RE2-bound with all 7 targets resolving; blocks 1–4 grandfathered). Additive per MA-S7. | L0 |
| v1.4 | MF-Cycle-2 Spec↔Referent Alignment Closure (2026-04-30) | **§5 entries table** advanced to cycle-2 versions (substrate v1.5→v1.6, registry v1.3→v1.4, metaframework v3.2.6→v3.2.7, generation-procedure v1.1.5→v1.1.6, framework-audit v1.3.5→v1.3.6, amendment-propagation v1.3.2→v1.3.3, spec v3.2.6→v3.2.7); 7-row append per amendmentProvenance update path. **§5.1** v3.2.7 cycle-2 AmendmentLogEntry block added (RE2-bound; all 7 targets resolve to current §5 row set); narrates the substrate↔referent column closure in scope basis: 3 new substrate atoms (A-18 ReferentCitation + A-19 ReferentAlignmentState + A-20 ReferentSnapshot) + 3 new metaframework axioms with paired gates (MA-V10/G-V10 Validity, MA-S8/G-S8 Schema, MA-L11/G-L11 Lifecycle) + MA-S7 predicate tightening to recursive `≼` (governs A-18.ExpectedShape discriminated-union sub-shape) + 4-site framework-audit schema-field cluster + amendment-propagation §3.5 drift-disposition flow. Counts: substrate atoms 17→20; metaframework axioms 66→69; framework-tier gates 82→85; total all-gates 87→90. IG1–IG5 integrity: pass (AuthorityClaim signed by L0; append-only honored — block 6 append at §5.1; FrameworkRef updates per amendment path; generationProvenance unchanged grandfathered=true; lifecycle state unchanged; entryKind enum well-formed). RE1 + RE2 integrity: pass (RE2 binds block 6; all 7 targets in `target` array resolve to existing RegistryEntry frameworkRef post-§5-table-update). Additive per MA-S7 (recursive scope per metaframework v3.2.7 §3.2.1 amendment); G-S7 (amended) verifies. | L0 |

---

## End of framework-registry-v1-0
