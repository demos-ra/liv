// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM InstanceTerminalState  ← core/R5 ../types/multi-instance-standard.types
//   W-ATOM SetTerminalState       ← core/R5 ../types/multi-instance-standard.types
//   W-ATOM ErrorClass             ← core/R5 ../types/multi-instance-standard.types
//   W-ATOM ErrorResolution        ← core/R5 ../types/multi-instance-standard.types
//   W-ATOM ShapePositional        ← core/R5 ../types/multi-instance-standard.types
//   W-ATOM BoundsPositional       ← core/R5 ../types/multi-instance-standard.types
// wires-out:
//   W-ATOM MI_FRAMEWORK_ID                    → all M-I consumers, registry
//   W-ATOM MI_FRAMEWORK_VERSION               → all M-I consumers, registry
//   W-ATOM MI_AXIOM_IDS                       → M-I engine slice (Phase 4b)
//   W-ATOM MIAxiomId                          → type consumers
//   W-ATOM MI_AXIOM_GATE_IDS                  → framework-audit
//   W-ATOM MIAxiomGateId                      → type consumers
//   W-ATOM MI_HANDOFF_RULE_IDS                → framework-audit
//   W-ATOM MIHandoffRuleId                    → type consumers
//   W-ATOM INSTANCE_TERMINAL_STATE_VALUES     → RunReport consumers
//   W-ATOM SET_TERMINAL_STATE_VALUES          → RunReport consumers
//   W-ATOM ERROR_CLASS_VALUES                 → RunReport consumers
//   W-ATOM ERROR_RESOLUTION_VALUES            → RunReport consumers
//   W-ATOM SHAPE_POSITIONAL_VALUES            → RunReport consumers
//   W-ATOM BOUNDS_POSITIONAL_VALUES           → RunReport consumers
//   W-ATOM MI_CONSUMED_PLAN_TOPOLOGIES        → Plan-consumer resolution
//   W-ATOM MIConsumedPlanTopology             → type consumers
//   W-ATOM MI_VALIDITY_ERROR_CODES            → error-surface consumers
//   W-ATOM MIValidityErrorCode                → type consumers
//   W-ATOM MI_P1_AXIS_COUNT..MI_P8_INSTANCE_COUNT → framework-audit, registry
//   W-ATOM MI_P7_EMPTY_DECLARATION            → framework-audit
//   W-ATOM MI_CARRIER                         → carrier resolution
//   W-ATOM MI_CARRIER_REF                     → carrier resolution (AS v2.2)
//   W-ATOM MI_P8_STEP_STAGES                  → framework-audit
//   W-ATOM MI_P8_STEP_KINDS                   → framework-audit
//   W-ATOM MI_P8_STAGE_4_SKIP_BASIS           → framework-audit
//   W-ATOM MI_PLAN_PIN / MI_AS_PIN            → cross-framework calibration
//   W-ATOM MI_METAFRAMEWORK_PIN               → registry
//   W-ATOM MI_GENERATION_PROCEDURE_PIN        → registry
//   W-ATOM MI_AXIOM_GATE_ONE_TO_ONE           → G-M1 self-check attestation
//   W-ATOM MI_HR_LENGTH_MATCH                 → self-check attestation
// deps:
//   R5 ../types/multi-instance-standard.types
// validated: pending

// ═══════════════════════════════════════════════════════════════
// MULTI-INSTANCE STANDARD v2.3 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Multi-Instance Standard v2.3 landing: regenerated against metaframework-v3-1;
// fix-round-1. Consumes Plan v2.2 by graph identity. Carrier pinned to AS v2.2.
// Canonical spec: src/core/standards/multi-instance-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard:   Multi-Instance Standard v2.3
// amended:    none
// slice:      core
// layer:      R5
// wires-in:   multi-instance-standard.types.ts (all type exports)
// wires-out:  R5 constants -> framework-audit, runtime slice, Verify
// deps:       multi-instance-standard.types.ts
// validated:  pending L0 (cycle-3 confirmation)

import type {
  InstanceTerminalState,
  SetTerminalState,
  ErrorClass,
  ErrorResolution,
  ShapePositional,
  BoundsPositional,
} from '../types/multi-instance-standard.types'

// ─── Framework identity ──────────────────────────────────────────────────────

export const MI_FRAMEWORK_ID = 'multi-instance' as const
export const MI_FRAMEWORK_VERSION = '2.3' as const

// ─── Axiom ID set (per §3.6 + §4.2) ──────────────────────────────────────────

export const MI_AXIOM_IDS = [
  'IA1',
  'IA2',
  'IA3',
  'IA4a',
  'IA4b',
  'IA5',
  'IA6',
  'IA7a',
  'IA7b',
  'IA7c',
] as const
export type MIAxiomId = (typeof MI_AXIOM_IDS)[number]

// ─── M-I-own axiom gate ID set (per §4.2) ────────────────────────────────────

export const MI_AXIOM_GATE_IDS = [
  'G-MI1',
  'G-MI2',
  'G-MI3',
  'G-MI4a',
  'G-MI4b',
  'G-MI5',
  'G-MI6',
  'G-MI7a',
  'G-MI7b',
  'G-MI7c',
] as const
export type MIAxiomGateId = (typeof MI_AXIOM_GATE_IDS)[number]

// ─── Handoff rule ID set (per §6.2) ──────────────────────────────────────────

export const MI_HANDOFF_RULE_IDS = [
  'HR-MI1',
  'HR-MI2',
  'HR-MI3',
  'HR-MI4',
] as const
export type MIHandoffRuleId = (typeof MI_HANDOFF_RULE_IDS)[number]

// ─── Enum literal sets (mirror type exports for runtime membership checks) ───

export const INSTANCE_TERMINAL_STATE_VALUES: readonly InstanceTerminalState[] = [
  'complete',
  'failed',
  'escalated',
] as const

export const SET_TERMINAL_STATE_VALUES: readonly SetTerminalState[] = [
  'complete',
  'failed',
  'escalated',
  'partial',
] as const

export const ERROR_CLASS_VALUES: readonly ErrorClass[] = [
  'CLASS_2',
  'CLASS_3',
] as const

export const ERROR_RESOLUTION_VALUES: readonly ErrorResolution[] = [
  'retried',
  'escalated',
  'terminal',
] as const

export const SHAPE_POSITIONAL_VALUES: readonly ShapePositional[] = [
  'dispatched',
  'settled',
] as const

export const BOUNDS_POSITIONAL_VALUES: readonly BoundsPositional[] = [
  'within',
  'breached',
] as const

// Plan-topology consumed by reference from Plan v2.2; values enumerated here for
// runtime convenience only (canonical source: plan-standard.ts).
export const MI_CONSUMED_PLAN_TOPOLOGIES = [
  'sequence',
  'tier',
  'loop',
  'singleton',
] as const
export type MIConsumedPlanTopology = (typeof MI_CONSUMED_PLAN_TOPOLOGIES)[number]

// ─── Validity error code set ─────────────────────────────────────────────────

export const MI_VALIDITY_ERROR_CODES = [
  'MI_PLAN_NOT_FOUND',
  'MI_PLAN_INVALID',
  'MI_AXIOM_VIOLATION',
  'MI_INHERITED_GATE_VIOLATION',
  'MI_AS_EMISSION_FAILED',
  'MI_ADAPTER_FAILURE',
  'MI_BINDING_RESOLUTION_FAILURE',
  'MI_SET_FAILSAFE_BREACH',
] as const
export type MIValidityErrorCode = (typeof MI_VALIDITY_ERROR_CODES)[number]

// ─── Primitive instance counts (per §3.2) ────────────────────────────────────

export const MI_P1_AXIS_COUNT = 3 as const
export const MI_P2_SUBAXIS_COUNT = 11 as const
export const MI_P3_LEAF_COUNT = 11 as const
export const MI_P4_AXIOM_COUNT = 10 as const
export const MI_P5_GATE_COUNT = 10 as const
export const MI_P6_HANDOFF_RULE_COUNT = 4 as const
export const MI_P7_INSTANCE_COUNT = 0 as const
export const MI_P8_INSTANCE_COUNT = 3 as const

// ─── P7 empty-declaration basis (per substrate §8.6) ─────────────────────────

export const MI_P7_EMPTY_DECLARATION = {
  primitiveKind: 'P7',
  instanceCount: 0,
  basis:
    "M-I's executeRun procedure is fully mechanical. Every axiom condition " +
    '(IA1-IA7c) reduces to substrate §6.3 mechanical-criterion ground: ' +
    'structural property (IA1, IA2, IA4b), deterministic-function result ' +
    '(IA3, IA6, IA7c), cardinality (IA4a, IA5, IA7b), enum membership ' +
    '(IA7a error class). No non-mechanical derivation required at S1, S2, ' +
    'or S3. MA-J4 emptyDeclared satisfied.',
} as const

// ─── Carrier (per §6.1) ──────────────────────────────────────────────────────

export const MI_CARRIER = 'named' as const
export const MI_CARRIER_REF: { id: string; version: string } = {
  id: 'artifact-standard',
  version: '2.2',
} as const

// ─── P8 stage assignments (per §3.7) ─────────────────────────────────────────

export const MI_P8_STEP_STAGES = {
  S1: 2,
  S2: 3,
  S3: 5,
} as const

export const MI_P8_STEP_KINDS = {
  S1: 'mechanical',
  S2: 'gate-execution',
  S3: 'mechanical',
} as const

// Stage 4 positively skipped per §3.7 PR4 note (P7 = 0 empty-declared).
export const MI_P8_STAGE_4_SKIP_BASIS: string =
  'Stage 4 (judgment observation) positively skipped: P7 instance count = 0 per §3.2; ' +
  'no judgment input to observe at runtime. Skipping permitted under PR4 monotonicity ' +
  'when intermediate stage has no required kind populated per PR5.'

// ─── Cross-framework pins (per §1 + §6.5) ────────────────────────────────────

export const MI_PLAN_PIN: { id: string; version: string } = {
  id: 'plan-standard',
  version: '2.2',
} as const

export const MI_AS_PIN: { id: string; version: string } = {
  id: 'artifact-standard',
  version: '2.2',
} as const

export const MI_METAFRAMEWORK_PIN: { id: string; version: string } = {
  id: 'metaframework',
  version: '3.2.1',
} as const

export const MI_GENERATION_PROCEDURE_PIN: { id: string; version: string } = {
  id: 'generation-procedure',
  version: '1.1.1',
} as const

// ─── Sanity invariants (documentary; runtime self-check convenience) ─────────

// Length consistency: P4 axiom count === P5 gate count === 10 (G-M1 1:1).
// Length consistency: P6 handoff rule count === HR ID array length === 4.
// These asserts are compile-time via `as const`; no runtime body required.
export const MI_AXIOM_GATE_ONE_TO_ONE = MI_AXIOM_IDS.length === MI_AXIOM_GATE_IDS.length
export const MI_HR_LENGTH_MATCH = MI_HANDOFF_RULE_IDS.length === MI_P6_HANDOFF_RULE_COUNT
