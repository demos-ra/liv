// @liv-standard v1.5.1
// [F-artifact/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-artifact-slice
// slice:      F-artifact
// layer:      R0
// wires-in:   none (declarations only)
// wires-out:  wire contract surface for slice audit
// deps:       none
// validated:  pending
//
// F-artifact wire contract — enumerates the W-ATOM / W-INJECT / W-HOOK
// relations the slice consumes and produces. Declarations only; no code.
// A5: wire contract is the authoritative boundary declaration.
//
// At Phase 4b landing, F-artifact is STANDALONE — it is not yet wired into
// codec-orchestrate. Consumers named below (F-multi-instance, future
// content frameworks) import F-artifact directly via R3 contract.

// ─── W-ATOM (R0 ↔ consumer R0) ──────────────────────────────────────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-create-artifact-input
// shape:   CreateArtifactInput
// origin:  core/R5 artifact-standard.types
// surface: F-artifact/R0 types/artifact-types
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-artifact-emission
// shape:   ArtifactEmission
// origin:  core/R5 artifact-standard.types
// surface: F-artifact/R0 types/artifact-types
// version: 1
// status:  active

// ─── W-INJECT (R4 runtime deps) ──────────────────────────────────────────────

// @wire
// type:    W-INJECT
// id:      W-INJECT-lm-node-create
// callee:  F-memory/R3 contract (memory node-create for anchor + companion + content)
// caller:  F-artifact/R2 artifact-emit (S1 resolve phase)
// purpose: resolve anchor/companion NodeIds + content NodeIds via graph primitives
// version: 1
// status:  deferred (4b beta — F-memory node-create primitives land pre-deploy)

// @wire
// type:    W-INJECT
// id:      W-INJECT-lm-edge-create
// callee:  F-memory/R3 contract (memory edge-create for ArA4 lineage edges)
// caller:  F-artifact/R2 artifact-emit (S2 compose phase)
// purpose: persist 4 ArA4 edges (classification-lineage, categorical, version?, dependency[])
// version: 1
// status:  deferred (4b beta — F-memory edge-create primitives land pre-deploy)

// ─── W-HOOK (R3 entry point) ─────────────────────────────────────────────────

// @wire
// type:    W-HOOK
// id:      W-HOOK-create-artifact
// caller:  F-multi-instance/R2 mi-execute (S3 emission), future content frameworks
// signature: (input: CreateArtifactInput, port: ArtifactGraphPort) → Promise<CreateArtifactResult>
// entry:   F-artifact/R3 contract createArtifact
// invariant: ArA1–ArA8 all-pass iff result.ok === true (HR-MI3 compliant)
// version: 1
// status:  active

export {}
