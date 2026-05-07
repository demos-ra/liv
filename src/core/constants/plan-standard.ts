// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in: none
// wires-out:
//   W-ATOM PLAN_FRAMEWORK_ID                    → all plan consumers, registry
//   W-ATOM PLAN_FRAMEWORK_VERSION               → all plan consumers, registry
//   W-ATOM PLAN_AXIOM_IDS                       → any slice emitting plans
//   W-ATOM PlanAxiomId                          → type consumers
//   W-ATOM PLAN_AXIOM_GATE_IDS                  → framework-audit
//   W-ATOM PlanAxiomGateId                      → type consumers
//   W-ATOM PLAN_HANDOFF_RULE_IDS                → framework-audit
//   W-ATOM PlanHandoffRuleId                    → type consumers
//   W-ATOM PLAN_TOPOLOGY_VALUES                 → any slice consuming plans
//   W-ATOM PLAN_LIMIT_KIND_VALUES               → plan consumers
//   W-ATOM PLAN_SHAPE_POSITIONAL_VALUES         → plan consumers
//   W-ATOM PLAN_INTENT_POSITIONAL_VALUES        → plan consumers
//   W-ATOM PLAN_CAPACITY_POSITIONAL_VALUES      → plan consumers
//   W-ATOM PLAN_LIMIT_POSITIONAL_VALUES         → plan consumers
//   W-ATOM PLAN_LIMIT_SCOPE_VALUES              → plan consumers
//   W-ATOM PLAN_P8_INSTANCE_COUNT               → framework-audit, registry
//   W-ATOM PLAN_P8_EMPTY_DECLARATION_BASIS      → framework-audit
//   W-ATOM PLAN_P7_INSTANCE_COUNT               → framework-audit, registry
//   W-ATOM PLAN_P7_EMPTY_DECLARATION_BASIS      → framework-audit
//   W-ATOM PLAN_CARRIER                         → carrier resolution
//   W-ATOM PLAN_CARRIER_REF                     → carrier resolution (artifact-standard v2.2)
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PLAN STANDARD v2.2 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Plan Standard v2.2 landing: regenerated against metaframework-v3-1;
// fix-round-1 + fix-round-2. Carrier pinned to Artifact Standard v2.2.
// Canonical spec: PLACEMENT_REGISTRY.plan_standard
// A1: declared once, at R5 core. Slices import — never redeclare.

// plan-standard.ts
// R5 constants for Plan Standard v2.2
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2
//
// Discipline: declared IDs + enum literal sets only. No runtime logic.
// Custody: every constant declared here has a row in plan-standard-v2-2.md §6.

// ─── Framework identity ──────────────────────────────────────────────────────

export const PLAN_FRAMEWORK_ID = 'plan' as const
export const PLAN_FRAMEWORK_VERSION = '2.2' as const

// ─── Axiom IDs (§3.6; 14 per MA-V1 + AxR1/AxR2/AxR3/AxR4) ───────────────────

export const PLAN_AXIOM_IDS = [
  'PA1',
  'PA2a',
  'PA2b',
  'PA3',
  'PA4a',
  'PA4b',
  'PA5',
  'PA6',
  'PA7',
  'PA8',
  'PA9',
  'PA10a',
  'PA10b',
  'PA11',
  'PA12',
] as const

export type PlanAxiomId = typeof PLAN_AXIOM_IDS[number]

// NOTE: 14 PA-entries, not 15. PA2a/PA2b and PA4a/PA4b and PA10a/PA10b are the
// E6-atomicity-decomposed forms of v1.0's PA2, PA4, PA10 single-axioms (§3.6 AxR3 trail).
// PA3 covers v2.1 contracts-resolve condition; PA11 + PA12 were separated from v1.0 PA3 prose.
// Axiom count enumerated explicitly above; array length is the canonical count.

// ─── Axiom gate IDs (§4.2; 1:1 with axioms per G-M1) ────────────────────────

export const PLAN_AXIOM_GATE_IDS = [
  'G-Pl1',      // tests PA1
  'G-Pl2a',     // tests PA2a
  'G-Pl2b',     // tests PA2b
  'G-Pl3',      // tests PA3
  'G-Pl4a',     // tests PA4a
  'G-Pl4b',     // tests PA4b
  'G-Pl5',      // tests PA5
  'G-Pl6',      // tests PA6
  'G-Pl7',      // tests PA7
  'G-Pl8',      // tests PA8
  'G-Pl9',      // tests PA9
  'G-Pl10a',    // tests PA10a
  'G-Pl10b',    // tests PA10b
  'G-Pl11',     // tests PA11
  'G-Pl12',     // tests PA12
] as const

export type PlanAxiomGateId = typeof PLAN_AXIOM_GATE_IDS[number]

// ─── Plan-local handoff rule IDs (§6.2) ─────────────────────────────────────

export const PLAN_HANDOFF_RULE_IDS = [
  'HR-Pl1',     // authoring-program → Plan
  'HR-Pl2',     // domain-standard → Plan (binding consumption)
  'HR-Pl3',     // Plan → artifact-standard v2.2 (carrier emission)
  'HR-Pl4',     // Plan → multi-instance-standard (read via plan anchor)
] as const

export type PlanHandoffRuleId = typeof PLAN_HANDOFF_RULE_IDS[number]

// ─── Topology enum literal set (§3.5 Shape/topology leaf) ───────────────────

export const PLAN_TOPOLOGY_VALUES = [
  'sequence',
  'tier',
  'loop',
  'singleton',
] as const

// ─── Limit-kind enum literal set (§3.5 Limit/kind leaf) ─────────────────────

export const PLAN_LIMIT_KIND_VALUES = [
  'retry',
  'maxTime',
  'maxTransitions',
  'maxReentries',
  'domainFailsafe',
  'partialSuccess',
] as const

// ─── Positional enum literal sets (§3.8 universal-variables table) ──────────

export const PLAN_SHAPE_POSITIONAL_VALUES    = ['pending', 'emitted', 'superseded'] as const
export const PLAN_INTENT_POSITIONAL_VALUES   = ['unbound', 'bound'] as const
export const PLAN_CAPACITY_POSITIONAL_VALUES = ['within-budget', 'over-budget', 'split'] as const
export const PLAN_LIMIT_POSITIONAL_VALUES    = ['unconsumed', 'consumed', 'breached'] as const
export const PLAN_LIMIT_SCOPE_VALUES         = ['declaration', 'set'] as const

// ─── P8 declaration: empty per substrate §8.3 (Mode = generative only) ──────
// Plan Mode = 'structural' per §1 Identity. Therefore no P8 instances.
// Positive empty-declaration per substrate §8.6.

export const PLAN_P8_INSTANCE_COUNT = 0 as const
export const PLAN_P8_EMPTY_DECLARATION_BASIS: string =
  'Plan Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = generative only. ' +
  'Plan has zero P8 instances per substrate §8.6 empty-declaration derivation. ' +
  'Plan\'s composition pipeline is owned upstream by the authoring program (pre-schema.input); ' +
  'Plan\'s emission-time validity is enforced mechanically by PA1..PA12 gate bundle at the AS v2.2 ' +
  'carrier invocation site (§7.3 carrier relation), not by a P8 procedure within Plan.'

// ─── P7 declaration: empty per MA-J4 (fully mechanical) ─────────────────────

export const PLAN_P7_INSTANCE_COUNT = 0 as const
export const PLAN_P7_EMPTY_DECLARATION_BASIS: string =
  'Plan\'s validity check is fully mechanical per v2.1 §10: "invalid plan is not emitted; ' +
  'emission is rejected with a structured error naming the failed axiom." Every PA1..PA12 ' +
  'condition reduces to substrate §6.3 mechanical-criterion ground (reference resolution, ' +
  'acyclicity, cardinality, structural property). No judgment inputs consumed.'

// ─── Carrier declaration (§6.1) ─────────────────────────────────────────────

export const PLAN_CARRIER = 'named' as const
export const PLAN_CARRIER_REF = {
  id:      'artifact-standard',
  version: '2.2',
} as const

// ─── End of plan-standard.ts ────────────────────────────────────────────────
