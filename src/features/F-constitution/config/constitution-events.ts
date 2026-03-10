// [F-constitution/R0/C3] Event declarations — owned by this slice
// R0: zero dependencies. Declares only. Never imports from F-event-system.
// F-event-system/config/event-schema.ts re-exports these. Do not import from there.

export const CONSTITUTION_EVENTS = {
  CONSTITUTION_PROPOSED: 'constitution.constitution-proposed',
  CONSTITUTION_CONFIRMED: 'constitution.constitution-confirmed',
  CONSTITUTION_UPDATED: 'constitution.constitution-updated',
  SLICE_COMPLETE: 'constitution.slice-complete',
  SLICE_BLOCKED: 'constitution.slice-blocked',
} as const

export type ConstitutionEventType = typeof CONSTITUTION_EVENTS[keyof typeof CONSTITUTION_EVENTS]
