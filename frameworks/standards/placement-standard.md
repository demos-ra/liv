---
kind: framework
placement: frameworks/standards/
---

# placement-standard-v1-0

**Kind:** Framework
**Level:** L3
**Mode:** structural (known → structured)
**Instance of:** `GeneratedFrameworkTemplate` (metaframework-v3-1 §2.2)
**Rendered by:** generation-procedure-v1-0 v1.1.6 under metaframework-v3-1 v3.2.7
**Cross-framework input:** none (registry is build-time substrate; no AS carrier emission required at v1.0)

This file is a `GeneratedFrameworkTemplate` instance per metaframework-v3-1 §2.2 output schema. Every section heading below populates the corresponding GeneratedFrameworkTemplate top-level field (identity, schema, structure, validity, lifecycle, coupling, judgment, plus change log, self-audit, and provenance per v3-1-spec §4.4 file-specific placement).

Placement Standard is the L3 structural-mode framework owning cross-tree placement of LIV-shaped items in the LIV repository. Placement Standard structures `known → structured` work — taking the implicit placement convention scattered across path strings, banner comments, and prose references, and structuring it into a single declared registry consulted by every placement-aware consumer (code, validators, prose). It is **mode-symmetric L3 framework sibling to LIV-Standard** (same domain owner: code structure inside src/) and to **Plan v2.2 / VS v1.0 / RS v1.0** (other L3 mode-primitive framework siblings), but composes orthogonally with LIV-Standard: LIV-Standard governs how typed runtime is organized inside `src/`; Placement Standard governs where every LIV-shaped item lives in the tree.

Placement Standard is **distinct from LIV-Standard at L3**: LIV-Standard governs R-layer organization within slice subtrees in `src/`. Placement Standard governs cross-tree placement of governance documents (`frameworks/`), cycle records (`sprint-records/`), runtime entry points required at convention-determined locations (root `middleware.ts`, root `next.config.ts`, `migrations/`, `public/`), and slice subtrees themselves (`src/features/F-<id>/`). Different concern, non-overlapping: LIV-Standard owns inside-slice; Placement Standard owns where-slice-and-everything-else-lives. See §1 scopeOut.

The framework's genesis is **self-applying**: placement-standard.md itself is the first declared entry in the PLACEMENT_REGISTRY. The framework declares its own canonical placement at `frameworks/standards/placement-standard.md`, and the registry consulted by `la-validator` (per Sprint Shot 5) verifies that the file is at that location. This self-reference pattern is structurally consistent with the metaframework's own self-application precedent (metaframework declares itself per substrate §14 bootstrap).

---

## §1 Identity

| Field | Value |
|---|---|
| `name` | `Placement Standard` |
| `kind` | `Framework` (per substrate §4 A-10 `Kind` enum; consumed by reference; string-typed) |
| `mode` | `structural` (per substrate §2 Mode enum; `known → structured`) |
| `level` | `L3` (per substrate §5 AuthorityLevel; consumed by reference) |
| `version` | `1.0` (per substrate §7 Semver) |
| `ownershipTemplate` | `Human` (per substrate §4 A-11 Ownership enum; consumed by reference; L0 authors) |
| `ownershipApplied` | `System-under-L0` (per substrate §4 A-11 Ownership enum) |
| `stateTemplate` | `declared` (per substrate §9 LifecycleState; consumed by reference) |
| `stateApplied` | `declared` (initial; transitions to `applied` on first la-validator §1.20.1 enforcement run post-L0-confirmation; Sprint Shot 5 deploys the validator extension consuming the registry) |
| `genesis` | see §1.1 GenesisDeclaration below |
| `carrier` | `self` (per substrate §9 Carrier enum; emits its own artifact — the `PLACEMENT_REGISTRY` constant — at build time; consumed at validation time. **No AS carriage at v1.0**: the registry is build-time substrate, not a runtime-emitted artifact, and AS carriage would over-couple to emission machinery for what is essentially a typed constant. AS carriage may be revisited at v1.1 if runtime placement queries surface a need for replay/audit semantics.) |
| `primitive` | `placement-declaration` (framework-local atomic unit; defined §3.7 Vocabulary; distinct from VS `predicate-evaluation`, RS `investigation-step`, Plan `declaration`) |
| `consumes` | inventoried items at sprint-placement-framework Shot 1 (ratified inventory of LIV-shaped items requiring cross-tree placement); substrate atoms (FrameworkRef, Semver, Result) |
| `produces` | `PlacementRecord[]` aggregated as `PLACEMENT_REGISTRY` (R5 constant); consumed by la-validator §1.20.1, code consumers consulting registry per PL-A2, banner-emission per Decision-D (a) |
| `consumedBy` | la-validator (§1.20.1 enforcement at Sprint Shot 5), code consumers (`src/core/constants/perimeter-standard.ts` `LIV_INSTANCE_PERIMETER_SITE_REF`, `src/features/F-identity/exec/execution-check.ts` known-meta-files list, banner-emitting code at ~17 sites per Sprint Shot 3 touch surface, framework-audit (G-V10/G-S8/G-L11 surface when placement-standard declares ReferentCitations in subsequent versions) |
| `adjacentFrameworks` | LIV-Standard (R-layer governance inside `src/`; orthogonal composition partner — Placement Standard owns cross-tree, LIV-Standard owns inside-slice); Manual v11.2 (declares Placement Standard as the inhabitant of the placement-governing-framework slot per Sprint Shot 6 amendment) |
| `referentCitations` | `[]` (empty array per MF v3.2.7 §2.2 `GeneratedFrameworkTemplate.schema.referentCitations: ReferentCitation[]` slot; default for frameworks declaring zero spec↔referent citations per substrate §10.1 S4 + MA-V11 vacuous-pass clause. **Precedent: Verification Standard v1.0 §1 Identity + Research Standard v1.0 §1 Identity** establish the pattern for new L3 frameworks at first ratification with zero code referents. At v1.0 the field is empty: G-V10 evaluates `applicability='n/a'` with basis 'zero ReferentCitation declarations at v1.0; promotion scheduled at first la-validator §1.20.1 enforcement cycle when registry consultation surfaces become first-class referents — Sprint Shot 5 adds the validator extension, but referent-citation declarations remain deferred until registry consumers stabilize post-Shot 7 deploy.' — vacuous-pass per MA-V11. G-S8 / G-L11 likewise vacuous-pass.) |
| `scopeOut` | `['internal R-layer organization within slice subtrees (owned by LIV-Standard; Placement Standard governs cross-tree placement, not inside-slice layout)', 'build-config placement determined by external convention (Next.js root requirements: middleware.ts, next.config.ts, eslint.config.mjs, postcss.config.mjs, package.json, tsconfig.json — these have register-only entries in the registry per PL-A5, but their placement is convention-mandated and outside framework authority)', 'platform-tooling placement determined by external convention (migrations/, scripts/, public/ — same pattern as build-config: register-only entries, placement convention-mandated)', 'runtime emission of placement queries (no runtime emission at v1.0; registry is build-time substrate consulted at validation and code-emission time)', 'gitignored cycle records (.deploy-records/ pre-cycle treatment is L0 ratification per Sprint Shot 1 DD-1; future ratification cycles per Manual amendment path)', 'liv-scaffold/ contents (deferred per sprint spec §1.3; logged but unregistered at v1.0)', '.githooks/ convention relocation (deferred per sprint spec §1.3; current LIV-Standard placement at src/features/F-la-config/exec/hooks/ preserved with non-default placement marker)', 'recursive descent into slice-internal placement decisions (owned by LIV-Standard R-layer rules; Placement Standard guarantees cross-tree placement only — see §3.6 PL-A5 + §6.11 boundary notes)', 'B-direction symmetric re-derivation at B3 (post-beta)']` |

### §1.1 GenesisDeclaration

Per substrate §4 A-14 + framework-audit X8 (consumed by reference; string-typed):

```
genesis = {
  origin: 'derived-from-metaframework-v3-1-via-generation-procedure-v1-0',
  parentFrameworkRef: { id: 'metaframework', version: '3.2.7' },
  generationProcedureRef: { id: 'generation-procedure', version: '1.1.6' },
  generationCycle: 'sprint-placement-framework-shot-2-PL-v1-0-genesis',
  confirmedAt: 'pending-L0-confirmation',
  predecessorVersion: null
}
```

**Bootstrap status:** `bootstrapped: false` per A-14 (PL v1.0 is a fresh L3 framework, not a v0 lift; no predecessor). No prior placement-governing framework existed in the LIV system; cross-tree placement was implicit-and-distributed via path strings, banner comments, and prose references. This framework codifies what was previously distributed-and-undeclared.

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
| MA-I7 | Identity declarations are mutually consistent (Mode + Kind + Level alignment: structural-mode + Framework-kind + L3 is a valid triple per substrate §2.4 + §1.5 canonical kind registry, matching VS v1.0 + RS v1.0 + Plan v2.2 sibling pattern). |

---

## §2 Schema

### §2.1 Input — `PlacementClaim`

Per MA-S1 (input is W-ATOM). Shape:

```
PlacementClaim = {
  itemId:        PlacementId          // unique identifier within registry; e.g. 'manual', 'placement_standard', 'perimeter_site'
  itemKind:      PlacementItemKind    // 'framework' | 'cycle-record' | 'typed-runtime-projectroot' | 'build-config' | 'platform-tooling'
  proposedHome:  string               // proposed canonical filesystem path relative to repo root
  rationale:     string               // declared structural reason for placement (ratified at Sprint Shot 1 inventory, fed into PL-A1 single-declaration)
}
```

`PlacementId` is a branded string (registry-unique); `PlacementItemKind` is the framework-local enum derived from sprint spec §3 Shot 1 taxonomy.

Every field traces to declared source in §6.5 Custody table. Typed shape declared in `src/core/types/placement-standard.types.ts` (R5).

### §2.2 Output — `PlacementRecord`

Per MA-S2 (output is W-ATOM since carrier ≠ none — carrier is `self`, which emits its own typed atom). Shape:

```
PlacementRecord = {
  itemId:        PlacementId
  itemKind:      PlacementItemKind
  home:          string               // ratified canonical filesystem path relative to repo root
  registryVersion: PlacementVersion   // version of PLACEMENT_REGISTRY at write time per PL-A3
  declaredAt:    string               // ISO 8601 timestamp at first registration
}
```

Aggregated as `PLACEMENT_REGISTRY: { [itemId: PlacementId]: PlacementRecord }` per spec §3 Shot 2 preview. Registry shape declared at R5 in `src/core/constants/placement-standard.ts`; emitted as a TypeScript `const`. Consumed by:
- la-validator §1.20.1 (Sprint Shot 5)
- Code consumers reading `PLACEMENT_REGISTRY[<identifier>].home` instead of hardcoding paths (Sprint Shot 3 refactor)
- Banner-emitting code per Decision-D (a) ratified at Sprint open (`// Canonical spec: PLACEMENT_REGISTRY.<identifier>` format)

### §2.3 Consumed types (from substrate-v1-1, by reference)

| Type | Home |
|---|---|
| `FrameworkRef` | substrate §4 A-09 |
| `Semver` | substrate §7 |
| `Result` | substrate-tier primitive (consumed via R5 primitives) |
| `AppError` | substrate-tier primitive (consumed via R5 primitives) |

No cross-framework atom consumption from L3 siblings at v1.0 (Plan/VS/RS atoms not consumed; LIV-Standard atoms not consumed — Placement Standard's domain is bounded per PL-A5).

### §2.4 Local atoms

Declared at point of use:

- `PlacementId` — §3.7 Vocabulary; branded string identifier within registry.
- `PlacementVersion` — §3.7 Vocabulary; Semver-pattern string for registry versioning per PL-A3.
- `PlacementItemKind` — §3.7 Vocabulary; enum over sprint §3 Shot 1 taxonomy.
- `PlacementClaim` — §2.1.
- `PlacementRecord` — §2.2.
- `PlacementRegistry` — §2.2; aggregate map type.

### §2.5 Schema rules (ScR-series)

Per metaframework-v3-1 §2.5 (by reference to v3-1-spec §3.3). No placement-standard-local ScR additions.

### §2.6 Custody table

Full custody table in §6.4 Coupling. Summary pointer only here per single-source-via-reference (R-phase-1-1-resolution-08).

---

## §3 Structure

### §3.1 Axes

Placement Standard inherits metaframework-v3-1's seven-axis decomposition (Identity, Schema, Structure, Validity, Lifecycle, Coupling, Judgment). Per substrate §1.3 SI-03 permitted-multi-execution: axes are declared once (metaframework) and consumed at multiple sites. Placement Standard does not redeclare.

Per v3-1-spec §4.4 file-specific placement, Placement Standard's own structural content is the six-axiom set declared at §3.3 below plus the `PLACEMENT_REGISTRY` runtime substrate declared at §3.4.

### §3.2 Primitive instance counts

Per substrate §8 + §8.6 empty-declaration derivation (positive-declaration markers per substrate §4 A-17):

| Primitive | Count | Basis |
|---|---|---|
| P1 Axis | 0 | `{primitiveKind: 'P1', instanceCount: 0, basis: "axes inherited from metaframework-v3-1 §3.1; placement-standard declares no own axes"}` |
| P2 Sub-axis | 0 | `{primitiveKind: 'P2', instanceCount: 0, basis: "flat axis structure inherited from metaframework; no sub-axes declared at placement-standard level"}` |
| P3 Leaf | 0 | `{primitiveKind: 'P3', instanceCount: 0, basis: "leaves inherited via axes from metaframework"}` |
| P4 Axiom | 6 own + 69 inherited | 6 own axioms PL-A1..PL-A6 declared §3.3; 69 inherited from metaframework-v3-1 §3.2 (post-cycle-2 v3.2.7) |
| P5 Gate | 6 own + 85 inherited | 6 own gates G-PL1..G-PL6 declared §4.2 (1:1 paired with PL-A1..PL-A6 per G-M1); 85 inherited framework-tier gates from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` derived from substrate §4 A-15) |
| P6 Handoff rule | 3 own | HR-PL1 (substrate atom consumption), HR-PL2 (registry → la-validator), HR-PL3 (registry → code consumers); declared §6.2 |
| P7 Judgment input | 0 | `{primitiveKind: 'P7', instanceCount: 0, basis: "structural mode — placement-standard's six axioms are fully mechanical per substrate §6.3 ground classes (PL-A1: cardinality + reference-resolution; PL-A2: structural property + reference-resolution; PL-A3: type-check; PL-A4: reference-resolution; PL-A5: enum-membership; PL-A6: cardinality). No non-mechanical derivation required at framework declaration tier. MA-J4 emptyDeclared satisfied."}` |
| P8 Procedure step | 0 | `{primitiveKind: 'P8', instanceCount: 0, basis: "structural mode — placement-standard is structural, not generative. P8 is conditional per substrate §8.3 (Mode = generative only). For non-generative frameworks P8 is absent, not empty. Marker declared for traceability per PR1; framework-audit X10 stage discipline N/A per substrate §8.3 conditional declaration."}` |

Positive empty-declaration markers per substrate §8.6 + atom A-17 for P1, P2, P3, P7, P8 zero counts. Implicit-absence disallowed; zero-state declared.

### §3.3 Axiom declarations (PL-A1 .. PL-A6)

Six own axioms, distributed across MFv3 axes per AxR1 (every axiom binds to exactly one axis or is universal/substrate-declared). All mechanical per AxR2 (one mechanical condition stated directly). All additive per AxR3. All in declarative form per AxR4.

| Axiom ID | Axis binding | Mechanical condition |
|---|---|---|
| PL-A1 | Schema | Self-declaration: each LIV-shaped artifact is the authoritative declaration of its own kind and placement; every artifact declares `kind` and `placement` inline (YAML frontmatter for MD; `// @kind` + `// @placement` comments for TS/MJS/SH; `# @kind` + `# @placement` for shell/gitignore). |
| PL-A2 | Validity | Filesystem authority: filesystem is authoritative for position; declared placement must match actual filesystem location of the declaring file. Drift = mismatch between declared and observed. |
| PL-A3 | Lifecycle | Domain-bounded declaration: declared `kind` must be a member of `PlacementItemKind` enum (`'framework' | 'cycle-record' | 'typed-runtime-projectroot' | 'build-config' | 'platform-tooling'`); declarations with kind values outside the enum are violations. |
| PL-A4 | Lifecycle | Amendment propagation: additions or changes to inline declarations follow `amendment-propagation-v1-0` AmendmentEvent flow (per substrate §4 A-12 ActivationTrigger + amendment-propagation §3.3 AP1–AP7+AP6.5 procedure). |
| PL-A5 | Identity | Domain-bounded scope: Placement Standard governs cross-tree placement of LIV-shaped items only; inside-slice placement (within `src/features/F-*/`) is governed by LIV-Standard; items not meeting any PlacementItemKind definition are out of scope. |
| PL-A6 | Schema | Self-declaration is additive: adding a kind+placement declaration to an existing file requires no other amendment; the declaration is complete at the file boundary. |

#### §3.3.1 Per-axiom AxR conformance

**PL-A1 (Schema). Sprint 9 Shot 1 inverted form.**
- AxR1: binds Schema axis ✓ (typed-shape discipline on inline declaration fields).
- AxR2: one mechanical condition (structural property: every LIV-shaped artifact has inline kind+placement declaration fields; substrate §6.3 structural property class) ✓.
- AxR3: additive ✓ (adding declarations to existing files leaves other declarations stable).
- AxR4: declarative ✓ ("each artifact declares its own kind and placement").

**PL-A2 (Validity). Sprint 9 Shot 1 inverted form.**
- AxR1: binds Validity axis ✓ (verification surface: what counts as a valid placement — declared matches observed).
- AxR2: one mechanical condition (structural property: declared placement string matches actual directory of the declaring file per filesystem observation; substrate §6.3 structural property + reference-resolution classes) ✓.
- AxR3: additive ✓ (new files comply by adding declarations; drift on existing files is caught at next validator run).
- AxR4: declarative ✓.

**PL-A3 (Lifecycle). Sprint 9 Shot 1 inverted form.**
- AxR1: binds Lifecycle axis ✓ (domain/scope concern at declaration site).
- AxR2: one mechanical condition (enum-membership: declared kind value ∈ PlacementItemKind enum literal set; substrate §6.3 enum-membership class) ✓.
- AxR3: additive ✓ (PlacementItemKind extends additively per PR2 if new kinds emerge).
- AxR4: declarative ✓.

**PL-A4 (Lifecycle). Unchanged.**
- AxR1: binds Lifecycle axis ✓ (amendment concern).
- AxR2: one mechanical condition (reference-resolution: declaration additions/changes resolve to declared AmendmentEvent in amendment-propagation §3.3 AP1 input; substrate §6.3 reference-resolution class) ✓.
- AxR3: additive ✓.
- AxR4: declarative ✓.

**PL-A5 (Identity). Sprint 9 Shot 1 inverted form.**
- AxR1: binds Identity axis ✓ (scope/domain concern; complements §1 scopeOut declaration).
- AxR2: one mechanical condition (scope-boundary: LIV-Standard governs inside-slice; Placement Standard governs cross-tree; boundary is the slice root `src/features/F-*/`; substrate §6.3 structural property class) ✓.
- AxR3: additive ✓.
- AxR4: declarative ✓.

**PL-A6 (Schema). Sprint 9 Shot 1 inverted form.**
- AxR1: binds Schema axis ✓ (additive-only discipline on declaration sites).
- AxR2: one mechanical condition (additive: adding a declaration to an existing file produces no side-effect amendment obligations on other files; substrate §6.3 cardinality class — declaration count per file = 1) ✓.
- AxR3: additive ✓.
- AxR4: declarative ✓.

### §3.4 PLACEMENT_REGISTRY initial population (sourced from Sprint Shot 1 ratified inventory)

The registry's initial entry set is sourced from the L0-ratified Sprint Shot 1 inventory (`sprint-records/sprint-placement-framework/inventory-table.md`) under the ratified Decision-D resolutions (DD-1=(a), DD-2 confirmed, DD-3 ratified, DD-4 ratified, DD-5=(i)). Initial entry classes:

**Framework class** (relocate to `frameworks/`):
- `manual` → `frameworks/manual/liv-manual.md`
- `placement_standard` → `frameworks/standards/placement-standard.md` (self-application: the framework declares its own home; structurally consistent per §1 narrative + metaframework bootstrap precedent)
- `artifact_standard` → `frameworks/standards/artifact-standard.md`
- `design_standard` → `frameworks/standards/design-standard.md`
- `living_memory_standard` → `frameworks/standards/living-memory.md`
- `multi_instance_standard` → `frameworks/standards/multi-instance-standard.md`
- `plan_standard` → `frameworks/standards/plan-standard.md`
- `research_standard` → `frameworks/standards/research-standard.md`
- `verification_standard` → `frameworks/standards/verification-standard.md`

> **F-FORWARD-1** (DD-Resolution-1B ratified at Sprint Shot 3 dispatch): `liv-standard.md` and `perimeter-standard.md` do not exist as L3 governance documents at v1.0 ratification time (only typed runtime exists at `src/core/constants/liv-standard.ts` + `.types.ts`, plus 2 binding files at slice surfaces — these are LIV-Standard inside-slice items, out of Placement Standard scope per PL-A5). Registry omits both governance entries per natural-defer rule (§1.21). Forward sprint: author both as L3 framework declarations following placement-standard's MFv3 generation-procedure pattern; subsequent registry amendment via amendment-propagation §3.3 AmendmentEvent flow per PL-A4.

- `standards_collective_slice` → `frameworks/standards/SLICE.md` (per Sprint Shot 1 DD-3 ratification: SLICE.md flatten-and-rename pattern; standards-collective SLICE.md retains SLICE.md naming since it's a collective-level marker, not a slice-identity marker)
- `metaframework_spec` → `frameworks/metaframework/spec/metaframework.md` (per Sprint Shot 1 DD-4 ratification: rename from `v3-1-spec.md`; version moves to registry per PL-A3)
- `metaframework_manifest` → `frameworks/metaframework/MANIFEST.md`
- `mf_amendment_propagation` → `frameworks/metaframework/frameworks/amendment-propagation-v1-0.md`
- `mf_framework_audit` → `frameworks/metaframework/frameworks/framework-audit-v1-2.md`
- `mf_framework_registry` → `frameworks/metaframework/frameworks/framework-registry-v1-0.md`
- `mf_generation_procedure` → `frameworks/metaframework/frameworks/generation-procedure-v1-0.md`
- `mf_metaframework` → `frameworks/metaframework/frameworks/metaframework-v3-1.md`
- `mf_substrate` → `frameworks/metaframework/frameworks/substrate-v1-1.md`
- 9 MF reports → `frameworks/metaframework/reports/<filename>.md` (entries: `mf_report_amendment_1_audit`, `mf_report_amendment_1_delivery`, `mf_report_patch_1_delivery`, `mf_report_phase_1_2_fix_trail_hygiene`, `mf_report_phase_9h_g_u1_first_run`, `mf_report_phase_9h_ap_self_recursion`, `mf_report_phase_9h_cross_file_consistency`, `mf_report_phase_9h_terminal_delivery`, `mf_report_v3_2_3_delivery`)
- 9 SLICE.md files (per Sprint Shot 1 DD-3 ratification: flatten-and-rename pattern): `slice_F_artifact` → `frameworks/slices/F-artifact.md`, `slice_F_design_system` → `frameworks/slices/F-design-system.md`, `slice_F_discover` → `frameworks/slices/F-discover.md`, `slice_F_identity` → `frameworks/slices/F-identity.md`, `slice_F_memory` → `frameworks/slices/F-memory.md`, `slice_F_multi_instance` → `frameworks/slices/F-multi-instance.md`, `slice_F_plan` → `frameworks/slices/F-plan.md`, `slice_F_router` → `frameworks/slices/F-router.md`, `slice_F_verify` → `frameworks/slices/F-verify.md`

**Cycle-record class** (relocate to `sprint-records/`):
- `sprint_8_decisions_audit_patch` → `sprint-records/sprint-8-substrate-cutover/DECISIONS-audit-patch.md`
- `sprint_8_apply_deletions` → `sprint-records/sprint-8-substrate-cutover/apply-deletions.sh`
- `sprint_8_migration_016` → `sprint-records/sprint-8-substrate-cutover/deploy-notes/migration-016.md`
- `phase_5_manifest_01` → `sprint-records/phase-5/01-phase5-builds-1-3.MANIFEST.md` (per Sprint Shot 1 DD-1=(a) ratification: relocate from `.deploy-records/`, ungitignore, track)
- `phase_5_manifest_02` → `sprint-records/phase-5/02-phase5-builds-5.MANIFEST.md`
- `phase_5_manifest_03` → `sprint-records/phase-5/03-phase5-5.MANIFEST.md`

**Typed-runtime-projectroot class** (Next.js convention: root middleware):
- `perimeter_site` → `middleware.ts` (root; per Sprint Shot 1 R-T-06 closure: F-NEW1/F-NEW2 perimeter unitarity restoration; Sprint Shot 4 replaces broken auth-middleware re-export with Sprint 6 deploy bundle's getPerimeterSession content)

**Build-config class** (root by Next.js/npm/TypeScript/ESLint/PostCSS convention; PL-A5 register-only — placement convention-mandated):
- `gitignore` → `.gitignore`
- `readme` → `README.md`
- `eslint_config` → `eslint.config.mjs`
- `next_config` → `next.config.ts`
- `package_json` → `package.json`
- `package_lock_json` → `package-lock.json` (canonical lockfile per Sprint Shot 1 DD-2 resolution)
- `postcss_config` → `postcss.config.mjs`
- `tsconfig` → `tsconfig.json`

**Platform-tooling class** (convention-mandated; PL-A5 register-only):
- `migrations_dir` → `migrations/` (DB migration convention; consumed by `run-migrations.ts` by directory name)
- `public_dir` → `public/` (Next.js static asset serving convention)
- `scripts_dir` → `scripts/` (standalone scripts convention)

**Total v1.0 initial entries:** **54** (full enumeration in `src/core/constants/placement-standard.ts` per §3.5 R5 surface). Per-class breakdown: 36 framework, 6 cycle-record, 1 typed-runtime-projectroot, 8 build-config, 3 platform-tooling.

### §3.5 R5 surface declaration (per LIV-Standard cross-framework consumption)

Three R5 files comprise the framework's runtime substrate:

| Path | Role | Per LIV-Standard layer |
|---|---|---|
| `frameworks/standards/placement-standard.md` | Canonical governance document (this file) | Out-of-LIV-Standard-scope per Placement Standard's own §1 scopeOut; lives in `frameworks/` per its own registry entry `placement_standard` (self-application). |
| `src/core/types/placement-standard.types.ts` | R5 type atom declarations: `PlacementId`, `PlacementVersion`, `PlacementItemKind`, `PlacementClaim`, `PlacementRecord`, `PlacementRegistry`, axiom + gate ID types | LIV-Standard R5 (core/R5) |
| `src/core/constants/placement-standard.ts` | R5 constants: framework identity (`PLACEMENT_FRAMEWORK_ID`, `PLACEMENT_FRAMEWORK_VERSION`), axiom IDs (`PLACEMENT_AXIOM_IDS`), gate IDs (`PLACEMENT_AXIOM_GATE_IDS`), HR IDs (`PLACEMENT_HANDOFF_RULE_IDS`), enum literal sets, primitive instance counts, carrier declaration, cross-framework pins (metaframework, generation-procedure), the canonical `PLACEMENT_REGISTRY` constant | LIV-Standard R5 (core/R5) |

The TS files conform to LIV-Standard manifest banner format per `verification-standard.types.ts` + `multi-instance-standard.ts` exemplar precedent. Per Sprint Shot 3 banner-comment refactor (Decision-D (a) ratified at Sprint open), the canonical-spec banner uses registry-identifier form: `// Canonical spec: PLACEMENT_REGISTRY.placement_standard` rather than literal path. This is the framework practicing what it preaches.

### §3.6 Stage monotonicity and kind-alignment self-check

Per substrate §10.2 PR4 + PR5 + PG6 amended: **N/A at framework-tier** — Placement Standard is structural-mode, not generative-mode. P8 is absent (not empty) per substrate §8.3 conditional declaration ("Non-generative frameworks have no P8 instances. P8 is absent, not empty."). PR4 stage monotonicity and PR5 stage-content-kind alignment apply only to procedures (sets of P8 instances belonging to one operation). Placement Standard declares zero P8 instances per §3.2 row P8 with declared basis.

Framework-audit X10 extended predicate (stage declaration + PR4 monotonicity + PR5 alignment) evaluates `applicability='n/a'` with basis "structural-mode framework; P8 absent per substrate §8.3 conditional" per substrate §10.1 S4 + MA-V11 vacuous-pass clause.

### §3.7 Vocabulary (placement-standard-local)

Framework-local terms declared inline at point of use per PR1 (substrate §10.2). Substrate, metaframework, and registry terms referenced by identifier.

| Term | Declared | Definition |
|---|---|---|
| `PlacementId` | §2.4 | Branded string identifier; unique within `PLACEMENT_REGISTRY`. Format convention: snake_case (e.g., `placement_standard`, `perimeter_site`, `slice_F_identity`). |
| `PlacementVersion` | §2.4 | Semver-pattern string per substrate §7 conforming. Tracks `PLACEMENT_REGISTRY` version per PL-A3. |
| `PlacementItemKind` | §2.4 | Enum: `'framework' \| 'cycle-record' \| 'typed-runtime-projectroot' \| 'build-config' \| 'platform-tooling'`. Derived from sprint spec §3 Shot 1 taxonomy. |
| `PlacementClaim` | §2.1 | Input atom (proposed placement before ratification). |
| `PlacementRecord` | §2.2 | Output atom (ratified placement; written into registry). |
| `PlacementRegistry` | §2.2 | Aggregate map: `{ [itemId: PlacementId]: PlacementRecord }`. Concrete instance is the `PLACEMENT_REGISTRY` constant at `src/core/constants/placement-standard.ts`. |
| `placement-declaration` | §1 | Framework-local atomic primitive: one declaration of one item's canonical home. The unit of work the framework structures `known → structured`. |

---

## §4 Validity

### §4.1 Gate count

Placement Standard declares **6 own gates** (G-PL1..G-PL6, 1:1 paired with PL-A1..PL-A6 per G-M1) plus inherits **85 framework-tier gates** from metaframework-v3-1 §4.1 (per `MetaframeworkGateIdSet` derived from substrate §4 A-15).

| Category | Count | IDs |
|---|---|---|
| Own gates (placement-standard-specific) | 6 | G-PL1, G-PL2, G-PL3, G-PL4, G-PL5, G-PL6 |
| Inherited framework-tier gates | 85 | per metaframework-v3-1 §4.1 + `MetaframeworkGateIdSet` (substrate §4 A-15): PG1–PG7, axiom gates G-I1..G-I7, G-S1..G-S8, G-St1..G-St16, G-V1..G-V11, G-L1..G-L11, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1–G-U5, G-M1–G-M4. Substrate gates SG1–SG5 excluded per substrate §11.5 tier-1. |
| **Total applicable to placement-standard itself** | **91** | |

### §4.2 Own gates (1:1 paired with PL-A1..PL-A6 per G-M1)

#### §4.2.1 G-PL1 — Self-declaration (Sprint 9 Shot 1 inverted)

*Claim:* Every LIV-shaped artifact within la-validator walk scope has an inline kind+placement declaration (YAML frontmatter for MD; `// @kind` + `// @placement` for TS/MJS; `# @kind` + `# @placement` for SH/gitignore).

*Test (mechanical):* Walk `src/`, `frameworks/`, `sprint-records/` plus root-level in-scope files; for each file read self-declaration; report files with both fields absent as undeclared (notes — not hard-fail per Sprint 9 brief §A.2). Per substrate §6.3 structural property class.

*Reporting:* binary truthValue per substrate §10.1 S4 (`passed` iff zero kind-declared-but-placement-absent or placement-declared-but-kind-absent violations; `failed` with violating file logged); undeclared items reported as notes only.

*Tests:* PL-A1.

*Escalation path:* G-PL1 failure (partial declaration — one field present, other absent) → MA-L4 amendment trigger; remediation: complete declaration on flagged file.

#### §4.2.2 G-PL2 — Filesystem authority (Sprint 9 Shot 1 inverted)

*Claim:* Every file with a self-declared placement has a declared placement value that matches its actual filesystem directory.

*Test (mechanical):* Walk tree (same scope as G-PL1); for each file with a placement declaration, normalize declared placement string and compare to `path.relative(ROOT, path.dirname(filePath))`; report mismatch as violation. Per substrate §6.3 structural property + reference-resolution classes.

*Reporting:* binary truthValue per substrate §10.1 S4 (`passed` iff zero placement mismatches; `failed` with file + declared vs actual logged).

*Tests:* PL-A2.

*Escalation path:* G-PL2 failure → MA-L4 amendment trigger; offending file's declared placement does not match its location; remediation: correct declaration or move file. Implemented mechanically via la-validator check #6 (Sprint 9 Shot 1).

#### §4.2.3 G-PL3 — Domain-bounded declaration (Sprint 9 Shot 1 inverted)

*Claim:* Every file with a self-declared kind has a kind value that is a member of `PlacementItemKind` enum (`'framework' | 'cycle-record' | 'typed-runtime-projectroot' | 'build-config' | 'platform-tooling'`).

*Test (mechanical):* Walk tree (same scope as G-PL1); for each file with a kind declaration, check `kind ∈ PLACEMENT_ITEM_KIND_VALUES` literal set; report out-of-enum values as violations. Per substrate §6.3 enum-membership class.

*Reporting:* binary truthValue per substrate §10.1 S4 (`passed` iff zero out-of-enum kind values; `failed` with file + declared kind logged).

*Tests:* PL-A3.

*Escalation path:* G-PL3 failure → MA-L4 amendment trigger; either declared kind is a typo (correct it) or a new kind is needed (extend PlacementItemKind via PR2 additive amendment).

#### §4.2.4 G-PL4 — Amendment propagation

*Claim:* Registry mutations follow `amendment-propagation-v1-0` AmendmentEvent flow — every `PLACEMENT_REGISTRY` content change between version transitions has a corresponding AmendmentEvent in registry consumer history.

*Test (mechanical):* Enumerate diff between successive `PLACEMENT_REGISTRY` version-tagged states; per content delta, verify corresponding AmendmentEvent declared per amendment-propagation §3.3 AP1 input (sourceFrameworkRef = `placement-standard`, changedElements include the modified PlacementRecord(s)). Per substrate §6.3 reference-resolution class. **Until first-run** (Sprint Shot 7 deploy) this gate evaluates `applicability='applicable'`, `executionState='not-yet-run'`, `truthValue=null` per the substrate §10.1 S4 binary truth-value discipline; first-run scheduled at first registry mutation post-Shot 7 deploy per metaframework §5.X first-run-execution lifecycle event.

*Reporting:* binary truthValue per substrate §10.1 S4.

*Tests:* PL-A4.

*Escalation path:* G-PL4 failure → MA-L4 amendment trigger; registry mutation lacks declared AmendmentEvent; remediation re-runs at next audit cycle with proper AmendmentEvent emission.

#### §4.2.5 G-PL5 — Domain-bounded scope (Sprint 9 Shot 1 inverted)

*Claim:* Placement Standard governs cross-tree placement only; inside-slice placement (within `src/features/F-*/`) is governed by LIV-Standard. No file declares Placement Standard kind values for inside-slice placement items.

*Test (mechanical):* Walk tree; for any file under `src/features/F-*/` with a kind declaration, verify the declaration is within la-validator's defined scope (i.e., the file is itself a cross-tree item, not an inside-slice item). Inside-slice files with kind declarations are flagged as out-of-scope. Per substrate §6.3 structural property class. **Note:** at Sprint 9 Shot 1 the practical enforcement is that `src/features/` files do not carry kind+placement declarations — those declarations are on governance/config items only. Future: if a feature-slice file needs a placement declaration (e.g., it is also a framework artifact), escalate to L0.

*Reporting:* binary truthValue per substrate §10.1 S4.

*Tests:* PL-A5.

*Escalation path:* G-PL5 failure → MA-L4 amendment trigger; boundary enforcement between Placement Standard and LIV-Standard compromised; escalate to L0.

#### §4.2.6 G-PL6 — Additive declaration (Sprint 9 Shot 1 inverted)

*Claim:* Adding a kind+placement declaration to an existing file produces no required amendments on other files. Each declaration is self-contained at the file boundary.

*Test (mechanical):* Structural property: declaration format (YAML frontmatter block or comment lines) is confined to the declaring file; no cross-file ripple required. Per substrate §6.3 structural property class. Validator confirms: after adding a declaration to file F, zero other files require modification for the declaration to be valid (G-PL2 still passes, G-PL3 still passes). This gate is vacuously-pass for any correctly-formed declaration (PL-A6 is an additive discipline rule, not a runtime check).

*Reporting:* binary truthValue per substrate §10.1 S4; applicability='applicable'; evaluated structurally at framework authoring time rather than per-run.

*Tests:* PL-A6.

*Escalation path:* G-PL6 failure → MA-L4 amendment trigger; declaration format requires cross-file amendment (would violate additive discipline); remediation: revise declaration format to be self-contained.

### §4.3 Inherited framework-tier gates

Inherited per metaframework-v3-1 §4.1. Applied to placement-standard itself when framework-audit performs first-run audit per Sprint Shot 7 close + first system-wide audit cycle post-deploy.

Gate ID enumeration matches metaframework §4.7 (85 framework-tier gates):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S8, G-St1..G-St16, G-V1..G-V11, G-L1..G-L11, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §4.4 Gate execution

- **Self-application:** placement-standard executes inherited framework-tier gates + own G-PL1..G-PL6 against placement-standard itself per G-U1 self-application (first-run scheduled at Sprint Shot 7 close + first system-wide audit cycle post-deploy).
- **Audit by other instances:** per HR-PL2 emit (registry → la-validator at Sprint Shot 5). la-validator runs G-PL1..G-PL6 against PLACEMENT_REGISTRY per CI/build cycle; framework-audit runs the full inherited framework-tier set + dimension X1–X10 audit at first system-wide audit cycle.
- **MULTI-EXEC per substrate §1.3 SI-03:** G-PL2 has structural overlap with la-validator §1.20.1 enforcement (which extends LIV-Standard's R-layer enforcement to placement). Per SI-03 permitted-multi-execution: gate is declared once (here, at G-PL2), executed at multiple sites (la-validator at build-time CI, framework-audit at first-run audit cycle). No cross-framework ownership violation.

### §4.5 Meta-gate compliance

When audited (by self-application or by another instance), placement-standard is subject to metaframework's meta-gates G-M1–G-M4:
- **G-M1** (axiom-gate 1:1 mapping) — 6 own axioms map 1:1 to 6 own gates per §4.2 declarations.
- **G-M2** (gate set exhaustive over axioms) — every PL-A* axiom has G-PL* paired gate ✓.
- **G-M3** (gate execution order respected) — G-PL* gates execute at framework-tier per substrate §11.5 tier-2; no cross-tier violations.
- **G-M4** (gate failure escalation path declared) — every G-PL* gate declares escalation path at §4.2 sub-sections per MA-L4.

### §4.6 Backward-invalidation

Per metaframework-v3-1 §4.5: G-M failure → universal gates re-run; substrate-tier failure terminal. Applies to placement-standard's audit results when placement-standard itself fails self-audit.

### §4.7 Current gate results

**All 6 own gates + 85 inherited framework-tier gates: state = `not-yet-run`.** First-run scheduled at Sprint Shot 7 close + first system-wide audit cycle post-deploy per metaframework §5.X first-run-execution lifecycle event (added cycle-1 per F-cycle-1-11). The la-validator §1.20.1 extension at Sprint Shot 5 will execute G-PL1, G-PL2, G-PL5, G-PL6 mechanically at every CI build post-deploy; G-PL3 (versioned identity) and G-PL4 (amendment propagation) first-run scheduled at first registry mutation event post-Shot 7.

Compact summary per sprint-mode + metaframework §4.7 pattern.

---

## §5 Lifecycle

### §5.1 Version transition

v1.0 — initial declaration. Additive per MA-L1.

### §5.2 Amendment trigger

Gap-driven per MA-L4. Amendment paths to placement-standard:
- New PlacementItemKind enum value required (e.g., new tree-class emerges) → MA-L4 amendment + version bump per AxR3 (PL-A5 enum extends additively per PR2).
- New registry entry added (e.g., new framework/standard authored, new sprint-records subdirectory established) → registry mutation + AmendmentEvent per PL-A4 (no framework version bump for registry-data mutation; registryVersion bumps independently per PL-A3).
- Schema amendment to PlacementClaim, PlacementRecord, or PlacementRegistry shape → MA-L4 amendment + framework version bump + MA-S7 recursive `≼` verification.
- Modification to any PL-A* axiom → MA-L4 amendment + version bump + AxR conformance re-verification.
- Modification to any G-PL* gate → MA-L4 amendment + version bump + G-V9 (gate-rule GR-1..GR-6 conformance) re-verification.

All amendments require:
- Amendment rationale (gap or L0 directive).
- Sprint cycle dispatch per Manager Playbook §1.7.
- Re-run of G-PL1..G-PL6 against amended state.
- Registry amendment log entry per framework-registry-v1-0 §2.4.
- AmendmentEvent emission per amendment-propagation §3.3 AP1 input (per PL-A4).

### §5.3 Confirmation gate

L0 confirms at Sprint Shot 2 close per Sprint Spec §3 Shot 2 close gate ("framework declared, gates pass against registry, MFv3 generation procedure complete, L0 ratifies framework declaration"). Monotonic per MA-L3 (confirmation once given is not retracted; future amendment requires new confirmation cycle).

### §5.4 Escalation state

`{status: 'none', gap: null, requiredMode: null}` at delivery.

### §5.5 Judgment deprecations

Empty at delivery. No J-inputs declared per §3.2 row P7 empty-declaration; MA-L5 events not applicable.

### §5.6 Failure modes

Per v3-1-spec §3.3 output-schema `lifecycle` field (V5-verification additions):

- **G-PL1 failure (registry key collision)** → registry malformed; deploy halt; escalate to L0 per MA-L4; remediation: declare which entry is canonical, rename or remove the duplicate.
- **G-PL2 failure (hardcoded path string outside registry)** → la-validator flags violation; CI build fails; escalate to author per MA-L4; remediation: refactor consumption to registry consultation form.
- **G-PL3 failure (registryVersion missing or malformed)** → framework version surface compromised; escalate to L0 per MA-L4; remediation: restore Semver-conforming registryVersion field.
- **G-PL4 failure (registry mutation without AmendmentEvent)** → audit trail broken; escalate to L0 per MA-L4; remediation: emit corresponding AmendmentEvent retroactively or roll back the unauthorized mutation.
- **G-PL5 failure (out-of-enum itemKind)** → either out-of-scope item registered (remove from registry; defer per spec §1.3 pattern) or new kind emerged (extend PlacementItemKind additively per PR2 + version bump).
- **G-PL6 failure (multi-home item)** → registry inconsistency; escalate to L0 per MA-L4; remediation: declare canonical home, deprecate the duplicate.
- **HR-PL2 invocation rejected by la-validator (Sprint Shot 5+)** → registry consumption surface broken; escalate to author per MA-L4; remediation: restore valid registry export.
- **L0 unavailability during amendment cycle** → suspend per substrate §13.6 L0-unavailability response; state persists in registry; resume idempotently on L0 return.
- **MA-L7 bootstrap non-re-entrancy** — placement-standard is post-bootstrap (registry exists pre-placement-standard); first-version case is L0 hand-authored at Sprint Shot 2 close per Sprint cycle; subsequent versions per declared amendment-propagation flow. No genesis recursion.

### §5.7 Scale bounds

Per V5 verification:

- **Per-validation cost:** O(N) where N = `PLACEMENT_REGISTRY` entry count (54 at v1.0).
- **Per-G-PL2-scan cost:** O(F × N) where F = TS/TSX/MD file count in repo (~270 at v1.0 per Sprint Shot 1 inventory totals); scan iterates files × registry pattern checks.
- **Total state grows:** O(N) per registry entry; bounded by tree size at any cycle.

Bounds declared, not measured. Runtime measurement deferred post-deploy.

### §5.8 Atomicity declarations

- **Per-axiom-gate execution:** atomic per gate (one GateResult per atomic gate invocation).
- **Full registry validation run:** interruptible at gate boundary per substrate §13.4 owned-framework-execution row ("interruptible with per-step checkpoint"). Recovery point = last-completed gate.
- **Registry mutation:** atomic per single PlacementRecord write; multi-record mutations (e.g., bulk relocation in Sprint Shot 4) executed as atomic-commit unit per Sprint Spec §3 Shot 4 atomic-commit discipline ("registry-value updates AND `git mv` operations AND code edits propagating from registry value changes AND prose edits propagating from same land as one atomic commit, or as one atomic rollback unit").

### §5.9 Version history

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | sprint-placement-framework Shot 2 (pending L0 ratification) | Initial Placement Standard declaration. 6 own axioms (PL-A1 Single-declaration on Schema, PL-A2 Consultation-only on Validity, PL-A3 Versioned identity on Lifecycle, PL-A4 Amendment propagation on Lifecycle, PL-A5 Domain-bounded on Identity, PL-A6 Unitarity on Schema) + 6 paired gates (G-PL1..G-PL6 per G-M1 1:1 mapping) + 3 own HRs (HR-PL1 substrate atom consumption, HR-PL2 emit to la-validator, HR-PL3 emit to code consumers). Carrier=self (no AS carriage at v1.0; build-time substrate). Initial PLACEMENT_REGISTRY entries sourced from L0-ratified Sprint Shot 1 inventory (54 entries: 36 framework + 6 cycle-record + 1 typed-runtime-projectroot + 8 build-config + 3 platform-tooling). Self-application: `placement_standard` → `frameworks/standards/placement-standard.md` declared as registry entry. ReferentCitations empty per VS v1.0 + RS v1.0 sibling precedent (vacuous-pass per MA-V11). **F-FORWARD-1** declared at §3.4: `liv-standard.md` and `perimeter-standard.md` governance documents do not exist at v1.0 ratification; registry omits both per natural-defer rule (§1.21); forward sprint authors both as L3 frameworks following placement-standard's MFv3 pattern. Per DD-Resolution-1B ratification at Sprint Shot 3 dispatch.
---

## §6 Coupling

### §6.1 Carrier

Placement Standard carrier = `self`. Emits the `PLACEMENT_REGISTRY` constant as own artifact at build time. **No AS carriage at v1.0** — registry is consumed at validation/code-emission time, not runtime emitted; AS carriage would over-couple to runtime emission machinery for build-time substrate. Carrier=self is structurally consistent with metaframework's own carrier=self pattern (substrate §9 Carrier enum + metaframework §6.1).

### §6.2 Handoff rules

Three framework-local HR instances.

| ID | Direction | Carrier applicability | Diagnostic significance | CaptureShape |
|---|---|---|---|---|
| HR-PL1 | substrate → placement-standard (receive HR1) | `['self', 'named', 'none']` (matches substrate §9 HR1) | false (read-only atom consumption) | n/a (per substrate §8.2 conditional captureShape — optional when diagnosticSignificance=false) |
| HR-PL2 | placement-standard → la-validator (registry consumption for §1.20.1 enforcement, Sprint Shot 5) | `['self']` (consuming framework's carrier = self per la-validator's R5 placement) | true | declared §6.3 |
| HR-PL3 | placement-standard → code consumers (registry consultation per PL-A2; ~17 sites at Sprint Shot 3 refactor scope + future consumers) | `['self', 'named', 'none']` (applies regardless of consumer carrier) | true | declared §6.3 |

**HR-PL1 receive-side mirrors substrate §9 HR1 send-side** by construction per MA-C3 handoff-invariant symmetry. Read-only atom consumption (FrameworkRef, Semver, Result, AppError); non-diagnostic per HR1 pattern (substrate atoms are universal, not diagnostic-load-bearing).

**HR-PL2 emit-side** carries `PLACEMENT_REGISTRY` reference from placement-standard's R5 to la-validator's consumption surface at Sprint Shot 5 (la-validator §1.20.1 extension). Diagnostic-significant: la-validator depends on registry shape; capture surface declared.

**HR-PL3 emit-side** carries individual `PLACEMENT_REGISTRY[<identifier>].home` consultation calls from placement-standard's R5 to code consumers (Sprint Shot 3 refactor scope: `LIV_INSTANCE_PERIMETER_SITE_REF`, execution-check known-meta-files list, banner-emission per Decision-D (a)). Diagnostic-significant: consumer call surface is the load-bearing audit point for PL-A2 enforcement.

### §6.3 Capture shapes

Per substrate §8.2 amended P6 shape + metaframework-v3-1 §6.3 pattern.

**HR-PL1 (receive):** n/a — diagnosticSignificance=false per substrate §8.2 conditional. Captured data lives on substrate side (atoms are universal).

**HR-PL2 (emit to la-validator):**
```
captureShape = {
  capturedFields: ['validationRunId', 'placementRegistryRef', 'placementRegistryVersion',
                   'gatesEvaluated', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'la-validator §1.20.1 extension query path (Sprint Shot 5)'
}
```

**HR-PL3 (emit to code consumers):**
```
captureShape = {
  capturedFields: ['consumerCallSiteRef', 'consumedPlacementId', 'consumedHome',
                   'consumerFile', 'consumerLine', 'timestamp'],
  captureTarget: 'audit-trail',
  queryInterface: 'la-validator G-PL2 violation log query path (Sprint Shot 5)'
}
```

### §6.4 Custody table

Every atom owned or consumed, with owner + layer + consumers per substrate SG3.

| Atom | Owner | Layer | Consumers |
|---|---|---|---|
| `FrameworkRef` | substrate §4 A-09 | L1 | placement-standard (genesis declaration §1.1, parent framework refs) |
| `Semver` | substrate §7 | L1 | placement-standard (PlacementVersion typing per PL-A3) |
| `Result` | substrate-tier primitive (consumed via R5 primitives) | L1 | placement-standard (registry mutation outcomes) |
| `AppError` | substrate-tier primitive | L1 | placement-standard (validation error surface) |
| `PlacementId` | placement-standard | L3 | la-validator (G-PL1 key-uniqueness check), code consumers (registry key consumption per PL-A2) |
| `PlacementVersion` | placement-standard | L3 | la-validator (G-PL3 version-format check), framework-audit (provenance lookup) |
| `PlacementItemKind` | placement-standard | L3 | la-validator (G-PL5 enum-membership check), inventory-table authors (Sprint Shot 1 + future cycles) |
| `PlacementClaim` | placement-standard | L3 | inventory-table authors (Sprint Shot 1 + future cycles), L0 ratification cycle |
| `PlacementRecord` | placement-standard | L3 | la-validator (G-PL1, G-PL5, G-PL6 enumeration), code consumers (home consultation per PL-A2) |
| `PlacementRegistry` | placement-standard | L3 | la-validator (full G-PL* gate suite), code consumers (consultation surface), banner-emission code (Sprint Shot 3 Decision-D (a)) |

Substrate atoms consumed by reference; placement-standard-declared atoms produced here and consumed by la-validator (Sprint Shot 5) and code consumers (Sprint Shot 3 refactor scope + future).

### §6.5 Provenance contract

Per MA-C5 + R-phase-1-1-resolution-20 reference-default. Every emitted `PlacementRecord` traces to:
- L0-ratified Sprint Shot 1 inventory entry (`sprint-records/sprint-placement-framework/inventory-table.md` row reference),
- Sprint cycle dispatch (`sprint-placement-framework`),
- L0 AuthorityClaim at Sprint Shot 2 close (per §5.3 confirmation gate).

Reference-default per R-phase-1-1-resolution-20: provenance fields store inventory-row references and cycle IDs; full inventory-row content retained in sprint-records (not duplicated in registry).

### §6.6 OperatorInterface

Per V5 verification + framework-audit X6 dimension self-application.

- **Activation interface:** L0 may directly trigger registry amendment via amendment-propagation HR0 → HR4 → HR-PL1 chain. Indirect activation via Sprint cycle dispatch (Manager Playbook §1.7).
- **Review interface:** L0 reviews registry contents via `src/core/constants/placement-standard.ts` direct read; reviews amendment history via `framework-registry-v1-0` queryByFrameworkRef on `placement-standard`; reviews per-cycle audit results via la-validator output (Sprint Shot 5+).
- **Confirmation interface:** L0 confirms framework-version amendments and registry-content amendments per substrate §13 standard L0 confirmation cycle.
- **Discovery interface:** registry contents queryable via `Object.keys(PLACEMENT_REGISTRY)` + per-entry property access; full registry shape exported as TypeScript types from `src/core/types/placement-standard.types.ts`.

Runtime implementation is build-time + CI-time per Sprint Shot 5+ deploy. Declarations only at Shot 2 delivery.

### §6.7 MA-C1–MA-C10 satisfaction

All ten Coupling axioms satisfied at handoff tier per metaframework-v3-1 §3.2 inheritance + §3.5 declarations:

- **MA-C1** (carrier declared) — §6.1 declares carrier=self.
- **MA-C2** (custody complete) — §6.4 enumerates every atom (10 rows).
- **MA-C3** (handoff-invariant symmetry) — HR-PL1 receive matches substrate §9 HR1 send by construction; HR-PL2 + HR-PL3 emit-sides have no upstream send to mirror (placement-standard is the originator).
- **MA-C4** (provenance populated) — §6.5 declares.
- **MA-C5** (provenance contract) — §6.5 declares.
- **MA-C6** (carrier-applicability enforced) — HR-PL1 applicability `['self','named','none']` matches HR1 send-side; HR-PL2 applicability `['self']` matches la-validator's R5 placement; HR-PL3 applicability `['self','named','none']` permits any consumer carrier.
- **MA-C7** (custody cross-boundary HR coverage) — every cross-framework atom flow in §6.4 (rows for la-validator and code consumers) has a declared HR (HR-PL2 + HR-PL3).
- **MA-C8** (HR endpoint registry resolution) — HR-PL2 endpoint la-validator resolves to `src/features/F-la-config/exec/la-validator.ts` via la-validator's own framework registration; HR-PL3 endpoints resolve to per-consumer file references at refactor time.
- **MA-C9** (cross-framework ID-content coherence) — placement-standard declares no IDs that overlap with other frameworks' IDs (PL-* prefix is framework-local per substrate §1.5 canonical kind registry).
- **MA-C10** (substrate-version pin uniformity) — placement-standard pins `substrate v1.6` per §6.4 atom consumption; consistent with other v3.2.7-cycle frameworks.

---

## §7 Judgment

Empty axis at v1.0 per §3.2 row P7. All six PL-A* axioms are mechanical per substrate §6.3 ground classes (cardinality + reference-resolution + structural property + type-check + enum-membership). No criteria-bounded gates declared.

Per substrate §8.6 empty-declaration derivation: `{primitiveKind: 'P7', instanceCount: 0, basis: "structural mode — placement-standard's six axioms are fully mechanical per substrate §6.3 ground classes; no non-mechanical derivation required at framework declaration tier"}`.

### §7.1 Axis status

Empty. Empty-declaration rule (substrate §8.6) applies; no J-input instances at this framework. MA-J1 vacuously satisfied (no J-inputs to type); MA-J2 vacuously satisfied (no criteria to test for mechanicality); MA-J3 vacuously satisfied (no provenance to populate); MA-J4 vacuously satisfied per substrate §8.6 emptyDeclared discipline; MA-J5 vacuously satisfied (no mechanicalGround field to resolve).

### §7.2 Future J-input introduction path

If a future Placement Framework version introduces a non-mechanical decision surface (e.g., classification of borderline items requires human judgment beyond the §3.3 enum-membership check), J-input introduction follows MA-J1: declare J-id, kind, criteria (mechanical per substrate §6.3), consumer; add P7 instance count; remove empty-declaration marker; update §3.2 P7 row. This is an additive amendment per AxR3 + MA-S7.

---

## §8 Self-audit results

Per metaframework-v3-1 §8 pattern (compact sprint-mode placeholder per Phase 9d precedent).

### §8.1 Gate results

**6 own gates + 85 inherited framework-tier gates: state = `not-yet-run`.** First-run scheduled at:
- **G-PL1, G-PL2, G-PL5, G-PL6:** Sprint Shot 5 deploy (la-validator §1.20.1 extension first-run at next CI build post-deploy).
- **G-PL3:** Sprint Shot 5 deploy (la-validator reads PLACEMENT_REGISTRY_VERSION at first CI build).
- **G-PL4:** first registry mutation event post-Sprint Shot 7 deploy.
- **Inherited framework-tier (85):** first system-wide audit cycle post-deploy per metaframework §5.X first-run-execution lifecycle event.

Per substrate §10.1 S4 binary truth-value discipline: gate results decompose as `truthValue ∈ {'passed', 'failed', null}` + `executionState ∈ {'not-yet-run', 'executed'}` + `applicability ∈ {'applicable', 'n/a'}` + `basis` (populated when applicability='n/a' per MA-V11). At Shot 2 delivery, every gate has `truthValue=null`, `executionState='not-yet-run'`, `applicability='applicable'` (or `'n/a'` with basis for X10 stage discipline per §3.6).

Inherited gate ID enumeration matches metaframework §4.7 (85 framework-tier):

`PG1, PG2, PG3, PG4, PG5, PG6, PG7, G-I1..G-I7, G-S1..G-S8, G-St1..G-St16, G-V1..G-V11, G-L1..G-L11, G-C1..G-C10, G-J1..G-J5, G-G13, G-U1..G-U5, G-M1..G-M4`.

Compact enumeration per sprint-mode.

### §8.2 Dimension audit results

All 10 framework-audit dimensions (X1–X10) against placement-standard: state = `pending-first-run`. Uniform state; compact summary per sprint-mode.

Dimension ID enumeration: `X1, X2, X3, X4, X5, X6, X7, X8, X9, X10` per framework-audit-v1-2 §3.3.

**X10 stage-discipline result:** evaluates `applicability='n/a'`, `executionState='executed'`, `truthValue=null`, `basis="structural-mode framework; P8 absent per substrate §8.3 conditional declaration; PR4 + PR5 N/A"` per substrate §10.1 S4 + MA-V11 vacuous-pass clause.

**X3 extended criterion C5 relevance.** Phase 1.2 extended X3 with C5 (captureShape required per P6 instance with diagnosticSignificance=true). Placement-standard declares 3 HRs: HR-PL1 diagnosticSignificance=false (C5 N/A per substrate §8.2 conditional); HR-PL2 + HR-PL3 diagnosticSignificance=true with populated captureShape at §6.3 (satisfies C5).

### §8.3 Last audit event

```
{
  status: 'pending-first-run',
  timestamp: null,
  auditorRef: null
}
```

### §8.4 Self-application basis

Per G-U1 (self-application) at metaframework-v3-1 §4.3: framework-audit runs X1–X10 against placement-standard at first system-wide audit cycle post-Sprint Shot 7 deploy. At Shot 2 delivery, self-audit is declared-placeholder state. No dimension has evaluated independently; §3.4 stage/kind self-check (per §3.6) and §8.2 X10/X3 self-checks are author-side pre-verifications, not framework-audit first-run execution.

**G-V10 self-application result for placement-standard-v1-0:** applicability='n/a' with basis "zero ReferentCitations declared at v1.0 per §1 referentCitations row; promotion scheduled at first la-validator §1.20.1 enforcement cycle post-Shot 5 deploy" per substrate §10.1 S4 + MA-V11 vacuous-pass clause. Same vacuous-pass discipline as VS v1.0 + RS v1.0 sibling precedent at first-ratification (cycle-2 spec §11.5 expected-and-correct vacuous result for new L3 frameworks).

---

## §9 Change log

| Version | Date | Change | Authority |
|---|---|---|---|
| v1.0 | sprint-placement-framework Shot 2 (pending L0 ratification) | Initial Placement Standard declaration. Generated against metaframework-v3-1 v3.2.7 via generation-procedure-v1-0 v1.1.6 (12-step procedure: S1 J-input intake N/A — empty P7; S2 mechanical template population per metaframework §2.2 GeneratedFrameworkTemplate output schema; S3-S10 E1-E8 Stage-3 gate-execution per inherited framework-tier gate bundles; S11 J-template-observation pending L0; S12 mechanical emission). Mode = structural per substrate §2; Carrier = self (no AS carriage at v1.0; build-time substrate). 6 own axioms (PL-A1..PL-A6) distributed across MFv3 axes per AxR1 (Identity 1, Schema 2, Validity 1, Lifecycle 2). 6 own gates (G-PL1..G-PL6) 1:1 paired with axioms per G-M1. 3 own HRs (HR-PL1 substrate atom consumption; HR-PL2 emit to la-validator at Sprint Shot 5; HR-PL3 emit to code consumers at Sprint Shot 3 refactor). PlacementClaim/PlacementRecord/PlacementRegistry typed shapes declared at R5 (`src/core/types/placement-standard.types.ts`). PLACEMENT_REGISTRY initial population (54 entries: 36 framework + 6 cycle-record + 1 typed-runtime-projectroot + 8 build-config + 3 platform-tooling) sourced from L0-ratified Sprint Shot 1 inventory across 5 PlacementItemKind values, with `liv_standard` + `perimeter_standard` omitted per F-FORWARD-1 / DD-Resolution-1B. Self-application: framework declares its own home at `frameworks/standards/placement-standard.md` as registry entry. ReferentCitations empty per VS v1.0 + RS v1.0 sibling precedent (vacuous-pass per MA-V11). All amendments additive per MA-L1 + MA-S7 (recursive scope per metaframework v3.2.7 §3.2.1 amendment). Bootstrap status: `bootstrapped: false` (fresh L3, no predecessor; predecessorVersion: null). | L0 (pending) |

---

### Forward-deferred flags

Canonical site for forward-deferred items surfaced during placement-standard cycles. Each flag names a defect, gap, or pattern observed at a specific shot that is out-of-scope for the current cycle and queued for forward sprint resolution. Flags are accumulative; resolution is recorded inline when the forward sprint closes them.

**F-FORWARD-1 — Missing L3 governance documents (added Sprint Placement Framework Shot 4 from Shot 2 ratification).** `liv-standard.md`, `perimeter-standard.md`, and `perimeter-headers.md` do not exist as L3 governance documents authored through MFv3 generation procedure at v1.0. The implementations (LIV-Standard's actual rules, Perimeter Standard v1.0.1's PA-A1..PA-A6 axiom set, perimeter-headers' constants) live in code constants, the Manual, and Sprint 6 deploy artifacts but not as standalone L3 framework declarations. Registry omits all three per natural-defer rule (§1.21). Forward sprint: author each as L3 framework declarations following placement-standard's MFv3 generation-procedure pattern; amend `PLACEMENT_REGISTRY` to register them via `amendment-propagation` flow per PL-A4. (Narrative reference also retained at §3.4 + §5.9 v1.0 row body as part of v1.0 ratification narrative; this entry is the canonical forward-flag site.)

**F-FORWARD-2 — F-identity execution-check.ts SLICE.md hardcode (added Sprint Placement Framework Shot 4 from Shot 3 ratification; migrated from §5.9 dangle).** `src/features/F-identity/exec/execution-check.ts` `knownMetaFiles` set contains literal `'SLICE.md'` per `Set(['execution-check.ts', 'SLICE.md', 'index.ts'])`. After Shot 3 relocation of `SLICE.md` files to `frameworks/slices/F-<id>.md`, the hardcode is structurally stale at the F-identity slice — the slice no longer contains a `SLICE.md` file. Untouched per DD-Exec-Check-Scope (minimal-mechanical-only); the hardcode is slice-internal governance, owned by LIV-Standard / F-identity slice maintenance, not Placement Standard. Forward LIV-Standard cycle: resolve hardcode (remove from `knownMetaFiles` or update to reflect new convention).

**F-FORWARD-3 — CLOSED Sprint 9 Shot 1.** Registry dissolved at Sprint 9 Shot 1 (Stream A). PLACEMENT_REGISTRY constant removed from `src/core/constants/placement-standard.ts`; walk-tree-and-join replaces registry-lookup in la-validator. Regex-against-text registry count concern is moot — no registry to count. Basis: §1.20 strict-functional (no live consumer after dissolution) + Sprint 9 Shot 1 inversion per brief §A.3.

**F-FORWARD-4 — CLOSED Sprint 9 Shot 1.** Registry dissolved at Sprint 9 Shot 1 (Stream A). Genesis-report registration-class decision is superseded: under the inverted Placement Standard, genesis reports self-declare via YAML frontmatter. No registry entry needed. Any genesis report added to `frameworks/metaframework/reports/` declares its own kind (`framework`) and placement inline. Basis: PL-A1 (inverted) — self-declaration replaces registry-registration.

**F-FORWARD-5 — Sprint 6 authoring defect (`as const` on Next.js config) (added Sprint Placement Framework Shot 4 from Shot 3 deploy verification).** Sprint 6 deploy bundle authored `runtime: 'nodejs' as const` inside the middleware `config` export. Turbopack's static AST extraction rejects the type assertion, breaking deploy. Surfaced at Sprint Placement Framework Shot 3 deploy verification when the perimeter site relocated to root `middleware.ts`. Sprint 6 audit cycle did not catch it because audits ran against artifact contents, not against `npm run build` over composed reality (Playbook §1.17 applies recursively: artifact-level audit is insufficient when the artifact targets a static-extraction toolchain). Pattern: type assertions inside Next.js `config` exports must be avoided. Constraint is currently undocumented in LIV-Standard. Forward LIV-Standard cycle: document the constraint, add la-validator check if mechanical enforcement is feasible.

**F-FORWARD-6 — One-time applicator hardcodes (added Sprint Placement Framework Shot 4).** Sprint Placement Framework Shot 3 applicator (`shot-3-apply.py`) carried hardcoded enumerations: 15-entry banner map (file path → registry id) and ~7-site governance MD relocation glob patterns. Same distributed-truth defect class as F-005, but acceptable because the applicator was single-use and dissolved after Shot 3 atomic commit. Durable form would derive sources from registry destinations by inverting standard relocation rules. Logged for completeness; no remediation required for the dissolved applicator. Forward sprint applicators authoring registry-driven mutations should derive from registry consultation rather than enumerate.

**F-FORWARD-7 — auth-hooks file extension drift (informational; added Sprint Placement Framework Shot 4).** `src/features/F-identity/exec/execution-check.ts` `DECLARED_FILES` references `'app/auth-hooks.ts'`, but the actual bundle file at that location is `auth-hooks.tsx`. Pre-existing drift not in DD-Exec-Check-Scope (minimal-mechanical-only). Surface for forward LIV-Standard cycle / F-identity slice maintenance.

**F-FORWARD-9 — Slice-declaration vs on-disk reconciliation (added Sprint Placement Framework Shot 4 from la-validator green-on-composed-reality verification).** Two distinct findings of the same defect class, surfaced together because both involve `f-tags.json` `declared_slices` ↔ `src/features/` reconciliation:

(a) **F-memory missing domain/.** la-validator check #4 reports `F-memory missing domain/` at HEAD `daccc54`. F-memory has `contract/` and `exec/` but no `domain/` layer. Out of `f-tags.json` `completeness.exceptions` table. Forward LIV-Standard cycle: either author the missing `domain/` or add F-memory to the exceptions list with declared basis.

(b) **Six on-disk slices not in `declared_slices`.** `F-admin, F-artifact, F-executor, F-multi-instance, F-plan, F-router` exist under `src/features/` but are not in `declared_slices`. la-validator check #1 is unidirectional (filters declared-but-missing), so these slices are silently invisible to the validator. They also have layer drift if declared: F-admin missing `domain/`; F-artifact, F-executor, F-multi-instance, F-router missing `exec/`. Forward LIV-Standard cycle: triage each — either add to `declared_slices` (and reconcile layer completeness), absorb into core_infrastructure per the F-types/F-state-registry/F-integration precedent, or document the basis for non-declaration. Pair with check #1 enhancement to flag on-disk-but-not-declared bidirectionally.

Both are slice-internal governance, owned by LIV-Standard / individual slice maintenance, not Placement Standard.

**F-FORWARD-10 — CC.18 cross-slice config/ imports (17 violations) (added Sprint Placement Framework Shot 4 from la-validator green-on-composed-reality verification).** la-validator check #5 reports 17 cross-slice imports targeting `config/` instead of `types/` (R0) or `contract/` (R3) per CC.18 enforcement. Affected slices (importing → imported): F-ai-adapter → F-event-system, F-user-profile (×3); F-chat → F-ai-adapter (×2), F-user-profile (×2); F-event-system → F-identity (×2), F-permissions, F-ai-adapter, F-chat; F-permissions → F-event-system; F-planner → F-ai-adapter (×2). Genuine architectural drift, not a defect in the validator. Resolution requires either (a) elevating the imported config items to types/ or contract/ at their source slices, or (b) adding a documented exception to CC.18 with structural basis. Forward LIV-Standard cycle: triage the 17 violations and resolve each per (a) or (b).

**F-FORWARD-11 — JSON-vs-TS slice-declaration drift (added Sprint Placement Framework Shot 4).** Sprint Placement Framework Shot 4 moved 10 aspirational slice names (`F-session, F-git-connector, F-terminal-bridge, F-topography, F-constitution, F-notifications, F-commit-log, F-editor, F-health-panel, F-execution-panel`) from `declared_slices` to `reserved_slices` in `src/features/F-la-config/config/f-tags.json` to satisfy la-validator check #1. The 10 names remain in the `FSlice` type union at `src/core/types/primitives.ts` and the `STATE_NAMESPACES` map at `src/core/types/state-registry.ts` because they are load-bearing in runtime code: `event-bus.ts` maps event-source prefixes to these slice names, and several la-config + user-profile sources reference them in stubs and comments. True F-workspace-pattern parity would require retracting these names from the typed surfaces too, but that is structural change (would alter `FSlice` union shape and `STATE_NAMESPACES` `Record<FSlice, string>` typing) and out of Shot 4 scope per dispatch. Forward LIV-Standard cycle: ratify whether these 10 names are forward-declarations (keep typed, JSON-reserved is the canonical state) or genuine retractions (also remove from FSlice + STATE_NAMESPACES + event-bus mappings + comment references). Document the chosen pattern in LIV-Standard so future "reserved" semantics are unambiguous.

---

## End of placement-standard-v1-0
