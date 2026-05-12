// @liv-standard v1.3
// [F-permissions/R0]
// Built with LIV · livai.dev
// @manifest
// standard:   LIV-Standard v1.3
// amended:    none
// slice:      F-permissions
// category:   Tool
// layer:      R0
// wires-in:   none (R0 — pure declarations)
// wires-out:
//   W-ATOM  PERMISSIONS_EVENTS  →  F-event-system/R0 (event-schema re-export)
// deps:      none
// validated: pending
// [F-permissions/R0/C3] Permissions event declarations — owned by this slice
export const PERMISSIONS_EVENTS = {
  PERMISSIONS_LOADED: 'permissions.permissions-loaded',
  ACCESS_DENIED:      'permissions.access-denied',
} as const
export type PermissionsEventType = typeof PERMISSIONS_EVENTS[keyof typeof PERMISSIONS_EVENTS]
