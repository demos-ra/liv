// [F-topography/R0/C3] Topography event declarations — owned by this slice
export const TOPOGRAPHY_EVENTS = {
  SNAPSHOT_TAKEN: 'topography.snapshot-taken',
  CELL_UPDATED:   'topography.cell-updated',
  UPDATED:        'topography.updated',
} as const
export type TopographyEventType = typeof TOPOGRAPHY_EVENTS[keyof typeof TOPOGRAPHY_EVENTS]
