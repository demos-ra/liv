// [F-topography/R2/C3] Topography workflow — grid assembly from live repo state
// R2: orchestration, depends R0 + R1 + R4

import { TopographyGrid, CellState, DependencyEdge, EventActivity } from '../config/topography-config'
import { deriveCellHealth } from '../domain/topography-logic'
import { loadGridSnapshot, persistGridSnapshot } from '../exec/topography-db'
import { emitEvent } from '@/features/F-event-system/contract/event-bus'
import { EVENTS } from '@/features/F-event-system/config/event-schema'
import { subscribeToEvent } from '@/features/F-event-system/contract/event-bus'

// --- Build grid from health + execution check results ---

export async function rebuildGrid(
  projectId: string,
  healthResults: Array<{ featureTag: string; rLayer: number; violations: string[]; fileCount: number }>,
  edges: DependencyEdge[],
  sliceOrder: string[]
): Promise<TopographyGrid> {
  const cells: CellState[] = healthResults.map((r) => ({
    featureTag: r.featureTag,
    rLayer: r.rLayer as TopographyGrid['cells'][number]['rLayer'],
    health: deriveCellHealth(r.violations, r.fileCount),
    fileCount: r.fileCount,
    hasViolations: r.violations.length > 0,
    violations: r.violations,
  }))

  const grid: TopographyGrid = {
    projectId,
    cells,
    edges,
    activity: [],
    sliceOrder,
    lastUpdatedAt: Date.now(),
  }

  await persistGridSnapshot(grid)

  await emitEvent({
    type: EVENTS.TOPOGRAPHY.UPDATED,
    payload: {
      projectId,
      totalViolations: cells.reduce((n, c) => n + c.violations.length, 0),
    },
  })

  return grid
}

// --- Load current grid (used by R3 and SSE push) ---

export async function loadGrid(projectId: string): Promise<TopographyGrid | null> {
  return loadGridSnapshot(projectId)
}

// --- Record event activity on grid (T axis) ---

export async function recordActivity(
  projectId: string,
  featureTag: string,
  rLayer: number,
  eventType: string
): Promise<void> {
  const grid = await loadGridSnapshot(projectId)
  if (!grid) return

  const activity: EventActivity = {
    featureTag,
    rLayer: rLayer as EventActivity['rLayer'],
    eventType,
    timestamp: Date.now(),
  }

  // Keep last 50 activity entries
  const trimmed = [activity, ...grid.activity].slice(0, 50)
  const updated: TopographyGrid = { ...grid, activity: trimmed, lastUpdatedAt: Date.now() }

  await persistGridSnapshot(updated)
}

// --- Subscribe to events that should pulse the T axis ---

export function registerTopographySubscriptions() {
  const pulse = (featureTag: string, rLayer: number, eventType: string, projectId: string) =>
    recordActivity(projectId, featureTag, rLayer, eventType)

  subscribeToEvent(EVENTS.CHAT.MESSAGE_STREAMING, (e) =>
    pulse('F-chat', 2, 'streaming', e.payload.projectId)
  )
  subscribeToEvent(EVENTS.COMMIT_LOG.COMMIT_CONFIRMED, (e) =>
    pulse(e.payload.featureTag, 3, 'commit', e.payload.projectId)
  )
  subscribeToEvent(EVENTS.CONSTITUTION.SLICE_COMPLETE, (e) =>
    pulse(e.payload.featureTag, 4, 'complete', e.payload.projectId)
  )
  subscribeToEvent(EVENTS.CONSTITUTION.SLICE_BLOCKED, (e) =>
    pulse(e.payload.featureTag, 3, 'blocked', e.payload.projectId)
  )
}
