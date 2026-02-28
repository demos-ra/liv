// [F-event-system/R0/C3] Event schema — all declared events
// R0: zero dependencies.
// CANONICAL LAW: All event names live here. No slice may declare local event name strings.
// Import EVENTS from this file. If your slice needs a new event, declare it here first.
// Violations are blocking at commit time.

export const EVENTS = {
  // F-identity
  IDENTITY: {
    USER_SIGNED_IN:     'identity.user-signed-in',
    USER_SIGNED_OUT:    'identity.user-signed-out',
    AUTH_FAILED:        'identity.auth-failed',
    TOKEN_REFRESHED:    'identity.token-refreshed',
    USER_REGISTERED:    'identity.user-registered',
  },

  // F-session
  SESSION: {
    SESSION_CREATED:    'session.session-created',
    SESSION_EXPIRED:    'session.session-expired',
    SESSION_REFRESHED:  'session.session-refreshed',
  },

  // F-permissions
  PERMISSIONS: {
    PERMISSIONS_LOADED: 'permissions.permissions-loaded',
    ACCESS_DENIED:      'permissions.access-denied',
  },

  // F-project
  PROJECT: {
    PROJECT_CREATED:    'project.project-created',
    PROJECT_OPENED:     'project.project-opened',
    PROJECT_UPDATED:    'project.project-updated',
    PROJECT_ARCHIVED:   'project.project-archived',
    REPO_CONNECTED:     'project.repo-connected',
  },

  // F-constitution
  CONSTITUTION: {
    CONSTITUTION_PROPOSED:  'constitution.constitution-proposed',
    CONSTITUTION_CONFIRMED: 'constitution.constitution-confirmed',
    CONSTITUTION_UPDATED:   'constitution.constitution-updated',
    SLICE_COMPLETE:         'constitution.slice-complete',
    SLICE_BLOCKED:          'constitution.slice-blocked',
  },

  // F-git-connector
  GIT: {
    CONNECTED:          'git.connected',
    DISCONNECTED:       'git.disconnected',
    COMMIT_DETECTED:    'git.commit-detected',
    REPO_SYNCED:        'git.repo-synced',
  },

  // F-terminal-bridge
  TERMINAL: {
    COMMAND_SENT:       'terminal.command-sent',
    OUTPUT_RECEIVED:    'terminal.output-received',
    BRIDGE_ERROR:       'terminal.bridge-error',
    CONNECTED:          'terminal.connected',
    STUBBED:            'terminal.stubbed',
  },

  // F-ai-adapter
  AI: {
    MESSAGE_SENT:       'ai.message-sent',
    MESSAGE_RECEIVED:   'ai.message-received',
    STREAM_STARTED:     'ai.stream-started',
    STREAM_ENDED:       'ai.stream-ended',
    STREAM_ERROR:       'ai.stream-error',
    ERROR:              'ai.error',
  },

  // F-chat
  CHAT: {
    MESSAGE_ADDED:      'chat.message-added',
    MESSAGE_SENT:       'chat.message-sent',
    MESSAGE_STREAMING:  'chat.message-streaming',
    MESSAGE_COMPLETE:   'chat.message-complete',
    MESSAGE_ERROR:      'chat.message-error',
    HISTORY_CLEARED:    'chat.history-cleared',
  },

  // F-topography
  TOPOGRAPHY: {
    SNAPSHOT_TAKEN:     'topography.snapshot-taken',
    CELL_UPDATED:       'topography.cell-updated',
    UPDATED:            'topography.updated',
  },

  // F-commit-log
  COMMIT_LOG: {
    COMMIT_RECORDED:    'commit-log.commit-recorded',
    COMMIT_CONFIRMED:   'commit-log.commit-confirmed',
  },

  // F-health-panel
  HEALTH: {
    CHECK_RUN:          'health.check-run',
    VIOLATION_FOUND:    'health.violation-found',
  },

  // F-execution-panel
  EXECUTION: {
    CHECK_RUN:          'execution.check-run',
    SLICE_PASSED:       'execution.slice-passed',
    SLICE_FAILED:       'execution.slice-failed',
  },

  // F-notifications
  NOTIFICATIONS: {
    NOTIFY:             'notifications.notify',
    DISMISS:            'notifications.dismiss',
    CREATED:            'notifications.created',
  },

  // F-memory
  MEMORY: {
    NODE_WRITTEN:     'memory.node-written',
    CONCEPT_PROMOTED: 'memory.concept-promoted',
    SESSION_STARTED:  'memory.session-started',
    SESSION_ENDED:    'memory.session-ended',
    RECALL_FIRED:     'memory.recall-fired',
  },
} as const

// ─── Flat event name type ─────────────────────────────────────────────────────
type EventNameValues<T> = T extends Record<string, string>
  ? T[keyof T]
  : T extends Record<string, Record<string, string>>
  ? { [K in keyof T]: EventNameValues<T[K]> }[keyof T]
  : never

export type EventName = EventNameValues<typeof EVENTS>

// ─── All declared event names (flat set for validation) ───────────────────────
function flattenEvents(obj: Record<string, unknown>): string[] {
  return Object.values(obj).flatMap((v) =>
    typeof v === 'string' ? [v] : flattenEvents(v as Record<string, unknown>)
  )
}

export const ALL_EVENT_NAMES = new Set(flattenEvents(EVENTS as unknown as Record<string, unknown>))

// ─── SystemEvent (base interface) ────────────────────────────────────────────

export interface SystemEvent {
  type: string
  payload: Record<string, unknown>
}
