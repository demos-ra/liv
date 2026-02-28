// [F-workspace/R2/C2] Workspace workflow — layout persistence
// R2: orchestration, depends R0 + R1 + R4

import { WorkspaceLayout, PanelId } from '../config/workspace-config'
import {
  buildLayout,
  setActivePanel,
  togglePanel,
  resizePanel,
  toggleSidebar,
} from '../domain/workspace-logic'
import { loadLayout, saveLayout } from '../exec/workspace-db'

export async function getOrCreateLayout(userId: string, projectId: string): Promise<WorkspaceLayout> {
  const existing = await loadLayout(userId, projectId)
  if (existing) return existing

  const fresh = buildLayout(projectId)
  await saveLayout(userId, fresh)
  return fresh
}

export async function activatePanel(userId: string, projectId: string, panelId: PanelId): Promise<void> {
  const layout = await getOrCreateLayout(userId, projectId)
  await saveLayout(userId, setActivePanel(layout, panelId))
}

export async function togglePanelVisibility(userId: string, projectId: string, panelId: PanelId): Promise<void> {
  const layout = await getOrCreateLayout(userId, projectId)
  await saveLayout(userId, togglePanel(layout, panelId))
}

export async function resizePanelSize(userId: string, projectId: string, panelId: PanelId, sizePct: number): Promise<void> {
  const layout = await getOrCreateLayout(userId, projectId)
  await saveLayout(userId, resizePanel(layout, panelId, sizePct))
}

export async function toggleSidebarState(userId: string, projectId: string): Promise<void> {
  const layout = await getOrCreateLayout(userId, projectId)
  await saveLayout(userId, toggleSidebar(layout))
}
