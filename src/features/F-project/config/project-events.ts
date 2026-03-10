// [F-project/R0/C3] Event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const PROJECT_EVENTS = {
  PROJECT_CREATED: 'project.project-created',
  PROJECT_OPENED: 'project.project-opened',
  PROJECT_UPDATED: 'project.project-updated',
  PROJECT_ARCHIVED: 'project.project-archived',
  REPO_CONNECTED: 'project.repo-connected',
} as const

export type ProjectEventType = typeof PROJECT_EVENTS[keyof typeof PROJECT_EVENTS]
