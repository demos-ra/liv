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
//   W-ATOM PERIMETER_FRAMEWORK_ID                    → all PS consumers, registry
//   W-ATOM PERIMETER_FRAMEWORK_VERSION               → all PS consumers, registry
//   W-ATOM PERIMETER_AXIOM_IDS                       → any slice emitting BoundaryCrossingRecord
//   W-ATOM PerimeterAxiomId                          → type consumers
//   W-ATOM PERIMETER_AXIOM_GATE_IDS                  → framework-audit, F-identity middleware
//   W-ATOM PerimeterAxiomGateId                      → type consumers
//   W-ATOM PERIMETER_HANDOFF_RULE_IDS                → framework-audit
//   W-ATOM PerimeterHandoffRuleId                    → type consumers
//   W-ATOM CHANNEL_KIND_ENUM                         → F-identity middleware (PA-Cn2 enum membership target)
//   W-ATOM DIRECTION_KIND_ENUM                       → F-identity middleware
//   W-ATOM DISPOSITION_KIND_ENUM                     → F-identity middleware
//   W-ATOM CELL_KIND_ENUM                            → F-identity middleware
//   W-ATOM GOVERNANCE_LEVEL_ENUM                     → F-identity middleware
//   W-ATOM RESOLUTION_OUTCOME_KIND_ENUM              → F-identity middleware
//   W-ATOM REVERSIBILITY_FLAG_ENUM                   → F-identity middleware
//   W-ATOM CONFIRMATION_STATUS_ENUM                  → F-identity middleware
//   W-ATOM AUDIT_STATUS_ENUM                         → F-identity middleware
//   W-ATOM FOUR_CELL_GOVERNANCE_MAP                  → F-identity middleware (PA-T2 mechanical mapping)
//   W-ATOM PERIMETER_DIRECTION_POSITIONAL_VALUES     → all PS consumers
//   W-ATOM PERIMETER_DISPOSITION_POSITIONAL_VALUES   → all PS consumers
//   W-ATOM PERIMETER_AUTHORITY_POSITIONAL_VALUES     → all PS consumers
//   W-ATOM PERIMETER_CHANNEL_POSITIONAL_VALUES       → all PS consumers
//   W-ATOM PERIMETER_IDENTITY_RESOLUTION_POSITIONAL_VALUES → all PS consumers
//   W-ATOM PERIMETER_CORRELATION_POSITIONAL_VALUES   → all PS consumers
//   W-ATOM PERIMETER_P8_INSTANCE_COUNT               → framework-audit, registry
//   W-ATOM PERIMETER_P8_EMPTY_DECLARATION_BASIS      → framework-audit
//   W-ATOM PERIMETER_CARRIER                         → carrier resolution
//   W-ATOM PERIMETER_CARRIER_REF                     → carrier resolution
//   W-ATOM LIV_INSTANCE_PERIMETER_SITE_REF           → F-identity middleware (PA-I + PA-A6 unitary site identifier)
//   W-ATOM DEFAULT_PERIMETER_BINDING                 → F-identity middleware (deployment default; G-PS-Cn3 vacuous-pass target at v1.0)
// deps: none
// validated: pending

// ═══════════════════════════════════════════════════════════════
// PERIMETER STANDARD v1.0 — CONSTANTS
// ═══════════════════════════════════════════════════════════════
// PS v1.0 landing: generated against metaframework-v3-1 v3.2.7 via
// generation-procedure-v1-0 v1.1.6.
// Canonical spec: F-FORWARD-1 (governance doc not yet authored; see PLACEMENT_REGISTRY change log)
// A1: declared once, at R5 core. Slices import — never redeclare.

// perimeter-standard.ts
// R5 constants for Perimeter Standard v1.0
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Cross-framework calibration: Living Memory v3.1
//
// Discipline: declared IDs + enum literal sets only. No runtime logic.
// Custody: every constant declared here has a row in perimeter-standard.md §6.5 Custody.

// ─── Framework identity ──────────────────────────────────────────────────────

// ─── Cross-tree placement (PL-A1 inverted, Sprint 9 Shot 1) ────────────────
// Per inverted Placement Standard PL-A1: middleware.ts declares its own
// kind+placement inline. The canonical path is the self-declaration on that file.
// Static literal replaces registry lookup; value is authoritative per PL-A1 inversion.
// PLACEMENT_REGISTRY import removed — registry dissolved at Sprint 9 Shot 1 (Stream A).

export const PERIMETER_FRAMEWORK_ID = 'perimeter' as const
export const PERIMETER_FRAMEWORK_VERSION = '1.0' as const

// ─── Axiom IDs (§3.6; 22 per MA-V1 + AxR1/AxR2/AxR3/AxR4) ───────────────────
// 21 axis-bound (PA1, PA2, PA-T1..PA-T4, PA-A1..PA-A6, PA-Cn1..PA-Cn4,
// PA-IR1..PA-IR4, PA-Co1..PA-Co3) + 1 Identity-tier (PA-I).

export const PERIMETER_AXIOM_IDS = [
  // Direction axis
  'PA1',
  'PA2',
  // Arrival Typing axis
  'PA-T1',
  'PA-T2',
  'PA-T3',
  'PA-T4',
  // Authority Enforcement axis
  'PA-A1',
  'PA-A2',
  'PA-A3',
  'PA-A4',
  'PA-A5',
  'PA-A6',
  // Channel Classification axis
  'PA-Cn1',
  'PA-Cn2',
  'PA-Cn3',
  'PA-Cn4',
  // Identity Resolution axis
  'PA-IR1',
  'PA-IR2',
  'PA-IR3',
  'PA-IR4',
  // Correlation axis
  'PA-Co1',
  'PA-Co2',
  'PA-Co3',
  // Identity-tier (Unitarity assertion per §1.4)
  'PA-I',
] as const

export type PerimeterAxiomId = typeof PERIMETER_AXIOM_IDS[number]

// ─── Axiom gate IDs (§4.2; 1:1 with axioms per G-M1) ────────────────────────

export const PERIMETER_AXIOM_GATE_IDS = [
  'G-PS1',         // tests PA1
  'G-PS2',         // tests PA2
  'G-PS-T1',       // tests PA-T1
  'G-PS-T2',       // tests PA-T2
  'G-PS-T3',       // tests PA-T3
  'G-PS-T4',       // tests PA-T4
  'G-PS-A1',       // tests PA-A1
  'G-PS-A2',       // tests PA-A2
  'G-PS-A3',       // tests PA-A3
  'G-PS-A4',       // tests PA-A4
  'G-PS-A5',       // tests PA-A5
  'G-PS-A6',       // tests PA-A6
  'G-PS-Cn1',      // tests PA-Cn1
  'G-PS-Cn2',      // tests PA-Cn2
  'G-PS-Cn3',      // tests PA-Cn3
  'G-PS-Cn4',      // tests PA-Cn4
  'G-PS-IR1',      // tests PA-IR1
  'G-PS-IR2',      // tests PA-IR2
  'G-PS-IR3',      // tests PA-IR3
  'G-PS-IR4',      // tests PA-IR4
  'G-PS-Co1',      // tests PA-Co1
  'G-PS-Co2',      // tests PA-Co2
  'G-PS-Co3',      // tests PA-Co3
  'G-PS-I',        // tests PA-I (Unitarity)
] as const

export type PerimeterAxiomGateId = typeof PERIMETER_AXIOM_GATE_IDS[number]

// ─── PS-local handoff rule IDs (§6.2) ───────────────────────────────────────

export const PERIMETER_HANDOFF_RULE_IDS = [
  'HR-PS1',        // program/route → PS (intake claim receipt)
  'HR-PS2',        // program/route → PS (dispatch request submission)
  'HR-PS3',        // PS → consumer (post-crossing return: ResolvedIdentity, cellGovernance, correlation-index query)
  'HR-PS-LM1',     // PS → Living Memory v3.1 (intake substrate-write emission via SubstrateWriteInput)
  'HR-PS4',        // PS → consumer (observability/replay/audit; receipt-only, captured via HR-PS-LM1 + LM HR-LM1)
] as const

export type PerimeterHandoffRuleId = typeof PERIMETER_HANDOFF_RULE_IDS[number]

// ─── ChannelKind enum (§3.3 PA-Cn1..PA-Cn4; open-vocabulary per Manual §I.6) ─
// G-PS-Cn2 at v1.0 evaluates against this declared set with open-vocabulary
// admission per spec §S3 additive extension discipline. Future amendments may
// tighten to declared-set-only — at v1.0 the enum is the named seed plus any
// runtime-supplied string.

export const CHANNEL_KIND_ENUM = [
  'wearer-message',
  'wearer-query',
  'ai-reply',
  'system-trigger',
  'integration-event',
  'scheduled-trigger',
  'internal-derivation',
] as const

// ─── DirectionKind enum (§3.3 PA1) ──────────────────────────────────────────

export const DIRECTION_KIND_ENUM = ['intake', 'dispatch'] as const

// ─── DispositionKind enum (§3.3 PA-T1; per Manual §IV.2) ────────────────────

export const DISPOSITION_KIND_ENUM = ['act', 'reference'] as const

// ─── CellKind enum (§3.3 PA-T2; Manual §IV.2 four-cell table) ──────────────

export const CELL_KIND_ENUM = [
  'reference-intake',
  'act-intake',
  'reference-dispatch',
  'act-dispatch',
] as const

// ─── GovernanceLevel enum (§3.3 PA-T2; per Manual §IV.2 cell governance) ────

export const GOVERNANCE_LEVEL_ENUM = [
  'lightweight',
  'confirmation-audit-reversibility',
  'world-effect-strongest',
] as const

// ─── ResolutionOutcomeKind enum (§3.3 PA-IR2) ───────────────────────────────

export const RESOLUTION_OUTCOME_KIND_ENUM = [
  'bound-to-existing-Ref',
  'new-Ref-created',
  'ambiguous-pending-disambiguation',
] as const

// ─── ReversibilityFlag enum (§3.3 PA-T4) ────────────────────────────────────

export const REVERSIBILITY_FLAG_ENUM = [
  'reversible',
  'irreversible',
  'n/a',
] as const

// ─── ConfirmationStatus enum (§3.3 PA-T2 cell governance) ───────────────────

export const CONFIRMATION_STATUS_ENUM = [
  'not-required',
  'required-pending',
  'required-confirmed',
] as const

// ─── AuditStatus enum (§3.3 PA-T2 cell governance) ──────────────────────────

export const AUDIT_STATUS_ENUM = ['not-required', 'recorded'] as const

// ─── Four-cell governance map (§3.6 PA-T2 mechanical mapping per Manual §IV.2)
// Direction × Disposition → CellKind → GovernanceLevel.
// Used by F-identity middleware at PA-T2 enforcement.

export const FOUR_CELL_GOVERNANCE_MAP = {
  // Reference-intake: lightweight per Manual §IV.2 (provenance preserved, no confirmation)
  'reference-intake': {
    governanceLevel:     'lightweight',
    confirmationStatus:  'not-required',
    auditStatus:         'not-required',
    reversibilityStatus: 'n/a',
  },
  // Act-intake: confirmation/audit/reversibility per Manual §IV.2 (substrate mutation)
  'act-intake': {
    governanceLevel:     'confirmation-audit-reversibility',
    confirmationStatus:  'required-pending',
    auditStatus:         'recorded',
    reversibilityStatus: 'n/a',
  },
  // Reference-dispatch: lightweight per Manual §IV.2 (rendering accumulated content)
  'reference-dispatch': {
    governanceLevel:     'lightweight',
    confirmationStatus:  'not-required',
    auditStatus:         'not-required',
    reversibilityStatus: 'n/a',
  },
  // Act-dispatch: world-effect-strongest per Manual §IV.2 (external-to-LIV side effect)
  // PA-T4 requires reversibilityStatus ∈ {'reversible', 'irreversible'} — populated
  // at runtime by emitting program; placeholder 'irreversible' here is conservative
  // default subject to override.
  'act-dispatch': {
    governanceLevel:     'world-effect-strongest',
    confirmationStatus:  'required-pending',
    auditStatus:         'recorded',
    reversibilityStatus: 'irreversible',
  },
} as const

// ─── Positional enum literal sets (§3.8 universal-variables table) ──────────

export const PERIMETER_DIRECTION_POSITIONAL_VALUES =
  ['pending', 'crossed'] as const

export const PERIMETER_DISPOSITION_POSITIONAL_VALUES =
  ['declared', 'cell-governed'] as const

export const PERIMETER_AUTHORITY_POSITIONAL_VALUES =
  ['claim-received', 'validated', 'rejected'] as const

export const PERIMETER_CHANNEL_POSITIONAL_VALUES =
  ['claimed', 'resolved', 'rejected'] as const

export const PERIMETER_IDENTITY_RESOLUTION_POSITIONAL_VALUES =
  ['attempted', 'resolved', 'ambiguous-pending'] as const

export const PERIMETER_CORRELATION_POSITIONAL_VALUES =
  ['self-correlated', 'linked'] as const

// ─── P8 declaration: empty per substrate §8.3 (Mode = generative only) ──────
// PS Mode = 'structural' per §1 Identity. Therefore no P8 instances.
// Positive empty-declaration per substrate §8.6.

export const PERIMETER_P8_INSTANCE_COUNT = 0 as const
export const PERIMETER_P8_EMPTY_DECLARATION_BASIS: string =
  'PS Mode = structural per §1 Identity. Substrate §8.3 binds P8 to Mode = ' +
  'generative only. PS has zero P8 instances per substrate §8.6 empty-declaration ' +
  'derivation. PS\'s gate-procedure semantics — what the perimeter does at each ' +
  'crossing — are captured declaratively as the PA1..PA-I axiom set and ' +
  'G-PS1..G-PS-I gate set; runtime invocation of gates at every crossing is ' +
  'owned by F-identity slice (L4 program), outside PS\'s P8 scope. Precedent: ' +
  'Plan Standard v2.2 §3.7 + Research Standard v1.0 §3.7 declare the same ' +
  'empty-P8 pattern under structural and epistemic mode respectively.'

// ─── Carrier declaration (§6.1) ─────────────────────────────────────────────
// PS carrier = `named` → `living-memory` v3.1 per spec §6.1 + Sprint 6 Shot 1
// D2 ratification. Distinct from VS/RS/Plan AS-carriered pattern: PS produces
// typed signal that lands in LM as substrate state-change (via SubstrateWriteInput
// at HR-PS-LM1), not artifacts about the work.

export const PERIMETER_CARRIER = 'named' as const
export const PERIMETER_CARRIER_REF = {
  id:      'living-memory',
  version: '3.1',
} as const

// ─── Unitary site reference (§1.4 + §3.6 PA-I + PA-A6) ──────────────────────
// LIV_INSTANCE_PERIMETER_SITE_REF: the identifier of the one perimeter site
// per LIV instance per Manual §I.4 unitarity.
//
// Value: 'middleware.ts' — self-declared by middleware.ts per inverted PL-A1 (Sprint 9 Shot 1).
// Registry lookup replaced with static literal; PLACEMENT_REGISTRY dissolved.

export const LIV_INSTANCE_PERIMETER_SITE_REF: string = 'middleware.ts'

// ─── Default PerimeterBinding (§6.2; G-PS-Cn3 vacuous-pass target at v1.0) ──
// Default permitted-authority bindings for the seven named channels. Sprint 6
// Shot 3 deploy supplies the runtime PerimeterBinding; pre-deploy this default
// satisfies G-PS-Cn3 with vacuous-pass per spec §4.8.
//
// Permitted-authority sets are inclusive: a channel admits any AuthorityClaim
// whose (level, actor) pair is in the listed set.

export const DEFAULT_PERIMETER_BINDING = {
  bindingId:      'perimeter-binding-default-v1-0',
  bindingVersion: '1.0',

  permittedAuthorityByChannel: {
    'wearer-message': [
      { level: 'L0', actor: 'wearer' },
    ],
    'wearer-query': [
      { level: 'L0', actor: 'wearer' },
    ],
    'ai-reply': [
      // AI replies are System-L0 originated; wearer scope binds at content time
      { level: 'L0', actor: 'system' },
    ],
    'system-trigger': [
      { level: 'L0', actor: 'system' },
    ],
    'integration-event': [
      { level: 'L0', actor: 'system' },
    ],
    'scheduled-trigger': [
      { level: 'L0', actor: 'system' },
    ],
    'internal-derivation': [
      { level: 'L0', actor: 'system' },
      { level: 'L0', actor: 'wearer' }, // framework-derived signal may carry wearer-scope downstream
    ],
  },

  dispatchTargetChannels: [
    'ai-reply',
    'wearer-message',
    'wearer-query',
    'integration-event',
    'internal-derivation',
  ],

  correlationIndexPolicy: {
    expirySeconds: null,    // no expiry at v1.0; Sprint 9 wire-in may set
    maxIndexSize:  null,    // unbounded at v1.0; Sprint 9 wire-in may bound
  },

  unitarySiteRef: 'middleware.ts',  // inverted PL-A1: static literal (Sprint 9 Shot 1)
}

// ─── End of perimeter-standard.ts ───────────────────────────────────────────
