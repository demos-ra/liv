// @liv-standard v1.5.2
// [F-artifact/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.2
// amended:    4b-f-artifact-slice
//             sprint-b2-unified-close (Point 6: LIV-Standard v1.5.1 → v1.5.2; AS v2.2 → v2.3 references in header swept; F-009 paired-write framing closure declared at this amendment; artifact emission is Path B to Store via internal-derivation channel — confirmed at body level)
//             sprint-8-shot-4 (hydrateArtifactStore re-exported for boot wiring)
//             b1-final-shot-3 (hydrateArtifactStore removed — art_* dissolved;
//                              ArtifactGraphPort removed — port dissolved;
//                              createArtifact now single-arg: port param gone;
//                              decodePayloadContent + encodePayloadContent re-exported
//                              for cross-slice payload recovery via substrate threadQuery)
// slice:      F-artifact
// layer:      R3
// wires-in:
//   W-HOOK  createArtifact          ←  F-artifact/R2 artifact-emit
//   W-FN    decodePayloadContent    ←  F-artifact/R2 artifact-emit  (b1-final-shot-3)
//   W-FN    encodePayloadContent    ←  F-artifact/R2 artifact-emit  (b1-final-shot-3)
// wires-out:
//   W-HOOK  createArtifact          →  F-multi-instance/R2, F-builder/R2, F-discover/R3, F-verify/R3, F-plan/R3
//   W-FN    decodePayloadContent    →  F-builder/domain/builder-pipeline (payload recovery via threadQuery)
//   W-FN    encodePayloadContent    →  (future consumers)
//   W-ATOM  CreateArtifactInput     →  callers constructing AS inputs
//   W-ATOM  ArtifactEmission        →  callers reading AS outputs
//   W-ATOM  CreateArtifactResult    →  callers pattern-matching on success/fail
//   W-ATOM  ArtifactError           →  callers on fail branch
// deps:
//   R2  ../app/artifact-emit
//   R0  ../types/artifact-types
// validated:  pending
//
// F-artifact R3 — public contract.
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// b1-final-shot-3: hydrateArtifactStore removed (no art_* tables to hydrate).
// ArtifactGraphPort removed (port dissolved). createArtifact is now single-arg.

export { createArtifact, decodePayloadContent, encodePayloadContent } from '../app/artifact-emit'

// Type re-exports — consumers import everything needed from R3.
export type {
  CreateArtifactInput,
  ArtifactEmission,
  CreateArtifactResult,
  ArtifactError,
  ArtifactPayload,
  ArtifactEdge,
  ArtifactEdgeKind,
  ArtifactWriteA4,
  ArtifactWriteA7,
} from '../types/artifact-types'
