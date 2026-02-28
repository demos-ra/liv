// [F-topography/R1/C2] Topography domain logic — grid computation
// R1: pure functions, no I/O, depends R0 only

import {
  TopographyGrid,
  CellState,
  CellHealth,
  DependencyEdge,
  RLayer,
  TOPOGRAPHY_CONFIG,
} from '../config/topography-config'

// --- Cell health derivation ---

export function deriveCellHealth(violations: string[], fileCount: number): CellHealth {
  if (fileCount === 0) return 'empty'
  if (violations.some((v) => v.startsWith('ERROR'))) return 'error'
  if (violations.length > 0) return 'warning'
  return 'ok'
}

// --- Grid position helpers ---

export function cellKey(featureTag: string, rLayer: RLayer): string {
  return `${featureTag}:R${rLayer}`
}

export function getCellAt(grid: TopographyGrid, featureTag: string, rLayer: RLayer): CellState | null {
  return grid.cells.find((c) => c.featureTag === featureTag && c.rLayer === rLayer) ?? null
}

// --- Column (slice) health summary ---

export function sliceHealth(grid: TopographyGrid, featureTag: string): CellHealth {
  const cells = grid.cells.filter((c) => c.featureTag === featureTag)
  if (cells.length === 0) return 'empty'
  if (cells.some((c) => c.health === 'error')) return 'error'
  if (cells.some((c) => c.health === 'warning')) return 'warning'
  if (cells.some((c) => c.health === 'building')) return 'building'
  return 'ok'
}

// --- Violation count across full grid ---

export function totalViolations(grid: TopographyGrid): number {
  return grid.cells.reduce((sum, c) => sum + c.violations.length, 0)
}

export function violationsBySlice(grid: TopographyGrid): Record<string, number> {
  return grid.cells.reduce((acc, c) => {
    acc[c.featureTag] = (acc[c.featureTag] ?? 0) + c.violations.length
    return acc
  }, {} as Record<string, number>)
}

// --- Activity filtering (T axis) ---

export function recentActivity(grid: TopographyGrid, windowMs = 5000): TopographyGrid['activity'] {
  const cutoff = Date.now() - windowMs
  return grid.activity.filter((a) => a.timestamp > cutoff)
}

// --- Edge helpers (Z axis) ---

export function edgesForSlice(grid: TopographyGrid, featureTag: string): DependencyEdge[] {
  return grid.edges.filter((e) => e.fromTag === featureTag || e.toTag === featureTag)
}

// --- Grid pixel dimensions ---

export function gridWidth(sliceCount: number): number {
  return sliceCount * (TOPOGRAPHY_CONFIG.cellSize + TOPOGRAPHY_CONFIG.cellGap)
}

export function gridHeight(): number {
  return TOPOGRAPHY_CONFIG.rLayerCount * (TOPOGRAPHY_CONFIG.cellSize + TOPOGRAPHY_CONFIG.cellGap)
}

export function cellX(sliceIndex: number): number {
  return sliceIndex * (TOPOGRAPHY_CONFIG.cellSize + TOPOGRAPHY_CONFIG.cellGap)
}

export function cellY(rLayer: RLayer): number {
  // R0 at bottom — invert Y
  const invertedLayer = (TOPOGRAPHY_CONFIG.rLayerCount - 1) - rLayer
  return invertedLayer * (TOPOGRAPHY_CONFIG.cellSize + TOPOGRAPHY_CONFIG.cellGap)
}
