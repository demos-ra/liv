// [F-health-panel/R0/C3] Health event declarations — owned by this slice
export const HEALTH_EVENTS = {
  CHECK_RUN:       'health.check-run',
  VIOLATION_FOUND: 'health.violation-found',
} as const
export type HealthEventType = typeof HEALTH_EVENTS[keyof typeof HEALTH_EVENTS]
