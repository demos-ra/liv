// [F-editor/R3/C2] useEditor hook — client-side editor state
// R3: client-side contract, depends R0 + R1
// File I/O goes through F-git-connector agent commands, not direct DB

'use client'

import { useState, useCallback } from 'react'
import { EditorState, EditorTab } from '../config/editor-config'
import {
  buildInitialState,
  openTab,
  closeTab,
  markDirty,
  markClean,
  getActiveTab,
} from '../domain/editor-logic'

export function useEditor(projectId: string) {
  const [state, setState] = useState<EditorState>(() => buildInitialState(projectId))

  const open = useCallback((filePath: string, content: string) => {
    setState((s) => openTab(s, filePath, content))
  }, [])

  const close = useCallback((tabId: string) => {
    setState((s) => closeTab(s, tabId))
  }, [])

  const edit = useCallback((tabId: string, content: string) => {
    setState((s) => markDirty(s, tabId, content))
  }, [])

  const saved = useCallback((tabId: string) => {
    setState((s) => markClean(s, tabId))
  }, [])

  const activate = useCallback((tabId: string) => {
    setState((s) => ({ ...s, activeTabId: tabId }))
  }, [])

  return {
    tabs: state.tabs,
    activeTabId: state.activeTabId,
    activeTab: getActiveTab(state),
    fontSize: state.fontSize,
    wordWrap: state.wordWrap,
    open,
    close,
    edit,
    saved,
    activate,
    hasDirtyTabs: state.tabs.some((t) => t.isDirty),
  }
}
