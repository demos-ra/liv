// @liv-standard v1.5.1
// [F-multi-instance/R0]
// Built with LIV · livai.dev
//
// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    4b-f-multi-instance-slice
// slice:      F-multi-instance
// layer:      R0
// wires-in:   none (declarations only)
// wires-out:  wire contract surface for slice audit
// deps:       none
// validated:  pending
//
// F-multi-instance wire contract — Phase 4b landing.
// STANDALONE: wires into F-artifact (at S3) + F-la-config DomainBinding (at S2);
// no wire into codec-orchestrate.ts.

// ─── W-ATOM (R0 ↔ consumer R0) ──────────────────────────────────────────────

// @wire
// type:    W-ATOM
// id:      W-ATOM-mi-input
// shape:   MIInput
// origin:  core/R5 multi-instance-standard.types
// surface: F-multi-instance/R0 mi-types
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-run-report-content
// shape:   RunReportContent
// origin:  core/R5 multi-instance-standard.types
// surface: F-multi-instance/R0 mi-types (rides as ArtifactPayload.content at S3)
// version: 1
// status:  active

// @wire
// type:    W-ATOM
// id:      W-ATOM-mi-emission-result
// shape:   MIEmissionResult = Result<ArtifactEmission, MIValidityError>
// origin:  core/R5 multi-instance-standard.types
// surface: F-multi-instance/R3 mi-contract executeRun return type
// version: 1
// status:  active

// ─── W-INJECT (R4 runtime deps) ──────────────────────────────────────────────

// @wire
// type:    W-INJECT
// id:      W-INJECT-ai-adapter-stream
// callee:  F-ai-adapter/R3 contract streamAIResponse
// caller:  F-multi-instance/R2 mi-instance (LLM-role dispatch)
// purpose: per-declaration LLM invocation via adapter; per §3.3 role invocation
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-lm-read-plan
// callee:  F-memory/R3 contract (one-hop read at planAnchorNodeId)
// caller:  F-multi-instance/R2 mi-execute (S1 resolve PlanArtifactContent; HR-MI4)
// purpose: resolve PlanArtifactContent by NodeId per HR-MI4
// version: 1
// status:  deferred (4b beta — F-memory read primitives land pre-deploy)

// @wire
// type:    W-INJECT
// id:      W-INJECT-create-artifact
// callee:  F-artifact/R3 contract createArtifact
// caller:  F-multi-instance/R2 mi-execute (S3 emission; HR-MI3)
// purpose: emit RunReportContent via AS v2.2 with M-I as domain
// version: 1
// status:  active

// @wire
// type:    W-INJECT
// id:      W-INJECT-domain-binding
// callee:  F-la-config/R3 LIVStandardDomainBinding
// caller:  F-multi-instance/R2 mi-execute (S1 binding capture; IA2)
// purpose: provide DomainBinding instance for LIV-Standard-domain plans
// version: 1
// status:  deferred
// deferred: binding arrives verbatim via plan.binding per Plan v2.2 PA9; authoring-program composition is Phase 5/6 scope.

// ─── W-HOOK (R3 entry point) ─────────────────────────────────────────────────

// @wire
// type:    W-HOOK
// id:      W-HOOK-execute-run
// caller:  authoring programs, Builder, Verify, future M-I consumers
// signature: (input: MIInput, ports: MultiInstancePorts) → Promise<MIEmissionResult>
// entry:   F-multi-instance/R3 contract executeRun
// invariant: IA1–IA7c all-pass iff result.ok === true
// version: 1
// status:  active

export {}
