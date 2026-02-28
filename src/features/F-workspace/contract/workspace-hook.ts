// [F-workspace/R3/C2] useWorkspace hook
// R3: client-side contract

'use client'

import { useCallback } from 'react'
import { useNamespace, useWriteNamespace } from '@/features/F-la-config/contract/registry-hook'
import { WORKSPACE_NAMESPACE, WorkspaceLayout, PanelId } from '../config/workspace-config'
import { visiblePanels, getPanel } from '../domain/workspace-logic'

export function useWorkspace(projectId: string) {
  const layout = useNamespace<WorkspaceLayout>(`${WORKSPACE_NAMESPACE}:${projectId}`)
  const write = useWriteNamespace<WorkspaceLayout>(`${WORKSPACE_NAMESPACE}:${projectId}`)

  const mutate = useCallback(
    async (action: string, extra?: Record<string, unknown>) => {
      await fetch(`/api/workspace/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ...extra }),
      })
    },
    [projectId]
  )

  return {
    layout: layout ?? null,
    visiblePanels: layout ? visiblePanels(layout) : [],
    sidebarOpen: layout?.sidebarOpen ?? true,
    activePanel: layout?.activePanel ?? 'editor',
    activatePanel:  (panelId: PanelId) => mutate('activate', { panelId }),
    togglePanel:    (panelId: PanelId) => mutate('toggle', { panelId }),
    resizePanel:    (panelId: PanelId, sizePct: number) => mutate('resize', { panelId, sizePct }),
    toggleSidebar:  () => mutate('toggle_sidebar'),
  }
}

export function usePanelVisible(projectId: string, panelId: PanelId): boolean {
  const layout = useNamespace<WorkspaceLayout>(`${WORKSPACE_NAMESPACE}:${projectId}`)
  return getPanel(layout ?? { projectId, panels: [], activePanel: 'editor', sidebarOpen: true }, panelId)?.visible ?? false
}
