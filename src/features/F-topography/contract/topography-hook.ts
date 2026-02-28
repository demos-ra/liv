// [F-topography/R3/C2] useTopography hook — live grid via SSE
// R3: client-side contract

'use client'

import { useEffect } from 'react'
import { useNamespace, useWriteNamespace } from '@/features/F-la-config/contract/registry-hook'
import {
  TOPOGRAPHY_NAMESPACE,
  TopographyGrid,
  CellState,
  RLayer,
} from '../config/topography-config'
import {
  sliceHealth,
  totalViolations,
  recentActivity,
  cellX,
  cellY,
  gridWidth,
  gridHeight,
} from '../domain/topography-logic'

export function useTopography(projectId: string) {
  const grid = useNamespace<TopographyGrid>(`${TOPOGRAPHY_NAMESPACE}:${projectId}`)
  const write = useWriteNamespace<TopographyGrid>(`${TOPOGRAPHY_NAMESPACE}:${projectId}`)

  // SSE live grid updates
  useEffect(() => {
    const es = new EventSource(`/api/topography/${projectId}/stream`)

    es.addEventListener('grid', (e) => {
      const incoming: TopographyGrid = JSON.parse(e.data)
      write(() => incoming)
    })

    es.onerror = () => es.close()
    return () => es.close()
  }, [projectId, write])

  return grid ?? null
}

// --- Derived selectors — consumed by renderer ---

export function useGridDimensions(projectId: string) {
  const grid = useTopography(projectId)
  if (!grid) return null
  return {
    width: gridWidth(grid.sliceOrder.length),
    height: gridHeight(),
  }
}

export function useCellLayout(projectId: string) {
  const grid = useTopography(projectId)
  if (!grid) return []

  return grid.cells.map((cell) => {
    const sliceIdx = grid.sliceOrder.indexOf(cell.featureTag)
    return {
      ...cell,
      x: cellX(sliceIdx),
      y: cellY(cell.rLayer),
    }
  })
}

export function useSliceHealthSummary(projectId: string) {
  const grid = useTopography(projectId)
  if (!grid) return {}
  return Object.fromEntries(
    grid.sliceOrder.map((tag) => [tag, sliceHealth(grid, tag)])
  )
}

export function useTotalViolations(projectId: string): number {
  const grid = useTopography(projectId)
  return grid ? totalViolations(grid) : 0
}

export function useRecentActivity(projectId: string) {
  const grid = useTopography(projectId)
  return grid ? recentActivity(grid) : []
}
