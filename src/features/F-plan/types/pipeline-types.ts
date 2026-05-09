// @liv-standard v1.5.1
// [F-plan/types/pipeline-types.ts]
// Built with LIV · livai.dev

// @manifest
// standard:   LIV-Standard v1.5.1
// amended:    sprint-12-shot-3 (NEW — moved from F-planner/types/planner-types — dissolution)
// slice:      F-plan
// layer:      R0
// wires-in:
//   W-ATOM  CanonicalIfContract  @/core/constants/liv-standard.types
//   W-ATOM  AtomDecl             @/core/constants/liv-standard.types
//   W-ATOM  WireEntry            @/core/constants/liv-standard.types
//   W-ATOM  EventContract        @/core/constants/liv-standard.types
//   W-ATOM  MigrationDelta       @/core/constants/liv-standard.types
//   W-ATOM  FlowId               @/core/constants/liv-standard.types
//   W-ATOM  InstanceId           @/core/constants/liv-standard.types
// wires-out:
//   W-ATOM  PipelineStage          →  F-plan/R2, F-plan/R3, F-builder/R2, F-builder/R4
//   W-ATOM  StageStatus            →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  PipelineStatus         →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  PlannerJob             →  F-plan/R2, F-plan/R3, F-builder/R2, F-builder/R4
//   W-ATOM  IfContract             →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  StageLogEntry          →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  PlannerResult          →  F-plan/R2, F-plan/R3, F-builder/R2, F-builder/R4
//   W-ATOM  PlannerJobId           →  F-plan/R2, F-plan/R3, F-builder/R2, F-builder/R4, src/app/api/planner
//   W-ATOM  PipelineReport         →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  StageReportEntry       →  F-plan/R2, F-builder/R2, F-builder/R4
//   W-ATOM  BuildRequestPayload    →  F-plan/R3, src/app/api/chat
//   W-ATOM  FileEntry              →  F-builder/R2, F-builder/R4
//   W-ATOM  ParsedInstanceResponse →  F-builder/R2
//   W-ATOM  InstanceCallResult     →  F-builder/R2
//   W-ATOM  ErrorRecord            →  F-builder/R2
// deps:
//   R0  @/core/constants/liv-standard.types  (canonical IF contract types — A1)
// validated:  pending
//
// sprint-12-shot-3: Types moved verbatim from F-planner/types/planner-types.ts
//   as part of F-planner dissolution. F-plan owns planning-domain types (contract
//   negotiation, pipeline state, job tracking). F-builder owns execution types.
//   Axiom cite: A1 — single owner per type. A6 — declared at R0 of owner.

import type {
  IfContract as CanonicalIfContract,
} from '@/core/constants/liv-standard.types'

// ── AK-REF ────────────────────────────────────────────────────────────────────
export type PlannerJobId = string & { _brand: 'PlannerJobId' }

// ── AK-ENUM ───────────────────────────────────────────────────────────────────
export type PipelineStage =
  | 'IN_MAIN'
  | 'IN_BUILD'
  | 'IN_RESOLVE'
  | 'IN_AUDIT'
  | 'IN_COMPILE'
  | 'IN_QA'

export type StageStatus =
  | 'pending'
  | 'running'
  | 'complete'
  | 'failed'
  | 'skipped'

export type PipelineStatus =
  | 'pending'
  | 'confirmed'
  | 'running'
  | 'complete'
  | 'failed'
  | 'cancelled'
  | 'escalated'

// ── IF Contract — canonical extension ─────────────────────────────────────────
// CanonicalIfContract: from liv-standard.types.ts (R5). Single source of truth
// for all IF contract field names and sub-type shapes (A1).
// Extension fields: frozenAt + frozenBy are pipeline gate metadata —
// set when IN-MAIN confirms and freezes the contract. Not part of the standard.
// liv-api.ts functions ignore these extension fields (structural typing).
export type IfContract = CanonicalIfContract & {
  frozenAt: number   // epoch ms — set by IN-MAIN gate on confirmation
  frozenBy: string   // userId
}

// ── AK-ENT ────────────────────────────────────────────────────────────────────
export type PlannerJob = {
  jobId:           PlannerJobId
  projectId:       string
  userId:          string
  pipelineStatus:  PipelineStatus
  currentStage:    PipelineStage | null
  stageStatus:     StageStatus
  ifContract:      IfContract | null
  pipelineLog:     StageLogEntry[]
  source:          'CONTINUOUS' | 'REENTRY'
  transitionCount: number
  pipelineReport:  PipelineReport | null
  reentryCount:    number
  createdAt:       number
  updatedAt:       number
}

// ── Stage log ─────────────────────────────────────────────────────────────────
export type StageLogEntry = {
  stage:       PipelineStage
  status:      StageStatus
  startedAt:   number
  completedAt: number | null
  message:     string | null
  axiomCite:   string | null
  retryCount:  number
}

// ── AK-SUM — Error record ─────────────────────────────────────────────────────
export type ErrorRecord = {
  class:      1 | 2 | 3
  message:    string
  resolution: 'retried' | 'reentry' | 'escalated' | 'fixed'
}

// ── AK-ENT — Pipeline report ──────────────────────────────────────────────────
export type PipelineReport = {
  buildId:          string
  userId:           string
  stages:           StageReportEntry[]
  totalTransitions: number
  reentries:        number
  outcome:          'complete' | 'failed' | 'escalated' | null
  failureReason?:   string
  startedAt:        number
  completedAt?:     number
}

export type StageReportEntry = {
  instanceId:   PipelineStage
  model:        string
  startedAt:    number
  completedAt:  number
  tokenCount:   number
  handoffValid: boolean
  retries:      number
  errors:       ErrorRecord[]
  error?:       { message: string }
  // ── Phase 4.2 instrumentation (optional — existing reports valid without) ──
  tierIndex?:   number    // which dependency tier this bundle was assigned to (0, 1, 2...)
  decomposed?:  boolean   // true if stress check triggered R-layer decomposition
  layerPasses?: number    // count of individual R-layer IN-BUILD calls if decomposed (1-5)
}

// ── AK-ENT — File atom ────────────────────────────────────────────────────────
export type FileEntry = {
  path:     string
  content:  string
  encoding: 'utf8' | 'base64'
}

// ── AK-RES — Parsed instance response ────────────────────────────────────────
export type ParsedInstanceResponse = {
  files:     FileEntry[]
  report?:   string
  errorLog?: string
  raw:       string
}

// ── AK-SUM — Instance call result ────────────────────────────────────────────
export type InstanceCallResult = {
  instanceId:   PipelineStage
  model:        string
  response:     ParsedInstanceResponse
  tokenCount:   number
  durationMs:   number
  handoffValid: boolean
  startedAt:    number
  completedAt:  number
}

// ── AK-RES ────────────────────────────────────────────────────────────────────
export type PlannerResult<T> =
  | { ok: true;  data: T }
  | { ok: false; error: { code: string; message: string; context?: Record<string, unknown> } }

// ── AK-PAY — Payloads ─────────────────────────────────────────────────────────
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

export type BuildRequestPayload = {
  projectId: string
  userId:    string
  message:   string
  modelId:   string
}

// ── Read phase types (phase-4.3) ──────────────────────────────────────────────

export type FileDiffStatus =
  | 'untouched'
  | 'modified-compliant'
  | 'modified-non-compliant'
  | 'new-foreign'
  | 'deleted'

export type FileSnapshot = {
  path:    string
  content: string
}

export type FileAssessment = FileSnapshot & {
  slice:      string
  layer:      string | null
  compliant:  boolean
  issues:     string[]
  diffStatus: FileDiffStatus
}

export type SliceSummary = {
  name:       string
  fileCount:  number
  compliant:  boolean
  files:      FileAssessment[]
}

export type ReadSnapshot = {
  slices:       SliceSummary[]
  foreignFiles: { path: string }[]
  metadata: {
    scannedAt:      number
    totalFiles:     number
    compliantFiles: number
    foreignFiles:   number
    driftedFiles:   number
  }
}

// ── Snapshot scoping types (phase-4.4) ───────────────────────────────────────

export type BundleDirective = {
  name:   string
  action: 'skip' | 'rebuild' | 'delta'
  reason: string
}

export type ScopingConstraints = {
  directives:      BundleDirective[]
  foreignDetected: boolean
  driftedSlices:   string[]
  summary:         string
}

// ─── End ──────────────────────────────────────────────────────────────────────
