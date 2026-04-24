// @liv-standard v1.5.1
// [F-memory/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    6.1-global-seed
// slice:      F-memory
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  GlobalSeedNode   →  F-memory/R2 (memory-admin-service)
//   W-ATOM  GlobalSeedEdge   →  F-memory/R2 (memory-admin-service)
// deps:       none
// validated:  pending

// Phase 6.1 — global graph seed data.
// R0: types + config. Zero dependencies.
// 21 nodes across 5 groups: protocol layers, modes, universal variables,
// modules + concepts, identity.
// Each node declares edges with per-edge primitiveType.

// ─── Types ────────────────────────────────────────────────────────────────────

export type GlobalSeedEdge = {
  key:           string                  // target node key
  primitiveType: 'anchor' | 'relate'    // edge semantic
}

export type GlobalSeedNode = {
  key:     string          // stable identifier for idempotency
  content: string          // semantic content — what this node means
  edges:   GlobalSeedEdge[] // outgoing edges with per-edge primitive
}

// ─── Seed Data ────────────────────────────────────────────────────────────────

export const GLOBAL_SEED_NODES: GlobalSeedNode[] = [

  // ── Group A — Protocol layers (4 nodes) ───────────────────────────────────
  // Layered dependency chain: scope → validity → execution → fidelity.

  {
    key: 'protocol-scope',
    content: 'LIV protocol layer: scope — all work operates within a framework, authority requires explicit confirmation, unresolved gaps are escalated',
    edges: [
      { key: 'protocol-validity', primitiveType: 'relate' },
    ],
  },
  {
    key: 'protocol-validity',
    content: 'LIV protocol layer: validity — frameworks decompose to atomic irreducible axes, no axis assumes what another verifies, terminology respects abstraction level',
    edges: [
      { key: 'protocol-execution', primitiveType: 'relate' },
    ],
  },
  {
    key: 'protocol-execution',
    content: 'LIV protocol layer: execution — deterministic isolated atomic composition, context informs but never substitutes for framework operations',
    edges: [
      { key: 'protocol-fidelity', primitiveType: 'relate' },
    ],
  },
  {
    key: 'protocol-fidelity',
    content: 'LIV protocol layer: fidelity — natural precision, not more not less, governs execution quality uniformly',
    edges: [],
  },

  // ── Group B — Modes (4 nodes) ─────────────────────────────────────────────
  // State-transform chain: epistemic → structural → generative → verificative.

  {
    key: 'mode-epistemic',
    content: 'Framework mode: epistemic — transforms unknown into known, discovery and research, produces findings artifacts',
    edges: [
      { key: 'mode-structural', primitiveType: 'relate' },
    ],
  },
  {
    key: 'mode-structural',
    content: 'Framework mode: structural — transforms known into structured, planning and design, produces plan artifacts',
    edges: [
      { key: 'mode-generative', primitiveType: 'relate' },
    ],
  },
  {
    key: 'mode-generative',
    content: 'Framework mode: generative — transforms structured into produced, building and execution, produces deliverable artifacts',
    edges: [
      { key: 'mode-verificative', primitiveType: 'relate' },
    ],
  },
  {
    key: 'mode-verificative',
    content: 'Framework mode: verificative — transforms produced into verified, auditing and validation, produces verification artifacts',
    edges: [],
  },

  // ── Group C — Universal variables (4 nodes) ───────────────────────────────
  // Orthogonal by definition — no inter-variable edges.
  // Each anchors to protocol-validity (variables are protocol-level constructs).

  {
    key: 'var-temporal',
    content: 'Universal variable: temporal — identity of state across time, versioning, every unit of work tracks its version history',
    edges: [
      { key: 'protocol-validity', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'var-categorical',
    content: 'Universal variable: categorical — identity of units across axes, classification, every unit of work declares what kind of thing it is',
    edges: [
      { key: 'protocol-validity', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'var-relational',
    content: 'Universal variable: relational — dependency order between units, sequencing, every unit of work declares what it depends on',
    edges: [
      { key: 'protocol-validity', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'var-positional',
    content: 'Universal variable: positional — current state of a unit, status tracking, every unit of work declares where it stands',
    edges: [
      { key: 'protocol-validity', primitiveType: 'anchor' },
    ],
  },

  // ── Group D — Existing modules + core concepts (7 nodes) ──────────────────

  {
    key: 'module-liv-standard',
    content: 'LIV-Standard v1.5.1: constitutional standard governing code construction — 7 frozen axioms, R-layer architecture (R0-R4), slice-based organization, 4 wire types (W-ATOM W-EVENT W-INJECT W-HOOK), Result<T> on fallible R4',
    edges: [
      { key: 'mode-generative',   primitiveType: 'relate' },
      { key: 'mode-verificative', primitiveType: 'relate' },
    ],
  },
  {
    key: 'module-living-memory',
    content: 'Living Memory v1.1: graph-based memory system — 3 primitives (node, field, energy), 1 action (traversal), 5 M-layers (M0-M4), 6 frozen axioms (MA1-MA6), present state derived from graph topology',
    edges: [
      { key: 'mode-epistemic', primitiveType: 'relate' },
    ],
  },
  {
    key: 'module-cognitive-standard',
    content: 'Cognitive Standard v1.2: encode/decode layer — 6 cognitive primitives (anchor, relate, restructure, reinforce, suppress, reference) from 3 binary axes, deterministic classification, graph-derived routing',
    edges: [
      { key: 'mode-epistemic', primitiveType: 'relate' },
    ],
  },
  {
    key: 'concept-slices',
    content: 'Slices: vertical feature boundaries in LIV architecture — each slice owns its types (R0), domain logic (R1), orchestration (R2), contracts (R3), and I/O (R4), cross-slice communication only via wires at R0 or R3',
    edges: [
      { key: 'module-liv-standard', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'concept-layers',
    content: 'R-layers: horizontal concern separation — R0 types/config, R1 pure same-slice logic, R2 orchestration, R3 typed contract boundary, R4 I/O, strict import direction (lower imports higher never reverse)',
    edges: [
      { key: 'module-liv-standard', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'concept-wires',
    content: 'Wire types: typed cross-boundary communication — W-ATOM (shared types at R0), W-EVENT (fire-and-forget via event bus), W-INJECT (dependency injection), W-HOOK (synchronous cross-slice query at R3)',
    edges: [
      { key: 'module-liv-standard', primitiveType: 'anchor' },
    ],
  },
  {
    key: 'concept-axioms',
    content: 'Constitutional axioms A1-A7: A1 single ownership, A2 unidirectional dependency, A3 typed boundaries, A4 I/O at R4 only, A5 event-only notification (cross-slice via event bus only), A6 declaration at R0, A7 deletability (slice removable without breaking external files)',
    edges: [
      { key: 'module-liv-standard', primitiveType: 'anchor' },
    ],
  },

  // ── Group E — Identity (2 nodes) ──────────────────────────────────────────

  {
    key: 'identity-liv',
    content: 'LIV is an AI-driven software construction platform — users describe applications in natural language, an autonomous multi-instance pipeline builds production-ready codebases, the system compounds capability through constitutional standards instead of degrading under technical debt',
    edges: [
      { key: 'identity-method', primitiveType: 'relate' },
    ],
  },
  {
    key: 'identity-method',
    content: 'LIV\'s method: framework-governed autonomous construction — every task operates within a confirmed framework, the system classifies intent into cognitive primitives, routes by mode, executes through registered modules, and produces artifacts that persist in living memory',
    edges: [
      { key: 'mode-generative',          primitiveType: 'relate' },
      { key: 'module-liv-standard',      primitiveType: 'relate' },
      { key: 'module-living-memory',     primitiveType: 'relate' },
      { key: 'module-cognitive-standard', primitiveType: 'relate' },
    ],
  },
]
