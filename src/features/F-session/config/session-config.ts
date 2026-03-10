// [F-session/config/session-config.ts]
// R0 — backwards-compat shim. SESSION_CONFIG lives in core/types/session.ts (R5).
// Do not add declarations here.

export {
  SESSION_CONFIG,
  SESSION_NAMESPACE,
} from '@/core/types/session'

export type {
  SessionStatus,
  SessionPayload,
  RefreshPayload,
} from '@/core/types/session'
