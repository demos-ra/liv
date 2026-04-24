// @liv-standard v1.5.1
// [F-artifact/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice
// slice:      F-artifact
// layer:      R3
// wires-in:
//   W-HOOK  createArtifact  ←  F-artifact/R2 artifact-emit
// wires-out:
//   W-HOOK  createArtifact           →  F-multi-instance/R2, future content frameworks
//   W-ATOM  ArtifactGraphPort        →  consumers binding F-memory primitives
//   W-ATOM  CreateArtifactInput      →  callers constructing AS inputs
//   W-ATOM  ArtifactEmission         →  callers reading AS outputs
//   W-ATOM  CreateArtifactResult     →  callers pattern-matching on success/fail
//   W-ATOM  ArtifactError            →  callers on fail branch
// deps:
//   R2  ../app/artifact-emit
//   R0  ../types/artifact-types
// validated:  pending
//
// F-artifact R3 — public contract.
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// Primary export: createArtifact(input, port) → Promise<CreateArtifactResult>
//
// HR-MI3 usage (M-I runtime S3 emission):
//   const result = await createArtifact({
//     framework: { id: 'multi-instance', version: '2.3' },
//     turnId, userId,
//     payload:              { domain: 'multi-instance', domainVersion: '2.3',
//                             schemaRef: 'RunReportContent', content: runReport },
//     classificationNodeId, primitive, confidence,
//     dependsOn:            [planAnchorNodeId],
//   }, graphPort)
//   if (!result.ok) return { ok: false, error: miAsEmissionFailed(result.error) }
//   return { ok: true, data: result.data }  // ArtifactEmission

export { createArtifact } from '../app/artifact-emit'
export type { ArtifactGraphPort } from '../app/artifact-emit'

// Type re-exports — consumers can import everything they need from R3.
export type {
  // Input / output
  CreateArtifactInput,
  ArtifactEmission,
  CreateArtifactResult,
  ArtifactError,

  // Sub-structures (callers building inputs)
  ArtifactPayload,
  ArtifactEdge,
  ArtifactEdgeKind,
  ArtifactWriteA4,
  ArtifactWriteA7,
} from '../types/artifact-types'
