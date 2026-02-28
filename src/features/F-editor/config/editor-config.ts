// [F-editor/R0/C2] Editor configuration and types
// R0: pure config, zero dependencies

export const EDITOR_NAMESPACE = 'editor' as const

export type EditorTab = {
  tabId: string
  filePath: string
  content: string
  isDirty: boolean
  language: string
}

export type EditorState = {
  projectId: string
  tabs: EditorTab[]
  activeTabId: string | null
  fontSize: number
  wordWrap: boolean
}

export const EDITOR_DEFAULTS = {
  fontSize: 14,
  wordWrap: false,
  tabSize: 2,
} as const

// Language detection from file extension
export const LANG_MAP: Record<string, string> = {
  ts: 'typescript', tsx: 'typescript',
  js: 'javascript', jsx: 'javascript',
  json: 'json',
  md: 'markdown',
  sql: 'sql',
  py: 'python',
  sh: 'shell',
  css: 'css',
  html: 'html',
}
