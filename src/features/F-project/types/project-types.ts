// @liv-standard v1.3
// [F-project/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-project
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  ProjectId       →  F-chat/R0, F-permissions/R0
//   W-ATOM  Project         →  F-project/R2, F-project/R3, F-project/R4
//   W-ATOM  ProjectSummary  →  F-project/R3
//   W-ATOM  Build           →  F-project/R2, F-project/R3, F-project/R4
//   W-ATOM  BuildSummary    →  F-project/R3
//   W-ATOM  BuildStatus     →  F-project/R2, F-project/R4
//   W-ATOM  BuildSource     →  F-project/R2, F-project/R4
//   W-ATOM  ProjectResult   →  F-project/R1, F-project/R2, F-project/R4
// deps:       none
// validated:  2026-03-12

// ── AK-REF ────────────────────────────────────────────────────────────────────
// Branded ids — stable across the system. Never use raw string where Ref is declared.
export type ProjectId = string & { _brand: 'ProjectId' }
export type BuildId   = string & { _brand: 'BuildId'   }

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
export type BuildStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled'

export type BuildSource =
  | 'CONTINUOUS'  // user stays inside LIV — prior Build's if_contract as context
  | 'REENTRY'     // user tinkered outside LIV — IN-DIAGNOSE path

export type ProjectRole = 'owner' | 'member' | 'viewer'

// ── AK-ENT ────────────────────────────────────────────────────────────────────
export type Project = {
  projectId:   ProjectId
  name:        string
  ownerId:     string
  description: string | null
  createdAt:   number   // epoch ms
  updatedAt:   number   // epoch ms
}

export type Build = {
  buildId:       BuildId
  projectId:     ProjectId
  userId:        string
  status:        BuildStatus
  source:        BuildSource
  ifContract:    string | null   // serialised IF.01–IF.10 JSON — immutable after freeze
  driftReport:   unknown | null  // jsonb — populated on REENTRY only
  baseBuildId:   BuildId | null  // FK to prior Build on REENTRY path
  startedAt:     number          // epoch ms
  completedAt:   number | null   // epoch ms — null while running
  createdAt:     number          // epoch ms
  updatedAt:     number          // epoch ms
}

// ── AK-SUM ────────────────────────────────────────────────────────────────────
// Read-optimised projections for list views — never expose full entity to UI unless needed.
export type ProjectSummary = {
  projectId:   ProjectId
  name:        string
  ownerId:     string
  description: string | null
  latestBuild: BuildSummary | null
  createdAt:   number
}

export type BuildSummary = {
  buildId:     BuildId
  status:      BuildStatus
  source:      BuildSource
  startedAt:   number
  completedAt: number | null
}

// ── AK-DELTA ──────────────────────────────────────────────────────────────────
export type ProjectDelta = Partial<Pick<Project, 'name' | 'description'>>

// ── AK-PAY ────────────────────────────────────────────────────────────────────
export type CreateProjectPayload = {
  name:        string
  description: string | null
}

export type CreateBuildPayload = {
  projectId:   ProjectId
  source:      BuildSource
  baseBuildId: BuildId | null
}

export type UpdateProjectPayload = {
  projectId: ProjectId
} & ProjectDelta

// ── AK-RES ────────────────────────────────────────────────────────────────────
export type ProjectResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }
