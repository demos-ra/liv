// [F-git-connector/R0/C3] Git event declarations — owned by this slice
export const GIT_EVENTS = {
  CONNECTED:       'git.connected',
  DISCONNECTED:    'git.disconnected',
  COMMIT_DETECTED: 'git.commit-detected',
  REPO_SYNCED:     'git.repo-synced',
} as const
export type GitEventType = typeof GIT_EVENTS[keyof typeof GIT_EVENTS]
