// @liv-standard v1.3
// [F-planner/R0]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.3
// amended:    step3-executor
// slice:      F-planner
// layer:      R0
// wires-in:   none
// wires-out:
//   W-ATOM  PipelineStage     →  F-planner/R1, F-planner/R2, F-planner/R3, F-planner/R4
//   W-ATOM  StageStatus       →  F-planner/R1, F-planner/R2, F-planner/R4
//   W-ATOM  PlannerJob        →  F-planner/R2, F-planner/R3, F-planner/R4
//   W-ATOM  IfContract        →  F-planner/R1, F-planner/R2, F-planner/R4
//   W-ATOM  StageLogEntry     →  F-planner/R1, F-planner/R2, F-planner/R4
//   W-ATOM  PlannerResult     →  F-planner/R1, F-planner/R2, F-planner/R4
//   W-ATOM  PlannerJobId      →  F-planner/R2, F-planner/R3, F-planner/R4
//   W-ATOM  AdvanceStagePayload.files  →  F-planner/R2 (executor gate), F-planner/R4 (route handler)
// deps:       none
// validated:  2026-03-13
//
// step3-executor: AdvanceStagePayload.files? added — typed file array passed
// from route handler through to IExecutor.run() at IN_COMPILE gate.
// Axiom cite: A6 — declared at R0 of owner.

// ── AK-REF ────────────────────────────────────────────────────────────────────
export type PlannerJobId = string & { _brand: 'PlannerJobId' }

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
// Stage order matches PLANNER_CONST.STAGE_ORDER — never reorder independently.
export type PipelineStage =
  | 'IN_MAIN'
  | 'IN_BUILD'
  | 'IN_RESOLVE'
  | 'IN_AUDIT'
  | 'IN_COMPILE'
  | 'IN_QA'

export type StageStatus =
  | 'pending'     // not yet started
  | 'running'     // currently executing
  | 'complete'    // passed — next stage may begin
  | 'failed'      // terminal failure — pipeline stops
  | 'skipped'     // bypassed per flow variant

export type PipelineStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled'

// ── AK-ENT ────────────────────────────────────────────────────────────────────
// PlannerJob is the F-planner view of a Build. One PlannerJob per Build.
// Stored in builds table — F-project owns the row. F-planner writes
// pipeline_log, current_stage, stage_status, and if_contract fields only.
export type PlannerJob = {
  jobId:          PlannerJobId   // same as buildId — shared key
  projectId:      string
  userId:         string
  pipelineStatus: PipelineStatus
  currentStage:   PipelineStage | null
  stageStatus:    StageStatus
  ifContract:     IfContract | null
  pipelineLog:    StageLogEntry[]
  source:         'CONTINUOUS' | 'REENTRY'
  createdAt:      number         // epoch ms
  updatedAt:      number         // epoch ms
}

// ── IF Contract ───────────────────────────────────────────────────────────────
// Frozen after IN-MAIN gate. Immutable once set. (T6.2)
// All fields typed — no unknown values cross the R4 boundary. (A3)
export type IfContract = {
  // IF.01 — Feature intent (one sentence)
  featureIntent:     string
  // IF.02 — Atom declarations: new types, enums, payload types
  atomDeclarations:  AtomDeclaration[]
  // IF.03 — Bundle scope: which slices are new vs modified
  bundleScope:       BundleScope[]
  // IF.04 — Flow selection: FL-IDs this feature implements
  flowIds:           string[]
  // IF.05 — Wire map: how bundles connect
  wireMap:           WireMapEntry[]
  // IF.06 — Event contracts: emitted/consumed events with payloads
  eventContracts:    EventContractEntry[]
  // IF.07 — Migration delta (optional)
  migrationDelta:    MigrationDelta | null
  // IF.08 — Acceptance criteria
  acceptanceCriteria: string[]
  // IF.09 — LIV-Standard version
  standardVersion:   string
  // IF.10 — LIV-Procedure version
  procedureVersion:  string
  // Freeze metadata
  frozenAt:          number   // epoch ms — set by IN-MAIN gate
  frozenBy:          string   // userId
}

export type AtomDeclaration = {
  name:    string
  kind:    'type' | 'enum' | 'const' | 'interface'
  owner:   string   // slice name
  layer:   string   // R0
}

export type BundleScope = {
  slice:  string
  action: 'new' | 'modified' | 'deleted'
  layers: string[]   // which R-layers are touched
}

export type WireMapEntry = {
  wireType:  'W-ATOM' | 'W-EVENT' | 'W-HOOK' | 'W-INJECT'
  id:        string
  from:      string   // slice/layer
  to:        string   // slice/layer
  payload:   string   // type name
  version:   number
}

export type EventContractEntry = {
  eventName:   string
  direction:   'emits' | 'consumes'
  slice:       string
  payloadType: string
}

export type MigrationDelta = {
  tables:  TableDelta[]
  indexes: string[]   // descriptive — not executable SQL
}

export type TableDelta = {
  table:   string
  action:  'create' | 'alter' | 'drop'
  columns: string[]   // descriptive
}

// ── Stage log ─────────────────────────────────────────────────────────────────
// One entry per stage transition. Immutable once appended.
export type StageLogEntry = {
  stage:       PipelineStage
  status:      StageStatus
  startedAt:   number          // epoch ms
  completedAt: number | null   // null while running
  message:     string | null   // summary or error reason
  axiomCite:   string | null   // A1–A7 citation on failure
  retryCount:  number
}

// ── AK-RES ────────────────────────────────────────────────────────────────────
// Scoped alias — shape matches core Result<T>.
export type PlannerResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

// ── Payloads ──────────────────────────────────────────────────────────────────
export type StartPipelinePayload = {
  buildId:     string
  projectId:   string
  userId:      string
  source:      'CONTINUOUS' | 'REENTRY'
  baseBuildId: string | null
}

export type AdvanceStagePayload = {
  jobId:   PlannerJobId
  message: string | null
  // step3-executor: typed file array for IN_COMPILE execution gate.
  // Optional — absent on all stages except IN_COMPILE. Declared at R0 (A6).
  files?:  Array<{ path: string; content: string }>
}

export type FailStagePayload = {
  jobId:      PlannerJobId
  reason:     string
  axiomCite:  string | null
}

export type FreezeContractPayload = {
  jobId:      PlannerJobId
  ifContract: IfContract
}
