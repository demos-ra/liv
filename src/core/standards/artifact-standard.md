# Artifact Standard v1.1

## Changelog

### v1.1 (amendment from v1.0)

Re-derivation corrected two gaps in v1.0:

1. §8 writes.a4: replaced `category` field (decode-time projection, not write-time output) with `primitive` field per Manual I.1 and verified F-codec `EncodeResult` shape.
2. ArA4: removed "null-pointing if first of its identity" clause. Version edge is now explicitly conditional per §4.3 derivation.
3. §8 writes.a7: dropped `category: 'artifact'` (trivially true, zero information).
4. Removed `DECODE_CATEGORIES` constant and `DecodeCategory` type — zero post-amendment consumers.
5. Added §6.4 three-layer fidelity framing.
6. Added §6.5 declaring CognitivePrimitive canonical location at core/R5 `primitives.ts`.

No axiom additions. No primitive changes. Four axes unchanged. ArA1, ArA2, ArA3, ArA5 unchanged.

### v1.0

Initial landing (AS-BB-1).

## 1. Identity

| Field | Value |
|---|---|
| Name | Artifact Standard |
| Level | L3 (Framework) |
| Version | v1.1 |
| Mode | generative (structured → produced) + structural (known → structured) — both, since the standard governs both emission (generative) and shape (structural) of framework outputs |
| Primitive | artifact node |
| Consumed by | every framework program that emits structured output (Plan, Multi-Instance, Builder, Research, Verify, etc.) |
| Coordinates with | Cognitive Standard (codec primitives), Living Memory (graph physics) |

## 2. Scope

Governs the emission shape, lineage, and evolution of nodes produced by framework engagement. Defines the artifact node as a derived category of graph node whose identity is earned through framework emission and graph-physics density, not declared as a parallel kind. Governs what a framework writes to the graph at chain link A7 (direction A) and future B3 (direction B). Does not govern framework content (domain payloads belong to the framework's own standard) — governs the carrier shell and its graph-native emission mechanics.

## 3. Primitive

Artifact node — a graph node produced by framework-side re-encoding (A7) that carries domain-typed content, companion raw data, traversed semantic lineage, and typed edges. An artifact is a role a node earns via graph physics (MA3 density through connectivity, MA5 emergent identity), not a declared type. A node becomes an artifact by being emitted under this standard's axioms.

## 4. Axes (4)

| Axis | Governs | Atomic question |
|---|---|---|
| Emission | What writes happen per framework turn | Where in the chain is each write made? |
| Composition | What products each emission produces | What nodes and edges result from one framework engagement? |
| Lineage | How artifacts connect to prior state | What is the artifact descended from? |
| Evolution | How artifacts change over time | How do artifacts update without mutation? |

### 4.1 Emission

| Sub-axis | Content |
|---|---|
| Chain positions | A4 (codec classification) + A7 (framework artifact). B3 (output-direction symmetric) once directional-symmetry closure ships. |
| Write independence | A4 and A7 writes are independent signals per I.6 Signal reuse (confidence at A4; schema at A7). Neither substitutes for the other. |
| Conditional application | A4 writes on every turn (framework or not). A7 writes only when a framework applies. |

### 4.2 Composition

Per B.5 literal, an artifact emission produces four product classes:

| Sub-axis | Content |
|---|---|
| Content nodes | Traversed from the artifact's semantic content via codec primitives (Anchor new / Reinforce existing / Relate). N ≥ 0. |
| Companion data node | Exactly one. Holds the artifact's structured JSON payload verbatim. |
| Artifact anchor node | Exactly one. Carries the artifact decode category + framework identity + emission metadata. This is the node that accumulates density via MA3. |
| Edges | Categorical (to mode node), dependency (to input artifacts), version (to prior artifact of same identity), lineage (to A4 classification node from same turn). |

### 4.3 Lineage

| Sub-axis | Content |
|---|---|
| Classification lineage | Every artifact anchor references its same-turn A4 classification node via a lineage edge. |
| Dependency lineage | When the artifact was produced from inputs (e.g., Builder consumes Plan), dependency edges point to input artifacts. |
| Version lineage | Version edge present iff the artifact supersedes a prior of the same conceptual identity. Points from current to prior. |
| Split lineage | When an artifact was produced by upstream split (PA10 in Plan Standard), provenance edge points to pre-split parent. |

### 4.4 Evolution

| Sub-axis | Content |
|---|---|
| Mutation rule | Artifacts do not mutate in place. State changes produce new artifacts with version lineage. |
| Primitive-governed change | All post-emission changes route through Cognitive Standard primitives: Anchor (new related node), Relate (new edge), Reinforce (energy boost), Restructure (identity-preserving reorganization), Suppress (energy decay), Reference (user-triggered reactivation). |
| Decay handling | Artifacts respect Living Memory energy axioms (MA1–MA6). Low-energy artifacts backlog; Reference primitive reactivates. |
| Deletion | Per MA6 (deletability), any artifact can be removed and the graph re-equilibrates. No special artifact-deletion path beyond Living Memory's general mechanism. |

## 5. Universal variables

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Emission | artifact version | chain link (A4, A7, B3) | write-to-graph | unwritten / written |
| Composition | schema version | product class (content, companion, anchor, edge) | node ↔ edge adjacency | assembled / persisted |
| Lineage | lineage version | edge type (classification, dependency, version, split) | source → target | linked / unlinked |
| Evolution | primitive version | Cognitive primitive applied | artifact → derivative | stable / evolving / decayed |

## 6. Integration with adjacent standards

### 6.1 With Cognitive Standard

Artifact Standard uses Cognitive Standard primitives as its change mechanism (ArA5). Cognitive Standard owns the primitives; Artifact Standard consumes them. No redeclaration.

### 6.2 With Living Memory

Artifact nodes are Living Memory nodes (no parallel kind). All MA1–MA6 axioms apply. Artifact Standard adds role-specific structural rules (ArA1–ArA5); it does not override graph physics.

### 6.3 With domain standards (LIV-Standard, Plan, Multi-Instance, Research, etc.)

Domain standards declare content payload schemas. Artifact Standard declares carrier shell + emission mechanics. Domain content rides on an Artifact. When Plan Standard emits "a PlanArtifact," the PlanArtifact content is the payload carried on an artifact node emitted under this standard's axioms.

This means Plan Standard's draft-2 section 8 schema (PlanArtifact { planId, shape, intent, capacity, limit }) is the payload content deposited into the companion data node of an artifact emission. Same for Multi-Instance's RunReport.

### 6.4 Three-layer fidelity preservation

Signals across the transfer chain are preserved with orthogonal ownership:

- **Codec layer (raw).** Cognitive Standard owns A4/A5/A6 signals — primitive, label, bind quality, mode. Stored on graph nodes and edges at write time. Retrievable via graph traversal.
- **Artifact layer (structured).** Artifact Standard owns A7 signals — schema, anchor, companion, content. Stored as ArtifactEmission + graph structure.
- **Present State (condensed).** Living Memory owns the scored, time-indexed projection across layers. Retrievable via `getPresentState`.

Each layer preserves its signals in full fidelity within its scope. Each is retrievable independently. No layer duplicates another's custody.

### 6.5 With core primitives

Artifact Standard's `ArtifactWriteA4.primitive` references `CognitivePrimitive`, a cross-standard primitive declared canonically at `src/core/types/primitives.ts`. Cognitive Standard is the semantic owner; the canonical type declaration lives at R5 to prevent A1 violations by cross-slice re-declaration. Three consumers: Cognitive Standard, Artifact Standard, Living Memory (edge stamps).

## 7. Axioms (ArA1–ArA5)

| ID | Rule |
|---|---|
| ArA1 | Two-point emission. Every framework-engaged turn writes at both A4 (codec classification) and A7 (framework artifact). Asymmetric writes (A7 without A4, or A4 absent when a framework applied) are fidelity leaks. Non-framework turns write at A4 only. |
| ArA2 | Companion preservation. Every artifact anchor node has exactly one companion data node holding its typed JSON payload verbatim. One-to-one binding, preserved across persistence. |
| ArA3 | Traversed semantic closure. An artifact's semantic content is traversed into the graph via codec primitives at emission. No content remains only in JSON — structured concepts surface as content nodes with edges. The graph's structured portion expands per I.5. |
| ArA4 | Edge completeness. Every artifact anchor node emits two always-present edges plus conditional edges of two kinds (version, dependency). Always present: (1) **categorical edge** to the mode node the artifact belongs to; (2) **classification-lineage edge** to the same-turn A4 classification node. Conditional: (3) **version edge** to the prior artifact of the same conceptual identity, present iff a prior exists; (4) **dependency edges** to input artifacts, present iff inputs exist. Absent any required edge, or presence of a conditional edge without its condition, = invalid emission. |
| ArA5 | Evolution via primitives. Artifacts evolve only via Cognitive Standard primitives (Anchor / Relate / Reinforce / Restructure / Suppress / Reference). Direct mutation of artifact content is forbidden. Version-lineage records evolution history. |

## 8. Output artifact schema — ArtifactEmission

The standard's own output schema describes what one emission event produces as a structured return value for consumers (programs, observability, audit):

```
ArtifactEmission {
  emissionId:     string
  framework:      { id: string, version: semver }
  turnId:         string                              // pins to the turn that produced this emission

  writes: {
    a4: {                                             // always present — ArA1
      classificationNodeId: NodeId
      primitive:            'anchor' | 'relate' | 'restructure' | 'reinforce' | 'suppress' | 'reference'
      confidence:           number
    }
    a7?: {                                            // present iff framework applied — ArA1
      artifactAnchorNodeId:  NodeId
      companionDataNodeId:   NodeId                   // ArA2
      contentNodeIds:        NodeId[]                 // ArA3 traversed content
    }
  }

  edges: Array<{                                      // ArA4
    fromId: NodeId
    toId:   NodeId
    kind:   'categorical' | 'dependency' | 'version' | 'classification-lineage' | 'split-lineage'
  }>

  payload?: {                                         // present iff a7 present
    domain:        string                             // e.g., 'plan', 'multi-instance', 'liv-standard'
    domainVersion: semver
    schemaRef:     string                             // identifies payload schema
    content:       unknown                            // typed per domain's schema
  }
}
```

## 9. Validity

An emission is valid iff ArA1–ArA5 all hold at write time. Validity is checked at emission time by the codec + framework runtime. An invalid emission is rejected; no partial write commits to graph (atomicity inherited from graph transaction layer, not re-declared here).

## 10. Consumer contract

- Codec is responsible for A4 writes per ArA1. Governed by Cognitive Standard; Artifact Standard only specifies that A4 must occur.
- Framework programs are responsible for A7 writes per ArA1–ArA4. The framework invokes the emission mechanic (reference implementation: B.5's createArtifact).
- Consumers (Memory program, dashboard, replay, audit) read artifacts as graph nodes carrying the artifact category + companion data + edges. No special query path; standard graph traversal applies.
- Directional symmetry (B direction): once closure ships (post-beta, Cluster E), B3 writes mirror A7 writes. Artifact Standard's emission axioms apply to both directions; only the chain positions differ.

## 11. Open questions (Layer 0)

- R5 constants file. Implementation artifact: `src/core/constants/artifact-standard.ts` holding axiom ID constants, category enums, edge-kind enums. Matches LIV-Standard's existing `src/core/constants/` convention (R5 per T1.1 layer model).
- B.5 alignment. Backlog B.5 createArtifact is the reference implementation of this standard. Confirm B.5 updates to reference Artifact Standard v1.0 on landing.
- Registration. Artifact Standard registers as L3 at runtime. Deploy State III.4 standards table to add row.
- Directional symmetry. B3 mirroring ships in Cluster E (post-beta per backlog). Artifact Standard's axioms are direction-agnostic but current operational scope is A direction only.
- Relationship to Cluster B.5. B.5 predates Artifact Standard. Update needed: B.5's placeholder contract rewrites to reference Artifact Standard's emission mechanics.
- Naming convention. Prefix ArA chosen per 2-letter pattern match. Flag for future Rule 7 extension on axiom prefixes, deferred.

## 12. Non-axiom notes

- Artifact Standard is emergent-first: an artifact is not declared as a separate kind. Living Memory remains the single graph kind (orthogonal, per Manual II.1). Artifact is a derived role within the graph kind, earned by emission mechanics + density accumulation.
- Artifact Standard makes no claim about how much density an artifact has. Density is governed by Living Memory (MA3). Artifact Standard only governs the emission that puts the node into the graph in a state where density can accumulate.
- Domain standards cite Artifact Standard as their carrier. Plan Standard v1.0-draft-2 and Multi-Instance Standard v1.0-draft-2 must be re-layered to make this explicit before their v1.0 confirmation.
