// @liv-standard v1.5.1
// [core/R5]
// Built with LIV · livai.dev
// @manifest
// standard: LIV-Standard v1.5.1
// amended: none
// slice: core
// layer: R5
// wires-in:
//   W-ATOM NodeId              ← core/R5 primitives
//   W-ATOM UserId              ← core/R5 primitives
//   W-ATOM Semver              ← core/R5 primitives
//   W-ATOM CognitivePrimitive  ← core/R5 primitives
//   W-ATOM Result              ← core/R5 primitives
//   W-ATOM AppError            ← core/R5 primitives
// wires-out:
//   W-ATOM ArtifactChainPosition          → any artifact consumer
//   W-ATOM ArtifactEdgeKind               → any artifact consumer
//   W-ATOM ArtifactCompositionProduct     → any artifact consumer
//   W-ATOM ArtifactEmissionPositional     → any artifact consumer
//   W-ATOM ArtifactCompositionPositional  → any artifact consumer
//   W-ATOM ArtifactLineagePositional      → any artifact consumer
//   W-ATOM ArtifactPayload                → any artifact consumer
//   W-ATOM CreateArtifactInput            → any AS caller (content frameworks)
//   W-ATOM ArtifactEdge                   → any artifact consumer
//   W-ATOM ArtifactWriteA4                → any artifact consumer
//   W-ATOM ArtifactWriteA7                → any artifact consumer
//   W-ATOM ArtifactEmission               → any artifact consumer (Phase 4a+)
//   W-ATOM ArtifactProcedureStage         → framework-audit, generation-procedure
//   W-ATOM ArtifactProcedureKind          → framework-audit
//   W-ATOM ArtifactProcedureStepId        → framework-audit
//   W-ATOM ArtifactProcedureStepInstance  → framework-audit
//   W-ATOM ArtifactGateResult             → framework-audit
//   W-ATOM ArtifactDimensionResult        → framework-audit
//   W-ATOM ArtifactCustodyRow             → framework-audit
//   W-ATOM ArtifactHandoffRuleInstance    → framework-audit
//   W-ATOM ArtifactError                  → AS callers (error surface)
//   W-ATOM CreateArtifactResult           → AS callers (Result-wrapped)
// deps:
//   R5 ./primitives
//   R5 ../constants/artifact-standard
// validated: pending

// ═══════════════════════════════════════════════════════════════
// ARTIFACT STANDARD v2.2 — TYPE DECLARATIONS
// ═══════════════════════════════════════════════════════════════
// Artifact Standard v2.2 landing: regenerated against metaframework-v3-1;
// fix-round-1 applied (§3.8 Relational arrow cleanup, §6 Coupling consolidation).
// Canonical spec: src/core/standards/artifact-standard.md
// A1: declared once, at R5 core. Slices import — never redeclare.

// artifact-standard.types.ts
// R5 type atoms for Artifact Standard v2.2
// Generated against metaframework-v3-1 via generation-procedure-v1-0
// Consumes: primitives.ts (NodeId, UserId, Semver, Result, AppError, CognitivePrimitive)
//
// Discipline: no implementation logic; type declarations only.
// Custody: every atom declared here has a row in artifact-standard-v2-2.md §6 Custody.
// Constraint: string-typed substrate carriers at this regen (no R5 typed substrate atoms cycle per spec-as-regen-v3-1 §Constraints).

import type {
  NodeId,
  UserId,
  Semver,
  CognitivePrimitive,
  Result,
  AppError,
} from './primitives'

// ─── Framework-local vocabulary ──────────────────────────────────────────────
// Declared once at R5 per substrate §10.2 PR1; referenced elsewhere by identifier.

/**
 * Chain position where AS emits.
 * A-direction: A4 (codec write, owned by Cognitive Standard) or A7 (framework write, owned by AS).
 * B-direction: B3 (post-beta symmetric output re-encoding; declared, not emitted at v2.2).
 */
export type ArtifactChainPosition = 'A4' | 'A7' | 'B3'

/**
 * Edge-kind enum for lineage edges produced per emission.
 * Exhaustive under ArA4a–ArA4d.
 */
export type ArtifactEdgeKind =
  | 'classification-lineage'
  | 'categorical'
  | 'version'
  | 'dependency'

/**
 * Composition product kind — categorical universal-variable cell for Composition sub-axis.
 */
export type ArtifactCompositionProduct =
  | 'anchor'
  | 'companion'
  | 'content'
  | 'edge'

/**
 * Emission positional state — Positional universal-variable cell for Emission sub-axis.
 */
export type ArtifactEmissionPositional = 'unwritten' | 'written'

/**
 * Composition positional state — Positional universal-variable cell for Composition sub-axis.
 */
export type ArtifactCompositionPositional =
  | 'unassembled'
  | 'assembled'
  | 'persisted'

/**
 * Lineage positional state — Positional universal-variable cell for Lineage sub-axis.
 */
export type ArtifactLineagePositional = 'unlinked' | 'linked'

// ─── Domain payload ──────────────────────────────────────────────────────────

/**
 * Payload carried verbatim by AS in the companion data node.
 * AS does not inspect `content`; content framework (Plan, Multi-Instance, etc.) owns schema.
 */
export type ArtifactPayload = {
  domain:        string    // content framework id (e.g., 'plan', 'multi-instance')
  domainVersion: Semver    // content framework version
  schemaRef:     string    // identifies payload schema per content framework
  content:       unknown   // typed per domain schema, opaque to AS
}

// ─── Input W-ATOM (schema.input per MA-S1) ───────────────────────────────────

/**
 * W-ATOM consumed by `createArtifact` at R3.
 * Every field traces to declared source in §6 Custody table of artifact-standard-v2-2.md.
 */
export type CreateArtifactInput = {
  framework: {
    id:      string        // caller (content framework) identifier
    version: Semver        // caller version
  }
  turnId:               string              // caller turn context (message ID, job ID, etc.)
  userId:               UserId              // F-identity session carrier
  payload:              ArtifactPayload     // caller (content framework) output, verbatim
  classificationNodeId: NodeId              // Cognitive Standard R3 `encodeLLM()` result, same turn
  primitive:            CognitivePrimitive  // Cognitive Standard R3 `encodeLLM()` result
  confidence:           number              // Cognitive Standard R3 `encodeLLM()` result; range [0, 1]
  dependsOn?:           NodeId[]            // caller-declared prior-artifact references
}

// ─── Output W-ATOM (schema.output per MA-S2, carrier='self') ────────────────

/**
 * Single edge emitted by `createArtifact`. Every edge traces to exactly one ArA4a–ArA4d axiom.
 */
export type ArtifactEdge = {
  fromId: NodeId             // anchor NodeId (output or resolved)
  toId:   NodeId             // per edge kind — see ArA4a..ArA4d
  kind:   ArtifactEdgeKind   // derived per ArA4a–ArA4d; enum exhaustive
}

/**
 * A4 write block. Present every emission per ArA1. Fields verbatim from Cognitive Standard input.
 */
export type ArtifactWriteA4 = {
  classificationNodeId: NodeId              // Cognitive Standard origin
  primitive:            CognitivePrimitive  // Cognitive Standard origin
  confidence:           number              // Cognitive Standard origin; range [0, 1]
}

/**
 * A7 write block. Present every emission per ArA1 (AS is always framework-engaged at emission time).
 */
export type ArtifactWriteA7 = {
  artifactAnchorNodeId: NodeId    // per ArA2; 1:1 with companionDataNodeId by emissionId
  companionDataNodeId:  NodeId    // per ArA2
  contentNodeIds:       NodeId[]  // per ArA3; cardinality >= 1
}

/**
 * W-ATOM emitted by `createArtifact`. Terminal P8 (S3, stage 5) output.
 * Eight top-level fields. Every field traces to declared provenance in §6.5.
 */
export type ArtifactEmission = {
  emissionId: string                          // runtime-generated UUID v4 per call
  framework: {                                // verbatim from input.framework
    id:      string
    version: Semver
  }
  turnId:   string                            // verbatim from input.turnId
  userId:   UserId                            // verbatim from input.userId

  writes: {
    a4: ArtifactWriteA4                       // always populated; ArA1
    a7: ArtifactWriteA7                       // always populated; ArA1
  }

  edges:   ArtifactEdge[]                     // ArA4a–ArA4d; cardinality per axiom rules
  payload: ArtifactPayload                    // verbatim from input.payload

  timestamp: string                           // ISO 8601; runtime-generated per call
}

// ─── Procedure step declarations (P8 per substrate §8.3) ────────────────────

/**
 * Stage values for AS P8 instances. Subset of substrate §8.3 Stage enum populated at this regen.
 * AS P8 instances use stages 2, 3, 5 only (no stage-1 judgment-intake; no stage-4 observation).
 */
export type ArtifactProcedureStage = 2 | 3 | 5

/**
 * Kind values for AS P8 instances per substrate §8.3 ternary kind + PR5 alignment.
 */
export type ArtifactProcedureKind = 'mechanical' | 'gate-execution'

/**
 * AS procedure step identifier. Three instances at this delivery: S1, S2, S3.
 */
export type ArtifactProcedureStepId = 'S1' | 'S2' | 'S3'

/**
 * P8 instance shape for AS. Conforms to substrate §8.3 ProcedureStepPrimitive with ternary kind.
 */
export type ArtifactProcedureStepInstance = {
  id:       ArtifactProcedureStepId
  order:    1 | 2 | 3
  stage:    ArtifactProcedureStage
  kind:     ArtifactProcedureKind
  input:    string   // declared input descriptor (by identifier; shape in §3.3 table)
  output:   string   // declared output descriptor (by identifier; shape in §3.3 table)
  derivation?: string       // required iff kind = 'mechanical'
  gates?:   string[]        // required iff kind = 'gate-execution'; references ArA/PG/G-U/G-M ids
}

// ─── Gate result shape (per metaframework §2.2 / framework-audit §8.1) ──────

/**
 * GateResult consumed by SelfAuditRecord shape. Referenced by framework-audit.
 * Shape mirrors framework-audit-v1-2 §8.1 GateResult.
 */
export type ArtifactGateResult = {
  gateId:    string                                   // e.g., 'G-Ar1', 'PG1', 'G-U5'
  result:    'passed' | 'failed' | 'pending'
  timestamp: string                                    // ISO 8601
  evidence?: string                                    // optional, populated for failed gates
}

// ─── Dimension result (per framework-audit §3.3 X1–X10) ──────────────────────

/**
 * DimensionResult consumed by framework-audit when evaluating AS.
 * Shape mirrors framework-audit-v1-2 §8.1 DimensionResult.
 */
export type ArtifactDimensionResult = {
  dimensionId: string           // 'X1'–'X10'
  result:      'pass' | 'fail' | 'n/a'
  basis?:      string           // required for 'n/a'
  details:     string           // test execution details
}

// ─── Custody row (per substrate §4 A-04 CustodyRow) ─────────────────────────

/**
 * Framework-local custody row. Consumed by framework-audit custody-check.
 * Shape mirrors substrate §4 A-04 CustodyRow.
 */
export type ArtifactCustodyRow = {
  atomId:           string   // declared atom name
  ownerFrameworkId: string   // owning framework identifier
  layer:            string   // e.g., 'core/R5', 'artifact-standard-v2-2/Structure'
  consumers:        string[] // enumerated consumer framework ids
}

// ─── Handoff rule instance (per substrate §8.2 P6 amended) ──────────────────

/**
 * AS-local handoff rule instance. Consumed by framework-audit X3 C5 captureShape check.
 * Shape conforms to substrate §8.2 HandoffRulePrimitive.
 */
export type ArtifactHandoffRuleInstance = {
  id:                     string             // e.g., 'HR-Ar1'
  direction:              {
    from: { id: string; version: Semver }    // FrameworkRef shape
    to:   { id: string; version: Semver }
  }
  carrierApplicability:   ('self' | 'named' | 'none')[]
  invariant:              string              // declared invariant text
  captureShape?: {
    capturedFields: string[]
    captureTarget:  'registry' | 'audit-trail' | 'custom'
    queryInterface?: string
  }
  diagnosticSignificance: boolean
}

// ─── Operation result (R3 surface) ──────────────────────────────────────────

/**
 * `createArtifact` error payload. Uses canonical Result<T>/AppError per primitives.ts.
 */
export type ArtifactError = AppError & {
  code:
    | 'ARTIFACT_INPUT_INVALID'         // schema violation at S1
    | 'ARTIFACT_COMPOSITION_FAILED'    // derivation failure at S2
    | 'ARTIFACT_GATE_FAILED'           // gate failure at Stage 3
    | 'ARTIFACT_EMISSION_REJECTED'     // emission failure at S3
}

/**
 * Terminal R3 result type for `createArtifact`.
 */
export type CreateArtifactResult = Result<ArtifactEmission, ArtifactError>

// ─── End of artifact-standard.types.ts ──────────────────────────────────────
