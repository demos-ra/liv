# framework-registry-v1-0

**Kind:** non-framework (state store)
**Version:** v1.0
**Authority:** L0 confirmed (Phase 9c delivery)
**Consumes:** substrate-v1-1 (by reference, per HR1)
**Consumed by:** metaframework-v3.1 (HR5 write path), amendment-propagation (HR4 return path), framework-audit (HR3 provenance lookup)
**Dependencies:** substrate-v1-1 only
**Versioning discipline:** additive only

Registry is the state store of per-framework provenance, lifecycle, and amendment history. It is not a framework: its invariants are data-integrity (write-once, consistency, uniqueness, referential integrity) per substrate §1.2 kind-of-invariants distinction. MA-G13 framework test does not apply; registry is classified as non-framework state store on this declared basis.

---

## §1 Registry identity

| Field | Value |
|---|---|
| Name | Framework Registry |
| Kind | non-framework state store |
| Level | L2 |
| Version | v1.0 |
| Consumes | substrate-v1-1 (by reference, per HR1) |
| Consumed by | metaframework-v3.1 (HR5 write path); amendment-propagation (HR4 return path); framework-audit (HR3 provenance lookup) |
| Authority | L0 confirmed |
| MA-G13 exemption basis | data-integrity invariants (not structural-transformation) per substrate §1.2 kind-of-invariants distinction |

**Self-audit omitted** — data-integrity state stores test themselves via IG-series, not axiom self-application. MA-V5 N/A for non-frameworks.

---

## §2 Record schema

### §2.1 RegistryEntry

```
RegistryEntry = {
  frameworkRef: FrameworkRef,
  generationProvenance: GenerationProvenance,
  currentLifecycleState: LifecycleState,
  amendmentLog: AmendmentLogEntry[],
  grandfathered: boolean,
  authorityClaim: AuthorityClaim,
  writeTimestamp: string
}
```

### §2.2 GenerationProvenance

```
GenerationProvenance = {
  generatedByMetaframework: FrameworkRef | null,   // null if grandfathered
  generationProcedureRef: FrameworkRef | null,
  generationTimestamp: string | null,
  sourceInputRef: string | null                    // reference-only per spec A-20 resolution
}
```

### §2.3 LifecycleState

```
LifecycleState = 'declared' | 'applied' | 'terminated' | 'deprecated'
```

### §2.4 AmendmentLogEntry

```
AmendmentLogEntry = {
  amendmentId: string,
  amendmentTrigger: 'vision' | 'gap' | 'L0-directive',
  versionFrom: Semver,
  versionTo: Semver,
  amendmentTimestamp: string,
  authorityClaim: AuthorityClaim
}
```

### §2.5 Consumed types

From substrate-v1-1 by reference (no redeclaration):
- `FrameworkRef` (substrate §4)
- `Semver` (substrate §7)
- `AuthorityClaim` (substrate §5)

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

Three declared read paths. Reads are non-blocking, not lock-gated. Stale reads permitted under write concurrency; read consumers declare their own staleness tolerance.

### §4.1 Read paths

- By `FrameworkRef` (primary key): returns a single `RegistryEntry`.
- By `LifecycleState`: returns `RegistryEntry[]` filtered by state.
- By generation-provenance: returns `RegistryEntry[]` filtered by `generatedByMetaframework` OR `generationProcedureRef`.

### §4.2 Query interface (function signatures)

```
readByFrameworkRef(ref: FrameworkRef): RegistryEntry | null
readByLifecycleState(state: LifecycleState): RegistryEntry[]
readByProvenance(metaframeworkRef?: FrameworkRef, procedureRef?: FrameworkRef): RegistryEntry[]
```

Runtime implementation deferred per Phase 9c scope guard. Signatures only at this delivery.

---

## §5 Current entries

**Bootstrap-event write executed at Phase 9h terminal cross-file gate (2026-04-23T00:00:00Z). Pre-bootstrap: empty. Post-bootstrap: entries below per substrate §14.5 non-re-entrancy.**

| frameworkRef | generationProvenance | currentLifecycleState | amendmentLog (recent) | grandfathered | writeTimestamp |
|---|---|---|---|---|---|
| substrate-v1.2 | null (L0 hand-authored; bootstrap substrate) | applied | [] | true | 2026-04-23T00:00:00Z |
| framework-registry-v1.0 | null (L0 hand-authored; bootstrap state store) | applied | [] | true | 2026-04-23T00:00:00Z |
| metaframework-v3.2.3 | null (L0 hand-authored + Phase 1.2/1.2-fix/hygiene amendments + v3.2.3; bootstrap framework) | applied | [v3.2.3-cycle entry; see §5.1] | true | 2026-04-23T00:00:00Z |
| generation-procedure-v1.1.2 | null at bootstrap (no prior metaframework pre-bootstrap); post-bootstrap amendments per Phase 1.2-fix/hygiene/v3.2.3 | applied | [v3.2.3-cycle entry; see §5.1] | true | 2026-04-23T00:00:00Z |
| framework-audit-v1.3.2 | null at bootstrap; post-bootstrap amendments per Phase 1.2-fix/hygiene/v3.2.3 | applied | [v3.2.3-cycle entry; see §5.1] | true | 2026-04-23T00:00:00Z |
| amendment-propagation-v1.2 | null at bootstrap; post-bootstrap amendments per Phase 1.2-fix/v3.2.3 | applied | [v3.2.3-cycle entry; see §5.1] | true | 2026-04-23T00:00:00Z |

**Bootstrap-event integrity:** MA-L7 non-re-entrancy holds. Single bootstrap write; subsequent amendments will proceed via declared procedure (amendment-propagation HR-AP3 emit) not via re-bootstrap.

### §5.1 v3.2.3 cycle AmendmentLogEntry

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

**Cycle scope:** 28 axioms + 28 paired gates + 4 J-inputs + 1 GR-series rule set added. Substrate v1.2 unchanged. Per AP §5.7 single-batched cycle; one AmendmentEvent processed.

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

Every `RegistryEntry` with `grandfathered: false` requires non-null `generationProvenance` fields. Grandfathered entries permit null generation-provenance.

### §8.5 IG5 — Lifecycle state ∈ enum

`currentLifecycleState` ∈ `LifecycleState` enum. Out-of-enum values rejected.

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | Phase 9c delivery | Initial registry declaration (§1–§8). Non-framework state store. Consumes substrate-v1-1. IG1–IG5 declared. §5/§6/§7 empty pending bootstrap. | L0 |
| v1.0 (content) | Phase 9h delivery | Bootstrap-event write at 2026-04-23T00:00:00Z: §5 Current entries populated with 6 framework rows (substrate-v1.2, framework-registry-v1.0, metaframework-v3.2.1, generation-procedure-v1.1.1, framework-audit-v1.3.1, amendment-propagation-v1.1); all `grandfathered: true`; all `currentLifecycleState: applied`. MA-L7 non-re-entrancy invariant held. No schema amendment; data-only write per §3 Write discipline + IG1-IG5. Version unchanged — registry schema is v1.0 at Phase 9c; content populated at 9h is the first data transition. | L0 |
| v1.0 (content) | Phase v3.2.3 delivery (2026-04-27) | Single-batched amendment cycle landed: AmendmentLogEntry appended to `amendmentLog[]` field of metaframework, generation-procedure, framework-audit, amendment-propagation, spec entries per W3. §5 table extended with `amendmentLog (recent)` column. §5.1 cycle AmendmentLogEntry rendered. Versions advanced: metaframework v3.2.1→v3.2.3, generation-procedure v1.1.1→v1.1.2, framework-audit v1.3.1→v1.3.2, amendment-propagation v1.1→v1.2, spec v3.2.1→v3.2.3. IG1–IG5 integrity: pass (AuthorityClaim signed; append-only honored; FrameworkRef updates per amendment path not re-registration; generation-provenance unchanged grandfathered=true; lifecycle state unchanged). Registry schema v1.0 unchanged. | L0 |

---

## End of framework-registry-v1-0
