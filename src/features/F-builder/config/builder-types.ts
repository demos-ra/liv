// @liv-standard v1.5.1
// [F-builder/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-11-shot-5 (initial authoring — F-builder spin-out)
// slice:      F-builder
// layer:      R0
// wires-in:   none (pure type declarations)
// wires-out:
//   W-ATOM  BuildDirective  →  F-builder/R2 builder-workflow, F-builder/R3 builder-contract
//   W-ATOM  BuildEmission   →  F-builder/R2 builder-workflow, F-builder/R3 builder-contract
//   W-ATOM  BuilderDeps     →  F-builder/R2 builder-workflow
// deps:       none
// validated:  pending
//
// F-builder R0 — atom declarations.
// Builder Standard v1.0 §2: BuildDirective and BuildEmission are the two
// typed atoms crossing the F-plan → F-builder boundary.
//
// Decision-D-S5-HANDOFF: handoff mechanism.
//   F-plan triggers a build by creating a PlannerJob (DB-native). The confirmed
//   jobId is the build handle. F-builder receives jobId as BuildDirective.jobId.
//   No substrate write/read is required for the handoff itself — the DB record
//   is the source of truth for pipeline state (LIV-Standard A1: F-planner owns
//   builds table). Substrate writes occur at build completion (BuildEmission).
//   Rationale: substrate write-read for jobId would duplicate a DB record that
//   already exists and is already authoritative. The substrate bus is for
//   context accumulation (identities, relations); the DB is for pipeline state.
//   Both are used at their natural layers.

// ─── BuildDirective ───────────────────────────────────────────────────────────
// Typed input token submitted to F-builder on invocation.
// jobId is the handle into the F-planner builds table (produced by
// handleInMainTurn → startPipeline; read by runBuild via IPlannerDb.getJob).

export type BuildDirective = {
  jobId:     string    // PlannerJobId — handle into builds table
  userId:    string    // initiating user
  projectId: string    // target project
}

// ─── BuildEmission ────────────────────────────────────────────────────────────
// Typed output atom written to substrate on build completion.
// Carries terminal status and reference identities for downstream consumers.

export type BuildStatus = 'completed' | 'failed' | 'escalated'

export type BuildEmission = {
  jobId:     string
  userId:    string
  projectId: string
  status:    BuildStatus
  completedAt: number  // ms epoch
}

// ─── End ──────────────────────────────────────────────────────────────────────
