// @liv-standard v1.3
// [F-permissions/R0]
// Built with LIV · livai.dev
// [F-permissions/R0/C3] Permissions event declarations — owned by this slice
export const PERMISSIONS_EVENTS = {
  PERMISSIONS_LOADED: 'permissions.permissions-loaded',
  ACCESS_DENIED:      'permissions.access-denied',
} as const
export type PermissionsEventType = typeof PERMISSIONS_EVENTS[keyof typeof PERMISSIONS_EVENTS]
