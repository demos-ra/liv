// [F-execution-panel/R0/C3] Execution event declarations — owned by this slice
export const EXECUTION_EVENTS = {
  CHECK_RUN:    'execution.check-run',
  SLICE_PASSED: 'execution.slice-passed',
  SLICE_FAILED: 'execution.slice-failed',
} as const
export type ExecutionEventType = typeof EXECUTION_EVENTS[keyof typeof EXECUTION_EVENTS]
