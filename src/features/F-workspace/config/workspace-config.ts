// [F-workspace/R0/C2] Workspace configuration and types
// R0: pure config, zero dependencies

export const WORKSPACE_CONFIG = {
  panels: {
    topography: { defaultHeightPct: 30, minHeightPx: 120 },
    editor:     { defaultHeightPct: 40, minHeightPx: 200 },
    chat:       { defaultWidthPct: 35,  minWidthPx: 280 },
  },
  sidebarWidthPx: 240,
} as const

export const WORKSPACE_NAMESPACE = 'workspace' as const

export type PanelId = 'topography' | 'editor' | 'chat' | 'health' | 'execution'

export type PanelState = {
  panelId: PanelId
  visible: boolean
  sizePct: number       // percentage of available space
}

export type WorkspaceLayout = {
  projectId: string
  panels: PanelState[]
  activePanel: PanelId
  sidebarOpen: boolean
}

export const DEFAULT_LAYOUT: Omit<WorkspaceLayout, 'projectId'> = {
  panels: [
    { panelId: 'topography', visible: true,  sizePct: 30 },
    { panelId: 'editor',     visible: true,  sizePct: 40 },
    { panelId: 'chat',       visible: true,  sizePct: 35 },
    { panelId: 'health',     visible: false, sizePct: 20 },
    { panelId: 'execution',  visible: false, sizePct: 20 },
  ],
  activePanel: 'editor',
  sidebarOpen: true,
}
