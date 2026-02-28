// [F-workspace/R1/C2] Workspace domain logic — layout computation
// R1: pure functions, no I/O, depends R0 only

import { WorkspaceLayout, PanelId, PanelState, DEFAULT_LAYOUT } from '../config/workspace-config'

export function buildLayout(projectId: string): WorkspaceLayout {
  return { projectId, ...DEFAULT_LAYOUT, panels: DEFAULT_LAYOUT.panels.map((p) => ({ ...p })) }
}

export function setActivePanel(layout: WorkspaceLayout, panelId: PanelId): WorkspaceLayout {
  return { ...layout, activePanel: panelId }
}

export function togglePanel(layout: WorkspaceLayout, panelId: PanelId): WorkspaceLayout {
  return {
    ...layout,
    panels: layout.panels.map((p) =>
      p.panelId === panelId ? { ...p, visible: !p.visible } : p
    ),
  }
}

export function resizePanel(layout: WorkspaceLayout, panelId: PanelId, sizePct: number): WorkspaceLayout {
  const clamped = Math.min(Math.max(sizePct, 10), 90)
  return {
    ...layout,
    panels: layout.panels.map((p) =>
      p.panelId === panelId ? { ...p, sizePct: clamped } : p
    ),
  }
}

export function toggleSidebar(layout: WorkspaceLayout): WorkspaceLayout {
  return { ...layout, sidebarOpen: !layout.sidebarOpen }
}

export function getPanel(layout: WorkspaceLayout, panelId: PanelId): PanelState | null {
  return layout.panels.find((p) => p.panelId === panelId) ?? null
}

export function visiblePanels(layout: WorkspaceLayout): PanelState[] {
  return layout.panels.filter((p) => p.visible)
}
