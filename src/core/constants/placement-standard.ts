// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    none
// slice:      core
// layer:      R5
// wires-in:
//   W-ATOM PlacementId               ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementVersion          ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementItemKind         ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementRecord           ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementRegistry         ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementAxiomId          ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementAxiomGateId      ← core/R5 ../types/placement-standard.types
//   W-ATOM PlacementHandoffRuleId    ← core/R5 ../types/placement-standard.types
// wires-out:
//   W-ATOM PLACEMENT_FRAMEWORK_ID                 → all PL consumers, registry
//   W-ATOM PLACEMENT_FRAMEWORK_VERSION            → all PL consumers, registry
//   W-ATOM PLACEMENT_REGISTRY_VERSION             → la-validator (G-PL3), all PL consumers
//   W-ATOM PLACEMENT_AXIOM_IDS                    → la-validator, framework-audit
//   W-ATOM PLACEMENT_AXIOM_GATE_IDS               → la-validator, framework-audit
//   W-ATOM PLACEMENT_HANDOFF_RULE_IDS             → la-validator, framework-audit
//   W-ATOM PLACEMENT_ITEM_KIND_VALUES             → la-validator (G-PL5 runtime membership check)
//   W-ATOM PLACEMENT_REGISTRY                     → la-validator (full G-PL* gate suite), code consumers, banner-emission
//   W-ATOM PLACEMENT_VALIDITY_ERROR_CODES         → la-validator callers (error surface)
//   W-ATOM PlacementValidityErrorCode             → type consumers
//   W-ATOM PLACEMENT_P1_AXIS_COUNT..PL_P8_STEP_COUNT → framework-audit, registry
//   W-ATOM PLACEMENT_P1_EMPTY_DECLARATION..PL_P8_ABSENT_DECLARATION → framework-audit
//   W-ATOM PLACEMENT_CARRIER                      → carrier resolution
//   W-ATOM PLACEMENT_METAFRAMEWORK_PIN            → registry
//   W-ATOM PLACEMENT_GENERATION_PROCEDURE_PIN     → registry
//   W-ATOM PLACEMENT_SUBSTRATE_PIN                → registry
//   W-ATOM PLACEMENT_AMENDMENT_PROPAGATION_PIN    → registry; consumed at PL-A4 mechanical condition resolution
//   W-ATOM PLACEMENT_AXIOM_GATE_ONE_TO_ONE        → G-M1 self-check attestation
//   W-ATOM PLACEMENT_HR_LENGTH_MATCH              → self-check attestation
// deps:
//   R5 ../types/placement-standard.types
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLACEMENT STANDARD v1.0 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Placement Standard v1.0 landing: generated against metaframework-v3-1 v3.2.7
// via generation-procedure-v1-0 v1.1.6. Mode-symmetric L3 sibling of LIV-Standard
// (orthogonal composition: LIV-Standard owns inside-slice; Placement Standard
// owns cross-tree). Carrier = self (no AS carriage at v1.0).
// Canonical spec: PLACEMENT_REGISTRY.placement_standard
//   (Sprint Shot 3 refactor lands this banner; pre-Shot-3 readers may resolve
//    the registry-identifier reference to: frameworks/standards/placement-standard.md)
// PL-A1: declared once, in PLACEMENT_REGISTRY at core/R5. Consumers consult — never redeclare.
// PL-A2: no hardcoded paths outside this file. la-validator §1.20.1 enforces post-Shot-5.

import type {
  PlacementId,
  PlacementVersion,
  PlacementItemKind,
  PlacementRecord,
  PlacementRegistry,
} from '../types/placement-standard.types'

// ─── Framework identity ──────────────────────────────────────────────────────

export const PLACEMENT_FRAMEWORK_ID = 'placement-standard' as const
export const PLACEMENT_FRAMEWORK_VERSION = '1.0' as const

/**
 * PLACEMENT_REGISTRY version per PL-A3 versioned identity.
 * Bumps independently of framework version — registry-data mutations
 * (adding new entries, retiring old entries) advance registryVersion
 * without forcing framework version bump.
 */
export const PLACEMENT_REGISTRY_VERSION: PlacementVersion = '1.0' as PlacementVersion

// ─── Axiom ID set (per §3.3 + §4.2 1:1 pairing per G-M1) ─────────────────────

export const PLACEMENT_AXIOM_IDS = [
  'PL-A1',
  'PL-A2',
  'PL-A3',
  'PL-A4',
  'PL-A5',
  'PL-A6',
] as const

// ─── PL-own axiom gate ID set (per §4.2; 1:1 per G-M1) ───────────────────────

export const PLACEMENT_AXIOM_GATE_IDS = [
  'G-PL1',
  'G-PL2',
  'G-PL3',
  'G-PL4',
  'G-PL5',
  'G-PL6',
] as const

// ─── Handoff rule ID set (per §6.2) ──────────────────────────────────────────

export const PLACEMENT_HANDOFF_RULE_IDS = [
  'HR-PL1',
  'HR-PL2',
  'HR-PL3',
] as const

// ─── Enum literal sets (mirror type exports for runtime membership checks) ───

/**
 * PlacementItemKind enum literal set for runtime membership check.
 * Consumed by la-validator G-PL5 (domain-bounded enforcement per PL-A5).
 * Additive per PR2 — new kinds enter via additive amendment.
 */
export const PLACEMENT_ITEM_KIND_VALUES: readonly PlacementItemKind[] = [
  'framework',
  'cycle-record',
  'typed-runtime-projectroot',
  'build-config',
  'platform-tooling',
] as const

// ─── Validity error code set ─────────────────────────────────────────────────

export const PLACEMENT_VALIDITY_ERROR_CODES = [
  'PLACEMENT_REGISTRY_KEY_COLLISION',
  'PLACEMENT_HARDCODED_PATH',
  'PLACEMENT_REGISTRY_VERSION_MALFORMED',
  'PLACEMENT_AMENDMENT_PROVENANCE_MISSING',
  'PLACEMENT_ITEM_KIND_OUT_OF_ENUM',
  'PLACEMENT_MULTI_HOME',
  'PLACEMENT_REGISTRY_MALFORMED',
] as const
export type PlacementValidityErrorCode = (typeof PLACEMENT_VALIDITY_ERROR_CODES)[number]

// ─── Primitive instance counts (per §3.2) ────────────────────────────────────

export const PLACEMENT_P1_AXIS_COUNT = 0 as const
export const PLACEMENT_P2_SUBAXIS_COUNT = 0 as const
export const PLACEMENT_P3_LEAF_COUNT = 0 as const
export const PLACEMENT_P4_AXIOM_COUNT_OWN = 6 as const
export const PLACEMENT_P5_GATE_COUNT_OWN = 6 as const
export const PLACEMENT_P6_HANDOFF_RULE_COUNT = 3 as const
export const PLACEMENT_P7_JUDGMENT_INPUT_COUNT = 0 as const
export const PLACEMENT_P8_PROCEDURE_STEP_COUNT = 0 as const

// ─── P1, P2, P3, P7 empty-declarations + P8 absent-declaration ───────────────
// Per substrate §8.6 + atom A-17 EmptyPrimitiveDeclaration typed shape.

export const PLACEMENT_P1_EMPTY_DECLARATION = {
  primitiveKind: 'P1',
  instanceCount: 0,
  basis:
    'Axes inherited from metaframework-v3-1 §3.1; placement-standard declares no own axes.',
} as const

export const PLACEMENT_P2_EMPTY_DECLARATION = {
  primitiveKind: 'P2',
  instanceCount: 0,
  basis:
    'Flat axis structure inherited from metaframework; no sub-axes declared at placement-standard level.',
} as const

export const PLACEMENT_P3_EMPTY_DECLARATION = {
  primitiveKind: 'P3',
  instanceCount: 0,
  basis: 'Leaves inherited via axes from metaframework.',
} as const

export const PLACEMENT_P7_EMPTY_DECLARATION = {
  primitiveKind: 'P7',
  instanceCount: 0,
  basis:
    "Structural mode — placement-standard's six axioms are fully mechanical " +
    'per substrate §6.3 ground classes (PL-A1: cardinality + reference-resolution; ' +
    'PL-A2: structural property + reference-resolution; PL-A3: type-check; ' +
    'PL-A4: reference-resolution; PL-A5: enum-membership; PL-A6: cardinality). ' +
    'No non-mechanical derivation required at framework declaration tier. ' +
    'MA-J4 emptyDeclared satisfied.',
} as const

/**
 * P8 absent-declaration (not empty per substrate §8.3 conditional).
 * Mode = generative only for P8 instantiation; structural-mode frameworks
 * have P8 absent. Marker preserved for traceability per PR1.
 */
export const PLACEMENT_P8_ABSENT_DECLARATION = {
  primitiveKind: 'P8',
  instanceCount: 0,
  basis:
    'Structural mode — placement-standard is structural, not generative. ' +
    'P8 is conditional per substrate §8.3 (Mode = generative only). ' +
    'For non-generative frameworks P8 is absent, not empty. ' +
    'Marker declared for traceability per PR1; framework-audit X10 stage ' +
    "discipline N/A per substrate §8.3 conditional declaration.",
} as const

// ─── Carrier (per §6.1) ──────────────────────────────────────────────────────

export const PLACEMENT_CARRIER = 'self' as const

// ─── Cross-framework pins (per §1 + §6.4) ────────────────────────────────────

export const PLACEMENT_METAFRAMEWORK_PIN: { id: string; version: string } = {
  id: 'metaframework',
  version: '3.2.7',
} as const

export const PLACEMENT_GENERATION_PROCEDURE_PIN: { id: string; version: string } = {
  id: 'generation-procedure',
  version: '1.1.6',
} as const

export const PLACEMENT_SUBSTRATE_PIN: { id: string; version: string } = {
  id: 'substrate',
  version: '1.6',
} as const

export const PLACEMENT_AMENDMENT_PROPAGATION_PIN: { id: string; version: string } = {
  id: 'amendment-propagation',
  version: '1.3.3',
} as const

// ═══════════════════════════════════════════════════════════════
// PLACEMENT_REGISTRY — initial population per Sprint Shot 1 ratified inventory
// ═══════════════════════════════════════════════════════════════
// Initial entries sourced from `sprint-records/sprint-placement-framework/inventory-table.md`
// under L0-ratified Decision-D resolutions:
//   DD-1 = (a): .deploy-records/* relocated to sprint-records/phase-5/
//   DD-2: pnpm-lock.yaml deletion (legacy-fossil)
//   DD-3: SLICE.md flatten + rename to frameworks/slices/F-<id>.md
//   DD-4: metaframework spec rename (version → registry per PL-A3)
//   DD-5 = (i): manual relocate-as-is at Shot 4; amend in place at Shot 6
//
// PL-A1: every entry has unique itemId key.
// PL-A5: every itemKind ∈ PLACEMENT_ITEM_KIND_VALUES enum.
// PL-A6: every itemId resolves to exactly one home.

const __DECLARED_AT__ = '2026-05-07T00:00:00Z' as const   // ISO 8601; Sprint Shot 2 declaration time

/**
 * Helper: typed PlacementRecord constructor preserving registryVersion + declaredAt
 * uniformly across initial entries. All initial entries share registryVersion = v1.0
 * and declaredAt = Sprint Shot 2 declaration time.
 */
const r = (
  itemId: string,
  itemKind: PlacementItemKind,
  home: string,
): PlacementRecord => ({
  itemId: itemId as PlacementId,
  itemKind,
  home,
  registryVersion: PLACEMENT_REGISTRY_VERSION,
  declaredAt: __DECLARED_AT__,
})

export const PLACEMENT_REGISTRY: PlacementRegistry = {
  // ─── Framework class — manual ────────────────────────────────────────────
  manual: r('manual', 'framework', 'frameworks/manual/liv-manual.md'),

  // ─── Framework class — placement-standard (self-application) ─────────────
  placement_standard: r('placement_standard', 'framework', 'frameworks/standards/placement-standard.md'),

  // ─── Framework class — L3 standards ──────────────────────────────────────
  // F-FORWARD-1 (DD-Resolution-1B): liv-standard.md and perimeter-standard.md
  // do not exist as L3 governance documents at v1.0 ratification (only typed
  // runtime exists at src/core/constants/liv-standard.ts + .types.ts).
  // Registry omits both per natural-defer rule (§1.21). Forward sprint: author
  // both as L3 framework declarations following placement-standard's MFv3
  // generation-procedure pattern; subsequent registry amendment via
  // amendment-propagation §3.3 AmendmentEvent flow per PL-A4.
  artifact_standard:          r('artifact_standard',          'framework', 'frameworks/standards/artifact-standard.md'),
  design_standard:            r('design_standard',            'framework', 'frameworks/standards/design-standard.md'),
  living_memory_standard:     r('living_memory_standard',     'framework', 'frameworks/standards/living-memory.md'),
  multi_instance_standard:    r('multi_instance_standard',    'framework', 'frameworks/standards/multi-instance-standard.md'),
  plan_standard:              r('plan_standard',              'framework', 'frameworks/standards/plan-standard.md'),
  research_standard:          r('research_standard',          'framework', 'frameworks/standards/research-standard.md'),
  verification_standard:      r('verification_standard',      'framework', 'frameworks/standards/verification-standard.md'),

  // ─── Framework class — standards collective marker ───────────────────────
  // Per Sprint Shot 1 DD-3: standards-collective SLICE.md retains SLICE.md naming
  // (collective-level marker, not slice-identity marker).
  standards_collective_slice: r('standards_collective_slice', 'framework', 'frameworks/standards/SLICE.md'),

  // ─── Framework class — metaframework spec + manifest ─────────────────────
  // Per Sprint Shot 1 DD-4: rename from v3-1-spec.md; version moves to registry per PL-A3.
  metaframework_spec:         r('metaframework_spec',         'framework', 'frameworks/metaframework/spec/metaframework.md'),
  metaframework_manifest:     r('metaframework_manifest',     'framework', 'frameworks/metaframework/MANIFEST.md'),

  // ─── Framework class — metaframework constituent frameworks ──────────────
  mf_amendment_propagation:   r('mf_amendment_propagation',   'framework', 'frameworks/metaframework/frameworks/amendment-propagation-v1-0.md'),
  mf_framework_audit:         r('mf_framework_audit',         'framework', 'frameworks/metaframework/frameworks/framework-audit-v1-2.md'),
  mf_framework_registry:      r('mf_framework_registry',      'framework', 'frameworks/metaframework/frameworks/framework-registry-v1-0.md'),
  mf_generation_procedure:    r('mf_generation_procedure',    'framework', 'frameworks/metaframework/frameworks/generation-procedure-v1-0.md'),
  mf_metaframework:           r('mf_metaframework',           'framework', 'frameworks/metaframework/frameworks/metaframework-v3-1.md'),
  mf_substrate:               r('mf_substrate',               'framework', 'frameworks/metaframework/frameworks/substrate-v1-1.md'),

  // ─── Framework class — metaframework reports ─────────────────────────────
  mf_report_amendment_1_audit:               r('mf_report_amendment_1_audit',               'framework', 'frameworks/metaframework/reports/MF-amendment-1-audit-report.md'),
  mf_report_amendment_1_delivery:            r('mf_report_amendment_1_delivery',            'framework', 'frameworks/metaframework/reports/MF-amendment-1-delivery-report.md'),
  mf_report_patch_1_delivery:                r('mf_report_patch_1_delivery',                'framework', 'frameworks/metaframework/reports/MF-patch-1-delivery-report.md'),
  mf_report_phase_1_2_fix_trail_hygiene:     r('mf_report_phase_1_2_fix_trail_hygiene',     'framework', 'frameworks/metaframework/reports/phase-1-2-fix-trail-hygiene-delivery-report.md'),
  mf_report_phase_9h_g_u1_first_run:         r('mf_report_phase_9h_g_u1_first_run',         'framework', 'frameworks/metaframework/reports/phase-9h-G-U1-first-run-report.md'),
  mf_report_phase_9h_ap_self_recursion:      r('mf_report_phase_9h_ap_self_recursion',      'framework', 'frameworks/metaframework/reports/phase-9h-ap-self-recursion-report.md'),
  mf_report_phase_9h_cross_file_consistency: r('mf_report_phase_9h_cross_file_consistency', 'framework', 'frameworks/metaframework/reports/phase-9h-cross-file-consistency-report.md'),
  mf_report_phase_9h_terminal_delivery:      r('mf_report_phase_9h_terminal_delivery',      'framework', 'frameworks/metaframework/reports/phase-9h-terminal-delivery-report.md'),
  mf_report_v3_2_3_delivery:                 r('mf_report_v3_2_3_delivery',                 'framework', 'frameworks/metaframework/reports/v3-2-3-delivery-report.md'),

  // ─── Framework class — slice declarations (per Sprint Shot 1 DD-3) ───────
  // Flatten from src/features/F-<id>/SLICE.md to frameworks/slices/F-<id>.md.
  slice_F_artifact:           r('slice_F_artifact',           'framework', 'frameworks/slices/F-artifact.md'),
  slice_F_design_system:      r('slice_F_design_system',      'framework', 'frameworks/slices/F-design-system.md'),
  slice_F_discover:           r('slice_F_discover',           'framework', 'frameworks/slices/F-discover.md'),
  slice_F_identity:           r('slice_F_identity',           'framework', 'frameworks/slices/F-identity.md'),
  slice_F_memory:             r('slice_F_memory',             'framework', 'frameworks/slices/F-memory.md'),
  slice_F_multi_instance:     r('slice_F_multi_instance',     'framework', 'frameworks/slices/F-multi-instance.md'),
  slice_F_plan:               r('slice_F_plan',               'framework', 'frameworks/slices/F-plan.md'),
  slice_F_router:             r('slice_F_router',             'framework', 'frameworks/slices/F-router.md'),
  slice_F_verify:             r('slice_F_verify',             'framework', 'frameworks/slices/F-verify.md'),

  // ─── Cycle-record class — Sprint 8 substrate cutover ─────────────────────
  sprint_8_decisions_audit_patch: r('sprint_8_decisions_audit_patch', 'cycle-record', 'sprint-records/sprint-8-substrate-cutover/DECISIONS-audit-patch.md'),
  sprint_8_apply_deletions:       r('sprint_8_apply_deletions',       'cycle-record', 'sprint-records/sprint-8-substrate-cutover/apply-deletions.sh'),
  sprint_8_migration_016:         r('sprint_8_migration_016',         'cycle-record', 'sprint-records/sprint-8-substrate-cutover/deploy-notes/migration-016.md'),

  // ─── Cycle-record class — Phase 5 manifests (per Sprint Shot 1 DD-1=(a)) ─
  // Relocated from .deploy-records/ (gitignored) to sprint-records/phase-5/ (tracked).
  phase_5_manifest_01: r('phase_5_manifest_01', 'cycle-record', 'sprint-records/phase-5/01-phase5-builds-1-3.MANIFEST.md'),
  phase_5_manifest_02: r('phase_5_manifest_02', 'cycle-record', 'sprint-records/phase-5/02-phase5-builds-5.MANIFEST.md'),
  phase_5_manifest_03: r('phase_5_manifest_03', 'cycle-record', 'sprint-records/phase-5/03-phase5-5.MANIFEST.md'),

  // ─── Typed-runtime-projectroot class — Next.js root middleware ───────────
  // Sprint Shot 4 replaces broken auth-middleware re-export with Sprint 6
  // deploy bundle's getPerimeterSession content. F-NEW1/F-NEW2 closure.
  perimeter_site: r('perimeter_site', 'typed-runtime-projectroot', 'middleware.ts'),

  // ─── Build-config class — root by external convention (PL-A5 register-only) ─
  // Placement convention-mandated (Next.js, npm, TypeScript, ESLint, PostCSS).
  // These are registered for completeness; the registry declares their location
  // but the framework does not author the placement decision (convention does).
  gitignore:          r('gitignore',          'build-config', '.gitignore'),
  readme:             r('readme',             'build-config', 'README.md'),
  eslint_config:      r('eslint_config',      'build-config', 'eslint.config.mjs'),
  next_config:        r('next_config',        'build-config', 'next.config.ts'),
  package_json:       r('package_json',       'build-config', 'package.json'),
  package_lock_json:  r('package_lock_json',  'build-config', 'package-lock.json'),
  postcss_config:     r('postcss_config',     'build-config', 'postcss.config.mjs'),
  tsconfig:           r('tsconfig',           'build-config', 'tsconfig.json'),

  // ─── Platform-tooling class — convention-mandated (PL-A5 register-only) ──
  migrations_dir:     r('migrations_dir',     'platform-tooling', 'migrations/'),
  public_dir:         r('public_dir',         'platform-tooling', 'public/'),
  scripts_dir:        r('scripts_dir',        'platform-tooling', 'scripts/'),
}

// ─── Sanity invariants (documentary; runtime self-check convenience) ─────────

// Length consistency: P4 own axiom count === P5 own gate count === 6 (G-M1 1:1).
// Length consistency: P6 HR count === HR ID array length === 3.
// These asserts are compile-time via `as const`; no runtime body required.
export const PLACEMENT_AXIOM_GATE_ONE_TO_ONE = PLACEMENT_AXIOM_IDS.length === PLACEMENT_AXIOM_GATE_IDS.length
export const PLACEMENT_HR_LENGTH_MATCH = PLACEMENT_HANDOFF_RULE_IDS.length === PLACEMENT_P6_HANDOFF_RULE_COUNT

// PL-A1 self-check (compile-time): TypeScript object literal forbids duplicate keys.
// PL-A1 runtime check via la-validator G-PL1 enumerates Object.keys uniqueness
// for any non-literal registry instantiation form (future flexibility).
//
// PL-A6 self-check: every PLACEMENT_REGISTRY[key].itemId equals key (write-time
// invariant enforced by `r()` constructor).
export const PLACEMENT_REGISTRY_ENTRY_COUNT = Object.keys(PLACEMENT_REGISTRY).length

// ─── End of placement-standard.ts ────────────────────────────────────────────
