// [F-topography/R0/C2] Topography configuration and types
// R0: pure config, zero dependencies

export const TOPOGRAPHY_CONFIG = {
  rLayerCount: 5,           // R0–R4
  cellSize: 48,             // px per grid cell
  cellGap: 4,               // px between cells
  updateDebounceMs: 150,    // debounce live grid updates
} as const

export const TOPOGRAPHY_NAMESPACE = 'topography' as const

export type RLayer = 0 | 1 | 2 | 3 | 4

export type CellHealth = 'ok' | 'warning' | 'error' | 'empty' | 'building'

export type CellState = {
  featureTag: string    // F-{name}
  rLayer: RLayer
  health: CellHealth
  fileCount: number
  hasViolations: boolean
  violations: string[]  // short violation messages
}

export type DependencyEdge = {
  fromTag: string
  fromLayer: RLayer
  toTag: string
  toLayer: RLayer
}

export type EventActivity = {
  featureTag: string
  rLayer: RLayer
  eventType: string
  timestamp: number
}

export type TopographyGrid = {
  projectId: string
  cells: CellState[]                // all populated cells
  edges: DependencyEdge[]           // Z axis — dependency connections
  activity: EventActivity[]         // T axis — recent event activity
  sliceOrder: string[]              // X axis order (featureTags, left→right)
  lastUpdatedAt: number
}
