# Artifact Standard v2.1

**Level:** L3 · **Kind:** Framework · **Mode:** generative · **Carrier:** `self` · **Authority:** L1 Protocol via L2 metaframework v2.4 · **Confirmed by:** L0

## Change log

| From | Change | Source |
|---|---|---|
| v2.0 | Regenerated against metaframework v2.4 (adds MA-G5c custody, MA-G5d provenance as required axioms). | Metaframework v2.4 binary-audit requirement. |
| v2.0 | §9 output schema — per-field provenance added for every `ArtifactEmission` field. Three source types: verbatim-from-input, runtime-generated, adjacent-framework-sourced. | MA-G5d (output-field provenance). |
| v1.1 | Regenerated under metaframework v2.1. Not a patch. Full re-derivation through 12-step generation procedure. | Gap radius: 10 gaps in v1.1 all traced to Layer 1 test-gate absence. |
| v1.1 | Mode resolved to exactly `generative` (was "generative + structural"). | MA-G1 (one mode per framework). |
| v1.1 | Carrier declared `self`. | metaframework §4.2 Carrier sub-axis. |
| v1.1 | `CognitivePrimitive`, `NodeId`, `Semver` — custody declared, not re-owned. | E2 orthogonality; gaps 1, 4, 7. |
| v1.1 | Input W-ATOM schema added (`CreateArtifactInput`). | E4 schema closure; gaps 5, 6, 7. |
| v1.1 | Mode node, version predecessor — resolution paths specified mechanically. | gaps 8, 10. |
| v1.1 | ArA3 plural/singular resolved: `contentNodeIds.length ≥ 1`. | E3 terminology; gap 9. |
| v1.1 | Evolution axis dropped as independent axis; folded into axioms (ArA5) — evolution is a constraint on post-emission state, not a dimension of emission. | E2 orthogonality. |
| v1.1 | ArA4 decomposed from one compound axiom into 4 atomic axioms (ArA4a–ArA4d). | E6 axiom atomicity; gap 9 (edge-kind conflation). |
| v1.1 | Universal-variables table cells resolved to atomic descriptors. | E5 variable resolution; gap 8. |

---

## 1. Identity

| Field | Value |
|---|---|
| Name | Artifact Standard |
| Level | L3 |
| Kind | Framework |
| Mode | generative (structured → produced) |
| Primitive | artifact node |
| Version | v2.1 |
| Ownership (template) | Human (L0) |
| Ownership (applied) | System under L0 |
| State (template) | declared |
| State (applied) | runtime |
| Carrier | `self` |
| Consumed by | every framework whose output is an artifact (Plan, Multi-Instance, Builder, Verify, etc.) |
| Adjacent frameworks | Cognitive Standard, Living Memory |

## 2. Scope

| In scope | Out of scope |
|---|---|
| Emission mechanics at chain link A7 | Domain payload content (owned by content framework — Plan, M-I, etc.) |
| Artifact anchor + companion data + content traversal + edge topology | Codec classification at A4 (Cognitive Standard) |
| Lineage edges (classification, version, dependency, categorical) | Graph physics — node/energy/traversal (Living Memory) |
| Post-emission evolution restriction (ArA5) | Code structure (LIV-Standard) |
| B3 symmetric emission (post-beta, same axioms, different chain position) | Framework registry, dispatch, runtime (each framework's own concern) |

## 3. Primitive

**artifact node** — a graph node produced at chain link A7 by a framework that:
1. carries a domain-typed payload in a 1:1 companion data node;
2. references traversed content nodes produced at emission;
3. carries typed lineage edges per ArA4a–ArA4d;
4. is evolution-restricted per ArA5.

Artifact status is earned through emission mechanics; not a declared node kind.

## 4. Axes (3)

| Axis | Governs | Atomic question |
|---|---|---|
| **Emission** | Where in the transfer chain writes occur, and what is written | At which chain link is each write made, and what atom is deposited? |
| **Composition** | What nodes and edges result from one emission | What products does one framework turn produce? |
| **Lineage** | How the emitted artifact connects to prior state | What edges connect this artifact to classification, predecessor, and inputs? |

Evolution folded into ArA5 (a post-emission constraint); not an orthogonal axis of emission.

### 4.1 Emission

| Sub-axis | Leaf |
|---|---|
| Chain position (A-direction) | `A4` (codec) \| `A7` (framework) |
| Chain position (B-direction, post-beta) | `B3` (framework output re-encoding) |
| Write ownership at A4 | Cognitive Standard (not AS) |
| Write ownership at A7 | Artifact Standard (this framework) |
| Conditional application | A7 emission iff framework applied on turn |

### 4.2 Composition

| Sub-axis | Leaf |
|---|---|
| Artifact anchor node | `NodeId`. Exactly 1 per emission. Carries `framework.id`, `framework.version`, `turnId`, `emissionId`. |
| Companion data node | `NodeId`. Exactly 1 per emission. Holds `payload` as JSON verbatim. |
| Content node set | `NodeId[]`. Cardinality ≥ 1. Produced by traversal of `payload.content` via F-memory `traverse()`. |
| Edge set | `ArtifactEdge[]`. Cardinality = 2 always + conditional per ArA4c, ArA4d. |

### 4.3 Lineage

| Sub-axis | Leaf |
|---|---|
| Classification-lineage edge | `anchor → classificationNodeId`. Always. |
| Categorical edge | `anchor → modeNode`. Always. `modeNode` resolved by `framework.id → modeNodeId` lookup via F-memory R3. |
| Version-lineage edge | `anchor → priorAnchor` iff prior exists. Prior defined mechanically as most-recent anchor with same `framework.id` and same `userId`. Resolved via F-memory R3 one-hop query. |
| Dependency edges | `anchor → inputAnchor[i]` for each element of `input.dependsOn[]`. Present iff `dependsOn` non-empty. |

## 5. Universal variables per axis

| Axis | Temporal | Categorical | Relational | Positional |
|---|---|---|---|---|
| Emission | `framework.version` (semver) | chain position enum `A4 \| A7 \| B3` | write → graph | `unwritten \| written` |
| Composition | `emissionId` (UUID v4) | product enum `anchor \| companion \| content \| edge` | anchor ↔ companion (1:1); anchor → content[N]; anchor → edge[M] | `unassembled \| assembled \| persisted` |
| Lineage | `version-lineage chain depth` (int) | edge kind enum `classification-lineage \| categorical \| version \| dependency` | `anchor → target` (directional) | `unlinked \| linked` |

## 6. Axioms (ArA1–ArA7)

One mechanical condition per axiom. E6 atomicity enforced.

| ID | Condition |
|---|---|
| **ArA1** | Every framework-engaged turn produces exactly one `ArtifactEmission` with `writes.a4` populated. Non-framework turns produce no emission. |
| **ArA2** | Every emission has `writes.a7.artifactAnchorNodeId` and `writes.a7.companionDataNodeId` in 1:1 binding by `emissionId`. |
| **ArA3** | Every emission has `writes.a7.contentNodeIds.length ≥ 1`. Content traversal produces at least one content node via Cognitive Standard primitives. |
| **ArA4a** | Every emission has exactly one `classification-lineage` edge: `anchor → writes.a4.classificationNodeId`. |
| **ArA4b** | Every emission has exactly one `categorical` edge: `anchor → modeNode`, where `modeNode` is resolved by `framework.id` via F-memory R3 one-hop. |
| **ArA4c** | Every emission has one `version` edge: `anchor → priorAnchor` iff a prior anchor exists for the same `(framework.id, userId)` pair. Absent iff no prior. No null-pointing edge. |
| **ArA4d** | Every emission has one `dependency` edge per entry of `input.dependsOn[]`. Cardinality = `input.dependsOn.length`. Absent iff `dependsOn` empty or undefined. |
| **ArA5** | Post-emission mutation of anchor or companion content is forbidden. State changes produce a new emission with a `version` edge to the prior. Evolution routes through Cognitive Standard primitives only. |

## 7. Cross-framework handoff

### 7.1 Custody table

| Atom | Owner | Consumers |
|---|---|---|
| `CognitivePrimitive` | Cognitive Standard (canonical at core/R5 `primitives.ts`) | AS, Cognitive Standard, Living Memory |
| `NodeId` | Living Memory (canonical at core/R5) | AS, Cognitive Standard, every framework |
| `Semver` | LIV-Standard (canonical at core/R5) | AS, every framework |
| `UserId` | F-identity (canonical at core/R5) | AS, every framework |
| `classificationNodeId` | Cognitive Standard (produced by A4 write) | AS (input, by reference) |
| `primitive` (value) | Cognitive Standard | AS (input, by reference) |
| `confidence` | Cognitive Standard | AS (input, by reference) |
| `modeNode` (graph node for framework's mode) | Living Memory (stored); resolved by AS at emission | AS |
| `artifactAnchorNode` | Artifact Standard | Living Memory (stores); content frameworks (reference) |
| `companionDataNode` | Artifact Standard | Living Memory (stores) |
| `payload` | content framework (Plan, M-I, etc.) | AS (carries verbatim; does not inspect) |

### 7.2 Handoff contracts

| Adjacent | AS consumes | AS emits |
|---|---|---|
| Cognitive Standard | `classificationNodeId`, `primitive`, `confidence` (at A4 → A7 boundary, same turn) | — |
| Living Memory | traverse() writes for anchor, companion, content; one-hop queries for modeNode and priorAnchor | anchor + companion + content nodes; edge set |
| content framework (Plan, M-I, etc.) | `framework.id`, `framework.version`, `payload`, optional `dependsOn` | `ArtifactEmission` (receipt) |

### 7.3 Carrier relation (H5)

AS `carrier = self`. AS emits own carrier mechanics. Content frameworks (Plan, M-I, etc.) have `carrier = Artifact Standard`. Those frameworks declare payload content only and do not emit carrier mechanics.

## 8. Input schema — CreateArtifactInput

W-ATOM consumed by `createArtifact` at R3:

```
CreateArtifactInput {
  framework: {
    id:      string      // provenance: caller (content framework) R0
    version: Semver      // provenance: caller R0
  }
  turnId:               string               // provenance: caller's turn context (F-chat message ID, F-planner job ID, etc.)
  userId:               UserId               // provenance: F-identity session
  payload:              ArtifactPayload      // provenance: caller (content framework) output
  classificationNodeId: NodeId               // provenance: Cognitive Standard R3 encodeLLM (prior call, same turn)
  primitive:            CognitivePrimitive   // provenance: same encodeLLM call
  confidence:           number               // provenance: same encodeLLM call
  dependsOn?:           NodeId[]             // provenance: caller's prior-artifact references
}

ArtifactPayload {
  domain:        string                      // e.g., 'plan', 'multi-instance'
  domainVersion: Semver
  schemaRef:     string                      // identifies payload schema per content framework
  content:       unknown                     // typed per domain schema, opaque to AS
}
```

**Provenance rule (E4):** every field traces to a named owning framework or external source.

## 9. Output schema — ArtifactEmission

W-ATOM emitted by `createArtifact`:

```
ArtifactEmission {
  emissionId:  string                        // provenance: runtime-generated (UUID v4 per call)
  framework:   { id: string, version: Semver }  // provenance: input.framework (verbatim)
  turnId:      string                        // provenance: input.turnId (verbatim)

  writes: {
    a4: {                                    // ArA1 — always; provenance: input (verbatim copy)
      classificationNodeId: NodeId           // provenance: input.classificationNodeId (Cognitive Standard origin)
      primitive:            CognitivePrimitive  // provenance: input.primitive (Cognitive Standard origin)
      confidence:           number           // provenance: input.confidence (Cognitive Standard origin)
    }
    a7: {                                    // present iff framework applied — ArA1
      artifactAnchorNodeId: NodeId           // provenance: F-memory traverse() at R2 step 4
      companionDataNodeId:  NodeId           // provenance: F-memory traverse() at R2 step 5; ArA2
      contentNodeIds:       NodeId[]         // provenance: F-memory traverse() at R2 step 3; ArA3, length ≥ 1
    }
  }

  edges: ArtifactEdge[]                      // provenance: F-memory traverse() at R2 step 9; ArA4a–ArA4d

  payload: ArtifactPayload                   // provenance: input.payload (verbatim); present iff a7 present
}

ArtifactEdge {
  fromId: NodeId                             // provenance: anchor NodeId (output or resolved)
  toId:   NodeId                             // provenance: per edge kind — input.classificationNodeId (ArA4a) | modeNode via F-memory (ArA4b) | priorAnchor via F-memory (ArA4c) | input.dependsOn[i] (ArA4d)
  kind:   'classification-lineage' | 'categorical' | 'version' | 'dependency'   // provenance: derived per ArA4a–ArA4d
}
```

Edge-kind enum is exhaustive. `split-lineage` from v1.1 dropped — not surfaced by any axiom; Plan Standard handles split via its own axioms.

**Provenance summary — three distinct source types across output fields:**
1. **Verbatim from input** — `framework`, `turnId`, `writes.a4.*`, `payload`
2. **Runtime-generated** — `emissionId`
3. **Adjacent-framework-sourced** — `writes.a7.*`, `edges` (via F-memory `traverse()`)

No output field has ambiguous or undeclared source.

## 10. Validity

Emission is valid iff ArA1–ArA7 hold at write time. Invalid emission is rejected; no partial write commits (atomicity inherited from F-memory transaction layer, not re-declared).

## 11. Consumer contract

| Consumer | Call pattern |
|---|---|
| content framework | (1) call Cognitive Standard R3 `encodeLLM()` → `EncodeResult`. (2) construct `CreateArtifactInput` with `classificationNodeId = <bind result>, primitive = result.primitive, confidence = result.confidence`. (3) call AS R3 `createArtifact(input)`. (4) receive `ArtifactEmission`. |
| Memory program, dashboard, audit | Read via standard graph traversal. Anchor identified by edges of kind `classification-lineage` + `categorical`. |
| Verify / replay | Query by `emissionId` (unique). |

## 12. Validity tests (metaframework v2.4 gates)

| Gate | Pass/fail | Evidence |
|---|---|---|
| E1 Completeness | pass | Every leaf in §4.1–§4.3 captureable in one function signature. |
| E2 Orthogonality | pass | §7.1 custody table declares every cross-standard atom; no re-ownership. |
| E3 Terminology | pass | "artifact" at axis level (general); "artifact anchor node" at implementation level (specific). No interchange. |
| E4 Schema closure | pass | §8 input declared (with provenance); §9 output declared (with per-field provenance — MA-G5d); §7.2 handoff declared; §7.1 custody declared (MA-G5c); `identity.carrier = self` declared in §1. |
| E5 Variable resolution | pass | §5 cells are W-ATOM names or enum values, not concept pointers. |
| E6 Axiom atomicity | pass | §6 axioms ArA1–ArA7 single-condition each. ArA4 decomposed to ArA4a–ArA4d. |
| E7 Dry-run (author) | pass (§13) | Walkthrough below. |
| E8 Dry-run (L0) | pending | Awaiting L0 confirmation. |

## 13. Author dry-run (E7)

Dummy input:
```
CreateArtifactInput {
  framework:            { id: 'plan', version: '1.0.0' },
  turnId:               'msg_abc123',
  userId:               'user_demo',
  payload:              { domain: 'plan', domainVersion: '1.0.0', schemaRef: 'PlanArtifact-v1', content: {...} },
  classificationNodeId: 'node_xyz789',
  primitive:            'anchor',
  confidence:           0.92,
  dependsOn:            []
}
```

Walk axiom-by-axiom:

| Axiom | Field consumed | Provenance | Output |
|---|---|---|---|
| ArA1 | `writes.a4` populated from `classificationNodeId`, `primitive`, `confidence` | Cognitive Standard (input atoms) | a4 block populated |
| ArA2 | emissionId = uuid; anchor created via traverse(); companion created via traverse() | self | 1:1 binding |
| ArA3 | traverse(payload.content) → content node IDs, length ≥ 1 | self (via Living Memory) | contentNodeIds populated |
| ArA4a | anchor, classificationNodeId | self, input | edge `anchor → classificationNodeId` kind=`classification-lineage` |
| ArA4b | anchor, modeNode (F-memory R3 lookup by framework.id) | self, Living Memory | edge `anchor → modeNode` kind=`categorical` |
| ArA4c | anchor, priorAnchor (F-memory R3 lookup by framework.id + userId, most recent) | self, Living Memory | edge present iff prior found; absent here (first emission for this user+framework) |
| ArA4d | anchor, dependsOn[] | input | absent (dependsOn empty) |
| ArA5 | no post-emission mutation path exposed by R3 | self | R3 surface has no mutation function |

All fields trace. Output matches §9 schema. Dry-run passes.

## 14. Vocabulary

| Term | Meaning |
|---|---|
| artifact | graph node emitted at A7 per this standard's axioms. Role, not kind. |
| emission | one invocation of `createArtifact` producing one `ArtifactEmission`. |
| anchor | the central node of an emission; identified by edges of kind `classification-lineage` + `categorical`. |
| companion | the 1:1 JSON-payload-holding node bound to anchor by emissionId. |
| content node | a node produced by traversing `payload.content` at emission time. |
| prior anchor | most recent anchor in graph with same `(framework.id, userId)`. |
| mode node | graph node representing one of the 4 modes (epistemic / structural / generative / verificative); one per mode, globally scoped. |

## 15. Implementation pointers (non-normative)

| Artifact | Path |
|---|---|
| R0 types | `src/core/types/artifact-standard.types.ts` |
| R5 constants | `src/core/constants/artifact-standard.ts` |
| Cross-standard primitives | `src/core/types/primitives.ts` |
| Runtime slice | `src/features/F-artifact/` (Phase 4a) |
| F-memory `traverse` | `src/features/F-memory/contract/memory-contract.ts` |
| F-codec `encodeLLM` | `src/features/F-codec/contract/codec-contract.ts` |

---

**End of Artifact Standard v2.1. L0 dry-run (E8) required before runtime build. Phase 4a brief regenerates against this document.**
