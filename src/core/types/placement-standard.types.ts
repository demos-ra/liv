// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM Semver              ← core/R5 primitives
//   W-ATOM Result              ← core/R5 primitives
//   W-ATOM AppError            ← core/R5 primitives
// wires-out:
//   W-ATOM PlacementId                          → all placement-standard consumers, la-validator (G-PL1, G-PL5, G-PL6 enumeration), code consumers (registry consultation per PL-A2)
//   W-ATOM PlacementVersion                     → all placement-standard consumers, framework-audit (provenance lookup)
//   W-ATOM PlacementItemKind                    → la-validator (G-PL5 enum-membership), inventory-table authors
//   W-ATOM PLACEMENT_ITEM_KIND_VALUES           → la-validator (G-PL5 runtime membership check)
//   W-ATOM PlacementClaim                       → inventory-table authors, L0 ratification cycle
//   W-ATOM PlacementRecord                      → la-validator (G-PL1, G-PL5, G-PL6), code consumers (home consultation)
//   W-ATOM PlacementRegistry                    → la-validator (full G-PL* gate suite), code consumers, banner-emission code
//   W-ATOM PlacementValidityError               → la-validator callers (error surface)
//   W-ATOM PlacementValidationResult            → la-validator callers (Result-wrapped)
//   W-ATOM PlacementAxiomId                     → type consumers
//   W-ATOM PlacementAxiomGateId                 → type consumers
//   W-ATOM PlacementHandoffRuleId               → type consumers
// deps:
//   R5 ./primitives
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLACEMENT STANDARD v1.0 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// PL v1.0 landing: generated against metaframework-v3-1 v3.2.7 via
// generation-procedure-v1-0 v1.1.6. Mode-symmetric L3 sibling of LIV-Standard
// (orthogonal composition: LIV-Standard owns inside-slice; Placement Standard
// owns cross-tree placement). Mode = structural (known → structured).
// Canonical spec: PLACEMENT_REGISTRY.placement_standard
//   (Sprint Shot 3 refactor lands this banner; pre-Shot-3 readers may resolve
//    the registry-identifier reference to: frameworks/standards/placement-standard.md)
// PL-A1: declared once, in PLACEMENT_REGISTRY at core/R5. Consumers consult — never redeclare.

// placement-standard.types.ts
// R5 type atoms for Placement Standard v1.0
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: none at v1.0 (build-time substrate; no AS carriage)
//
// Consumes: primitives.ts (Semver, Result, AppError)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in placement-standard.md §6.4 Custody.
// Constraint: no R5 typed substrate atoms at this regen (post-beta per spec §scopeOut).

import type {
  Semver,
  Result,
  AppError,
} from './primitives'

// ─── Framework-local identifiers ─────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * Placement identifier — unique within PLACEMENT_REGISTRY.
 * Format convention: snake_case (e.g., 'placement_standard', 'perimeter_site',
 * 'slice_F_identity', 'phase_5_manifest_01').
 * Scope: PLACEMENT_REGISTRY (one registry per framework version).
 */
export type PlacementId = string & { readonly _brand: 'PlacementId' }

/**
 * PLACEMENT_REGISTRY version.
 * Semver-pattern string per substrate §7 conformance per PL-A3 versioned identity.
 * Bumps independently of framework version (registry-data mutations advance
 * registryVersion without forcing framework version bump per §5.2).
 */
export type PlacementVersion = string & { readonly _brand: 'PlacementVersion' }

// ─── PlacementItemKind enum (§3 Shot 1 taxonomy + spec §1 Identity scopeOut) ─

/**
 * PlacementItemKind — the five classes of LIV-shaped items the registry
 * declares placement for. Derived from sprint spec §3 Shot 1 taxonomy.
 * Bound to `PlacementRecord.itemKind` per PL-A5 (domain-bounded).
 * Additive per PR2 — new kinds enter via substrate amendment when an L4
 * tenant declares an item not fitting the existing five.
 */
export type PlacementItemKind =
  | 'framework'
  | 'cycle-record'
  | 'typed-runtime-projectroot'
  | 'build-config'
  | 'platform-tooling'

// ─── PlacementClaim (input atom; pre-ratification) ───────────────────────────

/**
 * PlacementClaim — proposed placement before L0 ratification.
 * Authored by inventory-table compositors at Sprint Shot 1 + future cycles.
 * Ratified PlacementClaims are written into PLACEMENT_REGISTRY as PlacementRecord.
 *
 * Captured verbatim at registry-write time per PL-A1.
 */
export type PlacementClaim = {
  itemId:       PlacementId
  itemKind:     PlacementItemKind
  proposedHome: string                // proposed canonical filesystem path relative to repo root
  rationale:    string                // declared structural reason for placement (length ≥ 1)
}

// ─── PlacementRecord (output atom; post-ratification) ────────────────────────

/**
 * PlacementRecord — ratified canonical placement.
 * Aggregated as PLACEMENT_REGISTRY (one record per registry key).
 *
 * PL-A1 invariant: every itemId appears as a registry key exactly once.
 * PL-A6 invariant: every itemId resolves to exactly one home (no multi-home).
 * PL-A5 invariant: itemKind ∈ PlacementItemKind enum.
 * PL-A3 invariant: registryVersion is Semver-pattern conformant per substrate §7.
 */
export type PlacementRecord = {
  itemId:          PlacementId
  itemKind:        PlacementItemKind
  home:            string             // ratified canonical filesystem path relative to repo root
  registryVersion: PlacementVersion   // version of PLACEMENT_REGISTRY at write time per PL-A3
  declaredAt:      string             // ISO 8601 timestamp at first registration
}

// ─── PlacementRegistry (aggregate map type) ──────────────────────────────────

/**
 * PlacementRegistry — keyed by PlacementId.
 * Concrete instance is the PLACEMENT_REGISTRY constant exported from
 * `src/core/constants/placement-standard.ts`.
 *
 * PL-A1 + PL-A6 jointly enforce: |keys| === |Object.keys(registry).length|
 * AND every key value resolves to exactly one PlacementRecord.
 */
export type PlacementRegistry = {
  [itemId: string]: PlacementRecord
}

// ─── Framework identifier ID atoms (mirror constants for runtime checks) ─────
// Pattern parallel to Plan v2.2 PlanAxiomId, M-I v2.3 MIAxiomId, VS v1.0 GateId
// per A-08 per-framework single-source-via-reference declaration discipline.

/**
 * PL axiom ID set type. Constants declared at
 * `src/core/constants/placement-standard.ts` PLACEMENT_AXIOM_IDS.
 */
export type PlacementAxiomId =
  | 'PL-A1'
  | 'PL-A2'
  | 'PL-A3'
  | 'PL-A4'
  | 'PL-A5'
  | 'PL-A6'

/**
 * PL gate ID set type (1:1 paired with axiom IDs per G-M1). Constants
 * declared at `src/core/constants/placement-standard.ts` PLACEMENT_AXIOM_GATE_IDS.
 */
export type PlacementAxiomGateId =
  | 'G-PL1'
  | 'G-PL2'
  | 'G-PL3'
  | 'G-PL4'
  | 'G-PL5'
  | 'G-PL6'

/**
 * PL handoff rule ID set type. Constants declared at
 * `src/core/constants/placement-standard.ts` PLACEMENT_HANDOFF_RULE_IDS.
 */
export type PlacementHandoffRuleId =
  | 'HR-PL1'
  | 'HR-PL2'
  | 'HR-PL3'

// ─── Operation result (la-validator emission surface) ────────────────────────

/**
 * Placement validation error payload. Uses canonical Result<T>/AppError
 * from primitives.ts.
 *
 * Emitted by la-validator §1.20.1 extension when a G-PL* gate fails OR
 * when registry shape is malformed pre-validation.
 *
 * Error code semantics (per §6.6 OperatorInterface.errorContract):
 *   - PLACEMENT_REGISTRY_KEY_COLLISION    → G-PL1 violation
 *   - PLACEMENT_HARDCODED_PATH            → G-PL2 violation
 *   - PLACEMENT_REGISTRY_VERSION_MALFORMED → G-PL3 violation
 *   - PLACEMENT_AMENDMENT_PROVENANCE_MISSING → G-PL4 violation
 *   - PLACEMENT_ITEM_KIND_OUT_OF_ENUM     → G-PL5 violation
 *   - PLACEMENT_MULTI_HOME                → G-PL6 violation
 *   - PLACEMENT_REGISTRY_MALFORMED        → pre-gate type-check failure
 */
export type PlacementValidityError = AppError & {
  code:
    | 'PLACEMENT_REGISTRY_KEY_COLLISION'
    | 'PLACEMENT_HARDCODED_PATH'
    | 'PLACEMENT_REGISTRY_VERSION_MALFORMED'
    | 'PLACEMENT_AMENDMENT_PROVENANCE_MISSING'
    | 'PLACEMENT_ITEM_KIND_OUT_OF_ENUM'
    | 'PLACEMENT_MULTI_HOME'
    | 'PLACEMENT_REGISTRY_MALFORMED'
  failedGate?: PlacementAxiomGateId   // populated for G-PL* failures; identifies which axiom failed
  violationDetail?: {
    file?:        string              // populated for G-PL2 hardcoded-path violations
    line?:        number              // populated for G-PL2 hardcoded-path violations
    itemId?:      PlacementId         // populated for G-PL1, G-PL5, G-PL6 violations
    foundValue?:  string              // populated for G-PL5 (out-of-enum kind value)
    expectedSet?: readonly string[]   // populated for G-PL5 (declared enum literal set)
  }
}

/**
 * Per-gate result shape (cycle-1 v1.3.3 decomposition per F-cycle-1-3).
 * Mirrors framework-audit §8.1 GateResult shape; instance content owned by
 * la-validator at validation-run time.
 *
 * Per substrate §10.1 S4 binary truth-value discipline:
 *   truthValue ∈ {'passed', 'failed', null}    // null when not yet executed
 *   executionState ∈ {'not-yet-run', 'executed'}
 *   applicability ∈ {'applicable', 'n/a'}
 *   basis: required when applicability = 'n/a' per MA-V11
 */
export type PlacementGateResult = {
  gateId:         PlacementAxiomGateId
  truthValue:     'passed' | 'failed' | null
  executionState: 'not-yet-run' | 'executed'
  applicability:  'applicable' | 'n/a'
  basis:          string | null
  evaluatedAt:    string                       // ISO 8601
  failureDetail:  PlacementValidityError | null
}

/**
 * Validation run result (la-validator §1.20.1 emission surface).
 * Aggregates per-gate results across one validation run.
 */
export type PlacementValidationResult = Result<
  {
    runId:                  string
    placementRegistryRef:   string             // path to registry constants file at validation time
    placementRegistryVersion: PlacementVersion
    gateResults:            PlacementGateResult[]
    aggregateExecutionState: 'all-not-yet-run' | 'partial-executed' | 'all-executed'
    aggregateTruthValue:    'passed' | 'failed' | null
    timestamp:              string
  },
  PlacementValidityError
>

// ─── End of placement-standard.types.ts ──────────────────────────────────────
