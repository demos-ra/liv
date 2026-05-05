// @liv-standard v1.5.1
// [F-artifact/R3]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice, sprint-8-shot-4 (hydrateArtifactStore re-exported for boot wiring)
// slice:      F-artifact
// layer:      R3
// wires-in:
//   W-HOOK  createArtifact         ←  F-artifact/R2 artifact-emit
//   W-FN    hydrateArtifactStore   ←  F-artifact/R2 artifact-store (sprint-8-shot-4)
// wires-out:
//   W-HOOK  createArtifact           →  F-multi-instance/R2, future content frameworks
//   W-FN    hydrateArtifactStore     →  F-event-system/R2 startup (boot orchestrator)
//   W-ATOM  ArtifactGraphPort        →  consumers binding F-artifact primitives
//   W-ATOM  CreateArtifactInput      →  callers constructing AS inputs
//   W-ATOM  ArtifactEmission         →  callers reading AS outputs
//   W-ATOM  CreateArtifactResult     →  callers pattern-matching on success/fail
//   W-ATOM  ArtifactError            →  callers on fail branch
// deps:
//   R2  ../app/artifact-emit
//   R2  ../app/artifact-store     (sprint-8-shot-4)
//   R0  ../types/artifact-types
// validated:  pending
//
// F-artifact R3 — public contract.
// A5: cross-slice calls enter here only. R2 and R1 are slice-internal.
//
// Primary export: createArtifact(input, port) → Promise<CreateArtifactResult>
//
// sprint-8-shot-4: hydrateArtifactStore() exposed at R3 so F-event-system/R2
//   startup can invoke it via R3-mediated cross-slice dependency (A5). The
//   boot hook re-establishment was deferred from Shot 3b per L0 ruling option (γ);
//   originally the hook was hosted at F-memory/R2 memory-service onBoot(), but
//   F-memory's onBoot() now fires substrate boot only. The artifact cache
//   hydration belongs at F-artifact since the artifact-store relocated there.
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

// sprint-8-shot-4: boot-side hydration of the artifact-store in-memory cache.
// Idempotent — clears cache before reading. Async — reads 6 art_* tables.
// Called from F-event-system/R2 startup after substrate onBoot, before
// event-subscription registration.
export { hydrateArtifactStore } from '../app/artifact-store'

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
