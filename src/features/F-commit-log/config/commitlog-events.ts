// [F-commit-log/R0/C3] Commit log event declarations — owned by this slice
export const COMMIT_LOG_EVENTS = {
  COMMIT_RECORDED:  'commit-log.commit-recorded',
  COMMIT_CONFIRMED: 'commit-log.commit-confirmed',
} as const
export type CommitLogEventType = typeof COMMIT_LOG_EVENTS[keyof typeof COMMIT_LOG_EVENTS]
