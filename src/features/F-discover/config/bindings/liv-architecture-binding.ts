// @liv-standard v1.5.1
// [F-discover/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-5-rs (slice introduction)
// slice:      F-discover
// layer:      R0
// wires-in:
//   W-ATOM  ResearchBinding, InvestigationMethod, SourceCriterion,
//           Semver  ←  F-discover/R0 f-discover-types
// wires-out:
//   W-ATOM  LIV_ARCHITECTURE_SMOKE_BINDING  →  F-discover/R4 discover-binding-loader
// deps:
//   R0 ../f-discover-types
// validated:  pending
//
// F-discover R0 — LIV-architecture smoke binding (Sprint 5 v1.0).
//
// Sprint 5 D-RS-BINDING-V1 (Demos confirmed, mechanically derived from
// Sprint 4 D3 γ + RA3 root-as-leaf rule):
//
//   "smoke binding, 1 InvestigationMethod methodKind='lookup' (root-as-leaf
//    path per RS §3.6 RA3 rootSet rule), 1 SourceCriterion groundingClass=
//    'reference-resolution'. Smoke priorKnowledge: lookup against substrate
//    §2 mode enumeration → 1 finding for the root question, truthValue=
//    'resolved', resolvedContent = 4-mode enumeration, 1 sourceRef. Exercises
//    RA1 + RA3 (cardinality + enum-membership over methodKind) + RA4
//    (resolved finding has ≥1 sourceRef + groundingClass per substrate §6.3)
//    + RA5 (all-resolved branch). Vacuous-closure branch covered by gate
//    logic alone, not exercised in smoke (parallel to F-verify D3 γ
//    structural-property smoke binding shape)."
//
// Sprint 5 SLICE.md framing:
//   "F-discover slice supplies smoke binding at Sprint 5 close; full domain
//    bindings deferred per natural-defer rule (Playbook §1.21)."
//
// ─── Binding target shape ────────────────────────────────────────────────────
//
// Smoke priorKnowledge shape (v1.0, Sprint 5):
//
//   The smoke binding's question schema describes a "what does substrate
//   declare at §X" question form. The smoke knowledge schema describes a
//   "structured enumeration" content form. Both are domain-extensible per
//   spec §6.9; v1.0 binds them as opaque shapeRef descriptors per RA1 + RA3
//   typed-shape conformance which is mechanical at the RS gate boundary
//   (shapeRef is a non-empty string).
//
// Why 'lookup' methodKind: it is the simplest non-decomposing investigation
// pathway per RA2 (no sub-question tree required) + RA3 root-as-leaf rule
// (rootSet = {rootQuestionId} when methodKind ∈ {'lookup', 'derivation',
// 'synthesis'}). The smoke can therefore produce a single resolved finding
// keyed by the root questionId without exercising decomposition shape gates,
// keeping the binding minimal while still exercising RA5's all-resolved
// branch on a non-empty findings map (Sprint 4 D3 γ requirement).
//
// First-run emission target (Sprint 8 close criterion per RS §5.4):
//   - Smoke ResearchInput.question: "What modes does substrate §2 declare?"
//   - Smoke ResearchInput.priorKnowledge: empty artifactRefs + null
//     scopeBoundary (positive empty-shape per A-17; first investigation in
//     a chain).
//   - Caller composes findings[rootQuestionId] with truthValue='resolved',
//     resolvedContent = the 4-mode enumeration, sourceRefs = [{citationId}],
//     and a single SourceCitation with sourceKind='graph-node', reference =
//     a NodeId pointing to substrate §2.
//   - All RA1..RA10 → passed → closure='closed' → exercises RA5
//     all-resolved branch on a non-empty findings (1 entry).
//
// RA5 vacuous-closure branch is covered structurally by the binding shape
// allowing empty findings in future bindings; v1.0 binding does NOT exercise
// the vacuous branch — that path is already verified by the gate logic in R1
// (deriveClosure returns 'closed' on empty findings when aggregationBasis
// declares vacuous-closure).

import type {
  ResearchBinding,
  InvestigationMethod,
  SourceCriterion,
} from '../f-discover-types'
import type { Semver } from '@/core/types/primitives'

// ─── Investigation method declarations ───────────────────────────────────────

/**
 * IM-LA-1 — substrate-section lookup
 *
 * RS §3.6 RA3 rootSet rule: methodKind='lookup' → rootSet = {rootQuestionId}.
 * Root-as-leaf: a single resolved finding for the root question, no
 * subQuestions tree required.
 *
 * decompositionRule: declarative descriptor naming the substrate-section
 * lookup pattern. RS spec treats this as opaque per substrate §6.3
 * reference-resolution at consumer side — F-discover does not interpret
 * decompositionRule strings; resolution to per-domain semantics is the
 * domain-binding caller's concern.
 */
const IM_LA_1_LOOKUP: InvestigationMethod = {
  methodId:          'im-la-smoke-1-lookup',
  methodKind:        'lookup',
  decompositionRule: 'substrate-section-lookup-v1',
}

// ─── Source-criterion declarations ───────────────────────────────────────────

/**
 * SC-LA-1 — graph-node source admissibility (substrate §6.3 reference-resolution)
 *
 * Smoke binding admits only `'graph-node'` source kind: the substrate
 * declarations live in the LIV graph (`global-seed-substrate-*` nodes per the
 * substrate seed cycle), so lookup-style investigations resolve evidence as
 * graph-node references. Future LIV-architecture bindings widen
 * sourceKindAllowed when external-uri or authoring-input grounding is needed.
 *
 * groundingClass='reference-resolution' per substrate §6.3: a citation is
 * grounded by resolving the reference to a graph-node — exactly the substrate
 * §6.3 reference-resolution mechanical-criterion class.
 */
const SC_LA_1_GRAPH_NODE: SourceCriterion = {
  criterionId:       'sc-la-smoke-1-graph-node',
  sourceKindAllowed: ['graph-node'],
  groundingClass:    'reference-resolution',
}

// ─── Binding instance ────────────────────────────────────────────────────────

/**
 * LIV-architecture smoke binding.
 *
 * domainId = 'liv-architecture'
 * domainVersion = '1.0.0' (smoke binding ratification version; future
 *                          architecture bindings semver from here)
 *
 * investigationMethods: 1 entry (IM-LA-1) — methodKind='lookup' for
 *                       root-as-leaf single-finding investigations.
 *
 * questionSchema: shapeRef pointer at the canonical question shape for
 *                 substrate-lookup questions. Schema itself is opaque to RS
 *                 (per AS v2.2 ArA7 verbatim-carry + spec §3.6 RA1);
 *                 shapeRef serves as identifier for framework-audit X3
 *                 traceability.
 *
 * knowledgeSchema: shapeRef pointer at the canonical resolvedContent shape
 *                  for substrate-section enumerations. Opaque to RS at type
 *                  surface (per spec §3.6 RA3); domain-supplied conformance.
 *
 * sourceCriteria: 1 entry (SC-LA-1) — graph-node source kind with
 *                 reference-resolution grounding class.
 *
 * failsafes: empty at v1.0 — smoke binding has no domain-declared failsafe
 *            policies. RA6 multi-source closure is satisfied vacuously over
 *            an empty failsafe set.
 */
export const LIV_ARCHITECTURE_SMOKE_BINDING: ResearchBinding = {
  domainId:      'liv-architecture',
  domainVersion: '1.0.0' as Semver,
  investigationMethods: [
    IM_LA_1_LOOKUP,
  ],
  questionSchema: {
    shapeRef: 'LivArchitectureSubstrateLookupQuestion',
  },
  knowledgeSchema: {
    shapeRef: 'LivArchitectureSubstrateSectionEnumeration',
  },
  sourceCriteria: [
    SC_LA_1_GRAPH_NODE,
  ],
  failsafes: {
    // Empty at v1.0. Future binding upgrades may declare failsafe rules per
    // domain policy; RA6 closure scope expands accordingly.
  },
}

// ─── End of liv-architecture-binding.ts ─────────────────────────────────────
