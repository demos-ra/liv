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
  PlacementVersion,
  PlacementItemKind,
} from '../types/placement-standard.types'
// PlacementId, PlacementRecord, PlacementRegistry remain in types file for
// forward consumer use (e.g. typed claim authoring, la-validator types).

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

// ─── PLACEMENT_REGISTRY dissolved (Sprint 9 Shot 1 — Stream A) ──────────────
// Registry-lookup model replaced by walk-tree-and-join per inverted PL-A1..PL-A6.
// Each LIV-shaped artifact now self-declares kind+placement inline.
// la-validator walks tree, reads declarations, and reports drift.
// PlacementRegistry, PlacementRecord, PlacementId types retained in
// placement-standard.types.ts for forward use (e.g. typed claim authoring).
// Removed: PLACEMENT_REGISTRY constant, PLACEMENT_REGISTRY_ENTRY_COUNT,
//          r() helper, __DECLARED_AT__ constant.

// ─── Sanity invariants (retained — axiom/gate count self-checks) ─────────────

// ─── End of placement-standard.ts ────────────────────────────────────────────
