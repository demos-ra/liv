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
//   W-ATOM LM_FRAMEWORK_ID                         → all LM consumers, registry
//   W-ATOM LM_FRAMEWORK_VERSION                    → all LM consumers, registry
//   W-ATOM LM_AXIOM_IDS                            → LM runtime, framework-audit (LMA1..LMA19 w/ LMA13 split = 20)
//   W-ATOM LMAxiomId                               → type consumers
//   W-ATOM LM_AXIOM_GATE_IDS                       → framework-audit (G-LM1..G-LM19 w/ G-LM13 split = 20, 1:1 per G-M1)
//   W-ATOM LMAxiomGateId                           → type consumers
//   W-ATOM LM_HANDOFF_RULE_IDS                     → framework-audit (HR-LM1..HR-LM6)
//   W-ATOM LMHandoffRuleId                         → type consumers
//   W-ATOM LM_EDGE_PRIMITIVE_TYPE_VALUES           → F-codec routing, AS v2.2 edge-kind
//   W-ATOM LM_SUBSTANCE_DECISION_VALUES            → LM runtime (LMA7)
//   W-ATOM LM_DYNAMICS_PHASE_VALUES                → LM internal, framework-audit
//   W-ATOM LM_TRAVERSAL_STATE_VALUES               → LM internal, framework-audit
//   W-ATOM LM_DERIVATION_KIND_VALUES               → LM internal, framework-audit
//   W-ATOM LM_SUBSTANCE_POSITIONAL_VALUES          → framework-audit
//   W-ATOM LM_CONFIDENCE_TIER_VALUES               → F-chat present-state consumers
//   W-ATOM LM_MLAYER_VALUES                        → all graph-aware consumers
//   W-ATOM LM_CARRIER                              → carrier resolution ('self')
//   W-ATOM LM_P7_INSTANCE_COUNT                    → framework-audit (0 positive-empty)
//   W-ATOM LM_P7_EMPTY_DECLARATION_BASIS           → framework-audit
//   W-ATOM LM_P8_INSTANCE_COUNT                    → framework-audit (8 steps S1..S8)
//   W-ATOM LM_P8_STEP_IDS                          → framework-audit
//   W-ATOM LMProcedureStepId                       → type consumers
//   W-ATOM M4_INPUT / M3_CONTEXT / M2_KNOWLEDGE / M1_MEANING / M0_IDENTITY
//                                                   → all M-layer consumers
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// LIVING MEMORY v2.1 — R5 CONSTANTS
// ═══════════════════════════════════════════════════════════════
// Living Memory v2.1 landing: regenerated against metaframework-v3-1
// (cycle-5 audit pass-all). 20 axioms (LMA1..LMA19 w/ LMA13 split) and
// 20 corresponding gates G-LM1..G-LM19 (1:1 per G-M1).
// Canonical spec: src/core/standards/living-memory.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// living-memory.ts
// R5 constants for Living Memory v2.1
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Artifact Standard v2.2 / Plan Standard v2.2 / Multi-Instance Standard v2.3
//
// Discipline: declared IDs + enum literal sets only. No runtime logic.
// Custody: every constant declared here has a row in living-memory-v2-1.md §6.

// ─── Framework identity ──────────────────────────────────────────────────────

export const LM_FRAMEWORK_ID = 'living-memory' as const
export const LM_FRAMEWORK_VERSION = '2.1' as const

// ─── Axiom IDs (§3.6; 20 atomic per LMA13 split) ────────────────────────────
// AxR1 + AxR2 + AxR3 + AxR4 + MA-V1 all satisfied.

export const LM_AXIOM_IDS = [
  'LMA1',
  'LMA2',
  'LMA3',
  'LMA4',
  'LMA5',
  'LMA6',
  'LMA7',
  'LMA8',
  'LMA9',
  'LMA10',
  'LMA11',
  'LMA12',
  'LMA13a',
  'LMA13b',
  'LMA14',
  'LMA15',
  'LMA16',
  'LMA17',
  'LMA18',
  'LMA19',
] as const

export type LMAxiomId = typeof LM_AXIOM_IDS[number]

// Axiom count enumerated explicitly above; array length is the canonical count = 20.
// 19 Roman-numeral IDs (LMA1..LMA19) plus LMA13's atomicity-split into LMA13a + LMA13b.

// ─── Axiom gate IDs (§4.2; 1:1 with axioms per G-M1) ────────────────────────

export const LM_AXIOM_GATE_IDS = [
  'G-LM1',      // tests LMA1
  'G-LM2',      // tests LMA2
  'G-LM3',      // tests LMA3
  'G-LM4',      // tests LMA4
  'G-LM5',      // tests LMA5
  'G-LM6',      // tests LMA6
  'G-LM7',      // tests LMA7
  'G-LM8',      // tests LMA8
  'G-LM9',      // tests LMA9
  'G-LM10',     // tests LMA10
  'G-LM11',     // tests LMA11
  'G-LM12',     // tests LMA12
  'G-LM13a',    // tests LMA13a
  'G-LM13b',    // tests LMA13b
  'G-LM14',     // tests LMA14
  'G-LM15',     // tests LMA15
  'G-LM16',     // tests LMA16
  'G-LM17',     // tests LMA17
  'G-LM18',     // tests LMA18
  'G-LM19',     // tests LMA19
] as const

export type LMAxiomGateId = typeof LM_AXIOM_GATE_IDS[number]

// ─── LM-local handoff rule IDs (§6.2) ───────────────────────────────────────

export const LM_HANDOFF_RULE_IDS = [
  'HR-LM1',     // caller → living-memory (traverse)
  'HR-LM2',     // caller → living-memory (direct-insert)
  'HR-LM3',     // caller → living-memory (read surface)
  'HR-LM4',     // living-memory → F-event-system
  'HR-LM5',     // living-memory → artifact-standard v2.2 (emission-target receive-side)
  'HR-LM6',     // living-memory → framework-audit (audit-query receive-side)
] as const

export type LMHandoffRuleId = typeof LM_HANDOFF_RULE_IDS[number]

// ─── Edge primitive type enum literal set (§3.5 leaf) ───────────────────────

export const LM_EDGE_PRIMITIVE_TYPE_VALUES = [
  'anchor',
  'relate',
  'restructure',
  'reinforce',
  'suppress',
] as const

// ─── Substance decision enum literal set (§3.6 LMA7) ────────────────────────

export const LM_SUBSTANCE_DECISION_VALUES = [
  'create',
  'reinforce',
] as const

// ─── Dynamics phase enum literal set (§3.8 universal-variables table) ──────

export const LM_DYNAMICS_PHASE_VALUES = [
  'reception',
  'redistribution',
  'reinforcement',
  'pruning',
  'commit',
] as const

// ─── Traversal state enum literal set (§3.8) ───────────────────────────────

export const LM_TRAVERSAL_STATE_VALUES = [
  'pending',
  'binding',
  'propagating',
  'committed',
  'aborted',
] as const

// ─── Derivation kind enum literal set (§3.8) ───────────────────────────────

export const LM_DERIVATION_KIND_VALUES = [
  'metric',
  'layer',
  'dominance',
  'arm',
  'present-state',
] as const

// ─── Substance positional enum literal set (§3.8) ──────────────────────────

export const LM_SUBSTANCE_POSITIONAL_VALUES = [
  'declared',
  'persisted',
] as const

// ─── Confidence tier enum literal set (§3.5 leaf-present-state) ────────────

export const LM_CONFIDENCE_TIER_VALUES = [
  'identity',
  'purpose',
  'consolidated',
  'recent',
  'new',
] as const

// ─── M-layer enum literal set (§3.5 leaf-layer-assignment) ──────────────────
// Integer enum M0..M4; also exported as named constants in living-memory.types.ts.

export const LM_MLAYER_VALUES = [0, 1, 2, 3, 4] as const

// ─── Carrier declaration (§6.1) ─────────────────────────────────────────────

export const LM_CARRIER = 'self' as const

// LM has no carrier framework reference — carrier = self means LM owns its own
// emission mechanics (the traverse → persistMutations pipeline).

// ─── P7 declaration: empty per MA-J4 (fully mechanical) ─────────────────────

export const LM_P7_INSTANCE_COUNT = 0 as const
export const LM_P7_EMPTY_DECLARATION_BASIS: string =
  'LM runtime decisions (M-layer assignment via computeLayer, survives threshold check, substance-decision, graphThresholds derivation) all reduce to substrate §6.3 mechanical-criterion ground. ' +
  'LMA15 asserts computeLayer purity; LMA17 asserts M0 assignment mechanical-decision-tree; LMA8 asserts survives biconditional; thresholds are μ + kσ arithmetic over graph statistics. ' +
  'No LM decision consumes a non-mechanical judgment input. MA-J4 emptyDeclared satisfied with positive basis.'

// ─── P8 declaration: 8 instances (Mode = generative per substrate §8.3) ─────
// LM is Mode=generative; P8 is required. Steps S1–S8 declared in framework §3.7.

export const LM_P8_INSTANCE_COUNT = 8 as const

export const LM_P8_STEP_IDS = [
  'S1',   // Stage 1 judgment-input: input receipt + scope validation
  'S2',   // Stage 2 mechanical: bind phase (reception)
  'S3',   // Stage 2 mechanical: propagate + learn (redistribution + reinforcement)
  'S4',   // Stage 2 mechanical: sparsify + aggregate GraphMutation draft
  'S5',   // Stage 3 gate-execution: LM-own gates G-LM1..G-LM12 commit-time
  'S6',   // Stage 3 gate-execution: 52 inherited framework-tier gates (executed by framework-audit)
  'S7',   // Stage 5 mechanical: persistMutations atomic commit + event emission
  'S8',   // Stage 5 mechanical: post-commit derivations (async)
] as const

export type LMProcedureStepId = typeof LM_P8_STEP_IDS[number]

// PR4 stage monotonicity across S1..S8: stages [1, 2, 2, 2, 3, 3, 5, 5].
// Non-decreasing; Stage 4 skipped (no P7 judgment-observation step).
// PR5 stage-kind alignment:
//   S1 stage=1 → judgment-input ✓
//   S2/S3/S4 stage=2 → mechanical ✓
//   S5/S6 stage=3 → gate-execution ✓
//   S7/S8 stage=5 → mechanical ✓
// Both self-checks pass; see framework §3.7.1.

// ─── M-layer named constants (re-export from types for convenience) ─────────

export const M4_INPUT     = 4 as const
export const M3_CONTEXT   = 3 as const
export const M2_KNOWLEDGE = 2 as const
export const M1_MEANING   = 1 as const
export const M0_IDENTITY  = 0 as const

// ─── End of living-memory.ts ────────────────────────────────────────────────
