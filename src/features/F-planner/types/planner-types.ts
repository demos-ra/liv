// Sprint-12-shot-3 re-export shim — types moved to F-plan/types/pipeline-types.
// Retained for planner-logic.ts carry-forward import. Delete at Sprint B.
export type {
  PipelineStage, StageStatus, PlannerJob, IfContract, StageLogEntry,
  FileEntry, ParsedInstanceResponse, ReadSnapshot, FileAssessment,
  SliceSummary, FileDiffStatus, FileSnapshot, ScopingConstraints,
  BundleDirective, PlannerJobId, PipelineStatus, PipelineReport,
  StageReportEntry, ErrorRecord, BuildRequestPayload, StartPipelinePayload,
  AdvanceStagePayload, FailStagePayload, FreezeContractPayload,
  InstanceCallResult, PlannerResult,
} from '@/features/F-plan/types/pipeline-types'
