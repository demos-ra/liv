// [F-editor/R1/C2] Editor domain logic — tab management
// R1: pure functions, no I/O, depends R0 only

import { EditorState, EditorTab, LANG_MAP, EDITOR_DEFAULTS } from '../config/editor-config'
import { generateId } from '@/core/types/primitives'

export function detectLanguage(filePath: string): string {
  const ext = filePath.split('.').pop()?.toLowerCase() ?? ''
  return LANG_MAP[ext] ?? 'plaintext'
}

export function buildTab(filePath: string, content: string): EditorTab {
  return {
    tabId: generateId('tab'),
    filePath,
    content,
    isDirty: false,
    language: detectLanguage(filePath),
  }
}

export function buildInitialState(projectId: string): EditorState {
  return {
    projectId,
    tabs: [],
    activeTabId: null,
    ...EDITOR_DEFAULTS,
  }
}

export function openTab(state: EditorState, filePath: string, content: string): EditorState {
  const existing = state.tabs.find((t) => t.filePath === filePath)
  if (existing) return { ...state, activeTabId: existing.tabId }

  const tab = buildTab(filePath, content)
  return { ...state, tabs: [...state.tabs, tab], activeTabId: tab.tabId }
}

export function closeTab(state: EditorState, tabId: string): EditorState {
  const remaining = state.tabs.filter((t) => t.tabId !== tabId)
  const activeTabId =
    state.activeTabId === tabId
      ? (remaining[remaining.length - 1]?.tabId ?? null)
      : state.activeTabId
  return { ...state, tabs: remaining, activeTabId }
}

export function markDirty(state: EditorState, tabId: string, content: string): EditorState {
  return {
    ...state,
    tabs: state.tabs.map((t) =>
      t.tabId === tabId ? { ...t, content, isDirty: true } : t
    ),
  }
}

export function markClean(state: EditorState, tabId: string): EditorState {
  return {
    ...state,
    tabs: state.tabs.map((t) =>
      t.tabId === tabId ? { ...t, isDirty: false } : t
    ),
  }
}

export function getActiveTab(state: EditorState): EditorTab | null {
  return state.tabs.find((t) => t.tabId === state.activeTabId) ?? null
}
